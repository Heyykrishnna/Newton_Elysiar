import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layout, Monitor, Terminal, Maximize2, Minimize2, FileCode, Plus, Trash2, Code2, Sparkles, X, Info, CheckCircle2, Lightbulb, Lock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

type File = {
  name: string;
  language: string;
  content: string;
};

const DEFAULT_FILES: Record<string, File> = {
  'index.html': {
    name: 'index.html',
    language: 'html',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web Playground</title>
</head>
<body>
    <div class="container">
        <h1>Hello, Web Dev!</h1>
        <p>Start editing to see some magic happen.</p>
        <button id="clickMe">Click Me</button>
    </div>
</body>
</html>`
  },
  'style.css': {
    name: 'style.css',
    language: 'css',
    content: `body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f0f2f5;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
    color: #333;
}

.container {
    text-align: center;
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
}

.container:hover {
    transform: translateY(-5px);
}

h1 {
    color: #2c3e50;
    margin-bottom: 1rem;
}

button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1rem;
    transition: opacity 0.3s;
}

button:hover {
    opacity: 0.9;
}`
  },
  'script.js': {
    name: 'script.js',
    language: 'javascript',
    content: `// Try console.log() and click "Run JS" to see output!
console.log('Hello from JavaScript!');

document.getElementById('clickMe')?.addEventListener('click', () => {
    console.log('Button clicked!');
    alert('You clicked the button! Nice work.');
    
    const container = document.querySelector('.container');
    container.style.backgroundColor = '#e0e7ff';
    
    setTimeout(() => {
        container.style.backgroundColor = 'white';
        console.log('Background color reset');
    }, 1000);
});`
  }
};

const DEFAULT_REACT_FILES: Record<string, File> = {
  'index.html': {
    name: 'index.html',
    language: 'html',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React Playground</title>
</head>
<body>
    <div id="root"></div>
</body>
</html>`
  },
  'App.jsx': {
    name: 'App.jsx',
    language: 'javascript',
    content: `const { useState, useEffect } = React;
const { createRoot } = ReactDOM;
const { Card, CardHeader, CardTitle, CardContent } = window; // Example if we mocked UI components, but let's stick to standard HTML

function App() {
    const [count, setCount] = useState(0);

    return (
        <div style={{ 
            fontFamily: 'system-ui, sans-serif', 
            maxWidth: '600px', 
            margin: '2rem auto', 
            padding: '2rem',
            background: 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)',
            borderRadius: '16px',
            color: 'white',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
        }}>
            <header style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem', 
                marginBottom: '2rem',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                paddingBottom: '1rem'
            }}>
                <div style={{ fontSize: '2.5rem' }}>⚛️</div>
                <div>
                    <h1 style={{ margin: 0, fontSize: '1.8rem', background: 'linear-gradient(to right, #61dafb, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>React Playground</h1>
                    <p style={{ margin: '0.5rem 0 0', opacity: 0.7 }}>Edit App.jsx to see changes instantly</p>
                </div>
            </header>

            <div style={{ 
                background: 'rgba(255,255,255,0.05)', 
                borderRadius: '12px', 
                padding: '2rem',
                textAlign: 'center' 
            }}>
                <h2 style={{ marginTop: 0 }}>Interactive Counter</h2>
                <div style={{ fontSize: '4rem', fontWeight: 'bold', margin: '1rem 0', fontFamily: 'monospace' }}>
                    {count}
                </div>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button 
                        onClick={() => setCount(c => c - 1)}
                        style={{
                            background: 'rgba(255,50,50,0.2)',
                            color: '#ff6b6b',
                            border: '1px solid rgba(255,50,50,0.3)',
                            padding: '0.8rem 1.5rem',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: '600',
                            transition: 'all 0.2s'
                        }}
                    >
                        Decrease
                    </button>
                    <button 
                        onClick={() => setCount(c => c + 1)}
                        style={{
                            background: 'rgba(97, 218, 251, 0.2)',
                            color: '#61dafb',
                            border: '1px solid rgba(97, 218, 251, 0.3)',
                            padding: '0.8rem 1.5rem',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: '600',
                            transition: 'all 0.2s'
                        }}
                    >
                        Increase
                    </button>
                </div>
            </div>
            
            <footer style={{ marginTop: '2rem', textAlign: 'center', opacity: 0.5, fontSize: '0.9rem' }}>
                Running with React 18 & ReactDOM
            </footer>
        </div>
    );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);`
  }
};

export function WebDevPlayground() {
  const [files, setFiles] = useState<Record<string, File>>(DEFAULT_FILES);
  const [savedWebFiles, setSavedWebFiles] = useState<Record<string, File>>(DEFAULT_FILES);
  const [savedReactFiles, setSavedReactFiles] = useState<Record<string, File>>(DEFAULT_REACT_FILES);

  const [activeFile, setActiveFile] = useState<string>('index.html');
  const [previewFile, setPreviewFile] = useState<string>('index.html'); // New state for previewed file
  const [srcDoc, setSrcDoc] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isPreviewFullScreen, setIsPreviewFullScreen] = useState(false);
  const [playgroundMode, setPlaygroundMode] = useState<'web' | 'cli' | 'react'>('web');
  
  // File Management States
  const [showNewFileDialog, setShowNewFileDialog] = useState(false);
  const [newFileName, setNewFileName] = useState('');

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
  
  // Resizable panel widths
  const [editorWidth, setEditorWidth] = useState(50); // percentage
  const [previewHeight, setPreviewHeight] = useState(65); // percentage of right panel
  const [isResizing, setIsResizing] = useState<'editor' | 'preview' | null>(null);
  
  // CLI states
  const [cliInput, setCliInput] = useState('');
  const [cliOutput, setCliOutput] = useState<string[]>(['Welcome to the Enhanced Terminal Simulator!', 'Type "help" to see available commands.', '']);
  const [currentDir, setCurrentDir] = useState('/project');

  // Console states
  const [consoleOutput, setConsoleOutput] = useState<Array<{type: 'log' | 'error' | 'warn', message: string}>>([]);

  // Update preview
  useEffect(() => {
    const timeout = setTimeout(() => {
        let previewDoc = '';
        const targetHtml = files['index.html'] || Object.values(files).find(f => f.language === 'html');
        // Fallback HTML if missing
        const htmlContent = targetHtml?.content || '<div id="root"></div>';

        if (playgroundMode === 'react') {
            const jsFiles = Object.values(files).filter(f => f.name.endsWith('.js') || f.name.endsWith('.jsx') || f.name.endsWith('.tsx'));
            const jsContent = jsFiles.map(f => f.content).join('\n\n');
            const cssFiles = Object.values(files).filter(f => f.name.endsWith('.css'));
            const cssContent = cssFiles.map(f => `<style>${f.content}</style>`).join('\n');
            
            previewDoc = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React Playground Preview</title>
    <script>
        // Polyfill process for some React libs
        window.process = { env: { NODE_ENV: 'development' } };
    </script>
    <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    ${cssContent}
</head>
<body>
    ${htmlContent}
    <div id="error-container" style="display:none; color: red; background: #ffe6e6; padding: 1rem; border: 1px solid red; margin: 1rem; border-radius: 8px; font-family: monospace;"></div>
    
    <script type="text/babel" data-presets="env,react">
        try {
            ${jsContent}
        } catch (err) {
            console.error(err);
        }
    </script>
</body>
</html>`;
        } else if (playgroundMode === 'web') {
            previewDoc = htmlContent;
            
            const cssFiles = Object.values(files).filter(f => f.name.endsWith('.css'));
            const cssContent = cssFiles.map(f => `<style>${f.content}</style>`).join('\n');
            
            const jsFiles = Object.values(files).filter(f => f.name.endsWith('.js'));
            const jsContent = jsFiles.map(f => `<script>${f.content}</script>`).join('\n');

            if (previewDoc.includes('</head>')) {
                previewDoc = previewDoc.replace('</head>', `${cssContent}</head>`);
            } else {
                 previewDoc = `${cssContent}${previewDoc}`;
            }

            if (previewDoc.includes('</body>')) {
                previewDoc = previewDoc.replace('</body>', `${jsContent}</body>`);
            } else {
                previewDoc = `${previewDoc}${jsContent}`;
            }
        }
        
        if (playgroundMode !== 'cli') {
            const injectedScript = `
            <script>
                (function() {
                const originalLog = console.log;
                const originalError = console.error;
                const originalWarn = console.warn;

                console.log = function(...args) {
                    window.parent.postMessage({ type: 'console', method: 'log', args: args }, '*');
                    originalLog.apply(console, args);
                };

                console.error = function(...args) {
                    window.parent.postMessage({ type: 'console', method: 'error', args: args }, '*');
                    const errDiv = document.getElementById('error-container');
                    if (errDiv) {
                        errDiv.style.display = 'block';
                        errDiv.innerText = 'Runtime Error: ' + args.join(' ');
                    }
                    originalError.apply(console, args);
                };

                console.warn = function(...args) {
                    // Suppress specific Babel warning
                    if (args[0] && typeof args[0] === 'string' && args[0].includes('You are using the in-browser Babel transformer')) return;
                    
                    window.parent.postMessage({ type: 'console', method: 'warn', args: args }, '*');
                    originalWarn.apply(console, args);
                };
                
                window.onerror = function(msg, url, line, col, error) {
                     window.parent.postMessage({ type: 'console', method: 'error', args: [msg] }, '*');
                     const errDiv = document.getElementById('error-container');
                     if (errDiv) {
                        errDiv.style.display = 'block';
                        errDiv.innerText = 'Error: ' + msg;
                     }
                };

                document.addEventListener('click', (e) => {
                    const link = e.target.closest('a');
                    if (link) {
                    const href = link.getAttribute('href');
                    if (href && !href.startsWith('http') && !href.startsWith('#')) {
                        e.preventDefault();
                        window.parent.postMessage({ type: 'navigation', path: href }, '*');
                    }
                    }
                });
                })();
            </script>
            `;
            previewDoc = previewDoc.replace('<head>', `<head>${injectedScript}`);
            setSrcDoc(previewDoc);
        }
    }, 800);

    return () => clearTimeout(timeout);
  }, [files, playgroundMode, previewFile]);

  const handleModeSwitch = (mode: 'web' | 'cli' | 'react') => {
      // 1. Save current files to the buffer
      if (playgroundMode === 'web') setSavedWebFiles(files);
      if (playgroundMode === 'react') setSavedReactFiles(files);

      // 2. Switch mode
      setPlaygroundMode(mode);

      // 3. Load files from buffer
      // Note: We use the *current* state of saved files for the target mode. 
      // If we are switching TO web, we take from savedWebFiles.
      // If we are switching TO react, we take from savedReactFiles.
      if (mode === 'web') {
          setFiles(savedWebFiles);
          setActiveFile('index.html');
          setPreviewFile('index.html');
      } else if (mode === 'react') {
          setFiles(savedReactFiles);
          setActiveFile('App.jsx');
          setPreviewFile('index.html'); // Valid because template has index.html
      }
      // CLI mostly acts as a viewer or separate tool, commonly keeps current files or has its own. 
      // For now, let's keep CLI showing "web" files or whichever was active.
      // Or just don't change files for CLI.
  };

  // Handle console messages & navigation from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return;

      if (event.data.type === 'console') {
        setConsoleOutput(prev => [...prev, {
          type: event.data.method,
          message: event.data.args.map((arg: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
            typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
          ).join(' ')
        }]);
      } else if (event.data.type === 'navigation') {
        // Handle virtual navigation
        const targetPath = event.data.path;
        if (files[targetPath]) {
            setPreviewFile(targetPath);
            setConsoleOutput(prev => [...prev, { type: 'log', message: `Navigated to ${targetPath}` }]);
        } else {
            toast.error(`File not found: ${targetPath}`);
            setConsoleOutput(prev => [...prev, { type: 'error', message: `404: File not found '${targetPath}'` }]);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [files]);

  const handleCreateFile = () => {
    if (!newFileName.trim()) return;
    
    const extension = newFileName.split('.').pop()?.toLowerCase();
    let language = 'plaintext';
    if (extension === 'html') language = 'html';
    if (extension === 'css') language = 'css';
    if (extension === 'js') language = 'javascript';
    if (extension === 'jsx' || extension === 'tsx') language = 'javascript';

    setFiles(prev => ({
        ...prev,
        [newFileName]: {
            name: newFileName,
            language,
            content: ''
        }
    }));
    setActiveFile(newFileName);
    setNewFileName('');
    setShowNewFileDialog(false);
    toast.success(`File ${newFileName} created`);
  };

  const handleDeleteFile = (fileName: string) => {
    if (Object.keys(files).length <= 1) {
        toast.error("Cannot delete the last file");
        return;
    }
    const newFiles = { ...files };
    delete newFiles[fileName];
    setFiles(newFiles);
    
    if (activeFile === fileName) {
        setActiveFile(Object.keys(newFiles)[0]);
    }
    // If we deleted the current preview, reset to index.html or first file
    if (previewFile === fileName) {
        setPreviewFile('index.html');
    }

    toast.success(`File ${fileName} deleted`);
  };

  const checkAnalysisLimit = () => {
    const storageKey = 'ai_code_analysis_usage';
    const stored = localStorage.getItem(storageKey);
    const now = new Date();

    if (!stored) return true;

    try {
      const data = JSON.parse(stored);
      const lastUsed = new Date(data.date);
      const daysSince = (now.getTime() - lastUsed.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysSince >= 7) return true;
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
         localStorage.setItem(storageKey, JSON.stringify({ date: now, count: 1 }));
      } else {
         localStorage.setItem(storageKey, JSON.stringify({ ...data, count: data.count + 1 }));
      }
    } catch {
      localStorage.setItem(storageKey, JSON.stringify({ date: now, count: 1 }));
    }
  };

  const handleAnalyzeCode = async () => {
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
        const filesPayload = Object.fromEntries(
            Object.entries(files).map(([name, file]) => [name, file.content])
        );

      const { data, error } = await supabase.functions.invoke('ai-learning', {
        body: {
          action: 'analyze_code',
          files: filesPayload,
          language: 'web-project'
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

  const handleCliCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const command = cliInput.trim();
      if (!command) {
        setCliInput('');
        return;
      }
      
      const newOutput = [...cliOutput, `${currentDir} $ ${command}`];
      setCliInput('');

      const parts = command.split(' ');
      const cmd = parts[0].toLowerCase();
      const args = parts.slice(1);

      switch (cmd) {
        case 'help':
          newOutput.push('Available Commands: help, ls, cd, pwd, clear, date, echo, mkdir, touch, rm');
          break;
        case 'clear':
          setCliOutput([]);
          return;
        case 'ls':
          newOutput.push(Object.keys(files).join('  '));
          break;
        case 'pwd':
          newOutput.push(currentDir);
          break;
        case 'date':
          newOutput.push(new Date().toString());
          break;
        case 'echo':
          newOutput.push(args.join(' '));
          break;
        case 'mkdir':
            newOutput.push(`Directory '${args[0]}' created (simulated)`);
            break;
        case 'touch':
            handleCreateFileCLI(args[0]);
            newOutput.push(`File '${args[0]}' created`);
            break;
        case 'rm':
            if(files[args[0]]) {
                handleDeleteFile(args[0]);
                newOutput.push(`Removed '${args[0]}'`);
            } else {
                 newOutput.push(`rm: cannot remove '${args[0]}': No such file`);
            }
            break;
        default:
          newOutput.push(`Command not found: ${cmd}`);
      }
      setCliOutput(newOutput);
    }
  };

  const handleCreateFileCLI = (name: string) => {
      if(!name) return;
      setFiles(prev => ({
        ...prev,
        [name]: { name, language: 'plaintext', content: '' }
      }));
  }


  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const togglePreviewFullScreen = () => {
    setIsPreviewFullScreen(!isPreviewFullScreen);
  };

  // Resize handlers
  const handleEditorResize = useCallback((e: MouseEvent) => {
    if (isResizing === 'editor') {
      const container = document.querySelector('.playground-container');
      if (container) {
        const rect = container.getBoundingClientRect();
        const newWidth = ((e.clientX - rect.left) / rect.width) * 100;
        setEditorWidth(Math.min(Math.max(newWidth, 20), 80)); 
      }
    } else if (isResizing === 'preview') {
      const rightPanel = document.querySelector('.right-panel');
      if (rightPanel) {
        const rect = rightPanel.getBoundingClientRect();
        const newHeight = ((e.clientY - rect.top) / rect.height) * 100;
        setPreviewHeight(Math.min(Math.max(newHeight, 20), 80));
      }
    }
  }, [isResizing]);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(null);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleEditorResize);
      document.addEventListener('mouseup', handleResizeEnd);
      return () => {
        document.removeEventListener('mousemove', handleEditorResize);
        document.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [isResizing, handleEditorResize, handleResizeEnd]);

  const removeFile = (e: React.MouseEvent, fileName: string) => {
      e.stopPropagation();
      handleDeleteFile(fileName);
  }

  return (
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
              <Layout className="w-6 h-6 text-[#ac1ed6]" />
              Web Dev Playground
            </CardTitle>
            {!isFullScreen && (
              <CardDescription className="text-white/60 text-base mt-1">
                Build and preview HTML, CSS, and JavaScript in real-time.
              </CardDescription>
            )}
          </div>
          <div className="flex items-center gap-2">
            
            <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteFile(activeFile)}
                className="text-red-400 hover:text-red-300 hover:bg-white/10 mr-2"
                title="Delete Active File"
            >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete File
            </Button>

            {/* Mode Toggle */}
            <div className="flex items-center gap-1 bg-[#0d0d0d] border border-white/10 rounded-lg p-1">
              <Button
                size="sm"
                variant={playgroundMode === 'web' ? 'default' : 'ghost'}
                onClick={() => handleModeSwitch('web')}
                className={`text-xs ${playgroundMode === 'web' ? 'bg-gradient-to-r from-[#ac1ed6] to-[#c26e73] text-white' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
              >
                <Monitor className="w-4 h-4 mr-1" />
                Web
              </Button>
              <Button
                size="sm"
                variant={playgroundMode === 'cli' ? 'default' : 'ghost'}
                onClick={() => handleModeSwitch('cli')}
                className={`text-xs ${playgroundMode === 'cli' ? 'bg-gradient-to-r from-[#ac1ed6] to-[#c26e73] text-white' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
              >
                <Terminal className="w-4 h-4 mr-1" />
                CLI
              </Button>
              <Button
                size="sm"
                variant={playgroundMode === 'react' ? 'default' : 'ghost'}
                onClick={() => handleModeSwitch('react')}
                className={`text-xs ${playgroundMode === 'react' ? 'bg-gradient-to-r from-[#61dafb] to-[#a78bfa] text-white' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
              >
                <Code2 className="w-4 h-4 mr-1" />
                React
              </Button>
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

      <CardContent className="p-0 flex-1 flex overflow-hidden playground-container">
        {/* Left Side: File Explorer & Editor */}
        <div className="flex flex-col border-r border-white/10" style={{ width: `${editorWidth}%` }}>
          
          {/* File Tabs / Explorer Bar */}
          <div className="flex items-center px-2 py-6 bg-[#1a1a1a] border-b border-white/10 overflow-x-auto gap-1">
             {Object.values(files).map((file) => (
                 <div 
                    key={file.name}
                    onClick={() => setActiveFile(file.name)}
                    className={`
                        flex items-center gap-2 px-3 py-1.5 rounded-t-md cursor-pointer text-sm min-w-[100px] border-b-2 transition-colors
                        ${activeFile === file.name 
                            ? 'bg-[#0d0d0d] text-[#ac1ed6] border-[#ac1ed6]' 
                            : 'text-white/60 hover:bg-white/5 border-transparent'}
                    `}
                 >
                    <FileCode className="w-3 h-3" />
                    <span className="truncate max-w-[100px]">{file.name}</span>
                    {/* Keep mini delete button as fallback */}
                    <button 
                        onClick={(e) => removeFile(e, file.name)}
                        className="ml-auto opacity-50 hover:opacity-100 group-hover:opacity-100 text-white/40 hover:text-red-400"
                    >
                        <X className="w-3 h-3" />
                    </button>
                 </div>
             ))}
             <Button
                variant="ghost" 
                size="icon"
                className="h-8 w-8 text-white/60 hover:text-black"
                onClick={() => setShowNewFileDialog(true)}
             >
                <Plus className="w-4 h-4" />
             </Button>
          </div>

          {/* Editor Area */}
          <div className="flex-1 relative bg-[#1e1e1e]">
             {activeFile && files[activeFile] && (
                <Editor
                  height="100%"
                  language={files[activeFile].language}
                  theme="vs-dark"
                  value={files[activeFile].content}
                  onChange={(value) => setFiles(prev => ({
                      ...prev,
                      [activeFile]: { ...prev[activeFile], content: value || '' }
                  }))}
                  options={{
                    fontSize: 14,
                    fontFamily: "'Fira Code', 'Monaco', 'Menlo', monospace",
                    minimap: { enabled: false },
                    automaticLayout: true,
                    wordWrap: 'on',
                    padding: { top: 16 },
                  }}
                />
             )}
          </div>
        </div>

        {/* Vertical Resize Handle */}
        <div
          className="w-1 bg-white/5 hover:bg-[#ac1ed6] cursor-col-resize transition-colors relative group"
          onMouseDown={() => setIsResizing('editor')}
        >
          <div className="absolute inset-y-0 -left-1 -right-1" />
        </div>

        {/* Right Side: Preview & Console/CLI */}
        <div className="flex flex-col flex-1 right-panel">
          {playgroundMode !== 'cli' ? (
            <>
              {/* Live Preview */}
              <div className={`flex flex-col border-b border-white/10 ${
                isPreviewFullScreen ? 'fixed inset-0 z-50 bg-[#0d0d0d]' : ''
              }`} style={isPreviewFullScreen ? {} : { height: `${previewHeight}%` }}>
                <div className="px-4 py-2 border-b border-white/10 bg-[#1a1a1a] flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                     <Monitor className="w-4 h-4 text-white/60" />
                     <span className="text-sm text-white/60 font-medium">Live Preview: {previewFile}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setPreviewFile('index.html')}
                      className="h-7 text-xs text-white/40 hover:text-black"
                    >
                      Reset to Home
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={togglePreviewFullScreen}
                      className="h-7 text-white/40 hover:text-white hover:bg-white/10"
                      title={isPreviewFullScreen ? "Exit Fullscreen" : "Fullscreen Preview"}
                    >
                      {isPreviewFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <div className="flex-1 bg-white overflow-auto">
                  <iframe
                    srcDoc={srcDoc}
                    title="preview"
                    sandbox="allow-scripts allow-modals"
                    width="100%"
                    height="100%"
                    className="border-none"
                  />
                </div>
              </div>

              {/* Horizontal Resize Handle */}
              <div
                className="h-1 bg-white/5 hover:bg-[#ac1ed6] cursor-row-resize transition-colors relative group"
                onMouseDown={() => setIsResizing('preview')}
              >
                <div className="absolute inset-x-0 -top-1 -bottom-1" />
              </div>

              {/* Console Output */}
              <div className="flex flex-col bg-[#0d0d0d] flex-1">
                 <div className="px-4 py-2 border-b border-white/10 bg-[#1a1a1a] flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-white/60" />
                    <span className="text-sm text-white/60 font-medium">Console</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setConsoleOutput([])}
                    className="text-white/60 hover:text-white hover:bg-white/10 h-7"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Clear
                  </Button>
                </div>
                <div className="flex-1 p-4 overflow-auto font-mono text-sm">
                   {consoleOutput.length === 0 ? (
                     <div className="text-white/40 italic">Console logs from your code will appear here...</div>
                   ) : (
                     consoleOutput.map((log, i) => (
                       <div key={i} className={`mb-1 ${
                         log.type === 'error' ? 'text-red-400' : 
                         log.type === 'warn' ? 'text-yellow-400' : 
                         'text-white'
                       }`}>
                         <span className="text-white/40 mr-2">&gt;</span>
                         {log.message}
                       </div>
                     ))
                   )}
                </div>
              </div>
            </>
          ) : (
            // CLI Mode (Simplified)
            <div className="flex flex-col h-full bg-[#0d0d0d] font-mono text-sm p-4 overflow-auto">
                {cliOutput.map((line, i) => (
                    <div key={i} className="text-green-400 mb-1">{line}</div>
                ))}
                <div className="flex items-center gap-2 text-white">
                    <span>{currentDir} $</span>
                    <input 
                        type="text" 
                        value={cliInput}
                        onChange={(e) => setCliInput(e.target.value)}
                        onKeyDown={handleCliCommand}
                        className="bg-transparent border-none outline-none flex-1"
                        autoFocus
                    />
                </div>
            </div>
          )}
        </div>
      </CardContent>

      {/* New File Dialog */}
      <Dialog open={showNewFileDialog} onOpenChange={setShowNewFileDialog}>
          <DialogContent className="bg-[#1a1a1a] border-white/10">
              <DialogHeader>
                  <DialogTitle className="text-white">Create New File</DialogTitle>
                  <DialogDescription className="text-white/60">
                      Enter the name of the file (e.g., about.html, main.js)
                  </DialogDescription>
              </DialogHeader>
              <Input 
                  value={newFileName} 
                  onChange={(e) => setNewFileName(e.target.value)} 
                  placeholder="filename.extension"
                  className="bg-[#0d0d0d] border-white/20 text-white"
              />
              <DialogFooter>
                  <Button onClick={handleCreateFile} className="bg-[#ac1ed6] text-white">Create</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>

      {/* AI Analysis Result Dialog */}
      <Dialog open={showAnalysisDialog} onOpenChange={setShowAnalysisDialog}>
            <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-[#1a1a1a] border-white/10">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-white text-xl">
                        <Sparkles className="w-5 h-5 text-blue-400" />
                        AI Project Analysis
                    </DialogTitle>
                    <DialogDescription className="text-white/60">
                        Here's some feedback on your web project.
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

                        {/* Corrected Code (Optional) */}
                        {analysisResult.correctedCode && (
                            <div className="space-y-2">
                                <h3 className="flex items-center gap-2 text-purple-400 font-semibold">
                                    <Code2 className="w-4 h-4" />
                                    Suggested Implementation
                                </h3>
                                <div className="bg-[#0d0d0d] border border-white/10 rounded-xl overflow-hidden">
                                     <Editor
                                        height="300px"
                                        language="javascript"
                                        theme="vs-dark"
                                        value={analysisResult.correctedCode}
                                        options={{
                                            readOnly: true,
                                            minimap: { enabled: false },
                                            fontSize: 14,
                                            fontFamily: "'Fira Code', 'Monaco', 'Menlo', monospace",
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Suggestions */}
                        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                            <h3 className="flex items-center gap-2 text-blue-400 font-semibold mb-2">
                                <Info className="w-4 h-4" />
                                Review
                            </h3>
                            <p className="text-gray-200 leading-relaxed">{analysisResult.suggestions}</p>
                        </div>
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

    </motion.div>
  );
}
