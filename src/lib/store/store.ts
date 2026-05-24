import { useSyncExternalStore } from "react";
import type { State, Habit } from "./types";
import { DEFAULT_STATE, STORAGE_KEY } from "./constants";
import { todayISO, computeStreak, toLocalISO } from "./utils";

let state: State = loadInitial();
const listeners = new Set<() => void>();

function loadInitial(): State {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    // Merge with defaults so newly added top-level fields don't wipe history.
    const merged: State = { ...DEFAULT_STATE, ...parsed };
    // Defensive normalization: guarantee every habit has a deduped
    // completions array. This protects against any older record that may
    // have stored a different shape (e.g. boolean `completed`) and prevents
    // accidental duplicates.
    merged.habits = (merged.habits ?? []).map((h: Habit) => ({
      ...h,
      completions: Array.from(new Set(h.completions ?? [])).sort(),
      xpLog: h.xpLog ?? {},
      tagIds: h.tagIds ?? [],
      scheduledDays: h.scheduledDays ?? [],
    }));
    return merged;
  } catch {
    return DEFAULT_STATE;
  }
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    // Storage may be full or blocked (Safari private mode, etc).
    // We log instead of throwing so a transient persist failure never
    // corrupts in-memory state or interrupts the user's interaction.
    console.warn("[habit-tracker] failed to persist state", err);
  }
}

function notify() {
  persist();
  listeners.forEach((l) => l());
}

function setState(updater: (s: State) => State) {
  state = updater(state);
  notify();
}

export function useStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => selector(state),
    () => selector(state),
  );
}

export function addHabit(input: Omit<Habit, "id" | "createdAt" | "completions">) {
  setState((s) => ({
    ...s,
    habits: [
      ...s.habits,
      { ...input, id: crypto.randomUUID(), createdAt: todayISO(), completions: [] },
    ],
  }));
}

export function updateHabit(id: string, patch: Partial<Habit>) {
  setState((s) => ({
    ...s,
    habits: s.habits.map((h) => (h.id === id ? { ...h, ...patch } : h)),
  }));
}

export function deleteHabit(id: string) {
  setState((s) => ({ ...s, habits: s.habits.filter((h) => h.id !== id) }));
}

export function toggleComplete(id: string): number {
  const today = todayISO();
  let xpDelta = 0;
  setState((s) => {
    const habits = s.habits.map((h) => {
      if (h.id !== id) return h;
      const done = h.completions.includes(today);
      if (done) {
        // Un-check: remove today's date and refund the XP that was awarded
        // for it. Past completion dates are never touched.
        const awarded = h.xpLog?.[today] ?? 0;
        xpDelta = -awarded;
        const nextLog = { ...(h.xpLog ?? {}) };
        delete nextLog[today];
        return {
          ...h,
          completions: h.completions.filter((d) => d !== today),
          xpLog: nextLog,
        };
      }
      // Check: append today's date. Use a Set to guarantee no duplicates
      // even if some stale state ever contained one. We do NOT mutate the
      // existing array — we build a new one for proper React updates.
      const nextCompletions = Array.from(
        new Set([...h.completions, today]),
      ).sort();
      const updated: Habit = { ...h, completions: nextCompletions };
      const streak = computeStreak(updated);
      xpDelta = 10 + (streak > 1 ? Math.min(streak * 2, 30) : 0);
      return { ...updated, xpLog: { ...(h.xpLog ?? {}), [today]: xpDelta } };
    });
    return { ...s, habits, xp: Math.max(0, s.xp + xpDelta) };
  });
  return xpDelta;
}

export function setActiveTheme(id: string) {
  setState((s) => ({ ...s, activeTheme: id }));
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", id);
  }
}

export function unlockTheme(id: string) {
  setState((s) =>
    s.ownedThemes.includes(id) ? s : { ...s, ownedThemes: [...s.ownedThemes, id] },
  );
}

export function unlockTag(id: string) {
  setState((s) =>
    s.ownedTags.includes(id) ? s : { ...s, ownedTags: [...s.ownedTags, id] },
  );
}

export function addCustomTag(label: string, color: string) {
  const id = "custom_" + crypto.randomUUID();
  setState((s) => ({
    ...s,
    customTags: [...s.customTags, { id, label, color, unlockLevel: 1 }],
  }));
}

export function deleteCustomTag(id: string) {
  setState((s) => ({
    ...s,
    customTags: s.customTags.filter((t) => t.id !== id),
    habits: s.habits.map((h) => ({
      ...h,
      tagIds: h.tagIds.filter((tid) => tid !== id),
    })),
  }));
}

export function applyActiveThemeOnce() {
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", state.activeTheme);
  }
}

/**
 * If the user broke their streak (no completion today or yesterday across
 * all habits), reset XP and per-habit xp logs to zero.
 *
 * IMPORTANT: this ONLY clears `xp` and `xpLog`. It never touches the
 * `completions` arrays — historical completion dates are sacred and must
 * persist forever so the day-bar history and past streaks stay correct.
 */
export function resetXpIfStreakBroken() {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const todayStr = toLocalISO(today);
  const yStr = toLocalISO(yesterday);

  const anyRecent = state.habits.some(
    (h) => h.completions.includes(todayStr) || h.completions.includes(yStr),
  );
  const hasHistory = state.habits.some((h) => h.completions.length > 0);

  if (hasHistory && !anyRecent && state.xp > 0) {
    setState((s) => ({
      ...s,
      xp: 0,
      habits: s.habits.map((h) => ({ ...h, xpLog: {} })),
      // Note: h.completions is intentionally preserved.
    }));
  }
}

export function setDevMode(on: boolean) {
  setState((s) => ({ ...s, devMode: on }));
}

export function addXp(delta: number) {
  setState((s) => ({ ...s, xp: Math.max(0, s.xp + delta) }));
}

export function resetAllData() {
  setState(() => ({ ...DEFAULT_STATE }));
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", "midnight");
  }
}
