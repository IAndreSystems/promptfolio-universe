import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authorization required" }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: "User not authenticated" }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user's GitHub username from profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('github_username')
      .eq('id', user.id)
      .single();

    if (!profile?.github_username) {
      return new Response(
        JSON.stringify({ error: "GitHub username not configured in profile" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch repositories from GitHub API
    const githubResponse = await fetch(
      `https://api.github.com/users/${profile.github_username}/repos?sort=updated&per_page=100`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Promptfolio-Universe'
        }
      }
    );

    if (!githubResponse.ok) {
      throw new Error(`GitHub API error: ${githubResponse.status}`);
    }

    const repos = await githubResponse.json();

    // Sync repositories to projects table
    let synced = 0;
    let errors = 0;

    for (const repo of repos) {
      if (repo.fork) continue; // Skip forked repos

      // Check if project already exists
      const { data: existing } = await supabase
        .from('projects')
        .select('id')
        .eq('user_id', user.id)
        .eq('github_repo', repo.html_url)
        .single();

      if (!existing) {
        const { error: insertError } = await supabase
          .from('projects')
          .insert({
            user_id: user.id,
            title: repo.name,
            description: repo.description || '',
            project_url: repo.homepage || repo.html_url,
            github_repo: repo.html_url,
            github_synced: true,
            category: repo.language || 'Other',
            is_public: true
          });

        if (insertError) {
          console.error('Error inserting project:', insertError);
          errors++;
        } else {
          synced++;
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        synced, 
        errors,
        message: `Synced ${synced} repositories from GitHub`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error in github-sync:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});