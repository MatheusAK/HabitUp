import { Lock } from "lucide-react";
import { TAG_COLORS } from "@/lib/habits-store";

interface TagColorsGridProps {
  level: number;
}

export function TagColorsGrid({ level }: TagColorsGridProps) {
  return (
    <div className="grid grid-cols-6 gap-2 rounded-2xl bg-card/60 p-3 shadow-card">
      {TAG_COLORS.map((c) => {
        const unlocked = level >= c.unlockLevel;
        return (
          <div
            key={c.value}
            className="flex flex-col items-center gap-1"
            title={`${c.name} · Lvl ${c.unlockLevel}`}
          >
            <div
              className={`relative flex h-9 w-9 items-center justify-center rounded-full ${
                unlocked ? "" : "opacity-40 grayscale"
              }`}
              style={{ backgroundColor: c.value }}
            >
              {!unlocked && <Lock className="h-3.5 w-3.5 text-white/90" />}
            </div>
            <span className="text-[10px] text-muted-foreground">
              {unlocked ? c.name : `L${c.unlockLevel}`}
            </span>
          </div>
        );
      })}
    </div>
  );
}
