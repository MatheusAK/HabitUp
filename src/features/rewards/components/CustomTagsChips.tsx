import { useState } from "react";
import { Lock, Plus, Tag as TagIcon, X } from "lucide-react";
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
import { useLocale } from "@/lib/i18n";

interface CustomTagsChipsProps {
  customTags: Tag[];
  level: number;
}

export function CustomTagsChips({ customTags, level }: CustomTagsChipsProps) {
  const t = useLocale();
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

  const unlockedCount = TAG_COLORS.filter((c) => level >= c.unlockLevel).length;

  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TagIcon className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {t.yourTags}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium text-muted-foreground">
            {unlockedCount}/{TAG_COLORS.length} colors
          </span>
          <button
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary transition hover:bg-primary/15 active:scale-95"
          >
            <Plus className="h-3 w-3" /> {t.newTag}
          </button>
        </div>
      </div>

      {customTags.length === 0 ? (
        <div className="flex flex-col items-center gap-2.5 rounded-xl border border-dashed border-border/60 bg-card/30 px-4 py-5 text-center">
          <div className="flex gap-1">
            {TAG_COLORS.slice(0, 6).map((c) => {
              const unlocked = level >= c.unlockLevel;
              return (
                <div
                  key={c.value}
                  className={`h-6 w-6 rounded-full transition ${
                    unlocked ? "" : "opacity-30 grayscale"
                  }`}
                  style={{ backgroundColor: c.value }}
                />
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground">{t.noCustomTags}</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {customTags.map((tag) => (
            <div
              key={tag.id}
              className="group inline-flex items-center gap-2 rounded-full border border-border/40 bg-card px-3 py-1.5 transition hover:border-border/70 hover:shadow-md"
            >
              <div
                className="h-3.5 w-3.5 rounded-full"
                style={{ backgroundColor: tag.color }}
              />
              <span className="text-xs font-medium">{tag.label}</span>
              <button
                onClick={() => deleteCustomTag(tag.id)}
                className="rounded-full p-0.5 text-muted-foreground/50 opacity-0 transition hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                aria-label="Delete tag"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle>{t.createTag}</DialogTitle>
            <DialogDescription>{t.createTagDesc}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t.labelField}</Label>
              <Input
                autoFocus
                placeholder="e.g. Work, Family"
                value={newTagLabel}
                onChange={(e) => setNewTagLabel(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t.colorField}</Label>
              <div className="flex flex-wrap gap-2">
                {TAG_COLORS.map((c) => {
                  const unlocked = level >= c.unlockLevel;
                  return (
                    <button
                      key={c.value}
                      type="button"
                      disabled={!unlocked}
                      onClick={() => unlocked && setNewTagColor(c.value)}
                      title={unlocked ? c.name : `${c.name} — Lvl ${c.unlockLevel}`}
                      className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition ${
                        newTagColor === c.value && unlocked
                          ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                          : ""
                      } ${unlocked ? "" : "cursor-not-allowed opacity-50 grayscale"}`}
                      style={{ backgroundColor: c.value }}
                      aria-label={`${c.name}${unlocked ? "" : ` locked at level ${c.unlockLevel}`}`}
                    >
                      {unlocked ? null : (
                        <Lock className="h-3 w-3 text-white drop-shadow" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>
              {t.cancelBtn}
            </Button>
            <Button
              onClick={saveTag}
              className="bg-primary text-primary-foreground"
              disabled={!newTagLabel.trim()}
            >
              {t.createBtn}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
