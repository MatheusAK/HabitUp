export type HabitFrequency = "daily" | "once";

export interface Habit {
  id: string;
  title: string;
  emoji: string;
  frequency: HabitFrequency;
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
