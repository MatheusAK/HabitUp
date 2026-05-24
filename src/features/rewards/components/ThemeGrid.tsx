import { Check } from "lucide-react";
import { setActiveTheme, unlockTheme, type Theme } from "@/lib/habits-store";

interface ThemeGridProps {
  themes: Theme[];
  ownedThemes: string[];
  activeTheme: string;
}

export function ThemeGrid({ themes, ownedThemes, activeTheme }: ThemeGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {themes.map((t) => {
        const owned = ownedThemes.includes(t.id);
        const active = activeTheme === t.id;
        return (
          <button
            key={t.id}
            onClick={() => {
              if (owned) setActiveTheme(t.id);
              else {
                unlockTheme(t.id);
                setActiveTheme(t.id);
              }
            }}
            className={`relative h-24 overflow-hidden rounded-2xl text-left transition ${
              active ? "ring-2 ring-primary shadow-glow" : "hover:scale-[1.02]"
            }`}
          >
            <div
              className="absolute inset-0"
              data-theme={t.id}
              style={{ background: "var(--gradient-hero)" }}
            />
            <div className="relative flex h-full flex-col justify-between p-3">
              <div className="text-base font-semibold text-white drop-shadow">{t.name}</div>
              <div className="text-xs text-white/90">
                {owned ? (active ? "Active" : "Tap to apply") : "Tap to unlock"}
              </div>
              {active && (
                <div className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/25 px-2 py-0.5 text-[10px] text-white">
                  <Check className="h-3 w-3" /> Active
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
