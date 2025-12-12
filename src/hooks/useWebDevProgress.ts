import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface WebDevProgress {
  id: string;
  user_id: string;
  question_id: string;
  difficulty: string;
  category: string;
  completed_at: string;
  time_taken_seconds: number | null;
  code_submitted: string | null;
}

export interface WebDevStreak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_practice_date: string | null;
  total_problems_solved: number;
  easy_solved: number;
  medium_solved: number;
  hard_solved: number;
  created_at: string;
  updated_at: string;
}

export interface DailyActivity {
  id: string;
  user_id: string;
  activity_date: string;
  problems_solved: number;
}

export const useWebDevProgress = () => {
  return useQuery({
    queryKey: ['web-dev-progress'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('web_dev_progress')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      return data as WebDevProgress[];
    },
  });
};

export const useWebDevStreak = () => {
  return useQuery({
    queryKey: ['web-dev-streak'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('web_dev_streaks')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data as WebDevStreak | null;
    },
  });
};

export const useDailyActivity = () => {
  return useQuery({
    queryKey: ['web-dev-daily-activity'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get last 365 days of activity
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      const { data, error } = await supabase
        .from('web_dev_daily_activity')
        .select('*')
        .eq('user_id', user.id)
        .gte('activity_date', oneYearAgo.toISOString().split('T')[0])
        .order('activity_date', { ascending: true });

      if (error) throw error;
      return data as DailyActivity[];
    },
  });
};

export const useAllStudentsProgress = () => {
  return useQuery({
    queryKey: ['all-students-web-dev-progress'],
    queryFn: async () => {
      try {
        // Get all students' streaks with profile data
        const { data: streaks, error: streaksError } = await supabase
          .from('web_dev_streaks')
          .select('*');

        if (streaksError) {
          console.error('Error fetching streaks:', streaksError);
          throw streaksError;
        }

        if (!streaks || streaks.length === 0) {
          console.log('No streaks found in database');
          return [];
        }

        // Get all user IDs from streaks
        const userIds = streaks.map(s => s.user_id);

        // Get profiles for these users
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', userIds);

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
        }

        // Get daily activity for all students
        const { data: activities, error: activitiesError } = await supabase
          .from('web_dev_daily_activity')
          .select('*')
          .in('user_id', userIds);

        if (activitiesError) {
          console.error('Error fetching activities:', activitiesError);
        }

        // Combine and format data
        const studentsData = streaks.map((streak) => {
          const profile = profiles?.find(p => p.id === streak.user_id);
          const studentActivities = activities?.filter(a => a.user_id === streak.user_id) || [];
          
          // Extract name from email if full_name is not available
          let displayName = profile?.full_name;
          if (!displayName && profile?.email) {
            displayName = profile.email.split('@')[0];
          }
          
          return {
            id: streak.id,
            user_id: streak.user_id,
            current_streak: streak.current_streak || 0,
            longest_streak: streak.longest_streak || 0,
            total_problems_solved: streak.total_problems_solved || 0,
            easy_solved: streak.easy_solved || 0,
            medium_solved: streak.medium_solved || 0,
            hard_solved: streak.hard_solved || 0,
            last_practice_date: streak.last_practice_date,
            full_name: displayName || 'Anonymous User',
            email: profile?.email || '',
            activities: studentActivities
          };
        });

        console.log('Fetched students data:', studentsData.length, 'students');
        return studentsData;
      } catch (error) {
        console.error('Failed to fetch all students progress:', error);
        throw error;
      }
    },
    staleTime: 10000, // Cache for 10 seconds for better real-time sync
    refetchInterval: 15000, // Auto-refetch every 15 seconds for more frequent updates
    refetchOnWindowFocus: true, // Refetch when window regains focus
    refetchOnReconnect: true, // Refetch when reconnecting
  });
};

export const useMarkQuestionComplete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      questionId: string;
      difficulty: string;
      category: string;
      timeTaken?: number;
      codeSubmitted?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const today = new Date().toISOString().split('T')[0];

      // 1. Insert progress record
      const { error: progressError } = await supabase
        .from('web_dev_progress')
        .upsert({
          user_id: user.id,
          question_id: params.questionId,
          difficulty: params.difficulty,
          category: params.category,
          time_taken_seconds: params.timeTaken,
          code_submitted: params.codeSubmitted,
          completed_at: new Date().toISOString()
        }, { onConflict: 'user_id,question_id' });

      if (progressError) throw progressError;

      // 2. Update or create streak record
      const { data: existingStreak } = await supabase
        .from('web_dev_streaks')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      const difficultyKey = params.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard';
      
      if (existingStreak) {
        const lastDate = existingStreak.last_practice_date;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        let newStreak = existingStreak.current_streak;
        
        if (lastDate === today) {
          // Already practiced today, just update counts
        } else if (lastDate === yesterdayStr) {
          // Continued streak
          newStreak += 1;
        } else {
          // Streak broken, start fresh
          newStreak = 1;
        }

        const updateData: any = {
          current_streak: newStreak,
          longest_streak: Math.max(newStreak, existingStreak.longest_streak),
          last_practice_date: today,
          total_problems_solved: existingStreak.total_problems_solved + 1,
          updated_at: new Date().toISOString()
        };

        // Update difficulty-specific count
        updateData[`${difficultyKey}_solved`] = (existingStreak[`${difficultyKey}_solved`] || 0) + 1;

        const { error: updateError } = await supabase
          .from('web_dev_streaks')
          .update(updateData)
          .eq('user_id', user.id);

        if (updateError) throw updateError;
      } else {
        // Create new streak record
        const insertData: any = {
          user_id: user.id,
          current_streak: 1,
          longest_streak: 1,
          last_practice_date: today,
          total_problems_solved: 1,
          easy_solved: 0,
          medium_solved: 0,
          hard_solved: 0
        };
        insertData[`${difficultyKey}_solved`] = 1;

        const { error: insertError } = await supabase
          .from('web_dev_streaks')
          .insert(insertData);

        if (insertError) throw insertError;
      }

      // 3. Update daily activity
      const { data: existingActivity } = await supabase
        .from('web_dev_daily_activity')
        .select('*')
        .eq('user_id', user.id)
        .eq('activity_date', today)
        .maybeSingle();

      if (existingActivity) {
        const { error: activityError } = await supabase
          .from('web_dev_daily_activity')
          .update({ problems_solved: existingActivity.problems_solved + 1 })
          .eq('id', existingActivity.id);

        if (activityError) throw activityError;
      } else {
        const { error: activityError } = await supabase
          .from('web_dev_daily_activity')
          .insert({
            user_id: user.id,
            activity_date: today,
            problems_solved: 1
          });

        if (activityError) throw activityError;
      }

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['web-dev-progress'] });
      queryClient.invalidateQueries({ queryKey: ['web-dev-streak'] });
      queryClient.invalidateQueries({ queryKey: ['web-dev-daily-activity'] });
      queryClient.invalidateQueries({ queryKey: ['all-students-web-dev-progress'] }); // Update leaderboard
      toast.success('Question completed! 🎉');
    },
    onError: (error) => {
      toast.error(`Failed to save progress: ${error.message}`);
    },
  });
};
