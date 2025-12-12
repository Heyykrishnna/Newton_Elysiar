-- Add Codeforces API credentials columns to coding_profiles table
ALTER TABLE public.coding_profiles
ADD COLUMN IF NOT EXISTS codeforces_api_key TEXT,
ADD COLUMN IF NOT EXISTS codeforces_api_secret TEXT;

-- Add comment for documentation
COMMENT ON COLUMN public.coding_profiles.codeforces_api_key IS 'User-provided Codeforces API key for authenticated requests';
COMMENT ON COLUMN public.coding_profiles.codeforces_api_secret IS 'User-provided Codeforces API secret for authenticated requests';
