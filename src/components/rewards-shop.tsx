import { Check, Lock, Palette, Tag as TagIcon } from "lucide-react";
import {
  levelFromXp,
  setActiveTheme,
  TAGS,
  THEMES,
  unlockTag,
  unlockTheme,
  useStore,
} from "@/lib/habits-store";

export function RewardsShop() {
  const xp = useStore((s) => s.xp);
  const ownedThemes = useStore((s) => s.ownedThemes);
  const ownedTags = useStore((s) => s.ownedTags);
  const activeTheme = useStore((s) => s.activeTheme);
  const { level } = levelFromXp(xp);

  return (
    <div className="space-y-6">
      <section>
        <div className="mb-3 flex items-center gap-2">
          <Palette className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Themes
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {THEMES.map((t) => {
            const owned = ownedThemes.includes(t.id);
            const canUnlock = level >= t.unlockLevel;
            const active = activeTheme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  if (owned) setActiveTheme(t.id);
                  else if (canUnlock) {
                    unlockTheme(t.id);
                    setActiveTheme(t.id);
                  }
                }}
                disabled={!owned && !canUnlock}
                className={`relative overflow-hidden rounded-2xl p-4 text-left transition ${
                  active ? "ring-2 ring-primary shadow-glow" : ""
                } ${!owned && !canUnlock ? "opacity-60" : "hover:scale-[1.02]"}`}
              >
                <div
                  className="absolute inset-0 opacity-90"
                  data-theme={t.id}
                  style={{ background: "var(--gradient-hero)" }}
                />
                <div className="relative">
                  <div className="text-base font-semibold text-white">{t.name}</div>
                  <div className="mt-1 text-xs text-white/80">
                    {owned ? (active ? "Active" : "Tap to apply") : canUnlock ? "Tap to unlock" : `Lvl ${t.unlockLevel}`}
                  </div>
                  {active && (
                    <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] text-white">
                      <Check className="h-3 w-3" /> Active
                    </div>
                  )}
                  {!owned && !canUnlock && (
                    <Lock className="absolute right-0 top-0 h-4 w-4 text-white/80" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <TagIcon className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Tags
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {TAGS.map((t) => {
            const owned = ownedTags.includes(t.id);
            const canUnlock = level >= t.unlockLevel;
            return (
              <button
                key={t.id}
                onClick={() => {
                  if (!owned && canUnlock) unlockTag(t.id);
                }}
                disabled={owned || !canUnlock}
                className="flex items-center justify-between rounded-2xl bg-card p-3 shadow-card transition disabled:opacity-100"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-8 w-8 rounded-lg"
                    style={{ backgroundColor: t.color }}
                  />
                  <div className="text-left">
                    <div className="text-sm font-semibold">{t.label}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {owned ? "Unlocked" : `Lvl ${t.unlockLevel}`}
                    </div>
                  </div>
                </div>
                {owned ? (
                  <Check className="h-4 w-4 text-success" />
                ) : canUnlock ? (
                  <span className="text-xs font-semibold text-primary">Claim</span>
                ) : (
                  <Lock className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
