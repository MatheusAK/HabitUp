import { useState } from "react";
import { Globe, Minus, Plus, RotateCcw, Wrench } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { addXp, resetAllData, setDevMode, setLocale, useStore } from "@/lib/habits-store";
import { useLocale, type Locale } from "@/lib/i18n";

const LANGUAGES: { value: Locale; label: string; flag: string }[] = [
  { value: "en", label: "English", flag: "🇺🇸" },
  { value: "pt-BR", label: "Português (BR)", flag: "🇧🇷" },
];

export function SettingsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const t = useLocale();
  const devMode = useStore((s) => s.devMode);
  const locale = useStore((s) => s.locale);
  const xp = useStore((s) => s.xp);
  const [confirming, setConfirming] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{t.settingsTitle}</DialogTitle>
          <DialogDescription>{t.settingsDesc}</DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Language */}
          <div className="rounded-xl border border-border bg-card/60 p-3">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="h-4 w-4 text-primary" />
              <p className="text-sm font-semibold">{t.languageLabel}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.value}
                  onClick={() => setLocale(lang.value)}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    locale === lang.value
                      ? "bg-gradient-hero text-primary-foreground shadow-glow"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  }`}
                >
                  <span className="text-base">{lang.flag}</span>
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dev mode */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-card/60 p-3">
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-semibold">{t.devMode}</p>
                <p className="text-xs text-muted-foreground">{t.devModeDesc}</p>
              </div>
            </div>
            <Switch checked={devMode} onCheckedChange={setDevMode} />
          </div>

          {devMode && (
            <div className="rounded-xl border border-dashed border-primary/40 bg-primary/5 p-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                {t.xpDebug(xp)}
              </p>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {[-50, -10, +10, +50].map((d) => (
                  <Button
                    key={d}
                    size="sm"
                    variant={d < 0 ? "outline" : "default"}
                    onClick={() => addXp(d)}
                  >
                    {d < 0 ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                    {Math.abs(d)}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Reset */}
          <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-3">
            <p className="text-sm font-semibold text-destructive">{t.resetAllData}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t.resetAllDataDesc}</p>
            {confirming ? (
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  variant="destructive"
                  className="flex-1"
                  onClick={() => {
                    resetAllData();
                    setConfirming(false);
                    onOpenChange(false);
                    toast.success(t.allDataReset);
                  }}
                >
                  {t.confirmReset}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setConfirming(false)}>
                  {t.cancelBtn}
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="mt-3 w-full border-destructive/40 text-destructive hover:bg-destructive/10"
                onClick={() => setConfirming(true)}
              >
                <RotateCcw className="mr-2 h-3.5 w-3.5" /> {t.resetEverything}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
