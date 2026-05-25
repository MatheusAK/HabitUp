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
  // each level needs progressively more xp: total to reach level L = 30 * L * (L-1)
  // lowered from 50 to 30 so players level up faster and feel progress sooner
  let level = 1;
  while (30 * level * (level + 1) <= xp) level++;
  const currentLevelXp = 30 * (level - 1) * level;
  const nextLevelXp = 30 * level * (level + 1);
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

  if (habit.frequency === "specific") {
    const scheduled = habit.scheduledDays ?? [];
    if (scheduled.length === 0) return 0;

    const d = new Date();

    // Walk back to find the most recent scheduled day
    let safety = 365;
    while (!scheduled.includes(d.getDay()) && safety-- > 0) {
      d.setDate(d.getDate() - 1);
    }

    // If that scheduled day isn't completed yet, step back to the previous
    // scheduled day (benefit of the doubt — same as daily habits give for today)
    if (!set.has(toLocalISO(d))) {
      do {
        d.setDate(d.getDate() - 1);
      } while (!scheduled.includes(d.getDay()) && safety-- > 0);
    }

    // Walk backwards: skip non-scheduled days, stop on a missed scheduled day
    let streak = 0;
    safety = 730;
    while (safety-- > 0) {
      const iso = toLocalISO(d);
      if (iso < habit.createdAt) break;
      if (scheduled.includes(d.getDay())) {
        if (!set.has(iso)) break; // missed a scheduled day — streak ends
        streak++;
      }
      d.setDate(d.getDate() - 1);
    }
    return streak;
  }

  // "daily" habits — original day-by-day logic
  let streak = 0;
  const d = new Date();
  if (!set.has(toLocalISO(d))) {
    d.setDate(d.getDate() - 1);
  }
  while (set.has(toLocalISO(d))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

/** @deprecated use computeOverallStreak */
export function bestStreakOverall(habits: Habit[]): number {
  return computeOverallStreak(habits);
}

/**
 * Counts consecutive days (ending today or yesterday) where EVERY habit
 * scheduled for that day was completed. Days with no scheduled habits are
 * skipped transparently and do not break the streak.
 */
export function computeOverallStreak(habits: Habit[]): number {
  if (habits.length === 0) return 0;

  // Earliest possible date to walk back to (oldest habit creation date).
  const oldestDate = habits.reduce(
    (min, h) => (h.createdAt < min ? h.createdAt : min),
    habits[0].createdAt,
  );

  const d = new Date();
  const todayIso = toLocalISO(d);

  // If today is not fully done yet, give benefit of the doubt and start
  // counting from yesterday (same convention as computeStreak for daily habits).
  const todayEligible = habits.filter((h) => isHabitScheduledFor(h, todayIso));
  const todayAllDone =
    todayEligible.length > 0 &&
    todayEligible.every((h) => h.completions.includes(todayIso));

  if (!todayAllDone) {
    d.setDate(d.getDate() - 1);
  }

  let streak = 0;
  let safety = 730;
  while (safety-- > 0) {
    const iso = toLocalISO(d);
    if (iso < oldestDate) break;

    const eligible = habits.filter((h) => isHabitScheduledFor(h, iso));

    if (eligible.length === 0) {
      // No habits existed or scheduled this day — skip without breaking.
      d.setDate(d.getDate() - 1);
      continue;
    }

    const allDone = eligible.every((h) => h.completions.includes(iso));
    if (!allDone) break;

    streak++;
    d.setDate(d.getDate() - 1);
  }

  return streak;
}

/**
 * Returns true when habit `h` is scheduled to appear on the calendar date
 * represented by ISO string `iso`. "once" habits are never counted as
 * eligible for a scheduled day.
 */
export function isHabitScheduledFor(h: Habit, iso: string): boolean {
  if (h.frequency === "once") return false;
  if (h.createdAt > iso) return false;
  if (h.frequency === "specific") {
    const dow = new Date(iso + "T00:00:00").getDay();
    return (h.scheduledDays ?? []).includes(dow);
  }
  // "daily"
  return true;
}

/**
 * Last `count` days (oldest -> newest) with completion status.
 * `allDone` is true when at least one scheduled habit existed on that date
 * and every such habit was completed. "specific" habits only count on their
 * scheduled weekdays.
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
    const eligible = habits.filter((h) => isHabitScheduledFor(h, iso));
    const done = eligible.filter((h) => h.completions.includes(iso)).length;
    out.push({
      date: iso,
      allDone: eligible.length > 0 && done === eligible.length,
      partial: done > 0 && done < eligible.length,
    });
  }
  return out;
}
