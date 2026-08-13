import React, { useState, useEffect } from 'react';
import { format, addDays, startOfToday, isSameDay, parseISO, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, AlertCircle } from 'lucide-react';
import { BookingAPI } from '../services/api';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'motion/react';

interface Slot {
  startAt: string;
  locationId: string;
  availableTeamMemberIds: string[];
}

interface BookingCalendarProps {
  onSelect: (date: string, time: string) => void;
  selectedDate?: string;
  selectedTime?: string;
  serviceVariationId?: string;
}

export default function BookingCalendar({ onSelect, selectedDate, selectedTime, serviceVariationId }: BookingCalendarProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(startOfToday()));
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const weekDays = eachDayOfInterval({
    start: currentWeekStart,
    end: addDays(currentWeekStart, 6),
  });

  useEffect(() => {
    if (serviceVariationId) {
      fetchAvailability();
    }
  }, [currentWeekStart, serviceVariationId]);

  const fetchAvailability = async () => {
    if (!serviceVariationId) return;
    setLoading(true);
    setError(null);
    try {
      const start = currentWeekStart.toISOString();
      const end = addDays(currentWeekStart, 7).toISOString();
      const data = await BookingAPI.getAvailability(start, end, [serviceVariationId]);
      setSlots(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const nextWeek = () => setCurrentWeekStart(addDays(currentWeekStart, 7));
  const prevWeek = () => {
    const prev = addDays(currentWeekStart, -7);
    if (prev >= startOfWeek(startOfToday())) {
      setCurrentWeekStart(prev);
    }
  };

  const getSlotsForDay = (day: Date) => {
    return slots.filter(slot => isSameDay(parseISO(slot.startAt), day));
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-100 p-6 rounded-[2rem] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200 rotate-3">
            <Clock className="h-7 w-7" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-1 italic">Available Appointments</p>
            <p className="text-lg font-black text-zinc-900 tracking-tight leading-none">Choose an available appointment</p>
          </div>
        </div>
        <div className="text-left sm:text-right w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0 border-blue-100/50">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 bg-white px-3 py-1.5 rounded-full border border-blue-200 inline-block rotate-[-2deg]">
            Live Schedule
          </p>
          <p className="text-xs font-bold text-zinc-500 mt-3 flex items-center sm:justify-end gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            Times below come directly from the booking calendar
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-zinc-900">Select Date & Time</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={prevWeek} disabled={currentWeekStart <= startOfWeek(startOfToday())}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-sm">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-7 gap-2 mb-4">
        {weekDays.map(day => (
          <div key={day.toString()} className="text-center">
            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
              {format(day, 'EEE')}
            </div>
            <div className={`text-sm font-bold p-2 rounded-lg ${
              isSameDay(day, startOfToday()) ? 'bg-zinc-900 text-white' : 'text-zinc-900'
            }`}>
              {format(day, 'd')}
            </div>
          </div>
        ))}
      </div>

      <div className="relative min-h-[300px]">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <AnimatePresence mode="popLayout">
              {weekDays.flatMap(day => {
                const daySlots = getSlotsForDay(day);
                if (daySlots.length === 0) return [];
                
                return daySlots.map(slot => {
                  const time = format(parseISO(slot.startAt), 'h:mm a');
                  const dateStr = format(parseISO(slot.startAt), 'yyyy-MM-dd');
                  const isSelected = selectedDate === dateStr && selectedTime === time;
                  const isLimited = slot.availableTeamMemberIds.length === 1;

                  return (
                    <motion.button
                      key={slot.startAt}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      onClick={() => onSelect(dateStr, time)}
                      className={`flex flex-col p-3 rounded-xl border-2 transition-all text-left relative overflow-hidden ${
                        isSelected 
                          ? 'border-zinc-900 bg-zinc-900 text-white' 
                          : 'border-zinc-100 hover:border-zinc-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className={`h-3 w-3 ${isSelected ? 'text-zinc-400' : 'text-zinc-400'}`} />
                        <span className="text-sm font-bold">{time}</span>
                      </div>
                      <div className={`text-[10px] font-medium ${isSelected ? 'text-zinc-400' : 'text-zinc-500'}`}>
                        {format(day, 'MMM d')}
                      </div>
                      
                      {isLimited && !isSelected && (
                        <div className="absolute top-0 right-0 bg-amber-100 text-amber-700 text-[8px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-tighter">
                          Limited
                        </div>
                      )}
                    </motion.button>
                  );
                });
              })}
            </AnimatePresence>
            
            {!loading && slots.length === 0 && (
              <div className="col-span-full py-12 text-center">
                <p className="text-zinc-500 mb-2">No availability found for this week.</p>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  (If you are the owner: Please ensure you have assigned team members to this service and set up your working hours in your Square Dashboard under "Staff" &gt; "Team".)
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
