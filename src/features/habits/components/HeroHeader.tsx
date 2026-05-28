import { Flame, Settings as SettingsIcon, Trophy, Zap } from "lucide-react";
import { DayBar } from "./DayBar";
import { useLocale } from "@/lib/i18n";

interface HeroHeaderProps {
  weekday: string;
  level: number;
  mounted: boolean;
  overallStreak: number;
  xp: number;
  currentLevelXp: number;
  nextLevelXp: number;
  progress: number;
  completedToday: number;
  totalHabits: number;
  onSettingsClick: () => void;
  selectedDate: string;
  onSelectDate: (iso: string) => void;
}

export function HeroHeader({
  weekday,
  level,
  mounted,
  overallStreak,
  xp,
  currentLevelXp,
  nextLevelXp,
  progress,
  completedToday,
  totalHabits,
  onSettingsClick,
  selectedDate,
  onSelectDate,
}: HeroHeaderProps) {
  const t = useLocale();
  const xpIntoLevel = xp - currentLevelXp;
  const xpNeeded = nextLevelXp - currentLevelXp;

  return (
    <header className="relative overflow-hidden rounded-b-[2rem] bg-gradient-hero px-5 pb-6 pt-10 text-primary-foreground shadow-glow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] opacity-80">{weekday}</p>
          <h1 className="mt-1 text-2xl font-bold">{t.greeting}</h1>
        </div>
        <div className="flex items-start gap-2">
          <button
            onClick={onSettingsClick}
            className="rounded-full bg-black/20 p-2 text-primary-foreground transition active:scale-95"
            aria-label={t.settingsTitle}
          >
            <SettingsIcon className="h-4 w-4" />
          </button>
          <div className="flex flex-col items-end gap-1.5">
            {/* Prominent level badge */}
            <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 backdrop-blur-sm">
              <Trophy className="h-4 w-4 text-yellow-300" />
              <span className="text-sm font-bold">{mounted ? level : "—"}</span>
            </div>
            <div className="inline-flex items-center gap-1 rounded-full bg-black/20 px-2.5 py-1 text-xs font-semibold">
              <Flame className="h-3.5 w-3.5" /> {mounted ? `${overallStreak}d` : "—"}
            </div>
          </div>
        </div>
      </div>

      {mounted && <DayBar />}

      <div className="mt-5">
        {/* XP bar labels: current / needed with clearer formatting */}
        <div className="flex items-end justify-between text-xs">
          <span className="flex items-center gap-1 opacity-90">
            <Zap className="h-3 w-3" />
            {mounted ? `${xpIntoLevel} / ${xpNeeded} XP` : "— XP"}
          </span>
          <span className="opacity-80">
            {mounted ? `Lvl ${level + 1}` : "—"}
          </span>
        </div>
        {/* Thicker, more visible XP bar */}
        <div className="mt-2 h-3 overflow-hidden rounded-full bg-black/25">
          <div
            className="h-full rounded-full bg-gradient-to-r from-white/80 to-white transition-all duration-500"
            style={{ width: `${mounted ? Math.max(4, progress * 100) : 4}%` }}
          />
        </div>
        <p className="mt-2 text-xs opacity-90">
          {mounted ? t.doneToday(completedToday, totalHabits) : "\u00a0"}
        </p>
      </div>
    </header>
  );
}
