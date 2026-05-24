export type { HabitFrequency, Habit, Tag, Theme, TagColor, State } from "./types";
export { THEMES, TAGS, TAG_COLORS, DEFAULT_STATE, STORAGE_KEY } from "./constants";
export {
  todayISO,
  toLocalISO,
  levelFromXp,
  computeStreak,
  bestStreakOverall,
  lastDaysStatus,
} from "./utils";
export {
  useStore,
  addHabit,
  updateHabit,
  deleteHabit,
  toggleComplete,
  setActiveTheme,
  unlockTheme,
  unlockTag,
  addCustomTag,
  deleteCustomTag,
  applyActiveThemeOnce,
  resetXpIfStreakBroken,
  setDevMode,
  addXp,
  resetAllData,
} from "./store";
