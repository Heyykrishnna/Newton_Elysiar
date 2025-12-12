import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { BackToDashboard } from '@/components/BackToDashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Code2, TrendingUp, Target, Sparkles, RefreshCw, ExternalLink, Brain, Award, Key, Lock, Trophy, Swords, Users, Save } from 'lucide-react';
import { useCodingProfile, useCodingProgress, useUpsertCodingProfile, useSyncCodingProgress, useGetCodingRecommendations } from '@/hooks/useCodingProfile';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';
import StudentLoader from "@/components/studentportalload";
import { CodingAchievements } from '@/components/CodingAchievements';
import { CodingContests } from '@/components/CodingContests';
import { CodePlayground } from '@/components/CodePlayground';
import { WebDevPractice } from '@/components/WebDevPractice';
import { Layout as LayoutIcon } from 'lucide-react';

export default function CodingPractice() {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [leetcodeUsername, setLeetcodeUsername] = useState('');
  const [codeforcesUsername, setCodeforcesUsername] = useState('');
  const [codeforcesApiKey, setCodeforcesApiKey] = useState('');
  const [codeforcesApiSecret, setCodeforcesApiSecret] = useState('');
  const [skillLevel, setSkillLevel] = useState('beginner');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [recommendations, setRecommendations] = useState('');

  // Password protection states
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const ADMIN_PASSWORD = 'ingypNDmjHOtz1oFHxhHUc2Zh';

  const { data: profile } = useCodingProfile();
  const { data: progress } = useCodingProgress();
  const upsertProfile = useUpsertCodingProfile();
  const syncProgress = useSyncCodingProgress();
  const getRecommendations = useGetCodingRecommendations();

  const topics = ['Arrays', 'Strings', 'Dynamic Programming', 'Trees', 'Graphs', 'Sorting', 'Binary Search', 'Backtracking', 'Greedy', 'Math', 'Geometry', 'Number Theory', 'Combinatorics', 'Probability', 'Data Structures', 'Algorithms', 'Recursion'];

  const handleSaveProfile = async () => {
    await upsertProfile.mutateAsync({
      leetcode_username: leetcodeUsername || profile?.leetcode_username,
      codeforces_username: codeforcesUsername || profile?.codeforces_username,
      codeforces_api_key: codeforcesApiKey || (profile as any)?.codeforces_api_key,
      codeforces_api_secret: codeforcesApiSecret || (profile as any)?.codeforces_api_secret,
      skill_level: skillLevel || profile?.skill_level,
      preferred_topics: selectedTopics.length > 0 ? selectedTopics : profile?.preferred_topics,
    });
    setEditMode(false);
  };

  const handleSync = async (platform: string) => {
    await syncProgress.mutateAsync(platform);
  };

  // Check generation limit (once every 2 days)
  const checkGenerationLimit = (): boolean => {
    const today = new Date();
    const storageKey = 'ai_coding_recommendations';
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
    const storageKey = 'ai_coding_recommendations';
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
      executeGetRecommendations();
    } else {
      toast.error('Incorrect password');
    }
  };

  const handleGetRecommendations = async () => {
    // Check generation limit
    if (!checkGenerationLimit()) {
      setShowPasswordDialog(true);
      return;
    }

    await executeGetRecommendations();
  };

  const executeGetRecommendations = async () => {
    try {
      const result = await getRecommendations.mutateAsync({
        topics: selectedTopics.length > 0 ? selectedTopics : undefined,
        difficulty: selectedDifficulty || undefined,
      });
      setRecommendations(result.recommendations);
      incrementGenerationCount();
    } catch (error) {
      console.error('Error getting recommendations:', error);
    }
  };

  const exportRecommendationsToNotes = () => {
    if (!recommendations) return;

    // Helper to format text strings into HTML/Strings for the note content
    const formatForExport = (text: string) => {
      let formatted = text;
      // Convert bold **text** to <strong>text</strong>
      formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Convert code `text` to <code>text</code>
      formatted = formatted.replace(/`(.*?)`/g, '<code>$1</code>');
      
      // Convert markdown headers to HTML headers
      formatted = formatted.replace(/^### (.*$)/gim, '<h3>$1</h3>');
      formatted = formatted.replace(/^## (.*$)/gim, '<h2>$1</h2>');
      formatted = formatted.replace(/^# (.*$)/gim, '<h1>$1</h1>');
      
      // Convert markdown list items
      formatted = formatted.replace(/^\s*-\s(.*$)/gim, '<li>$1</li>');
      
      return formatted;
    };

    const noteContent = `
      <h1>AI Coding Recommendations</h1>
      <p><strong>Generated on:</strong> ${new Date().toLocaleDateString()}</p>
      ${selectedTopics.length > 0 ? `<p><strong>Focus Topics:</strong> ${selectedTopics.join(', ')}</p>` : ''}
      ${selectedDifficulty ? `<p><strong>Difficulty:</strong> ${selectedDifficulty}</p>` : ''}
      
      <hr />
      
      ${formatForExport(recommendations)}
    `.trim();

    const newNote = {
      id: `note_${Date.now()}`,
      title: `Coding Recommendations: ${new Date().toLocaleDateString()}`,
      content: noteContent,
      tags: ['Coding', 'AI Recommendations', ...selectedTopics],
      color: 'bg-[#1a1625]', // Matching the card background color
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
      
      toast.success('Recommendations saved to notes successfully');
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Could not save to notes');
    }
  };

  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const leetcodeProgress = progress?.find(p => p.platform === 'leetcode');
  const codeforcesProgress = progress?.find(p => p.platform === 'codeforces');

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
      <div className="min-h-screen bg-[#090607]">
        <div className="container mx-auto px-4 py-8 space-y-8">
          <div className="mb-4">
            <BackToDashboard />
          </div>

          <div className="text-center space-y-2 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#ac1ed6]/10 via-[#c26e73]/10 to-[#ac1ed6]/10 rounded-3xl blur-3xl -z-10" />
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#ac1ed6] via-[#c26e73] to-[#ac1ed6] bg-clip-text text-transparent pb-2">
              CelesteCode Practice Hub
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Track your progress across platforms and get AI-powered recommendations
            </p>
             <p className="text-sm text-[#c26e73] italic underline mx-auto">
                # Do not refresh the page or use the back button, as it may delete your AI-generated data or flashcards.
              </p>
              
              {/* AI Notes Button */}
              <div className="flex justify-center mt-3 pt-4">
                <a 
                  href="/ai-learning"
                  className="group flex w-[140px] h-fit bg-[#1d2129] rounded-[40px] justify-between items-center border-none cursor-pointer transition-all duration-300"
                >
                  <span className="flex items-center justify-center text-white text-sm tracking-wide w-[calc(140px-38px)] h-full px-2">
                    AI Notes
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
          </div>

          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-7 h-14 p-1 bg-[#221f20] border border-white/10 rounded-xl">
              <TabsTrigger value="dashboard" className="text-white/60 font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ac1ed6] data-[state=active]:to-[#c26e73] data-[state=active]:text-white rounded-lg text-xs md:text-sm">
                <Target className="w-4 h-4 mr-1 md:mr-2" />
                <span className="hidden md:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="playground" className="text-white/60 font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ac1ed6] data-[state=active]:to-[#c26e73] data-[state=active]:text-white rounded-lg text-xs md:text-sm">
                <Code2 className="w-4 h-4 mr-1 md:mr-2" />
                <span className="hidden md:inline">Playground</span>
              </TabsTrigger>
              <TabsTrigger value="webdev" className="text-white/60 font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ac1ed6] data-[state=active]:to-[#c26e73] data-[state=active]:text-white rounded-lg text-xs md:text-sm">
                <LayoutIcon className="w-4 h-4 mr-1 md:mr-2" />
                <span className="hidden md:inline">Web Dev</span>
              </TabsTrigger>
              <TabsTrigger value="setup" className="text-white/60 font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ac1ed6] data-[state=active]:to-[#c26e73] data-[state=active]:text-white rounded-lg text-xs md:text-sm">
                <Key className="w-4 h-4 mr-1 md:mr-2" />
                <span className="hidden md:inline">Setup</span>
              </TabsTrigger>
              <TabsTrigger value="achievements" className="text-white/60 font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ac1ed6] data-[state=active]:to-[#c26e73] data-[state=active]:text-white rounded-lg text-xs md:text-sm">
                <Trophy className="w-4 h-4 mr-1 md:mr-2" />
                <span className="hidden md:inline">Badges</span>
              </TabsTrigger>
              <TabsTrigger value="contests" className="text-white/60 font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ac1ed6] data-[state=active]:to-[#c26e73] data-[state=active]:text-white rounded-lg text-xs md:text-sm">
                <Swords className="w-4 h-4 mr-1 md:mr-2" />
                <span className="hidden md:inline">Contests</span>
              </TabsTrigger>
              <TabsTrigger value="recommendations" className="text-white/60 font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ac1ed6] data-[state=active]:to-[#c26e73] data-[state=active]:text-white rounded-lg text-xs md:text-sm">
                <Sparkles className="w-4 h-4 mr-1 md:mr-2" />
                <span className="hidden md:inline">AI</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* LeetCode Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="border-2 border-white/10 bg-[#221f20] shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl hover:border-orange-500/50">
                    <CardHeader className="bg-gradient-to-r from-orange-500/5 to-transparent">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                            <img src='https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png' alt='Leetcode Logo' className="w-8 h-8" />
                          </div>
                          <div>
                            <CardTitle className="text-white text-xl">LeetCode</CardTitle>
                            <CardDescription className="text-white/60">
                              {profile?.leetcode_username ? `@${profile.leetcode_username}` : 'Not connected'}
                            </CardDescription>
                          </div>
                        </div>
                        {profile?.leetcode_username && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSync('leetcode')}
                            disabled={syncProgress.isPending}
                            className="border-white/20 text-orange-900 hover:text-white hover:bg-orange-500/20 hover:border-orange-500"
                          >
                            <RefreshCw className={`w-4 h-4 mr-2 ${syncProgress.isPending ? 'animate-spin' : ''}`} />
                            Sync
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      {leetcodeProgress ? (
                        <div className="space-y-4">
                          <div className="text-center p-4 bg-gradient-to-br from-orange-500/10 to-orange-600/5 rounded-xl border border-orange-500/20">
                            <div className="text-4xl font-bold text-orange-500">{leetcodeProgress.problems_solved}</div>
                            <div className="text-sm text-white/60 mt-1">Problems Solved</div>
                          </div>
                          <div className="grid grid-cols-3 gap-3 text-center">
                            <div className="p-3 bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-xl border border-green-500/20">
                              <div className="text-2xl font-bold text-green-500">{leetcodeProgress.easy_solved}</div>
                              <div className="text-xs text-white/60 mt-1">Easy</div>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 rounded-xl border border-yellow-500/20">
                              <div className="text-2xl font-bold text-yellow-500">{leetcodeProgress.medium_solved}</div>
                              <div className="text-xs text-white/60 mt-1">Medium</div>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-red-500/10 to-red-600/5 rounded-xl border border-red-500/20">
                              <div className="text-2xl font-bold text-red-500">{leetcodeProgress.hard_solved}</div>
                              <div className="text-xs text-white/60 mt-1">Hard</div>
                            </div>
                          </div>
                          <Button asChild className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg" variant="default">
                            <a href="https://leetcode.com" target="_blank" rel="noopener noreferrer">
                              Open LeetCode <ExternalLink className="w-4 h-4 ml-2" />
                            </a>
                          </Button>
                        </div>
                      ) : (
                        <p className="text-center text-white/60 py-8">No data synced yet</p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Codeforces Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="border-2 border-white/10 bg-[#221f20] shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl hover:border-[#ac1ed6]/50">
                    <CardHeader className="bg-gradient-to-r from-[#ac1ed6]/5 to-transparent">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#ac1ed6] to-[#c26e73] rounded-xl flex items-center justify-center shadow-lg">
                            <img src='https://cdn.iconscout.com/icon/free/png-256/free-code-forces-logo-icon-svg-download-png-2944796.png' alt='Codeforces Logo' className="w-8 h-8" />
                          </div>
                          <div>
                            <CardTitle className="text-white text-xl">Codeforces</CardTitle>
                            <CardDescription className="text-white/60">
                              {profile?.codeforces_username ? `@${profile.codeforces_username}` : 'Not connected'}
                            </CardDescription>
                          </div>
                        </div>
                        {profile?.codeforces_username && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSync('codeforces')}
                            disabled={syncProgress.isPending}
                            className="border-white/20 text-purple-900 hover:text-white hover:bg-[#ac1ed6]/20 hover:border-[#ac1ed6]"
                          >
                            <RefreshCw className={`w-4 h-4 mr-2 ${syncProgress.isPending ? 'animate-spin' : ''}`} />
                            Sync
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      {codeforcesProgress ? (
                        <div className="space-y-4">
                          {/* Problems Solved */}
                          <div className="text-center p-4 bg-gradient-to-br from-[#ac1ed6]/10 to-[#c26e73]/5 rounded-xl border border-[#ac1ed6]/20">
                            <div className="text-4xl font-bold text-[#ac1ed6]">{codeforcesProgress.problems_solved || 0}</div>
                            <div className="text-sm text-white/60 mt-1">Questions Solved</div>
                          </div>
                          
                          {/* Ratings Grid */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-4 bg-gradient-to-br from-[#ac1ed6]/10 to-[#ac1ed6]/5 rounded-xl border border-[#ac1ed6]/20">
                              <div className="text-3xl font-bold text-[#ac1ed6]">
                                {codeforcesProgress.contest_rating !== null && codeforcesProgress.contest_rating !== undefined 
                                  ? codeforcesProgress.contest_rating 
                                  : 'Unrated'}
                              </div>
                              <div className="text-sm text-white/60 mt-1">Current Rating</div>
                            </div>
                            <div className="text-center p-4 bg-gradient-to-br from-[#c26e73]/10 to-[#c26e73]/5 rounded-xl border border-[#c26e73]/20">
                              <div className="text-3xl font-bold text-[#c26e73]">
                                {codeforcesProgress.max_rating !== null && codeforcesProgress.max_rating !== undefined 
                                  ? codeforcesProgress.max_rating 
                                  : 'Unrated'}
                              </div>
                              <div className="text-sm text-white/60 mt-1">Max Rating</div>
                            </div>
                          </div>
                          
                          {codeforcesProgress.ranking && (
                            <div className="p-3 bg-gradient-to-r from-[#ac1ed6]/10 to-[#c26e73]/10 rounded-xl border border-white/10 text-center">
                              <Badge className="bg-gradient-to-r from-[#ac1ed6] to-[#c26e73] text-white border-0">{codeforcesProgress.ranking}</Badge>
                            </div>
                          )}
                          <Button asChild className="w-full bg-gradient-to-r from-[#ac1ed6] to-[#c26e73] hover:from-[#c26e73] hover:to-[#ac1ed6] text-white shadow-lg" variant="default">
                            <a href="https://codeforces.com" target="_blank" rel="noopener noreferrer">
                              Open Codeforces <ExternalLink className="w-4 h-4 ml-2" />
                            </a>
                          </Button>
                        </div>
                      ) : (
                        <p className="text-center text-white/60 py-8">No data synced yet</p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {profile?.preferred_topics && profile.preferred_topics.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="border-2 border-white/10 bg-[#221f20] shadow-lg rounded-2xl">
                    <CardHeader className="bg-gradient-to-r from-[#ac1ed6]/5 to-[#c26e73]/5">
                      <CardTitle className="flex items-center gap-2 text-white text-xl">
                        <Target className="w-5 h-5 text-[#ac1ed6]" />
                        Your Focus Topics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="flex flex-wrap gap-2">
                        {profile.preferred_topics.map((topic) => (
                          <Badge key={topic} className="bg-gradient-to-r from-[#ac1ed6]/20 to-[#c26e73]/20 text-white border border-white/20 hover:from-[#ac1ed6]/30 hover:to-[#c26e73]/30">{topic}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="playground" className="space-y-6 mt-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <CodePlayground />
              </motion.div>
            </TabsContent>

            <TabsContent value="setup" className="space-y-6 mt-6">
              <Card className="border-2 border-white/10 bg-[#221f20] shadow-lg rounded-2xl">
                <CardHeader className="bg-gradient-to-r from-[#ac1ed6]/5 to-[#c26e73]/5">
                  <CardTitle className="flex items-center gap-2 text-white text-2xl">
                    <Key className="w-6 h-6 text-[#ac1ed6]" />
                    Connect Your Accounts
                  </CardTitle>
                  <CardDescription className="text-white/60 text-base">
                    Link your coding platform usernames and API credentials to track your progress
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="leetcode" className="text-base font-semibold text-white">LeetCode Username</Label>
                    <Input
                      id="leetcode"
                      placeholder="Enter your LeetCode username"
                      value={leetcodeUsername || profile?.leetcode_username || ''}
                      onChange={(e) => setLeetcodeUsername(e.target.value)}
                      className="h-11 border border-white/20 bg-[#090607] text-white placeholder:text-white/40 focus:border-orange-500 transition-colors rounded-xl"
                    />
                  </div>

                  <div className="space-y-4 p-4 border border-white/10 rounded-xl bg-[#090607]/50">
                    <div className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-[#ac1ed6]" />
                      <h3 className="text-lg font-semibold text-white">Codeforces Configuration</h3>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="codeforces" className="text-base font-semibold text-white">Codeforces Username</Label>
                      <Input
                        id="codeforces"
                        placeholder="Enter your Codeforces username"
                        value={codeforcesUsername || profile?.codeforces_username || ''}
                        onChange={(e) => setCodeforcesUsername(e.target.value)}
                        className="h-11 border border-white/20 bg-[#090607] text-white placeholder:text-white/40 focus:border-[#ac1ed6] transition-colors rounded-xl"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cf-api-key" className="text-sm font-semibold text-white">API Key (Optional)</Label>
                        <Input
                          id="cf-api-key"
                          type="password"
                          placeholder="Codeforces API Key"
                          value={codeforcesApiKey || (profile as any)?.codeforces_api_key || ''}
                          onChange={(e) => setCodeforcesApiKey(e.target.value)}
                          className="h-11 border border-white/20 bg-[#090607] text-white placeholder:text-white/40 focus:border-[#ac1ed6] transition-colors rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cf-api-secret" className="text-sm font-semibold text-white">API Secret (Optional)</Label>
                        <Input
                          id="cf-api-secret"
                          type="password"
                          placeholder="Codeforces API Secret"
                          value={codeforcesApiSecret || (profile as any)?.codeforces_api_secret || ''}
                          onChange={(e) => setCodeforcesApiSecret(e.target.value)}
                          className="h-11 border border-white/20 bg-[#090607] text-white placeholder:text-white/40 focus:border-[#ac1ed6] transition-colors rounded-xl"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-white/40">Get your API keys from codeforces.com/settings/api</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skill" className="text-base font-semibold text-white">Skill Level</Label>
                    <Select value={skillLevel || profile?.skill_level} onValueChange={setSkillLevel}>
                      <SelectTrigger className="h-11 border border-white/20 bg-[#090607] text-white rounded-xl">
                        <SelectValue placeholder="Select your skill level" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#221f20] border-white/20 text-white">
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="topics" className="text-base font-semibold text-white">Preferred Topics</Label>
                    <div className="flex flex-wrap gap-2">
                      {topics.map((topic) => (
                        <Badge
                          key={topic}
                          className={`cursor-pointer transition-all ${selectedTopics.includes(topic) || profile?.preferred_topics?.includes(topic)
                            ? 'bg-gradient-to-r from-[#ac1ed6] to-[#c26e73] text-white border-0 hover:shadow-lg'
                            : 'bg-white/5 text-white/80 border border-white/20 hover:bg-white/10'
                            }`}
                          onClick={() => {
                            setSelectedTopics(prev =>
                              prev.includes(topic)
                                ? prev.filter(t => t !== topic)
                                : [...prev, topic]
                            );
                          }}
                        >
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleSaveProfile}
                    disabled={upsertProfile.isPending}
                    className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-[#ac1ed6] to-[#c26e73] hover:from-[#c26e73] hover:to-[#ac1ed6] text-white rounded-xl"
                  >
                    {upsertProfile.isPending ? (
                      <>
                        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Award className="w-5 h-5 mr-2" />
                        Save Profile
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-6 mt-6">
              <Card className="border-2 border-white/10 bg-[#221f20] shadow-lg rounded-2xl">
                <CardHeader className="bg-gradient-to-r from-[#ac1ed6]/5 to-[#c26e73]/5">
                  <CardTitle className="flex items-center gap-2 text-white text-2xl">
                    AI-Powered Recommendations
                  </CardTitle>
                  <CardDescription className="text-white/60 text-base">
                    Get personalized learning paths based on your progress
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="rec-topics" className="text-base font-semibold text-white">Topics (Optional)</Label>
                      <div className="flex flex-wrap gap-2">
                        {topics.map((topic) => (
                          <Badge
                            key={topic}
                            className={`cursor-pointer transition-all ${selectedTopics.includes(topic)
                              ? 'bg-gradient-to-r from-[#ac1ed6] to-[#c26e73] text-white border-0 hover:shadow-lg'
                              : 'bg-white/5 text-white/80 border border-white/20 hover:bg-white/10'
                              }`}
                            onClick={() => {
                              setSelectedTopics(prev =>
                                prev.includes(topic)
                                  ? prev.filter(t => t !== topic)
                                  : [...prev, topic]
                              );
                            }}
                          >
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rec-difficulty" className="text-base font-semibold text-white">Difficulty (Optional)</Label>
                      <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                        <SelectTrigger className="h-11 border border-white/20 bg-[#090607] text-white rounded-xl">
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#221f20] border-white/20 text-white">
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    onClick={handleGetRecommendations}
                    disabled={getRecommendations.isPending}
                    className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-[#ac1ed6] to-[#c26e73] hover:from-[#c26e73] hover:to-[#ac1ed6] text-white rounded-xl"
                  >
                    {getRecommendations.isPending ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Getting recommendations...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Get AI Recommendations
                      </>
                    )}
                  </Button>

                  {recommendations && (
                    <Button
                      onClick={exportRecommendationsToNotes}
                      variant="outline"
                      className="w-full h-12 text-base font-semibold border-[#ac1ed6]/30 bg-[#ac1ed6]/10 text-white hover:bg-[#ac1ed6]/20 hover:text-white transition-all duration-300"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save to Notes
                    </Button>
                  )}

                  {recommendations && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Card className="border-2 border-[#ac1ed6]/30 bg-[#1a1625] shadow-xl rounded-2xl">
                        <CardContent className="pt-6">
                          <div className="prose prose-invert max-w-none">
                            <ReactMarkdown
                              components={{
                                // Enhanced link styling with gradient colors - CLICKABLE
                                a: ({ node, ...props }) => (
                                  <a
                                    {...props}
                                    href={props.href}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 my-1 bg-gradient-to-r from-[#ac1ed6] to-[#c26e73] text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 no-underline cursor-pointer"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {props.children}
                                  </a>
                                ),
                                // Better spacing for list items with visible text
                                li: ({ node, ...props }) => (
                                  <li {...props} className="mb-4 leading-relaxed text-gray-200" />
                                ),
                                // Enhanced paragraph spacing with visible text
                                p: ({ node, ...props }) => (
                                  <p {...props} className="mb-4 leading-relaxed text-gray-200" />
                                ),
                                // Better heading styles
                                h3: ({ node, ...props }) => (
                                  <h3 {...props} className="text-2xl font-bold mt-6 mb-4 bg-gradient-to-r from-[#ac1ed6] to-[#c26e73] bg-clip-text text-transparent" />
                                ),
                                h4: ({ node, ...props }) => (
                                  <h4 {...props} className="text-xl font-semibold text-gray-100 mt-5 mb-3" />
                                ),
                                // Enhanced code blocks
                                code: ({ node, className, children, ...props }) => {
                                  const isInline = !className;
                                  return isInline ?
                                    <code {...props} className="px-2 py-1 bg-[#ac1ed6]/20 rounded text-[#c26e73] font-mono text-sm">{children}</code> :
                                    <code {...props} className="block p-4 bg-[#090607] rounded-xl border border-white/10 text-gray-200 font-mono text-sm overflow-x-auto">{children}</code>;
                                },
                                // Enhanced unordered lists
                                ul: ({ node, ...props }) => (
                                  <ul {...props} className="space-y-3 my-4 text-gray-200" />
                                ),
                                // Enhanced ordered lists
                                ol: ({ node, ...props }) => (
                                  <ol {...props} className="space-y-3 my-4 text-gray-200" />
                                ),
                                // Strong text with gradient
                                strong: ({ node, ...props }) => (
                                  <strong {...props} className="font-bold text-[#ac1ed6]" />
                                ),
                              }}
                            >
                              {recommendations}
                            </ReactMarkdown>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6 mt-6">
              <CodingAchievements />
            </TabsContent>

            <TabsContent value="webdev" className="space-y-6 mt-6">
              <WebDevPractice />
            </TabsContent>

            <TabsContent value="contests" className="space-y-6 mt-6">
              <CodingContests />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-md bg-[#221f20] border-white/10">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <Lock className="w-5 h-5 text-[#ac1ed6]" />
              Usage Limit Reached
            </DialogTitle>
            <DialogDescription className="text-white/60">
              You've used your free AI recommendation (limit: once every 2 days). Enter the admin password to continue.
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
                  if (e.key === 'Enter') {
                    handlePasswordSubmit();
                  }
                }}
                className="h-11 border border-white/20 bg-[#090607] text-white placeholder:text-white/40 focus:border-[#ac1ed6] transition-colors rounded-xl"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowPasswordDialog(false);
                  setPasswordInput('');
                }}
                className="border-white/20 text-black hover:text-white hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePasswordSubmit}
                className="bg-gradient-to-r from-[#ac1ed6] to-[#c26e73] hover:from-[#c26e73] hover:to-[#ac1ed6] text-white"
              >
                Unlock
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}