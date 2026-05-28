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
import { useLocale } from "@/lib/i18n";

interface CustomTagsSectionProps {
  customTags: Tag[];
  level: number;
}

export function CustomTagsSection({ customTags, level }: CustomTagsSectionProps) {
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

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TagIcon className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {t.yourTags}
          </h2>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition hover:bg-primary/20"
        >
          <Plus className="h-3 w-3" /> {t.newTag}
        </button>
      </div>

      {customTags.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-card/40 p-4 text-center text-xs text-muted-foreground">
          {t.noCustomTags}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {customTags.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center justify-between rounded-2xl bg-card p-3 shadow-card"
            >
              <div className="flex items-center gap-2">
                <span className="h-8 w-8 rounded-lg" style={{ backgroundColor: tag.color }} />
                <div className="text-left">
                  <div className="text-sm font-semibold">{tag.label}</div>
                  <div className="text-[10px] text-muted-foreground">{t.customLabel}</div>
                </div>
              </div>
              <button
                onClick={() => deleteCustomTag(tag.id)}
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
                      className={`relative flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-full transition ${
                        newTagColor === c.value && unlocked
                          ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                          : ""
                      } ${unlocked ? "" : "cursor-not-allowed opacity-50 grayscale"}`}
                      style={{ backgroundColor: c.value }}
                      aria-label={`${c.name}${unlocked ? "" : ` locked at level ${c.unlockLevel}`}`}
                    >
                      {unlocked ? null : (
                        <span className="text-[9px] font-bold leading-none text-white drop-shadow">
                          L{c.unlockLevel}
                        </span>
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
