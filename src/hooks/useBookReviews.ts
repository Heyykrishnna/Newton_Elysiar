import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface BookReview {
  id: string;
  book_id: string;
  student_id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
  updated_at: string;
}

export const useBookReviews = (bookId?: string) => {
  return useQuery({
    queryKey: ['book-reviews', bookId],
    queryFn: async () => {
      let query = supabase
        .from('book_reviews')
        .select('*, profiles!book_reviews_student_id_fkey(full_name)')
        .order('created_at', { ascending: false });

      if (bookId) {
        query = query.eq('book_id', bookId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
};

export const useMyBookReview = (bookId: string) => {
  return useQuery({
    queryKey: ['my-book-review', bookId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('book_reviews')
        .select('*')
        .eq('book_id', bookId)
        .eq('student_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
  });
};

export const useAddBookReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewData: {
      book_id: string;
      rating: number;
      review_text?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('book_reviews')
        .insert([{ ...reviewData, student_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['book-reviews', variables.book_id] });
      queryClient.invalidateQueries({ queryKey: ['my-book-review', variables.book_id] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast.success('Review added successfully');
    },
    onError: (error) => {
      toast.error(`Failed to add review: ${error.message}`);
    },
  });
};

export const useUpdateBookReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<BookReview> & { id: string }) => {
      const { data, error } = await supabase
        .from('book_reviews')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['book-reviews', data.book_id] });
      queryClient.invalidateQueries({ queryKey: ['my-book-review', data.book_id] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast.success('Review updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update review: ${error.message}`);
    },
  });
};

export const useDeleteBookReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('book_reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['book-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['my-book-review'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast.success('Review deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete review: ${error.message}`);
    },
  });
};