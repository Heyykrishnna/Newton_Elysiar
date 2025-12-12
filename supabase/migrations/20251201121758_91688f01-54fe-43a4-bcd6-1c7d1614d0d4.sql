-- Create book_reviews table for rating and review system
CREATE TABLE public.book_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(book_id, student_id)
);

-- Enable RLS
ALTER TABLE public.book_reviews ENABLE ROW LEVEL SECURITY;

-- Students can create their own reviews
CREATE POLICY "Students can create their own reviews"
ON public.book_reviews
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = student_id);

-- Students can update their own reviews
CREATE POLICY "Students can update their own reviews"
ON public.book_reviews
FOR UPDATE
TO authenticated
USING (auth.uid() = student_id);

-- Students can delete their own reviews
CREATE POLICY "Students can delete their own reviews"
ON public.book_reviews
FOR DELETE
TO authenticated
USING (auth.uid() = student_id);

-- Everyone can view reviews
CREATE POLICY "Everyone can view reviews"
ON public.book_reviews
FOR SELECT
TO authenticated
USING (true);

-- Create coding_profiles table for LeetCode/Codeforces integration
CREATE TABLE public.coding_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  leetcode_username TEXT,
  codeforces_username TEXT,
  codechef_username TEXT,
  preferred_topics TEXT[],
  skill_level TEXT DEFAULT 'beginner',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.coding_profiles ENABLE ROW LEVEL SECURITY;

-- Users can manage their own coding profiles
CREATE POLICY "Users can manage their own coding profiles"
ON public.coding_profiles
FOR ALL
TO authenticated
USING (auth.uid() = user_id);

-- Create coding_progress table to track progress
CREATE TABLE public.coding_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  platform TEXT NOT NULL,
  problems_solved INTEGER DEFAULT 0,
  easy_solved INTEGER DEFAULT 0,
  medium_solved INTEGER DEFAULT 0,
  hard_solved INTEGER DEFAULT 0,
  contest_rating INTEGER,
  max_rating INTEGER,
  ranking INTEGER,
  last_synced TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, platform)
);

-- Enable RLS
ALTER TABLE public.coding_progress ENABLE ROW LEVEL SECURITY;

-- Users can view their own progress
CREATE POLICY "Users can view their own progress"
ON public.coding_progress
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- System can update progress
CREATE POLICY "System can update progress"
ON public.coding_progress
FOR ALL
TO authenticated
USING (true);

-- Create trigger to update updated_at
CREATE TRIGGER update_book_reviews_updated_at
BEFORE UPDATE ON public.book_reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_coding_profiles_updated_at
BEFORE UPDATE ON public.coding_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();