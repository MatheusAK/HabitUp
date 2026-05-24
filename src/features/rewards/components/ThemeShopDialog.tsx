import { Lock, Store } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { setActiveTheme, unlockTheme, THEMES, type Theme } from "@/lib/habits-store";

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
}: {
  theme: Theme;
  owned: boolean;
  canUnlock: boolean;
  active: boolean;
}) {
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
        active ? "ring-2 ring-primary shadow-glow" : ""
      } ${!owned && !canUnlock ? "opacity-60" : "hover:scale-[1.02]"}`}
    >
      <div
        className="absolute inset-0"
        data-theme={theme.id}
        style={{ background: "var(--gradient-hero)" }}
      />
      <div className="relative flex h-full flex-col justify-between p-3">
        <div className="text-sm font-semibold text-white drop-shadow">{theme.name}</div>
        <div className="text-[11px] text-white/90">
          {owned
            ? active
              ? "Active"
              : "Tap to apply"
            : canUnlock
              ? "Tap to unlock"
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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Store className="h-4 w-4 text-primary" /> Theme Shop
          </DialogTitle>
          <DialogDescription>
            New themes unlock every 3 levels after Candy. Reach Lvl 20 to collect them all.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          {THEMES.map((t) => (
            <ThemeShopCard
              key={t.id}
              theme={t}
              owned={ownedThemes.includes(t.id)}
              canUnlock={level >= t.unlockLevel}
              active={activeTheme === t.id}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
