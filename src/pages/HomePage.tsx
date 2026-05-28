import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import {
  applyActiveThemeOnce,
  computeOverallStreak,
  isHabitScheduledFor,
  levelFromXp,
  resetXpIfStreakBroken,
  todayISO,
  useStore,
  type Habit,
} from "@/lib/habits-store";
import { HeroHeader } from "@/features/habits/components/HeroHeader";
import { TabBar, type Tab } from "@/features/habits/components/TabBar";
import { HabitList } from "@/features/habits/components/HabitList";
import { HabitForm } from "@/features/habits/components/HabitForm";
import { StatsView } from "@/features/stats/components/StatsView";
import { RewardsShop } from "@/features/rewards/components/RewardsShop";
import { SettingsDialog } from "@/features/settings/components/SettingsDialog";

export function HomePage() {
  const habits = useStore((s) => s.habits);
  const xp = useStore((s) => s.xp);
  const locale = useStore((s) => s.locale);
  const [tab, setTab] = useState<Tab>("today");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Habit | null>(null);
  const [mounted, setMounted] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  // The day the user is viewing. Defaults to today, but can be moved
  // forwards or backwards via the DayBar to review or pre-plan habits.
  const [selectedDate, setSelectedDate] = useState<string>(() => todayISO());

  useEffect(() => {
    applyActiveThemeOnce();
    resetXpIfStreakBroken();
    setMounted(true);
  }, []);

  const today = todayISO();
  const selDateObj = mounted ? new Date(selectedDate + "T00:00:00") : new Date();
  const weekday = mounted
    ? selDateObj.toLocaleDateString(locale, { weekday: "long" })
    : "";

  const { level, progress, currentLevelXp, nextLevelXp } = levelFromXp(xp);
  const overallStreak = computeOverallStreak(habits);

  // Filter habits visible on the selected date. Uses the same scheduling
  // rules as the rest of the app via isHabitScheduledFor, plus a special
  // case for "once" habits (only show on the date they were completed,
  // or on today if still pending).
  const visibleHabits = useMemo(
    () =>
      habits.filter((h) => {
        if (h.frequency === "once") {
          if (selectedDate === today) {
            // Show today if not completed, or if it was completed today.
            return (
              !h.completions.includes(today) ||
              h.completions[h.completions.length - 1] === today
            );
          }
          // On any other date, only show if it was completed that day.
          return h.completions.includes(selectedDate);
        }
        return isHabitScheduledFor(h, selectedDate);
      }),
    [habits, selectedDate, today],
  );

  const completedOnDate = habits.filter((h) =>
    h.completions.includes(selectedDate),
  ).length;
  const scheduledOnDate = habits.filter((h) =>
    isHabitScheduledFor(h, selectedDate),
  ).length;
  const totalHabits = scheduledOnDate || habits.length;

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-md pb-32">
      <div className="animated-bg" aria-hidden="true" />

      <HeroHeader
        weekday={weekday}
        level={level}
        mounted={mounted}
        overallStreak={overallStreak}
        xp={xp}
        currentLevelXp={currentLevelXp}
        nextLevelXp={nextLevelXp}
        progress={progress}
        completedToday={completedOnDate}
        totalHabits={totalHabits}
        onSettingsClick={() => setSettingsOpen(true)}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      <TabBar tab={tab} onTabChange={setTab} />

      <main className="mt-6 px-5">
        {tab === "today" ? (
          <HabitList
            mounted={mounted}
            visibleHabits={visibleHabits}
            selectedDate={selectedDate}
            onEdit={(h) => {
              setEditing(h);
              setFormOpen(true);
            }}
          />
        ) : tab === "stats" ? (
          <StatsView />
        ) : (
          <RewardsShop />
        )}
      </main>

      {tab === "today" && (
        <button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          className="fixed bottom-6 left-1/2 z-20 inline-flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-gradient-hero text-primary-foreground shadow-glow transition active:scale-95"
          aria-label="New habit"
        >
          <Plus className="h-7 w-7" strokeWidth={2.5} />
        </button>
      )}

      <HabitForm open={formOpen} onOpenChange={setFormOpen} editing={editing} />
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      <Toaster position="top-center" />
    </div>
  );
}
