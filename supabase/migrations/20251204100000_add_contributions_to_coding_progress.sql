-- Add contributions column to coding_progress table
ALTER TABLE public.coding_progress 
ADD COLUMN IF NOT EXISTS contributions INTEGER DEFAULT 0;
