import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layout, Monitor, Terminal, Maximize2, Minimize2, FileCode, Plus, Trash2, Code2, Sparkles, X, Info, CheckCircle2, Lightbulb, Lock, SidebarClose, SidebarOpen } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { FileSystemState, INITIAL_FS_STATE, resolvePath, normalizePath, isValidFileName } from '@/utils/fileSystem';
import { FileTree } from './FileTree';




export function WebDevPlayground() {
  // File System State
  const [fs, setFs] = useState<FileSystemState>(() => {
      const saved = localStorage.getItem('webdev_playground_fs');
      return saved ? JSON.parse(saved) : INITIAL_FS_STATE;
  });
  
  // Persist FS
  useEffect(() => {
     localStorage.setItem('webdev_playground_fs', JSON.stringify(fs));
  }, [fs]);

  // Current State
  const [activeFile, setActiveFile] = useState<string | null>('/index.html');
  const [openFiles, setOpenFiles] = useState<string[]>(['/index.html']); // Multi-tab state
  const [activeFileContent, setActiveFileContent] = useState(''); // Buffer for editor
  const [previewFile, setPreviewFile] = useState<string>('/index.html');
  
  // Sync active file content
  useEffect(() => {
      if (activeFile && fs.files[activeFile]) {
          setActiveFileContent(fs.files[activeFile].content);
      } else {
          setActiveFileContent('');
      }
  }, [activeFile, fs.files]); // Only update when activeFile changes or if the underlying file is replaced externally

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
  
  // Drag and Drop State
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  
  // Resizable panel widths
  const [editorWidth, setEditorWidth] = useState(50); // percentage
  const [previewHeight, setPreviewHeight] = useState(65); // percentage of right panel
  const [isResizing, setIsResizing] = useState<'editor' | 'preview' | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // CLI states
  const [cliInput, setCliInput] = useState('');
  const [cliOutput, setCliOutput] = useState<string[]>(['Welcome to the Enhanced Terminal Simulator!', 'Type "help" to see available commands.', '']);
  const [currentDir, setCurrentDir] = useState('/');

  // Console states
  const [consoleOutput, setConsoleOutput] = useState<Array<{type: 'log' | 'error' | 'warn', message: string}>>([]);

  // Update preview
  useEffect(() => {
    const timeout = setTimeout(() => {
        let previewDoc = '';
        // Look for index.html at root, then recursively? For now check root.
        const targetHtml = fs.files['/index.html'] || Object.values(fs.files).find(f => f.language === 'html');
        // Fallback HTML if missing
        const htmlContent = targetHtml?.content || '<div id="root"></div>';

        if (playgroundMode === 'react') {
            const jsFiles = Object.values(fs.files).filter(f => f.name.endsWith('.js') || f.name.endsWith('.jsx') || f.name.endsWith('.tsx'));
            const jsContent = jsFiles.map(f => f.content).join('\n\n');
            const cssFiles = Object.values(fs.files).filter(f => f.name.endsWith('.css'));
            
            const reactScripts = `
                <script>window.process = { env: { NODE_ENV: 'development' } };</script>
                <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
                <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
                <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
            `;
            
            const styles = cssFiles.map(f => `<style>${f.content}</style>`).join('\n');
            const userScript = `
                <script type="text/babel" data-presets="env,react">
                    try {
                        ${jsContent}
                    } catch (err) {
                        console.error(err);
                    }
                </script>
            `;
            const errorDiv = `<div id="error-container" style="display:none; color: red; background: #ffe6e6; padding: 1rem; border: 1px solid red; margin: 1rem; border-radius: 8px; font-family: monospace;"></div>`;

            // If htmlContent is a full document, inject into it. Otherwise wrap it.
            if (htmlContent.includes('<html') || htmlContent.includes('<!DOCTYPE')) {
                previewDoc = htmlContent;
                if (previewDoc.includes('</head>')) {
                    previewDoc = previewDoc.replace('</head>', `${reactScripts}\n${styles}</head>`);
                } else {
                    previewDoc = `${reactScripts}\n${styles}\n${previewDoc}`;
                }
                
                if (previewDoc.includes('</body>')) {
                    previewDoc = previewDoc.replace('</body>', `${errorDiv}\n${userScript}</body>`);
                } else {
                    previewDoc = `${previewDoc}\n${errorDiv}\n${userScript}`;
                }
            } else {
                 previewDoc = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React Playground Preview</title>
    ${reactScripts}
    ${styles}
</head>
<body>
    ${htmlContent}
    ${errorDiv}
    ${userScript}
</body>
</html>`;
            }
        } else if (playgroundMode === 'web') {
            previewDoc = htmlContent;
            
            const cssFiles = Object.values(fs.files).filter(f => f.name.endsWith('.css'));
            const cssContent = cssFiles.map(f => `<style>${f.content}</style>`).join('\n');
            
            const jsFiles = Object.values(fs.files).filter(f => f.name.endsWith('.js'));
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
  }, [fs, playgroundMode, previewFile]);

  const handleModeSwitch = (mode: 'web' | 'cli' | 'react') => {
    setPlaygroundMode(mode);
    
    // Switch active file based on mode for better UX
    if (mode === 'react') {
        const hasReactFiles = fs.files['/App.jsx'] || fs.files['/App.tsx'];
        if (!hasReactFiles) {
             // Auto-generate React boilerplate
             setFs(prev => ({
                 ...prev,
                 files: {
                     ...prev.files,
                     '/index.html': {
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
                     '/App.jsx': {
                         name: 'App.jsx',
                         language: 'javascript',
                         content: `const { useState, useEffect } = React;
const { createRoot } = ReactDOM;

function App() {
    const [count, setCount] = useState(0);

    return (
        <div className="p-10 font-sans text-center text-white">
            <h1 className="text-4xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 font-bold">
                Hello React ⚛️
            </h1>
            <p className="mb-6 opacity-80">Start editing /App.jsx to see some magic!</p>
            
            <button 
                onClick={() => setCount(c => c + 1)}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-all border border-white/20"
            >
                Count is {count}
            </button>
        </div>
    );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);`
                     },
                     '/style.css': {
                         name: 'style.css',
                         language: 'css',
                         content: `body { background: #111; color: white; display:flex; justify-content:center; align-items:center; min-height:100vh; margin:0; }`
                     }
                 }
             }));
             setActiveFile('/App.jsx');
             if (!openFiles.includes('/App.jsx')) setOpenFiles(prev => [...prev, '/App.jsx']);
             toast.success("React boilerplate generated!");
        } else {
             const target = fs.files['/App.jsx'] ? '/App.jsx' : '/App.tsx';
             setActiveFile(target);
             if (!openFiles.includes(target)) setOpenFiles(prev => [...prev, target]);
        }
    } else if (mode === 'web') {
        // Ensure web defaults exist
        const webFiles = ['/index.html', '/style.css', '/script.js'];
        const missingFiles = webFiles.filter(f => !fs.files[f]);
        
        if (missingFiles.length > 0) {
            setFs(prev => ({
                ...prev,
                files: {
                    ...prev.files,
                    ...(!fs.files['/index.html'] ? {
                        '/index.html': {
                            name: 'index.html',
                            language: 'html',
                            content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web Playground</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>Hello Web! 🚀</h1>
        <p>Start editing index.html, style.css, and script.js</p>
        <button id="btn">Click Me</button>
    </div>
    <script src="script.js"></script>
</body>
</html>`
                        }
                    } : {}),
                    ...(!fs.files['/style.css'] ? {
                        '/style.css': {
                            name: 'style.css',
                            language: 'css',
                            content: `body {
    background: #0d0d0d;
    color: white;
    font-family: 'Inter', sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
}
.container {
    text-align: center;
    background: rgba(255,255,255,0.05);
    padding: 2rem;
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.1);
    backdrop-filter: blur(10px);
}
h1 {
    background: linear-gradient(to right, #ac1ed6, #c26e73);
    -webkit-background-clip: text;
    color: transparent;
}
button {
    background: linear-gradient(135deg, #ac1ed6, #c26e73);
    border: none;
    padding: 10px 20px;
    color: white;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    margin-top: 1rem;
}
button:hover { opacity: 0.9; }`
                        }
                    } : {}),
                    ...(!fs.files['/script.js'] ? {
                        '/script.js': {
                            name: 'script.js',
                            language: 'javascript',
                            content: `console.log('Hello from Script!');
document.getElementById('btn').addEventListener('click', () => {
    alert('Button clicked! 🎉');
});`
                        }
                    } : {})
                }
            }));
            toast.success("Web environment initialized!");
        }
        setActiveFile('/index.html');
        if (!openFiles.includes('/index.html')) setOpenFiles(prev => [...prev, '/index.html']);
    }
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
        const targetPath = event.data.path;
        if (Object.keys(fs.files).includes(targetPath)) {
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
  }, [fs]);

  const handleCreateFile = () => {
    if (!newFileName.trim()) return;
    
    let path = newFileName.trim();
    if (!path.startsWith('/')) path = '/' + path; // Default to root if no path provided

    if (!isValidFileName(path.split('/').pop() || '')) {
        toast.error('Invalid file name');
        return;
    }

    if (fs.files[path]) {
        toast.error('File already exists');
        return;
    }

    const extension = path.split('.').pop()?.toLowerCase();
    let language = 'plaintext';
    if (extension === 'html') language = 'html';
    if (extension === 'css') language = 'css';
    if (extension === 'js') language = 'javascript';
    if (extension === 'jsx' || extension === 'tsx') language = 'javascript';

    setFs(prev => ({
        ...prev,
        files: {
            ...prev.files,
            [path]: {
                name: path.split('/').pop() || '',
                language,
                content: ''
            }
        }
    }));
    setActiveFile(path);
    setOpenFiles(prev => [...prev, path]);
    setNewFileName('');
    setShowNewFileDialog(false);
    toast.success(`File ${path} created`);
  };

  const handleDeleteFile = (path: string) => {
    if (Object.keys(fs.files).length <= 1) {
        toast.error("Cannot delete the last file");
        return;
    }
    
    setFs(prev => {
        const newFiles = { ...prev.files };
        delete newFiles[path];
        return { ...prev, files: newFiles };
    });
    
    if (activeFile === path) {
        const remainingFiles = Object.keys(fs.files).filter(f => f !== path);
        setActiveFile(remainingFiles[0] || null);
    }
    
    toast.success(`File ${path} deleted`);
  };

  const handleFileClick = (path: string) => {
      setActiveFile(path);
      if (!openFiles.includes(path)) {
          setOpenFiles(prev => [...prev, path]);
      }
  };

  const handleCloseTab = (e: React.MouseEvent, path: string) => {
      e.stopPropagation();
      
      const newOpenFiles = openFiles.filter(f => f !== path);
      setOpenFiles(newOpenFiles);
      
      if (activeFile === path) {
          if (newOpenFiles.length > 0) {
              // Try to find index of closed file
              const idx = openFiles.indexOf(path);
              // Open previous file if possible, or next (which is now at idx)
              const nextFile = newOpenFiles[Math.max(0, idx - 1)]; 
              setActiveFile(nextFile);
          } else {
              setActiveFile(null);
          }
      }
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
            Object.entries(fs.files).map(([name, file]) => [name, file.content])
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

      // Simple parser: split by spaces but respect quotes? For now simple split is fine.
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
        case 'pwd':
          newOutput.push(currentDir);
          break;
        case 'ls': {
          const targetPath = args[0] || '.';
          const resolved = resolvePath(currentDir, targetPath);
          
           // Check if it's a folder
          if (fs.folders.includes(resolved) || resolved === '/') {
               // Get contents
               const folderItems = fs.folders.filter(f => {
                   const parent = resolvePath(f, '..');
                   return parent === resolved && f !== resolved;
               }).map(f => f.split('/').pop() + '/');
               
               const fileItems = Object.keys(fs.files).filter(f => {
                   const parent = resolvePath(f, '..');
                   return parent === resolved;
               }).map(f => f.split('/').pop());
               
               newOutput.push([...folderItems, ...fileItems].join('  '));
          } else if (fs.files[resolved]) {
              newOutput.push(resolved);
          } else {
              newOutput.push(`ls: cannot access '${targetPath}': No such file or directory`);
          }
          break;
        }
        case 'cd': {
           const target = args[0] || '~';
           const resolved = resolvePath(currentDir, target);
           
           if (fs.folders.includes(resolved) || resolved === '/') {
               setCurrentDir(resolved);
           } else {
               newOutput.push(`cd: no such file or directory: ${target}`);
           }
           break;
        }
        case 'mkdir': {
            const target = args[0];
            if (!target) { newOutput.push('mkdir: missing operand'); break; }
            const resolved = resolvePath(currentDir, target);
            if (fs.folders.includes(resolved)) {
                 newOutput.push(`mkdir: cannot create directory '${target}': File exists`);
            } else {
                 setFs(prev => ({ ...prev, folders: [...prev.folders, resolved] }));
            }
            break;
        }
        case 'touch': {
            const target = args[0];
            if (!target) { newOutput.push('touch: missing operand'); break; }
            const resolved = resolvePath(currentDir, target);
            if (fs.files[resolved]) break; // Update timestamp in real OS, here do nothing
            
            // Basic file creation
             setFs(prev => ({
                ...prev,
                files: {
                    ...prev.files,
                    [resolved]: {
                        name: resolved.split('/').pop() || '',
                        language: 'plaintext',
                        content: ''
                    }
                }
            }));
            break;
        }
        case 'rm': {
             // Supports recursive delete conceptually if we filter
             const target = args[0];
             if (!target) { newOutput.push('rm: missing operand'); break; }
             const resolved = resolvePath(currentDir, target);
             
             if (fs.files[resolved]) {
                 handleDeleteFile(resolved);
                 newOutput.push(`Removed '${target}'`);
             } else if (fs.folders.includes(resolved)) {
                 // Check if empty or -r (simplified for now: allow delete if folder exists)
                 // We need to recursively delete children
                 setFs(prev => {
                     const folderPrefix = resolved === '/' ? '/' : resolved + '/';
                     const newFiles = { ...prev.files };
                     Object.keys(newFiles).forEach(k => {
                         if (k.startsWith(folderPrefix)) delete newFiles[k];
                     });
                     
                     const newFolders = prev.folders.filter(f => !f.startsWith(folderPrefix) && f !== resolved);
                     return { files: newFiles, folders: newFolders };
                 });
                  newOutput.push(`Removed directory '${target}'`);
             } else {
                  newOutput.push(`rm: cannot remove '${target}': No such file or directory`);
             }
             break;
        }
        case 'echo':
          newOutput.push(args.join(' '));
          break;
        case 'date':
          newOutput.push(new Date().toString());
          break;
        default:
          newOutput.push(`Command not found: ${cmd}`);
      }
      setCliOutput(newOutput);
    }
  };


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
                className={`text-xs border ${playgroundMode === 'web' ? 'bg-[#1a1a1a] border-[#ac1ed6]/50 text-[#ac1ed6] shadow-[0_0_10px_rgba(172,30,214,0.2)]' : 'border-transparent text-white/60 hover:text-white hover:bg-white/10'}`}
              >
                <Monitor className="w-4 h-4 mr-1" />
                Web
              </Button>
              <Button
                size="sm"
                variant={playgroundMode === 'cli' ? 'default' : 'ghost'}
                onClick={() => handleModeSwitch('cli')}
                className={`text-xs border ${playgroundMode === 'cli' ? 'bg-[#1a1a1a] border-green-500/50 text-green-400 shadow-[0_0_10px_rgba(74,222,128,0.2)]' : 'border-transparent text-white/60 hover:text-white hover:bg-white/10'}`}
              >
                <Terminal className="w-4 h-4 mr-1" />
                CLI
              </Button>
              <Button
                size="sm"
                variant={playgroundMode === 'react' ? 'default' : 'ghost'}
                onClick={() => handleModeSwitch('react')}
                className={`text-xs border ${playgroundMode === 'react' ? 'bg-[#1a1a1a] border-[#61dafb]/50 text-[#61dafb] shadow-[0_0_10px_rgba(97,218,251,0.2)]' : 'border-transparent text-white/60 hover:text-white hover:bg-white/10'}`}
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
              title={isFullScreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1 flex overflow-hidden playground-container relative">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#ac1ed6]/5 via-transparent to-[#c26e73]/5 pointer-events-none" />
        {/* Left Side: File Explorer & Editor */}
        <div className="flex flex-col border-r border-white/10" style={{ width: `${editorWidth}%` }}>
          
           <div className="flex flex-1 overflow-hidden">
                {/* File Tree Sidebar */}
                <div 
                    className={`bg-[#161616] border-r hover:text-black border-white/5 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-12'}`}
                >
                    <div className={cn("p-3 border-b border-white/5 flex items-center shrink-0", isSidebarOpen ? "justify-between" : "justify-center")}>
                        {isSidebarOpen && <span className="text-white/60 text-xs font-medium uppercase tracking-wider">Explorer</span>}
                        <Button
                            variant="ghost" 
                            size="icon"
                            className="h-6 w-6 text-white/60 hover:text-black"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
                        >
                            {isSidebarOpen ? <SidebarClose className="w-3.5 h-3.5" /> : <SidebarOpen className="w-3.5 h-3.5" />}
                        </Button>
                    </div>
                    
                    {isSidebarOpen && (
                        <>
                            <div className="px-3 py-2 flex justify-end">
                                 <Button
                                    variant="ghost" 
                                    size="icon"
                                    className="h-6 w-6 text-white/60 hover:text-black"
                                    onClick={() => setShowNewFileDialog(true)}
                                    title="New File"
                                 >
                                    <Plus className="w-3.5 h-3.5" />
                                 </Button>
                            </div>
                            <FileTree 
                                fs={fs} 
                                currentPath={currentDir}
                                activeFile={activeFile}
                                onFileSelect={handleFileClick}
                                onDelete={handleDeleteFile}
                                className="flex-1"
                            />
                        </>
                    )}
                </div>

                {/* Editor Area */}
                <div 
                    className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e] relative"
                    onDragOver={(e) => {
                        e.preventDefault();
                        setIsDraggingOver(true);
                    }}
                    onDragLeave={(e) => {
                        e.preventDefault();
                        setIsDraggingOver(false);
                    }}
                    onDrop={(e) => {
                        e.preventDefault();
                        setIsDraggingOver(false);
                        const filePath = e.dataTransfer.getData('application/file-path');
                        if (filePath && fs.files[filePath]) {
                            handleFileClick(filePath);
                            toast.success(`Opened ${filePath}`);
                        }
                    }}
                >
                    {/* Drop Zone Overlay */}
                    {isDraggingOver && (
                        <div className="absolute inset-0 z-50 bg-[#ac1ed6]/10 border-2 border-[#ac1ed6] border-dashed rounded-lg flex items-center justify-center backdrop-blur-[1px]">
                            <div className="bg-[#1e1e1e] px-4 py-2 rounded-lg border border-[#ac1ed6]/50 shadow-xl flex items-center gap-2 text-[#ac1ed6]">
                                <FileCode className="w-5 h-5" />
                                <span className="font-medium">Drop to open</span>
                            </div>
                        </div>
                    )}
                    {/* Active File Tab Bar */}
                     <div className="flex bg-[#1a1a1a] border-b border-white/10 overflow-x-auto scrolbar-hide">
                        {openFiles.map(file => (
                            <div 
                                key={file}
                                onClick={() => setActiveFile(file)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 text-sm cursor-pointer border-r border-white/5 min-w-[120px] max-w-[200px] group select-none transition-colors",
                                    activeFile === file 
                                        ? "bg-[#1e1e1e] border-t-2 border-t-[#ac1ed6] text-white" 
                                        : "bg-[#1a1a1a] border-t-2 border-t-transparent text-white/50 hover:bg-[#1e1e1e]/50 hover:text-white/80"
                                )}
                            >
                                <FileCode className={cn("w-3.5 h-3.5", activeFile === file ? "text-[#ac1ed6]" : "text-white/40")} />
                                <span className="truncate flex-1">{file.split('/').pop()}</span>
                                <button 
                                    onClick={(e) => handleCloseTab(e, file)}
                                    className={cn(
                                        "ml-1 p-0.5 rounded-sm hover:bg-white/20 transition-colors opacity-0 group-hover:opacity-100",
                                        activeFile === file ? "text-white/60 hover:text-white opacity-100" : "text-white/40 hover:text-white/80"
                                    )}
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                     </div>

                     <div className="flex-1 relative">
                        {activeFile ? (
                            <Editor
                                height="100%"
                                language={fs.files[activeFile]?.language || 'plaintext'}
                                theme="vs-dark"
                                value={activeFileContent}
                                onChange={(value) => {
                                    const newContent = value || '';
                                    setActiveFileContent(newContent);
                                    setFs(prev => ({
                                        ...prev,
                                        files: {
                                            ...prev.files,
                                            [activeFile]: {
                                                ...prev.files[activeFile],
                                                content: newContent
                                            }
                                        }
                                    }));
                                }}
                                options={{
                                    fontSize: 12,
                                    fontFamily: "'Fira Code', 'Monaco', 'Menlo', monospace",
                                    minimap: { enabled: false },
                                    automaticLayout: true,
                                    wordWrap: 'on',
                                    padding: { top: 16 },
                                }}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-white/20">
                                <div className="text-center">
                                    <div className="text-4xl mb-4 opacity-50">⚡️</div>
                                    <p>Select a file to edit</p>
                                </div>
                            </div>
                        )}
                     </div>
                </div>
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

    </motion.div>
  );
}
