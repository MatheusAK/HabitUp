import { BarChart3 } from "lucide-react";

export type Tab = "today" | "stats" | "rewards";

interface TabBarProps {
  tab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function TabBar({ tab, onTabChange }: TabBarProps) {
  return (
    <div className="sticky top-0 z-10 -mt-4 px-5">
      <div className="flex rounded-full bg-card p-1 shadow-card">
        {(["today", "stats", "rewards"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => onTabChange(t)}
            className={`flex-1 rounded-full px-3 py-2 text-sm font-semibold capitalize transition ${
              tab === t
                ? "bg-gradient-hero text-primary-foreground shadow-glow"
                : "text-muted-foreground"
            }`}
          >
            {t === "today" ? (
              "Habits"
            ) : t === "stats" ? (
              <span className="inline-flex items-center justify-center gap-1">
                <BarChart3 className="h-3.5 w-3.5" /> Stats
              </span>
            ) : (
              "Rewards"
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
