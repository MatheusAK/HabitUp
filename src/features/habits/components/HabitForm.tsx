import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { addHabit, updateHabit, TAGS, useStore, type Habit } from "@/lib/habits-store";

const EMOJIS = [
  "✓", "💧", "🏃", "📖", "📕", "🧘", "🎯", "💪",
  "🌱", "🖊️", "🎨", "💤", "🍎", "🐕", "🫂", "⚽",
];

const WEEKDAYS = [
  { label: "Sun", value: 0 },
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
];

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
  const [mainFreq, setMainFreq] = useState<"regular" | "once">("regular");
  const [regularType, setRegularType] = useState<"daily" | "specific">("daily");
  const [scheduledDays, setScheduledDays] = useState<number[]>([]);
  const [endDate, setEndDate] = useState("");
  const [tagIds, setTagIds] = useState<string[]>([]);

  const allAvailableTags = [...TAGS, ...customTags];

  useEffect(() => {
    if (!open) return;
    setTitle(editing?.title ?? "");
    setEmoji(editing?.emoji ?? "✅");
    setEndDate(editing?.endDate ?? "");
    setTagIds(editing?.tagIds ?? []);

    const freq = editing?.frequency ?? "daily";
    if (freq === "once") {
      setMainFreq("once");
      setRegularType("daily");
      setScheduledDays([]);
    } else if (freq === "specific") {
      setMainFreq("regular");
      setRegularType("specific");
      setScheduledDays(editing?.scheduledDays ?? []);
    } else {
      setMainFreq("regular");
      setRegularType("daily");
      setScheduledDays([]);
    }
  }, [open, editing]);

  const toggleDay = (day: number) =>
    setScheduledDays((cur) =>
      cur.includes(day) ? cur.filter((d) => d !== day) : [...cur, day],
    );

  const save = () => {
    if (!title.trim()) return;
    if (mainFreq === "regular" && regularType === "specific" && scheduledDays.length === 0)
      return;

    const frequency =
      mainFreq === "once" ? "once" : regularType === "specific" ? "specific" : "daily";

    const payload = {
      title: title.trim(),
      emoji,
      frequency: frequency as Habit["frequency"],
      scheduledDays: frequency === "specific" ? scheduledDays : undefined,
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
          {/* Title */}
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              autoFocus
              placeholder="Drink water"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Emoji picker */}
          <div className="space-y-2">
            <Label>Icon</Label>
            <div className="flex flex-wrap gap-2">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`h-10 w-10 rounded-xl text-xl transition ${
                    emoji === e
                      ? "bg-primary/20 ring-2 ring-primary"
                      : "bg-muted hover:bg-accent"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Main frequency: Regular / One-time */}
          <div className="space-y-2">
            <Label>Type</Label>
            <div className="grid grid-cols-2 gap-2">
              {(["regular", "once"] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setMainFreq(opt)}
                  className={`rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    mainFreq === opt
                      ? "bg-gradient-hero text-primary-foreground shadow-glow"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {opt === "regular" ? "Regular" : "One-time"}
                </button>
              ))}
            </div>
          </div>

          {/* Sub-options shown only when Regular is selected */}
          {mainFreq === "regular" && (
            <div className="space-y-3 rounded-xl border border-border bg-card/60 p-3">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                Schedule
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {(["daily", "specific"] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setRegularType(opt)}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                      regularType === opt
                        ? "bg-primary/20 text-primary ring-1 ring-primary"
                        : "bg-muted text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    {opt === "daily" ? "Every day" : "Specific days"}
                  </button>
                ))}
              </div>

              {/* Weekday picker */}
              {regularType === "specific" && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Pick the days this habit should appear:
                  </p>
                  <div className="flex gap-1.5">
                    {WEEKDAYS.map(({ label, value }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => toggleDay(value)}
                        className={`flex-1 rounded-lg py-2 text-xs font-semibold transition ${
                          scheduledDays.includes(value)
                            ? "bg-gradient-hero text-primary-foreground shadow-glow"
                            : "bg-muted text-muted-foreground hover:bg-accent"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  {scheduledDays.length === 0 && (
                    <p className="text-[11px] text-destructive">
                      Select at least one day.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* End date */}
          <div className="space-y-2">
            <Label>End date (optional)</Label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {/* Tags */}
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
                          cur.includes(t.id)
                            ? cur.filter((x) => x !== t.id)
                            : [...cur, t.id],
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
          <Button
            onClick={save}
            className="bg-gradient-hero text-primary-foreground shadow-glow"
            disabled={
              mainFreq === "regular" &&
              regularType === "specific" &&
              scheduledDays.length === 0
            }
          >
            {editing ? "Save" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
