import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Flame, Plus, Sparkles, Trophy } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { HabitCard } from "@/components/habit-card";
import { HabitForm } from "@/components/habit-form";
import { RewardsShop } from "@/components/rewards-shop";
import {
  applyActiveThemeOnce,
  bestStreakOverall,
  levelFromXp,
  todayISO,
  useStore,
  type Habit,
} from "@/lib/habits-store";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Streaks — Habit Tracker" },
      { name: "description", content: "Build daily habits, earn XP, level up, and unlock new styles." },
    ],
  }),
});

type Tab = "today" | "rewards";

function Index() {
  const habits = useStore((s) => s.habits);
  const xp = useStore((s) => s.xp);
  const [tab, setTab] = useState<Tab>("today");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Habit | null>(null);
  const [weekday, setWeekday] = useState("");

  useEffect(() => {
    applyActiveThemeOnce();
    setWeekday(
      new Date().toLocaleDateString(undefined, { weekday: "long" }),
    );
  }, []);

  const { level, progress, currentLevelXp, nextLevelXp } = levelFromXp(xp);
  const overallStreak = bestStreakOverall(habits);
  const today = todayISO();
  const visibleHabits = useMemo(
    () =>
      habits.filter((h) => {
        if (h.frequency === "once") {
          return !h.completions.includes(today) || h.completions[h.completions.length - 1] === today;
        }
        return true;
      }),
    [habits, today],
  );
  const completedToday = habits.filter((h) => h.completions.includes(today)).length;

  return (
    <div className="mx-auto min-h-screen w-full max-w-md bg-background pb-32">
      {/* Hero */}
      <header className="relative overflow-hidden rounded-b-[2rem] bg-gradient-hero px-5 pb-6 pt-10 text-primary-foreground shadow-glow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] opacity-80">
              {weekday}
            </p>
            <h1 className="mt-1 text-2xl font-bold">Hey there 👋</h1>
          </div>
          <div className="flex flex-col items-end">
            <div className="inline-flex items-center gap-1 rounded-full bg-black/20 px-2.5 py-1 text-xs font-semibold">
              <Trophy className="h-3.5 w-3.5" /> Lvl {level}
            </div>
            <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-black/20 px-2.5 py-1 text-xs font-semibold">
              <Flame className="h-3.5 w-3.5" /> {overallStreak}d
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-end justify-between text-xs">
            <span className="opacity-80">{xp - currentLevelXp} XP</span>
            <span className="opacity-80">{nextLevelXp - currentLevelXp} XP</span>
          </div>
          <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-black/25">
            <div
              className="h-full rounded-full bg-white/90 transition-all duration-500"
              style={{ width: `${Math.max(4, progress * 100)}%` }}
            />
          </div>
          <p className="mt-2 text-xs opacity-90">
            {completedToday}/{habits.filter((h) => h.frequency === "daily").length || habits.length} done today
          </p>
        </div>
      </header>

      {/* Tabs */}
      <div className="sticky top-0 z-10 -mt-4 px-5">
        <div className="flex rounded-full bg-card p-1 shadow-card">
          {(["today", "rewards"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 rounded-full px-3 py-2 text-sm font-semibold capitalize transition ${
                tab === t
                  ? "bg-gradient-hero text-primary-foreground shadow-glow"
                  : "text-muted-foreground"
              }`}
            >
              {t === "today" ? "Habits" : "Rewards"}
            </button>
          ))}
        </div>
      </div>

      <main className="mt-6 px-5">
        {tab === "today" ? (
          <div className="space-y-3">
            {visibleHabits.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center">
                <Sparkles className="mx-auto h-8 w-8 text-primary" />
                <p className="mt-3 font-semibold">No habits yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tap the + button to create your first habit and start a streak.
                </p>
              </div>
            ) : (
              visibleHabits.map((h) => (
                <HabitCard
                  key={h.id}
                  habit={h}
                  onEdit={() => {
                    setEditing(h);
                    setFormOpen(true);
                  }}
                  onCompleted={(delta) => {
                    toast.success(`+${delta} XP`, {
                      description: "Keep that streak alive 🔥",
                    });
                  }}
                />
              ))
            )}
          </div>
        ) : (
          <RewardsShop />
        )}
      </main>

      {/* FAB */}
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
      <Toaster position="top-center" />
    </div>
  );
}
