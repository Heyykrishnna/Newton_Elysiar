import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CodingAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  achievement_name: string;
  achievement_description: string;
  achievement_icon: string;
  unlocked_at: string;
}

export const CODING_ACHIEVEMENTS = [
  { id: 'problems_10', name: 'First Steps', description: 'Solve 10 problems', icon: '🎯', threshold: 10 },
  { id: 'problems_50', name: 'Problem Solver', description: 'Solve 50 problems', icon: '💪', threshold: 50 },
  { id: 'problems_100', name: 'Century Club', description: 'Solve 100 problems', icon: '💯', threshold: 100 },
  { id: 'problems_250', name: 'Dedicated Coder', description: 'Solve 250 problems', icon: '🔥', threshold: 250 },
  { id: 'problems_500', name: 'Half Millennium', description: 'Solve 500 problems', icon: '⭐', threshold: 500 },
  { id: 'problems_1000', name: 'Legendary', description: 'Solve 1000 problems', icon: '👑', threshold: 1000 },
  { id: 'cf_rating_1200', name: 'Pupil', description: 'Reach 1200 rating on Codeforces', icon: '📈', threshold: 1200, type: 'codeforces_rating' },
  { id: 'cf_rating_1400', name: 'Specialist', description: 'Reach 1400 rating on Codeforces', icon: '🎓', threshold: 1400, type: 'codeforces_rating' },
  { id: 'cf_rating_1600', name: 'Expert', description: 'Reach 1600 rating on Codeforces', icon: '🏅', threshold: 1600, type: 'codeforces_rating' },
  { id: 'cf_rating_1900', name: 'Candidate Master', description: 'Reach 1900 rating on Codeforces', icon: '🏆', threshold: 1900, type: 'codeforces_rating' },
  { id: 'cf_rating_2100', name: 'Master', description: 'Reach 2100 rating on Codeforces', icon: '💎', threshold: 2100, type: 'codeforces_rating' },
  { id: 'cf_rating_2400', name: 'Grandmaster', description: 'Reach 2400 rating on Codeforces', icon: '🌟', threshold: 2400, type: 'codeforces_rating' },
  { id: 'lc_rank_500k', name: 'Top 500k', description: 'Reach top 500,000 rank on LeetCode', icon: '🥉', threshold: 500000, type: 'leetcode_rank' },
  { id: 'lc_rank_100k', name: 'Top 100k', description: 'Reach top 100,000 rank on LeetCode', icon: '🥈', threshold: 100000, type: 'leetcode_rank' },
  { id: 'lc_rank_50k', name: 'Top 50k', description: 'Reach top 50,000 rank on LeetCode', icon: '🥇', threshold: 50000, type: 'leetcode_rank' },
  { id: 'lc_rank_10k', name: 'Top 10k', description: 'Reach top 10,000 rank on LeetCode', icon: '👑', threshold: 10000, type: 'leetcode_rank' },
  { id: 'easy_25', name: 'Easy Peasy', description: 'Solve 25 easy problems', icon: '🟢', threshold: 25, type: 'easy' },
  { id: 'medium_25', name: 'Medium Master', description: 'Solve 25 medium problems', icon: '🟡', threshold: 25, type: 'medium' },
  { id: 'hard_10', name: 'Hard Worker', description: 'Solve 10 hard problems', icon: '🔴', threshold: 10, type: 'hard' },
  { id: 'hard_25', name: 'Hard Hitter', description: 'Solve 25 hard problems', icon: '💀', threshold: 25, type: 'hard' },
];

export const useCodingAchievements = () => {
  return useQuery({
    queryKey: ['coding-achievements'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('coding_achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('unlocked_at', { ascending: false });

      if (error) throw error;
      return data as CodingAchievement[];
    },
  });
};

export const useUnlockAchievement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (achievement: { achievement_id: string; achievement_name: string; achievement_description: string; achievement_icon: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('coding_achievements')
        .upsert([{
          user_id: user.id,
          ...achievement,
        }], { onConflict: 'user_id,achievement_id' })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['coding-achievements'] });
      toast.success(`Achievement Unlocked: ${data.achievement_name}!`, {
        description: data.achievement_description,
        duration: 5000,
      });
    },
  });
};

import { useCodingProgress, CodingProgress } from '@/hooks/useCodingProfile';

export const useCheckAndUnlockAchievements = () => {
  const unlockAchievement = useUnlockAchievement();
  const { data: achievements } = useCodingAchievements();

  const checkAchievements = async (progress: CodingProgress[]) => {
    if (!achievements) return;

    const unlockedIds = new Set(achievements.map(a => a.achievement_id));
    const totalProblems = progress.reduce((sum, p) => sum + (p.problems_solved || 0), 0);
    const totalEasy = progress.reduce((sum, p) => sum + (p.easy_solved || 0), 0);
    const totalMedium = progress.reduce((sum, p) => sum + (p.medium_solved || 0), 0);
    const totalHard = progress.reduce((sum, p) => sum + (p.hard_solved || 0), 0);
    const maxRating = Math.max(...progress.map(p => p.max_rating || p.contest_rating || 0));

    for (const ach of CODING_ACHIEVEMENTS) {
      if (unlockedIds.has(ach.id)) continue;

      let shouldUnlock = false;

      if (ach.type === 'codeforces_rating') {
        const cfProgress = progress.find(p => p.platform === 'codeforces');
        if (cfProgress?.max_rating && cfProgress.max_rating >= ach.threshold) {
          shouldUnlock = true;
        }
      } else if (ach.type === 'leetcode_rank') {
        const lcProgress = progress.find(p => p.platform === 'leetcode');
        if (lcProgress?.ranking && lcProgress.ranking <= ach.threshold) {
          shouldUnlock = true;
        }
      } else if (ach.type === 'easy' && totalEasy >= ach.threshold) {
        shouldUnlock = true;
      } else if (ach.type === 'medium' && totalMedium >= ach.threshold) {
        shouldUnlock = true;
      } else if (ach.type === 'hard' && totalHard >= ach.threshold) {
        shouldUnlock = true;
      } else if (!ach.type && totalProblems >= ach.threshold) {
        shouldUnlock = true;
      }

      if (shouldUnlock) {
        await unlockAchievement.mutateAsync({
          achievement_id: ach.id,
          achievement_name: ach.name,
          achievement_description: ach.description,
          achievement_icon: ach.icon,
        });
      }
    }
  };

  return { checkAchievements };
};
