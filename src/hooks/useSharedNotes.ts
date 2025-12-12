import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useEffect } from 'react';

export interface SharedNote {
  id: string;
  owner_id: string;
  title: string;
  content: string;
  tags: string[];
  color: string;
  is_pinned: boolean;
  is_archived: boolean;
  shared_with: string[];
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export const useSharedNotes = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['shared-notes'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('shared_notes')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data as SharedNote[];
    },
  });

  // Subscribe to realtime updates
  useEffect(() => {
    const channel = supabase
      .channel('shared-notes-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'shared_notes'
        },
        (payload) => {
          console.log('Realtime update:', payload);
          queryClient.invalidateQueries({ queryKey: ['shared-notes'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
};

export const useCreateSharedNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (note: Partial<SharedNote>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('shared_notes')
        .insert([{ ...note, owner_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shared-notes'] });
      toast.success('Note created');
    },
    onError: (error) => {
      toast.error(`Failed to create note: ${error.message}`);
    },
  });
};

export const useUpdateSharedNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<SharedNote> & { id: string }) => {
      const { data, error } = await supabase
        .from('shared_notes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shared-notes'] });
    },
    onError: (error) => {
      toast.error(`Failed to update note: ${error.message}`);
    },
  });
};

export const useDeleteSharedNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('shared_notes')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shared-notes'] });
      toast.success('Note deleted');
    },
    onError: (error) => {
      toast.error(`Failed to delete note: ${error.message}`);
    },
  });
};

export const useShareNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ noteId, userEmail, isPublic }: { noteId: string; userEmail?: string; isPublic?: boolean }) => {
      if (isPublic !== undefined) {
        const { error } = await supabase
          .from('shared_notes')
          .update({ is_public: isPublic })
          .eq('id', noteId);

        if (error) throw error;
        return;
      }

      if (userEmail) {
        // Find user by email
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', userEmail)
          .single();

        if (profileError || !profile) {
          throw new Error('User not found');
        }

        // Get current shared_with array
        const { data: note, error: noteError } = await supabase
          .from('shared_notes')
          .select('shared_with')
          .eq('id', noteId)
          .single();

        if (noteError) throw noteError;

        const currentShared = (note?.shared_with as string[]) || [];
        if (!currentShared.includes(profile.id)) {
          const { error } = await supabase
            .from('shared_notes')
            .update({ shared_with: [...currentShared, profile.id] })
            .eq('id', noteId);

          if (error) throw error;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shared-notes'] });
      toast.success('Note shared successfully');
    },
    onError: (error) => {
      toast.error(`Failed to share note: ${error.message}`);
    },
  });
};
