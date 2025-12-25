import React, { useRef, useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AchievementMetadata, CodingAchievement } from '@/hooks/useCodingAchievements';
import { Download, Share2, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import QRCode from 'qrcode';

interface BadgeShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  achievement: AchievementMetadata;
  unlockedData: CodingAchievement;
  userName?: string;
}

export function BadgeShareDialog({
  isOpen,
  onClose,
  achievement,
  unlockedData,
  userName = 'CelesteCode User',
}: BadgeShareDialogProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/achievements/${achievement.id}`;

  // Generate QR Code
  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(shareUrl, {
        width: 120,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      }).then(setQrCodeUrl);
    }
  }, [isOpen, shareUrl]);

  // Generate certificate image
  useEffect(() => {
    if (!isOpen || !canvasRef.current || !qrCodeUrl) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 1200;
    canvas.height = 630; // Social media optimized

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, achievement.colors.primary);
    gradient.addColorStop(1, achievement.colors.secondary);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Overlay pattern
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 20; j++) {
        if ((i + j) % 2 === 0) {
          ctx.fillRect(i * 60, j * 60, 30, 30);
        }
      }
    }

    // White content area
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.roundRect(60, 60, canvas.width - 120, canvas.height - 120, 20);
    ctx.fill();

    // Border
    ctx.strokeStyle = achievement.colors.primary;
    ctx.lineWidth = 4;
    ctx.roundRect(60, 60, canvas.width - 120, canvas.height - 120, 20);
    ctx.stroke();

    // Title
    ctx.fillStyle = '#1a1a1a';
    ctx.font = 'bold 48px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Achievement Unlocked', canvas.width / 2, 150);

    // Icon (emoji or badge image)
    if (achievement.badgeImage) {
      const badgeImg = new Image();
      badgeImg.crossOrigin = 'anonymous';
      badgeImg.onload = () => {
        ctx.drawImage(badgeImg, canvas.width / 2 - 60, 200, 120, 120);
      };
      badgeImg.src = achievement.badgeImage;
    } else {
      ctx.font = '120px Arial';
      ctx.fillText(achievement.icon, canvas.width / 2, 280);
    }

    // Achievement name
    ctx.fillStyle = achievement.colors.primary;
    ctx.font = 'bold 56px Inter, sans-serif';
    ctx.fillText(achievement.name, canvas.width / 2, 380);

    // Description
    ctx.fillStyle = '#666666';
    ctx.font = '28px Inter, sans-serif';
    ctx.fillText(achievement.description, canvas.width / 2, 430);

    // User name
    ctx.fillStyle = '#1a1a1a';
    ctx.font = 'bold 32px Inter, sans-serif';
    ctx.fillText(`Earned by ${userName}`, canvas.width / 2, 490);

    // Date
    const date = new Date(unlockedData.unlocked_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    ctx.fillStyle = '#999999';
    ctx.font = '24px Inter, sans-serif';
    ctx.fillText(date, canvas.width / 2, 530);

    // QR Code
    if (qrCodeUrl) {
      const qrImage = new Image();
      qrImage.onload = () => {
        ctx.drawImage(qrImage, canvas.width - 200, canvas.height - 200, 120, 120);
        
        // QR Code label
        ctx.fillStyle = '#666666';
        ctx.font = '16px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Verify', canvas.width - 140, canvas.height - 65);
      };
      qrImage.src = qrCodeUrl;
    }

    // CelesteCode branding
    ctx.fillStyle = achievement.colors.primary;
    ctx.font = 'bold 28px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('CelesteCode', 100, canvas.height - 100);
  }, [isOpen, achievement, unlockedData, userName, qrCodeUrl]);

  const downloadImage = () => {
    if (!canvasRef.current) return;
    
    const link = document.createElement('a');
    link.download = `${achievement.name.replace(/\s+/g, '_')}_Achievement.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
    toast.success('Certificate downloaded!');
  };

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const shareToSocial = (platform: 'twitter' | 'linkedin' | 'facebook') => {
    const text = `I just unlocked the "${achievement.name}" achievement on CelesteCode! 🎉`;
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    };
    
    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-white/10">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Share Your Achievement</DialogTitle>
          <DialogDescription className="text-white/60">
            Download your certificate or share on social media
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Certificate Preview */}
          <div className="relative bg-white/5 rounded-xl p-4 border border-white/10">
            <canvas
              ref={canvasRef}
              className="w-full h-auto rounded-lg shadow-2xl"
              style={{ maxHeight: '400px', objectFit: 'contain' }}
            />
          </div>

          {/* Download Button */}
          <Button
            onClick={downloadImage}
            className="w-full bg-gradient-to-r from-[#ac1ed6] to-[#c26e73] hover:from-[#c26e73] hover:to-[#ac1ed6] text-white h-12 text-base font-semibold"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Certificate (PNG)
          </Button>

          {/* Share Link */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">Share Link</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
              />
              <Button
                onClick={copyShareLink}
                variant="outline"
                className="border-white/20 text-black hover:bg-white/10 hover:text-white"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Social Media Buttons */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">Share on Social Media</label>
            <div className="grid grid-cols-3 gap-3">
              <Button
                onClick={() => shareToSocial('twitter')}
                className="bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
                Twitter
              </Button>
              <Button
                onClick={() => shareToSocial('linkedin')}
                className="bg-[#0077B5] hover:bg-[#006399] text-white"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </Button>
              <Button
                onClick={() => shareToSocial('facebook')}
                className="bg-[#1877F2] hover:bg-[#166fe5] text-white"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </Button>
            </div>
          </div>

          <Button
            onClick={onClose}
            variant="outline"
            className="w-full border-white/20 text-black hover:bg-white/10 hover:text-white"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
