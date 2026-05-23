import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { addHabit, updateHabit, TAGS, useStore, type Habit } from "@/lib/habits-store";

const EMOJIS = ["✓", "💧", "🏃", "📖", "📕", "🧘", "🎯", "💪", "🌱", "🖊️", "🎨", "💤", "🍎", "🐕", "🫂", "⚽"];

export function HabitForm({
  open,
  onOpenChange,
  editing,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editing?: Habit | null;
}) {
  const customTags = useStore((s) => s.customTags);
  const [title, setTitle] = useState("");
  const [emoji, setEmoji] = useState("✅");
  const [frequency, setFrequency] = useState<"daily" | "once">("daily");
  const [endDate, setEndDate] = useState("");
  const [tagIds, setTagIds] = useState<string[]>([]);

  const allAvailableTags = [...TAGS, ...customTags];

  useEffect(() => {
    if (open) {
      setTitle(editing?.title ?? "");
      setEmoji(editing?.emoji ?? "✅");
      setFrequency(editing?.frequency ?? "daily");
      setEndDate(editing?.endDate ?? "");
      setTagIds(editing?.tagIds ?? []);
    }
  }, [open, editing]);

  const save = () => {
    if (!title.trim()) return;
    const payload = {
      title: title.trim(),
      emoji,
      frequency,
      endDate: endDate || undefined,
      tagIds,
    };
    if (editing) updateHabit(editing.id, payload);
    else addHabit(payload);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit habit" : "New habit"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              autoFocus
              placeholder="Drink water"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Icon</Label>
            <div className="flex flex-wrap gap-2">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`h-10 w-10 rounded-xl text-xl transition ${
                    emoji === e ? "bg-primary/20 ring-2 ring-primary" : "bg-muted hover:bg-accent"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFrequency("daily")}
                className={`rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  frequency === "daily"
                    ? "bg-gradient-hero text-primary-foreground shadow-glow"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                Daily
              </button>
              <button
                type="button"
                onClick={() => setFrequency("once")}
                className={`rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  frequency === "once"
                    ? "bg-gradient-hero text-primary-foreground shadow-glow"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                One-time
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>End date (optional)</Label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          {allAvailableTags.length > 0 && (
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2">
                {allAvailableTags.map((t) => {
                  const active = tagIds.includes(t.id);
                  return (
                    <Badge
                      key={t.id}
                      onClick={() =>
                        setTagIds((cur) =>
                          cur.includes(t.id) ? cur.filter((x) => x !== t.id) : [...cur, t.id],
                        )
                      }
                      style={{
                        backgroundColor: active ? t.color : "transparent",
                        borderColor: t.color,
                        color: active ? "#0a0a0a" : t.color,
                      }}
                      className="cursor-pointer border px-2.5 py-1"
                    >
                      {t.label}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save} className="bg-gradient-hero text-primary-foreground shadow-glow">
            {editing ? "Save" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
