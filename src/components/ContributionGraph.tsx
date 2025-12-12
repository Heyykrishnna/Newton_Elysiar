import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format, subDays, startOfWeek, addDays } from 'date-fns';

interface DailyActivity {
  activity_date: string;
  problems_solved: number;
}

interface ContributionGraphProps {
  activities: DailyActivity[];
  title?: string;
}

export function ContributionGraph({ activities, title = "Practice Activity" }: ContributionGraphProps) {
  const { weeks, maxCount } = useMemo(() => {
    const today = new Date();
    const oneYearAgo = subDays(today, 365);
    const startDate = startOfWeek(oneYearAgo, { weekStartsOn: 0 });
    
    // Create activity map
    const activityMap = new Map<string, number>();
    activities.forEach(a => {
      activityMap.set(a.activity_date, a.problems_solved);
    });

    // Generate weeks
    const weeks: { date: Date; count: number }[][] = [];
    let currentWeek: { date: Date; count: number }[] = [];
    let currentDate = new Date(startDate);
    let maxCount = 0;

    while (currentDate <= today) {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      const count = activityMap.get(dateStr) || 0;
      maxCount = Math.max(maxCount, count);
      
      currentWeek.push({ date: new Date(currentDate), count });
      
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      
      currentDate = addDays(currentDate, 1);
    }
    
    if (currentWeek.length > 0) {
      // Pad the last week with empty days if needed
      while (currentWeek.length < 7) {
        currentWeek.push({ date: new Date(currentDate), count: 0 });
        currentDate = addDays(currentDate, 1);
      }
      weeks.push(currentWeek);
    }

    return { weeks, maxCount };
  }, [activities]);

  const getColor = (count: number) => {
    if (count === 0) return 'bg-white/5';
    if (maxCount === 0) return 'bg-white/5';
    
    const intensity = count / maxCount;
    if (intensity <= 0.25) return 'bg-green-900/60';
    if (intensity <= 0.5) return 'bg-green-700/70';
    if (intensity <= 0.75) return 'bg-green-500/80';
    return 'bg-green-400';
  };

  const months = useMemo(() => {
    const monthLabels: { name: string; index: number }[] = [];
    let lastMonth = -1;
    
    weeks.forEach((week, weekIndex) => {
      const firstDayOfWeek = week[0];
      if (firstDayOfWeek) {
        const month = firstDayOfWeek.date.getMonth();
        if (month !== lastMonth && weekIndex > 0) {
          monthLabels.push({
            name: format(firstDayOfWeek.date, 'MMM'),
            index: weekIndex
          });
          lastMonth = month;
        }
      }
    });
    
    return monthLabels;
  }, [weeks]);

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Card className="border-2 border-white/10 bg-[#221f20] rounded-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="w-full">
          <div className="w-full">
            {/* Month labels */}
            <div className="flex ml-8 mb-1">
              {months.map((month, i) => {
                const weeksInMonth = i < months.length - 1 
                  ? months[i + 1].index - month.index 
                  : weeks.length - month.index;
                return (
                  <div
                    key={`${month.name}-${i}`}
                    className="text-xs text-white/60 font-medium flex-shrink-0"
                    style={{ 
                      width: `${(weeksInMonth / weeks.length) * 100}%`
                    }}
                  >
                    {month.name}
                  </div>
                );
              })}
            </div>
            
            <div className="flex">
              {/* Day labels */}
              <div className="flex flex-col justify-around mr-2 text-xs text-white/60 flex-shrink-0" style={{ width: '32px' }}>
                {dayLabels.filter((_, i) => i % 2 === 1).map(day => (
                  <span key={day} className="leading-tight">{day}</span>
                ))}
              </div>
              
              {/* Grid */}
              <TooltipProvider delayDuration={0}>
                <div className="flex gap-[3px] flex-1">
                  {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-[3px] flex-1">
                      {week.map((day, dayIndex) => (
                        <Tooltip key={`${weekIndex}-${dayIndex}`}>
                          <TooltipTrigger asChild>
                            <div
                              className={`w-full aspect-square rounded-sm ${getColor(day.count)} hover:ring-2 hover:ring-white/50 cursor-pointer transition-all hover:scale-110`}
                            />
                          </TooltipTrigger>
                          <TooltipContent 
                            className="bg-[#1a1a1a] border-white/20 text-white px-3 py-2"
                            sideOffset={5}
                          >
                            <div className="text-center">
                              <p className="font-bold text-sm">{day.count} {day.count === 1 ? 'problem' : 'problems'}</p>
                              <p className="text-xs text-white/70 mt-1">{format(day.date, 'EEEE, MMM d, yyyy')}</p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  ))}
                </div>
              </TooltipProvider>
            </div>
            
            {/* Legend */}
            <div className="flex items-center justify-end mt-3 gap-2 text-xs text-white/50">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="w-[10px] h-[10px] rounded-sm bg-white/5" />
                <div className="w-[10px] h-[10px] rounded-sm bg-green-900/60" />
                <div className="w-[10px] h-[10px] rounded-sm bg-green-700/70" />
                <div className="w-[10px] h-[10px] rounded-sm bg-green-500/80" />
                <div className="w-[10px] h-[10px] rounded-sm bg-green-400" />
              </div>
              <span>More</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
