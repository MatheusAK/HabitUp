import { useRef, useEffect, useCallback } from "react";
import { Flame } from "lucide-react";
import { lastDaysStatus, toLocalISO, useStore } from "@/lib/habits-store";

interface DayBarProps {
  selectedDate: string;
  onSelectDate: (iso: string) => void;
}

export function DayBar({ selectedDate, onSelectDate }: DayBarProps) {
  const habits = useStore((s) => s.habits);
  const locale = useStore((s) => s.locale);
  const today = toLocalISO(new Date());
  const scrollRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  // Generate 21 days centered around selected date for smooth scrolling
  const base = new Date(selectedDate + "T00:00:00");
  const windowDates: string[] = [];
  for (let i = -10; i <= 10; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    windowDates.push(toLocalISO(d));
  }

  const statusByDate = new Map<string, { allDone: boolean; partial: boolean }>();
  const recent = lastDaysStatus(habits, 60);
  recent.forEach((r) => statusByDate.set(r.date, { allDone: r.allDone, partial: r.partial }));

  // Center scroll on selected date
  useEffect(() => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const selectedEl = container.querySelector('[data-selected="true"]');
      if (selectedEl) {
        const containerRect = container.getBoundingClientRect();
        const selectedRect = selectedEl.getBoundingClientRect();
        const scrollLeft = selectedRect.left - containerRect.left - (containerRect.width / 2) + (selectedRect.width / 2) + container.scrollLeft;
        container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
  }, [selectedDate]);

  // Handle swipe gestures
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    
    if (Math.abs(diff) > 50) {
      const d = new Date(selectedDate + "T00:00:00");
      d.setDate(d.getDate() + (diff > 0 ? 1 : -1));
      onSelectDate(toLocalISO(d));
    }
    touchStartX.current = null;
  }, [selectedDate, onSelectDate]);

  return (
    <div 
      className="mt-3 -mx-1"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        ref={scrollRef}
        className="flex gap-1 overflow-x-auto scrollbar-hide scroll-smooth px-1 py-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {windowDates.map((date) => {
          const d = new Date(date + "T00:00:00");
          const status = statusByDate.get(date) ?? { allDone: false, partial: false };
          const isToday = date === today;
          const isSelected = date === selectedDate;
          const isFuture = date > today;
          const dayLabel = d
            .toLocaleDateString(locale, { weekday: "narrow" })
            .toUpperCase();

          return (
            <button
              key={date}
              data-selected={isSelected}
              onClick={() => onSelectDate(date)}
              className={`flex flex-col items-center gap-0.5 rounded-xl px-2.5 py-1.5 transition-all active:scale-95 shrink-0 ${
                isSelected
                  ? "bg-white/25 shadow-sm"
                  : isToday
                    ? "bg-white/10"
                    : "hover:bg-white/10"
              }`}
              aria-label={`Select ${date}`}
              aria-pressed={isSelected}
            >
              <span className={`text-[9px] font-semibold uppercase ${isSelected ? "text-white/80" : "text-white/60"}`}>
                {dayLabel}
              </span>
              <span className={`text-sm font-bold ${isSelected ? "text-white" : "text-white/85"}`}>
                {d.getDate()}
              </span>
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full ${
                  status.allDone
                    ? "bg-streak text-streak-foreground"
                    : status.partial
                      ? "bg-white/35 text-white"
                      : isFuture
                        ? "bg-white/10 text-white/25"
                        : "bg-white/15 text-white/35"
                }`}
              >
                {status.allDone ? (
                  <Flame className="h-2.5 w-2.5" fill="currentColor" />
                ) : status.partial ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-white/90" />
                ) : (
                  <span className="h-1 w-1 rounded-full bg-white/40" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
