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
              <span className="text-sm font-bold">{mounted ? level : 

      {mounted && <DayBar />}

      <div className="mt-5">
        <div className="flex items-end justify-between text-xs">
          <span className="opacity-80">
            {mounted ? `${xp - currentLevelXp} XP` : "— XP"}
          </span>
          <span className="opacity-80">
            {mounted ? `${nextLevelXp - currentLevelXp} XP` : "— XP"}
          </span>
        </div>
        <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-black/25">
          <div
            className="h-full rounded-full bg-white/90 transition-all duration-500"
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
