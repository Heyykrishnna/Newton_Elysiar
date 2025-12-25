import React from 'react';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface SlidingTabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export function SlidingTabNavigation({ tabs, activeTab, onTabChange, className }: SlidingTabNavigationProps) {
  const activeIndex = tabs.findIndex(tab => tab.id === activeTab);

  return (
    <div className={cn("relative w-full", className)}>
      <div className="flex items-stretch p-1 bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] rounded-xl border border-white/10 backdrop-blur-sm relative overflow-x-auto scrollbar-hide">
        {tabs.map((tab, index) => (
          <React.Fragment key={tab.id}>
            <input
              type="radio"
              id={`tab-${tab.id}`}
              name="sliding-tabs"
              checked={activeTab === tab.id}
              onChange={() => onTabChange(tab.id)}
              className="hidden"
            />
            <label
              htmlFor={`tab-${tab.id}`}
              className={cn(
                "relative cursor-pointer outline-none text-sm font-semibold px-4 py-3 flex-1 min-w-[90px] text-center transition-all duration-300 ease-out z-10 select-none flex items-center justify-center gap-2",
                activeTab === tab.id 
                  ? "text-white" 
                  : "text-white/50 hover:text-white/80"
              )}
              style={{ zIndex: 2 }}
            >
              {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
              <span className="hidden md:inline whitespace-nowrap truncate">{tab.label}</span>
            </label>
          </React.Fragment>
        ))}
        
        {/* Sliding background bar */}
        <div
          className="absolute h-[calc(100%-8px)] rounded-lg bg-gradient-to-r from-[#ac1ed6] to-[#c26e73] transition-all duration-500 ease-[cubic-bezier(0.33,0.83,0.99,0.98)] shadow-lg shadow-purple-500/30"
          style={{
            width: `calc(${100 / tabs.length}% - 4px)`,
            transform: `translateX(calc(${activeIndex * 100}% + 2px))`,
            top: '4px',
            left: '2px',
            zIndex: 0,
          }}
        />
        
        {/* Top accent bar */}
        <div
          className="absolute top-0 h-1 bg-white/20 rounded-full transition-all duration-500 ease-[cubic-bezier(0.33,0.83,0.99,0.98)]"
          style={{
            width: `${100 / tabs.length}%`,
            transform: `translateX(${activeIndex * 100}%)`,
          }}
        />
        
        {/* Bottom accent bar */}
        <div
          className="absolute bottom-0 h-1 bg-white/20 rounded-full transition-all duration-500 ease-[cubic-bezier(0.33,0.83,0.99,0.98)]"
          style={{
            width: `${100 / tabs.length}%`,
            transform: `translateX(${activeIndex * 100}%)`,
          }}
        />
      </div>
    </div>
  );
}
