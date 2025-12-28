import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Code2, Globe, Layers, FileJson, Terminal, BookOpen, ChevronUp, ChevronDown, X, Maximize2, Minimize2 } from 'lucide-react';
import { WebDevPlayground } from './WebDevPlayground';
import { WebDevQuestions } from './WebDevQuestions';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const LEARNING_CONTENT = {
  html: {
    title: 'HTML5',
    icon: <Globe className="w-5 h-5 text-[#E34F26]" />,
    questions: [
      { q: 'What is the difference between block and inline elements?', a: 'Block elements always start on a new line and take up the full width available (e.g., <div>, <p>, <h1>). Inline elements do not start on a new line and only take up as much width as necessary (e.g., <span>, <a>, <img>).' },
      { q: 'What are semantic tags in HTML5?', a: 'Semantic tags clearly describe their meaning to both the browser and the developer. Examples include <header>, <footer>, <article>, <section>, and <nav>. They improve accessibility and SEO.' },
      { q: 'Explain the difference between localStorage, sessionStorage, and cookies.', a: 'localStorage persists data even after the browser is closed. sessionStorage stores data only for the duration of the page session. Cookies are primarily used for server-side reading and have an expiration date.' }
    ]
  },
  css: {
    title: 'CSS3',
    icon: <Layers className="w-5 h-5 text-[#1572B6]" />,
    questions: [
      { q: 'What is the Box Model?', a: 'The CSS Box Model is a box that wraps around every HTML element. It consists of: Content (the actual image/text), Padding (space around content), Border (around padding), and Margin (space outside the border).' },
      { q: 'Explain Flexbox vs Grid.', a: 'Flexbox is designed for one-dimensional layouts (row OR column). CSS Grid is designed for two-dimensional layouts (rows AND columns). Flexbox is better for alignment, while Grid is better for overall page layout.' },
      { q: 'What is specificity in CSS?', a: 'Specificity is the set of rules that determines which style is applied to an element. Hierarchy: Inline styles > IDs > Classes/Attributes/Pseudo-classes > Elements/Pseudo-elements.' }
    ]
  },
  js: {
    title: 'JavaScript',
    icon: <FileJson className="w-5 h-5 text-[#F7DF1E]" />,
    questions: [
      { q: 'What is the difference between let, const, and var?', a: 'var is function-scoped and can be redeclared. let is block-scoped and can be updated but not redeclared. const is block-scoped and cannot be updated or redeclared.' },
      { q: 'What is a Promise?', a: 'A Promise is an object representing the eventual completion or failure of an asynchronous operation. It has three states: pending, fulfilled, and rejected.' },
      { q: 'Explain the Event Loop.', a: 'The Event Loop is a mechanism that allows JavaScript to perform non-blocking I/O operations. It constantly checks the Call Stack and the Callback Queue. If the Call Stack is empty, it pushes the first event from the Queue to the Stack.' }
    ]
  },
  react: {
    title: 'React',
    icon: <Code2 className="w-5 h-5 text-[#61DAFB]" />,
    questions: [
      { q: 'What are Hooks?', a: 'Hooks are functions that let you "hook into" React state and lifecycle features from function components. Common hooks include useState, useEffect, and useContext.' },
      { q: 'What is the Virtual DOM?', a: 'The Virtual DOM is a lightweight copy of the actual DOM. React uses it to identify changes (diffing) and efficiently update only the necessary parts of the real DOM (reconciliation).' },
      { q: 'Props vs State?', a: 'Props (properties) are read-only and passed from parent to child. State is managed within the component and can change over time, triggering re-renders.' }
    ]
  },
  cli: {
    title: 'CLI & Git',
    icon: <Terminal className="w-5 h-5 text-white" />,
    questions: [
      { q: 'Basic Git Commands?', a: 'git init (initialize repo), git add . (stage changes), git commit -m "msg" (save changes), git push (upload to remote), git pull (download from remote).' },
      { q: 'What is a branch in Git?', a: 'A branch represents an independent line of development. It allows you to work on features or fixes without affecting the main codebase until you merge them.' },
      { q: 'Common CLI commands?', a: 'ls (list files), cd (change directory), mkdir (make directory), touch (create file), rm (remove file), pwd (print working directory).' }
    ]
  }
};

export function WebDevPractice() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    // Only add listener if open
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="space-y-8 relative pb-32">
      {/* Full-width Playground Section */}
      <div className="w-full">
        <WebDevPlayground />
      </div>

      {/* Practice Questions Section - Full Width */}
      <div className="w-full">
        <WebDevQuestions />
      </div>

      {/* Backdrop for focus */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Dynamic Island Container */}
      <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center items-end pointer-events-none">
        <div ref={containerRef} className="pointer-events-auto">
          <motion.div
            layout
            layoutId="dynamic-island"
            className={cn(
              "bg-[#1e1e1e] border border-white/10 shadow-2xl overflow-hidden",
              isOpen ? "rounded-[32px]" : "rounded-full"
            )}
            initial={false}
            animate={{
              width: isOpen ? "min(90vw, 800px)" : "200px",
              height: isOpen ? "600px" : "56px",
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
          >
            {/* Header / Trigger Area */}
            <motion.div 
              layout 
              className={cn(
                "flex items-center w-full bg-gradient-to-r from-[#ac1ed6]/10 to-[#c26e73]/10 border-b border-white/5",
                isOpen ? "h-16 px-6 justify-between cursor-default" : "h-full px-4 justify-center cursor-pointer hover:bg-white/5 transition-colors"
              )}
              onClick={!isOpen ? () => setIsOpen(true) : undefined}
            >
               <motion.div layout="position" className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-[#ac1ed6] to-[#c26e73] rounded-full shadow-lg shadow-purple-500/20">
                    <BookOpen className="w-4 h-4 text-white" />
                  </div>
                  <span className={cn("font-bold text-white tracking-wide", isOpen ? "text-lg" : "text-sm")}>
                    Interview Q&A
                  </span>
               </motion.div>

               {isOpen && (
                 <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ delay: 0.1 }}
                 >
                   <Button
                     variant="ghost"
                     size="icon"
                     className="rounded-full hover:bg-white/10 text-white/70 hover:text-white"
                     onClick={(e) => {
                       e.stopPropagation();
                       setIsOpen(false);
                     }}
                   >
                     <X className="w-5 h-5" />
                   </Button>
                 </motion.div>
               )}
            </motion.div>

            {/* Content Area */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ delay: 0.1, duration: 0.2 }}
                        className="h-[calc(100%-64px)] w-full"
                    >
                         <ScrollArea className="h-full">
                            <div className="p-6 pb-20">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Object.entries(LEARNING_CONTENT).map(([key, section]) => (
                                    <div key={key} className="space-y-3">
                                    <div className="flex items-center gap-2 text-white/80 font-semibold mb-2">
                                        {section.icon}
                                        {section.title}
                                    </div>
                                    <Accordion type="single" collapsible className="w-full space-y-2">
                                        {section.questions.map((item, index) => (
                                        <AccordionItem 
                                            key={index} 
                                            value={`${key}-${index}`} 
                                            className="border border-white/10 bg-white/5 rounded-xl px-3 data-[state=open]:bg-white/10 transition-all duration-200"
                                        >
                                            <AccordionTrigger className="text-white/80 hover:text-white text-sm text-left hover:no-underline py-3">
                                            {item.q}
                                            </AccordionTrigger>
                                            <AccordionContent className="text-white/60 text-sm leading-relaxed pb-3">
                                            {item.a}
                                            </AccordionContent>
                                        </AccordionItem>
                                        ))}
                                    </Accordion>
                                    </div>
                                ))}
                                </div>
                            </div>
                         </ScrollArea>
                    </motion.div>
                )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
