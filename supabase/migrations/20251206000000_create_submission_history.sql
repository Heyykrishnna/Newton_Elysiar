-- Create submission history table for web dev practice
CREATE TABLE IF NOT EXISTS public.web_dev_submission_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  html_code TEXT,
  css_code TEXT,
  js_code TEXT,
  time_taken INTEGER,
  validation_passed BOOLEAN DEFAULT false,
  validation_errors JSONB,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  withdrawn_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_submission_history_user_question ON public.web_dev_submission_history(user_id, question_id);
CREATE INDEX idx_submission_history_active ON public.web_dev_submission_history(is_active) WHERE is_active = true;

-- Enable RLS
ALTER TABLE public.web_dev_submission_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own submission history
CREATE POLICY "Users can view own submission history"
  ON public.web_dev_submission_history
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own submissions
CREATE POLICY "Users can insert own submissions"
  ON public.web_dev_submission_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own submissions (for withdrawal)
CREATE POLICY "Users can update own submissions"
  ON public.web_dev_submission_history
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Owners can view all submissions
CREATE POLICY "Owners can view all submissions"
  ON public.web_dev_submission_history
  FOR SELECT
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'owner'));

-- Add comment
COMMENT ON TABLE public.web_dev_submission_history IS 'Tracks all code submissions for web development practice questions';
