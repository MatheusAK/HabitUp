import { useState } from "react";
import { CircleCheck as CheckCircle2, Lock, Sparkles, Trophy, Zap } from "lucide-react";
import { toast } from "sonner";
import { claimAchievement, levelFromXp, useStore } from "@/lib/habits-store";
import { useLocale } from "@/lib/i18n";
import { ACHIEVEMENTS, DIFFICULTY_ORDER, type Difficulty } from "../achievements";
import { Progress } from "@/components/ui/progress";

const DIFFICULTY_CONFIG: Record<
  Difficulty,
  {
    label: (t: ReturnType<typeof useLocale>) => string;
    gradient: string;
    ring: string;
    xpColor: string;
  }
> = {
  easy: {
    label: (t) => t.easyLabel,
    gradient: "from-emerald-500/20 to-teal-500/20",
    ring: "ring-emerald-500/30",
    xpColor: "text-emerald-400",
  },
  medium: {
    label: (t) => t.mediumLabel,
    gradient: "from-amber-500/20 to-yellow-500/20",
    ring: "ring-amber-500/30",
    xpColor: "text-amber-400",
  },
  hard: {
    label: (t) => t.hardLabel,
    gradient: "from-rose-500/20 to-red-500/20",
    ring: "ring-rose-500/30",
    xpColor: "text-rose-400",
  },
};

export function AchievementsCompact() {
  const t = useLocale();
  const locale = useStore((s) => s.locale);
  const xp = useStore((s) => s.xp);
  const habits = useStore((s) => s.habits);
  const ownedThemes = useStore((s) => s.ownedThemes);
  const activeTheme = useStore((s) => s.activeTheme);
  const customTags = useStore((s) => s.customTags);
  const claimedAchievements = useStore((s) => s.claimedAchievements);
  const { level, progress: levelProgress } = levelFromXp(xp);

  const state = { habits, xp, ownedThemes, activeTheme, customTags, claimedAchievements } as Parameters<
    typeof ACHIEVEMENTS[0]["check"]
  >[0];

  const totalClaimed = claimedAchievements.length;
  const total = ACHIEVEMENTS.length;
  const totalXpEarned = ACHIEVEMENTS.filter((a) => claimedAchievements.includes(a.id)).reduce(
    (sum, a) => sum + a.xp,
    0,
  );
  const completionPercent = Math.round((totalClaimed / total) * 100);

  const grouped = DIFFICULTY_ORDER.map((diff) => ({
    diff,
    items: ACHIEVEMENTS.filter((a) => a.difficulty === diff).sort((a, b) => {
      const aClaimed = claimedAchievements.includes(a.id) ? 1 : 0;
      const bClaimed = claimedAchievements.includes(b.id) ? 1 : 0;
      return aClaimed - bClaimed;
    }),
  }));

  return (
    <section>
      {/* Header with overall stats */}
      <div className="mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {t.achievementsTitle}
            </h2>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-primary/10 px-2.5 py-1">
            <Sparkles className="h-3 w-3 text-primary" />
            <span className="text-[11px] font-bold text-primary">
              Lvl {level}
            </span>
          </div>
        </div>

        {/* Progress summary */}
        <div className="mt-2.5 rounded-xl border border-border/40 bg-card/60 p-2.5">
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div>
              <p className="text-lg font-bold leading-none text-foreground">{totalClaimed}</p>
              <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                Unlocked
              </p>
            </div>
            <div className="border-l border-border/40 pl-2.5">
              <p className="text-lg font-bold leading-none text-primary">{totalXpEarned}</p>
              <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                XP Earned
              </p>
            </div>
            <div className="border-l border-border/40 pl-2.5">
              <p className="text-lg font-bold leading-none text-success">{completionPercent}%</p>
              <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                Complete
              </p>
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-center justify-between text-[10px] font-medium text-muted-foreground">
              <span>{t.xpReward(xp)}</span>
              <span>Next Level</span>
            </div>
            <Progress value={levelProgress * 100} className="mt-1 h-1" />
          </div>
        </div>
      </div>

      {/* Difficulty groups */}
      <div className="space-y-3">
        {grouped.map(({ diff, items }) => {
          const config = DIFFICULTY_CONFIG[diff];
          const claimedCount = items.filter((a) => claimedAchievements.includes(a.id)).length;

          return (
            <div key={diff}>
              {/* Difficulty header */}
              <div className="mb-1.5 flex items-center justify-between">
                <div className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${config.gradient} px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider`}>
                  <Trophy className="h-3 w-3" />
                  {config.label(t)}
                </div>
                <span className="text-[10px] font-semibold text-muted-foreground">
                  {claimedCount}/{items.length}
                </span>
              </div>

              {/* Achievements grid - 2 columns */}
              <div className="grid grid-cols-2 gap-2">
                {items.map((achievement) => {
                  const isClaimed = claimedAchievements.includes(achievement.id);
                  const isUnlocked = achievement.check(state, level);
                  const canClaim = isUnlocked && !isClaimed;

                  return (
                    <div
                      key={achievement.id}
                      className={`group relative flex flex-col gap-1.5 rounded-xl border p-2 transition ${
                        isClaimed
                          ? "border-border/30 bg-card/30 opacity-50"
                          : canClaim
                            ? `${config.ring} ring-1 border bg-card shadow-card`
                            : "border-border/25 bg-card/25"
                      }`}
                    >
                      {/* Top row: Icon + XP */}
                      <div className="flex items-center justify-between">
                        <div
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${
                            isClaimed
                              ? "bg-success/20"
                              : canClaim
                                ? `bg-gradient-to-br ${config.gradient}`
                                : "bg-muted/60"
                          }`}
                        >
                          {isClaimed ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                          ) : canClaim ? (
                            <Trophy className={`h-3.5 w-3.5 ${config.xpColor}`} />
                          ) : (
                            <Lock className="h-3 w-3 text-muted-foreground/50" />
                          )}
                        </div>

                        {!isClaimed && !canClaim && (
                          <Lock className="h-2.5 w-2.5 text-muted-foreground/30" />
                        )}
                      </div>

                      {/* Achievement name */}
                      <p
                        className={`text-xs font-semibold leading-tight ${
                          isClaimed ? "line-through" : ""
                        }`}
                      >
                        {achievement.name[locale]}
                      </p>

                      {/* Bottom row: XP or Claim button */}
                      <div className="flex items-center justify-between">
                        <div className={`flex items-center gap-0.5 ${config.xpColor}`}>
                          <Zap className="h-2.5 w-2.5" />
                          <span className="text-[10px] font-bold">{achievement.xp}</span>
                        </div>

                        {isClaimed ? (
                          <span className="rounded bg-success/15 px-1.5 py-0.5 text-[9px] font-semibold text-success">
                            {t.claimed}
                          </span>
                        ) : canClaim ? (
                          <button
                            onClick={() => {
                              claimAchievement(achievement.id, achievement.xp);
                              toast.custom(() => (
                                <div className="flex items-center gap-2 rounded-xl bg-card px-4 py-3 shadow-2xl ring-1 ring-border">
                                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${config.gradient}`}>
                                    <Sparkles className={`h-4 w-4 ${config.xpColor}`} />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold">{achievement.name[locale]}</p>
                                    <p className={`text-xs font-bold ${config.xpColor}`}>
                                      {t.xpReward(achievement.xp)}
                                    </p>
                                  </div>
                                </div>
                              ));
                            }}
                            className={`rounded-full bg-gradient-to-r ${config.gradient} px-2.5 py-1 text-[10px] font-bold transition active:scale-95 ${config.xpColor} hover:shadow-md`}
                          >
                            {t.claimBtn}
                          </button>
                        ) : (
                          <span className="text-[10px] font-semibold text-muted-foreground/50">
                            +{achievement.xp} XP
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
