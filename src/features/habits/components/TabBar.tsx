import { BarChart3, Gift, ListTodo } from "lucide-react";
import { useLocale } from "@/lib/i18n";

export type Tab = "today" | "stats" | "rewards";

interface TabBarProps {
  tab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function TabBar({ tab, onTabChange }: TabBarProps) {
  const t = useLocale();

  const items: { id: Tab; icon: React.ReactNode; label: string }[] = [
    { id: "today",   icon: <ListTodo className="h-3.5 w-3.5" />,  label: t.tabHabits  },
    { id: "stats",   icon: <BarChart3 className="h-3.5 w-3.5" />, label: t.tabStats   },
    { id: "rewards", icon: <Gift className="h-3.5 w-3.5" />,      label: t.tabRewards },
  ];

  return (
    <div className="sticky top-0 z-10 -mt-4 px-5">
      <div className="flex rounded-full border border-border bg-card/90 p-1 backdrop-blur-sm shadow-card">
        {items.map(({ id, icon, label }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold transition-all duration-200 ${
              tab === id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
