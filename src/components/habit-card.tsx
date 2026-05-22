import { Check, Flame, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  computeStreak,
  deleteHabit,
  TAGS,
  toggleComplete,
  todayISO,
  useStore,
  type Habit,
} from "@/lib/habits-store";

export function HabitCard({
  habit,
  onEdit,
  onCompleted,
}: {
  habit: Habit;
  onEdit: () => void;
  onCompleted: (xp: number) => void;
}) {
  const customTags = useStore((s) => s.customTags);
  const today = todayISO();
  const done = habit.completions.includes(today);
  const streak = computeStreak(habit);
  const expired = habit.endDate && habit.endDate < today;

  const allTagsMap = new Map([...TAGS.map((t) => [t.id, t] as const), ...customTags.map((t) => [t.id, t] as const)]);

  return (
    <div
      className={`group relative flex items-center gap-3 rounded-2xl bg-card p-3 shadow-card transition ${
        done ? "opacity-80" : ""
      }`}
    >
      <button
        onClick={() => {
          const delta = toggleComplete(habit.id);
          if (delta > 0) onCompleted(delta);
        }}
        disabled={!!expired}
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl transition active:scale-95 ${
          done
            ? "bg-gradient-success text-success-foreground animate-pop"
            : "bg-muted hover:bg-accent"
        } ${expired ? "cursor-not-allowed opacity-40" : ""}`}
        aria-label={done ? "Mark incomplete" : "Mark complete"}
      >
        {done ? <Check className="h-6 w-6" strokeWidth={3} /> : habit.emoji}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className={`truncate font-semibold ${done ? "line-through opacity-70" : ""}`}>
            {habit.title}
          </h3>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          {streak > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-streak/20 px-1.5 py-0.5 text-streak">
              <Flame className="h-3 w-3" /> {streak}d
            </span>
          )}
          <span className="rounded-full bg-muted px-1.5 py-0.5">
            {habit.frequency === "daily" ? "Daily" : "Once"}
          </span>
          {habit.endDate && (
            <span className={`rounded-full px-1.5 py-0.5 ${expired ? "bg-destructive/20 text-destructive" : "bg-muted"}`}>
              {expired ? "Ended" : `Until ${habit.endDate}`}
            </span>
          )}
          {habit.tagIds.map((tid) => {
            const t = TAGS.find((x) => x.id === tid);
            if (!t) return null;
            return (
              <Badge
                key={tid}
                style={{ backgroundColor: t.color + "33", color: t.color, borderColor: "transparent" }}
                className="px-1.5 py-0 text-[10px] font-medium"
              >
                {t.label}
              </Badge>
            );
          })}
        </div>
      </div>

      <div className="flex shrink-0 flex-col gap-1">
        <button
          onClick={onEdit}
          className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
          aria-label="Edit"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          onClick={() => {
            if (confirm(`Delete "${habit.title}"?`)) deleteHabit(habit.id);
          }}
          className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/20 hover:text-destructive"
          aria-label="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
