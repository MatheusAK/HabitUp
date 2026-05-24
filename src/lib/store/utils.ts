import type { Habit } from "./types";

/**
 * Returns today's date in the user's LOCAL timezone as YYYY-MM-DD.
 *
 * IMPORTANT: We deliberately avoid `Date#toISOString()` here because it
 * formats in UTC. On mobile devices in non-UTC timezones, a completion made
 * late at night local time would be stored under tomorrow's UTC date, which
 * looks to the user like their history was lost or their streak reset when
 * they reopen the app the next morning. Using local components keeps the
 * "day" boundary aligned with the user's perception of a day.
 */
export const todayISO = () => toLocalISO(new Date());

export function toLocalISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function levelFromXp(xp: number) {
  // each level needs progressively more xp: total to reach level L = 50 * L * (L-1)
  let level = 1;
  while (50 * level * (level + 1) <= xp) level++;
  const currentLevelXp = 50 * (level - 1) * level;
  const nextLevelXp = 50 * level * (level + 1);
  return {
    level,
    currentLevelXp,
    nextLevelXp,
    progress: (xp - currentLevelXp) / (nextLevelXp - currentLevelXp),
  };
}

export function computeStreak(habit: Habit): number {
  if (habit.completions.length === 0) return 0;
  const set = new Set(habit.completions);
  let streak = 0;
  const d = new Date();
  // start from today; if not done today, start from yesterday so streak isn't broken at start of day
  if (!set.has(toLocalISO(d))) {
    d.setDate(d.getDate() - 1);
  }
  while (set.has(toLocalISO(d))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export function bestStreakOverall(habits: Habit[]): number {
  return habits.reduce((m, h) => Math.max(m, computeStreak(h)), 0);
}

/**
 * Last `count` days (oldest -> newest) with completion status.
 * `allDone` is true when at least one daily habit existed on that date
 * and every such habit was completed.
 */
export function lastDaysStatus(
  habits: Habit[],
  count = 7,
): { date: string; allDone: boolean; partial: boolean }[] {
  const out: { date: string; allDone: boolean; partial: boolean }[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const iso = toLocalISO(d);
    const eligible = habits.filter(
      (h) => h.frequency === "daily" && h.createdAt <= iso,
    );
    const done = eligible.filter((h) => h.completions.includes(iso)).length;
    out.push({
      date: iso,
      allDone: eligible.length > 0 && done === eligible.length,
      partial: done > 0 && done < eligible.length,
    });
  }
  return out;
}
