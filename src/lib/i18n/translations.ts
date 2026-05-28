export type Locale = "en" | "pt-BR";

export interface T {
  greeting: string;
  doneToday: (n: number, total: number) => string;
  tabHabits: string;
  tabStats: string;
  tabRewards: string;
  noHabitsTitle: string;
  noHabitsBody: string;
  streakToast: string;
  daily: string;
  once: string;
  noDays: string;
  ended: string;
  until: (date: string) => string;
  deleteConfirm: (title: string) => string;
  editHabit: string;
  newHabit: string;
  titleLabel: string;
  titlePlaceholder: string;
  iconLabel: string;
  typeLabel: string;
  regular: string;
  onetime: string;
  scheduleLabel: string;
  everyDay: string;
  specificDays: string;
  pickDays: string;
  selectOneDay: string;
  endDateLabel: string;
  endDateHelper: string;
  tagsLabel: string;
  nextBtn: string;
  cancelBtn: string;
  saveBtn: string;
  createBtn: string;
  titleRequired: string;
  noStatsTitle: string;
  noStatsBody: string;
  bestStreak: string;
  rate30: string;
  totalDone: string;
  totalXp: string;
  last30days: string;
  completionsPerDay: string;
  thisWeek: string;
  doneVsPlanned: string;
  currentStreaks: string;
  perHabit: string;
  effortTitle: string;
  allTime: string;
  consistency: string;
  weeklyAvg: string;
  perfectDays: string;
  lessActive: string;
  moreActive: string;
  themes: string;
  themeShop: string;
  themeShopDesc: string;
  tagColors: string;
  yourTags: string;
  newTag: string;
  noCustomTags: string;
  createTag: string;
  createTagDesc: string;
  labelField: string;
  colorField: string;
  customLabel: string;
  active: string;
  tapToApply: string;
  tapToUnlock: string;
  settingsTitle: string;
  settingsDesc: string;
  devMode: string;
  devModeDesc: string;
  xpDebug: (xp: number) => string;
  resetAllData: string;
  resetAllDataDesc: string;
  confirmReset: string;
  resetEverything: string;
  allDataReset: string;
  languageLabel: string;
  achievementsTitle: string;
  easyLabel: string;
  mediumLabel: string;
  hardLabel: string;
  claimBtn: string;
  claimed: string;
  xpReward: (xp: number) => string;
}

const en: T = {
  greeting: "Hey there",
  doneToday: (n, total) => `${n}/${total} done today`,
  tabHabits: "Habits",
  tabStats: "Stats",
  tabRewards: "Rewards",
  noHabitsTitle: "No habits yet",
  noHabitsBody: "Tap the + button to create your first habit and start a streak.",
  streakToast: "Keep that streak alive 🔥",
  daily: "Daily",
  once: "Once",
  noDays: "No days",
  ended: "Ended",
  until: (date) => `Until ${date}`,
  deleteConfirm: (title) => `Delete "${title}"?`,
  editHabit: "Edit habit",
  newHabit: "New habit",
  titleLabel: "Title",
  titlePlaceholder: "Drink water",
  iconLabel: "Icon",
  typeLabel: "Type",
  regular: "Regular",
  onetime: "One-time",
  scheduleLabel: "Schedule",
  everyDay: "Every day",
  specificDays: "Specific days",
  pickDays: "Pick the days this habit should appear:",
  selectOneDay: "Select at least one day.",
  endDateLabel: "End date (optional)",
  endDateHelper: "Leave empty for an ongoing habit",
  tagsLabel: "Tags",
  nextBtn: "Next",
  cancelBtn: "Cancel",
  saveBtn: "Save",
  createBtn: "Create",
  titleRequired: "Title is required",
  noStatsTitle: "No stats yet",
  noStatsBody: "Create habits and start completing them to unlock your charts.",
  bestStreak: "Best streak",
  rate30: "30-day rate",
  totalDone: "Total done",
  totalXp: "Total XP",
  last30days: "Last 30 days",
  completionsPerDay: "Completions / day",
  thisWeek: "This week",
  doneVsPlanned: "Done vs. planned",
  currentStreaks: "Current streaks",
  perHabit: "Per habit",
  effortTitle: "Where your effort goes",
  allTime: "All time",
  consistency: "Consistency",
  weeklyAvg: "Weekly avg",
  perfectDays: "Perfect days",
  lessActive: "Less",
  moreActive: "More",
  themes: "Themes",
  themeShop: "Theme Shop",
  themeShopDesc: "New themes unlock every 3 levels after Candy. Reach Lvl 20 to collect them all.",
  tagColors: "Tag Colors",
  yourTags: "Your Tags",
  newTag: "New",
  noCustomTags: "No custom tags yet. Create one with an unlocked color.",
  createTag: "Create tag",
  createTagDesc: "Pick from your unlocked colors.",
  labelField: "Label",
  colorField: "Color",
  customLabel: "Custom",
  active: "Active",
  tapToApply: "Tap to apply",
  tapToUnlock: "Tap to unlock",
  settingsTitle: "Settings",
  settingsDesc: "Manage your data and developer options.",
  devMode: "DEV MODE",
  devModeDesc: "Show XP debug buttons",
  xpDebug: (xp) => `XP Debug · current ${xp}`,
  resetAllData: "Reset all data",
  resetAllDataDesc: "Deletes habits, XP, unlocks, custom tags, and theme.",
  confirmReset: "Confirm reset",
  resetEverything: "Reset everything",
  allDataReset: "All data reset",
  languageLabel: "Language",
  achievementsTitle: "Achievements",
  easyLabel: "Easy",
  mediumLabel: "Medium",
  hardLabel: "Hard",
  claimBtn: "Claim",
  claimed: "Claimed",
  xpReward: (xp) => `+${xp} XP`,
};

const ptBR: T = {
  greeting: "Seja Bem Vindo",
  doneToday: (n, total) => `${n}/${total} feitos hoje`,
  tabHabits: "Hábitos",
  tabStats: "Estatísticas",
  tabRewards: "Recompensas",
  noHabitsTitle: "Nenhum hábito ainda",
  noHabitsBody: "Toque no botão + para criar seu primeiro hábito e começar uma sequência.",
  streakToast: "Mantenha a sequência viva 🔥",
  daily: "Diário",
  once: "Uma vez",
  noDays: "Sem dias",
  ended: "Encerrado",
  until: (date) => `Até ${date}`,
  deleteConfirm: (title) => `Excluir "${title}"?`,
  editHabit: "Editar hábito",
  newHabit: "Novo hábito",
  titleLabel: "Título",
  titlePlaceholder: "Beber água",
  iconLabel: "Ícone",
  typeLabel: "Tipo",
  regular: "Regular",
  onetime: "Única vez",
  scheduleLabel: "Frequência",
  everyDay: "Todo dia",
  specificDays: "Dias específicos",
  pickDays: "Escolha os dias em que este hábito deve aparecer:",
  selectOneDay: "Selecione pelo menos um dia.",
  endDateLabel: "Data de término (opcional)",
  endDateHelper: "Deixe vazio para um hábito contínuo",
  tagsLabel: "Tags",
  nextBtn: "Próximo",
  cancelBtn: "Cancelar",
  saveBtn: "Salvar",
  createBtn: "Criar",
  titleRequired: "Título é obrigatório",
  noStatsTitle: "Nenhuma estatística ainda",
  noStatsBody: "Crie hábitos e comece a completá-los para desbloquear seus gráficos.",
  bestStreak: "Melhor sequência",
  rate30: "Taxa 30 dias",
  totalDone: "Total feito",
  totalXp: "XP Total",
  last30days: "Últimos 30 dias",
  completionsPerDay: "Conclusões / dia",
  thisWeek: "Esta semana",
  doneVsPlanned: "Feito vs. planejado",
  currentStreaks: "Sequências atuais",
  perHabit: "Por hábito",
  effortTitle: "Onde vai seu esforço",
  allTime: "Todo período",
  consistency: "Consistência",
  weeklyAvg: "Média semanal",
  perfectDays: "Dias perfeitos",
  lessActive: "Menos",
  moreActive: "Mais",
  themes: "Temas",
  themeShop: "Loja de Temas",
  themeShopDesc: "Novos temas desbloqueiam a cada 3 níveis após Candy. Alcance o Nível 20 para colecionar todos.",
  tagColors: "Cores de Tags",
  yourTags: "Suas Tags",
  newTag: "Nova",
  noCustomTags: "Nenhuma tag personalizada ainda. Crie uma com uma cor desbloqueada.",
  createTag: "Criar tag",
  createTagDesc: "Escolha entre suas cores desbloqueadas.",
  labelField: "Nome",
  colorField: "Cor",
  customLabel: "Personalizada",
  active: "Ativo",
  tapToApply: "Toque para aplicar",
  tapToUnlock: "Toque para desbloquear",
  settingsTitle: "Configurações",
  settingsDesc: "Gerencie seus dados e opções de desenvolvedor.",
  devMode: "MODO DEV",
  devModeDesc: "Mostrar botões de debug de XP",
  xpDebug: (xp) => `Debug XP · atual ${xp}`,
  resetAllData: "Resetar todos os dados",
  resetAllDataDesc: "Exclui hábitos, XP, desbloqueios, tags personalizadas e tema.",
  confirmReset: "Confirmar reset",
  resetEverything: "Resetar tudo",
  allDataReset: "Todos os dados resetados",
  languageLabel: "Idioma",
  achievementsTitle: "Conquistas",
  easyLabel: "Fácil",
  mediumLabel: "Médio",
  hardLabel: "Difícil",
  claimBtn: "Resgatar",
  claimed: "Resgatado",
  xpReward: (xp) => `+${xp} XP`,
};

export const translations: Record<Locale, T> = { en, "pt-BR": ptBR };
