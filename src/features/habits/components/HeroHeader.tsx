import { Flame, Settings as SettingsIcon, Trophy } from "lucide-react";
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

  return (
    <header className="relative overflow-hidden rounded-b-[2rem] bg-gradient-hero px-5 pb-6 pt-10 text-primary-foreground shadow-glow">
      <div className="flex items-center justify-between">
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
          <div className="flex flex-col items-end">
            <div className="inline-flex items-center gap-1 rounded-full bg-black/20 px-2.5 py-1 text-xs font-semibold">
              <Trophy className="h-3.5 w-3.5" /> Lvl {mounted ? level : "—"}
            </div>
            <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-black/20 px-2.5 py-1 text-xs font-semibold">
              <Flame className="h-3.5 w-3.5" /> {mounted ? `${overallStreak}d` : "—"}
            </div>
          </div>
        </div>
      </div>

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
