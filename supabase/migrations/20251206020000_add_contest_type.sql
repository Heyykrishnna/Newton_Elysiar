-- Add type column to coding_contests table
ALTER TABLE coding_contests 
ADD COLUMN IF NOT EXISTS type text DEFAULT 'coding';

-- Update existing rows to have 'coding' type if they are null (though default handles new ones)
UPDATE coding_contests SET type = 'coding' WHERE type IS NULL;
