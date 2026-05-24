import { useMemo } from "react";
import { Activity, Flame, Target, TrendingUp } from "lucide-react";
import {
  bestStreakOverall,
  computeStreak,
  toLocalISO,
  useStore,
  type Habit,
} from "@/lib/habits-store";
import { StatTile } from "./StatTile";
import { DailyAreaChart } from "./DailyAreaChart";
import { WeeklyBarChart } from "./WeeklyBarChart";
import { StreakList } from "./StreakList";
import { DistributionPie } from "./DistributionPie";

function buildDailyTotals(habits: Habit[], days: number) {
  const out: { date: string; label: string; count: number; total: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const iso = toLocalISO(d);
    const dow = d.getDay();
    const eligible = habits.filter((h) => {
      if (h.createdAt > iso) return false;
      if (h.frequency === "daily") return true;
      if (h.frequency === "specific") return (h.scheduledDays ?? []).includes(dow);
      return false;
    });
    const count = habits.filter((h) => h.completions.includes(iso)).length;
    out.push({
      date: iso,
      label: `${d.getMonth() + 1}/${d.getDate()}`,
      count,
      total: eligible.length,
    });
  }
  return out;
}

export function StatsView() {
  const habits = useStore((s) => s.habits);
  const xp = useStore((s) => s.xp);

  const dailyTotals = useMemo(() => buildDailyTotals(habits, 30), [habits]);
  const weekTotals = useMemo(() => buildDailyTotals(habits, 7), [habits]);

  const totalCompletions = habits.reduce((n, h) => n + h.completions.length, 0);
  const bestStreak = bestStreakOverall(habits);
  const last30 = dailyTotals.reduce((n, d) => n + d.count, 0);
  const last30Possible = dailyTotals.reduce((n, d) => n + d.total, 0);
  const rate =
    last30Possible > 0 ? Math.round((last30 / last30Possible) * 100) : 0;

  const perHabit = habits.map((h) => ({
    name: h.title.length > 12 ? h.title.slice(0, 12) + "…" : h.title,
    emoji: h.emoji,
    completions: h.completions.length,
    streak: computeStreak(h),
  }));

  const pieData = perHabit
    .filter((p) => p.completions > 0)
    .sort((a, b) => b.completions - a.completions)
    .slice(0, 8);

  if (habits.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center">
        <Activity className="mx-auto h-8 w-8 text-primary" />
        <p className="mt-3 font-semibold">No stats yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Create habits and start completing them to unlock your charts.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <StatTile
          icon={<Flame className="h-4 w-4 text-streak" />}
          label="Best streak"
          value={`${bestStreak}d`}
          accent="hsl(20 95% 60% / 0.18)"
        />
        <StatTile
          icon={<TrendingUp className="h-4 w-4 text-primary" />}
          label="30-day rate"
          value={`${rate}%`}
        />
        <StatTile
          icon={<Target className="h-4 w-4 text-success" />}
          label="Total done"
          value={totalCompletions}
          accent="hsl(150 70% 50% / 0.18)"
        />
        <StatTile
          icon={<Activity className="h-4 w-4 text-primary" />}
          label="Total XP"
          value={xp}
        />
      </div>

      <DailyAreaChart data={dailyTotals} />
      <WeeklyBarChart data={weekTotals} />
      <StreakList entries={perHabit} />
      <DistributionPie data={pieData} />
    </div>
  );
}
