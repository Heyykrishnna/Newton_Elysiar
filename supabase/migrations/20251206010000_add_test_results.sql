-- Add test_results column to submission history
ALTER TABLE public.web_dev_submission_history
ADD COLUMN IF NOT EXISTS test_results JSONB;

-- Add test_score column for quick filtering
ALTER TABLE public.web_dev_submission_history
ADD COLUMN IF NOT EXISTS test_score INTEGER DEFAULT 0;

-- Add index for test scores
CREATE INDEX IF NOT EXISTS idx_submission_history_test_score 
ON public.web_dev_submission_history(test_score);

-- Add comment
COMMENT ON COLUMN public.web_dev_submission_history.test_results IS 'JSON object containing test execution results';
COMMENT ON COLUMN public.web_dev_submission_history.test_score IS 'Percentage of tests passed (0-100)';
