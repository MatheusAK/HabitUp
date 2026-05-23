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
  { id: "aurora", name: "Aurora", unlockLevel: 11 },
  { id: "nebula", name: "Nebula", unlockLevel: 14 },
  { id: "solar", name: "Solar", unlockLevel: 17 },
  { id: "prism", name: "Prism", unlockLevel: 20 },
];

export const TAGS: Tag[] = [
  { id: "health", label: "Health", color: "#34d399", unlockLevel: 1 },
  { id: "focus", label: "Focus", color: "#818cf8", unlockLevel: 1 },
  { id: "mind", label: "Mind", color: "#f472b6", unlockLevel: 1 },
  { id: "fitness", label: "Fitness", color: "#fb7185", unlockLevel: 1 },
  { id: "creative", label: "Creative", color: "#fbbf24", unlockLevel: 1 },
  { id: "legend", label: "Legend", color: "#a78bfa", unlockLevel: 1 },
];

export interface TagColor {
  value: string;
  name: string;
  unlockLevel: number;
}

export const TAG_COLORS: TagColor[] = [
  { value: "#34d399", name: "Mint", unlockLevel: 1 },
  { value: "#818cf8", name: "Indigo", unlockLevel: 1 },
  { value: "#f472b6", name: "Pink", unlockLevel: 1 },
  { value: "#fb7185", name: "Rose", unlockLevel: 2 },
  { value: "#fbbf24", name: "Amber", unlockLevel: 3 },
  { value: "#60a5fa", name: "Sky", unlockLevel: 4 },
  { value: "#a78bfa", name: "Violet", unlockLevel: 5 },
  { value: "#2dd4bf", name: "Teal", unlockLevel: 6 },
  { value: "#f87171", name: "Coral", unlockLevel: 7 },
  { value: "#c084fc", name: "Orchid", unlockLevel: 9 },
  { value: "#facc15", name: "Sun", unlockLevel: 12 },
  { value: "#22d3ee", name: "Cyan", unlockLevel: 15 },
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
    const iso = d.toISOString().slice(0, 10);
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
