import type { State } from "@/lib/store/types";
import { TAG_COLORS } from "@/lib/store/constants";
import { computeOverallStreak } from "@/lib/store/utils";

export type Difficulty = "easy" | "medium" | "hard";

export interface Achievement {
  id: string;
  name: { en: string; "pt-BR": string };
  difficulty: Difficulty;
  xp: number;
  check: (s: State, level: number) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  // ── Easy ──────────────────────────────────────────────────────────────
  {
    id: "first_habit",
    difficulty: "easy",
    xp: 10,
    name: { en: "Create your first Habit", "pt-BR": "Crie seu primeiro hábito" },
    check: (s) => s.habits.length >= 1,
  },
  {
    id: "three_habits",
    difficulty: "easy",
    xp: 25,
    name: { en: "Create 3 Habits", "pt-BR": "Crie 3 hábitos" },
    check: (s) => s.habits.length >= 3,
  },
  {
    id: "first_tag",
    difficulty: "easy",
    xp: 15,
    name: { en: "Create a new Tag", "pt-BR": "Crie uma nova tag" },
    check: (s) => s.customTags.length >= 1,
  },
  {
    id: "unlock_3_colors",
    difficulty: "easy",
    xp: 25,
    name: { en: "Unlock 3 tag colors", "pt-BR": "Desbloqueie 3 cores de tag" },
    check: (_s, level) => TAG_COLORS.filter((c) => level >= c.unlockLevel).length >= 3,
  },
  {
    id: "streak_3",
    difficulty: "easy",
    xp: 25,
    name: { en: "Achieve a 3-day streak", "pt-BR": "Alcance uma sequência de 3 dias" },
    check: (s) => computeOverallStreak(s.habits) >= 3,
  },

  // ── Medium ────────────────────────────────────────────────────────────
  {
    id: "unlock_5_colors",
    difficulty: "medium",
    xp: 40,
    name: { en: "Unlock 5 tag colors", "pt-BR": "Desbloqueie 5 cores de tag" },
    check: (_s, level) => TAG_COLORS.filter((c) => level >= c.unlockLevel).length >= 5,
  },
  {
    id: "streak_5",
    difficulty: "medium",
    xp: 40,
    name: { en: "Achieve a 5-day streak", "pt-BR": "Alcance uma sequência de 5 dias" },
    check: (s) => computeOverallStreak(s.habits) >= 5,
  },
  {
    id: "new_theme",
    difficulty: "medium",
    xp: 40,
    name: {
      en: "Equip a new theme from the Theme Shop",
      "pt-BR": "Equipe um novo tema da loja",
    },
    check: (s) => s.activeTheme !== "midnight",
  },
  {
    id: "unlock_3_themes",
    difficulty: "medium",
    xp: 50,
    name: { en: "Unlock 3 themes", "pt-BR": "Desbloqueie 3 temas" },
    check: (s) => s.ownedThemes.length >= 3,
  },
  {
    id: "streak_10",
    difficulty: "medium",
    xp: 75,
    name: { en: "Achieve a 10-day streak", "pt-BR": "Alcance uma sequência de 10 dias" },
    check: (s) => computeOverallStreak(s.habits) >= 10,
  },

  // ── Hard ──────────────────────────────────────────────────────────────
  {
    id: "unlock_5_themes",
    difficulty: "hard",
    xp: 75,
    name: { en: "Unlock 5 themes", "pt-BR": "Desbloqueie 5 temas" },
    check: (s) => s.ownedThemes.length >= 5,
  },
  {
    id: "unlock_7_themes",
    difficulty: "hard",
    xp: 100,
    name: { en: "Unlock 7 themes", "pt-BR": "Desbloqueie 7 temas" },
    check: (s) => s.ownedThemes.length >= 7,
  },
  {
    id: "prism_theme",
    difficulty: "hard",
    xp: 125,
    name: { en: "Equip the Prism Theme", "pt-BR": "Equipe o tema Prism" },
    check: (s) => s.activeTheme === "prism",
  },
  {
    id: "streak_30",
    difficulty: "hard",
    xp: 150,
    name: { en: "Achieve a 30-day streak", "pt-BR": "Alcance uma sequência de 30 dias" },
    check: (s) => computeOverallStreak(s.habits) >= 30,
  },
];

export const DIFFICULTY_ORDER: Difficulty[] = ["easy", "medium", "hard"];
