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
    const { portfolioId, prompt, templateId, language = 'en' } = await req.json();
    
    const authHeader = req.headers.get('Authorization')!;
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get user data for context
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error('Unauthorized');

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

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

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
      console.error('AI API error:', response.status, errorText);
      throw new Error(`AI generation failed: ${response.status}`);
    }

    const aiData = await response.json();
    const content = aiData.choices[0].message.content;
    
    // Parse JSON from AI response
    let sections;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON found in response');
      const parsed = JSON.parse(jsonMatch[0]);
      sections = parsed.sections;
    } catch (e) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Invalid AI response format');
    }

    // Save sections to database
    const sectionsToInsert = sections.map((section: any, index: number) => ({
      portfolio_id: portfolioId,
      section_type: section.section_type || 'about',
      title: section.title,
      content: section.content,
      order_index: index,
      metadata: {}
    }));

    const { error: insertError } = await supabaseClient
      .from('portfolio_sections')
      .insert(sectionsToInsert);

    if (insertError) {
      console.error('Error inserting sections:', insertError);
      throw insertError;
    }

    return new Response(
      JSON.stringify({ success: true, sections: sectionsToInsert }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-portfolio:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
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
