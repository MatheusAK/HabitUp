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
    { id: "today",   icon: <ListTodo className="h-4 w-4" />,  label: t.tabHabits  },
    { id: "stats",   icon: <BarChart3 className="h-4 w-4" />, label: t.tabStats   },
    { id: "rewards", icon: <Gift className="h-4 w-4" />,      label: t.tabRewards },
  ];

  return (
    <div className="sticky top-0 z-10 -mt-3 px-4">
      <div className="flex rounded-2xl bg-card/95 p-0.5 backdrop-blur-md border border-border/50">
        {items.map(({ id, icon, label }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-[13px] font-semibold transition-all duration-200 ${
              tab === id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground/80 hover:text-foreground"
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
