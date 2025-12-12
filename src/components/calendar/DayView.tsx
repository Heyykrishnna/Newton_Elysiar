import React, { useMemo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    format,
    parseISO,
    isToday,
    differenceInMinutes
} from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarEvent, EVENT_TYPE_CONFIG, generateTimeSlots } from '@/types/calendar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar as CalendarIcon } from 'lucide-react';

interface DayViewProps {
    currentDate: Date;
    events: CalendarEvent[];
    onEventClick: (event: CalendarEvent) => void;
    onTimeSlotClick: (date: Date, time: string) => void;
}

export const DayView: React.FC<DayViewProps> = ({
    currentDate,
    events,
    onEventClick,
    onTimeSlotClick,
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const { timeSlots, dayEvents, allDayEvents, timedEvents } = useMemo(() => {
        const slots = generateTimeSlots(0, 24, 30); // 12 AM to 11 PM, 30-minute slots

        const dateKey = format(currentDate, 'yyyy-MM-dd');
        const eventsForDay = events.filter(event => event.event_date === dateKey);

        const allDay = eventsForDay.filter(event => !event.event_time);
        const timed = eventsForDay.filter(event => event.event_time);

        // Sort timed events by time
        timed.sort((a, b) => {
            if (!a.event_time || !b.event_time) return 0;
            return a.event_time.localeCompare(b.event_time);
        });

        return {
            timeSlots: slots,
            dayEvents: eventsForDay,
            allDayEvents: allDay,
            timedEvents: timed
        };
    }, [currentDate, events]);

    // Auto-scroll to current time
    useEffect(() => {
        if (scrollRef.current && isToday(currentDate)) {
            const currentHour = new Date().getHours();
            const scrollPosition = Math.max(0, currentHour * 128 - 200);
            scrollRef.current.scrollTop = scrollPosition;
        }
    }, [currentDate]);

    const getEventPosition = (event: CalendarEvent) => {
        if (!event.event_time) return null;

        const startTime = parseISO(`2000-01-01T${event.event_time}`);
        const startMinutes = startTime.getHours() * 60 + startTime.getMinutes();

        const top = (startMinutes / 30) * 64; // 64px per 30-minute slot

        let duration = 60; // Default 1 hour
        if (event.end_time) {
            const endTime = parseISO(`2000-01-01T${event.end_time}`);
            duration = differenceInMinutes(endTime, startTime);
        }

        const height = Math.max((duration / 30) * 64, 40);

        return { top, height };
    };

    const isDayToday = isToday(currentDate);

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Day Header */}
            <div className="border-b border-border/50 bg-white shadow-sm">
                <div className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center space-x-3">
                                <motion.div
                                    className={cn(
                                        "w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg",
                                        isDayToday
                                            ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground"
                                            : "bg-muted text-foreground"
                                    )}
                                    whileHover={{ scale: 1.05, rotate: 5 }}
                                >
                                    {format(currentDate, 'd')}
                                </motion.div>
                                <div>
                                    <h2 className="text-3xl font-bold text-foreground">
                                        {format(currentDate, 'EEEE')}
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        {format(currentDate, 'MMMM dd, yyyy')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <div className="text-2xl font-bold text-primary">
                                    {dayEvents.length}
                                </div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wide">
                                    Events
                                </div>
                            </div>
                            {isDayToday && (
                                <Badge variant="default" className="px-4 py-2 text-sm">
                                    Today
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* All-day events */}
                    {allDayEvents.length > 0 && (
                        <div className="mt-4 space-y-2">
                            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                                All Day
                            </div>
                            <div className="space-y-2">
                                {allDayEvents.map((event, index) => (
                                    <motion.div
                                        key={event.id}
                                        className="p-3 rounded-lg cursor-pointer shadow-sm border-l-4 hover:shadow-md transition-all duration-200"
                                        style={{
                                            backgroundColor: `${event.color}15`,
                                            borderLeftColor: event.color,
                                        }}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        onClick={() => onEventClick(event)}
                                        whileHover={{ scale: 1.02, x: 4 }}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <span className="text-lg">
                                                {EVENT_TYPE_CONFIG[event.event_type].icon}
                                            </span>
                                            <div className="flex-1">
                                                <div className="font-semibold" style={{ color: event.color }}>
                                                    {event.title}
                                                </div>
                                                {event.description && (
                                                    <div className="text-sm text-muted-foreground mt-1">
                                                        {event.description}
                                                    </div>
                                                )}
                                            </div>
                                            {event.priority !== 'normal' && (
                                                <Badge variant="outline" className="capitalize">
                                                    {event.priority}
                                                </Badge>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Day Schedule Grid */}
            <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full" ref={scrollRef}>
                    <div className="relative">
                        <div className="grid grid-cols-12 gap-0">
                            {/* Time Labels Column */}
                            <div className="col-span-2 border-r border-border/50 bg-white">
                                {timeSlots.map((slot, index) => (
                                    <div
                                        key={slot.time}
                                        className={cn(
                                            "h-16 px-4 py-3 border-b border-border/30 text-sm text-muted-foreground font-semibold",
                                            index % 2 === 0 && "bg-muted/5"
                                        )}
                                    >
                                        {slot.label}
                                    </div>
                                ))}
                            </div>

                            {/* Schedule Column */}
                            <div className="col-span-10 relative">
                                {/* Time Slots */}
                                {timeSlots.map((slot, slotIndex) => (
                                    <motion.div
                                        key={slot.time}
                                        className={cn(
                                            "h-16 border-b border-border/30 hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 cursor-pointer group transition-all duration-200 relative",
                                            slotIndex % 2 === 0 && "bg-muted/[0.02]"
                                        )}
                                        whileHover={{ scale: 1.002 }}
                                        onClick={() => onTimeSlotClick(currentDate, slot.time)}
                                    >
                                        {/* Hour line */}
                                        {slot.time.endsWith('00') && (
                                            <div className="absolute top-0 left-0 right-0 h-px bg-border/60" />
                                        )}

                                        {/* Quick add hint */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <div className="text-sm text-muted-foreground bg-white px-4 py-2 rounded-lg shadow-md border border-border/50 font-medium">
                                                + Add event at {slot.label}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}

                                {/* Timed Events */}
                                <div className="absolute inset-0 px-2">
                                    {timedEvents.map((event, eventIndex) => {
                                        const position = getEventPosition(event);
                                        if (!position) return null;

                                        return (
                                            <motion.div
                                                key={event.id}
                                                className="absolute left-2 right-2 rounded-xl p-4 cursor-pointer shadow-md border-l-4 overflow-hidden group/event hover:shadow-xl transition-all duration-200 z-10"
                                                style={{
                                                    top: position.top,
                                                    height: position.height,
                                                    backgroundColor: `${event.color}20`,
                                                    borderLeftColor: event.color,
                                                    minHeight: '40px',
                                                }}
                                                initial={{ opacity: 0, x: -30 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: eventIndex * 0.1 }}
                                                onClick={() => onEventClick(event)}
                                                whileHover={{ scale: 1.01, x: 4 }}
                                            >
                                                <div className="h-full flex flex-col">
                                                    <div className="flex items-start space-x-3">
                                                        <span className="text-xl group-hover/event:scale-110 transition-transform">
                                                            {EVENT_TYPE_CONFIG[event.event_type].icon}
                                                        </span>
                                                        <div className="flex-1 min-w-0">
                                                            <div
                                                                className="font-bold text-base leading-tight"
                                                                style={{ color: event.color }}
                                                            >
                                                                {event.title}
                                                            </div>
                                                            <div className="flex items-center space-x-2 mt-1 text-sm text-muted-foreground">
                                                                <Clock className="h-3 w-3" />
                                                                <span>
                                                                    {event.event_time && format(parseISO(`2000-01-01T${event.event_time}`), 'h:mm a')}
                                                                    {event.end_time && ' - ' + format(parseISO(`2000-01-01T${event.end_time}`), 'h:mm a')}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {event.priority !== 'normal' && (
                                                            <Badge variant="outline" className="capitalize text-xs">
                                                                {event.priority}
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    {position.height > 80 && event.description && (
                                                        <div className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                                            {event.description}
                                                        </div>
                                                    )}

                                                    {position.height > 120 && event.location && (
                                                        <div className="text-xs text-muted-foreground mt-2 flex items-center space-x-1">
                                                            <CalendarIcon className="h-3 w-3" />
                                                            <span>{event.location}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                {/* Current time indicator */}
                                {isDayToday && <CurrentTimeIndicator />}
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
};

// Current time indicator component
const CurrentTimeIndicator: React.FC = () => {
    const [currentTime, setCurrentTime] = React.useState(new Date());

    React.useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Update every minute

        return () => clearInterval(timer);
    }, []);

    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();

    const totalMinutes = currentHour * 60 + currentMinute;
    const topPosition = (totalMinutes / 30) * 64; // 64px per 30-minute slot

    return (
        <motion.div
            className="absolute left-0 right-0 z-20 pointer-events-none"
            style={{ top: topPosition }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex items-center">
                <div className="bg-red-500 text-white text-xs px-3 py-1 rounded-md shadow-lg font-bold">
                    {format(currentTime, 'h:mm a')}
                </div>
                <div className="flex-1 h-0.5 bg-red-500 shadow-lg"></div>
                <div className="w-3 h-3 bg-red-500 rounded-full shadow-lg animate-pulse"></div>
            </div>
        </motion.div>
    );
};
