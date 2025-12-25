import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCodingAchievements, CODING_ACHIEVEMENTS, useUnlockAchievement, AchievementMetadata, CodingAchievement, RARITY_CONFIG } from '@/hooks/useCodingAchievements';
import { useCodingProgress } from '@/hooks/useCodingProfile';
import { Trophy, Lock, Sparkles, Search, Filter } from 'lucide-react';
import { BadgeCard } from '@/components/BadgeCard';
import { BadgeDetailModal } from '@/components/BadgeDetailModal';
import { BadgeShareDialog } from '@/components/BadgeShareDialog';
import { useAuth } from '@/contexts/AuthContext';

export function CodingAchievements() {
  const { data: achievements, isLoading } = useCodingAchievements();
  const { data: progress } = useCodingProgress();
  const unlockAchievement = useUnlockAchievement();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [rarityFilter, setRarityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedAchievement, setSelectedAchievement] = useState<AchievementMetadata | null>(null);
  const [shareAchievement, setShareAchievement] = useState<{ achievement: AchievementMetadata; data: CodingAchievement } | null>(null);

  const unlockedIds = new Set(achievements?.map(a => a.achievement_id) || []);
  
  const totalProblems = progress?.reduce((sum, p) => sum + (p.problems_solved || 0), 0) || 0;
  const totalEasy = progress?.reduce((sum, p) => sum + (p.easy_solved || 0), 0) || 0;
  const totalMedium = progress?.reduce((sum, p) => sum + (p.medium_solved || 0), 0) || 0;
  const totalHard = progress?.reduce((sum, p) => sum + (p.hard_solved || 0), 0) || 0;
  const maxRating = Math.max(...(progress?.map(p => p.max_rating || p.contest_rating || 0) || [0]));
  const totalPoints = achievements?.reduce((sum, a) => {
    const ach = CODING_ACHIEVEMENTS.find(ca => ca.id === a.achievement_id);
    return sum + (ach?.points || 0);
  }, 0) || 0;

  const getProgress = (ach: AchievementMetadata) => {
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

  const getCurrentValue = (ach: AchievementMetadata) => {
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

  const isClaimable = (ach: AchievementMetadata) => {
    if (unlockedIds.has(ach.id)) return false;
    return getProgress(ach) >= 100;
  };

  const handleClaim = (ach: AchievementMetadata) => {
    unlockAchievement.mutate({
      achievement_id: ach.id,
      achievement_name: ach.name,
      achievement_description: ach.description,
      achievement_icon: ach.icon,
    });
  };

  const handleShare = (ach: AchievementMetadata) => {
    const unlockedData = achievements?.find(a => a.achievement_id === ach.id);
    if (unlockedData) {
      setShareAchievement({ achievement: ach, data: unlockedData });
    }
  };

  // Filter achievements
  let filteredAchievements = CODING_ACHIEVEMENTS;
  
  if (searchQuery) {
    filteredAchievements = filteredAchievements.filter(ach =>
      ach.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ach.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  if (rarityFilter !== 'all') {
    filteredAchievements = filteredAchievements.filter(ach => ach.rarity === rarityFilter);
  }
  
  if (categoryFilter !== 'all') {
    filteredAchievements = filteredAchievements.filter(ach => ach.category === categoryFilter);
  }

  const unlockedAchievements = filteredAchievements.filter(a => unlockedIds.has(a.id));
  const claimableAchievements = filteredAchievements.filter(a => isClaimable(a));
  const lockedAchievements = filteredAchievements.filter(a => !unlockedIds.has(a.id) && !isClaimable(a));

  if (isLoading) {
    return (
      <Card className="border-2 border-white/10 bg-[#221f20]">
        <CardHeader>
          <CardTitle className="text-white">Loading achievements...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="border border-white/10 bg-gradient-to-br from-yellow-500/20 to-orange-500/10">
          <CardContent className="pt-4 text-center">
            <Trophy className="w-8 h-8 mx-auto text-yellow-500 mb-2" />
            <div className="text-2xl font-bold text-white">{unlockedAchievements.length}</div>
            <div className="text-xs text-white/60">Unlocked</div>
          </CardContent>
        </Card>
        <Card className="border border-white/10 bg-gradient-to-br from-[#ac1ed6]/20 to-[#c26e73]/10">
          <CardContent className="pt-4 text-center">
            <Sparkles className="w-8 h-8 mx-auto text-[#ac1ed6] mb-2" />
            <div className="text-2xl font-bold text-white">{totalPoints}</div>
            <div className="text-xs text-white/60">Total Points</div>
          </CardContent>
        </Card>
        <Card className="border border-white/10 bg-gradient-to-br from-blue-500/20 to-cyan-500/10">
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-[#ac1ed6]">{totalProblems}</div>
            <div className="text-xs text-white/60">Total Solved</div>
          </CardContent>
        </Card>
        <Card className="border border-white/10 bg-gradient-to-br from-orange-500/20 to-red-500/10">
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-orange-500">{maxRating || 'N/A'}</div>
            <div className="text-xs text-white/60">Max Rating</div>
          </CardContent>
        </Card>
        <Card className="border border-white/10 bg-gradient-to-br from-gray-500/20 to-gray-700/10">
          <CardContent className="pt-4 text-center">
            <Lock className="w-8 h-8 mx-auto text-white/40 mb-2" />
            <div className="text-2xl font-bold text-white">{lockedAchievements.length + claimableAchievements.length}</div>
            <div className="text-xs text-white/60">Locked</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="border-2 border-white/10 bg-[#221f20]">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input
                placeholder="Search achievements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
            </div>
            <Select value={rarityFilter} onValueChange={setRarityFilter}>
              <SelectTrigger className="w-full md:w-[180px] bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Rarity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rarities</SelectItem>
                <SelectItem value="common">Common</SelectItem>
                <SelectItem value="rare">Rare</SelectItem>
                <SelectItem value="epic">Epic</SelectItem>
                <SelectItem value="legendary">Legendary</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[180px] bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="progress">Progress</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="difficulty">Difficulty</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Claimable Achievements */}
      {claimableAchievements.length > 0 && (
        <Card className="border-2 border-[#ac1ed6] bg-[#221f20] shadow-[0_0_20px_rgba(172,30,214,0.4)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Sparkles className="w-5 h-5 text-[#ac1ed6] animate-pulse" />
              Ready to Claim ({claimableAchievements.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {claimableAchievements.map((ach) => (
                <BadgeCard
                  key={ach.id}
                  achievement={ach}
                  isUnlocked={false}
                  isClaimable={true}
                  isClaiming={unlockAchievement.isPending}
                  onClaim={() => handleClaim(ach)}
                  onClick={() => setSelectedAchievement(ach)}
                />
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
              <Trophy className="w-5 h-5 text-yellow-500" />
              Unlocked Achievements ({unlockedAchievements.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {unlockedAchievements.map((ach) => (
                <BadgeCard
                  key={ach.id}
                  achievement={ach}
                  isUnlocked={true}
                  onShare={() => handleShare(ach)}
                  onClick={() => setSelectedAchievement(ach)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Locked Achievements */}
      <Card className="border-2 border-white/10 bg-[#221f20]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Lock className="w-5 h-5 text-white/40" />
            Achievements to Unlock ({lockedAchievements.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {lockedAchievements.map((ach) => (
              <BadgeCard
                key={ach.id}
                achievement={ach}
                isUnlocked={false}
                progress={getProgress(ach)}
                currentValue={getCurrentValue(ach)}
                onClick={() => setSelectedAchievement(ach)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Badge Detail Modal */}
      {selectedAchievement && (
        <BadgeDetailModal
          isOpen={!!selectedAchievement}
          onClose={() => setSelectedAchievement(null)}
          achievement={selectedAchievement}
          unlockedData={achievements?.find(a => a.achievement_id === selectedAchievement.id)}
          onShare={() => {
            const unlockedData = achievements?.find(a => a.achievement_id === selectedAchievement.id);
            if (unlockedData) {
              setShareAchievement({ achievement: selectedAchievement, data: unlockedData });
              setSelectedAchievement(null);
            }
          }}
        />
      )}

      {/* Share Dialog */}
      {shareAchievement && (
        <BadgeShareDialog
          isOpen={!!shareAchievement}
          onClose={() => setShareAchievement(null)}
          achievement={shareAchievement.achievement}
          unlockedData={shareAchievement.data}
          userName={user?.user_metadata?.full_name || user?.email || 'CelesteCode User'}
        />
      )}
    </div>
  );
}
