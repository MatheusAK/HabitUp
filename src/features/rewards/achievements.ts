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

/** Total number of completions logged across all habits. */
function totalCompletions(s: State): number {
  return s.habits.reduce((sum, h) => sum + h.completions.length, 0);
}

export const ACHIEVEMENTS: Achievement[] = [
  // ── Easy ──────────────────────────────────────────────────────────────
  {
    id: "first_habit",
    difficulty: "easy",
    xp: 30,
    name: { en: "Create your first Habit", "pt-BR": "Crie seu primeiro hábito" },
    check: (s) => s.habits.length >= 1,
  },
  {
    id: "three_habits",
    difficulty: "easy",
    xp: 60,
    name: { en: "Create 3 Habits", "pt-BR": "Crie 3 hábitos" },
    check: (s) => s.habits.length >= 3,
  },
  {
    id: "first_tag",
    difficulty: "easy",
    xp: 40,
    name: { en: "Create a new Tag", "pt-BR": "Crie uma nova tag" },
    check: (s) => s.customTags.length >= 1,
  },
  {
    id: "unlock_3_colors",
    difficulty: "easy",
    xp: 60,
    name: { en: "Unlock 3 tag colors", "pt-BR": "Desbloqueie 3 cores de tag" },
    check: (_s, level) => TAG_COLORS.filter((c) => level >= c.unlockLevel).length >= 3,
  },
  {
    id: "streak_3",
    difficulty: "easy",
    xp: 60,
    name: { en: "Achieve a 3-day streak", "pt-BR": "Alcance uma sequência de 3 dias" },
    check: (s) => computeOverallStreak(s.habits) >= 3,
  },
  {
    id: "first_completion",
    difficulty: "easy",
    xp: 30,
    name: { en: "Complete your first Habit", "pt-BR": "Complete seu primeiro hábito" },
    check: (s) => totalCompletions(s) >= 1,
  },
  {
    id: "ten_completions",
    difficulty: "easy",
    xp: 60,
    name: { en: "Complete 10 Habits total", "pt-BR": "Complete 10 hábitos no total" },
    check: (s) => totalCompletions(s) >= 10,
  },
  {
    id: "reach_level_2",
    difficulty: "easy",
    xp: 50,
    name: { en: "Reach Level 2", "pt-BR": "Alcance o nível 2" },
    check: (_s, level) => level >= 2,
  },

  // ── Medium ────────────────────────────────────────────────────────────
  {
    id: "unlock_5_colors",
    difficulty: "medium",
    xp: 100,
    name: { en: "Unlock 5 tag colors", "pt-BR": "Desbloqueie 5 cores de tag" },
    check: (_s, level) => TAG_COLORS.filter((c) => level >= c.unlockLevel).length >= 5,
  },
  {
    id: "streak_5",
    difficulty: "medium",
    xp: 100,
    name: { en: "Achieve a 5-day streak", "pt-BR": "Alcance uma sequência de 5 dias" },
    check: (s) => computeOverallStreak(s.habits) >= 5,
  },
  {
    id: "new_theme",
    difficulty: "medium",
    xp: 100,
    name: {
      en: "Equip a new theme from the Theme Shop",
      "pt-BR": "Equipe um novo tema da loja",
    },
    check: (s) => s.activeTheme !== "midnight",
  },
  {
    id: "unlock_3_themes",
    difficulty: "medium",
    xp: 120,
    name: { en: "Unlock 3 themes", "pt-BR": "Desbloqueie 3 temas" },
    check: (s) => s.ownedThemes.length >= 3,
  },
  {
    id: "streak_10",
    difficulty: "medium",
    xp: 175,
    name: { en: "Achieve a 10-day streak", "pt-BR": "Alcance uma sequência de 10 dias" },
    check: (s) => computeOverallStreak(s.habits) >= 10,
  },
  {
    id: "five_habits",
    difficulty: "medium",
    xp: 110,
    name: { en: "Create 5 Habits", "pt-BR": "Crie 5 hábitos" },
    check: (s) => s.habits.length >= 5,
  },
  {
    id: "fifty_completions",
    difficulty: "medium",
    xp: 150,
    name: { en: "Complete 50 Habits total", "pt-BR": "Complete 50 hábitos no total" },
    check: (s) => totalCompletions(s) >= 50,
  },
  {
    id: "reach_level_5",
    difficulty: "medium",
    xp: 150,
    name: { en: "Reach Level 5", "pt-BR": "Alcance o nível 5" },
    check: (_s, level) => level >= 5,
  },
  {
    id: "three_tags",
    difficulty: "medium",
    xp: 100,
    name: { en: "Create 3 Tags", "pt-BR": "Crie 3 tags" },
    check: (s) => s.customTags.length >= 3,
  },

  // ── Hard ──────────────────────────────────────────────────────────────
  {
    id: "unlock_5_themes",
    difficulty: "hard",
    xp: 200,
    name: { en: "Unlock 5 themes", "pt-BR": "Desbloqueie 5 temas" },
    check: (s) => s.ownedThemes.length >= 5,
  },
  {
    id: "unlock_7_themes",
    difficulty: "hard",
    xp: 250,
    name: { en: "Unlock 7 themes", "pt-BR": "Desbloqueie 7 temas" },
    check: (s) => s.ownedThemes.length >= 7,
  },
  {
    id: "prism_theme",
    difficulty: "hard",
    xp: 300,
    name: { en: "Equip the Prism Theme", "pt-BR": "Equipe o tema Prism" },
    check: (s) => s.activeTheme === "prism",
  },
  {
    id: "streak_30",
    difficulty: "hard",
    xp: 400,
    name: { en: "Achieve a 30-day streak", "pt-BR": "Alcance uma sequência de 30 dias" },
    check: (s) => computeOverallStreak(s.habits) >= 30,
  },
  {
    id: "streak_60",
    difficulty: "hard",
    xp: 600,
    name: { en: "Achieve a 60-day streak", "pt-BR": "Alcance uma sequência de 60 dias" },
    check: (s) => computeOverallStreak(s.habits) >= 60,
  },
  {
    id: "hundred_completions",
    difficulty: "hard",
    xp: 350,
    name: { en: "Complete 100 Habits total", "pt-BR": "Complete 100 hábitos no total" },
    check: (s) => totalCompletions(s) >= 100,
  },
  {
    id: "reach_level_10",
    difficulty: "hard",
    xp: 400,
    name: { en: "Reach Level 10", "pt-BR": "Alcance o nível 10" },
    check: (_s, level) => level >= 10,
  },
  {
    id: "ten_habits",
    difficulty: "hard",
    xp: 250,
    name: { en: "Create 10 Habits", "pt-BR": "Crie 10 hábitos" },
    check: (s) => s.habits.length >= 10,
  },
];

export const DIFFICULTY_ORDER: Difficulty[] = ["easy", "medium", "hard"];
