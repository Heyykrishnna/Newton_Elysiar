import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trophy, Flame, Medal, Crown, Target, TrendingUp, Users, RefreshCw } from 'lucide-react';
import { useAllStudentsProgress, useWebDevStreak } from '@/hooks/useWebDevProgress';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

interface LeaderboardEntry {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  current_streak: number;
  longest_streak: number;
  total_problems_solved: number;
  easy_solved: number;
  medium_solved: number;
  hard_solved: number;
}

export function WebDevLeaderboard() {
  const { data: studentsData, isLoading, refetch, isFetching } = useAllStudentsProgress();
  const { data: myStreak } = useWebDevStreak();
  const [activeTab, setActiveTab] = useState<'total' | 'streak' | 'hard'>('total');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Real-time sync with Supabase
  useEffect(() => {
    const channel = supabase
      .channel('leaderboard-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'web_dev_streaks' },
        () => {
          refetch();
          setLastUpdated(new Date());
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  if (isLoading) {
    return (
      <Card className="border-2 border-white/10 bg-[#221f20] rounded-2xl">
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-[#ac1ed6] border-t-transparent rounded-full mx-auto" />
          <p className="text-white/60 mt-4">Loading leaderboard...</p>
        </CardContent>
      </Card>
    );
  }

  const getSortedData = () => {
    if (!studentsData) return [];
    
    switch (activeTab) {
      case 'streak':
        return [...studentsData].sort((a, b) => b.current_streak - a.current_streak);
      case 'hard':
        return [...studentsData].sort((a, b) => b.hard_solved - a.hard_solved);
      case 'total':
      default:
        return [...studentsData].sort((a, b) => b.total_problems_solved - a.total_problems_solved);
    }
  };

  const sortedData = getSortedData().slice(0, 10);

  const getPositionIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="w-5 h-5 text-yellow-400" />;
      case 1:
        return <Medal className="w-5 h-5 text-gray-300" />;
      case 2:
        return <Medal className="w-5 h-5 text-orange-400" />;
      default:
        return <span className="text-white/40 font-medium">#{index + 1}</span>;
    }
  };

  const getPositionColor = (index: number) => {
    switch (index) {
      case 0:
        return 'from-yellow-500/20 to-transparent border-yellow-500/30';
      case 1:
        return 'from-gray-400/20 to-transparent border-gray-400/30';
      case 2:
        return 'from-orange-500/20 to-transparent border-orange-500/30';
      default:
        return 'from-transparent to-transparent border-white/10';
    }
  };

  const myRank = studentsData?.findIndex(s => s.id === myStreak?.id) ?? -1;

  return (
    <Card className="border-2 border-white/10 bg-[#221f20] rounded-2xl overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <CardTitle className="text-white text-xl flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              Leaderboard
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="text-white/40 hover:text-white hover:bg-white/10 h-7 px-2"
            >
              <RefreshCw className={`w-3 h-3 ${isFetching ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'total' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('total')}
              className={activeTab === 'total' 
                ? 'bg-purple-700 hover:bg-purple-600' 
                : 'bg-transparent border-white/20 text-white/60 hover:bg-white/10 hover:text-white'}
            >
              <Target className="w-4 h-4 mr-1" />
              Total
            </Button>
            <Button
              variant={activeTab === 'streak' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('streak')}
              className={activeTab === 'streak' 
                ? 'bg-orange-500 hover:bg-orange-600' 
                : 'bg-transparent border-white/20 text-white/60 hover:bg-white/10 hover:text-white'}
            >
              <Flame className="w-4 h-4 mr-1" />
              Streak
            </Button>
            <Button
              variant={activeTab === 'hard' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('hard')}
              className={activeTab === 'hard' 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-transparent border-white/20 text-white/60 hover:bg-white/10 hover:text-white'}
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              Hard
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-2">
            {sortedData.map((entry, index) => (
              <motion.div
                key={entry.id || entry.user_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center gap-4 p-3 rounded-xl border bg-gradient-to-r ${getPositionColor(index)}`}
              >
                <div className="w-10 flex items-center justify-center">
                  {getPositionIcon(index)}
                </div>
                
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ac1ed6] to-[#c26e73] flex items-center justify-center text-white font-bold shrink-0">
                  {(entry.full_name || 'U')[0].toUpperCase()}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">
                    {entry.full_name || entry.email?.split('@')[0] || 'Anonymous'}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge className="bg-green-500/20 text-green-400 text-xs">
                      {entry.easy_solved} Easy
                    </Badge>
                    <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">
                      {entry.medium_solved} Med
                    </Badge>
                    <Badge className="bg-red-500/20 text-red-400 text-xs">
                      {entry.hard_solved} Hard
                    </Badge>
                  </div>
                </div>
                
                <div className="text-right shrink-0">
                  {activeTab === 'total' && (
                    <p className="text-xl font-bold text-white">{entry.total_problems_solved}</p>
                  )}
                  {activeTab === 'streak' && (
                    <div className="flex items-center gap-1">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <p className="text-xl font-bold text-white">{entry.current_streak}</p>
                    </div>
                  )}
                  {activeTab === 'hard' && (
                    <p className="text-xl font-bold text-red-400">{entry.hard_solved}</p>
                  )}
                </div>
              </motion.div>
            ))}

            {sortedData.length === 0 && (
              <div className="text-center py-12 text-white/40">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No participants yet</p>
                <p className="text-sm mt-1">Be the first to solve problems!</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {myStreak && myRank >= 0 && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between p-3 bg-[#ac1ed6]/10 rounded-xl border border-[#ac1ed6]/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#ac1ed6] flex items-center justify-center text-white font-bold text-sm">
                  You
                </div>
                <div>
                  <p className="text-white font-medium">Your Position</p>
                  <p className="text-white/60 text-sm">
                    {myStreak.total_problems_solved} problems solved
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[#ac1ed6]">#{myRank + 1}</p>
                <div className="flex items-center gap-1 text-orange-400 text-sm">
                  <Flame className="w-3 h-3" />
                  {myStreak.current_streak} day streak
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
