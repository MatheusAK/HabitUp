import { useState } from "react";
import { Check, Lock, Palette, Sparkles, Store, Tag as TagIcon, Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  levelFromXp,
  setActiveTheme,
  TAG_COLORS,
  THEMES,
  unlockTheme,
  addCustomTag,
  deleteCustomTag,
  useStore,
} from "@/lib/habits-store";

export function RewardsShop() {
  const xp = useStore((s) => s.xp);
  const ownedThemes = useStore((s) => s.ownedThemes);
  const customTags = useStore((s) => s.customTags);
  const activeTheme = useStore((s) => s.activeTheme);
  const { level } = levelFromXp(xp);

  const [shopOpen, setShopOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [newTagLabel, setNewTagLabel] = useState("");
  const unlockedColors = TAG_COLORS.filter((c) => level >= c.unlockLevel);
  const [newTagColor, setNewTagColor] = useState(unlockedColors[0]?.value ?? TAG_COLORS[0].value);

  const saveTag = () => {
    if (!newTagLabel.trim()) return;
    addCustomTag(newTagLabel.trim(), newTagColor);
    setNewTagLabel("");
    setNewTagColor(unlockedColors[0]?.value ?? TAG_COLORS[0].value);
    setCreateOpen(false);
  };

  // Themes owned/visible in main grid; Theme Shop holds the rest.
  const visibleThemes = THEMES.filter(
    (t) => ownedThemes.includes(t.id) || level >= t.unlockLevel,
  );

  return (
    <div className="space-y-6">
      {/* Themes */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Themes
            </h2>
          </div>
          <button
            onClick={() => setShopOpen(true)}
            className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition hover:bg-primary/20"
          >
            <Store className="h-3 w-3" /> Theme Shop
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {visibleThemes.map((t) => {
            const owned = ownedThemes.includes(t.id);
            const active = activeTheme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  if (owned) setActiveTheme(t.id);
                  else {
                    unlockTheme(t.id);
                    setActiveTheme(t.id);
                  }
                }}
                className={`relative h-24 overflow-hidden rounded-2xl text-left transition ${
                  active ? "ring-2 ring-primary shadow-glow" : "hover:scale-[1.02]"
                }`}
              >
                <div
                  className="absolute inset-0"
                  data-theme={t.id}
                  style={{ background: "var(--gradient-hero)" }}
                />
                <div className="relative flex h-full flex-col justify-between p-3">
                  <div className="text-base font-semibold text-white drop-shadow">{t.name}</div>
                  <div className="text-xs text-white/90">
                    {owned ? (active ? "Active" : "Tap to apply") : "Tap to unlock"}
                  </div>
                  {active && (
                    <div className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/25 px-2 py-0.5 text-[10px] text-white">
                      <Check className="h-3 w-3" /> Active
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Tag Colors */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Tag Colors
          </h2>
        </div>
        <div className="grid grid-cols-6 gap-2 rounded-2xl bg-card/60 p-3 shadow-card">
          {TAG_COLORS.map((c) => {
            const unlocked = level >= c.unlockLevel;
            return (
              <div
                key={c.value}
                className="flex flex-col items-center gap-1"
                title={`${c.name} · Lvl ${c.unlockLevel}`}
              >
                <div
                  className={`relative flex h-9 w-9 items-center justify-center rounded-full ${
                    unlocked ? "" : "opacity-40 grayscale"
                  }`}
                  style={{ backgroundColor: c.value }}
                >
                  {!unlocked && <Lock className="h-3.5 w-3.5 text-white/90" />}
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {unlocked ? c.name : `L${c.unlockLevel}`}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Custom Tags */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TagIcon className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Your Tags
            </h2>
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition hover:bg-primary/20"
          >
            <Plus className="h-3 w-3" /> New
          </button>
        </div>
        {customTags.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border bg-card/40 p-4 text-center text-xs text-muted-foreground">
            No custom tags yet. Create one with an unlocked color.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {customTags.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between rounded-2xl bg-card p-3 shadow-card"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-8 w-8 rounded-lg"
                    style={{ backgroundColor: t.color }}
                  />
                  <div className="text-left">
                    <div className="text-sm font-semibold">{t.label}</div>
                    <div className="text-[10px] text-muted-foreground">Custom</div>
                  </div>
                </div>
                <button
                  onClick={() => deleteCustomTag(t.id)}
                  className="rounded-full p-1.5 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Delete tag"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Create tag dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle>Create tag</DialogTitle>
            <DialogDescription>Pick from your unlocked colors.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Label</Label>
              <Input
                autoFocus
                placeholder="e.g. Work, Family"
                value={newTagLabel}
                onChange={(e) => setNewTagLabel(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {TAG_COLORS.map((c) => {
                  const unlocked = level >= c.unlockLevel;
                  return (
                    <button
                      key={c.value}
                      type="button"
                      disabled={!unlocked}
                      onClick={() => unlocked && setNewTagColor(c.value)}
                      className={`relative flex h-8 w-8 items-center justify-center rounded-full transition ${
                        newTagColor === c.value && unlocked
                          ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                          : ""
                      } ${unlocked ? "" : "opacity-40 grayscale cursor-not-allowed"}`}
                      style={{ backgroundColor: c.value }}
                      aria-label={`${c.name}${unlocked ? "" : ` locked at level ${c.unlockLevel}`}`}
                    >
                      {!unlocked && <Lock className="h-3 w-3 text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button
              onClick={saveTag}
              className="bg-gradient-hero text-primary-foreground shadow-glow"
              disabled={!newTagLabel.trim()}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Theme Shop dialog */}
      <Dialog open={shopOpen} onOpenChange={setShopOpen}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Store className="h-4 w-4 text-primary" /> Theme Shop
            </DialogTitle>
            <DialogDescription>
              New themes unlock every 3 levels after Candy. Reach Lvl 20 to collect them all.
            </DialogDescription>
          </DialogHeader>
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
                  className={`relative h-24 overflow-hidden rounded-2xl text-left transition ${
                    active ? "ring-2 ring-primary shadow-glow" : ""
                  } ${!owned && !canUnlock ? "opacity-60" : "hover:scale-[1.02]"}`}
                >
                  <div
                    className="absolute inset-0"
                    data-theme={t.id}
                    style={{ background: "var(--gradient-hero)" }}
                  />
                  <div className="relative flex h-full flex-col justify-between p-3">
                    <div className="text-sm font-semibold text-white drop-shadow">{t.name}</div>
                    <div className="text-[11px] text-white/90">
                      {owned
                        ? active
                          ? "Active"
                          : "Tap to apply"
                        : canUnlock
                          ? "Tap to unlock"
                          : `Lvl ${t.unlockLevel}`}
                    </div>
                    {!owned && !canUnlock && (
                      <Lock className="absolute right-2 top-2 h-4 w-4 text-white/90" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
