import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CodingContest {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  difficulty: string;
  type?: 'coding' | 'web-dev';
  problems: any[];
  created_by: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContestParticipant {
  id: string;
  contest_id: string;
  user_id: string;
  score: number;
  problems_solved: number;
  submissions: any[];
  joined_at: string;
  completed_at: string | null;
}

export const useCodingContests = () => {
  return useQuery({
    queryKey: ['coding-contests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coding_contests')
        .select('*')
        .eq('is_active', true)
        .order('start_time', { ascending: true });

      if (error) throw error;
      return data as CodingContest[];
    },
  });
};

export const useContestParticipation = (contestId: string) => {
  return useQuery({
    queryKey: ['contest-participation', contestId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('coding_contest_participants')
        .select('*')
        .eq('contest_id', contestId)
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as ContestParticipant | null;
    },
    enabled: !!contestId,
  });
};

export const useContestLeaderboard = (contestId: string) => {
  return useQuery({
    queryKey: ['contest-leaderboard', contestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coding_contest_participants')
        .select(`
          *,
          profiles:user_id (full_name, email)
        `)
        .eq('contest_id', contestId)
        .order('score', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    },
    enabled: !!contestId,
  });
};

export const useJoinContest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contestId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('coding_contest_participants')
        .insert([{ contest_id: contestId, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, contestId) => {
      queryClient.invalidateQueries({ queryKey: ['contest-participation', contestId] });
      queryClient.invalidateQueries({ queryKey: ['contest-leaderboard', contestId] });
      toast.success('Successfully joined the contest!');
    },
    onError: (error) => {
      toast.error(`Failed to join contest: ${error.message}`);
    },
  });
};

export const useSubmitContestAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ contestId, problemIndex, answer, isCorrect }: { contestId: string; problemIndex: number; answer: string; isCorrect: boolean }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get current participation
      const { data: participation, error: fetchError } = await supabase
        .from('coding_contest_participants')
        .select('*')
        .eq('contest_id', contestId)
        .eq('user_id', user.id)
        .single();

      if (fetchError) throw fetchError;

      const submissions = (participation.submissions as any[]) || [];
      const existingSubmission = submissions.find((s: any) => s.problemIndex === problemIndex);
      
      if (!existingSubmission) {
        submissions.push({ problemIndex, answer, isCorrect, timestamp: new Date().toISOString() });
      }

      const newScore = isCorrect && !existingSubmission?.isCorrect 
        ? participation.score + 100 
        : participation.score;
      const newProblemsSolved = isCorrect && !existingSubmission?.isCorrect 
        ? participation.problems_solved + 1 
        : participation.problems_solved;

      const { data, error } = await supabase
        .from('coding_contest_participants')
        .update({ 
          submissions, 
          score: newScore, 
          problems_solved: newProblemsSolved 
        })
        .eq('id', participation.id)
        .select()
        .single();

      if (error) throw error;
      return { data, isCorrect };
    },
    onSuccess: ({ isCorrect }, { contestId }) => {
      queryClient.invalidateQueries({ queryKey: ['contest-participation', contestId] });
      queryClient.invalidateQueries({ queryKey: ['contest-leaderboard', contestId] });
      if (isCorrect) {
        toast.success('Correct answer! +100 points');
      } else {
        toast.error('Incorrect answer. Try again!');
      }
    },
  });
};

export const useCreateContest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contest: Omit<CodingContest, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('coding_contests')
        .insert([{ ...contest, created_by: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coding-contests'] });
      toast.success('Contest created successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to create contest: ${error.message}`);
    },
  });
};
