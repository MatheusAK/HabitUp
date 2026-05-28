import type { Tag, TagColor, Theme, State } from "./types";

export const STORAGE_KEY = "habit-tracker-v1";

export const THEMES: Theme[] = [
  { id: "midnight", name: "Midnight", unlockLevel: 1 },
  { id: "sunset", name: "Sunset", unlockLevel: 3 },
  { id: "forest", name: "Forest", unlockLevel: 5 },
  { id: "candy", name: "Candy", unlockLevel: 7 },
  { id: "aurora", name: "Aurora", unlockLevel: 9 },
  { id: "nebula", name: "Nebula", unlockLevel: 11 },
  { id: "solar", name: "Solar", unlockLevel: 13 },
  { id: "prism", name: "Prism", unlockLevel: 15 },
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

export const THEME_GRADIENTS: Record<string, string> = {
  midnight: "linear-gradient(135deg, oklch(0.55 0.19 295), oklch(0.48 0.15 260))",
  sunset:   "linear-gradient(135deg, oklch(0.55 0.17 40), oklch(0.48 0.2 20))",
  forest:   "linear-gradient(135deg, oklch(0.48 0.14 195), oklch(0.50 0.16 145))",
  candy:    "linear-gradient(135deg, oklch(0.55 0.18 340), oklch(0.52 0.1 260))",
  aurora:   "linear-gradient(135deg, oklch(0.38 0.16 255), oklch(0.42 0.12 200))",
  nebula:   "linear-gradient(135deg, oklch(0.48 0.20 305), oklch(0.40 0.11 278))",
  solar:    "linear-gradient(135deg, oklch(0.60 0.14 75), oklch(0.54 0.16 55))",
  prism:    "linear-gradient(135deg, oklch(0.52 0.18 320), oklch(0.48 0.15 185), oklch(0.52 0.16 60))",
};

export const DEFAULT_STATE: State = {
  habits: [],
  xp: 0,
  ownedThemes: ["midnight"],
  ownedTags: ["health", "focus"],
  customTags: [],
  activeTheme: "midnight",
  devMode: false,
  locale: "en",
  claimedAchievements: [],
};
