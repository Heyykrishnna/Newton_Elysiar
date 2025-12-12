import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Trophy, Crown, Medal, Clock, Users, Eye, Flame, Target, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface ContestParticipant {
  id: string;
  user_id: string;
  contest_id: string;
  score: number;
  problems_solved: number;
  joined_at: string;
  completed_at: string | null;
  full_name?: string;
  email?: string;
}

interface ContestLeaderboardProps {
  contestId?: string;
  contestTitle?: string;
  onUserClick?: (userId: string) => void;
}

export function ContestLeaderboard({ contestId, contestTitle, onUserClick }: ContestLeaderboardProps) {
  const [showAllParticipants, setShowAllParticipants] = useState(false);

  // Fetch all contest participants with profiles
  const { data: participants, isLoading } = useQuery({
    queryKey: ['contest-leaderboard', contestId],
    queryFn: async () => {
      let query = supabase
        .from('coding_contest_participants')
        .select('*')
        .order('score', { ascending: false });
      
      if (contestId) {
        query = query.eq('contest_id', contestId);
      }

      const { data: participantsData, error: participantsError } = await query;
      if (participantsError) throw participantsError;

      let finalParticipants = participantsData || [];

      // If viewing global leaderboard (no contestId), aggregate scores by user
      if (!contestId) {
        const userMap = new Map<string, typeof finalParticipants[0]>();
        
        finalParticipants.forEach(p => {
          if (userMap.has(p.user_id)) {
            const existing = userMap.get(p.user_id)!;
            existing.score += p.score;
            existing.problems_solved += p.problems_solved;
            // specific contest fields like joined_at/completed_at become less relevant for aggregate, 
            // but we keep the first one or ignored.
          } else {
            // Clone to avoid mutating original if needed, though here we just want a fresh object accumulator
            userMap.set(p.user_id, { ...p });
          }
        });

        finalParticipants = Array.from(userMap.values());
        
        // Re-sort based on aggregated scores
        finalParticipants.sort((a, b) => b.score - a.score);
      }

      // Get user profiles
      const userIds = [...new Set(finalParticipants.map(p => p.user_id))];
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', userIds);

      if (profilesError) console.error('Error fetching profiles:', profilesError);

      // Combine data
      return finalParticipants.map(p => {
        const profile = profiles?.find(pr => pr.id === p.user_id);
        return {
          ...p,
          full_name: profile?.full_name || profile?.email?.split('@')[0] || 'Anonymous',
          email: profile?.email || '',
        };
      }) as ContestParticipant[];
    },
  });

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

  const topParticipants = (participants || []).slice(0, 10);

  const getPositionIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="w-5 h-5 text-yellow-400" />;
      case 1:
        return <Medal className="w-5 h-5 text-gray-300" />;
      case 2:
        return <Medal className="w-5 h-5 text-orange-400" />;
      default:
        return <span className="text-white/40 font-medium w-5 text-center">#{index + 1}</span>;
    }
  };

  const getPositionBg = (index: number) => {
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

  // Calculate stats
  const totalParticipants = participants?.length || 0;
  const avgScore = participants?.length 
    ? Math.round((participants.reduce((sum, p) => sum + p.score, 0) / participants.length))
    : 0;
  const topScore = participants?.[0]?.score || 0;

  return (
    <>
      <Card className="border-2 border-white/10 bg-[#221f20] rounded-2xl">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle className="text-white text-xl flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              {contestTitle ? `${contestTitle} - Leaderboard` : 'Contest Leaderboard'}
            </CardTitle>
            {totalParticipants > 10 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAllParticipants(true)}
                className="border-white/20 text-white/60 hover:text-white"
              >
                <Eye className="w-4 h-4 mr-2" />
                View All ({totalParticipants})
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-3 bg-[#1a1a1a] rounded-xl border border-white/10 text-center">
              <Users className="w-5 h-5 text-[#ac1ed6] mx-auto mb-1" />
              <p className="text-2xl font-bold text-white">{totalParticipants}</p>
              <p className="text-xs text-white/60">Participants</p>
            </div>
            <div className="p-3 bg-[#1a1a1a] rounded-xl border border-white/10 text-center">
              <Target className="w-5 h-5 text-green-400 mx-auto mb-1" />
              <p className="text-2xl font-bold text-white">{avgScore}</p>
              <p className="text-xs text-white/60">Avg Score</p>
            </div>
            <div className="p-3 bg-[#1a1a1a] rounded-xl border border-white/10 text-center">
              <TrendingUp className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
              <p className="text-2xl font-bold text-white">{topScore}</p>
              <p className="text-xs text-white/60">Top Score</p>
            </div>
          </div>

          <ScrollArea className="h-[300px]">
            <div className="space-y-2">
              {topParticipants.map((participant, index) => (
                <motion.div
                  key={participant.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center gap-4 p-3 rounded-xl border bg-gradient-to-r ${getPositionBg(index)} ${
                    onUserClick ? 'cursor-pointer hover:bg-white/5 transition-colors' : ''
                  }`}
                  onClick={() => onUserClick?.(participant.user_id)}
                >
                  <div className="w-8 flex items-center justify-center">
                    {getPositionIcon(index)}
                  </div>
                  
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ac1ed6] to-[#c26e73] flex items-center justify-center text-white font-bold shrink-0">
                    {participant.full_name?.[0]?.toUpperCase() || 'A'}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">
                      {participant.full_name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge className="bg-[#ac1ed6]/20 text-white hover:text-[#ac1ed6] text-xs">
                        {participant.problems_solved} solved
                      </Badge>
                      {participant.completed_at && (
                        <Badge className="bg-green-500/20 text-green-400 text-xs">
                          Completed
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right shrink-0">
                    <p className="text-2xl font-bold text-white">{participant.score}</p>
                    <p className="text-xs text-white/40">points</p>
                  </div>
                </motion.div>
              ))}

              {topParticipants.length === 0 && (
                <div className="text-center py-12 text-white/40">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No participants yet</p>
                  <p className="text-sm mt-1">Be the first to join!</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* All Participants Dialog */}
      <Dialog open={showAllParticipants} onOpenChange={setShowAllParticipants}>
        <DialogContent className="max-w-2xl bg-[#0d0d0d] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              All Participants ({totalParticipants})
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[500px]">
            <div className="space-y-2">
              {(participants || []).map((participant, index) => (
                <motion.div
                  key={participant.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className={`flex items-center gap-4 p-3 rounded-xl border bg-gradient-to-r ${getPositionBg(index)} ${
                    onUserClick ? 'cursor-pointer hover:bg-white/5 transition-colors' : ''
                  }`}
                  onClick={() => onUserClick?.(participant.user_id)}
                >
                  <div className="w-8 flex items-center justify-center">
                    {getPositionIcon(index)}
                  </div>
                  
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ac1ed6] to-[#c26e73] flex items-center justify-center text-white font-bold shrink-0">
                    {participant.full_name?.[0]?.toUpperCase() || 'A'}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{participant.full_name}</p>
                    <p className="text-white/40 text-xs">{participant.email}</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Badge className="bg-[#ac1ed6]/20 text-[#ac1ed6]">
                      {participant.problems_solved} solved
                    </Badge>
                    <p className="text-xl font-bold text-white">{participant.score}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
