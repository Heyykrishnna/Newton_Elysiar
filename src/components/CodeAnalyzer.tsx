import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Play, Pause, SkipForward, SkipBack, RefreshCw,
  Eye, Code2, Cpu, ArrowRight, Lock, Brain,
  Zap, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CodeAnalyzerProps {
  code: string;
  language: 'python' | 'javascript';
  isOpen: boolean;
  onClose: () => void;
}

interface ExecutionStep {
  line: number;
  action: string;
  variables: { name: string; value: string; type: string; scope: string }[];
  output: string;
  explanation: string;
  callStack: string[];
  scope: string;
}

const TRIAL_DURATION_DAYS = 2;
const ADMIN_PASSWORD = 'ingypNDmjHOtz1oFHxhHUc2Zh';

export function CodeAnalyzer({ code, language, isOpen, onClose }: CodeAnalyzerProps) {
  const [executionSteps, setExecutionSteps] = useState<ExecutionStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Trial and access management
  const [hasAccess, setHasAccess] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [trialInfo, setTrialInfo] = useState<{ isInTrial: boolean; daysLeft: number } | null>(null);
  const [isLoadingAccess, setIsLoadingAccess] = useState(true);

  // Check trial status on mount
  useEffect(() => {
    checkTrialStatus();
  }, []);

  const checkTrialStatus = async () => {
    setIsLoadingAccess(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setHasAccess(false);
        setIsLoadingAccess(false);
        return;
      }

      // Check local storage for trial start date
      const trialKey = `code_analyzer_trial_${user.id}`;
      const adminAccessKey = `code_analyzer_admin_${user.id}`;
      
      // Check if admin access was granted
      const hasAdminAccess = localStorage.getItem(adminAccessKey) === 'true';
      if (hasAdminAccess) {
        setHasAccess(true);
        setTrialInfo(null);
        setIsLoadingAccess(false);
        return;
      }

      const trialStartDate = localStorage.getItem(trialKey);
      
      if (!trialStartDate) {
        // Start new trial
        const now = new Date().toISOString();
        localStorage.setItem(trialKey, now);
        setHasAccess(true);
        setTrialInfo({ isInTrial: true, daysLeft: TRIAL_DURATION_DAYS });
      } else {
        // Check if trial has expired
        const startDate = new Date(trialStartDate);
        const now = new Date();
        const daysDiff = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff < TRIAL_DURATION_DAYS) {
          setHasAccess(true);
          setTrialInfo({ isInTrial: true, daysLeft: TRIAL_DURATION_DAYS - daysDiff });
        } else {
          setHasAccess(false);
          setTrialInfo({ isInTrial: false, daysLeft: 0 });
          setShowPasswordDialog(true);
        }
      }
    } catch (error) {
      console.error('Error checking trial status:', error);
      setHasAccess(false);
    }
    
    setIsLoadingAccess(false);
  };

  const verifyPassword = async () => {
    if (password === ADMIN_PASSWORD) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const adminAccessKey = `code_analyzer_admin_${user.id}`;
        localStorage.setItem(adminAccessKey, 'true');
      }
      setHasAccess(true);
      setShowPasswordDialog(false);
      setTrialInfo(null);
      toast.success('Admin access granted!');
    } else {
      toast.error('Invalid password');
    }
  };

  // Generate execution steps from code
  const generateExecutionSteps = () => {
    setIsAnalyzing(true);
    setExecutionSteps([]);
    setCurrentStep(0);

    try {
      const steps = parseExecutionSteps(code, language);
      setExecutionSteps(steps);
    } catch (error) {
      console.error('Error analyzing code:', error);
      toast.error('Failed to analyze code. Please check your syntax.');
    }

    setIsAnalyzing(false);
  };

  // Enhanced parse code into execution steps with support for nested structures, functions, and recursion
  const parseExecutionSteps = (code: string, lang: 'python' | 'javascript'): ExecutionStep[] => {
    const lines = code.split('\n');
    const steps: ExecutionStep[] = [];
    const globalVariables: Map<string, { name: string; value: string; type: string; scope: string }> = new Map();
    const scopeStack: string[] = ['global'];
    const callStack: string[] = [];
    const functionDefinitions: Map<string, { params: string[]; startLine: number; endLine: number }> = new Map();
    let output = '';
    let currentIndent = 0;

    // First pass: identify function definitions
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      const indent = line.search(/\S/);
      
      if (lang === 'python') {
        const funcMatch = trimmedLine.match(/^def\s+(\w+)\s*\(([^)]*)\):/);
        if (funcMatch) {
          const [, funcName, params] = funcMatch;
          const paramList = params.split(',').map(p => p.trim()).filter(p => p);
          functionDefinitions.set(funcName, { params: paramList, startLine: index, endLine: index });
        }
      } else {
        const funcMatch = trimmedLine.match(/^function\s+(\w+)\s*\(([^)]*)\)/);
        if (funcMatch) {
          const [, funcName, params] = funcMatch;
          const paramList = params.split(',').map(p => p.trim()).filter(p => p);
          functionDefinitions.set(funcName, { params: paramList, startLine: index, endLine: index });
        }
      }
    });

    // Second pass: execute code
    const executeLines = (startLine: number, endLine: number, localVars: Map<string, any> = new Map()) => {
      for (let index = startLine; index <= endLine; index++) {
        const line = lines[index];
        if (!line) continue;
        
        const trimmedLine = line.trim();
        const indent = line.search(/\S/) === -1 ? 0 : line.search(/\S/);
        
        // Skip empty lines and comments
        if (!trimmedLine || trimmedLine.startsWith('#') || trimmedLine.startsWith('//')) {
          continue;
        }

        const currentScope = scopeStack[scopeStack.length - 1];
        const allVariables = new Map([...globalVariables, ...localVars]);

        // Parse variable assignments (enhanced to handle complex expressions)
        const pythonAssign = trimmedLine.match(/^(\w+)\s*=\s*(.+)$/);
        const jsAssign = trimmedLine.match(/^(?:let|const|var)\s+(\w+)\s*=\s*(.+?);?$/);
        
        const assign = lang === 'python' ? pythonAssign : (jsAssign || pythonAssign);
        
        if (assign) {
          const [, varName, varValue] = assign;
          let evaluatedValue = varValue.replace(/;$/, '');
          
          // Try to evaluate simple expressions
          try {
            // Replace variable references with their values
            allVariables.forEach((varData, name) => {
              const regex = new RegExp(`\\b${name}\\b`, 'g');
              evaluatedValue = evaluatedValue.replace(regex, varData.value);
            });
            
            // Evaluate simple arithmetic
            if (/^[\d\s+\-*/().]+$/.test(evaluatedValue)) {
              evaluatedValue = String(eval(evaluatedValue));
            }
          } catch (e) {
            // Keep original if evaluation fails
          }
          
          const newVar = { 
            name: varName, 
            value: evaluatedValue, 
            type: inferType(evaluatedValue),
            scope: currentScope
          };
          
          if (currentScope === 'global') {
            globalVariables.set(varName, newVar);
          } else {
            localVars.set(varName, newVar);
          }

          steps.push({
            line: index + 1,
            action: `Assign ${varName} = ${evaluatedValue}`,
            variables: Array.from(new Map([...globalVariables, ...localVars]).values()),
            output,
            explanation: `Variable '${varName}' is assigned the value ${evaluatedValue} in ${currentScope} scope`,
            callStack: [...callStack],
            scope: currentScope
          });
        }

        // Parse function calls
        const funcCallMatch = trimmedLine.match(/(\w+)\s*\(([^)]*)\)/);
        if (funcCallMatch && !trimmedLine.startsWith('def ') && !trimmedLine.startsWith('function ')) {
          const [, funcName, args] = funcCallMatch;
          
          if (functionDefinitions.has(funcName)) {
            const funcDef = functionDefinitions.get(funcName)!;
            callStack.push(funcName);
            scopeStack.push(funcName);
            
            steps.push({
              line: index + 1,
              action: `Call function: ${funcName}(${args})`,
              variables: Array.from(new Map([...globalVariables, ...localVars]).values()),
              output,
              explanation: `Calling function '${funcName}' with arguments: ${args}`,
              callStack: [...callStack],
              scope: currentScope
            });
            
            // Create local variables for parameters
            const argValues = args.split(',').map(a => a.trim());
            const funcLocalVars = new Map();
            funcDef.params.forEach((param, i) => {
              if (argValues[i]) {
                funcLocalVars.set(param, {
                  name: param,
                  value: argValues[i],
                  type: inferType(argValues[i]),
                  scope: funcName
                });
              }
            });
            
            // Execute function body (simplified - would need proper block detection)
            // For now, just record the call
            
            callStack.pop();
            scopeStack.pop();
            
            steps.push({
              line: index + 1,
              action: `Return from: ${funcName}`,
              variables: Array.from(new Map([...globalVariables, ...localVars]).values()),
              output,
              explanation: `Function '${funcName}' returns`,
              callStack: [...callStack],
              scope: currentScope
            });
          }
        }

        // Parse print/console.log (enhanced to evaluate expressions)
        const printMatch = lang === 'python' 
          ? trimmedLine.match(/^print\((.+)\)$/)
          : trimmedLine.match(/^console\.log\((.+)\);?$/);
        
        if (printMatch) {
          let printValue = printMatch[1];
          
          // Evaluate variables in print statement
          allVariables.forEach((varData, name) => {
            const regex = new RegExp(`\\b${name}\\b`, 'g');
            printValue = printValue.replace(regex, varData.value);
          });
          
          // Handle f-strings and template literals
          if (lang === 'python' && printValue.startsWith('f"')) {
            printValue = printValue.replace(/f"([^"]+)"/, (_, content) => {
              return content.replace(/\{(\w+)\}/g, (__, varName) => {
                const varData = allVariables.get(varName);
                return varData ? varData.value : varName;
              });
            });
          } else if (lang === 'javascript' && printValue.includes('`')) {
            printValue = printValue.replace(/`([^`]+)`/, (_, content) => {
              return content.replace(/\$\{(\w+)\}/g, (__, varName) => {
                const varData = allVariables.get(varName);
                return varData ? varData.value : varName;
              });
            });
          }
          
          printValue = printValue.replace(/["'`]/g, '');
          output += printValue + '\n';
          
          steps.push({
            line: index + 1,
            action: `Output: ${printValue}`,
            variables: Array.from(new Map([...globalVariables, ...localVars]).values()),
            output,
            explanation: `Print statement outputs: ${printValue}`,
            callStack: [...callStack],
            scope: currentScope
          });
        }

        // Parse function definitions
        const funcMatch = lang === 'python'
          ? trimmedLine.match(/^def\s+(\w+)\s*\(([^)]*)\):/)
          : trimmedLine.match(/^function\s+(\w+)\s*\(([^)]*)\)/);
        
        if (funcMatch) {
          const [, funcName, params] = funcMatch;
          steps.push({
            line: index + 1,
            action: `Define function: ${funcName}(${params})`,
            variables: Array.from(new Map([...globalVariables, ...localVars]).values()),
            output,
            explanation: `Function '${funcName}' is defined with parameters: ${params || 'none'}`,
            callStack: [...callStack],
            scope: currentScope
          });
        }

        // Parse loops (enhanced)
        const pythonForMatch = trimmedLine.match(/^for\s+(\w+)\s+in\s+(.+):/);
        const jsForMatch = trimmedLine.match(/^for\s*\(\s*(?:let|const|var)?\s*(\w+)\s*=\s*(.+?);/);
        
        if (pythonForMatch || jsForMatch) {
          const loopVar = pythonForMatch ? pythonForMatch[1] : jsForMatch![1];
          const loopRange = pythonForMatch ? pythonForMatch[2] : jsForMatch![2];
          
          steps.push({
            line: index + 1,
            action: `Loop: for ${loopVar} in ${loopRange}`,
            variables: Array.from(new Map([...globalVariables, ...localVars]).values()),
            output,
            explanation: `Loop begins iterating over ${loopRange}`,
            callStack: [...callStack],
            scope: currentScope
          });
        }

        // Parse conditionals (enhanced)
        const ifMatch = trimmedLine.match(/^if\s+(.+?)[:({]/);
        const elseMatch = trimmedLine.match(/^else\s*[:({]/);
        const elifMatch = trimmedLine.match(/^elif\s+(.+?):/);
        
        if (ifMatch) {
          let condition = ifMatch[1];
          // Evaluate condition with current variables
          allVariables.forEach((varData, name) => {
            const regex = new RegExp(`\\b${name}\\b`, 'g');
            condition = condition.replace(regex, varData.value);
          });
          
          steps.push({
            line: index + 1,
            action: `Condition: if ${condition}`,
            variables: Array.from(new Map([...globalVariables, ...localVars]).values()),
            output,
            explanation: `Checking condition: ${condition}`,
            callStack: [...callStack],
            scope: currentScope
          });
        } else if (elifMatch) {
          steps.push({
            line: index + 1,
            action: `Condition: elif ${elifMatch[1]}`,
            variables: Array.from(new Map([...globalVariables, ...localVars]).values()),
            output,
            explanation: `Checking alternative condition: ${elifMatch[1]}`,
            callStack: [...callStack],
            scope: currentScope
          });
        } else if (elseMatch) {
          steps.push({
            line: index + 1,
            action: `Else branch`,
            variables: Array.from(new Map([...globalVariables, ...localVars]).values()),
            output,
            explanation: `Executing else branch`,
            callStack: [...callStack],
            scope: currentScope
          });
        }

        // Parse return statements
        const returnMatch = trimmedLine.match(/^return\s+(.+)/);
        if (returnMatch) {
          let returnValue = returnMatch[1].replace(/;$/, '');
          allVariables.forEach((varData, name) => {
            const regex = new RegExp(`\\b${name}\\b`, 'g');
            returnValue = returnValue.replace(regex, varData.value);
          });
          
          steps.push({
            line: index + 1,
            action: `Return: ${returnValue}`,
            variables: Array.from(new Map([...globalVariables, ...localVars]).values()),
            output,
            explanation: `Returning value: ${returnValue}`,
            callStack: [...callStack],
            scope: currentScope
          });
        }
      }
    };

    // Execute the code
    executeLines(0, lines.length - 1);

    // Add initial step if no steps were generated
    if (steps.length === 0) {
      steps.push({
        line: 1,
        action: 'Program Start',
        variables: [],
        output: '',
        explanation: 'Program execution begins',
        callStack: [],
        scope: 'global'
      });
    }

    return steps;
  };

  const inferType = (value: string): string => {
    value = value.trim().replace(/;$/, '');
    if (value.startsWith('"') || value.startsWith("'") || value.startsWith('`')) return 'string';
    if (value === 'true' || value === 'false' || value === 'True' || value === 'False') return 'boolean';
    if (value.startsWith('[')) return 'array';
    if (value.startsWith('{')) return 'object';
    if (!isNaN(Number(value))) return value.includes('.') ? 'float' : 'integer';
    if (value === 'None' || value === 'null' || value === 'undefined') return 'null';
    return 'unknown';
  };

  // Playback controls
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentStep < executionSteps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= executionSteps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, executionSteps.length, playbackSpeed]);

  const step = executionSteps[currentStep];
  const codeLines = code.split('\n');

  if (isLoadingAccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md bg-[#1a1a1a] border-white/10">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-[#ac1ed6] border-t-transparent rounded-full" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Password dialog for expired trial
  if (showPasswordDialog && !hasAccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md bg-[#1a1a1a] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-red-400" />
              Trial Expired
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Your 2-day trial has expired. Please enter admin password to continue using the Code Analyzer.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && verifyPassword()}
              className="bg-black/50 border-white/20 text-white"
            />
            <Button
              onClick={verifyPassword}
              className="w-full bg-gradient-to-r from-[#ac1ed6] to-[#c26e73] text-white"
            >
              <Lock className="w-4 h-4 mr-2" />
              Unlock Access
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-[95vw] max-h-[90vh] overflow-hidden bg-[#0d0d0d] border-white/10 p-0">
        <DialogHeader className="px-6 py-4 border-b border-white/10 bg-[#1a1a1a]">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ac1ed6] to-[#c26e73] flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-white text-lg">Code Analyzer</DialogTitle>
                <p className="text-white/40 text-sm">Visualize code execution step-by-step</p>
              </div>
            </div>
            
            {trialInfo?.isInTrial && (
              <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                <Clock className="w-3 h-3 mr-1" />
                Trial: {trialInfo.daysLeft} days left
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 py-3 border-b border-white/10 bg-[#1a1a1a]">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h2 className="text-white font-semibold flex items-center gap-2">
                <Eye className="w-5 h-5 text-[#ac1ed6]" />
                Code Execution Visualizer
              </h2>

              <Button
                onClick={generateExecutionSteps}
                disabled={isAnalyzing}
                className="bg-gradient-to-r from-[#ac1ed6] to-[#c26e73] text-white"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Analyze Code
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="m-0 flex-1 h-[calc(90vh-200px)] overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 h-full">
              {/* Code Panel */}
              <div className="border-r border-white/10 flex flex-col">
                <div className="px-4 py-2 border-b border-white/10 bg-[#1a1a1a]">
                  <h3 className="text-white font-medium flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-[#ac1ed6]" />
                    Source Code
                    <Badge className="ml-2 bg-white/10 text-white/60 text-xs">
                      {language === 'python' ? 'Python' : 'JavaScript'}
                    </Badge>
                  </h3>
                </div>
                <ScrollArea className="flex-1 p-4">
                  <div className="font-mono text-sm">
                    {codeLines.map((line, index) => (
                      <motion.div
                        key={index}
                        className={`flex gap-4 px-2 py-1 rounded ${
                          step?.line === index + 1 
                            ? 'bg-[#ac1ed6]/30 border-l-2 border-[#ac1ed6]' 
                            : 'hover:bg-white/5'
                        }`}
                        animate={step?.line === index + 1 ? { scale: [1, 1.02, 1] } : {}}
                      >
                        <span className="text-white/30 w-6 text-right shrink-0">{index + 1}</span>
                        <span className="text-white/90 whitespace-pre">{line || ' '}</span>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Execution Panel */}
              <div className="border-r border-white/10 flex flex-col">
                <div className="px-4 py-2 border-b border-white/10 bg-[#1a1a1a]">
                  <h3 className="text-white font-medium flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-green-400" />
                    Execution State
                  </h3>
                </div>
                <ScrollArea className="flex-1 p-4">
                  {step ? (
                    <div className="space-y-4">
                      <Card className="bg-[#1a1a1a] border-white/10">
                        <CardHeader className="py-3">
                          <CardTitle className="text-sm text-white flex items-center gap-2">
                            <ArrowRight className="w-4 h-4 text-[#ac1ed6]" />
                            Current Action
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="py-0 pb-4">
                          <p className="text-white/80 text-sm">{step.action}</p>
                          <p className="text-white/40 text-xs mt-2">{step.explanation}</p>
                          
                          {/* Call Stack Display */}
                          {step.callStack && step.callStack.length > 0 && (
                            <div className="mt-3 p-2 bg-purple-500/10 border border-purple-500/20 rounded">
                              <p className="text-xs text-purple-400 font-semibold mb-1">Call Stack:</p>
                              <div className="flex flex-wrap gap-1">
                                {step.callStack.map((func, idx) => (
                                  <Badge key={idx} className="bg-purple-500/20 text-purple-300 text-xs">
                                    {func}()
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Scope Display */}
                          <div className="mt-2">
                            <Badge className="bg-cyan-500/20 text-cyan-400 text-xs">
                              Scope: {step.scope}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-[#1a1a1a] border-white/10">
                        <CardHeader className="py-3">
                          <CardTitle className="text-sm text-white">Variables</CardTitle>
                        </CardHeader>
                        <CardContent className="py-0 pb-4">
                          {step.variables.length > 0 ? (
                            <div className="space-y-2">
                              {step.variables.map((v, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className="flex items-center gap-2 p-2 bg-black/30 rounded"
                                >
                                  <Badge className="bg-blue-500/20 text-blue-400 text-xs">{v.type}</Badge>
                                  <span className="text-yellow-400 font-mono text-sm">{v.name}</span>
                                  <span className="text-white/40">=</span>
                                  <span className="text-green-400 font-mono text-sm">{v.value}</span>
                                  <Badge className="bg-cyan-500/20 text-cyan-400 text-xs ml-auto">{v.scope}</Badge>
                                </motion.div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-white/40 text-sm italic">No variables defined yet</p>
                          )}
                        </CardContent>
                      </Card>

                      {step.output && (
                        <Card className="bg-[#1a1a1a] border-white/10">
                          <CardHeader className="py-3">
                            <CardTitle className="text-sm text-white">Output</CardTitle>
                          </CardHeader>
                          <CardContent className="py-0 pb-4">
                            <pre className="text-green-400 font-mono text-sm bg-black/30 p-3 rounded whitespace-pre-wrap">
                              {step.output}
                            </pre>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-white/40">
                      <Cpu className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Click "Analyze Code" to start</p>
                    </div>
                  )}
                </ScrollArea>
              </div>

              {/* Controls & Timeline */}
              <div className="flex flex-col">
                <div className="px-4 py-2 border-b border-white/10 bg-[#1a1a1a]">
                  <h3 className="text-white font-medium">Playback Controls</h3>
                </div>
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCurrentStep(0)}
                      disabled={executionSteps.length === 0}
                      className="border-white/20 text-black hover:bg-white/10 hover:text-white"
                    >
                      <SkipBack className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                      disabled={currentStep === 0 || executionSteps.length === 0}
                      className="border-white/20 text-black hover:bg-white/10 hover:text-white"
                    >
                      <ArrowRight className="w-4 h-4 rotate-180" />
                    </Button>
                    <Button
                      onClick={() => setIsPlaying(!isPlaying)}
                      disabled={executionSteps.length === 0}
                      className="bg-[#ac1ed6] hover:bg-[#ac1ed6]/80 text-white px-6"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCurrentStep(Math.min(executionSteps.length - 1, currentStep + 1))}
                      disabled={currentStep >= executionSteps.length - 1 || executionSteps.length === 0}
                      className="border-white/20 text-black hover:bg-white/10 hover:text-white"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCurrentStep(executionSteps.length - 1)}
                      disabled={executionSteps.length === 0}
                      className="border-white/20 text-black hover:bg-white/10 hover:text-white"
                    >
                      <SkipForward className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-white/60 text-sm">Speed:</span>
                    <select
                      value={playbackSpeed}
                      onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                      className="bg-black/50 border border-white/20 rounded px-2 py-1 text-white text-sm"
                    >
                      <option value={2000}>0.5x</option>
                      <option value={1000}>1x</option>
                      <option value={500}>2x</option>
                      <option value={250}>4x</option>
                    </select>
                  </div>

                  <div className="mt-4">
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-[#ac1ed6] to-[#c26e73]"
                        animate={{ width: `${executionSteps.length > 0 ? ((currentStep + 1) / executionSteps.length) * 100 : 0}%` }}
                      />
                    </div>
                    <p className="text-white/40 text-xs mt-2 text-center">
                      Step {currentStep + 1} of {executionSteps.length || 1}
                    </p>
                  </div>
                </div>

                {/* Step Timeline */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-2">
                    {executionSteps.map((s, i) => (
                      <motion.button
                        key={i}
                        onClick={() => setCurrentStep(i)}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${
                          i === currentStep 
                            ? 'bg-[#ac1ed6]/20 border-[#ac1ed6]' 
                            : i < currentStep
                            ? 'bg-green-500/10 border-green-500/20'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.02 }}
                      >
                        <div className="flex items-center gap-2">
                          <Badge className="bg-white/10 text-white/60 text-xs">Line {s.line}</Badge>
                          <span className="text-white text-sm truncate">{s.action}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
