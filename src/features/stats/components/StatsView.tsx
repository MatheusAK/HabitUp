import { useMemo } from "react";
import { Activity, Flame, Target, TrendingUp, Zap } from "lucide-react";
import {
  computeOverallStreak,
  computeStreak,
  toLocalISO,
  useStore,
  type Habit,
} from "@/lib/habits-store";
import { useLocale } from "@/lib/i18n";
import { StatTile } from "./StatTile";
import { DailyAreaChart } from "./DailyAreaChart";
import { WeeklyBarChart } from "./WeeklyBarChart";
import { StreakList } from "./StreakList";
import { ContributionHeatmap } from "./ContributionHeatmap";

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
      label: `${d.getDate()}`,
      count,
      total: eligible.length,
    });
  }
  return out;
}

export function StatsView() {
  const t = useLocale();
  const habits = useStore((s) => s.habits);
  const xp = useStore((s) => s.xp);

  const dailyTotals = useMemo(() => buildDailyTotals(habits, 30), [habits]);
  const weekTotals = useMemo(() => buildDailyTotals(habits, 7), [habits]);

  const totalCompletions = habits.reduce((n, h) => n + h.completions.length, 0);
  const bestStreak = computeOverallStreak(habits);
  const last30 = dailyTotals.reduce((n, d) => n + d.count, 0);
  const last30Possible = dailyTotals.reduce((n, d) => n + d.total, 0);
  const rate = last30Possible > 0 ? Math.round((last30 / last30Possible) * 100) : 0;

  const perHabit = habits.map((h) => ({
    name: h.title.length > 14 ? h.title.slice(0, 14) + "…" : h.title,
    emoji: h.emoji,
    completions: h.completions.length,
    streak: computeStreak(h),
  }));

  if (habits.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-center">
        <Activity className="mx-auto h-7 w-7 text-primary" />
        <p className="mt-2 text-sm font-semibold">{t.noStatsTitle}</p>
        <p className="mt-1 text-xs text-muted-foreground">{t.noStatsBody}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Hero Stats - 2x2 grid compacto */}
      <div className="grid grid-cols-2 gap-2">
        <StatTile
          icon={<Flame className="h-3.5 w-3.5 text-streak" />}
          label={t.bestStreak}
          value={`${bestStreak}d`}
          accent="hsl(20 95% 60% / 0.18)"
          highlight
          size="large"
        />
        <StatTile
          icon={<TrendingUp className="h-3.5 w-3.5 text-primary" />}
          label={t.rate30}
          value={`${rate}%`}
          highlight
          size="large"
        />
        <StatTile
          icon={<Target className="h-3.5 w-3.5 text-success" />}
          label={t.totalDone}
          value={totalCompletions}
          accent="hsl(150 70% 50% / 0.18)"
        />
        <StatTile
          icon={<Zap className="h-3.5 w-3.5 text-yellow-400" />}
          label={t.totalXp}
          value={xp}
          accent="hsl(45 95% 55% / 0.18)"
        />
      </div>

      {/* Heatmap de Consistência */}
      <ContributionHeatmap habits={habits} />

      {/* Esta Semana + Streaks em row */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <WeeklyBarChart data={weekTotals} title={t.thisWeek} subtitle={t.doneVsPlanned} />
        <StreakList entries={perHabit} title={t.currentStreaks} subtitle={t.perHabit} />
      </div>

      {/* Gráfico de 30 dias */}
      <DailyAreaChart data={dailyTotals} title={t.last30days} subtitle={t.completionsPerDay} />
    </div>
  );
}
