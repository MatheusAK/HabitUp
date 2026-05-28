import { ChevronLeft, ChevronRight, Flame } from "lucide-react";
import { lastDaysStatus, toLocalISO, useStore } from "@/lib/habits-store";

interface DayBarProps {
  selectedDate: string;
  onSelectDate: (iso: string) => void;
}

/**
 * A sliding 7-day window centered on `selectedDate`. Each day is tappable
 * and updates the parent's selected date so the user can review past days
 * or pre-plan future ones. Arrow buttons step ±1 day for fine navigation.
 */
export function DayBar({ selectedDate, onSelectDate }: DayBarProps) {
  const habits = useStore((s) => s.habits);
  const locale = useStore((s) => s.locale);
  const today = toLocalISO(new Date());

  // Build a 7-day window: 3 days before selected, selected, 3 after.
  const base = new Date(selectedDate + "T00:00:00");
  const windowDates: string[] = [];
  for (let i = -3; i <= 3; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    windowDates.push(toLocalISO(d));
  }

  // Reuse lastDaysStatus by mapping its result for each window date.
  // We re-derive status inline to support arbitrary (incl. future) dates.
  const statusByDate = new Map<string, { allDone: boolean; partial: boolean }>();
  // Pull a wide enough recent window for past days; future days will be empty.
  const recent = lastDaysStatus(habits, 60);
  recent.forEach((r) => statusByDate.set(r.date, { allDone: r.allDone, partial: r.partial }));

  const shift = (delta: number) => {
    const d = new Date(selectedDate + "T00:00:00");
    d.setDate(d.getDate() + delta);
    onSelectDate(toLocalISO(d));
  };

  return (
    <div className="mt-4 flex items-stretch gap-1.5">
      <button
        onClick={() => shift(-1)}
        className="flex w-7 items-center justify-center rounded-xl bg-card/70 text-foreground/70 shadow-card backdrop-blur transition active:scale-95 hover:text-foreground"
        aria-label="Previous day"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div className="grid flex-1 grid-cols-7 gap-1.5 rounded-2xl bg-card/70 p-2 shadow-card backdrop-blur">
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
              onClick={() => onSelectDate(date)}
              className={`flex flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-xs transition active:scale-95 ${
                isSelected
                  ? "bg-primary/25 ring-2 ring-primary"
                  : isToday
                    ? "bg-primary/10 ring-1 ring-primary/40"
                    : "hover:bg-card"
              }`}
              aria-label={`Select ${date}`}
              aria-pressed={isSelected}
            >
              <span className="text-[10px] font-semibold uppercase text-muted-foreground">
                {dayLabel}
              </span>
              <span className="text-xs font-bold text-foreground/80">{d.getDate()}</span>
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full ${
                  status.allDone
                    ? "bg-gradient-streak text-white shadow-glow"
                    : status.partial
                      ? "bg-primary/20 text-primary"
                      : isFuture
                        ? "bg-muted/40 text-muted-foreground/30"
                        : "bg-muted text-muted-foreground/40"
                }`}
              >
                {status.allDone ? (
                  <Flame className="h-3.5 w-3.5" fill="currentColor" />
                ) : status.partial ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={() => shift(1)}
        className="flex w-7 items-center justify-center rounded-xl bg-card/70 text-foreground/70 shadow-card backdrop-blur transition active:scale-95 hover:text-foreground"
        aria-label="Next day"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
