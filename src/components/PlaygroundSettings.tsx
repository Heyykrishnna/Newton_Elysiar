import React from 'react';
import { Settings, X, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PlaygroundSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  fontSize: number;
  theme: 'vs-dark' | 'light';
  onFontSizeChange: (size: number) => void;
  onThemeChange: (theme: 'vs-dark' | 'light') => void;
}

export function PlaygroundSettings({
  isOpen,
  onClose,
  fontSize,
  theme,
  onFontSizeChange,
  onThemeChange,
}: PlaygroundSettingsProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Settings Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-[320px] bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] border-l border-white/10 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-[#ac1ed6]/10 to-[#c26e73]/10">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#ac1ed6]" />
                <h3 className="text-lg font-semibold text-white">Editor Settings</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white/60 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Settings Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Font Size Setting */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="font-size" className="text-white font-medium">
                    Font Size
                  </Label>
                  <span className="text-sm text-white/60 bg-white/5 px-2 py-1 rounded-md border border-white/10">
                    {fontSize}px
                  </span>
                </div>
                <Slider
                  id="font-size"
                  min={10}
                  max={24}
                  step={1}
                  value={[fontSize]}
                  onValueChange={(value) => onFontSizeChange(value[0])}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-white/40">
                  <span>10px</span>
                  <span>24px</span>
                </div>
              </div>

              {/* Theme Setting */}
              <div className="space-y-3">
                <Label className="text-white font-medium">Theme</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => onThemeChange('vs-dark')}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
                      theme === 'vs-dark'
                        ? "border-[#ac1ed6] bg-gradient-to-br from-[#ac1ed6]/20 to-[#c26e73]/10"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    )}
                  >
                    <Moon className={cn(
                      "w-6 h-6",
                      theme === 'vs-dark' ? "text-[#ac1ed6]" : "text-white/60"
                    )} />
                    <span className={cn(
                      "text-sm font-medium",
                      theme === 'vs-dark' ? "text-white" : "text-white/60"
                    )}>
                      Dark
                    </span>
                  </button>

                  <button
                    onClick={() => onThemeChange('light')}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
                      theme === 'light'
                        ? "border-[#ac1ed6] bg-gradient-to-br from-[#ac1ed6]/20 to-[#c26e73]/10"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    )}
                  >
                    <Sun className={cn(
                      "w-6 h-6",
                      theme === 'light' ? "text-[#ac1ed6]" : "text-white/60"
                    )} />
                    <span className={cn(
                      "text-sm font-medium",
                      theme === 'light' ? "text-white" : "text-white/60"
                    )}>
                      Light
                    </span>
                  </button>
                </div>
              </div>

              {/* Info Box */}
              <div className="p-4 bg-gradient-to-br from-[#ac1ed6]/10 to-[#c26e73]/5 border border-[#ac1ed6]/20 rounded-xl">
                <p className="text-xs text-white/60 leading-relaxed">
                  Settings are automatically saved and will persist across sessions.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function SettingsButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={onClick}
      className="border-[#ac1ed6]/50 bg-gradient-to-r from-[#ac1ed6]/10 to-[#c26e73]/10 text-black hover:bg-transparent hover:text-white hover:border-[#ac1ed6]"
    >
      <Settings className="w-4 h-4 mr-1" />
      Settings
    </Button>
  );
}
