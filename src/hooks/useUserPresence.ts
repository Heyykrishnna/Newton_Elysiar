import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

export type UserStatus = 'online' | 'away' | 'offline';

export interface UserPresence {
  user_id: string;
  status: UserStatus;
  last_seen: string;
  updated_at: string;
}

// Update current user's presence
export const useUpdatePresence = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (status: UserStatus) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('user_presence')
        .upsert({
          user_id: user.id,
          status,
          last_seen: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-presence'] });
    },
  });
};

// Get specific user's status
export const useUserStatus = (userId: string | null) => {
  return useQuery({
    queryKey: ['user-presence', userId],
    queryFn: async (): Promise<UserPresence | null> => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from('user_presence')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) return null;
      return data;
    },
    enabled: !!userId,
  });
};

// Hook to automatically manage presence
export const usePresence = () => {
  const updatePresence = useUpdatePresence();

  useEffect(() => {
    // Set online when component mounts
    updatePresence.mutate('online');

    // Set offline when page is about to unload
    const handleBeforeUnload = () => {
      updatePresence.mutate('offline');
    };

    // Set away after 5 minutes of inactivity
    let inactivityTimer: NodeJS.Timeout;
    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      updatePresence.mutate('online');
      inactivityTimer = setTimeout(() => {
        updatePresence.mutate('away');
      }, 5 * 60 * 1000); // 5 minutes
    };

    // Listen for user activity
    window.addEventListener('mousemove', resetInactivityTimer);
    window.addEventListener('keypress', resetInactivityTimer);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Start inactivity timer
    resetInactivityTimer();

    // Cleanup
    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener('mousemove', resetInactivityTimer);
      window.removeEventListener('keypress', resetInactivityTimer);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      updatePresence.mutate('offline');
    };
  }, []);

  return updatePresence;
};

// Get multiple users' presence
export const useMultipleUserPresence = (userIds: string[]) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['user-presence', 'multiple', userIds.sort().join(',')],
    queryFn: async (): Promise<Map<string, UserPresence>> => {
      if (userIds.length === 0) return new Map();

      const { data, error } = await supabase
        .from('user_presence')
        .select('*')
        .in('user_id', userIds);

      if (error) throw error;

      const presenceMap = new Map<string, UserPresence>();
      data?.forEach(presence => {
        presenceMap.set(presence.user_id, presence);
      });

      return presenceMap;
    },
    enabled: userIds.length > 0,
  });

  // Subscribe to presence changes
  useEffect(() => {
    if (userIds.length === 0) return;

    const channel = supabase
      .channel('presence-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_presence',
          filter: `user_id=in.(${userIds.join(',')})`
        },
        () => {
          queryClient.invalidateQueries({ 
            queryKey: ['user-presence', 'multiple', userIds.sort().join(',')] 
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userIds.join(','), queryClient]);

  return query;
};
