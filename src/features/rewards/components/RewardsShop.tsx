import { useState } from "react";
import { Palette, Store } from "lucide-react";
import { levelFromXp, THEMES, useStore } from "@/lib/habits-store";
import { useLocale } from "@/lib/i18n";
import { ThemeCarousel } from "./ThemeCarousel";
import { ThemeShopDialog } from "./ThemeShopDialog";
import { CustomTagsChips } from "./CustomTagsChips";
import { AchievementsCompact } from "./AchievementsCompact";

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

  const ownedCount = ownedThemes.length;
  const totalThemes = THEMES.length;

  return (
    <div className="space-y-5">
      {/* Themes Section - Compact carousel */}
      <section>
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {t.themes}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium text-muted-foreground">
              {ownedCount}/{totalThemes}
            </span>
            <button
              onClick={() => setShopOpen(true)}
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary transition hover:bg-primary/15 active:scale-95"
            >
              <Store className="h-3 w-3" /> {t.themeShop}
            </button>
          </div>
        </div>
        <ThemeCarousel
          themes={visibleThemes}
          ownedThemes={ownedThemes}
          activeTheme={activeTheme}
          level={level}
        />
      </section>

      {/* Custom Tags - Modern chips */}
      <CustomTagsChips customTags={customTags} level={level} />

      {/* Achievements - Compact grid */}
      <AchievementsCompact />

      {/* Theme Shop Dialog */}
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
