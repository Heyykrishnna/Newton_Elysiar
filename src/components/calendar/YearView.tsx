import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    format,
    startOfYear,
    endOfYear,
    eachMonthOfInterval,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isToday,
    isSameDay,
    getDay
} from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarEvent, EVENT_TYPE_CONFIG } from '@/types/calendar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface YearViewProps {
    currentDate: Date;
    events: CalendarEvent[];
    onEventClick: (event: CalendarEvent) => void;
    onDateClick: (date: Date) => void;
}

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export const YearView: React.FC<YearViewProps> = ({
    currentDate,
    events,
    onEventClick,
    onDateClick,
}) => {
    const { months, eventsByDate, monthStats } = useMemo(() => {
        const yearStart = startOfYear(currentDate);
        const yearEnd = endOfYear(currentDate);
        const monthsInYear = eachMonthOfInterval({ start: yearStart, end: yearEnd });

        // Group events by date
        const grouped: Record<string, CalendarEvent[]> = {};
        events.forEach(event => {
            const dateKey = event.event_date;
            if (!grouped[dateKey]) {
                grouped[dateKey] = [];
            }
            grouped[dateKey].push(event);
        });

        // Calculate stats per month
        const stats: Record<string, number> = {};
        monthsInYear.forEach(month => {
            const monthKey = format(month, 'yyyy-MM');
            stats[monthKey] = events.filter(event =>
                event.event_date.startsWith(monthKey)
            ).length;
        });

        return {
            months: monthsInYear,
            eventsByDate: grouped,
            monthStats: stats
        };
    }, [currentDate, events]);

    const getEventsForDate = (date: Date) => {
        const dateKey = format(date, 'yyyy-MM-dd');
        return eventsByDate[dateKey] || [];
    };

    const renderMiniMonth = (month: Date, index: number) => {
        const monthStart = startOfMonth(month);
        const monthEnd = endOfMonth(month);
        const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

        // Add padding days for the first week
        const startDayOfWeek = getDay(monthStart);
        const paddingDays = Array(startDayOfWeek).fill(null);

        const monthKey = format(month, 'yyyy-MM');
        const eventCount = monthStats[monthKey] || 0;

        return (
            <motion.div
                key={month.toISOString()}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
            >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                    <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-3 border-b">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-sm">
                                {format(month, 'MMMM')}
                            </h3>
                            {eventCount > 0 && (
                                <Badge variant="secondary" className="text-xs">
                                    {eventCount} {eventCount === 1 ? 'event' : 'events'}
                                </Badge>
                            )}
                        </div>
                    </div>

                    <CardContent className="p-2">
                        {/* Weekday headers */}
                        <div className="grid grid-cols-7 gap-1 mb-1">
                            {WEEKDAYS.map((day, i) => (
                                <div
                                    key={i}
                                    className="text-center text-xs font-semibold text-muted-foreground h-6 flex items-center justify-center"
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar days */}
                        <div className="grid grid-cols-7 gap-1">
                            {paddingDays.map((_, i) => (
                                <div key={`padding-${i}`} className="h-8" />
                            ))}

                            {daysInMonth.map((day) => {
                                const dayEvents = getEventsForDate(day);
                                const isDayToday = isToday(day);
                                const hasEvents = dayEvents.length > 0;

                                return (
                                    <motion.div
                                        key={day.toISOString()}
                                        className={cn(
                                            "h-8 rounded-md flex items-center justify-center text-xs font-medium cursor-pointer transition-all duration-200 relative group",
                                            isDayToday && "bg-primary text-primary-foreground font-bold shadow-md",
                                            !isDayToday && hasEvents && "bg-accent/30 hover:bg-accent/50",
                                            !isDayToday && !hasEvents && "hover:bg-muted/50"
                                        )}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => onDateClick(day)}
                                    >
                                        <span className={cn(
                                            !isSameMonth(day, month) && "text-muted-foreground/40"
                                        )}>
                                            {format(day, 'd')}
                                        </span>

                                        {/* Event indicators */}
                                        {hasEvents && !isDayToday && (
                                            <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 flex space-x-0.5">
                                                {dayEvents.slice(0, 3).map((event, i) => (
                                                    <div
                                                        key={i}
                                                        className="w-1 h-1 rounded-full"
                                                        style={{ backgroundColor: event.color }}
                                                    />
                                                ))}
                                            </div>
                                        )}

                                        {/* Tooltip on hover */}
                                        {hasEvents && (
                                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                                <div className="bg-popover text-popover-foreground px-3 py-2 rounded-lg shadow-lg border text-xs whitespace-nowrap">
                                                    <div className="font-semibold mb-1">
                                                        {dayEvents.length} {dayEvents.length === 1 ? 'event' : 'events'}
                                                    </div>
                                                    {dayEvents.slice(0, 3).map((event, i) => (
                                                        <div key={i} className="flex items-center space-x-1 text-xs">
                                                            <span>{EVENT_TYPE_CONFIG[event.event_type].icon}</span>
                                                            <span className="truncate max-w-[150px]">{event.title}</span>
                                                        </div>
                                                    ))}
                                                    {dayEvents.length > 3 && (
                                                        <div className="text-muted-foreground mt-1">
                                                            +{dayEvents.length - 3} more
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        );
    };

    const yearStats = useMemo(() => {
        const totalEvents = events.length;
        const eventsByType: Record<string, number> = {};

        events.forEach(event => {
            eventsByType[event.event_type] = (eventsByType[event.event_type] || 0) + 1;
        });

        const topType = Object.entries(eventsByType).sort((a, b) => b[1] - a[1])[0];

        return {
            total: totalEvents,
            byType: eventsByType,
            topType: topType ? { type: topType[0], count: topType[1] } : null
        };
    }, [events]);

    return (
        <div className="h-full overflow-auto bg-white p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Year Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4"
                >
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        {format(currentDate, 'yyyy')}
                    </h1>

                    {/* Year Statistics */}
                    <div className="flex items-center justify-center space-x-6">
                        <Card className="px-6 py-3">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-primary">
                                    {yearStats.total}
                                </div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wide">
                                    Total Events
                                </div>
                            </div>
                        </Card>

                        {yearStats.topType && (
                            <Card className="px-6 py-3">
                                <div className="text-center">
                                    <div className="flex items-center justify-center space-x-2">
                                        <span className="text-2xl">
                                            {EVENT_TYPE_CONFIG[yearStats.topType.type as keyof typeof EVENT_TYPE_CONFIG]?.icon}
                                        </span>
                                        <span className="text-2xl font-bold">
                                            {yearStats.topType.count}
                                        </span>
                                    </div>
                                    <div className="text-xs text-muted-foreground uppercase tracking-wide capitalize">
                                        {yearStats.topType.type}s
                                    </div>
                                </div>
                            </Card>
                        )}

                        <Card className="px-6 py-3">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-black">
                                    {Object.keys(yearStats.byType).length}
                                </div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wide">
                                    Categories
                                </div>
                            </div>
                        </Card>
                    </div>
                </motion.div>

                {/* Month Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {months.map((month, index) => renderMiniMonth(month, index))}
                </div>

                {/* Legend */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 p-4 bg-muted/30 rounded-lg"
                >
                    <div className="text-sm text-muted-foreground text-center space-y-2">
                        <p className="font-semibold">Quick Guide</p>
                        <div className="flex items-center justify-center space-x-6 text-xs">
                            <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold">
                                    15
                                </div>
                                <span>Today</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 rounded-md bg-accent/30 flex items-center justify-center">
                                    20
                                </div>
                                <span>Has Events</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="flex space-x-0.5">
                                    <div className="w-1 h-1 rounded-full bg-blue-500" />
                                    <div className="w-1 h-1 rounded-full bg-green-500" />
                                    <div className="w-1 h-1 rounded-full bg-red-500" />
                                </div>
                                <span>Event Indicators</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
