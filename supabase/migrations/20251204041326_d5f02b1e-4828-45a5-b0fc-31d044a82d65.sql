-- Create shared_notes table for collaborative notes
CREATE TABLE public.shared_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL,
  title TEXT NOT NULL DEFAULT 'Untitled',
  content TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  color TEXT DEFAULT 'bg-[#221f20]',
  is_pinned BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  shared_with UUID[] DEFAULT '{}',
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.shared_notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own notes" 
ON public.shared_notes 
FOR SELECT 
USING (auth.uid() = owner_id);

CREATE POLICY "Users can view notes shared with them" 
ON public.shared_notes 
FOR SELECT 
USING (auth.uid() = ANY(shared_with));

CREATE POLICY "Users can view public notes" 
ON public.shared_notes 
FOR SELECT 
USING (is_public = true);

CREATE POLICY "Users can create their own notes" 
ON public.shared_notes 
FOR INSERT 
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own notes" 
ON public.shared_notes 
FOR UPDATE 
USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own notes" 
ON public.shared_notes 
FOR DELETE 
USING (auth.uid() = owner_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_shared_notes_updated_at
BEFORE UPDATE ON public.shared_notes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for shared_notes
ALTER TABLE public.shared_notes REPLICA IDENTITY FULL;

-- Add unique constraint to coding_progress for proper upsert
ALTER TABLE public.coding_progress 
ADD CONSTRAINT coding_progress_user_platform_unique 
UNIQUE (user_id, platform);