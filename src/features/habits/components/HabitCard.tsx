import { Check, Flame, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  computeStreak,
  deleteHabit,
  levelFromXp,
  TAGS,
  toggleComplete,
  todayISO,
  useStore,
  type Habit,
} from "@/lib/habits-store";
import { useLocale } from "@/lib/i18n";
import { HabitIcon } from "../habitIcons";

const DAY_ABBREVS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatFrequency(habit: Habit, daily: string, once: string, noDays: string): string {
  if (habit.frequency === "once") return once;
  if (habit.frequency === "specific") {
    const days = (habit.scheduledDays ?? []).slice().sort((a, b) => a - b);
    if (days.length === 0) return noDays;
    return days.map((d) => DAY_ABBREVS[d]).join(" · ");
  }
  return daily;
}

export function HabitCard({
  habit,
  onEdit,
  onCompleted,
}: {
  habit: Habit;
  onEdit: () => void;
  onCompleted: (xp: number) => void;
}) {
  const t = useLocale();
  const customTags = useStore((s) => s.customTags);
  const currentXp = useStore((s) => s.xp);
  const today = todayISO();
  const done = habit.completions.includes(today);
  const streak = computeStreak(habit);
  const expired = habit.endDate && habit.endDate < today;

  const allTagsMap = new Map([
    ...TAGS.map((tag) => [tag.id, tag] as const),
    ...customTags.map((tag) => [tag.id, tag] as const),
  ]);

  return (
    <div
      className={`group relative flex items-center gap-3 rounded-2xl bg-card p-3 shadow-card transition ${
        done ? "opacity-80" : ""
      }`}
    >
      <button
        onClick={() => {
          const levelBefore = levelFromXp(currentXp).level;
          const delta = toggleComplete(habit.id);
          if (delta > 0) {
            onCompleted(delta);
            const levelAfter = levelFromXp(currentXp + delta).level;
            if (levelAfter > levelBefore) {
              toast.success(`Level Up! 🎉`, {
                description: `You reached level ${levelAfter}!`,
                duration: 4000,
              });
            }
          }
        }}
        disabled={!!expired}
        className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full transition-all duration-150 active:scale-90 ${
          done
            ? "bg-gradient-success text-success-foreground shadow-glow animate-pop"
            : "border-2 border-primary/40 bg-primary/8 text-foreground hover:border-primary hover:bg-primary/15 hover:shadow-glow"
        } ${expired ? "cursor-not-allowed opacity-40" : ""}`}
        aria-label={done ? "Mark incomplete" : "Mark complete"}
      >
        {done ? (
          <Check className="h-7 w-7" strokeWidth={3} />
        ) : (
          <HabitIcon id={habit.emoji} className="h-7 w-7" />
        )}
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
            {formatFrequency(habit, t.daily, t.once, t.noDays)}
          </span>
          {habit.endDate && (
            <span
              className={`rounded-full px-1.5 py-0.5 ${
                expired ? "bg-destructive/20 text-destructive" : "bg-muted"
              }`}
            >
              {expired ? t.ended : t.until(habit.endDate)}
            </span>
          )}
          {habit.tagIds.map((tid) => {
            const tag = allTagsMap.get(tid);
            if (!tag) return null;
            return (
              <Badge
                key={tid}
                style={{
                  backgroundColor: tag.color + "33",
                  color: tag.color,
                  borderColor: "transparent",
                }}
                className="px-1.5 py-0 text-[10px] font-medium"
              >
                {tag.label}
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
            if (confirm(t.deleteConfirm(habit.title))) deleteHabit(habit.id);
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
