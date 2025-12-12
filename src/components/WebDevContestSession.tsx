import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, Clock, Play, RotateCcw, CheckCircle, X, ExternalLink, Timer, Trophy, History, AlertTriangle, Undo2, ChevronLeft, ChevronRight, Medal } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useContestParticipation, useContestLeaderboard, useSubmitContestAnswer, CodingContest } from '@/hooks/useCodingContests';
import { runTests, TestCase, TestRunResult } from '@/utils/testRunner';
import { format, differenceInSeconds, isPast } from 'date-fns';
import ReactMarkdown from 'react-markdown';

interface WebDevContestSessionProps {
  contest: CodingContest;
  onClose: () => void;
}

export function WebDevContestSession({ contest, onClose }: WebDevContestSessionProps) {
  const { data: participation, refetch: refetchParticipation } = useContestParticipation(contest.id);
  const { data: leaderboard } = useContestLeaderboard(contest.id);
  const submitAnswer = useSubmitContestAnswer();

  const [currentProblem, setCurrentProblem] = useState(0);
  const [html, setHtml] = useState('');
  const [css, setCss] = useState('');
  const [js, setJs] = useState('');
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
  const [srcDoc, setSrcDoc] = useState('');
  const [timeRemaining, setTimeRemaining] = useState('');
  
  // Resizable panel widths
  const [leftWidth, setLeftWidth] = useState(20);
  const [rightWidth, setRightWidth] = useState(25);

  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [testResults, setTestResults] = useState<TestRunResult | null>(null);
  const [showTestResults, setShowTestResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const problems = (contest.problems as any[]) || [];
  const problem = problems[currentProblem];
  const submission = participation?.submissions?.find((s: any) => s.problemIndex === currentProblem);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      const end = new Date(contest.end_time);
      const now = new Date();
      
      if (isPast(end)) {
        setTimeRemaining('Contest Ended');
        return;
      }
      
      const seconds = differenceInSeconds(end, now);
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      
      setTimeRemaining(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [contest.end_time]);

  // Load starter code or saved code
  useEffect(() => {
    if (!problem) return;
    
    // Check local storage first
    const savedHtml = localStorage.getItem(`contest_${contest.id}_p${currentProblem}_html`);
    const savedCss = localStorage.getItem(`contest_${contest.id}_p${currentProblem}_css`);
    const savedJs = localStorage.getItem(`contest_${contest.id}_p${currentProblem}_js`);

    setHtml(savedHtml || problem.starterHtml || '');
    setCss(savedCss || problem.starterCss || '');
    setJs(savedJs || problem.starterJs || '');
    
    setTestResults(null);
  }, [currentProblem, contest.id, problem]);

  // Auto-save
  useEffect(() => {
    if (!problem) return;
    const timeout = setTimeout(() => {
      localStorage.setItem(`contest_${contest.id}_p${currentProblem}_html`, html);
      localStorage.setItem(`contest_${contest.id}_p${currentProblem}_css`, css);
      localStorage.setItem(`contest_${contest.id}_p${currentProblem}_js`, js);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [html, css, js, contest.id, currentProblem, problem]);

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

  const handleReset = () => {
    if (!problem) return;
    setHtml(problem.starterHtml || '');
    setCss(problem.starterCss || '');
    setJs(problem.starterJs || '');
    toast.info('Code reset to starter template');
  };

  const handleSubmit = async () => {
    if (!problem) return;
    setIsSubmitting(true);
    
    try {
      // Run tests locally first
      let results: TestRunResult | null = null;
      if (problem.testCases && problem.testCases.length > 0) {
        toast.info('Running validation checks...');
        try {
          results = await runTests(html, css, js, problem.testCases);
          setTestResults(results);
          
          if (results.percentage < 100) {
            setShowTestResults(true);
            setIsSubmitting(false);
            return;
          }
        } catch (error: any) {
          toast.error(`Test error: ${error.message}`);
          setIsSubmitting(false);
          return;
        }
      }

      // If tests pass (or no tests), submit to server
      const code = JSON.stringify({ html, css, js });
      await submitAnswer.mutateAsync({
        contestId: contest.id,
        problemIndex: currentProblem,
        answer: code,
        isCorrect: true, // If we reached here, local tests passed
      });
      
      await refetchParticipation();
      toast.success('Solution submitted successfully!');
      
    } catch (error) {
      console.error('Submission failed:', error);
      toast.error('Failed to submit solution');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resize handlers (simplified for brevity, can copy full logic if needed)
  const handleLeftResize = useCallback((e: React.MouseEvent) => {
    // ... (Same as WebDevContestPlayground)
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = leftWidth;
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const containerWidth = window.innerWidth * 0.95;
      const deltaPercent = (deltaX / containerWidth) * 100;
      setLeftWidth(Math.min(Math.max(startWidth + deltaPercent, 15), 40));
    };
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [leftWidth]);

  const handleRightResize = useCallback((e: React.MouseEvent) => {
    // ... (Same as WebDevContestPlayground)
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = rightWidth;
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = startX - moveEvent.clientX;
      const containerWidth = window.innerWidth * 0.95;
      const deltaPercent = (deltaX / containerWidth) * 100;
      setRightWidth(Math.min(Math.max(startWidth + deltaPercent, 20), 50));
    };
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [rightWidth]);

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-[95vw] w-[95vw] max-h-[95vh] h-[95vh] p-0 bg-[#0d0d0d] border-white/10 overflow-hidden [&>button]:hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#161616]">
            <div className="flex items-center gap-4">
              <DialogTitle className="text-white font-bold text-lg">{contest.title}</DialogTitle>
              <Badge className={`${isPast(new Date(contest.end_time)) ? 'bg-gray-500' : 'bg-red-500 animate-pulse'} text-white`}>
                <Clock className="w-3 h-3 mr-1" />
                {timeRemaining}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Badge className="bg-gradient-to-r from-[#ac1ed6] to-[#c26e73] text-white">
                  Score: {participation?.score || 0}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLeaderboard(!showLeaderboard)}
                  className="border-white/20 text-black hover:text-white hover:bg-white/10"
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  Leaderboard
                </Button>
              </div>

              <Button variant="outline" size="sm" onClick={handleReset} className="border-white/20 text-black hover:text-white hover:bg-white/10">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={isSubmitting || !!submission?.isCorrect}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {submission?.isCorrect ? 'Submitted' : isSubmitting ? 'Submitting...' : 'Submit Solution'}
              </Button>
              
              <Button variant="ghost" size="icon" onClick={onClose} className="text-white/60 hover:text-black">
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Left - Problem Description & Navigation */}
            <div style={{ width: `${leftWidth}%` }} className="border-r border-white/10 flex flex-col bg-[#161616] flex-shrink-0">
              {/* Problem Navigation */}
              <div className="flex items-center gap-2 p-3 border-b border-white/10 overflow-x-auto">
                {problems.map((p: any, index: number) => {
                  const sub = participation?.submissions?.find((s: any) => s.problemIndex === index);
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentProblem(index)}
                      className={`
                        shrink-0 h-8 w-8 p-0
                        ${currentProblem === index ? 'border-[#ac1ed6] bg-[#ac1ed6]/20 text-white' : 'border-white/20 text-white/60'}
                        ${sub?.isCorrect ? 'bg-green-500/20 border-green-500 text-green-400' : ''}
                      `}
                    >
                      {index + 1}
                    </Button>
                  );
                })}
              </div>

              {/* {showLeaderboard ? (
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    Leaderboard
                  </h3>
                  {leaderboard?.map((entry: any, index: number) => (
                    <Card key={entry.id} className="border border-white/10 bg-[#1a1a1a]">
                      <CardContent className="py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-white/10'
                          }`}>
                            {index < 3 ? <Medal className="w-4 h-4 text-white" /> : <span className="text-white text-sm">{index + 1}</span>}
                          </div>
                          <span className="text-white">{entry.profiles?.full_name || entry.profiles?.email || 'Anonymous'}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-[#ac1ed6] font-bold">{entry.score} pts</div>
                          <div className="text-xs text-white/60">{entry.problems_solved} solved</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <div>
                    <h2 className="text-white font-bold text-lg mb-2">{problem?.title}</h2>
                    <Badge className="bg-white/10 text-white border-white/20 mb-4">
                      {problem?.difficulty}
                    </Badge>
                    <div className="text-white/70 text-sm leading-relaxed prose prose-invert max-w-none">
                      <ReactMarkdown>{problem?.description || ''}</ReactMarkdown>
                    </div>
                  </div>

                  {problem?.media && problem.media.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-white font-semibold mb-2">Media</h3>
                      {problem.media.map((item: any, index: number) => (
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
                </div>
              )} */}
            </div> 

            {/* Left Resize Handle */}
            <div
              onMouseDown={handleLeftResize}
              className="w-1 bg-white/10 hover:bg-[#ac1ed6] cursor-col-resize transition-colors flex-shrink-0 relative group"
            >
              <div className="absolute inset-y-0 -left-1 -right-1" />
            </div>

            {/* Middle - Code Editor */}
            <div style={{ width: `${100 - leftWidth - rightWidth}%` }} className="flex flex-col flex-shrink-0">
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
                    automaticLayout: true,
                    tabSize: 2,
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

      {/* Test Results Dialog */}
      <Dialog open={showTestResults} onOpenChange={setShowTestResults}>
        <DialogContent className="bg-[#0d0d0d] border-white/10 max-w-2xl [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              Validation Issues
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Some requirements are missing. Please fix them to submit.
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
              className="border-white/20 text-white hover:bg-white/10"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
