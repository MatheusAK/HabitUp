import { CheckCircle2, Lock, Trophy } from "lucide-react";
import { toast } from "sonner";
import { claimAchievement, levelFromXp, useStore } from "@/lib/habits-store";
import { useLocale } from "@/lib/i18n";
import { ACHIEVEMENTS, DIFFICULTY_ORDER, type Difficulty } from "../achievements";

const DIFFICULTY_STYLES: Record<
  Difficulty,
  { label: (t: ReturnType<typeof useLocale>) => string; bg: string; text: string; border: string }
> = {
  easy:   { label: (t) => t.easyLabel,   bg: "bg-success/10",    text: "text-success",          border: "border-success/30" },
  medium: { label: (t) => t.mediumLabel, bg: "bg-amber-500/10",  text: "text-amber-400",        border: "border-amber-500/30" },
  hard:   { label: (t) => t.hardLabel,   bg: "bg-destructive/10",text: "text-destructive",      border: "border-destructive/30" },
};

export function AchievementsSection() {
  const t = useLocale();
  const locale = useStore((s) => s.locale);
  const xp = useStore((s) => s.xp);
  const habits = useStore((s) => s.habits);
  const ownedThemes = useStore((s) => s.ownedThemes);
  const activeTheme = useStore((s) => s.activeTheme);
  const customTags = useStore((s) => s.customTags);
  const claimedAchievements = useStore((s) => s.claimedAchievements);
  const { level } = levelFromXp(xp);

  const state = { habits, xp, ownedThemes, activeTheme, customTags, claimedAchievements } as Parameters<typeof ACHIEVEMENTS[0]["check"]>[0];

  const grouped = DIFFICULTY_ORDER.map((diff) => ({
    diff,
    items: ACHIEVEMENTS.filter((a) => a.difficulty === diff),
  }));

  const totalClaimed = claimedAchievements.length;
  const total = ACHIEVEMENTS.length;

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {t.achievementsTitle}
          </h2>
        </div>
        <span className="text-xs font-semibold text-muted-foreground">
          {totalClaimed}/{total}
        </span>
      </div>

      <div className="space-y-4">
        {grouped.map(({ diff, items }) => {
          const style = DIFFICULTY_STYLES[diff];
          return (
            <div key={diff}>
              <div className={`mb-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${style.bg} ${style.text}`}>
                {style.label(t)}
              </div>
              <div className="space-y-2">
                {items.map((achievement) => {
                  const isClaimed = claimedAchievements.includes(achievement.id);
                  const isUnlocked = achievement.check(state, level);
                  const canClaim = isUnlocked && !isClaimed;

                  return (
                    <div
                      key={achievement.id}
                      className={`flex items-center gap-3 rounded-2xl border p-3 transition ${
                        isClaimed
                          ? "border-border/40 bg-card/40 opacity-60"
                          : canClaim
                            ? `${style.border} border bg-card shadow-card`
                            : "border-border/30 bg-card/30"
                      }`}
                    >
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                          isClaimed ? "bg-success/20" : canClaim ? `${style.bg}` : "bg-muted/60"
                        }`}
                      >
                        {isClaimed ? (
                          <CheckCircle2 className="h-5 w-5 text-success" />
                        ) : canClaim ? (
                          <Trophy className={`h-5 w-5 ${style.text}`} />
                        ) : (
                          <Lock className="h-4 w-4 text-muted-foreground/50" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-semibold leading-tight ${isClaimed ? "line-through" : ""}`}>
                          {achievement.name[locale]}
                        </p>
                        <p className={`mt-0.5 text-xs font-semibold ${style.text}`}>
                          {t.xpReward(achievement.xp)}
                        </p>
                      </div>

                      {isClaimed ? (
                        <span className="shrink-0 rounded-full bg-success/15 px-2.5 py-1 text-[11px] font-semibold text-success">
                          {t.claimed}
                        </span>
                      ) : canClaim ? (
                        <button
                          onClick={() => {
                            claimAchievement(achievement.id, achievement.xp);
                            toast.success(`${achievement.name[locale]} — ${t.xpReward(achievement.xp)}`);
                          }}
                          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition active:scale-95 ${style.bg} ${style.text} hover:opacity-80`}
                        >
                          {t.claimBtn}
                        </button>
                      ) : (
                        <span className="shrink-0 rounded-full bg-muted/60 px-2.5 py-1 text-[11px] text-muted-foreground/60">
                          {t.xpReward(achievement.xp)}
                        </span>
                      )}
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
