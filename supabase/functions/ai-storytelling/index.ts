import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting map (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const checkRateLimit = (userId: string): boolean => {
  const now = Date.now();
  const userLimit = rateLimitMap.get(userId);
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(userId, { count: 1, resetTime: now + 60000 }); // 1 minute window
    return true;
  }
  
  if (userLimit.count >= 10) {
    return false; // 10 requests per minute limit
  }
  
  userLimit.count++;
  return true;
};

const sanitizeInput = (input: string): string => {
  // Remove potential prompt injection patterns
  return input
    .replace(/system:/gi, '')
    .replace(/assistant:/gi, '')
    .replace(/\[INST\]/gi, '')
    .replace(/\[\/INST\]/gi, '')
    .trim()
    .slice(0, 2000); // Max 2000 characters
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader || '' } } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'anonymous';

    // Rate limiting
    if (!checkRateLimit(userId)) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), 
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { prompt, saveStory, title, stream = false } = await req.json();
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Sanitize input
    const sanitizedPrompt = sanitizeInput(prompt);
    
    // Check if prompt is empty after sanitization
    if (!sanitizedPrompt || sanitizedPrompt.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Prompt empty after sanitization" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Call Lovable AI Gateway
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { 
            role: "system", 
            content: "You are a creative storytelling assistant. Generate engaging, well-structured content based on the user's prompt. Be creative, inspiring, and professional."
          },
          { role: "user", content: sanitizedPrompt }
        ],
        stream: stream,
      }),
    });

    if (!aiResponse.ok) {
      const statusCode = aiResponse.status;
      let errorMessage = "AI generation failed";
      
      if (statusCode === 429) {
        errorMessage = "Rate limit exceeded. Please try again later.";
      } else if (statusCode === 402) {
        errorMessage = "Payment required. Please add credits to your workspace.";
      } else if (statusCode === 401) {
        errorMessage = "Authentication failed.";
      }
      
      console.error("AI gateway error:", statusCode, await aiResponse.text());
      return new Response(
        JSON.stringify({ error: errorMessage }), 
        { status: statusCode, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // If streaming requested, return stream directly
    if (stream) {
      return new Response(aiResponse.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    const data = await aiResponse.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return new Response(
        JSON.stringify({ error: "No content generated" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Save story if requested
    if (saveStory && user) {
        const preview = content.slice(0, 160);
        const { error: insertError } = await supabase
          .from('stories')
          .insert({
            user_id: user.id,
            title: title || 'Untitled Story',
            content,
            prompt_used: sanitizedPrompt,
            is_public: false
          });

        if (insertError) {
          console.error('Error saving story:', insertError);
          return new Response(
            JSON.stringify({ content, saved: false, message: "Failed to save story" }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

      return new Response(
        JSON.stringify({ content, saved: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ content }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error in ai-storytelling:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});