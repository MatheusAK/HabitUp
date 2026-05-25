import { Flame } from "lucide-react";
import { HabitIcon } from "@/features/habits/habitIcons";

interface StreakEntry {
  name: string;
  emoji: string;
  streak: number;
}

interface StreakListProps {
  entries: StreakEntry[];
  title: string;
  subtitle: string;
}

export function StreakList({ entries, title, subtitle }: StreakListProps) {
  return (
    <div className="rounded-2xl bg-card p-3 shadow-card">
      <div className="mb-2 flex items-center justify-between px-1">
        <h3 className="text-sm font-semibold">{title}</h3>
        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
          {subtitle}
        </span>
      </div>
      <div className="space-y-2">
        {entries.map((p, i) => {
          const max = Math.max(1, ...entries.map((x) => x.streak));
          const pct = (p.streak / max) * 100;
          return (
            <div key={i} className="flex items-center gap-2">
              <span className="w-6 shrink-0 flex items-center justify-center text-primary"><HabitIcon name={p.emoji} /></span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="truncate font-medium">{p.name}</span>
                  <span className="inline-flex items-center gap-1 text-streak">
                    <Flame className="h-3 w-3" /> {p.streak}d
                  </span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-streak transition-all"
                    style={{ width: `${Math.max(4, pct)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
