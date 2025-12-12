-- Create web dev progress table for tracking practice
CREATE TABLE public.web_dev_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  question_id TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  category TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  time_taken_seconds INTEGER,
  code_submitted TEXT,
  UNIQUE(user_id, question_id)
);

-- Create web dev streaks table
CREATE TABLE public.web_dev_streaks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_practice_date DATE,
  total_problems_solved INTEGER NOT NULL DEFAULT 0,
  easy_solved INTEGER NOT NULL DEFAULT 0,
  medium_solved INTEGER NOT NULL DEFAULT 0,
  hard_solved INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create daily activity table for contribution graph
CREATE TABLE public.web_dev_daily_activity (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  activity_date DATE NOT NULL,
  problems_solved INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, activity_date)
);

-- Enable RLS
ALTER TABLE public.web_dev_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.web_dev_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.web_dev_daily_activity ENABLE ROW LEVEL SECURITY;

-- RLS policies for web_dev_progress
CREATE POLICY "Users can manage their own progress" ON public.web_dev_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Owners can view all progress" ON public.web_dev_progress FOR SELECT USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'owner')
);

-- RLS policies for web_dev_streaks
CREATE POLICY "Users can manage their own streaks" ON public.web_dev_streaks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Owners can view all streaks" ON public.web_dev_streaks FOR SELECT USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'owner')
);

-- RLS policies for web_dev_daily_activity
CREATE POLICY "Users can manage their own activity" ON public.web_dev_daily_activity FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Owners can view all activity" ON public.web_dev_daily_activity FOR SELECT USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'owner')
);