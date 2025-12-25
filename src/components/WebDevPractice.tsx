import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Code2, Globe, Layers, FileJson, Terminal, BookOpen, ChevronUp, ChevronDown } from 'lucide-react';
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
  const [isQAPanelOpen, setIsQAPanelOpen] = useState(false);

  return (
    <div className="space-y-8 relative">
      {/* Full-width Playground Section */}
      <div className="w-full">
        <WebDevPlayground />
      </div>

      {/* Practice Questions Section - Full Width */}
      <div className="w-full">
        <WebDevQuestions />
      </div>

      {/* Floating Toggle Button */}
      <Button
        onClick={() => setIsQAPanelOpen(!isQAPanelOpen)}
        className={cn(
          "fixed bottom-6 left-6 z-40 h-14 px-6 rounded-full shadow-2xl transition-all duration-300",
          "bg-gradient-to-r from-[#ac1ed6] to-[#c26e73] hover:from-[#ac1ed6]/90 hover:to-[#c26e73]/90",
          "border-2 border-white/20 backdrop-blur-sm",
          isQAPanelOpen ? "shadow-[0_0_30px_rgba(172,30,214,0.5)]" : "shadow-[0_0_20px_rgba(172,30,214,0.3)]"
        )}
      >
        <BookOpen className="w-5 h-5 mr-2" />
        <span className="font-semibold">Interview Q&A</span>
        {isQAPanelOpen ? (
          <ChevronDown className="w-5 h-5 ml-2" />
        ) : (
          <ChevronUp className="w-5 h-5 ml-2" />
        )}
      </Button>

      {/* Collapsible Interview Q&A Panel */}
      <AnimatePresence>
        {isQAPanelOpen && (
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-30 h-[500px]"
          >
            <Card className="h-full border-t-2 border-white/10 bg-[#221f20] shadow-2xl rounded-t-3xl flex flex-col">
              <CardHeader className="bg-gradient-to-r from-[#ac1ed6]/10 to-[#c26e73]/10 border-b border-white/10 shrink-0">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-white text-xl">
                      <BookOpen className="w-5 h-5 text-[#ac1ed6]" />
                      Interview Q&A
                    </CardTitle>
                    <CardDescription className="text-white/60">
                      Master the fundamentals with curated Q&A
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsQAPanelOpen(false)}
                    className="text-white/60 hover:text-white hover:bg-white/10"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Object.entries(LEARNING_CONTENT).map(([key, section]) => (
                        <div key={key} className="space-y-3">
                          <div className="flex items-center gap-2 text-white/80 font-semibold">
                            {section.icon}
                            {section.title}
                          </div>
                          <Accordion type="single" collapsible className="w-full">
                            {section.questions.map((item, index) => (
                              <AccordionItem key={index} value={`${key}-${index}`} className="border-white/10">
                                <AccordionTrigger className="text-white/70 hover:text-white text-sm text-left">
                                  {item.q}
                                </AccordionTrigger>
                                <AccordionContent className="text-white/50 text-sm leading-relaxed">
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
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
