import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { topics, difficulty, platform } = await req.json();

    // Get user's coding profile and progress
    const { data: profile } = await supabaseClient
      .from('coding_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    const { data: progress } = await supabaseClient
      .from('coding_progress')
      .select('*')
      .eq('user_id', user.id);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: 'AI service not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Build context for AI
    let context = `User skill level: ${profile?.skill_level || 'beginner'}\n`;
    
    if (profile?.preferred_topics && profile.preferred_topics.length > 0) {
      context += `Preferred topics: ${profile.preferred_topics.join(', ')}\n`;
    }
    
    if (progress && progress.length > 0) {
      context += `Progress:\n`;
      progress.forEach((p: any) => {
        context += `- ${p.platform}: ${p.problems_solved} problems solved (Easy: ${p.easy_solved}, Medium: ${p.medium_solved}, Hard: ${p.hard_solved})\n`;
        if (p.contest_rating) {
          context += `  Rating: ${p.contest_rating}\n`;
        }
      });
    }

    const userTopics = topics?.length > 0 ? topics.join(', ') : 'general';
    const userDifficulty = difficulty || profile?.skill_level || 'beginner';
    const userPlatform = platform || 'any';

    const systemPrompt = `You are an expert competitive programming coach. Based on the user's profile and progress, provide personalized recommendations for their coding practice journey.`;

    const userPrompt = `${context}

The user wants recommendations for:
- Topics: ${userTopics}
- Difficulty: ${userDifficulty}
- Platform: ${userPlatform}

Provide a detailed learning plan with:
1. **Recommended Topics**: 3-5 topics they should focus on based on their level and interests
2. **Practice Strategy**: Specific advice on how to approach problems
3. **Problem Recommendations**: Suggest specific problem types or patterns to practice
4. **Next Steps**: What to focus on to level up their skills
5. **Time Management**: How to structure their practice sessions

Keep the response practical, motivating, and actionable.`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
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
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limits exceeded, please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: 'Payment required, please add funds to your Lovable AI workspace.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error('AI gateway error');
    }

    const aiData = await aiResponse.json();
    const recommendations = aiData.choices[0].message.content;

    return new Response(JSON.stringify({ recommendations }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in coding-recommendations:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});