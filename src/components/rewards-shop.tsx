import { useState } from "react";
import { Check, Lock, Palette, Tag as TagIcon, Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  levelFromXp,
  setActiveTheme,
  TAGS,
  THEMES,
  unlockTag,
  unlockTheme,
  addCustomTag,
  deleteCustomTag,
  useStore,
} from "@/lib/habits-store";

const CUSTOM_COLORS = [
  "#34d399",
  "#818cf8",
  "#f472b6",
  "#fb7185",
  "#fbbf24",
  "#a78bfa",
  "#60a5fa",
  "#f87171",
  "#2dd4bf",
  "#c084fc",
];

export function RewardsShop() {
  const xp = useStore((s) => s.xp);
  const ownedThemes = useStore((s) => s.ownedThemes);
  const ownedTags = useStore((s) => s.ownedTags);
  const customTags = useStore((s) => s.customTags);
  const activeTheme = useStore((s) => s.activeTheme);
  const { level } = levelFromXp(xp);

  const [createOpen, setCreateOpen] = useState(false);
  const [newTagLabel, setNewTagLabel] = useState("");
  const [newTagColor, setNewTagColor] = useState(CUSTOM_COLORS[0]);

  const saveTag = () => {
    if (!newTagLabel.trim()) return;
    addCustomTag(newTagLabel.trim(), newTagColor);
    setNewTagLabel("");
    setNewTagColor(CUSTOM_COLORS[0]);
    setCreateOpen(false);
  };

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
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TagIcon className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Tags
            </h2>
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition hover:bg-primary/20"
          >
            <Plus className="h-3 w-3" /> New
          </button>
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
      </section>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle>Create tag</DialogTitle>
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
                {CUSTOM_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setNewTagColor(c)}
                    className={`h-8 w-8 rounded-full transition ${
                      newTagColor === c ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""
                    }`}
                    style={{ backgroundColor: c }}
                    aria-label={`Pick color ${c}`}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveTag} className="bg-gradient-hero text-primary-foreground shadow-glow">
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
