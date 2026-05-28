import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { type Habit } from "@/lib/habits-store";
import { useLocale } from "@/lib/i18n";
import { HabitCard } from "./HabitCard";

interface HabitListProps {
  mounted: boolean;
  visibleHabits: Habit[];
  selectedDate: string;
  onEdit: (habit: Habit) => void;
}

export function HabitList({ mounted, visibleHabits, selectedDate, onEdit }: HabitListProps) {
  const t = useLocale();

  if (!mounted) {
    return <div className="h-32 animate-pulse rounded-2xl bg-card/40" />;
  }

  if (visibleHabits.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center">
        <Sparkles className="mx-auto h-8 w-8 text-primary" />
        <p className="mt-3 font-semibold">{t.noHabitsTitle}</p>
        <p className="mt-1 text-sm text-muted-foreground">{t.noHabitsBody}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {visibleHabits.map((h) => (
        <HabitCard
          key={h.id}
          habit={h}
          selectedDate={selectedDate}
          onEdit={() => onEdit(h)}
          onCompleted={(delta) => {
            if (delta > 0) {
              toast.success(`+${delta} XP`, { description: t.streakToast });
            }
          }}
        />
      ))}
    </div>
  );
}
