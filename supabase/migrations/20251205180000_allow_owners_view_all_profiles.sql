-- Add RLS policy to allow owners to view all profiles
-- This is needed for the educator dashboard to display student names

CREATE POLICY "Owners can view all profiles" ON public.profiles
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'owner')
  );
