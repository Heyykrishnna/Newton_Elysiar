import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { AchievementMetadata, RARITY_CONFIG } from '@/hooks/useCodingAchievements';
import { Lock, Sparkles, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BadgeCardProps {
  achievement: AchievementMetadata;
  isUnlocked: boolean;
  progress?: number;
  currentValue?: number | string;
  onClaim?: () => void;
  onShare?: () => void;
  onClick?: () => void;
  isClaimable?: boolean;
  isClaiming?: boolean;
}

export function BadgeCard({
  achievement,
  isUnlocked,
  progress = 0,
  currentValue,
  onClaim,
  onShare,
  onClick,
  isClaimable = false,
  isClaiming = false,
}: BadgeCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const rarityConfig = RARITY_CONFIG[achievement.rarity];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      className="cursor-pointer"
    >
      <Card
        className={cn(
          "relative overflow-hidden border-2 transition-all duration-300",
          isUnlocked && "shadow-lg",
          isClaimable && "animate-pulse shadow-[0_0_20px_rgba(172,30,214,0.5)]",
          !isUnlocked && !isClaimable && "opacity-70"
        )}
        style={{
          borderColor: isUnlocked || isClaimable ? achievement.colors.primary : '#374151',
          background: isUnlocked || isClaimable
            ? `linear-gradient(135deg, ${achievement.colors.primary}15 0%, ${achievement.colors.secondary}10 100%)`
            : 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)',
          boxShadow: isHovered && (isUnlocked || isClaimable)
            ? `0 20px 40px ${achievement.colors.glow}, 0 0 30px ${achievement.colors.glow}`
            : undefined,
        }}
      >
        {/* Shine effect overlay */}
        {(isUnlocked || isClaimable) && (
          <motion.div
            className="absolute inset-0 opacity-0 pointer-events-none"
            animate={{
              opacity: isHovered ? [0, 0.3, 0] : 0,
              x: isHovered ? ['-100%', '100%'] : '-100%',
            }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            style={{
              background: `linear-gradient(90deg, transparent, ${achievement.colors.primary}40, transparent)`,
            }}
          />
        )}

        {/* Rarity badge */}
        <div className="absolute top-2 right-2 z-10">
          <Badge
            className="text-xs font-bold border-0"
            style={{
              background: `linear-gradient(135deg, ${achievement.colors.primary}, ${achievement.colors.secondary})`,
              color: 'white',
            }}
          >
            {rarityConfig.label}
          </Badge>
        </div>

        {/* Points badge */}
        {isUnlocked && (
          <div className="absolute top-2 left-2 z-10">
            <Badge className="text-xs font-bold bg-black/50 text-white border-white/20">
              +{achievement.points} pts
            </Badge>
          </div>
        )}

        <CardContent className="pt-6 pb-4 text-center relative">
          {/* Icon with glow */}
          <motion.div
            className="relative inline-block mb-3"
            animate={{
              scale: isClaimable ? [1, 1.1, 1] : 1,
            }}
            transition={{
              duration: 2,
              repeat: isClaimable ? Infinity : 0,
              ease: 'easeInOut',
            }}
          >
            {/* Glow effect */}
            {(isUnlocked || isClaimable) && (
              <div
                className="absolute inset-0 blur-xl"
                style={{
                  background: `radial-gradient(circle, ${achievement.colors.glow} 0%, transparent 70%)`,
                  transform: 'scale(1.5)',
                }}
              />
            )}
            
            {achievement.badgeImage ? (
              <div
                className={cn(
                  "relative z-10 transition-all duration-300 w-24 h-24 flex items-center justify-center",
                  !isUnlocked && !isClaimable && "grayscale opacity-50"
                )}
              >
                <img 
                  src={achievement.badgeImage} 
                  alt={achievement.name}
                  className="w-full h-full object-contain drop-shadow-2xl"
                />
              </div>
            ) : (
              <div
                className={cn(
                  "text-6xl relative z-10 transition-all duration-300",
                  !isUnlocked && !isClaimable && "grayscale opacity-50"
                )}
              >
                {achievement.icon}
              </div>
            )}

            {/* Lock overlay for locked achievements */}
            {!isUnlocked && !isClaimable && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Lock className="w-8 h-8 text-white/40" />
              </div>
            )}

            {/* Sparkles for claimable */}
            {isClaimable && (
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Sparkles className="w-6 h-6 text-yellow-400" />
              </motion.div>
            )}
          </motion.div>

          {/* Achievement name */}
          <h4
            className={cn(
              "font-bold text-base mb-1 transition-colors",
              isUnlocked || isClaimable ? "text-white" : "text-white/60"
            )}
          >
            {achievement.name}
          </h4>

          {/* Description */}
          <p className="text-xs text-white/60 mb-3 line-clamp-2">
            {achievement.description}
          </p>

          {/* Progress bar for locked achievements */}
          {!isUnlocked && !isClaimable && progress !== undefined && (
            <div className="space-y-1 mb-3">
              <div className="flex justify-between text-xs text-white/40">
                <span>{currentValue}</span>
                <span>{achievement.threshold}</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  style={{
                    background: `linear-gradient(90deg, ${achievement.colors.primary}, ${achievement.colors.secondary})`,
                  }}
                />
              </div>
              <p className="text-xs text-white/40">{Math.round(progress)}% Complete</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2">
            {isClaimable && onClaim && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onClaim();
                }}
                disabled={isClaiming}
                className="flex-1 h-8 text-xs font-bold"
                style={{
                  background: `linear-gradient(135deg, ${achievement.colors.primary}, ${achievement.colors.secondary})`,
                }}
              >
                {isClaiming ? 'Claiming...' : 'Claim'}
              </Button>
            )}

            {isUnlocked && (
              <>
                <Badge
                  className="flex-1 h-8 flex items-center justify-center text-xs font-bold border-0"
                  style={{
                    background: `linear-gradient(135deg, ${achievement.colors.primary}30, ${achievement.colors.secondary}20)`,
                    color: achievement.colors.primary,
                  }}
                >
                  ✓ Unlocked
                </Badge>
                {onShare && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onShare();
                    }}
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-white/20 hover:bg-white/10"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                )}
              </>
            )}
          </div>
        </CardContent>

        {/* Bottom gradient accent */}
        {(isUnlocked || isClaimable) && (
          <div
            className="absolute bottom-0 left-0 right-0 h-1"
            style={{
              background: `linear-gradient(90deg, ${achievement.colors.primary}, ${achievement.colors.secondary})`,
            }}
          />
        )}
      </Card>
    </motion.div>
  );
}
