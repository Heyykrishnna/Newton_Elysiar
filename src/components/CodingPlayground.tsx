import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, CheckCircle, XCircle, Clock, Trophy, Medal, ChevronLeft, ChevronRight, Code2, Terminal, FileCode, RotateCcw, PanelLeftClose, PanelLeft, Brain, RefreshCw } from 'lucide-react';
import { format, differenceInSeconds, isPast } from 'date-fns';
import { motion } from 'framer-motion';
import { useContestParticipation, useContestLeaderboard, useSubmitContestAnswer, CodingContest } from '@/hooks/useCodingContests';
import { toast } from 'sonner';
import Editor from '@monaco-editor/react';
import { CodeAnalyzer } from './CodeAnalyzer';

interface CodingPlaygroundProps {
  contest: CodingContest;
  onClose: () => void;
}

const DEFAULT_PYTHON_CODE = `# Write your Python solution here
def solution():
    # Your code here
    pass

# Test your solution
if __name__ == "__main__":
    result = solution()
    print(result)
`;

const DEFAULT_JAVASCRIPT_CODE = `// Write your JavaScript solution here
function solution() {
    // Your code here
}

// Test your solution
const result = solution();
console.log(result);
`;

export function CodingPlayground({ contest, onClose }: CodingPlaygroundProps) {
  const { data: participation, refetch: refetchParticipation } = useContestParticipation(contest.id);
  const { data: leaderboard, refetch: refetchLeaderboard } = useContestLeaderboard(contest.id);
  const submitAnswer = useSubmitContestAnswer();
  
  const [currentProblem, setCurrentProblem] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState<'python' | 'javascript'>('python');
  const [code, setCode] = useState(DEFAULT_PYTHON_CODE);
  const [output, setOutput] = useState<{ stdout: string; stderr: string } | null>(null);
  const [customInput, setCustomInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showProblemPanel, setShowProblemPanel] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [activeTab, setActiveTab] = useState('code');
  const [showCodeAnalyzer, setShowCodeAnalyzer] = useState(false);

  const problems = (contest.problems as any[]) || [];
  const problem = problems[currentProblem];

  // Timer countdown
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

  // Load saved code for current problem and language
  useEffect(() => {
    const savedCode = localStorage.getItem(`contest_${contest.id}_problem_${currentProblem}_${selectedLanguage}`);
    if (savedCode) {
      setCode(savedCode);
    } else {
      const defaultCode = selectedLanguage === 'python' ? DEFAULT_PYTHON_CODE : DEFAULT_JAVASCRIPT_CODE;
      setCode(problem?.starterCode || defaultCode);
    }
    setOutput(null);
    setCustomInput('');
  }, [currentProblem, contest.id, problem?.starterCode, selectedLanguage]);

  // Auto-save code per language
  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem(`contest_${contest.id}_problem_${currentProblem}_${selectedLanguage}`, code);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [code, contest.id, currentProblem, selectedLanguage]);

  const runCode = useCallback(async () => {
    setIsRunning(true);
    setActiveTab('output');
    setOutput({ stdout: 'Running...', stderr: '' });
    
    try {
      // Determine language configuration for Piston API
      const languageConfig = selectedLanguage === 'python' 
        ? { language: 'python', version: '3.10.0', fileName: 'main.py' }
        : { language: 'javascript', version: '18.15.0', fileName: 'main.js' };
      
      // Use Piston API for code execution
      const response = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: languageConfig.language,
          version: languageConfig.version,
          files: [{ name: languageConfig.fileName, content: code }],
          stdin: customInput || problem?.testInput || '',
        }),
      });

      const result = await response.json();
      
      if (result.run) {
        setOutput({
          stdout: result.run.stdout || '',
          stderr: result.run.stderr || ''
        });
      } else {
        setOutput({ stdout: '', stderr: 'Error executing code. Please try again.' });
      }
    } catch (error) {
      setOutput({ stdout: '', stderr: 'Error connecting to code execution service. Please try again.' });
    }
    
    setIsRunning(false);
  }, [code, customInput, problem?.testInput, selectedLanguage]);

  const submitSolution = async () => {
    setIsRunning(true);
    setActiveTab('output');
    setOutput({ stdout: 'Running tests...', stderr: '' });
    
    try {
      // Determine language configuration
      const languageConfig = selectedLanguage === 'python' 
        ? { language: 'python', version: '3.10.0', fileName: 'main.py' }
        : { language: 'javascript', version: '18.15.0', fileName: 'main.js' };
      
      // Run against test cases
      const testCases = problem?.testCases || [];
      let allPassed = true;
      let testOutput = '';

      for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        
        const response = await fetch('https://emkc.org/api/v2/piston/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            language: languageConfig.language,
            version: languageConfig.version,
            files: [{ name: languageConfig.fileName, content: code }],
            stdin: testCase.input || '',
          }),
        });

        const result = await response.json();
        const actualOutput = (result.run?.stdout || '').trim();
        const expectedOutput = (testCase.expectedOutput || '').trim();
        
        const passed = actualOutput === expectedOutput;
        if (!passed) allPassed = false;
        
        testOutput += `Test ${i + 1}: ${passed ? '✓ Passed' : '✗ Failed'}\n`;
        if (!passed) {
          testOutput += `  Expected: ${expectedOutput}\n`;
          testOutput += `  Got: ${actualOutput}\n`;
        }
      }

      setOutput({ stdout: testOutput || 'No test cases defined for this problem.', stderr: '' });

      // Submit the answer
      const submission = participation?.submissions?.find((s: any) => s.problemIndex === currentProblem);
      if (!submission?.isCorrect) {
        await submitAnswer.mutateAsync({
          contestId: contest.id,
          problemIndex: currentProblem,
          answer: code,
          isCorrect: allPassed,
        });
        await refetchParticipation();
      }

      if (allPassed) {
        toast.success('All test cases passed! +100 points');
      } else {
        toast.error('Some test cases failed. Keep trying!');
      }
    } catch (error) {
      setOutput({ stdout: '', stderr: 'Error running tests. Please try again.' });
      toast.error('Error submitting solution');
    }
    
    setIsRunning(false);
  };

  const submission = participation?.submissions?.find((s: any) => s.problemIndex === currentProblem);

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-[95vw] w-full max-h-[95vh] h-full overflow-hidden bg-[#0d0d0d] border-white/10 p-0">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 pr-14 border-b border-white/10 bg-[#1a1a1a]">
          <div className="flex items-center gap-3 flex-wrap">
            <DialogTitle className="text-white text-lg font-bold">{contest.title}</DialogTitle>
            <Badge className={`${isPast(new Date(contest.end_time)) ? 'bg-gray-500' : 'bg-red-500 animate-pulse'} text-white`}>
              <Clock className="w-3 h-3 mr-1" />
              {timeRemaining}
            </Badge>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className="bg-gradient-to-r from-[#ac1ed6] to-[#c26e73] text-white text-xs sm:text-sm">
              Score: {participation?.score || 0}
            </Badge>
            <Badge className="bg-white/10 text-white border border-white/20 text-xs sm:text-sm">
              {participation?.submissions?.length || 0}/{problems.length}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLeaderboard(!showLeaderboard)}
              className="border-white/20 hover:text-white text-black hover:bg-white/10 h-8"
            >
              <Trophy className="w-4 h-4 sm:mr-1" />
              <span className="hidden sm:inline">Leaderboard</span>
            </Button>
          </div>
        </div>

        <div className="flex h-[calc(95vh-60px)]">
          {/* Problem Panel - Conditionally Rendered */}
          {showProblemPanel && (
            <div className="w-[400px] min-w-[350px] max-w-[500px] border-r border-white/10 flex flex-col">
              {/* Problem Navigation */}
              <div className="flex items-center gap-2 p-3 border-b border-white/10 bg-[#1a1a1a] overflow-x-auto">
                {problems.map((p: any, index: number) => {
                  const sub = participation?.submissions?.find((s: any) => s.problemIndex === index);
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentProblem(index)}
                      className={`
                        shrink-0
                        ${currentProblem === index ? 'border-[#ac1ed6] bg-[#ac1ed6]/20 text-black' : 'border-white/20 text-black'}
                        ${sub?.isCorrect ? 'bg-green-500/20 border-green-500' : sub ? 'bg-red-500/20 border-red-500' : ''}
                        text-white hover:text-white bg-white/50 hover:bg-white/20
                      `}
                    >
                      {sub?.isCorrect ? <CheckCircle className="w-3 h-3 mr-1" /> : sub ? <XCircle className="w-3 h-3 mr-1" /> : null}
                      {index + 1}
                    </Button>
                  );
                })}
              </div>

              {/* Problem Content */}
              {showLeaderboard ? (
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      Leaderboard
                    </h3>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => refetchLeaderboard()}
                      className="border-white/20 text-white hover:bg-white/10 h-8"
                    >
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Refresh
                    </Button>
                  </div>
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
              ) : problem ? (
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xl font-bold text-white">{problem.title}</h2>
                        <Badge className={`${
                          problem.difficulty === 'easy' ? 'bg-green-500' :
                          problem.difficulty === 'medium' ? 'bg-yellow-500' :
                          'bg-red-500'
                        } text-white`}>
                          {problem.difficulty}
                        </Badge>
                      </div>
                      <p className="text-white/80 leading-relaxed">{problem.description}</p>
                    </div>

                    {problem.example && (
                      <div className="p-4 bg-[#1a1a1a] rounded-lg border border-white/10">
                        <p className="text-sm text-white/60 mb-2 font-semibold">Example:</p>
                        <pre className="text-white text-sm whitespace-pre-wrap font-mono">{problem.example}</pre>
                      </div>
                    )}

                    {problem.constraints && (
                      <div className="p-4 bg-[#1a1a1a] rounded-lg border border-white/10">
                        <p className="text-sm text-white/60 mb-2 font-semibold">Constraints:</p>
                        <pre className="text-white text-sm whitespace-pre-wrap font-mono">{problem.constraints}</pre>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-white/60">
                  No problems available
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between p-3 border-t border-white/10 bg-[#1a1a1a] pb-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentProblem(Math.max(0, currentProblem - 1))}
                  disabled={currentProblem === 0}
                  className="border-white/20 text-black hover:bg-white/10 hover:text-white"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
                <span className="text-white/60 text-sm">
                  {currentProblem + 1} / {problems.length}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentProblem(Math.min(problems.length - 1, currentProblem + 1))}
                  disabled={currentProblem === problems.length - 1}
                  className="border-white/20 text-black hover:bg-white/10 hover:text-white"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* Code Editor Panel */}
          <div className="flex-1 w-full flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col w-full">
              <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-[#1a1a1a]">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowProblemPanel(!showProblemPanel)}
                    className="text-white hover:text-white hover:bg-white/20 h-8 px-2 border border-white/20"
                    title={showProblemPanel ? "Hide problem panel" : "Show problem panel"}
                  >
                    {showProblemPanel ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeft className="w-5 h-5" />}
                  </Button>
                  <TabsList className="bg-[#0d0d0d] border border-white/10">
                    <TabsTrigger value="code" className="text-white/60 data-[state=active]:bg-white/10 data-[state=active]:text-white">
                      <FileCode className="w-4 h-4 mr-2" />
                      Code
                    </TabsTrigger>
                    <TabsTrigger value="output" className="text-white/60 data-[state=active]:bg-white/10 data-[state=active]:text-white">
                      <Terminal className="w-4 h-4 mr-2" />
                      Console
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Language Selector */}
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value as 'python' | 'javascript')}
                    className="h-8 px-3 bg-[#0d0d0d] border border-white/20 rounded-md text-white text-sm hover:border-blue-400 focus:border-blue-400 focus:outline-none cursor-pointer"
                  >
                    <option value="python">Python 3.10</option>
                    <option value="javascript">JavaScript (Node.js)</option>
                  </select>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowCodeAnalyzer(true)}
                    className="border-[#ac1ed6]/50 text-[#ac1ed6] hover:bg-[#ac1ed6]/10 hover:text-[#ac1ed6]"
                  >
                    <Brain className="w-4 h-4 mr-1" />
                    Analyze
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const defaultCode = selectedLanguage === 'python' ? DEFAULT_PYTHON_CODE : DEFAULT_JAVASCRIPT_CODE;
                      setCode(problem?.starterCode || defaultCode);
                    }}
                    className="border-white/20 hover:text-white text-black hover:bg-white/10"
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Reset
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setActiveTab('output')}
                    disabled={isRunning}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Run...
                  </Button>
                  <Button
                    size="sm"
                    onClick={submitSolution}
                    disabled={isRunning || submission?.isCorrect}
                    className="bg-gradient-to-r from-[#ac1ed6] to-[#c26e73] text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Submit
                  </Button>
                </div>
              </div>

              <TabsContent value="code" className="flex-1 m-0 overflow-hidden">
                <Editor
                  key={`editor-${showProblemPanel}`}
                  height="100%"
                  language={selectedLanguage}
                  theme="vs-dark"
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  options={{
                    fontSize: 12,
                    fontFamily: "'Fira Code', 'Monaco', 'Menlo', monospace",
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 4,
                    wordWrap: 'on',
                    lineNumbers: 'on',
                    renderLineHighlight: 'all',
                    cursorBlinking: 'smooth',
                    smoothScrolling: true,
                    padding: { top: 16 },
                  }}
                />
              </TabsContent>

              <TabsContent value="output" className="flex-1 m-0 overflow-hidden flex flex-col bg-[#0d0d0d]">
                {/* Input Section */}
                <div className="h-[180px] p-4 border-b border-white/10 flex flex-col bg-[#1a1a1a]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs text-white/40 uppercase tracking-wider font-semibold">Standard Input (Stdin)</div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setCustomInput('')}
                      className="h-6 text-xs text-white/40 hover:text-white"
                    >
                      Clear
                    </Button>
                  </div>
                  <textarea
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="Enter input for your program here (if required)..."
                    className="flex-1 bg-[#0d0d0d] border border-white/10 rounded-md p-3 text-white font-mono text-sm resize-none focus:outline-none focus:border-[#ac1ed6] transition-colors"
                  />
                </div>

                {/* Execution Controls */}
                <div className="p-2 border-b border-white/10 bg-[#1a1a1a] flex justify-end">
                  <Button
                    size="sm"
                    onClick={runCode}
                    disabled={isRunning}
                    className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Execute Code
                  </Button>
                </div>

                {/* Output Section */}
                <div className="flex-1 p-4 overflow-auto">
                  <div className="text-xs text-white/40 mb-2 uppercase tracking-wider font-semibold">Output</div>
                  {output ? (
                    <div className="font-mono text-sm whitespace-pre-wrap bg-[#1a1a1a] p-4 rounded-lg border border-white/10">
                      {output.stdout && <span className="text-white">{output.stdout}</span>}
                      {output.stderr && (
                        <>
                          {output.stdout && <br />}
                          <span className="text-red-400">{output.stderr}</span>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="text-white/40 italic p-4 text-center border border-dashed border-white/10 rounded-lg">
                      Click "Execute Code" to run your program
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Code Analyzer Modal */}
        <CodeAnalyzer
          code={code}
          language={selectedLanguage}
          isOpen={showCodeAnalyzer}
          onClose={() => setShowCodeAnalyzer(false)}
        />
      </DialogContent>
    </Dialog>
  );
}