import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ExternalLink, CheckCircle2, Circle, Star, Code2, Palette, FileJson, Globe, Search, Play, Flame, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { ALL_WEB_DEV_QUESTIONS, WebDevQuestion } from '@/data/webDevQuestions';
import { useWebDevProgress, useWebDevStreak, useDailyActivity } from '@/hooks/useWebDevProgress';
import { WebDevContestPlayground } from './WebDevContestPlayground';
import { ContributionGraph } from './ContributionGraph';
// import { WebDevLeaderboard } from './WebDevLeaderboard';

export function WebDevQuestions() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'HTML' | 'CSS' | 'JavaScript' | 'React' | 'End Game'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'Easy' | 'Medium' | 'Hard'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState<WebDevQuestion | null>(null);
  const [showPlayground, setShowPlayground] = useState(false);

  const { data: progress } = useWebDevProgress();
  const { data: streak } = useWebDevStreak();
  const { data: dailyActivity } = useDailyActivity();

  const completedIds = new Set(progress?.map(p => p.question_id) || []);

  const filteredQuestions = ALL_WEB_DEV_QUESTIONS.filter(q => {
    const matchesCategory = selectedCategory === 'all' || q.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
    const matchesSearch = q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          q.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'HTML': return <Globe className="w-4 h-4 text-orange-500" />;
      case 'CSS': return <Palette className="w-4 h-4 text-blue-500" />;
      case 'JavaScript': return <FileJson className="w-4 h-4 text-yellow-500" />;
      case 'React': return <Code2 className="w-4 h-4 text-cyan-500" />;
      default: return <Code2 className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Hard': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const stats = {
    total: ALL_WEB_DEV_QUESTIONS.length,
    completed: completedIds.size,
    easy: ALL_WEB_DEV_QUESTIONS.filter(q => q.difficulty === 'Easy').length,
    medium: ALL_WEB_DEV_QUESTIONS.filter(q => q.difficulty === 'Medium').length,
    hard: ALL_WEB_DEV_QUESTIONS.filter(q => q.difficulty === 'Hard').length,
  };

  const handleStartQuestion = (question: WebDevQuestion) => {
    setSelectedQuestion(question);
    setShowPlayground(true);
  };

  return (
    <div className="space-y-6">
      {/* Streak & Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2 border-white/10 bg-gradient-to-br from-orange-700 to-orange-400 rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-900" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{streak?.current_streak || 0}</p>
                <p className="text-xs text-white/60">Day Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-white/10 bg-gradient-to-br from-green-700 to-green-400 rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-900" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{stats.completed}/{stats.total}</p>
                <p className="text-xs text-white/60">Problems Solved</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-white/10 bg-[#221f20] rounded-2xl">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-xl font-bold text-green-400">{streak?.easy_solved || 0}</p>
                <p className="text-xs text-white/60">Easy</p>
              </div>
              <div>
                <p className="text-xl font-bold text-yellow-400">{streak?.medium_solved || 0}</p>
                <p className="text-xs text-white/60">Medium</p>
              </div>
              <div>
                <p className="text-xl font-bold text-red-400">{streak?.hard_solved || 0}</p>
                <p className="text-xs text-white/60">Hard</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-white/10 bg-gradient-to-br from-purple-700 to-purple-400 rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-purple-900" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{streak?.longest_streak || 0}</p>
                <p className="text-xs text-white/60">Best Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contribution Graph */}
      <ContributionGraph activities={dailyActivity || []} />
      
      {/* Leaderboard
      <WebDevLeaderboard /> */}

      {/* Questions Section */}
      <Card className="border-2 border-white/10 bg-[#221f20] rounded-2xl">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-white text-xl flex items-center gap-2">
                <Code2 className="w-5 h-5 text-[#ac1ed6]" />
                Practice Questions ({stats.total})
              </CardTitle>
              <CardDescription className="text-white/60">
                Click on a question to start the coding challenge
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-[250px] bg-[#1a1a1a] border-white/10 text-white"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <Tabs value={selectedCategory} onValueChange={(v: any) => setSelectedCategory(v)}>
              <TabsList className="bg-[#1a1a1a] border border-white/10">
                <TabsTrigger value="all" className="text-white/60 data-[state=active]:bg-[#ac1ed6] data-[state=active]:text-white">All</TabsTrigger>
                <TabsTrigger value="HTML" className="text-white/60 data-[state=active]:bg-orange-500 data-[state=active]:text-white">HTML</TabsTrigger>
                <TabsTrigger value="CSS" className="text-white/60 data-[state=active]:bg-blue-500 data-[state=active]:text-white">CSS</TabsTrigger>
                <TabsTrigger value="JavaScript" className="text-white/60 data-[state=active]:bg-yellow-500 data-[state=active]:text-black">JS</TabsTrigger>
                <TabsTrigger value="React" className="text-white/60 data-[state=active]:bg-cyan-500 data-[state=active]:text-white">React</TabsTrigger>
                <TabsTrigger value="End Game" className="text-white/60 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">🔥 End Game</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Tabs value={selectedDifficulty} onValueChange={(v: any) => setSelectedDifficulty(v)}>
              <TabsList className="bg-[#1a1a1a] border border-white/10">
                <TabsTrigger value="all" className="text-white/60 data-[state=active]:bg-white/20 data-[state=active]:text-white">All</TabsTrigger>
                <TabsTrigger value="Easy" className="text-white/60 data-[state=active]:bg-green-500 data-[state=active]:text-white">Easy</TabsTrigger>
                <TabsTrigger value="Medium" className="text-white/60 data-[state=active]:bg-yellow-500 data-[state=active]:text-black">Medium</TabsTrigger>
                <TabsTrigger value="Hard" className="text-white/60 data-[state=active]:bg-red-500 data-[state=active]:text-white">Hard</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Questions List */}
          <ScrollArea className="h-[500px]">
            <div className="space-y-3">
              {filteredQuestions.map((question, index) => {
                const isCompleted = completedIds.has(question.id);
                return (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                  >
                    <div 
                      className={`p-4 rounded-xl border transition-all cursor-pointer hover:border-[#ac1ed6]/50 ${
                        isCompleted 
                          ? 'bg-green-500/5 border-green-500/30' 
                          : 'bg-[#1a1a1a] border-white/10 hover:bg-[#252525]'
                      }`}
                      onClick={() => handleStartQuestion(question)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="mt-1">
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            ) : (
                              <Circle className="w-5 h-5 text-white/30" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {getCategoryIcon(question.category)}
                              <h3 className={`font-medium ${isCompleted ? 'text-green-400' : 'text-white'}`}>
                                {question.title}
                              </h3>
                              {question.recommended && (
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              )}
                            </div>
                            <p className="text-sm text-white/50 mb-2">{question.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {question.tags.slice(0, 3).map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs text-white/40 border-white/10">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getDifficultyColor(question.difficulty)}>
                            {question.difficulty}
                          </Badge>
                          <Button
                            size="sm"
                            className="bg-[#ac1ed6] hover:bg-[#ac1ed6]/80 text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartQuestion(question);
                            }}
                          >
                            <Play className="w-4 h-4 mr-1" />
                            Start
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Contest Playground Dialog */}
      {selectedQuestion && (
        <WebDevContestPlayground
          question={selectedQuestion}
          isOpen={showPlayground}
          onClose={() => {
            setShowPlayground(false);
            setSelectedQuestion(null);
          }}
          onComplete={() => {
            // Refresh will happen automatically via query invalidation
          }}
        />
      )}
    </div>
  );
}
