import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { type Habit } from "@/lib/habits-store";
import { HabitCard } from "./HabitCard";

interface HabitListProps {
  mounted: boolean;
  visibleHabits: Habit[];
  onEdit: (habit: Habit) => void;
}

export function HabitList({ mounted, visibleHabits, onEdit }: HabitListProps) {
  if (!mounted) {
    return <div className="h-32 animate-pulse rounded-2xl bg-card/40" />;
  }

  if (visibleHabits.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center">
        <Sparkles className="mx-auto h-8 w-8 text-primary" />
        <p className="mt-3 font-semibold">No habits yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Tap the + button to create your first habit and start a streak.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {visibleHabits.map((h) => (
        <HabitCard
          key={h.id}
          habit={h}
          onEdit={() => onEdit(h)}
          onCompleted={(delta) => {
            toast.success(`+${delta} XP`, {
              description: "Keep that streak alive 🔥",
            });
          }}
        />
      ))}
    </div>
  );
}
