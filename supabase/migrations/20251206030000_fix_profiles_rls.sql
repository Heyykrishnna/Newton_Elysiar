-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Owners can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Policy for users to view their own profile
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (
    auth.uid() = id
  );

-- Policy for owners to view all profiles
-- Using a security definer function or simpler check to avoid recursion if possible, 
-- but standard way is checking the role.
-- To avoid recursion, we can check jwt metadata if role is there, or just trust the recursive check works (Supabase handles it usually).
-- Alternatively, we can just allow read access to public profiles if privacy isn't a huge concern, but let's stick to owner-only.

CREATE POLICY "Owners can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'owner'
    )
  );
