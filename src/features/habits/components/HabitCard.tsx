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
  selectedDate,
  onEdit,
  onCompleted,
}: {
  habit: Habit;
  selectedDate: string;
  onEdit: () => void;
  onCompleted: (xp: number) => void;
}) {
  const t = useLocale();
  const customTags = useStore((s) => s.customTags);
  const currentXp = useStore((s) => s.xp);
  const today = todayISO();
  const isToday = selectedDate === today;
  const done = habit.completions.includes(selectedDate);
  const streak = computeStreak(habit);
  const expired = habit.endDate && habit.endDate < selectedDate;

  const allTagsMap = new Map([
    ...TAGS.map((tag) => [tag.id, tag] as const),
    ...customTags.map((tag) => [tag.id, tag] as const),
  ]);

  return (
    <div
      className={`group relative flex items-center gap-2.5 rounded-xl border bg-card p-2.5 shadow-card transition-all ${
        done ? "opacity-60" : "border-border/60"
      }`}
    >
      <button
        onClick={() => {
          const levelBefore = levelFromXp(currentXp).level;
          const delta = toggleComplete(habit.id, selectedDate);
          if (delta !== 0) onCompleted(delta);
          if (delta > 0 && isToday) {
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
        className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-all duration-150 active:scale-90 ${
          done
            ? "bg-success text-success-foreground animate-pop"
            : "border-2 border-primary/35 bg-primary/10 text-primary hover:border-primary/60 hover:bg-primary/18"
        } ${expired ? "cursor-not-allowed opacity-35" : ""}`}
        aria-label={done ? "Mark incomplete" : "Mark complete"}
      >
        {done ? (
          <Check className="h-5 w-5" strokeWidth={2.5} />
        ) : (
          <HabitIcon id={habit.emoji} className="h-5 w-5" />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <h3 className={`truncate text-sm font-semibold leading-snug ${done ? "line-through opacity-50" : ""}`}>
          {habit.title}
        </h3>
        <div className="mt-0.5 flex flex-wrap items-center gap-1">{streak > 0 && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-streak/15 px-1.5 py-0.5 text-[10px] font-semibold text-streak">
              <Flame className="h-2.5 w-2.5" /> {streak}
            </span>
          )}
          <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
            {formatFrequency(habit, t.daily, t.once, t.noDays)}
          </span>
          {habit.endDate && (
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                expired
                  ? "bg-destructive/15 text-destructive"
                  : "bg-muted text-muted-foreground"
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
                  backgroundColor: tag.color + "22",
                  color: tag.color,
                  borderColor: tag.color + "44",
                }}
                className="px-1.5 py-0 text-[9px] font-semibold"
              >
                {tag.label}
              </Badge>
            );
          })}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={onEdit}
          className="rounded-lg p-1 text-muted-foreground transition hover:bg-accent hover:text-foreground"
          aria-label="Edit"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => {
            if (confirm(t.deleteConfirm(habit.title))) deleteHabit(habit.id);
          }}
          className="rounded-lg p-1 text-muted-foreground transition hover:bg-destructive/15 hover:text-destructive"
          aria-label="Delete"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
