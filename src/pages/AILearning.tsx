import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Layout } from '@/components/Layout';
import { Sparkles, BookOpen, Video, FileText, Brain, Loader2, CheckCircle2, XCircle, Lightbulb, Target, Award, Lock, AlertTriangle, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { BackToDashboard } from '@/components/BackToDashboard';
import { BeautifulFooter } from "@/components/BeautifulFooter";
import StudentLoader from "@/components/studentportalload";
import { FlashcardViewer } from "@/components/FlashcardViewer";
import { useSpacedRepetition, SpacedRepetitionCard } from "@/hooks/useSpacedRepetition";
import { motion } from 'framer-motion';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface Question {
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  points: number;
  type: 'multiple_choice' | 'short_answer';
}

interface Resources {
  notes: string;
  videoSearchQueries: string[];
  subtopics: string[];
  tips: string[];
  keyPoints: string[];
}

const AILearning = () => {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [testSize, setTestSize] = useState('10');
  const [difficulty, setDifficulty] = useState('medium');
  const [generatedTest, setGeneratedTest] = useState<Question[]>([]);
  const [resources, setResources] = useState<Resources | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [flashcards, setFlashcards] = useState<SpacedRepetitionCard[]>([]);
  const [selectedAction, setSelectedAction] = useState<'test' | 'resources' | 'flashcards'>('test');
  const { calculateNextReview, getDueCards, getUpcomingReviews, initializeCard } = useSpacedRepetition();

  // Password protection states
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [pendingAction, setPendingAction] = useState<'test' | 'resources' | 'flashcards' | null>(null);
  
  // Check if there's any generated content
  const hasGeneratedContent = generatedTest.length > 0 || resources !== null || flashcards.length > 0;
  const ADMIN_PASSWORD = 'ingypNDmjHOtz1oFHxhHUc2Zh';

  const formatText = (text: string) => {
    // Split by display math ($$...$$), inline math ($...$), bold (**...**), and code (`...`)
    const parts = text.split(/(\$\$[^$]+\$\$|\$[^$]+\$|\*\*.*?\*\*|`.*?`)/g);
    
    return parts.map((part, index) => {
      // Display math ($$...$$)
      if (part.startsWith('$$') && part.endsWith('$$')) {
        const mathContent = part.slice(2, -2);
        try {
          const html = katex.renderToString(mathContent, {
            displayMode: true,
            throwOnError: false,
            output: 'html'
          });
          return (
            <div 
              key={index} 
              className="my-4 overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch (e) {
          return <span key={index} className="text-red-400">Error rendering math: {mathContent}</span>;
        }
      }
      
      // Inline math ($...$)
      if (part.startsWith('$') && part.endsWith('$') && !part.startsWith('$$')) {
        const mathContent = part.slice(1, -1);
        try {
          const html = katex.renderToString(mathContent, {
            displayMode: false,
            throwOnError: false,
            output: 'html'
          });
          return (
            <span 
              key={index} 
              className="inline-block mx-1"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch (e) {
          return <span key={index} className="text-red-400">Error: {mathContent}</span>;
        }
      }
      
      // Bold text (**...**)
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-bold text-white">{part.slice(2, -2)}</strong>;
      }
      
      // Code/italic (`...`)
      if (part.startsWith('`') && part.endsWith('`')) {
        return <span key={index} className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-white">{part.slice(1, -1)}</span>;
      }
      
      return part;
    });
  };

  // Handle page refresh and navigation warnings
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasGeneratedContent) {
        e.preventDefault();
        e.returnValue = ''; // Required for Chrome
        return ''; // For older browsers
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasGeneratedContent]);

  // Check generation limit (once every 2 days)
  const checkGenerationLimit = (): boolean => {
    const today = new Date();
    const storageKey = 'ai_generations';
    const stored = localStorage.getItem(storageKey);

    if (!stored) {
      return true; // First time, allow
    }

    try {
      const data = JSON.parse(stored);
      const lastUsedDate = new Date(data.date);
      
      // Calculate the difference in days
      const daysDifference = Math.floor((today.getTime() - lastUsedDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // Allow if 2 or more days have passed
      if (daysDifference >= 2) {
        return true;
      }
      
      // Check if already used within the 2-day period
      return data.count < 1;
    } catch {
      return true;
    }
  };

  const incrementGenerationCount = () => {
    const today = new Date().toISOString();
    const storageKey = 'ai_generations';
    const stored = localStorage.getItem(storageKey);

    if (!stored) {
      localStorage.setItem(storageKey, JSON.stringify({ date: today, count: 1 }));
      return;
    }

    try {
      const data = JSON.parse(stored);
      // Update the date to current time when incrementing
      localStorage.setItem(storageKey, JSON.stringify({ date: today, count: data.count + 1 }));
    } catch {
      localStorage.setItem(storageKey, JSON.stringify({ date: today, count: 1 }));
    }
  };

  const handlePasswordSubmit = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setShowPasswordDialog(false);
      setPasswordInput('');

      // Proceed with pending action
      if (pendingAction === 'test') {
        executeGenerateTest();
      } else if (pendingAction === 'resources') {
        executeGetResources();
      } else if (pendingAction === 'flashcards') {
        executeGenerateFlashcards();
      }
      setPendingAction(null);
    } else {
      toast({
        title: "Incorrect Password",
        description: "Please enter the correct password",
        variant: "destructive"
      });
    }
  };

  const generateTest = async () => {
    if (!topic || !subject || !grade) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    // Check generation limit
    if (!checkGenerationLimit()) {
      setPendingAction('test');
      setShowPasswordDialog(true);
      return;
    }

    await executeGenerateTest();
  };

  const executeGenerateTest = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-learning', {
        body: {
          action: 'generate_test',
          topic,
          subject,
          grade,
          testSize: parseInt(testSize),
          difficulty
        }
      });

      if (error) throw error;

      setGeneratedTest(data);
      setShowResults(false);
      setUserAnswers({});
      incrementGenerationCount();
      toast({
        title: "Test Generated!",
        description: `${data.length} questions created successfully`,
      });
    } catch (error) {
      console.error('Error generating test:', error);
      toast({
        title: "Error",
        description: "Failed to generate test. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getResources = async () => {
    if (!topic || !subject || !grade) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    // Check generation limit
    if (!checkGenerationLimit()) {
      setPendingAction('resources');
      setShowPasswordDialog(true);
      return;
    }

    await executeGetResources();
  };

  const executeGetResources = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-learning', {
        body: {
          action: 'get_resources',
          topic,
          subject,
          grade
        }
      });

      if (error) throw error;

      setResources(data);
      incrementGenerationCount();
      toast({
        title: "Resources Ready!",
        description: "Study materials loaded successfully",
      });
    } catch (error) {
      console.error('Error getting resources:', error);
      toast({
        title: "Error",
        description: "Failed to load resources. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const exportResourcesToNotes = () => {
    if (!resources) return;

    // Helper to format text strings into HTML/Strings for the note content
    // This avoids returning [object Object] from JSX elements
    const formatForExport = (text: string) => {
      let formatted = text;
      // Convert bold **text** to <strong>text</strong>
      formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Convert code `text` to <code>text</code>
      formatted = formatted.replace(/`(.*?)`/g, '<code>$1</code>');
      // Math is left as is ($...$ or $$...$$) for the Notes app to handle/render
      return formatted;
    };

    const noteContent = `
      <h1>Study Resources: ${topic}</h1>
      <p><strong>Subject:</strong> ${subject} | <strong>Grade:</strong> ${grade}</p>
      
      <h2>Study Notes</h2>
      <p>${formatForExport(resources.notes)}</p>

      <h2>Video Resources</h2>
      <ul>
        ${resources.videoSearchQueries.map(q => `<li><a href="${getYouTubeSearchUrl(q)}">${q}</a></li>`).join('')}
      </ul>

      <h2>Key Subtopics</h2>
      <ul>
        ${resources.subtopics.map(s => `<li>${formatForExport(s)}</li>`).join('')}
      </ul>

      <h2>Study Tips</h2>
      <ul>
        ${resources.tips.map(t => `<li>${formatForExport(t)}</li>`).join('')}
      </ul>

      <h2>Key Points to Remember</h2>
      <ol>
        ${resources.keyPoints.map(p => `<li>${formatForExport(p)}</li>`).join('')}
      </ol>
    `.trim();

    const newNote = {
      id: `note_${Date.now()}`,
      title: `Study Resources: ${topic} (${subject})`,
      content: noteContent,
      tags: [subject, 'AI Learning', 'Study Resources'],
      color: 'bg-[#221f20]',
      isPinned: false,
      isFavorite: false,
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('elysiar_notes');
      const notes = stored ? JSON.parse(stored) : [];
      localStorage.setItem('elysiar_notes', JSON.stringify([newNote, ...notes]));
      
      toast({
        title: "Exported to Notes",
        description: "Study resources saved to your notes successfully",
      });
    } catch (error) {
      console.error('Error saving note:', error);
      toast({
        title: "Export Failed",
        description: "Could not save to notes",
        variant: "destructive"
      });
    }
  };

  const submitTest = () => {
    setShowResults(true);
    const correct = generatedTest.filter((q, idx) =>
      userAnswers[idx]?.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()
    ).length;

    toast({
      title: "Test Completed!",
      description: `You scored ${correct}/${generatedTest.length}`,
    });
  };

  const getYouTubeSearchUrl = (query: string) => {
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  };

  const generateFlashcards = async () => {
    if (!topic || !subject || !grade) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    // Check generation limit
    if (!checkGenerationLimit()) {
      setPendingAction('flashcards');
      setShowPasswordDialog(true);
      return;
    }

    await executeGenerateFlashcards();
  };

  const executeGenerateFlashcards = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-learning', {
        body: {
          action: 'generate_flashcards',
          topic,
          subject,
          grade
        }
      });

      if (error) throw error;

      const newFlashcards = data.map((card: { front: string; back: string }) =>
        initializeCard(crypto.randomUUID(), card.front, card.back)
      );

      setFlashcards(newFlashcards);
      incrementGenerationCount();
      toast({
        title: "Flashcards Generated!",
        description: `${data.length} flashcards created successfully`,
      });
    } catch (error) {
      console.error('Error generating flashcards:', error);
      toast({
        title: "Error",
        description: "Failed to generate flashcards. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFlashcardRate = (cardId: string, rating: 'easy' | 'medium' | 'hard') => {
    setFlashcards(cards =>
      cards.map(card =>
        card.id === cardId ? calculateNextReview(rating, card) : card
      )
    );
    toast({
      title: "Progress Saved",
      description: `Card marked as ${rating}`,
    });
  };

  const handleDeleteFlashcard = (cardId: string) => {
    setFlashcards(cards => cards.filter(card => card.id !== cardId));
    toast({
      title: "Card Deleted",
      description: "Flashcard removed successfully",
    });
  };

  const dueCards = getDueCards(flashcards);
  const upcomingReviews = getUpcomingReviews(flashcards);

  const calculateScore = () => {
    const correct = generatedTest.filter((q, idx) =>
      userAnswers[idx]?.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()
    ).length;
    return { correct, total: generatedTest.length, percentage: Math.round((correct / generatedTest.length) * 100) };
  };

  if (loading || showLoader) {
    return (
      <div className="bg-black min-h-screen">
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <StudentLoader />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className='bg-[#090607] min-h-screen'>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-9xl mx-auto space-y-8">
            <div className="mb-4">
              <BackToDashboard />
            </div>

            {/* Enhanced Header with Gradient */}
            <div className="text-center space-y-4 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#ac1ed6]/10 via-[#c26e73]/10 to-[#ac1ed6]/10 rounded-3xl blur-3xl -z-10" />
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#ac1ed6] via-[#c26e73] to-[#ac1ed6] bg-clip-text text-transparent">
                  Create, explore, be inspired
                </h1>
              </div>
              <p className="text-lg text-white/60 max-w-2xl mx-auto">
                Personalized AI-powered learning at your fingertips
              </p>
              <p className="text-sm text-[#c26e73] italic underline mx-auto">
                # Do not refresh the page or use the back button, as it may delete your AI-generated data or flashcards.
              </p>
            </div>

            <div className="flex justify-center mt-3 pt-4">
                <a 
                  href="/coding-practice"
                  className="group flex w-[180px] h-fit bg-[#1d2129] rounded-[40px] justify-between items-center border-none cursor-pointer transition-all duration-300"
                >
                  <span className="flex items-center justify-center text-white text-sm tracking-wide w-[calc(180px-38px)] h-full px-1">
                    AI Coding Practice
                  </span>
                  <span className="w-[38px] h-[38px] bg-[#f59aff] flex items-center justify-center rounded-full border-[3px] border-[#1d2129]">
                    <svg 
                      width={14} 
                      height={16} 
                      viewBox="0 0 16 19" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      className="group-hover:animate-[arrow_1s_linear_infinite]"
                    >
                      <circle cx="1.61321" cy="1.61321" r="1.5" fill="black" />
                      <circle cx="5.73583" cy="1.61321" r="1.5" fill="black" />
                      <circle cx="5.73583" cy="5.5566" r="1.5" fill="black" />
                      <circle cx="9.85851" cy="5.5566" r="1.5" fill="black" />
                      <circle cx="9.85851" cy="9.5" r="1.5" fill="black" />
                      <circle cx="13.9811" cy="9.5" r="1.5" fill="black" />
                      <circle cx="5.73583" cy="13.4434" r="1.5" fill="black" />
                      <circle cx="9.85851" cy="13.4434" r="1.5" fill="black" />
                      <circle cx="1.61321" cy="17.3868" r="1.5" fill="black" />
                      <circle cx="5.73583" cy="17.3868" r="1.5" fill="black" />
                    </svg>
                  </span>
                </a>
              </div>

              <style>{`
                @keyframes arrow {
                  0% {
                    opacity: 0;
                    margin-left: 0px;
                  }
                  100% {
                    opacity: 1;
                    margin-left: 10px;
                  }
                }
              `}</style>

            {/* Enhanced Configuration Card */}
            <Card className="border border-white/10 bg-[#221f20] shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-[#ac1ed6]/5 to-[#c26e73]/5">
                <CardTitle className="flex items-center gap-2 text-2xl text-white">
                  <Target className="w-6 h-6 text-[#ac1ed6]" />
                  Shape Your Knowledge Path
                </CardTitle>
                <CardDescription className="text-base text-white/60">
                  Tell us what you want to learn, and we'll create personalized content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="topic" className="text-base font-semibold text-white">Topic</Label>
                    <Input
                      id="topic"
                      placeholder="e.g., Photosynthesis, Quadratic Equations"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="h-11 border border-white/20 bg-[#090607] text-white placeholder:text-white/40 focus:border-[#ac1ed6] transition-colors rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-base font-semibold text-white">Subject / Domain</Label>
                    <Select value={subject} onValueChange={setSubject}>
                      <SelectTrigger className="h-11 border border-white/20 bg-[#090607] text-white rounded-xl">
                        <SelectValue placeholder="Select a subject or domain" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#221f20] border-white/20 text-white max-h-[400px]">
                        {/* Python Topics */}
                        <div className="px-2 py-1.5 text-xs font-semibold text-[#ac1ed6] uppercase tracking-wide">
                          Python Programming
                        </div>
                        <SelectItem value="Python Basics">Python Basics & Syntax</SelectItem>
                        <SelectItem value="Python Data Structures">Data Structures (Lists, Tuples, Dicts)</SelectItem>
                        <SelectItem value="Python OOP">Object-Oriented Programming</SelectItem>
                        <SelectItem value="Python File Handling">File Handling & I/O</SelectItem>
                        <SelectItem value="Python Libraries">Popular Libraries (NumPy, Pandas)</SelectItem>
                        <SelectItem value="Python Web Scraping">Web Scraping (BeautifulSoup, Selenium)</SelectItem>
                        <SelectItem value="Python Django">Django Framework</SelectItem>
                        <SelectItem value="Python Flask">Flask Framework</SelectItem>
                        <SelectItem value="Python Data Science">Data Science & Analytics</SelectItem>
                        <SelectItem value="Python Machine Learning">Machine Learning Basics</SelectItem>
                        <SelectItem value="Python Automation">Automation & Scripting</SelectItem>
                        
                        <div className="h-px bg-white/10 my-2" />
                        
                        {/* Web Development Topics */}
                        <div className="px-2 py-1.5 text-xs font-semibold text-[#c26e73] uppercase tracking-wide">
                          Web Development
                        </div>
                        <SelectItem value="HTML5">HTML5 & Semantic Markup</SelectItem>
                        <SelectItem value="CSS3">CSS3 & Styling</SelectItem>
                        <SelectItem value="CSS Flexbox">CSS Flexbox Layout</SelectItem>
                        <SelectItem value="CSS Grid">CSS Grid Layout</SelectItem>
                        <SelectItem value="Responsive Design">Responsive Web Design</SelectItem>
                        <SelectItem value="JavaScript Fundamentals">JavaScript Fundamentals</SelectItem>
                        <SelectItem value="JavaScript ES6+">Modern JavaScript (ES6+)</SelectItem>
                        <SelectItem value="JavaScript DOM">DOM Manipulation</SelectItem>
                        <SelectItem value="JavaScript Async">Async JavaScript & Promises</SelectItem>
                        <SelectItem value="React">React.js Framework</SelectItem>
                        <SelectItem value="React Hooks">React Hooks</SelectItem>
                        <SelectItem value="React Router">React Router & Navigation</SelectItem>
                        <SelectItem value="State Management">State Management (Redux, Context)</SelectItem>
                        <SelectItem value="Node.js">Node.js & Backend</SelectItem>
                        <SelectItem value="Express.js">Express.js Framework</SelectItem>
                        <SelectItem value="REST APIs">RESTful APIs</SelectItem>
                        <SelectItem value="Web Security">Web Security Best Practices</SelectItem>
                        <SelectItem value="Git & GitHub">Git & Version Control</SelectItem>
                        
                        <div className="h-px bg-white/10 my-2" />
                        
                        {/* Other Subjects */}
                        <div className="px-2 py-1.5 text-xs font-semibold text-white/60 uppercase tracking-wide">
                          Other Subjects
                        </div>
                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                        <SelectItem value="Physics">Physics</SelectItem>
                        <SelectItem value="Chemistry">Chemistry</SelectItem>
                        <SelectItem value="Biology">Biology</SelectItem>
                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                        <SelectItem value="Data Structures">Data Structures & Algorithms</SelectItem>
                        <SelectItem value="Database">Database Management</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="grade" className="text-base font-semibold text-white">Grade/Level</Label>
                    <Select value={grade} onValueChange={setGrade}>
                      <SelectTrigger className="h-11 border border-white/20 bg-[#090607] text-white rounded-xl">
                        <SelectValue placeholder="Select grade level" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#221f20] border-white/20 text-white">
                        <SelectItem value="elementary">Elementary (Grades 1-5)</SelectItem>
                        <SelectItem value="middle">Middle School (Grades 6-8)</SelectItem>
                        <SelectItem value="high">High School (Grades 9-12)</SelectItem>
                        <SelectItem value="college">College/University</SelectItem>
                        <SelectItem value="advanced">Graduate/Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="testSize" className="text-base font-semibold text-white">Test Size</Label>
                    <Select value={testSize} onValueChange={setTestSize}>
                      <SelectTrigger className="h-11 border border-white/20 bg-[#090607] text-white rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#221f20] border-white/20 text-white">
                        <SelectItem value="5">5 Questions</SelectItem>
                        <SelectItem value="10">10 Questions</SelectItem>
                        <SelectItem value="15">15 Questions</SelectItem>
                        <SelectItem value="20">20 Questions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="difficulty" className="text-base font-semibold text-white">Difficulty</Label>
                    <Select value={difficulty} onValueChange={setDifficulty}>
                      <SelectTrigger className="h-11 border border-white/20 bg-[#090607] text-white rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#221f20] border-white/20 text-white">
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Styled Radio Button for Action Selection */}
                <div className="pt-6 space-y-4">
                  <Label className="text-base font-semibold text-white">Choose Action</Label>
                  <div className="flex justify-center">
                    <div className="relative flex items-center h-[50px] w-full max-w-[600px] border-2 border-[#ac1ed6] rounded-[30px] overflow-hidden">
                      <input
                        id="action-test"
                        name="action"
                        type="radio"
                        className="hidden"
                        checked={selectedAction === 'test'}
                        onChange={() => setSelectedAction('test')}
                      />
                      <label
                        htmlFor="action-test"
                        className="flex-1 text-center cursor-pointer relative z-10 transition-all duration-500 font-medium text-base py-3"
                        style={{ color: selectedAction === 'test' ? '#212121' : '#7d7d7d', fontWeight: selectedAction === 'test' ? 'bold' : '500' }}
                      >
                        <FileText className="w-4 h-4 inline-block mr-2" />
                        Generate Test
                      </label>
                      
                      <input
                        id="action-resources"
                        name="action"
                        type="radio"
                        className="hidden"
                        checked={selectedAction === 'resources'}
                        onChange={() => setSelectedAction('resources')}
                      />
                      <label
                        htmlFor="action-resources"
                        className="flex-1 text-center cursor-pointer relative z-10 transition-all duration-500 font-medium text-base py-3"
                        style={{ color: selectedAction === 'resources' ? '#212121' : '#7d7d7d', fontWeight: selectedAction === 'resources' ? 'bold' : '500' }}
                      >
                        <BookOpen className="w-4 h-4 inline-block mr-2" />
                        Get Resources
                      </label>
                      
                      <input
                        id="action-flashcards"
                        name="action"
                        type="radio"
                        className="hidden"
                        checked={selectedAction === 'flashcards'}
                        onChange={() => setSelectedAction('flashcards')}
                      />
                      <label
                        htmlFor="action-flashcards"
                        className="flex-1 text-center cursor-pointer relative z-10 transition-all duration-500 font-medium text-base py-3"
                        style={{ color: selectedAction === 'flashcards' ? '#212121' : '#7d7d7d', fontWeight: selectedAction === 'flashcards' ? 'bold' : '500' }}
                      >
                        <Brain className="w-4 h-4 inline-block mr-2" />
                        Flashcards
                      </label>
                      
                      <span
                        className="absolute h-[38px] bg-gradient-to-r from-[#ac1ed6] to-[#c26e73] top-[4px] rounded-[30px] transition-all duration-[400ms] ease-[cubic-bezier(0.175,0.885,0.32,1.275)]"
                        style={{
                          width: 'calc(33.33% - 8px)',
                          left: selectedAction === 'test' ? '4px' : selectedAction === 'resources' ? 'calc(33.33% + 0px)' : 'calc(66.66% - 4px)'
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Animated Button with Corner Dots and Lines */}
                  <div className="flex justify-center pt-6">
                    <div className="relative flex justify-center items-center w-auto h-auto p-[0.9rem_1.1rem] bg-transparent transition-all duration-300 group/wrapper hover:bg-[#ac1ed644]">
                      {/* Corner Dots */}
                      <div className="absolute w-[6px] h-[6px] rounded-full bg-[#666] opacity-0 top-1/2 left-1/5 group-hover/wrapper:animate-[move-top-left_0.35s_ease-in-out_forwards]" />
                      <div className="absolute w-[6px] h-[6px] rounded-full bg-[#666] opacity-0 top-1/2 right-1/5 group-hover/wrapper:animate-[move-top-right_0.35s_ease-in-out_0.21s_forwards]" />
                      <div className="absolute w-[6px] h-[6px] rounded-full bg-[#666] opacity-0 bottom-1/2 right-1/5 group-hover/wrapper:animate-[move-bottom-right_0.35s_ease-in-out_0.42s_forwards]" />
                      <div className="absolute w-[6px] h-[6px] rounded-full bg-[#666] opacity-0 bottom-1/2 left-1/5 group-hover/wrapper:animate-[move-bottom-left_0.35s_ease-in-out_0.63s_forwards]" />
                      
                      {/* Border Lines */}
                      <div className="absolute h-[1px] w-full top-[-0.5px] origin-top-left rotate-[5deg] scale-x-0 group-hover/wrapper:animate-[draw-top_0.35s_ease-in-out_0.28s_forwards] bg-[repeating-linear-gradient(90deg,transparent_0_4px,#999_4px_8px)]" />
                      <div className="absolute h-[1px] w-full bottom-[-0.5px] origin-bottom-right rotate-[5deg] scale-x-0 group-hover/wrapper:animate-[draw-bottom_0.35s_ease-in-out_0.7s_forwards] bg-[repeating-linear-gradient(90deg,transparent_0_4px,#999_4px_8px)]" />
                      <div className="absolute w-[1px] h-full left-[-0.5px] origin-bottom-left rotate-0 scale-y-0 group-hover/wrapper:animate-[draw-left_0.35s_ease-in-out_0.84s_forwards] bg-[repeating-linear-gradient(0deg,transparent_0_4px,#999_4px_8px)]" />
                      <div className="absolute w-[1px] h-full right-[-0.5px] origin-top-right rotate-[5deg] scale-y-0 group-hover/wrapper:animate-[draw-right_0.35s_ease-in-out_0.49s_forwards] bg-[repeating-linear-gradient(0deg,transparent_0_4px,#999_4px_8px)]" />
                      
                      <button
                        onClick={() => {
                          if (selectedAction === 'test') generateTest();
                          else if (selectedAction === 'resources') getResources();
                          else generateFlashcards();
                        }}
                        disabled={loading}
                        className="relative flex justify-center items-center px-6 py-3 bg-gradient-to-r from-[#ac1ed6] to-[#c26e73] border-[#ac1ed6] text-white font-semibold text-base capitalize rounded-[30%/200%] cursor-pointer shadow-[0_0_0px_1px_rgba(0,0,0,0.2),0px_1px_1px_rgba(3,7,18,0.02),0px_5px_4px_rgba(3,7,18,0.04),0px_12px_9px_rgba(3,7,18,0.06),0px_20px_15px_rgba(3,7,18,0.08),0px_32px_24px_rgba(3,7,18,0.1)] transition-all duration-200 hover:bg-white hover:text-[#ac1ed6] hover:scale-105 hover:rounded-[10%/200%] active:scale-98 active:rounded-[20%/200%] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        style={{
                          backgroundImage: loading ? 'none' : 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.15))'
                        }}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            {selectedAction === 'test' && (
                              <>
                                Generate Test
                                <FileText className="ml-2 h-6 w-6 stroke-[1] stroke-white fill-white/60 transition-all duration-300 group-hover/wrapper:stroke-[#ac1ed6] group-hover/wrapper:fill-[#c26e73]" />
                              </>
                            )}
                            {selectedAction === 'resources' && (
                              <>
                                Get Resources
                                <BookOpen className="ml-2 h-6 w-6 stroke-[1] stroke-white fill-white/60 transition-all duration-300 group-hover/wrapper:stroke-[#ac1ed6] group-hover/wrapper:fill-[#c26e73]" />
                              </>
                            )}
                            {selectedAction === 'flashcards' && (
                              <>
                                Create Flashcards
                                <Brain className="ml-2 h-6 w-6 stroke-[1] stroke-white fill-white/60 transition-all duration-300 group-hover/wrapper:stroke-[#ac1ed6] group-hover/wrapper:fill-[#c26e73]" />
                              </>
                            )}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <style>{`
                    @keyframes move-top-left {
                      90% { opacity: 0.6; }
                      100% { top: -3px; left: -3px; opacity: 1; }
                    }
                    @keyframes move-top-right {
                      80% { opacity: 0.6; }
                      100% { top: -3px; right: -3px; opacity: 1; }
                    }
                    @keyframes move-bottom-right {
                      80% { opacity: 0.6; }
                      100% { bottom: -3px; right: -3px; opacity: 1; }
                    }
                    @keyframes move-bottom-left {
                      80% { opacity: 0.6; }
                      100% { bottom: -3px; left: -3px; opacity: 1; }
                    }
                    @keyframes draw-top {
                      100% { transform: rotate(0deg) scaleX(1); }
                    }
                    @keyframes draw-bottom {
                      100% { transform: rotate(0deg) scaleX(1); }
                    }
                    @keyframes draw-left {
                      100% { transform: rotate(0deg) scaleY(1); }
                    }
                    @keyframes draw-right {
                      100% { transform: rotate(0deg) scaleY(1); }
                    }
                  `}</style>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Tabs */}
            <Tabs defaultValue="test" className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-14 p-1 bg-[#221f20] border border-white/10 rounded-xl">
                <TabsTrigger value="test" className="text-white/60 font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ac1ed6] data-[state=active]:to-[#c26e73] data-[state=active]:text-white rounded-lg">
                  <FileText className="w-4 h-4 mr-2" />
                  Test
                </TabsTrigger>
                <TabsTrigger value="resources" className="text-white/60 font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ac1ed6] data-[state=active]:to-[#c26e73] data-[state=active]:text-white rounded-lg">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Resources
                </TabsTrigger>
                <TabsTrigger value="flashcards" className="text-white/60 font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ac1ed6] data-[state=active]:to-[#c26e73] data-[state=active]:text-white rounded-lg">
                  <Brain className="w-4 h-4 mr-2" />
                  Flashcards
                </TabsTrigger>
              </TabsList>

              <TabsContent value="test" className="space-y-4 mt-6">
                {generatedTest.length > 0 ? (
                  <>
                    {showResults && (
                      <Card className="border border-[#ac1ed6] bg-[#221f20] shadow-lg rounded-2xl">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Award className="w-10 h-10 text-[#ac1ed6]" />
                              <div>
                                <h3 className="text-2xl font-bold text-white">Your Score</h3>
                                <p className="text-white/60">Test Results</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-4xl font-bold text-[#ac1ed6]">
                                {calculateScore().correct}/{calculateScore().total}
                              </div>
                              <div className="text-xl text-white/60">
                                {calculateScore().percentage}%
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    {generatedTest.map((q, idx) => (
                      <Card key={idx} className="border border-white/10 bg-[#221f20] hover:border-[#ac1ed6]/50 transition-colors duration-300 shadow-md hover:shadow-lg rounded-2xl">
                        <CardHeader className="bg-gradient-to-r from-[#ac1ed6]/5 to-transparent">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-lg font-bold text-white">
                              Question {idx + 1}
                            </CardTitle>
                            <div className="flex items-center gap-2 bg-[#ac1ed6]/10 px-3 py-1 rounded-full">
                              <Award className="w-4 h-4 text-[#ac1ed6]" />
                              <span className="text-sm font-semibold text-[#ac1ed6]">{q.points} points</span>
                            </div>
                          </div>
                          <CardDescription className="text-base mt-2 text-white/70">{q.question}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                          {q.type === 'multiple_choice' && q.options ? (
                            <div className="space-y-3">
                              {q.options.map((option, optIdx) => (
                                <Button
                                  key={optIdx}
                                  variant={userAnswers[idx] === option ? "default" : "outline"}
                                  className="w-full justify-start h-auto py-3 px-4 text-left hover:scale-[1.02] transition-transform"
                                  onClick={() => setUserAnswers({ ...userAnswers, [idx]: option })}
                                  disabled={showResults}
                                >
                                  <span className="font-medium mr-2">{String.fromCharCode(65 + optIdx)}.</span>
                                  {option}
                                </Button>
                              ))}
                            </div>
                          ) : (
                            <Input
                              placeholder="Type your answer..."
                              value={userAnswers[idx] || ''}
                              onChange={(e) => setUserAnswers({ ...userAnswers, [idx]: e.target.value })}
                              disabled={showResults}
                              className="h-12 border border-white/20 bg-[#090607] text-white placeholder:text-white/40 rounded-xl"
                            />
                          )}

                          {showResults && (
                            <div className={`p-4 rounded-xl border-2 ${userAnswers[idx]?.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()
                              ? 'bg-green-50 border-green-300 dark:bg-green-950/30'
                              : 'bg-red-50 border-red-300 dark:bg-red-950/30'
                              }`}>
                              <div className="flex items-center gap-2 mb-3">
                                {userAnswers[idx]?.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim() ? (
                                  <>
                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                    <p className="font-bold text-green-700 dark:text-green-400">Correct!</p>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-5 h-5 text-red-600" />
                                    <p className="font-bold text-red-700 dark:text-red-400">Incorrect</p>
                                  </>
                                )}
                              </div>
                              <p className="mb-2"><strong>Correct Answer:</strong> {q.correctAnswer}</p>
                              <div className="flex items-start gap-2 mt-3 pt-3 border-t">
                                <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <p className="text-sm">{q.explanation}</p>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}

                    {!showResults && (
                      <Button onClick={submitTest} className="w-full h-14 text-lg font-bold shadow-lg hover:shadow-xl transition-all" size="lg">
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        Submit Test
                      </Button>
                    )}
                  </>
                ) : (
                  <Card className="border border-dashed border-white/20 bg-[#221f20] rounded-2xl">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                      <FileText className="w-20 h-20 text-white/30 mb-4" />
                      <p className="text-lg text-white/60 text-center mb-4">
                        You haven't generated any tests yet.
                        <br />Customize your preferences and hit 'Generate Test' to get started.                    </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="resources" className="space-y-6 mt-6">
                {resources ? (
                  <>
                    <Card className="border border-white/10 bg-[#221f20] shadow-lg rounded-2xl">
                      <CardHeader className="bg-gradient-to-r from-[#ac1ed6]/5 to-transparent">
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2 text-xl text-white">
                            <BookOpen className="w-6 h-6 text-[#ac1ed6]" />
                            Study Notes
                          </CardTitle>
                          <Button
                            onClick={exportResourcesToNotes}
                            variant="outline"
                            size="sm"
                            className="border-[#ac1ed6] text-[#ac1ed6] hover:bg-[#ac1ed6] hover:text-white transition-colors"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Export to Notes
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <p className="whitespace-pre-wrap text-base leading-relaxed text-white/80">{formatText(resources.notes)}</p>
                      </CardContent>
                    </Card>

                    <Card className="border border-white/10 bg-[#221f20] shadow-lg rounded-2xl">
                      <CardHeader className="bg-gradient-to-r from-[#c26e73]/5 to-transparent">
                        <CardTitle className="flex items-center gap-2 text-xl text-white">
                          <Video className="w-6 h-6 text-[#c26e73]" />
                          Video Resources
                        </CardTitle>
                        <CardDescription className="text-white/60">Click to search on YouTube</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3 pt-4">
                        {resources.videoSearchQueries.map((query, idx) => (
                          <a
                            key={idx}
                            href={getYouTubeSearchUrl(query)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center w-full justify-start px-4 py-3 border border-white/20 bg-[#090607] hover:bg-[#c26e73]/10 hover:border-[#c26e73] rounded-lg transition-all hover:scale-[1.02] shadow-sm hover:shadow-md"
                          >
                            <Video className="w-5 h-5 mr-3 flex-shrink-0 text-[#c26e73]" />
                            <span className="text-base font-medium text-white">{query}</span>
                          </a>
                        ))}
                      </CardContent>
                    </Card>

                    <div className="grid md:grid-cols-2 gap-6">
                      <Card className="border border-white/10 bg-[#221f20] shadow-lg rounded-2xl">
                        <CardHeader className="bg-gradient-to-r from-[#ac1ed6]/5 to-transparent">
                          <CardTitle className="flex items-center gap-2 text-white">
                            <Target className="w-5 h-5 text-[#ac1ed6]" />
                            Key Subtopics
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <ul className="space-y-3">
                            {resources.subtopics.map((subtopic, idx) => (
                              <li key={idx} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                                <span className="text-[#ac1ed6] text-xl font-bold">•</span>
                                <span className="text-base text-white/80">{formatText(subtopic)}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="border border-white/10 bg-[#221f20] shadow-lg rounded-2xl">
                        <CardHeader className="bg-gradient-to-r from-[#c26e73]/5 to-transparent">
                          <CardTitle className="flex items-center gap-2 text-white">
                            <Lightbulb className="w-5 h-5 text-[#c26e73]" />
                            Study Tips
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <ul className="space-y-3">
                            {resources.tips.map((tip, idx) => (
                              <li key={idx} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                                <span className="text-[#c26e73] text-xl font-bold">•</span>
                                <span className="text-base text-white/80">{formatText(tip)}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="border border-white/10 bg-[#221f20] shadow-lg rounded-2xl">
                      <CardHeader className="bg-gradient-to-r from-[#ac1ed6]/5 to-transparent">
                        <CardTitle className="flex items-center gap-2 text-xl text-white">
                          <Brain className="w-6 h-6 text-[#ac1ed6]" />
                          Key Points to Remember
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <ul className="space-y-4">
                          {resources.keyPoints.map((point, idx) => (
                            <li key={idx} className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                              <span className="text-white font-bold text-lg bg-[#ac1ed6]/20 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                                {idx + 1}
                              </span>
                              <span className="text-base pt-1 text-white/80">{formatText(point)}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Card className="border border-dashed border-white/20 bg-[#221f20] rounded-2xl">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                      <BookOpen className="w-20 h-20 text-white/30 mb-4" />
                      <p className="text-lg text-white/60 text-center mb-4">
                        No study materials have been loaded yet.
                        <br />Set your preferences and click 'Get Study Materials' to begin
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="flashcards" className="space-y-6 mt-6">
                {flashcards.length === 0 ? (
                  <Card className="border border-dashed border-white/20 bg-[#221f20] rounded-2xl">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                      <Brain className="w-20 h-20 text-white/30 mb-4" />
                      <p className="text-lg text-white/60 text-center mb-4">
                        No flashcards available yet.
                        <br />Set your preferences and click "Generate Flashcards" to get started!
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <Card className="border-2 border-white/10 bg-gradient-to-br from-[#ac1ed6]/10 to-transparent shadow-lg rounded-2xl">
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-white/60 font-medium">Due Today</p>
                                <p className="text-3xl font-bold text-[#ac1ed6]">{upcomingReviews.today}</p>
                              </div>
                              <Target className="w-10 h-10 text-[#ac1ed6] opacity-50" />
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Card className="border-2 border-white/10 bg-gradient-to-br from-[#c26e73]/10 to-transparent shadow-lg rounded-2xl">
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-white/60 font-medium">Total Cards</p>
                                <p className="text-3xl font-bold text-[#c26e73]">{flashcards.length}</p>
                              </div>
                              <Brain className="w-10 h-10 text-[#c26e73] opacity-50" />
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Card className="border-2 border-white/10 bg-gradient-to-br from-[#ac1ed6]/10 to-transparent shadow-lg rounded-2xl">
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-white/60 font-medium">This Week</p>
                                <p className="text-3xl font-bold text-[#ac1ed6]">{upcomingReviews.thisWeek}</p>
                              </div>
                              <Lightbulb className="w-10 h-10 text-[#ac1ed6] opacity-50" />
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>

                    {/* Flashcard Viewer */}
                    <Card className="border-2 border-white/10 bg-[#221f20] shadow-lg rounded-2xl">
                      <CardHeader className="bg-gradient-to-r from-[#ac1ed6]/5 to-[#c26e73]/5">
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2 text-2xl text-white">
                            <Brain className="w-6 h-6 text-[#ac1ed6]" />
                            Study Session
                          </CardTitle>
                          <Button
                            onClick={generateFlashcards}
                            disabled={loading}
                            variant="outline"
                            size="sm"
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                            Generate New
                          </Button>
                        </div>
                        <CardDescription className="text-white/60">
                          Review {dueCards.length > 0 ? dueCards.length : flashcards.length} cards using spaced repetition for better retention
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <FlashcardViewer
                          cards={dueCards.length > 0 ? dueCards : flashcards}
                          onRate={handleFlashcardRate}
                          onDelete={handleDeleteFlashcard}
                        />
                      </CardContent>
                    </Card>
                  </>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              Usage Limit Reached
            </DialogTitle>
            <DialogDescription>
              You can use AI features once every 2 days. Enter the password to continue.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handlePasswordSubmit();
                  }
                }}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowPasswordDialog(false);
                  setPasswordInput('');
                  setPendingAction(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handlePasswordSubmit}>
                Unlock
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <BeautifulFooter />
    </Layout>
  );
};

export default AILearning;
