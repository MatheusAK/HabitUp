import { Check } from "lucide-react";
import { setActiveTheme, unlockTheme, THEME_GRADIENTS, type Theme } from "@/lib/habits-store";
import { useLocale } from "@/lib/i18n";

interface ThemeGridProps {
  themes: Theme[];
  ownedThemes: string[];
  activeTheme: string;
}

export function ThemeGrid({ themes, ownedThemes, activeTheme }: ThemeGridProps) {
  const t = useLocale();

  return (
    <div className="grid grid-cols-2 gap-3">
      {themes.map((theme) => {
        const owned = ownedThemes.includes(theme.id);
        const active = activeTheme === theme.id;
        const gradient = THEME_GRADIENTS[theme.id] ?? THEME_GRADIENTS.midnight;
        return (
          <button
            key={theme.id}
            onClick={() => {
              if (owned) setActiveTheme(theme.id);
              else {
                unlockTheme(theme.id);
                setActiveTheme(theme.id);
              }
            }}
            className={`relative h-24 overflow-hidden rounded-2xl text-left transition-all duration-200 ${
              active ? "ring-2 ring-white/60" : "hover:scale-[1.02] hover:brightness-110"
            }`}
          >
            <div
              className="absolute inset-0"
              style={{ background: gradient }}
            />
            <div className="relative flex h-full flex-col justify-between p-3">
              <div className="text-base font-semibold text-white drop-shadow">{theme.name}</div>
              <div className="text-xs text-white/90">
                {owned ? (active ? t.active : t.tapToApply) : t.tapToUnlock}
              </div>
              {active && (
                <div className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/25 px-2 py-0.5 text-[10px] text-white">
                  <Check className="h-3 w-3" /> {t.active}
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
