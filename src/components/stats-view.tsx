import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, Flame, Target, TrendingUp } from "lucide-react";
import {
  bestStreakOverall,
  computeStreak,
  toLocalISO,
  useStore,
  type Habit,
} from "@/lib/habits-store";

/** Stat tile shown at the top. */
function StatTile({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl bg-card p-3 shadow-card">
      <div
        className="inline-flex h-8 w-8 items-center justify-center rounded-xl"
        style={{ background: accent ?? "hsl(var(--primary) / 0.18)" }}
      >
        {icon}
      </div>
      <p className="mt-2 text-2xl font-bold leading-none">{value}</p>
      <p className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

/** Build last-N-days completion totals. */
function buildDailyTotals(habits: Habit[], days: number) {
  const out: { date: string; label: string; count: number; total: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const iso = toLocalISO(d);
    const eligible = habits.filter(
      (h) => h.frequency === "daily" && h.createdAt <= iso,
    );
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

const PIE_COLORS = ["#a78bfa", "#34d399", "#fbbf24", "#fb7185", "#60a5fa", "#f472b6", "#22d3ee", "#c084fc"];

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
      {/* Top tiles */}
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

      {/* 30-day area chart */}
      <div className="rounded-2xl bg-card p-3 shadow-card">
        <div className="mb-2 flex items-center justify-between px-1">
          <h3 className="text-sm font-semibold">Last 30 days</h3>
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
            Completions / day
          </span>
        </div>
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyTotals} margin={{ top: 6, right: 6, left: -22, bottom: 0 }}>
              <defs>
                <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.55} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                interval={4}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
                width={28}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 12,
                  fontSize: 12,
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#fillCount)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly bar chart */}
      <div className="rounded-2xl bg-card p-3 shadow-card">
        <div className="mb-2 flex items-center justify-between px-1">
          <h3 className="text-sm font-semibold">This week</h3>
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
            Done vs. planned
          </span>
        </div>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weekTotals} margin={{ top: 6, right: 6, left: -22, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
                width={28}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="total" fill="hsl(var(--muted))" radius={[6, 6, 0, 0]} />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Per-habit streaks */}
      <div className="rounded-2xl bg-card p-3 shadow-card">
        <div className="mb-2 flex items-center justify-between px-1">
          <h3 className="text-sm font-semibold">Current streaks</h3>
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
            Per habit
          </span>
        </div>
        <div className="space-y-2">
          {perHabit.map((p, i) => {
            const max = Math.max(1, ...perHabit.map((x) => x.streak));
            const pct = (p.streak / max) * 100;
            return (
              <div key={i} className="flex items-center gap-2">
                <span className="w-6 shrink-0 text-center text-lg">{p.emoji}</span>
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

      {/* Distribution pie */}
      {pieData.length > 0 && (
        <div className="rounded-2xl bg-card p-3 shadow-card">
          <div className="mb-2 flex items-center justify-between px-1">
            <h3 className="text-sm font-semibold">Where your effort goes</h3>
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
              All time
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-36 w-36 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="completions"
                    nameKey="name"
                    innerRadius={32}
                    outerRadius={60}
                    paddingAngle={2}
                    stroke="hsl(var(--card))"
                    strokeWidth={2}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="min-w-0 flex-1 space-y-1.5 text-xs">
              {pieData.map((p, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                  />
                  <span className="truncate">
                    {p.emoji} {p.name}
                  </span>
                  <span className="ml-auto text-muted-foreground">
                    {p.completions}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
