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
    <header className="relative overflow-hidden rounded-b-[2rem] bg-gradient-hero px-5 pb-6 pt-10 text-primary-foreground">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] opacity-70">
            {weekday}
          </p>
          <h1 className="mt-0.5 text-[1.6rem] font-bold tracking-tight">{t.greeting}</h1>
        </div>

        <div className="flex items-start gap-2">
          <button
            onClick={onSettingsClick}
            className="rounded-full bg-white/10 p-2 text-primary-foreground/80 transition hover:bg-white/20 active:scale-95"
            aria-label={t.settingsTitle}
          >
            <SettingsIcon className="h-4 w-4" />
          </button>

          <div className="flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5">
              <Trophy className="h-3.5 w-3.5 text-yellow-200/90" />
              <span className="text-sm font-bold">{mounted ? `Lvl ${level}` : "—"}</span>
            </div>
            <div className="inline-flex items-center gap-1 rounded-full bg-black/15 px-2.5 py-1 text-xs font-semibold">
              <Flame className="h-3 w-3" />
              {mounted ? `${overallStreak}d` : "—"}
            </div>
          </div>
        </div>
      </div>

      {mounted && <DayBar selectedDate={selectedDate} onSelectDate={onSelectDate} />}

      <div className="mt-5">
        <div className="flex items-center justify-between text-xs opacity-80">
          <span className="flex items-center gap-1 font-medium">
            <Zap className="h-3 w-3" />
            {mounted ? `${xpIntoLevel} / ${xpNeeded} XP` : "— XP"}
          </span>
          <span className="font-medium">{mounted ? t.doneToday(completedToday, totalHabits) : "\u00a0"}</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/20">
          <div
            className="h-full rounded-full bg-white/70 transition-all duration-700"
            style={{ width: `${mounted ? Math.max(2, progress * 100) : 2}%` }}
          />
        </div>
      </div>
    </header>
  );
}
