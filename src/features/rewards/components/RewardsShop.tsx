import { useState } from "react";
import { Palette, Sparkles, Store } from "lucide-react";
import { levelFromXp, THEMES, useStore } from "@/lib/habits-store";
import { ThemeGrid } from "./ThemeGrid";
import { ThemeShopDialog } from "./ThemeShopDialog";
import { TagColorsGrid } from "./TagColorsGrid";
import { CustomTagsSection } from "./CustomTagsSection";

export function RewardsShop() {
  const xp = useStore((s) => s.xp);
  const ownedThemes = useStore((s) => s.ownedThemes);
  const customTags = useStore((s) => s.customTags);
  const activeTheme = useStore((s) => s.activeTheme);
  const { level } = levelFromXp(xp);

  const [shopOpen, setShopOpen] = useState(false);

  const visibleThemes = THEMES.filter(
    (t) => ownedThemes.includes(t.id) || level >= t.unlockLevel,
  );

  return (
    <div className="space-y-6">
      <section>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Themes
            </h2>
          </div>
          <button
            onClick={() => setShopOpen(true)}
            className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition hover:bg-primary/20"
          >
            <Store className="h-3 w-3" /> Theme Shop
          </button>
        </div>
        <ThemeGrid
          themes={visibleThemes}
          ownedThemes={ownedThemes}
          activeTheme={activeTheme}
        />
      </section>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Tag Colors
          </h2>
        </div>
        <TagColorsGrid level={level} />
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
