import { useState } from "react";
import { Palette, Store } from "lucide-react";
import { levelFromXp, THEMES, useStore } from "@/lib/habits-store";
import { useLocale } from "@/lib/i18n";
import { ThemeGrid } from "./ThemeGrid";
import { ThemeShopDialog } from "./ThemeShopDialog";
import { CustomTagsSection } from "./CustomTagsSection";

export function RewardsShop() {
  const t = useLocale();
  const xp = useStore((s) => s.xp);
  const ownedThemes = useStore((s) => s.ownedThemes);
  const customTags = useStore((s) => s.customTags);
  const activeTheme = useStore((s) => s.activeTheme);
  const { level } = levelFromXp(xp);

  const [shopOpen, setShopOpen] = useState(false);

  const visibleThemes = THEMES.filter(
    (theme) => ownedThemes.includes(theme.id) || level >= theme.unlockLevel,
  );

  return (
    <div className="space-y-6">
      <section>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {t.themes}
            </h2>
          </div>
          <button
            onClick={() => setShopOpen(true)}
            className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition hover:bg-primary/20"
          >
            <Store className="h-3 w-3" /> {t.themeShop}
          </button>
        </div>
        <ThemeGrid
          themes={visibleThemes}
          ownedThemes={ownedThemes}
          activeTheme={activeTheme}
        />
      </section>

      <CustomTagsSection customTags={customTags} level={level} />

      <ThemeShopDialog
        open={shopOpen}
        onOpenChange={setShopOpen}
        ownedThemes={ownedThemes}
        activeTheme={activeTheme}
        level={level}
      />
    </div>
  );
}
