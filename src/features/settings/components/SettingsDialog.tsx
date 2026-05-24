import { useState } from "react";
import { Minus, Plus, RotateCcw, Wrench } from "lucide-react";
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
import { addXp, resetAllData, setDevMode, useStore } from "@/lib/habits-store";

export function SettingsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const devMode = useStore((s) => s.devMode);
  const xp = useStore((s) => s.xp);
  const [confirming, setConfirming] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Manage your data and developer options.</DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="flex items-center justify-between rounded-xl border border-border bg-card/60 p-3">
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-semibold">DEV MODE</p>
                <p className="text-xs text-muted-foreground">Show XP debug buttons</p>
              </div>
            </div>
            <Switch checked={devMode} onCheckedChange={setDevMode} />
          </div>

          {devMode && (
            <div className="rounded-xl border border-dashed border-primary/40 bg-primary/5 p-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                XP Debug · current {xp}
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

          <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-3">
            <p className="text-sm font-semibold text-destructive">Reset all data</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Deletes habits, XP, unlocks, custom tags, and theme.
            </p>
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
                    toast.success("All data reset");
                  }}
                >
                  Confirm reset
                </Button>
                <Button size="sm" variant="outline" onClick={() => setConfirming(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="mt-3 w-full border-destructive/40 text-destructive hover:bg-destructive/10"
                onClick={() => setConfirming(true)}
              >
                <RotateCcw className="mr-2 h-3.5 w-3.5" /> Reset everything
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
