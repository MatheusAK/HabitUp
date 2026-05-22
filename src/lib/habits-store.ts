import { useSyncExternalStore } from "react";

export type HabitFrequency = "daily" | "once";

export interface Habit {
  id: string;
  title: string;
  emoji: string;
  frequency: HabitFrequency;
  endDate?: string; // ISO date (YYYY-MM-DD), optional
  createdAt: string;
  completions: string[]; // ISO dates completed
  tagIds: string[];
  xpLog?: Record<string, number>; // xp awarded per completion date
}

export interface Tag {
  id: string;
  label: string;
  color: string; // oklch or hex
  unlockLevel: number;
}

export interface Theme {
  id: string;
  name: string;
  unlockLevel: number;
}

export interface State {
  habits: Habit[];
  xp: number;
  ownedThemes: string[];
  ownedTags: string[];
  customTags: Tag[];
  activeTheme: string;
  devMode: boolean;
}

export const THEMES: Theme[] = [
  { id: "midnight", name: "Midnight", unlockLevel: 1 },
  { id: "sunset", name: "Sunset", unlockLevel: 3 },
  { id: "forest", name: "Forest", unlockLevel: 5 },
  { id: "candy", name: "Candy", unlockLevel: 8 },
];

export const TAGS: Tag[] = [
  { id: "health", label: "Health", color: "#34d399", unlockLevel: 1 },
  { id: "focus", label: "Focus", color: "#818cf8", unlockLevel: 1 },
  { id: "mind", label: "Mind", color: "#f472b6", unlockLevel: 2 },
  { id: "fitness", label: "Fitness", color: "#fb7185", unlockLevel: 4 },
  { id: "creative", label: "Creative", color: "#fbbf24", unlockLevel: 6 },
  { id: "legend", label: "Legend", color: "#a78bfa", unlockLevel: 10 },
];

const STORAGE_KEY = "habit-tracker-v1";

const DEFAULT_STATE: State = {
  habits: [],
  xp: 0,
  ownedThemes: ["midnight"],
  ownedTags: ["health", "focus"],
  customTags: [],
  activeTheme: "midnight",
  devMode: false,
};

let state: State = loadInitial();
const listeners = new Set<() => void>();

function loadInitial(): State {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATE;
  }
}

function persist() {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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

export const todayISO = () => new Date().toISOString().slice(0, 10);

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
  if (!set.has(d.toISOString().slice(0, 10))) {
    d.setDate(d.getDate() - 1);
  }
  while (set.has(d.toISOString().slice(0, 10))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export function bestStreakOverall(habits: Habit[]): number {
  return habits.reduce((m, h) => Math.max(m, computeStreak(h)), 0);
}

// --- actions ---

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
      const updated = { ...h, completions: [...h.completions, today] };
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
 */
export function resetXpIfStreakBroken() {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const todayStr = today.toISOString().slice(0, 10);
  const yStr = yesterday.toISOString().slice(0, 10);

  const anyRecent = state.habits.some(
    (h) => h.completions.includes(todayStr) || h.completions.includes(yStr),
  );
  const hasHistory = state.habits.some((h) => h.completions.length > 0);

  if (hasHistory && !anyRecent && state.xp > 0) {
    setState((s) => ({
      ...s,
      xp: 0,
      habits: s.habits.map((h) => ({ ...h, xpLog: {} })),
    }));
  }
}
