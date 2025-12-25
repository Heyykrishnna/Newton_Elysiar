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

export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type AchievementCategory = 'progress' | 'rating' | 'difficulty' | 'special';

export interface AchievementMetadata {
  id: string;
  name: string;
  description: string;
  icon: string;
  badgeImage?: string; // Path to custom badge image
  threshold: number;
  type?: string;
  rarity: AchievementRarity;
  category: AchievementCategory;
  points: number;
  colors: {
    primary: string;
    secondary: string;
    glow: string;
  };
}

export const RARITY_CONFIG = {
  common: { label: 'Common', color: '#9CA3AF', glow: 'rgba(156, 163, 175, 0.3)' },
  rare: { label: 'Rare', color: '#3B82F6', glow: 'rgba(59, 130, 246, 0.3)' },
  epic: { label: 'Epic', color: '#A855F7', glow: 'rgba(168, 85, 247, 0.3)' },
  legendary: { label: 'Legendary', color: '#F59E0B', glow: 'rgba(245, 158, 11, 0.3)' },
};

export const CODING_ACHIEVEMENTS: AchievementMetadata[] = [
  // Common - Progress Milestones
  { 
    id: 'problems_10', 
    name: 'First Steps', 
    description: 'Solve 10 problems', 
    icon: '🎯',
    badgeImage: '/badges/first_steps.png', 
    threshold: 10,
    rarity: 'common',
    category: 'progress',
    points: 10,
    colors: { primary: '#9CA3AF', secondary: '#6B7280', glow: 'rgba(156, 163, 175, 0.3)' }
  },
  { 
    id: 'problems_50', 
    name: 'Problem Solver', 
    description: 'Solve 50 problems', 
    icon: '💪',
    badgeImage: '/badges/problem_solver.png', 
    threshold: 50,
    rarity: 'common',
    category: 'progress',
    points: 25,
    colors: { primary: '#9CA3AF', secondary: '#6B7280', glow: 'rgba(156, 163, 175, 0.3)' }
  },
  
  // Rare - Significant Progress
  { 
    id: 'problems_100', 
    name: 'Century Club', 
    description: 'Solve 100 problems', 
    icon: '💯',
    badgeImage: '/badges/century_club.png', 
    threshold: 100,
    rarity: 'rare',
    category: 'progress',
    points: 50,
    colors: { primary: '#3B82F6', secondary: '#2563EB', glow: 'rgba(59, 130, 246, 0.3)' }
  },
  { 
    id: 'problems_250', 
    name: 'Dedicated Coder', 
    description: 'Solve 250 problems', 
    icon: '🔥',
    badgeImage: '/badges/dedicated_coder.png', 
    threshold: 250,
    rarity: 'rare',
    category: 'progress',
    points: 100,
    colors: { primary: '#3B82F6', secondary: '#2563EB', glow: 'rgba(59, 130, 246, 0.3)' }
  },
  
  // Epic - Major Achievements
  { 
    id: 'problems_500', 
    name: 'Half Millennium', 
    description: 'Solve 500 problems', 
    icon: '⭐',
    badgeImage: '/badges/half_millennium.png', 
    threshold: 500,
    rarity: 'epic',
    category: 'progress',
    points: 250,
    colors: { primary: '#A855F7', secondary: '#9333EA', glow: 'rgba(168, 85, 247, 0.3)' }
  },
  
  // Legendary - Ultimate Goals
  { 
    id: 'problems_1000', 
    name: 'Legendary', 
    description: 'Solve 1000 problems', 
    icon: '👑',
    badgeImage: '/badges/legendary.png', 
    threshold: 1000,
    rarity: 'legendary',
    category: 'progress',
    points: 1000,
    colors: { primary: '#F59E0B', secondary: '#D97706', glow: 'rgba(245, 158, 11, 0.3)' }
  },
  
  // Codeforces Rating Achievements
  { 
    id: 'cf_rating_1200', 
    name: 'Pupil', 
    description: 'Reach 1200 rating on Codeforces', 
    icon: '📈', 
    threshold: 1200, 
    type: 'codeforces_rating',
    rarity: 'common',
    category: 'rating',
    points: 50,
    colors: { primary: '#22C55E', secondary: '#16A34A', glow: 'rgba(34, 197, 94, 0.3)' }
  },
  { 
    id: 'cf_rating_1400', 
    name: 'Specialist', 
    description: 'Reach 1400 rating on Codeforces', 
    icon: '🎓', 
    threshold: 1400, 
    type: 'codeforces_rating',
    rarity: 'rare',
    category: 'rating',
    points: 100,
    colors: { primary: '#06B6D4', secondary: '#0891B2', glow: 'rgba(6, 182, 212, 0.3)' }
  },
  { 
    id: 'cf_rating_1600', 
    name: 'Expert', 
    description: 'Reach 1600 rating on Codeforces', 
    icon: '🏅', 
    threshold: 1600, 
    type: 'codeforces_rating',
    rarity: 'epic',
    category: 'rating',
    points: 200,
    colors: { primary: '#8B5CF6', secondary: '#7C3AED', glow: 'rgba(139, 92, 246, 0.3)' }
  },
  { 
    id: 'cf_rating_1900', 
    name: 'Candidate Master', 
    description: 'Reach 1900 rating on Codeforces', 
    icon: '🏆', 
    threshold: 1900, 
    type: 'codeforces_rating',
    rarity: 'epic',
    category: 'rating',
    points: 350,
    colors: { primary: '#EC4899', secondary: '#DB2777', glow: 'rgba(236, 72, 153, 0.3)' }
  },
  { 
    id: 'cf_rating_2100', 
    name: 'Master', 
    description: 'Reach 2100 rating on Codeforces', 
    icon: '💎', 
    threshold: 2100, 
    type: 'codeforces_rating',
    rarity: 'legendary',
    category: 'rating',
    points: 500,
    colors: { primary: '#F59E0B', secondary: '#D97706', glow: 'rgba(245, 158, 11, 0.3)' }
  },
  { 
    id: 'cf_rating_2400', 
    name: 'Grandmaster', 
    description: 'Reach 2400 rating on Codeforces', 
    icon: '🌟', 
    threshold: 2400, 
    type: 'codeforces_rating',
    rarity: 'legendary',
    category: 'rating',
    points: 1000,
    colors: { primary: '#EF4444', secondary: '#DC2626', glow: 'rgba(239, 68, 68, 0.3)' }
  },
  
  // LeetCode Rank Achievements
  { 
    id: 'lc_rank_500k', 
    name: 'Top 500k', 
    description: 'Reach top 500,000 rank on LeetCode', 
    icon: '🥉', 
    threshold: 500000, 
    type: 'leetcode_rank',
    rarity: 'common',
    category: 'rating',
    points: 25,
    colors: { primary: '#CD7F32', secondary: '#A0522D', glow: 'rgba(205, 127, 50, 0.3)' }
  },
  { 
    id: 'lc_rank_100k', 
    name: 'Top 100k', 
    description: 'Reach top 100,000 rank on LeetCode', 
    icon: '🥈', 
    threshold: 100000, 
    type: 'leetcode_rank',
    rarity: 'rare',
    category: 'rating',
    points: 75,
    colors: { primary: '#C0C0C0', secondary: '#A8A8A8', glow: 'rgba(192, 192, 192, 0.3)' }
  },
  { 
    id: 'lc_rank_50k', 
    name: 'Top 50k', 
    description: 'Reach top 50,000 rank on LeetCode', 
    icon: '🥇', 
    threshold: 50000, 
    type: 'leetcode_rank',
    rarity: 'epic',
    category: 'rating',
    points: 150,
    colors: { primary: '#FFD700', secondary: '#FFA500', glow: 'rgba(255, 215, 0, 0.3)' }
  },
  { 
    id: 'lc_rank_10k', 
    name: 'Top 10k', 
    description: 'Reach top 10,000 rank on LeetCode', 
    icon: '👑', 
    threshold: 10000, 
    type: 'leetcode_rank',
    rarity: 'legendary',
    category: 'rating',
    points: 500,
    colors: { primary: '#F59E0B', secondary: '#D97706', glow: 'rgba(245, 158, 11, 0.3)' }
  },
  
  // Difficulty-based Achievements
  { 
    id: 'easy_25', 
    name: 'Easy Peasy', 
    description: 'Solve 25 easy problems', 
    icon: '🟢', 
    threshold: 25, 
    type: 'easy',
    rarity: 'common',
    category: 'difficulty',
    points: 15,
    colors: { primary: '#22C55E', secondary: '#16A34A', glow: 'rgba(34, 197, 94, 0.3)' }
  },
  { 
    id: 'medium_25', 
    name: 'Medium Master', 
    description: 'Solve 25 medium problems', 
    icon: '🟡', 
    threshold: 25, 
    type: 'medium',
    rarity: 'rare',
    category: 'difficulty',
    points: 50,
    colors: { primary: '#EAB308', secondary: '#CA8A04', glow: 'rgba(234, 179, 8, 0.3)' }
  },
  { 
    id: 'hard_10', 
    name: 'Hard Worker', 
    description: 'Solve 10 hard problems', 
    icon: '🔴', 
    threshold: 10, 
    type: 'hard',
    rarity: 'epic',
    category: 'difficulty',
    points: 100,
    colors: { primary: '#EF4444', secondary: '#DC2626', glow: 'rgba(239, 68, 68, 0.3)' }
  },
  { 
    id: 'hard_25', 
    name: 'Hard Hitter', 
    description: 'Solve 25 hard problems', 
    icon: '💀', 
    threshold: 25, 
    type: 'hard',
    rarity: 'legendary',
    category: 'difficulty',
    points: 300,
    colors: { primary: '#991B1B', secondary: '#7F1D1D', glow: 'rgba(153, 27, 27, 0.3)' }
  },
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
