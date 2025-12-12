import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CodingProfile {
  leetcode_username: string | null;
  codeforces_username: string | null;
  codeforces_api_key: string | null;
  codeforces_api_secret: string | null;
}

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

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { platform } = await req.json();

    // Get user's coding profile
    const { data: profile, error: profileError } = await supabaseClient
      .from('coding_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      return new Response(JSON.stringify({ error: 'No coding profile found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const codingProfile = profile as CodingProfile;
    let progressData: any = {};
    let errorMessage = '';

    // Fetch data from different platforms
    if (platform === 'leetcode' && codingProfile.leetcode_username) {
      try {
        const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${codingProfile.leetcode_username}`);
        
        if (!response.ok) {
          errorMessage = `LeetCode API returned status ${response.status}. Please verify your username is correct.`;
          console.error('LeetCode API error:', response.status, response.statusText);
        } else {
          const data = await response.json();
          
          // Check if the response contains an error
          if (data.error || data.errors) {
            errorMessage = `LeetCode username "${codingProfile.leetcode_username}" not found. Please check your username.`;
            console.error('LeetCode user not found:', data);
          } else {
            progressData = {
              user_id: user.id,
              platform: 'leetcode',
              problems_solved: data.totalSolved || 0,
              easy_solved: data.easySolved || 0,
              medium_solved: data.mediumSolved || 0,
              hard_solved: data.hardSolved || 0,
              contest_rating: data.ranking || null,
              ranking: data.ranking || null,
            };
          }
        }
      } catch (error) {
        errorMessage = `Failed to fetch LeetCode data: ${error instanceof Error ? error.message : 'Network error'}. The API might be temporarily unavailable.`;
        console.error('Error fetching LeetCode data:', error);
      }
    } else if (platform === 'codeforces' && codingProfile.codeforces_username) {
      try {
        // Fetch user info
        const userInfoResponse = await fetch(`https://codeforces.com/api/user.info?handles=${codingProfile.codeforces_username}`);
        
        if (!userInfoResponse.ok) {
          errorMessage = `Codeforces API returned status ${userInfoResponse.status}. Please try again later.`;
          console.error('Codeforces API error:', userInfoResponse.status);
        } else {
          const userInfoData = await userInfoResponse.json();
          
          if (userInfoData.status !== 'OK') {
            errorMessage = `Codeforces username "${codingProfile.codeforces_username}" not found. Please check your username.`;
            console.error('Codeforces user not found:', userInfoData);
          } else {
            let rating = null;
            let maxRating = null;
            let rank = null;
            
            if (userInfoData.result && userInfoData.result.length > 0) {
              const userData = userInfoData.result[0];
              rating = userData.rating || null;
              maxRating = userData.maxRating || null;
              rank = userData.rank || null;
            }

            // Fetch user submissions to count solved problems
            let problemsSolved = 0;
            try {
              const submissionsUrl = codingProfile.codeforces_api_key && codingProfile.codeforces_api_secret
                ? `https://codeforces.com/api/user.status?handle=${codingProfile.codeforces_username}`
                : `https://codeforces.com/api/user.status?handle=${codingProfile.codeforces_username}&from=1&count=1000`;
              
              const submissionsResponse = await fetch(submissionsUrl);
              const submissionsData = await submissionsResponse.json();
              
              if (submissionsData.status === 'OK') {
                // Count unique solved problems
                const solvedProblems = new Set<string>();
                for (const submission of submissionsData.result || []) {
                  if (submission.verdict === 'OK') {
                    const problemId = `${submission.problem.contestId}-${submission.problem.index}`;
                    solvedProblems.add(problemId);
                  }
                }
                problemsSolved = solvedProblems.size;
              }
            } catch (subError) {
              console.error('Error fetching Codeforces submissions:', subError);
              // Don't fail the entire sync if submissions fail
            }
            
            progressData = {
              user_id: user.id,
              platform: 'codeforces',
              problems_solved: problemsSolved,
              easy_solved: 0,
              medium_solved: 0,
              hard_solved: 0,
              contest_rating: rating,
              max_rating: maxRating,
              ranking: rank,
            };
          }
        }
      } catch (error) {
        errorMessage = `Failed to fetch Codeforces data: ${error instanceof Error ? error.message : 'Network error'}. The API might be temporarily unavailable.`;
        console.error('Error fetching Codeforces data:', error);
      }
    }

    // Upsert progress data or return error
    if (Object.keys(progressData).length > 0) {
      const { error: upsertError } = await supabaseClient
        .from('coding_progress')
        .upsert([{ ...progressData, last_synced: new Date().toISOString() }], {
          onConflict: 'user_id,platform'
        });

      if (upsertError) {
        console.error('Database upsert error:', upsertError);
        return new Response(JSON.stringify({ 
          success: false, 
          error: `Failed to save progress: ${upsertError.message}` 
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ success: true, data: progressData }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      // Return detailed error message instead of generic "No data to sync"
      return new Response(JSON.stringify({ 
        success: false, 
        error: errorMessage || `No ${platform} username configured in your profile` 
      }), {
        status: 200, // Return 200 with error details instead of 400
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error in sync-coding-progress:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});