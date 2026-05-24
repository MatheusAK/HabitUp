export type HabitFrequency = "daily" | "specific" | "once";

export interface Habit {
  id: string;
  title: string;
  emoji: string;
  frequency: HabitFrequency;
  /** Only used when frequency === "specific". Array of weekday numbers (0=Sun … 6=Sat). */
  scheduledDays?: number[];
  endDate?: string;
  createdAt: string;
  completions: string[];
  tagIds: string[];
  xpLog?: Record<string, number>;
}

export interface Tag {
  id: string;
  label: string;
  color: string;
  unlockLevel: number;
}

export interface Theme {
  id: string;
  name: string;
  unlockLevel: number;
}

export interface TagColor {
  value: string;
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
