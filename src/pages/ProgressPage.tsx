import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Trophy,
  Flame,
  Zap,
  Target,
  TrendingUp,
  ChevronRight,
  Lock,
  Check,
} from "lucide-react";
import {
  useStore,
  levelFromXp,
  computeOverallStreak,
  computeStreak,
  TAG_COLORS,
  THEMES,
} from "@/lib/habits-store";
import { useLocale } from "@/lib/i18n";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

function CircularProgress({
  progress,
  size = 160,
  stroke = 14,
  children,
}: {
  progress: number;
  size?: number;
  stroke?: number;
  children?: React.ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - Math.min(1, Math.max(0, progress)));

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-muted/30"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-xp)" />
            <stop offset="100%" stopColor="var(--color-primary)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl bg-card p-4 shadow-card">
      <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary">
        {icon}
      </div>
      <p className="mt-3 text-2xl font-bold leading-none">{value}</p>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      {sub && <p className="mt-0.5 text-[11px] text-muted-foreground/70">{sub}</p>}
    </div>
  );
}

function MilestoneItem({
  level: lvl,
  name,
  unlocked,
  isNext,
}: {
  level: number;
  name: string;
  unlocked: boolean;
  isNext: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 transition ${
        unlocked
          ? "border-success/30 bg-success/10"
          : isNext
            ? "border-primary/40 bg-primary/10"
            : "border-border bg-card/60 opacity-60"
      }`}
    >
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
          unlocked
            ? "bg-success text-success-foreground"
            : isNext
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
        }`}
      >
        {unlocked ? <Check className="h-4 w-4" /> : lvl}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold">{name}</p>
        <p className="text-[11px] text-muted-foreground">
          {unlocked ? "Unlocked" : `Lvl ${lvl} required`}
        </p>
      </div>
    </div>
  );
}

export function ProgressPage() {
  const t = useLocale();
  const habits = useStore((s) => s.habits);
  const xp = useStore((s) => s.xp);
  const ownedThemes = useStore((s) => s.ownedThemes);
  const activeTheme = useStore((s) => s.activeTheme);

  const { level, progress, currentLevelXp, nextLevelXp } = levelFromXp(xp);
  const xpIntoLevel = xp - currentLevelXp;
  const xpNeeded = nextLevelXp - currentLevelXp;
  const overallStreak = computeOverallStreak(habits);

  // Total XP ever earned = current XP + any lost from broken streaks
  // Since we don't store lost XP, we compute from xpLogs as a proxy for "earned"
  const totalEarned = useMemo(() => {
    return habits.reduce((sum, h) => {
      return (
        sum + Object.values(h.xpLog ?? {}).reduce((a, b) => a + (b as number), 0)
      );
    }, 0);
  }, [habits]);

  // Streak multiplier based on overall streak: 25 * (floor(streak / 5) + 1)
  const streakMultiplier = Math.floor(overallStreak / 5) + 1;
  const baseXp = 25;
  const bonusXp = baseXp * streakMultiplier - baseXp;

  // Per-habit XP breakdown for chart
  const habitXpData = useMemo(() => {
    return habits
      .map((h) => {
        const habitTotal = Object.values(h.xpLog ?? {}).reduce(
          (a, b) => a + (b as number),
          0,
        );
        return {
          name: h.title.length > 10 ? h.title.slice(0, 10) + "…" : h.title,
          xp: habitTotal,
          streak: computeStreak(h),
          emoji: h.emoji,
        };
      })
      .filter((d) => d.xp > 0)
      .sort((a, b) => b.xp - a.xp)
      .slice(0, 6);
  }, [habits]);

  // Upcoming unlocks: next 3 themes and next 3 tag colors
  const upcomingThemes = THEMES.filter(
    (th) => th.unlockLevel > level,
  ).slice(0, 3);
  const upcomingColors = TAG_COLORS.filter(
    (tc) => tc.unlockLevel > level,
  ).slice(0, 3);

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-md pb-10">
      <div className="animated-bg" aria-hidden="true" />

      {/* Header */}
      <header className="relative overflow-hidden rounded-b-[2rem] bg-gradient-hero px-5 pb-8 pt-10 text-primary-foreground shadow-glow">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-lg font-bold">Level & Progress</h1>
        </div>

        {/* Big circular level indicator */}
        <div className="mt-6 flex flex-col items-center">
          <CircularProgress progress={progress} size={170} stroke={16}>
            <Trophy className="h-7 w-7 text-yellow-300" />
            <span className="mt-1 text-4xl font-extrabold">{level}</span>
            <span className="text-xs font-medium opacity-80">LEVEL</span>
          </CircularProgress>

          <div className="mt-4 text-center">
            <p className="text-sm font-semibold opacity-90">
              {xpIntoLevel} / {xpNeeded} XP
            </p>
            <p className="mt-0.5 text-xs opacity-70">
              {xpNeeded - xpIntoLevel} XP to Level {level + 1}
            </p>
          </div>
        </div>
      </header>

      <main className="mt-6 space-y-5 px-5">
        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={<Zap className="h-4 w-4" />}
            label="Total XP Earned"
            value={totalEarned}
            sub={`Current: ${xp}`}
          />
          <StatCard
            icon={<Target className="h-4 w-4" />}
            label="XP to Next Level"
            value={xpNeeded - xpIntoLevel}
            sub={`Level ${level + 1}`}
          />
          <StatCard
            icon={<Flame className="h-4 w-4" />}
            label="Overall Streak"
            value={`${overallStreak}d`}
            sub={overallStreak > 0 ? "Keep it up!" : "Start today"}
          />
          <StatCard
            icon={<TrendingUp className="h-4 w-4" />}
            label="Streak Multiplier"
            value={`x${streakMultiplier}`}
            sub={`+${bonusXp} bonus XP`}
          />
        </div>

        {/* XP bar detail */}
        <div className="rounded-2xl bg-card p-5 shadow-card">
          <h2 className="text-sm font-bold uppercase tracking-wide">XP Progress</h2>
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Level {level}</span>
              <span>Level {level + 1}</span>
            </div>
            <div className="mt-2 h-4 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-xp to-primary transition-all duration-700"
                style={{ width: `${Math.max(2, progress * 100)}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-xs">
              <span className="text-muted-foreground">
                {currentLevelXp} XP
              </span>
              <span className="font-medium text-primary">
                {nextLevelXp} XP
              </span>
            </div>
          </div>
        </div>

        {/* Streak impact card */}
        <div className="rounded-2xl bg-card p-5 shadow-card">
          <div className="flex items-center gap-2">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-streak text-streak-foreground">
              <Flame className="h-4 w-4" />
            </div>
            <h2 className="text-sm font-bold uppercase tracking-wide">
              Streak Impact
            </h2>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Every habit completion gives{" "}
            <strong className="text-foreground">{baseXp} base XP</strong>. Your
            streak multiplies that reward:
          </p>
          <div className="mt-3 space-y-2">
            {[1, 2, 3, 4, 5].map((mult) => {
              const needed = (mult - 1) * 5;
              const active = streakMultiplier === mult;
              const past = streakMultiplier > mult;
              return (
                <div
                  key={mult}
                  className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${
                    active
                      ? "border-streak/40 bg-streak/10"
                      : past
                        ? "border-success/30 bg-success/5 opacity-70"
                        : "border-border bg-muted/30"
                  }`}
                >
                  <span className="font-medium">
                    x{mult} — {needed}+ day streak
                  </span>
                  <span
                    className={`font-bold ${
                      active ? "text-streak" : past ? "text-success" : "text-muted-foreground"
                    }`}
                  >
                    {baseXp * mult} XP
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Per-habit XP chart */}
        {habitXpData.length > 0 && (
          <div className="rounded-2xl bg-card p-5 shadow-card">
            <h2 className="text-sm font-bold uppercase tracking-wide">
              XP by Habit
            </h2>
            <div className="mt-3 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={habitXpData} layout="vertical" margin={{ left: 0, right: 16 }}>
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={90}
                    tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "0.75rem",
                      fontSize: 12,
                      color: "var(--color-foreground)",
                    }}
                  />
                  <Bar dataKey="xp" radius={[0, 6, 6, 0]} barSize={18}>
                    {habitXpData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={
                          i === 0
                            ? "var(--color-streak)"
                            : "var(--color-primary)"
                        }
                        fillOpacity={1 - i * 0.12}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Upcoming unlocks */}
        <div className="rounded-2xl bg-card p-5 shadow-card">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wide">
              Upcoming Unlocks
            </h2>
            <Link
              to="/"
              search={{ tab: "rewards" }}
              className="inline-flex items-center gap-0.5 text-xs font-semibold text-primary transition active:opacity-70"
            >
              Rewards <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {upcomingThemes.length > 0 && (
            <div className="mt-3">
              <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Themes
              </p>
              <div className="space-y-2">
                {upcomingThemes.map((th) => (
                  <MilestoneItem
                    key={th.id}
                    level={th.unlockLevel}
                    name={th.name}
                    unlocked={ownedThemes.includes(th.id)}
                    isNext={th.unlockLevel === level + 1 || th.unlockLevel === level + 2}
                  />
                ))}
              </div>
            </div>
          )}

          {upcomingColors.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Tag Colors
              </p>
              <div className="space-y-2">
                {upcomingColors.map((tc) => (
                  <div
                    key={tc.value}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card/60 px-3 py-2.5 opacity-70"
                  >
                    <div
                      className="h-6 w-6 shrink-0 rounded-full border border-white/10"
                      style={{ backgroundColor: tc.value }}
                    />
                    <div>
                      <p className="text-sm font-semibold">{tc.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        Lvl {tc.unlockLevel} required
                      </p>
                    </div>
                    <Lock className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {upcomingThemes.length === 0 && upcomingColors.length === 0 && (
            <p className="mt-3 text-sm text-muted-foreground">
              You have unlocked everything! You are a true habit master.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
