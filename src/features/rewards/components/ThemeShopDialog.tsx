import { Lock, Store } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { setActiveTheme, unlockTheme, THEMES, THEME_GRADIENTS, type Theme } from "@/lib/habits-store";
import { useLocale } from "@/lib/i18n";

interface ThemeShopDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  ownedThemes: string[];
  activeTheme: string;
  level: number;
}

function ThemeShopCard({
  theme,
  owned,
  canUnlock,
  active,
  activeLabel,
  tapToApply,
  tapToUnlock,
}: {
  theme: Theme;
  owned: boolean;
  canUnlock: boolean;
  active: boolean;
  activeLabel: string;
  tapToApply: string;
  tapToUnlock: string;
}) {
  const gradient = THEME_GRADIENTS[theme.id] ?? THEME_GRADIENTS.midnight;

  return (
    <button
      onClick={() => {
        if (owned) setActiveTheme(theme.id);
        else if (canUnlock) {
          unlockTheme(theme.id);
          setActiveTheme(theme.id);
        }
      }}
      disabled={!owned && !canUnlock}
      className={`relative h-24 overflow-hidden rounded-2xl text-left transition ${
        active ? "ring-2 ring-white/60" : ""
      } ${!owned && !canUnlock ? "opacity-60" : "hover:scale-[1.02]"}`}
    >
      <div
        className="absolute inset-0"
        style={{ background: gradient }}
      />
      <div className="relative flex h-full flex-col justify-between p-3">
        <div className="text-sm font-semibold text-white drop-shadow">{theme.name}</div>
        <div className="text-[11px] text-white/90">
          {owned
            ? active
              ? activeLabel
              : tapToApply
            : canUnlock
              ? tapToUnlock
              : `Lvl ${theme.unlockLevel}`}
        </div>
        {!owned && !canUnlock && (
          <Lock className="absolute right-2 top-2 h-4 w-4 text-white/90" />
        )}
      </div>
    </button>
  );
}

export function ThemeShopDialog({
  open,
  onOpenChange,
  ownedThemes,
  activeTheme,
  level,
}: ThemeShopDialogProps) {
  const t = useLocale();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Store className="h-4 w-4 text-primary" /> {t.themeShop}
          </DialogTitle>
          <DialogDescription>{t.themeShopDesc}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          {THEMES.map((theme) => (
            <ThemeShopCard
              key={theme.id}
              theme={theme}
              owned={ownedThemes.includes(theme.id)}
              canUnlock={level >= theme.unlockLevel}
              active={activeTheme === theme.id}
              activeLabel={t.active}
              tapToApply={t.tapToApply}
              tapToUnlock={t.tapToUnlock}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
