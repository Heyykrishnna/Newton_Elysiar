import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SubmissionHistory {
  id: string;
  user_id: string;
  question_id: string;
  html_code: string | null;
  css_code: string | null;
  js_code: string | null;
  time_taken: number | null;
  validation_passed: boolean;
  validation_errors: any;
  test_results: any;
  test_score: number;
  submitted_at: string;
  withdrawn_at: string | null;
  is_active: boolean;
}

interface SubmitCodeParams {
  questionId: string;
  htmlCode: string;
  cssCode: string;
  jsCode: string;
  timeTaken: number;
  validationPassed: boolean;
  validationErrors?: any;
  testResults?: any;
  testScore?: number;
}

export const useSubmissionHistory = (questionId: string) => {
  const queryClient = useQueryClient();

  // Fetch submission history for a question
  const { data: submissions, isLoading } = useQuery({
    queryKey: ['submission-history', questionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('web_dev_submission_history')
        .select('*')
        .eq('question_id', questionId)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      return data as SubmissionHistory[];
    },
  });

  // Get active (non-withdrawn) submission
  const activeSubmission = submissions?.find(s => s.is_active && !s.withdrawn_at);

  // Submit code
  const submitCode = useMutation({
    mutationFn: async (params: SubmitCodeParams) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('web_dev_submission_history')
        .insert({
          user_id: user.id,
          question_id: params.questionId,
          html_code: params.htmlCode,
          css_code: params.cssCode,
          js_code: params.jsCode,
          time_taken: params.timeTaken,
          validation_passed: params.validationPassed,
          validation_errors: params.validationErrors || null,
          test_results: params.testResults || null,
          test_score: params.testScore || 0,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submission-history', questionId] });
      toast.success('Code submitted successfully!');
    },
    onError: (error: any) => {
      toast.error(`Submission failed: ${error.message}`);
    },
  });

  // Withdraw submission
  const withdrawSubmission = useMutation({
    mutationFn: async (submissionId: string) => {
      const { data, error } = await supabase
        .from('web_dev_submission_history')
        .update({
          withdrawn_at: new Date().toISOString(),
          is_active: false,
        })
        .eq('id', submissionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submission-history', questionId] });
      toast.success('Submission withdrawn successfully!');
    },
    onError: (error: any) => {
      toast.error(`Withdrawal failed: ${error.message}`);
    },
  });

  return {
    submissions,
    activeSubmission,
    isLoading,
    submitCode,
    withdrawSubmission,
  };
};

// Validation helper
export const validateCode = (html: string, css: string, js: string) => {
  const errors: string[] = [];

  // HTML validation
  if (!html || html.trim().length === 0) {
    errors.push('HTML code is empty');
  }

  // CSS validation (basic check)
  if (!css || css.trim().length === 0) {
    errors.push('CSS code is empty - add some styling');
  }

  // JavaScript syntax validation
  if (js && js.trim().length > 0) {
    try {
      new Function(js);
    } catch (e: any) {
      errors.push(`JavaScript syntax error: ${e.message}`);
    }
  }

  // Check for basic HTML structure
  const hasBasicStructure = html.includes('<') && html.includes('>');
  if (!hasBasicStructure) {
    errors.push('HTML must contain valid tags');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
