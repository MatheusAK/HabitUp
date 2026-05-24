import { BarChart3 } from "lucide-react";
import { useLocale } from "@/lib/i18n";

export type Tab = "today" | "stats" | "rewards";

interface TabBarProps {
  tab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function TabBar({ tab, onTabChange }: TabBarProps) {
  const t = useLocale();

  const labels: Record<Tab, React.ReactNode> = {
    today: t.tabHabits,
    stats: (
      <span className="inline-flex items-center justify-center gap-1">
        <BarChart3 className="h-3.5 w-3.5" /> {t.tabStats}
      </span>
    ),
    rewards: t.tabRewards,
  };

  return (
    <div className="sticky top-0 z-10 -mt-4 px-5">
      <div className="flex rounded-full bg-card p-1 shadow-card">
        {(["today", "stats", "rewards"] as Tab[]).map((tab_) => (
          <button
            key={tab_}
            onClick={() => onTabChange(tab_)}
            className={`flex-1 rounded-full px-3 py-2 text-sm font-semibold transition ${
              tab === tab_
                ? "bg-gradient-hero text-primary-foreground shadow-glow"
                : "text-muted-foreground"
            }`}
          >
            {labels[tab_]}
          </button>
        ))}
      </div>
    </div>
  );
}
