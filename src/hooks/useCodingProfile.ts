import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CodingProfile {
  id: string;
  user_id: string;
  leetcode_username: string | null;
  codeforces_username: string | null;
  codeforces_api_key: string | null;
  codeforces_api_secret: string | null;
  codechef_username: string | null;
  preferred_topics: string[] | null;
  skill_level: string;
  created_at: string;
  updated_at: string;
}

export interface CodingProgress {
  id: string;
  user_id: string;
  platform: string;
  problems_solved: number;
  easy_solved: number;
  medium_solved: number;
  hard_solved: number;
  contest_rating: number | null;
  max_rating: number | null;
  ranking: number | null;
  last_synced: string;
}

export const useCodingProfile = () => {
  return useQuery({
    queryKey: ['coding-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('coding_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
  });
};

export const useCodingProgress = () => {
  return useQuery({
    queryKey: ['coding-progress'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('coding_progress')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      return data;
    },
  });
};

export const useUpsertCodingProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileData: Partial<CodingProfile>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // First check if profile exists
      const { data: existing } = await supabase
        .from('coding_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        // Update existing profile
        const { data, error } = await supabase
          .from('coding_profiles')
          .update({ ...profileData, updated_at: new Date().toISOString() })
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Insert new profile
        const { data, error } = await supabase
          .from('coding_profiles')
          .insert([{ ...profileData, user_id: user.id }])
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coding-profile'] });
      toast.success('Profile updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update profile: ${error.message}`);
    },
  });
};

export const useSyncCodingProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (platform: string) => {
      const { data, error } = await supabase.functions.invoke('sync-coding-progress', {
        body: { platform },
      });

      if (error) throw error;
      
      // Check if the response indicates a failure
      if (data && !data.success) {
        throw new Error(data.error || 'Failed to sync progress');
      }
      
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['coding-progress'] });
      
      // Only show success toast if the sync actually succeeded
      if (data && data.success) {
        toast.success('Progress synced successfully');
      }
    },
    onError: (error) => {
      toast.error(`Failed to sync progress: ${error.message}`);
    },
  });
};

export const useGetCodingRecommendations = () => {
  return useMutation({
    mutationFn: async (params: {
      topics?: string[];
      difficulty?: string;
      platform?: string;
    }) => {
      const { data, error } = await supabase.functions.invoke('coding-recommendations', {
        body: params,
      });

      if (error) throw error;
      return data;
    },
    onError: (error) => {
      toast.error(`Failed to get recommendations: ${error.message}`);
    },
  });
};