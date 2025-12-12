import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCodingContests, useJoinContest, useContestParticipation, CodingContest } from '@/hooks/useCodingContests';
import { Clock, Trophy, Users, Play, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { format, differenceInMinutes, isPast, isFuture } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { CodingPlayground } from './CodingPlayground';
import { WebDevContestSession } from './WebDevContestSession';
import { ContestLeaderboard } from './ContestLeaderboard';
import { useCreateEvent } from '@/hooks/useEvents';
import { toast } from 'sonner';

export function CodingContests() {
  const { data: contests, isLoading } = useCodingContests();
  const [selectedContest, setSelectedContest] = useState<CodingContest | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(true);
  const [selectedLeaderboardContest, setSelectedLeaderboardContest] = useState<string | undefined>(undefined);

  const getContestStatus = (contest: CodingContest) => {
    const now = new Date();
    const start = new Date(contest.start_time);
    const end = new Date(contest.end_time);

    if (isFuture(start)) return 'upcoming';
    if (isPast(end)) return 'ended';
    return 'live';
  };

  if (isLoading) {
    return (
      <Card className="border-2 border-white/10 bg-[#221f20]">
        <CardHeader>
          <CardTitle className="text-white">Loading contests...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (!contests || contests.length === 0) {
    return (
      <Card className="border-2 border-white/10 bg-[#221f20]">
        <CardHeader className="text-center py-12">
          <Trophy className="w-12 h-12 mx-auto text-white/40 mb-4" />
          <CardTitle className="text-white">No Active Contests</CardTitle>
          <CardDescription className="text-white/60">Check back later for upcoming coding challenges!</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Global Leaderboard Toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-400" />
          Coding Contests
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowLeaderboard(!showLeaderboard)}
          className="border-white/20 text-white hover:text-white bg-transparent hover:bg-white/10"
        >
          {showLeaderboard ? <ChevronUp className="w-4 h-4 mr-2" /> : <ChevronDown className="w-4 h-4 mr-2" />}
          {showLeaderboard ? 'Hide' : 'Show'} Leaderboard
        </Button>
      </div>

      {/* Contest Leaderboard */}
      <AnimatePresence>
        {showLeaderboard && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <ContestLeaderboard 
              contestId={selectedLeaderboardContest} 
              contestTitle={selectedLeaderboardContest 
                ? contests?.find(c => c.id === selectedLeaderboardContest)?.title 
                : 'All Contests'
              }
            />
          </motion.div>
        )}
      </AnimatePresence>
      {/* Live Contests */}
      {contests.filter(c => getContestStatus(c) === 'live').length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            Live Contests
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contests.filter(c => getContestStatus(c) === 'live').map((contest) => (
              <ContestCard key={contest.id} contest={contest} onSelect={setSelectedContest} />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Contests */}
      {contests.filter(c => getContestStatus(c) === 'upcoming').length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Upcoming Contests</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contests.filter(c => getContestStatus(c) === 'upcoming').map((contest) => (
              <ContestCard key={contest.id} contest={contest} onSelect={setSelectedContest} />
            ))}
          </div>
        </div>
      )}

      {/* Completed Contests */}
      {contests.filter(c => getContestStatus(c) === 'ended').length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-green-400" />
            Completed Contests
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contests.filter(c => getContestStatus(c) === 'ended').map((contest) => (
              <ContestCard key={contest.id} contest={contest} onSelect={setSelectedContest} />
            ))}
          </div>
        </div>
      )}

      {/* Coding Playground */}
      {selectedContest && (
        selectedContest.type === 'web-dev' ? (
          <WebDevContestSession contest={selectedContest} onClose={() => setSelectedContest(null)} />
        ) : (
          <CodingPlayground contest={selectedContest} onClose={() => setSelectedContest(null)} />
        )
      )}
    </div>
  );
}

function ContestCard({ contest, onSelect }: { contest: CodingContest; onSelect: (contest: CodingContest) => void }) {
  const joinContest = useJoinContest();
  const { data: participation } = useContestParticipation(contest.id);
  const createEvent = useCreateEvent();

  const status = (() => {
    const now = new Date();
    const start = new Date(contest.start_time);
    const end = new Date(contest.end_time);
    if (isFuture(start)) return 'upcoming';
    if (isPast(end)) return 'ended';
    return 'live';
  })();

  const getTimeRemaining = () => {
    const now = new Date();
    const start = new Date(contest.start_time);
    const end = new Date(contest.end_time);

    if (isFuture(start)) {
      const mins = differenceInMinutes(start, now);
      if (mins < 60) return `Starts in ${mins}m`;
      if (mins < 1440) return `Starts in ${Math.floor(mins / 60)}h`;
      return `Starts ${format(start, 'MMM dd')}`;
    }

    if (isPast(end)) return 'Ended';

    const mins = differenceInMinutes(end, now);
    if (mins < 60) return `${mins}m left`;
    return `${Math.floor(mins / 60)}h ${mins % 60}m left`;
  };

  const addToCalendar = async () => {
    try {
      const startDate = new Date(contest.start_time);
      
      // Validate date
      if (isNaN(startDate.getTime())) {
        toast.error('Invalid contest date');
        console.error('Invalid date:', { start_time: contest.start_time });
        return;
      }

      await createEvent.mutateAsync({
        title: `🏆 Contest: ${contest.title}`,
        description: contest.description || 'Coding contest',
        event_date: format(startDate, 'yyyy-MM-dd'),
        event_time: format(startDate, 'HH:mm'),
        event_type: 'exam',
        color: '#ac1ed6',
      });
      // Success toast is shown by useCreateEvent hook
    } catch (error: any) {
      console.error('Failed to add contest to calendar:', error);
      console.error('Error details:', error?.message, error?.details);
      // Error toast is shown by useCreateEvent hook
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className={`border-2 ${status === 'live' ? 'border-red-500/50' : 'border-white/10'} bg-[#221f20] hover:shadow-lg transition-all`}>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-white text-lg">{contest.title}</CardTitle>
              <CardDescription className="text-white/60">{contest.description}</CardDescription>
            </div>
            <Badge className={
              status === 'live' ? 'bg-red-500 text-white animate-pulse' :
              status === 'upcoming' ? 'bg-blue-500 text-white' :
              'bg-gray-500 text-white'
            }>
              {status === 'live' ? 'LIVE' : status === 'upcoming' ? 'UPCOMING' : 'ENDED'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 text-sm text-white/60">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {getTimeRemaining()}
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {(contest.problems as any[])?.length || 0} problems
            </div>
          </div>

          <div className="flex gap-2">
            <Badge variant="outline" className={
              contest.difficulty === 'easy' ? 'text-green-400 border-green-400' :
              contest.difficulty === 'medium' ? 'text-yellow-400 border-yellow-400' :
              'text-red-400 border-red-400'
            }>
              {contest.difficulty}
            </Badge>
            
            {/* Show Completed badge for ended contests where user participated */}
            {status === 'ended' && participation && (
              <Badge className="bg-green-500/20 text-green-400 border border-green-500/50">
                <Trophy className="w-3 h-3 mr-1" />
                Completed
              </Badge>
            )}
          </div>

          <div className="flex gap-2">
            {participation ? (
              <Button 
                onClick={() => {
                  if (status === 'upcoming') {
                    toast.error('Contest has not started yet!', {
                      description: `This contest will start ${getTimeRemaining()}. Please wait until the contest begins.`
                    });
                    return;
                  }
                  if (status === 'ended') {
                    toast.error('Contest has ended!', {
                      description: 'This contest is no longer active.'
                    });
                    return;
                  }
                  onSelect(contest);
                }}
                disabled={status === 'upcoming' || status === 'ended'}
                className="flex-1 bg-gradient-to-r from-[#ac1ed6] to-[#c26e73] text-white hover:from-[#c26e73] hover:to-[#ac1ed6] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-4 h-4 mr-2" />
                {status === 'upcoming' ? 'Not Started' : status === 'ended' ? 'Contest Ended' : 'Open Playground'}
              </Button>
            ) : (
              <Button 
                onClick={() => joinContest.mutate(contest.id)}
                disabled={joinContest.isPending || status === 'ended'}
                className="flex-1 bg-gradient-to-r from-[#ac1ed6] to-[#c26e73] text-white"
              >
                {status === 'ended' ? 'Contest Ended' : 'Join Contest'}
              </Button>
            )}
            
            {status === 'upcoming' && (
              <Button
                variant="outline"
                onClick={addToCalendar}
                disabled={createEvent.isPending}
                className="border-white/20 text-white hover:bg-white"
                title="Add to Calendar"
              >
                <Calendar className="w-4 h-4 text-black" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}