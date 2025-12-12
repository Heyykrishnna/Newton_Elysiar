import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useCodingAchievements, CODING_ACHIEVEMENTS, useUnlockAchievement } from '@/hooks/useCodingAchievements';
import { useCodingProgress } from '@/hooks/useCodingProfile';
import { Award, Lock, Trophy, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export function CodingAchievements() {
  const { data: achievements, isLoading } = useCodingAchievements();
  const { data: progress } = useCodingProgress();
  const unlockAchievement = useUnlockAchievement();

  const unlockedIds = new Set(achievements?.map(a => a.achievement_id) || []);
  
  const totalProblems = progress?.reduce((sum, p) => sum + (p.problems_solved || 0), 0) || 0;
  const totalEasy = progress?.reduce((sum, p) => sum + (p.easy_solved || 0), 0) || 0;
  const totalMedium = progress?.reduce((sum, p) => sum + (p.medium_solved || 0), 0) || 0;
  const totalHard = progress?.reduce((sum, p) => sum + (p.hard_solved || 0), 0) || 0;
  const maxRating = Math.max(...(progress?.map(p => p.max_rating || p.contest_rating || 0) || [0]));

  const getProgress = (ach: typeof CODING_ACHIEVEMENTS[0]) => {
    if (ach.type === 'codeforces_rating') {
      const cfProgress = progress?.find(p => p.platform === 'codeforces');
      const rating = cfProgress?.max_rating || 0;
      return Math.min((rating / ach.threshold) * 100, 100);
    }
    if (ach.type === 'leetcode_rank') {
      const lcProgress = progress?.find(p => p.platform === 'leetcode');
      const rank = lcProgress?.ranking || 0;
      if (!rank) return 0;
      if (rank <= ach.threshold) return 100;
      return Math.min((ach.threshold / rank) * 100, 100);
    }
    if (ach.type === 'easy') return Math.min((totalEasy / ach.threshold) * 100, 100);
    if (ach.type === 'medium') return Math.min((totalMedium / ach.threshold) * 100, 100);
    if (ach.type === 'hard') return Math.min((totalHard / ach.threshold) * 100, 100);
    return Math.min((totalProblems / ach.threshold) * 100, 100);
  };

  const getCurrentValue = (ach: typeof CODING_ACHIEVEMENTS[0]) => {
    if (ach.type === 'codeforces_rating') {
      const cfProgress = progress?.find(p => p.platform === 'codeforces');
      return cfProgress?.max_rating || 0;
    }
    if (ach.type === 'leetcode_rank') {
      const lcProgress = progress?.find(p => p.platform === 'leetcode');
      return lcProgress?.ranking || 'N/A';
    }
    if (ach.type === 'easy') return totalEasy;
    if (ach.type === 'medium') return totalMedium;
    if (ach.type === 'hard') return totalHard;
    return totalProblems;
  };

  const isClaimable = (ach: typeof CODING_ACHIEVEMENTS[0]) => {
    if (unlockedIds.has(ach.id)) return false;
    return getProgress(ach) >= 100;
  };

  if (isLoading) {
    return (
      <Card className="border-2 border-white/10 bg-[#221f20]">
        <CardHeader>
          <CardTitle className="text-white">Loading achievements...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  const unlockedAchievements = CODING_ACHIEVEMENTS.filter(a => unlockedIds.has(a.id));
  const claimableAchievements = CODING_ACHIEVEMENTS.filter(a => isClaimable(a));
  const lockedAchievements = CODING_ACHIEVEMENTS.filter(a => !unlockedIds.has(a.id) && !isClaimable(a));

  const handleClaim = (ach: typeof CODING_ACHIEVEMENTS[0]) => {
    unlockAchievement.mutate({
      achievement_id: ach.id,
      achievement_name: ach.name,
      achievement_description: ach.description,
      achievement_icon: ach.icon,
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border border-white/10 bg-[#221f20]">
          <CardContent className="pt-4 text-center">
            <Trophy className="w-8 h-8 mx-auto text-yellow-500 mb-2" />
            <div className="text-2xl font-bold text-white">{unlockedAchievements.length}</div>
            <div className="text-xs text-white/60">Unlocked</div>
          </CardContent>
        </Card>
        <Card className="border border-white/10 bg-[#221f20]">
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-[#ac1ed6]">{totalProblems}</div>
            <div className="text-xs text-white/60">Total Solved</div>
          </CardContent>
        </Card>
        <Card className="border border-white/10 bg-[#221f20]">
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-orange-500">{maxRating || 'N/A'}</div>
            <div className="text-xs text-white/60">Max Rating</div>
          </CardContent>
        </Card>
        <Card className="border border-white/10 bg-[#221f20]">
          <CardContent className="pt-4 text-center">
            <Lock className="w-8 h-8 mx-auto text-white/40 mb-2" />
            <div className="text-2xl font-bold text-white">{lockedAchievements.length + claimableAchievements.length}</div>
            <div className="text-xs text-white/60">Locked</div>
          </CardContent>
        </Card>
      </div>

      {/* Claimable Achievements */}
      {claimableAchievements.length > 0 && (
        <Card className="border-2 border-[#ac1ed6] bg-[#221f20] shadow-[0_0_15px_rgba(172,30,214,0.3)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white animate-pulse">
              <Sparkles className="w-5 h-5 text-[#ac1ed6]" />
              Ready to Claim ({claimableAchievements.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {claimableAchievements.map((ach) => (
                <motion.div
                  key={ach.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Card className="border border-[#ac1ed6]/50 bg-gradient-to-br from-[#ac1ed6]/20 to-[#c26e73]/20">
                    <CardContent className="pt-4 text-center">
                      <div className="text-4xl mb-2 animate-bounce">{ach.icon}</div>
                      <h4 className="font-bold text-white text-sm">{ach.name}</h4>
                      <p className="text-xs text-white/60 mt-1 mb-3">{ach.description}</p>
                      <Button 
                        onClick={() => handleClaim(ach)}
                        disabled={unlockAchievement.isPending}
                        className="w-full bg-gradient-to-r from-[#ac1ed6] to-[#c26e73] hover:from-[#c26e73] hover:to-[#ac1ed6] text-white shadow-lg"
                      >
                        {unlockAchievement.isPending ? 'Claiming...' : 'Claim Reward'}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <Card className="border-2 border-yellow-500/30 bg-[#221f20]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Award className="w-5 h-5 text-yellow-500" />
              Unlocked Achievements ({unlockedAchievements.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {unlockedAchievements.map((ach, index) => (
                <motion.div
                  key={ach.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border border-yellow-500/30 bg-[#221f20] hover:shadow-lg transition-all">
                    <CardContent className="pt-4 text-center">
                      <div className="text-4xl mb-2">{ach.icon}</div>
                      <h4 className="font-bold text-white text-sm">{ach.name}</h4>
                      <p className="text-xs text-white/60 mt-1">{ach.description}</p>
                      <Badge className="mt-2 bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                        Unlocked
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Locked Achievements with Progress */}
      <Card className="border-2 border-white/10 bg-[#221f20]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Lock className="w-5 h-5 text-white/40" />
            Achievements to Unlock ({lockedAchievements.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lockedAchievements.map((ach) => {
              const progressValue = getProgress(ach);
              const currentValue = getCurrentValue(ach);

              return (
                <Card key={ach.id} className="border border-white/10 bg-[#090607] opacity-70 hover:opacity-100 transition-all">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <div className="text-3xl grayscale">{ach.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-bold text-white text-sm">{ach.name}</h4>
                        <p className="text-xs text-white/60 mt-1">{ach.description}</p>
                        <div className="mt-3 space-y-1">
                          <div className="flex justify-between text-xs text-white/60">
                            <span>{currentValue}</span>
                            <span>{ach.threshold}</span>
                          </div>
                          <Progress value={progressValue} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
