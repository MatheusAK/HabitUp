import { Flame } from "lucide-react";
import { lastDaysStatus, useStore } from "@/lib/habits-store";

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export function DayBar() {
  const habits = useStore((s) => s.habits);
  const days = lastDaysStatus(habits, 7);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="mt-4 grid grid-cols-7 gap-1.5 rounded-2xl bg-card/70 p-2 shadow-card backdrop-blur">
      {days.map(({ date, allDone, partial }) => {
        const d = new Date(date + "T00:00:00");
        const isToday = date === today;
        return (
          <div
            key={date}
            className={`flex flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-xs transition ${
              isToday ? "bg-primary/15 ring-1 ring-primary/40" : ""
            }`}
          >
            <span className="text-[10px] font-semibold uppercase text-muted-foreground">
              {DAY_LABELS[d.getDay()]}
            </span>
            <span className="text-xs font-bold text-foreground/80">{d.getDate()}</span>
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full ${
                allDone
                  ? "bg-gradient-streak text-white shadow-glow"
                  : partial
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground/40"
              }`}
            >
              {allDone ? (
                <Flame className="h-3.5 w-3.5" fill="currentColor" />
              ) : partial ? (
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
