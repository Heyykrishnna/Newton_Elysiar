-- Allow profiles to be viewed for leaderboard purposes
DROP POLICY IF EXISTS "Users can view all profiles for leaderboard" ON public.profiles;

CREATE POLICY "Users can view all profiles for leaderboard" 
ON public.profiles 
FOR SELECT 
USING (true);

-- Add unique constraint for web_dev_progress if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'web_dev_progress_user_question_unique'
  ) THEN
    ALTER TABLE public.web_dev_progress 
    ADD CONSTRAINT web_dev_progress_user_question_unique UNIQUE (user_id, question_id);
  END IF;
END $$;