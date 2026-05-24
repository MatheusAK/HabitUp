import type { Tag, TagColor, Theme, State } from "./types";

export const STORAGE_KEY = "habit-tracker-v1";

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

export const DEFAULT_STATE: State = {
  habits: [],
  xp: 0,
  ownedThemes: ["midnight"],
  ownedTags: ["health", "focus"],
  customTags: [],
  activeTheme: "midnight",
  devMode: false,
};
