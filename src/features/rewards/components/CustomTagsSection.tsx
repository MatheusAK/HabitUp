import { useState } from "react";
import { Lock, Plus, Tag as TagIcon, Trash2 } from "lucide-react";
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
import { addCustomTag, deleteCustomTag, TAG_COLORS, type Tag } from "@/lib/habits-store";

interface CustomTagsSectionProps {
  customTags: Tag[];
  level: number;
}

export function CustomTagsSection({ customTags, level }: CustomTagsSectionProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [newTagLabel, setNewTagLabel] = useState("");
  const unlockedColors = TAG_COLORS.filter((c) => level >= c.unlockLevel);
  const [newTagColor, setNewTagColor] = useState(
    unlockedColors[0]?.value ?? TAG_COLORS[0].value,
  );

  const saveTag = () => {
    if (!newTagLabel.trim()) return;
    addCustomTag(newTagLabel.trim(), newTagColor);
    setNewTagLabel("");
    setNewTagColor(unlockedColors[0]?.value ?? TAG_COLORS[0].value);
    setCreateOpen(false);
  };

  return (
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
                <span className="h-8 w-8 rounded-lg" style={{ backgroundColor: t.color }} />
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
                      } ${unlocked ? "" : "cursor-not-allowed opacity-40 grayscale"}`}
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
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
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
    </section>
  );
}
