-- Add new columns to book_issues table for student details
ALTER TABLE public.book_issues
ADD COLUMN IF NOT EXISTS enrollment_number TEXT,
ADD COLUMN IF NOT EXISTS batch TEXT,
ADD COLUMN IF NOT EXISTS year TEXT,
ADD COLUMN IF NOT EXISTS department TEXT;

-- Add comments for documentation
COMMENT ON COLUMN public.book_issues.enrollment_number IS 'Student enrollment number';
COMMENT ON COLUMN public.book_issues.batch IS 'Student batch year';
COMMENT ON COLUMN public.book_issues.year IS 'Student current year (1-4)';
COMMENT ON COLUMN public.book_issues.department IS 'Student department';
