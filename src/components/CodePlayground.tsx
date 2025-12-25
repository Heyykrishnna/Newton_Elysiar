import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Terminal, FileCode, RotateCcw, Code2, Info, Maximize2, Minimize2, Sparkles, Lock, CheckCircle2, AlertTriangle, Lightbulb, Brain } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import Editor from '@monaco-editor/react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { CodeAnalyzer } from './CodeAnalyzer';

const DEFAULT_PYTHON_CODE = `# Write your Python solution here
def solution():
    # Your code here
    print("Hello from the Playground!")

# Test your solution
if __name__ == "__main__":
    solution()
`;

const DEFAULT_JAVASCRIPT_CODE = `// Write your JavaScript solution here
function solution() {
    // Your code here
    console.log("Hello from the Playground!");
}

// Test your solution
solution();
`;

export function CodePlayground() {
  const [selectedLanguage, setSelectedLanguage] = useState<'python' | 'javascript'>('python');
  const [code, setCode] = useState(DEFAULT_PYTHON_CODE);
  const [output, setOutput] = useState<{ stdout: string; stderr: string } | null>(null);
  const [customInput, setCustomInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // AI Analyzer States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    strengths: string[];
    improvements: string[];
    suggestions: string;
    correctedCode?: string;
  } | null>(null);
  const [showAnalysisDialog, setShowAnalysisDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const ADMIN_PASSWORD = 'ingypNDmjHOtz1oFHxhHUc2Zh';
  
  // Code Analyzer States
  const [showCodeAnalyzer, setShowCodeAnalyzer] = useState(false);

  const checkAnalysisLimit = () => {
    const storageKey = 'ai_code_analysis_usage';
    const stored = localStorage.getItem(storageKey);
    const now = new Date();

    if (!stored) return true;

    try {
      const data = JSON.parse(stored);
      const lastUsed = new Date(data.date);
      // Reset if more than 7 days have passed since the first usage in the cycle
      const daysSince = (now.getTime() - lastUsed.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysSince >= 7) {
         return true;
      }

      return data.count < 2;
    } catch {
      return true;
    }
  };

  const incrementAnalysisCount = () => {
    const storageKey = 'ai_code_analysis_usage';
    const stored = localStorage.getItem(storageKey);
    const now = new Date().toISOString();

    if (!stored) {
      localStorage.setItem(storageKey, JSON.stringify({ date: now, count: 1 }));
      return;
    }

    try {
      const data = JSON.parse(stored);
      const lastUsed = new Date(data.date);
      const daysSince = (new Date().getTime() - lastUsed.getTime()) / (1000 * 60 * 60 * 24);

      if (daysSince >= 7) {
         // Reset cycle
         localStorage.setItem(storageKey, JSON.stringify({ date: now, count: 1 }));
      } else {
         // Increment
         localStorage.setItem(storageKey, JSON.stringify({ ...data, count: data.count + 1 }));
      }
    } catch {
      localStorage.setItem(storageKey, JSON.stringify({ date: now, count: 1 }));
    }
  };

  const handleAnalyzeCode = async () => {
    if (!code.trim()) {
      toast.error('Please write some code first!');
      return;
    }

    if (!checkAnalysisLimit()) {
      setShowPasswordDialog(true);
      return;
    }

    await executeAnalysis();
  };

  const handlePasswordSubmit = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setShowPasswordDialog(false);
      setPasswordInput('');
      executeAnalysis();
    } else {
      toast.error('Incorrect password');
    }
  };

  const executeAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-learning', {
        body: {
          action: 'analyze_code',
          code,
          language: selectedLanguage
        }
      });

      if (error) throw error;

      setAnalysisResult(data);
      setShowAnalysisDialog(true);
      incrementAnalysisCount();
      toast.success('Analysis complete!');
    } catch (error) {
      console.error('Analysis failed:', error);
      toast.error('Failed to analyze code. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const executeCode = useCallback(async () => {
    setIsRunning(true);
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
          stdin: customInput,
        }),
      });

      const result = await response.json();
      
      if (result.run) {
        setOutput({
          stdout: result.run.stdout || '',
          stderr: result.run.stderr || ''
        });
        if (result.run.stderr) {
            toast.error('Execution finished with errors');
        } else {
            toast.success('Execution successful');
        }
      } else {
        setOutput({ stdout: '', stderr: 'Error executing code. Please try again.' });
        toast.error('Error executing code');
      }
    } catch (error) {
      setOutput({ stdout: '', stderr: 'Error connecting to code execution service. Please try again.' });
      toast.error('Network error');
    }
    
    setIsRunning(false);
  }, [code, customInput, selectedLanguage]);

  const handleLanguageChange = (lang: 'python' | 'javascript') => {
      setSelectedLanguage(lang);
      const defaultCode = lang === 'python' ? DEFAULT_PYTHON_CODE : DEFAULT_JAVASCRIPT_CODE;
      // Only reset if the code is empty or matches the other language's default
      if (code === DEFAULT_PYTHON_CODE || code === DEFAULT_JAVASCRIPT_CODE || !code.trim()) {
          setCode(defaultCode);
      }
  };

  const toggleFullScreen = () => {
      setIsFullScreen(!isFullScreen);
  };

  return (
    <>
        <motion.div
            layout
            className={`
                bg-[#221f20] border-2 border-white/10 shadow-lg rounded-2xl overflow-hidden flex flex-col
                ${isFullScreen ? 'fixed inset-0 z-50 rounded-none h-screen w-screen' : 'h-[800px] relative'}
            `}
            transition={{ duration: 0.3 }}
        >
        <CardHeader className="bg-gradient-to-r from-[#ac1ed6]/5 to-[#c26e73]/5 border-b border-white/10 shrink-0">
            <div className="flex items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2 text-white text-2xl">
                        <Code2 className="w-6 h-6 text-[#ac1ed6]" />
                        Elysiar Lab - Code Playground
                    </CardTitle>
                    {!isFullScreen && (
                        <CardDescription className="text-white/60 text-base mt-1">
                            Practice coding in a sandboxed environment. Write, run, and test your code freely.
                        </CardDescription>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                        <Info className="w-4 h-4 text-[#c26e73]" />
                        <span className="text-xs text-white/60">
                            Python 3.10 • Node.js 18.15
                        </span>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleFullScreen}
                        className="text-white/60 hover:text-white hover:bg-white/10"
                    >
                        {isFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                    </Button>
                </div>
            </div>
        </CardHeader>
        
        <CardContent className="p-0 flex-1 flex flex-col overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-[#1a1a1a] shrink-0">
                <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-white/60" />
                    <span className="text-sm text-white/60 font-medium">Editor</span>
                </div>
                
                <div className="flex items-center gap-2">
                    {/* Language Selector */}
                    <select
                        value={selectedLanguage}
                        onChange={(e) => handleLanguageChange(e.target.value as 'python' | 'javascript')}
                        className="h-8 px-3 bg-[#0d0d0d] border border-white/20 rounded-md text-white text-sm hover:border-[#ac1ed6] focus:border-[#ac1ed6] focus:outline-none cursor-pointer transition-colors"
                    >
                        <option value="python">Python 3.10</option>
                        <option value="javascript">JavaScript (Node.js)</option>
                    </select>
                    
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                        const defaultCode = selectedLanguage === 'python' ? DEFAULT_PYTHON_CODE : DEFAULT_JAVASCRIPT_CODE;
                        setCode(defaultCode);
                        }}
                        className="border-white/20 hover:text-white text-black hover:bg-white/10"
                    >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Reset
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowCodeAnalyzer(true)}
                        disabled={isRunning}
                        className="border-[#ac1ed6]/50 text-[#ac1ed6] hover:bg-[#ac1ed6]/10 hover:text-[#ac1ed6]"
                    >
                        <Brain className="w-4 h-4 mr-1" />
                        Visualize
                    </Button>
                    <Button
                        size="sm"
                        onClick={executeCode}
                        disabled={isRunning}
                        className="bg-gradient-to-r from-[#ac1ed6] to-[#c26e73] hover:from-[#c26e73] hover:to-[#ac1ed6] text-white transition-all duration-300"
                    >
                        <Play className="w-4 h-4 mr-1" />
                        {isRunning ? 'Running...' : 'Run Code'}
                    </Button>
                </div>
            </div>

            {/* Main Content Area - Split View */}
            <div className={`flex-1 flex overflow-hidden ${isFullScreen ? 'flex-row' : 'flex-col'}`}>
                
                {/* Code Editor Section */}
                <div className={`flex-1 relative overflow-hidden ${isFullScreen ? 'border-r border-white/10' : 'border-b border-white/10'}`}>
                    <Editor
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
                            // Enable IntelliSense and code recommendations
                            suggestOnTriggerCharacters: true,
                            quickSuggestions: {
                                other: true,
                                comments: false,
                                strings: true
                            },
                            parameterHints: {
                                enabled: true
                            },
                            suggest: {
                                showKeywords: true,
                                showSnippets: true,
                                showFunctions: true,
                                showVariables: true,
                                showModules: true,
                            },
                            acceptSuggestionOnEnter: 'on',
                            tabCompletion: 'on',
                            wordBasedSuggestions: 'allDocuments',
                        }}
                    />
                </div>

                {/* Console/Output Section */}
                <div className={`
                    bg-[#0d0d0d] flex flex-col shrink-0
                    ${isFullScreen ? 'w-[40%] h-full border-l border-white/10' : 'h-[55%] w-full border-t border-white/10'}
                `}>
                    {/* Console Header */}
                    <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-[#1a1a1a] shrink-0">
                        <div className="flex items-center gap-2">
                            <Terminal className="w-4 h-4 text-white/60" />
                            <span className="text-sm text-white/60 font-medium">Console</span>
                        </div>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setCustomInput('')}
                            className="h-6 text-xs text-white/70 hover:text-black"
                        >
                            Clear Input
                        </Button>
                    </div>

                    <div className="flex-1 flex flex-col overflow-hidden">
                        {/* Input Section */}
                        <div className="p-4 border-b border-white/10 bg-[#1a1a1a]/50 shrink-0">
                            <div className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-2">Standard Input (Stdin)</div>
                            <textarea
                                value={customInput}
                                onChange={(e) => setCustomInput(e.target.value)}
                                placeholder="Enter input for your program here... (If Required)"
                                className="w-full h-20 bg-[#0d0d0d] border border-white/10 rounded-md p-3 text-white font-mono text-sm resize-none focus:outline-none focus:border-[#ac1ed6] transition-colors"
                            />
                        </div>

                        {/* Output Section */}
                        <div className="flex-1 p-4 overflow-auto">
                            <div className="text-xs text-white/40 mb-2 uppercase tracking-wider font-semibold">Output</div>
                            {output ? (
                                <div className="font-mono text-sm whitespace-pre-wrap bg-[#1a1a1a] p-4 rounded-lg border border-white/10 min-h-[100px]">
                                    {output.stdout && <span className="text-white">{output.stdout}</span>}
                                    {output.stderr && (
                                        <>
                                            {output.stdout && <br />}
                                            <span className="text-red-400">{output.stderr}</span>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div className="text-white/40 italic p-4 text-center border border-dashed border-white/10 rounded-lg h-full flex items-center justify-center flex-col gap-2">
                                    <Terminal className="w-8 h-8 opacity-50" />
                                    <p>Click "Run Code" to execute your program</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </CardContent>
        </motion.div>

        {/* AI Analysis Result Dialog */}
        <Dialog open={showAnalysisDialog} onOpenChange={setShowAnalysisDialog}>
            <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-[#1a1a1a] border-white/10">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-white text-xl">
                        <Sparkles className="w-5 h-5 text-blue-400" />
                        AI Code Analysis
                    </DialogTitle>
                    <DialogDescription className="text-white/60">
                        Here's some feedback on your code to help you improve.
                    </DialogDescription>
                </DialogHeader>
                
                {analysisResult && (
                    <div className="space-y-6 py-4">
                        {/* Suggestions */}
                        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                            <h3 className="flex items-center gap-2 text-blue-400 font-semibold mb-2">
                                <Info className="w-4 h-4" />
                                Review
                            </h3>
                            <p className="text-gray-200 leading-relaxed">{analysisResult.suggestions}</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            {/* Strengths */}
                            <div className="space-y-3">
                                <h3 className="flex items-center gap-2 text-green-400 font-semibold">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Strengths
                                </h3>
                                <ul className="space-y-2">
                                    {analysisResult.strengths?.map((strength, idx) => (
                                        <li key={idx} className="flex gap-2 text-sm text-gray-300 bg-white/5 p-2 rounded-lg">
                                            <span className="text-green-500">•</span>
                                            {strength}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Improvements */}
                            <div className="space-y-3">
                                <h3 className="flex items-center gap-2 text-yellow-400 font-semibold">
                                    <Lightbulb className="w-4 h-4" />
                                    Areas for Improvement
                                </h3>
                                <ul className="space-y-2">
                                    {analysisResult.improvements?.map((improvement, idx) => (
                                        <li key={idx} className="flex gap-2 text-sm text-gray-300 bg-white/5 p-2 rounded-lg">
                                            <span className="text-yellow-500">•</span>
                                            {improvement}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Corrected Code */}
                        {analysisResult.correctedCode && (
                            <div className="space-y-2">
                                <h3 className="flex items-center gap-2 text-purple-400 font-semibold">
                                    <Code2 className="w-4 h-4" />
                                    Suggested Implementation
                                </h3>
                                <div className="bg-[#0d0d0d] border border-white/10 rounded-xl overflow-hidden">
                                     <Editor
                                        height="300px"
                                        language={selectedLanguage}
                                        theme="vs-dark"
                                        value={analysisResult.correctedCode}
                                        options={{
                                            readOnly: true,
                                            minimap: { enabled: false },
                                            fontSize: 12,
                                            fontFamily: "'Fira Code', 'Monaco', 'Menlo', monospace",
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}
                <DialogFooter>
                    <Button onClick={() => setShowAnalysisDialog(false)} className="bg-white/10 hover:bg-white/20 text-white">
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* Password Dialog for Limit Override */}
        <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
            <DialogContent className="sm:max-w-md bg-[#221f20] border-white/10">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-white">
                        <Lock className="w-5 h-5 text-red-400" />
                        Weekly Limit Reached
                    </DialogTitle>
                    <DialogDescription className="text-white/60">
                         You have used your 2 free AI analyses for this week. Enter the admin password to unlock more.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-white">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter admin password"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handlePasswordSubmit();
                            }}
                            className="bg-[#0d0d0d] border-white/20 text-white focus:border-[#ac1ed6]"
                        />
                    </div>
                </div>
                <DialogFooter className="flex gap-2">
                    <Button
                        variant="ghost"
                        onClick={() => setShowPasswordDialog(false)}
                        className="text-white/60 hover:text-white"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handlePasswordSubmit}
                        className="bg-red-500 hover:bg-red-600 text-white"
                    >
                        Unlock
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* Code Analyzer Modal */}
        <CodeAnalyzer
            code={code}
            language={selectedLanguage}
            isOpen={showCodeAnalyzer}
            onClose={() => setShowCodeAnalyzer(false)}
        />
    </>
  );
}
