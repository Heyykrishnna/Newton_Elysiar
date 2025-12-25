import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AchievementMetadata, RARITY_CONFIG, CodingAchievement } from '@/hooks/useCodingAchievements';
import { Calendar, Award, TrendingUp, Share2, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BadgeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievement: AchievementMetadata;
  unlockedData?: CodingAchievement;
  onShare?: () => void;
}

export function BadgeDetailModal({
  isOpen,
  onClose,
  achievement,
  unlockedData,
  onShare,
}: BadgeDetailModalProps) {
  const rarityConfig = RARITY_CONFIG[achievement.rarity];
  const isUnlocked = !!unlockedData;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not unlocked yet';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-white/10">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Achievement Details</DialogTitle>
          <DialogDescription className="text-white/60">
            View your achievement progress and details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Badge Display */}
          <div className="relative">
            <motion.div
              className="relative p-8 rounded-2xl border-2 text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              style={{
                borderColor: achievement.colors.primary,
                background: `linear-gradient(135deg, ${achievement.colors.primary}20 0%, ${achievement.colors.secondary}10 100%)`,
              }}
            >
              {/* Glow effect */}
              <div
                className="absolute inset-0 blur-3xl opacity-30 rounded-2xl"
                style={{
                  background: `radial-gradient(circle, ${achievement.colors.glow} 0%, transparent 70%)`,
                }}
              />

              {/* Icon */}
              <motion.div
                className="mb-4 relative z-10 flex items-center justify-center"
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                {achievement.badgeImage ? (
                  <img 
                    src={achievement.badgeImage} 
                    alt={achievement.name}
                    className="w-36 h-36 object-contain drop-shadow-2xl"
                  />
                ) : (
                  <div className="text-9xl">{achievement.icon}</div>
                )}
              </motion.div>

              {/* Name and Description */}
              <h3 className="text-3xl font-bold text-white mb-2 relative z-10">
                {achievement.name}
              </h3>
              <p className="text-white/70 text-lg relative z-10">{achievement.description}</p>

              {/* Rarity Badge */}
              <div className="mt-4 flex justify-center gap-2 relative z-10">
                <Badge
                  className="text-sm font-bold border-0 px-4 py-1"
                  style={{
                    background: `linear-gradient(135deg, ${achievement.colors.primary}, ${achievement.colors.secondary})`,
                    color: 'white',
                  }}
                >
                  {rarityConfig.label}
                </Badge>
                <Badge className="text-sm font-bold bg-black/50 text-white border-white/20 px-4 py-1">
                  {achievement.points} Points
                </Badge>
              </div>
            </motion.div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-2 text-white/60 mb-2">
                <Award className="w-4 h-4" />
                <span className="text-xs font-medium">Category</span>
              </div>
              <p className="text-white font-semibold capitalize">{achievement.category}</p>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-2 text-white/60 mb-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-medium">Threshold</span>
              </div>
              <p className="text-white font-semibold">{achievement.threshold.toLocaleString()}</p>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/10 col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 text-white/60 mb-2">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-medium">Unlocked</span>
              </div>
              <p className={cn(
                "font-semibold text-sm",
                isUnlocked ? "text-green-400" : "text-white/40"
              )}>
                {isUnlocked ? formatDate(unlockedData.unlocked_at) : 'Not yet'}
              </p>
            </div>
          </div>

          {/* Achievement Journey */}
          {isUnlocked && (
            <div className="p-4 bg-gradient-to-r from-[#ac1ed6]/10 to-[#c26e73]/10 rounded-xl border border-[#ac1ed6]/20">
              <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#ac1ed6]" />
                Achievement Journey
              </h4>
              <div className="space-y-2 text-sm text-white/70">
                <p>✨ Congratulations on unlocking this achievement!</p>
                <p>🎯 You've earned <span className="text-[#ac1ed6] font-bold">{achievement.points} points</span></p>
                <p>📅 Unlocked on {formatDate(unlockedData.unlocked_at)}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {isUnlocked && onShare && (
              <Button
                onClick={onShare}
                className="flex-1 bg-gradient-to-r from-[#ac1ed6] to-[#c26e73] hover:from-[#c26e73] hover:to-[#ac1ed6] text-white"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Achievement
              </Button>
            )}
            <Button
              onClick={onClose}
              variant="outline"
              className={cn(
                "border-white/20 black hover:bg-white/10 hover:text-white",
                !isUnlocked && "flex-1"
              )}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
