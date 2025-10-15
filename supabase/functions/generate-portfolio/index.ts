import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log('📥 Incoming request body:', JSON.stringify(body, null, 2));
    
    const { portfolioId, prompt, templateId, language = 'en', images = [] } = body;
    
    // Defensive checks
    if (!portfolioId) {
      console.error('❌ Missing portfolioId');
      return new Response(
        JSON.stringify({ error: 'portfolioId is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('❌ Missing Authorization header');
      return new Response(
        JSON.stringify({ error: 'Unauthorized - missing auth header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('🔐 Creating Supabase client with auth header');
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get user data for context
    console.log('👤 Fetching user data...');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError) {
      console.error('❌ Auth error:', userError);
      return new Response(
        JSON.stringify({ error: 'Authentication failed', details: userError.message }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    if (!user) {
      console.error('❌ No user found');
      return new Response(
        JSON.stringify({ error: 'Unauthorized - no user found' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    console.log('✅ User authenticated:', user.id);

    console.log('📊 Fetching user profile and projects...');
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    const { data: projects } = await supabaseClient
      .from('projects')
      .select('title, description, category')
      .eq('user_id', user.id)
      .limit(5);
    
    console.log('📝 Profile:', profile ? 'found' : 'not found');
    console.log('📁 Projects:', projects?.length || 0);

    // Build AI prompt based on template and user data
    const templateContext = getTemplateContext(templateId);
    const systemPrompt = `You are a professional portfolio generator. Create compelling portfolio content in ${language === 'es' ? 'Spanish' : 'English'}.
    
Template style: ${templateContext.style}
User background: ${profile?.bio || 'Professional'}
Recent projects: ${projects?.map(p => `${p.title} - ${p.description}`).join(', ') || 'None yet'}

Generate 4-6 portfolio sections with titles and rich content. Return ONLY valid JSON in this exact format:
{
  "sections": [
    {
      "section_type": "hero|about|skills|projects|experience|education|contact",
      "title": "Section Title",
      "content": "Rich markdown content with details, bullet points if needed"
    }
  ]
}`;

    const userPrompt = prompt || `Create a ${templateContext.name} portfolio showcasing my work and skills.`;
    console.log('💬 User prompt:', userPrompt);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('❌ LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('🤖 Calling AI with model: google/gemini-2.5-flash');
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ AI API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'AI service rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI service credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: `AI generation failed: ${response.status}`, details: errorText }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await response.json();
    console.log('🎯 AI response received');
    const content = aiData.choices[0].message.content;
    console.log('📄 AI content (first 200 chars):', content.substring(0, 200));
    
    // Parse JSON from AI response
    console.log('🔍 Parsing AI response...');
    let sections;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('❌ No JSON found in AI response');
        throw new Error('No JSON found in response');
      }
      const parsed = JSON.parse(jsonMatch[0]);
      sections = parsed.sections;
      
      if (!Array.isArray(sections)) {
        console.error('❌ Sections is not an array:', sections);
        throw new Error('Invalid sections format');
      }
      
      console.log('✅ Parsed sections:', sections.length);
    } catch (e) {
      console.error('❌ Failed to parse AI response:', e.message);
      console.error('Response content:', content);
      return new Response(
        JSON.stringify({ error: 'Invalid AI response format', details: e.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Save sections to database, incorporating uploaded images if available
    console.log('💾 Preparing to save sections to database...');
    const sectionsToInsert = sections.map((section: any, index: number) => ({
      portfolio_id: portfolioId,
      section_type: section.section_type || 'about',
      title: section.title,
      content: section.content,
      image_url: images[index] || section.image_url || null,
      order_index: index,
      metadata: {}
    }));

    console.log('📝 Inserting sections:', sectionsToInsert.length);
    const { error: insertError } = await supabaseClient
      .from('portfolio_sections')
      .insert(sectionsToInsert);

    if (insertError) {
      console.error('❌ Error inserting sections:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to save portfolio sections', details: insertError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ Portfolio generation successful!');
    return new Response(
      JSON.stringify({ success: true, sections: sectionsToInsert }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Error in generate-portfolio:', error);
    console.error('Stack trace:', error.stack);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Unknown error occurred',
        details: error.stack || 'No stack trace available'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function getTemplateContext(templateId: string | null) {
  const templates: Record<string, { name: string; style: string }> = {
    'creative-portfolio': {
      name: 'Creative Portfolio',
      style: 'Artistic, visual-focused, emphasizing design projects and creative work'
    },
    'developer-showcase': {
      name: 'Developer Showcase',
      style: 'Technical, code-focused, highlighting programming projects and technical skills'
    },
    'minimal-portfolio': {
      name: 'Minimal Portfolio',
      style: 'Clean, professional, concise presentation with focus on achievements'
    },
    'ai-gallery': {
      name: 'AI Gallery',
      style: 'Modern, AI-focused, showcasing artificial intelligence and machine learning projects'
    }
  };

  return templates[templateId || 'minimal-portfolio'] || templates['minimal-portfolio'];
}
