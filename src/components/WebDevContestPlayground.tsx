import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, Clock, Play, RotateCcw, CheckCircle, X, ExternalLink, Timer, Trophy, History, AlertTriangle, Undo2 } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useMarkQuestionComplete } from '@/hooks/useWebDevProgress';
import { useSubmissionHistory, validateCode } from '@/hooks/useSubmissionHistory';
import { runTests, TestCase, TestRunResult } from '@/utils/testRunner';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';

interface Question {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
  starterHtml: string;
  starterCss: string;
  starterJs: string;
  hints: string[];
  expectedOutput?: string;
  link: string;
  testCases: TestCase[];  // ADD THIS
  passingScore: number;    // ADD THIS (e.g., 80 for 80%)
  media?: { type: 'image' | 'video'; url: string; caption?: string }[];
}

interface WebDevContestPlaygroundProps {
  question: Question;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function WebDevContestPlayground({ question, isOpen, onClose, onComplete }: WebDevContestPlaygroundProps) {
  const [html, setHtml] = useState(question.starterHtml);
  const [css, setCss] = useState(question.starterCss);
  const [js, setJs] = useState(question.starterJs);
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js' | 'history'>('html');
  const [srcDoc, setSrcDoc] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [showHints, setShowHints] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  
  // Resizable panel widths (in percentages)
  const [leftWidth, setLeftWidth] = useState(20); // Problem description
  const [rightWidth, setRightWidth] = useState(25); // Preview
  
  // Submission history and validation
  const [showValidation, setShowValidation] = useState(false);
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; errors: string[] } | null>(null);
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);
  
  // Test results
  const [testResults, setTestResults] = useState<TestRunResult | null>(null);
  const [showTestResults, setShowTestResults] = useState(false);
  
  const markComplete = useMarkQuestionComplete();
  const { submissions, activeSubmission, submitCode, withdrawSubmission } = useSubmissionHistory(question.id);

  // Handle left resize
  const handleLeftResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = leftWidth;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const containerWidth = window.innerWidth * 0.95; // 95vw
      const deltaPercent = (deltaX / containerWidth) * 100;
      const newWidth = Math.min(Math.max(startWidth + deltaPercent, 15), 40); // Min 15%, Max 40%
      setLeftWidth(newWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [leftWidth]);

  // Handle right resize
  const handleRightResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = rightWidth;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = startX - moveEvent.clientX; // Inverted for right panel
      const containerWidth = window.innerWidth * 0.95;
      const deltaPercent = (deltaX / containerWidth) * 100;
      const newWidth = Math.min(Math.max(startWidth + deltaPercent, 20), 50); // Min 20%, Max 50%
      setRightWidth(newWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [rightWidth]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && isOpen) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isOpen]);

  // Update preview
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
        <html>
          <head>
            <style>${css}</style>
          </head>
          <body>
            ${html}
            <script>${js}</script>
          </body>
        </html>
      `);
    }, 500);
    return () => clearTimeout(timeout);
  }, [html, css, js]);

  // Reset when question changes
  useEffect(() => {
    setHtml(question.starterHtml);
    setCss(question.starterCss);
    setJs(question.starterJs);
    setElapsedTime(0);
    setIsRunning(true);
    setShowHints(false);
    setHintsUsed(0);
  }, [question]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleReset = () => {
    setHtml(question.starterHtml);
    setCss(question.starterCss);
    setJs(question.starterJs);
    toast.info('Code reset to starter template');
  };

  const handlePreSubmit = async () => {
    // Run basic validation first
    const validation = validateCode(html, css, js);
    setValidationResult(validation);
    
    if (!validation.isValid) {
      setShowValidation(true);
      return;
    }
    
    // Run test cases if they exist
    if (question.testCases && question.testCases.length > 0) {
      toast.info('Running tests...');
      try {
        const results = await runTests(html, css, js, question.testCases);
        setTestResults(results);
        setShowTestResults(true);
      } catch (error: any) {
        toast.error(`Test error: ${error.message}`);
        setShowValidation(true);
      }
    } else {
      // No tests, proceed with validation dialog
      setShowValidation(true);
    }
  };

  const handleConfirmedSubmit = async () => {
    if (!validationResult?.isValid) {
      toast.error('Please fix validation errors before submitting');
      return;
    }

    setIsRunning(false);
    setShowValidation(false);
    
    try {
      // Submit to history
      await submitCode.mutateAsync({
        questionId: question.id,
        htmlCode: html,
        cssCode: css,
        jsCode: js,
        timeTaken: elapsedTime,
        validationPassed: true,
        validationErrors: null,
        testResults: testResults,
        testScore: testResults?.percentage || 0,
      });

      // Mark as complete
      await markComplete.mutateAsync({
        questionId: question.id,
        difficulty: question.difficulty,
        category: question.category,
        timeTaken: elapsedTime,
        codeSubmitted: JSON.stringify({ html, css, js })
      });
      
      onComplete();
      
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Failed to submit:', error);
      setIsRunning(true);
    }
  };

  const handleWithdraw = async () => {
    if (!activeSubmission) return;
    
    try {
      await withdrawSubmission.mutateAsync(activeSubmission.id);
      setShowWithdrawConfirm(false);
      toast.success('Submission withdrawn. You can resubmit now.');
    } catch (error) {
      console.error('Failed to withdraw:', error);
    }
  };

  const handleShowHint = () => {
    if (hintsUsed < question.hints.length) {
      setHintsUsed(prev => prev + 1);
      setShowHints(true);
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Hard': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'HTML': return '🌐';
      case 'CSS': return '🎨';
      case 'JavaScript': return '⚡';
      case 'React': return '⚛️';
      default: return '📝';
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-[95vw] max-h-[95vh] h-[95vh] p-0 bg-[#0d0d0d] border-white/10 overflow-hidden [&>button]:hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#161616]">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getCategoryIcon(question.category)}</span>
                <div>
                  <h2 className="text-white font-bold text-lg">{question.title}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getDifficultyColor(question.difficulty)}>
                      {question.difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-white/60 border-white/20">
                      {question.category}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Timer */}
              <div className="flex items-center gap-2 px-4 py-2 bg-[#221f20] rounded-lg border border-white/10">
                <Timer className="w-5 h-5 text-[#ac1ed6]" />
                <span className="text-white font-mono text-xl">{formatTime(elapsedTime)}</span>
              </div>
              
              <Button variant="outline" size="sm" onClick={handleReset} className="bg-transparent border-white/20 text-white/60 hover:text-white hover:bg-white/10">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              
              <Button
                size="sm"
                onClick={handleShowHint}
                disabled={hintsUsed >= question.hints.length}
                variant="outline"
                className="border-yellow-500/30 text-yellow-400 bg-yellow-500/10 hover:text-white hover:bg-yellow-500/10"
              >
                Hints ({hintsUsed}/{question.hints.length})
              </Button>
              
              <Button
                size="sm"
                onClick={handlePreSubmit}
                disabled={markComplete.isPending || !!activeSubmission}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {activeSubmission ? 'Already Submitted' : 'Submit Solution'}
              </Button>
              
              <Button variant="ghost" size="icon" onClick={onClose} className="text-white/60 hover:text-black">
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Left - Problem Description */}
            <div style={{ width: `${leftWidth}%` }} className="border-r border-white/10 overflow-y-auto bg-[#161616] flex-shrink-0">
              <div className="p-4 space-y-4">
                <div>
                  <h3 className="text-white font-semibold mb-2">Description</h3>
                  <div className="text-white/70 text-sm leading-relaxed prose prose-invert max-w-none">
                    <ReactMarkdown>{question.description}</ReactMarkdown>
                  </div>
                </div>
                
                {question.expectedOutput && (
                  <div>
                    <h3 className="text-white font-semibold mb-2">Expected Output</h3>
                    <p className="text-white/70 text-sm">{question.expectedOutput}</p>
                  </div>
                )}

                {question.media && question.media.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-white font-semibold mb-2">Media</h3>
                    {question.media.map((item, index) => (
                      <div key={index} className="space-y-2">
                        {item.type === 'image' ? (
                          <img 
                            src={item.url} 
                            alt={item.caption || 'Question image'} 
                            className="w-full rounded-lg border border-white/10"
                          />
                        ) : (
                          <video 
                            src={item.url} 
                            controls 
                            className="w-full rounded-lg border border-white/10"
                          />
                        )}
                        {item.caption && (
                          <p className="text-white/50 text-xs italic">{item.caption}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                <AnimatePresence>
                  {showHints && hintsUsed > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <h3 className="text-yellow-400 font-semibold mb-2">Hints</h3>
                      <div className="space-y-2">
                        {question.hints.slice(0, hintsUsed).map((hint, i) => (
                          <div key={i} className="p-2 bg-yellow-500/10 rounded border border-yellow-500/20 text-yellow-200/80 text-sm">
                            {hint}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div className="pt-4 border-t border-white/10">
                  <a
                    href={question.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#ac1ed6] hover:text-[#c26e73] text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View on external resource
                  </a>
                </div>
              </div>
            </div>

            {/* Left Resize Handle */}
            <div
              onMouseDown={handleLeftResize}
              className="w-1 bg-white/10 hover:bg-[#ac1ed6] cursor-col-resize transition-colors flex-shrink-0 relative group"
            >
              <div className="absolute inset-y-0 -left-1 -right-1" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-12 bg-white/20 group-hover:bg-[#ac1ed6] rounded-full transition-colors" />
            </div>

            {/* Middle - Code Editor */}
            <div style={{ width: `${100 - leftWidth - rightWidth}%` }} className="flex flex-col flex-shrink-0">
              {/* Tabs */}
              <div className="flex border-b border-white/10 bg-[#1a1a1a]">
                {(['html', 'css', 'js'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 text-sm font-medium transition-colors ${
                      activeTab === tab
                        ? 'text-white bg-[#221f20] border-b-2 border-[#ac1ed6]'
                        : 'text-white/50 hover:text-white/80'
                    }`}
                  >
                    {tab.toUpperCase()}
                  </button>
                ))}
              </div>
              
              {/* Editor */}
              <div className="flex-1">
                <Editor
                  height="100%"
                  language={activeTab === 'js' ? 'javascript' : activeTab}
                  value={activeTab === 'html' ? html : activeTab === 'css' ? css : js}
                  onChange={(value) => {
                    if (activeTab === 'html') setHtml(value || '');
                    else if (activeTab === 'css') setCss(value || '');
                    else setJs(value || '');
                  }}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    wordWrap: 'on',
                  }}
                />
              </div>
            </div>

            {/* Right Resize Handle */}
            <div
              onMouseDown={handleRightResize}
              className="w-1 bg-white/10 hover:bg-[#ac1ed6] cursor-col-resize transition-colors flex-shrink-0 relative group"
            >
              <div className="absolute inset-y-0 -left-1 -right-1" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-12 bg-white/20 group-hover:bg-[#ac1ed6] rounded-full transition-colors" />
            </div>

            {/* Right - Preview */}
            <div style={{ width: `${rightWidth}%` }} className="flex flex-col flex-shrink-0">
              <div className="p-3 border-b border-white/10 bg-[#1a1a1a]">
                <h3 className="text-white font-medium text-sm">Live Preview</h3>
              </div>
              <div className="flex-1 bg-white">
                <iframe
                  title="preview"
                  srcDoc={srcDoc}
                  className="w-full h-full border-none"
                  sandbox="allow-scripts"
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    {/* Validation Dialog */}
    <Dialog open={showValidation} onOpenChange={setShowValidation}>
      <DialogContent className="bg-[#0d0d0d] border-white/10 [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            {validationResult?.isValid ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-500" />
                Code Validation Passed
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Validation Issues Found
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-white/60">
            {validationResult?.isValid
              ? 'Your code passed all validation checks. Ready to submit!'
              : 'Please fix the following issues before submitting:'}
          </DialogDescription>
        </DialogHeader>
        
        {!validationResult?.isValid && validationResult?.errors && (
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {validationResult.errors.map((error, i) => (
              <div key={i} className="flex items-start gap-2 p-3 bg-yellow-500/10 rounded border border-yellow-500/20">
                <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-yellow-200">{error}</p>
              </div>
            ))}
          </div>
        )}
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setShowValidation(false)} 
            className="bg-transparent border-white/20 text-white hover:bg-white/10"
          >
            {validationResult?.isValid ? 'Cancel' : 'Fix Issues'}
          </Button>
          {validationResult?.isValid && (
            <Button 
              onClick={handleConfirmedSubmit} 
              disabled={submitCode.isPending || markComplete.isPending}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              {submitCode.isPending || markComplete.isPending ? 'Submitting...' : 'Confirm Submit'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* Test Results Dialog */}
    <Dialog open={showTestResults} onOpenChange={setShowTestResults}>
      <DialogContent className="bg-[#0d0d0d] border-white/10 max-w-2xl [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            {testResults && testResults.percentage >= (question.passingScore || 80) ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-500" />
                Tests Passed ({testResults.percentage}%)
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Tests Failed ({testResults?.percentage || 0}%)
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-white/60">
            {testResults && testResults.percentage >= (question.passingScore || 80)
              ? `Great! You passed ${testResults.passedTests} out of ${testResults.totalTests} tests.`
              : `You need ${question.passingScore || 80}% to submit. Fix the failing tests and try again.`}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[400px]">
          <div className="space-y-2">
            {testResults?.results.map((result) => (
              <div
                key={result.testId}
                className={`p-3 rounded border ${
                  result.passed
                    ? 'bg-green-500/10 border-green-500/20'
                    : 'bg-red-500/10 border-red-500/20'
                }`}
              >
                <div className="flex items-start gap-2">
                  {result.passed ? (
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className={`font-medium text-sm ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
                      {result.testName}
                    </p>
                    <p className="text-xs text-white/60 mt-1">{result.message}</p>
                    {!result.passed && result.expected && (
                      <div className="mt-2 text-xs space-y-1">
                        <p className="text-white/40">Expected: {JSON.stringify(result.expected)}</p>
                        {result.actual !== undefined && (
                          <p className="text-white/40">Actual: {JSON.stringify(result.actual)}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setShowTestResults(false)}
            className="bg-transparent border-white/20 text-white/60 hover:text-white hover:bg-white/10"
          >
            {testResults && testResults.percentage >= (question.passingScore || 80) ? 'Cancel' : 'Fix Code'}
          </Button>
          {testResults && testResults.percentage >= (question.passingScore || 80) && (
            <Button
              onClick={() => {
                setShowTestResults(false);
                setShowValidation(true);
              }}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              Proceed to Submit
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* Withdraw Confirmation Dialog */}
    <Dialog open={showWithdrawConfirm} onOpenChange={setShowWithdrawConfirm}>
      <DialogContent className="bg-[#0d0d0d] border-white/10 [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Undo2 className="w-5 h-5 text-orange-500" />
            Withdraw Submission?
          </DialogTitle>
          <DialogDescription className="text-white/60">
            This will remove your current submission and allow you to resubmit. Your progress will be reset for this question.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setShowWithdrawConfirm(false)} 
            className="bg-transparent border-white/20 text-white hover:bg-white/10"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleWithdraw} 
            disabled={withdrawSubmission.isPending}
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
          >
            {withdrawSubmission.isPending ? 'Withdrawing...' : 'Withdraw Submission'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
