-- Add Codeforces API columns to coding_profiles
ALTER TABLE public.coding_profiles 
ADD COLUMN IF NOT EXISTS codeforces_api_key text,
ADD COLUMN IF NOT EXISTS codeforces_api_secret text;

-- Create coding_achievements table
CREATE TABLE IF NOT EXISTS public.coding_achievements (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  achievement_id text NOT NULL,
  achievement_name text NOT NULL,
  achievement_description text NOT NULL,
  achievement_icon text NOT NULL,
  unlocked_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Create coding_contests table
CREATE TABLE IF NOT EXISTS public.coding_contests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  start_time timestamp with time zone NOT NULL,
  end_time timestamp with time zone NOT NULL,
  difficulty text NOT NULL DEFAULT 'medium',
  problems jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_by uuid NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create coding_contest_participants table
CREATE TABLE IF NOT EXISTS public.coding_contest_participants (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contest_id uuid NOT NULL REFERENCES public.coding_contests(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  score integer NOT NULL DEFAULT 0,
  problems_solved integer NOT NULL DEFAULT 0,
  submissions jsonb NOT NULL DEFAULT '[]'::jsonb,
  joined_at timestamp with time zone NOT NULL DEFAULT now(),
  completed_at timestamp with time zone,
  UNIQUE(contest_id, user_id)
);

-- Enable RLS
ALTER TABLE public.coding_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coding_contests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coding_contest_participants ENABLE ROW LEVEL SECURITY;

-- RLS policies for coding_achievements
CREATE POLICY "Users can view all achievements" ON public.coding_achievements
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own achievements" ON public.coding_achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS policies for coding_contests
CREATE POLICY "Everyone can view active contests" ON public.coding_contests
  FOR SELECT USING (is_active = true);

CREATE POLICY "Owners can manage contests" ON public.coding_contests
  FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'owner'));

-- RLS policies for coding_contest_participants
CREATE POLICY "Users can view contest participants" ON public.coding_contest_participants
  FOR SELECT USING (true);

CREATE POLICY "Users can join contests" ON public.coding_contest_participants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own participation" ON public.coding_contest_participants
  FOR UPDATE USING (auth.uid() = user_id);