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
    <header className="relative overflow-hidden rounded-b-[1.5rem] bg-gradient-hero px-4 pb-4 pt-6 text-primary-foreground">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-white/70">
              {weekday}
            </p>
            <h1 className="text-xl font-bold tracking-tight">{t.greeting}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 rounded-full bg-white/15 px-2 py-1">
              <Trophy className="h-3 w-3 text-yellow-200/90" />
              <span className="text-xs font-bold">{mounted ? level : "—"}</span>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-black/20 px-2 py-1">
              <Flame className="h-3 w-3 text-orange-300" />
              <span className="text-xs font-bold">{mounted ? overallStreak : "—"}</span>
            </div>
          </div>
          <button
            onClick={onSettingsClick}
            className="rounded-full bg-white/10 p-1.5 text-white/80 transition hover:bg-white/20 active:scale-95"
            aria-label={t.settingsTitle}
          >
            <SettingsIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {mounted && <DayBar selectedDate={selectedDate} onSelectDate={onSelectDate} />}

      <div className="mt-3">
        <div className="flex items-center justify-between text-[11px] text-white/80">
          <span className="flex items-center gap-1 font-medium">
            <Zap className="h-3 w-3 text-yellow-300/90" />
            {mounted ? `${xpIntoLevel}/${xpNeeded} XP` : "— XP"}
          </span>
          <span className="font-medium">{mounted ? t.doneToday(completedToday, totalHabits) : "\u00a0"}</span>
        </div>
        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-black/25">
          <div
            className="h-full rounded-full bg-white/80 transition-all duration-700"
            style={{ width: `${mounted ? Math.max(2, progress * 100) : 2}%` }}
          />
        </div>
      </div>
    </header>
  );
}
