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
  const sorted = [...entries].sort((a, b) => b.streak - a.streak);
  const topEntries = sorted.slice(0, 5);
  const max = Math.max(1, ...entries.map((x) => x.streak));
  
  return (
    <div className="rounded-xl bg-card p-3 shadow-card">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="text-[10px] text-muted-foreground">{subtitle}</p>
        </div>
        {sorted[0]?.streak > 0 && (
          <div className="flex items-center gap-1 rounded-full bg-streak/15 px-2 py-0.5">
            <Flame className="h-3 w-3 text-streak" />
            <span className="text-xs font-bold text-streak">{sorted[0].streak}d</span>
          </div>
        )}
      </div>
      <div className="space-y-1.5">
        {topEntries.map((p, i) => {
          const pct = (p.streak / max) * 100;
          const isTop = i === 0 && p.streak > 0;
          return (
            <div key={i} className="flex items-center gap-2">
              <span className="w-5 shrink-0 flex items-center justify-center text-primary">
                <HabitIcon id={p.emoji} className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="truncate text-[11px] font-medium">{p.name}</span>
                  <span className={`flex items-center gap-0.5 text-[10px] font-semibold ${isTop ? "text-streak" : "text-muted-foreground"}`}>
                    {p.streak > 0 && <Flame className="h-2.5 w-2.5" />}
                    {p.streak}d
                  </span>
                </div>
                <div className="mt-0.5 h-1 overflow-hidden rounded-full bg-muted/60">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${isTop ? "bg-gradient-streak" : "bg-primary/50"}`}
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
