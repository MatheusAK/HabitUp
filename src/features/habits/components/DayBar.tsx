import { ChevronLeft, ChevronRight, Flame } from "lucide-react";
import { lastDaysStatus, toLocalISO, useStore } from "@/lib/habits-store";

interface DayBarProps {
  selectedDate: string;
  onSelectDate: (iso: string) => void;
}

export function DayBar({ selectedDate, onSelectDate }: DayBarProps) {
  const habits = useStore((s) => s.habits);
  const locale = useStore((s) => s.locale);
  const today = toLocalISO(new Date());

  const base = new Date(selectedDate + "T00:00:00");
  const windowDates: string[] = [];
  for (let i = -3; i <= 3; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    windowDates.push(toLocalISO(d));
  }

  const statusByDate = new Map<string, { allDone: boolean; partial: boolean }>();
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
        className="flex w-7 items-center justify-center rounded-xl bg-black/15 text-white/70 transition hover:bg-black/25 hover:text-white active:scale-95"
        aria-label="Previous day"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div className="grid flex-1 grid-cols-7 gap-1 rounded-2xl bg-black/15 p-1.5">
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
              className={`flex flex-col items-center gap-0.5 rounded-xl px-1 py-1.5 transition active:scale-95 ${
                isSelected
                  ? "bg-white/25"
                  : isToday
                    ? "bg-white/10"
                    : "hover:bg-white/10"
              }`}
              aria-label={`Select ${date}`}
              aria-pressed={isSelected}
            >
              <span className="text-[9px] font-semibold uppercase text-white/55">
                {dayLabel}
              </span>
              <span className={`text-xs font-bold ${isSelected ? "text-white" : "text-white/80"}`}>
                {d.getDate()}
              </span>
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-full ${
                  status.allDone
                    ? "bg-streak text-streak-foreground"
                    : status.partial
                      ? "bg-white/30 text-white"
                      : isFuture
                        ? "bg-white/8 text-white/20"
                        : "bg-white/12 text-white/30"
                }`}
              >
                {status.allDone ? (
                  <Flame className="h-3 w-3" fill="currentColor" />
                ) : status.partial ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
                ) : (
                  <span className="h-1 w-1 rounded-full bg-white/25" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={() => shift(1)}
        className="flex w-7 items-center justify-center rounded-xl bg-black/15 text-white/70 transition hover:bg-black/25 hover:text-white active:scale-95"
        aria-label="Next day"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
