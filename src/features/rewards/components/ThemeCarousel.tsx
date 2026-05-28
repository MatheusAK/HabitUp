import { useState, useRef } from "react";
import { Check, Lock, ChevronLeft, ChevronRight } from "lucide-react";
import { setActiveTheme, unlockTheme, THEME_GRADIENTS, type Theme } from "@/lib/habits-store";
import { useLocale } from "@/lib/i18n";

interface ThemeCarouselProps {
  themes: Theme[];
  ownedThemes: string[];
  activeTheme: string;
  level: number;
}

export function ThemeCarousel({ themes, ownedThemes, activeTheme, level }: ThemeCarouselProps) {
  const t = useLocale();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeft(scrollLeft > 20);
    setShowRight(scrollLeft < scrollWidth - clientWidth - 20);
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 140;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      {/* Left scroll button */}
      {showLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-card/80 p-1.5 shadow-lg backdrop-blur-sm transition hover:bg-card"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-4 w-4 text-foreground" />
        </button>
      )}

      {/* Carousel */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-2.5 overflow-x-auto scrollbar-hide scroll-smooth -mx-1 px-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {themes.map((theme) => {
          const owned = ownedThemes.includes(theme.id);
          const active = activeTheme === theme.id;
          const canUnlock = level >= theme.unlockLevel;
          const gradient = THEME_GRADIENTS[theme.id] ?? THEME_GRADIENTS.midnight;

          return (
            <button
              key={theme.id}
              onClick={() => {
                if (owned) setActiveTheme(theme.id);
                else if (canUnlock) {
                  unlockTheme(theme.id);
                  setActiveTheme(theme.id);
                }
              }}
              className={`group relative h-[68px] w-[130px] shrink-0 overflow-hidden rounded-xl transition-all duration-200 ${
                active
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                  : owned
                    ? "hover:scale-[1.02] hover:shadow-lg"
                    : "opacity-70 grayscale-[30%] hover:opacity-90 hover:grayscale-0"
              } ${!owned && !canUnlock ? "cursor-not-allowed" : ""}`}
            >
              {/* Gradient background */}
              <div className="absolute inset-0" style={{ background: gradient }} />

              {/* Overlay for locked */}
              {!owned && (
                <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
              )}

              {/* Content */}
              <div className="relative flex h-full flex-col justify-between p-2">
                <div className="flex items-start justify-between">
                  <div className="text-xs font-semibold text-white drop-shadow-sm">
                    {theme.name}
                  </div>
                  {active && (
                    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary">
                      <Check className="h-2.5 w-2.5 text-primary-foreground" />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-[9px] font-medium text-white/90">
                    {owned ? (active ? t.active : t.tapToApply) : canUnlock ? t.tapToUnlock : `Lvl ${theme.unlockLevel}`}
                  </div>
                  {!owned && !canUnlock && (
                    <Lock className="h-2.5 w-2.5 text-white/70" />
                  )}
                  {owned && !active && (
                    <span className="rounded-full bg-white/20 px-1 py-0.5 text-[8px] font-bold text-white">
                      Owned
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Right scroll button */}
      {showRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-card/80 p-1.5 shadow-lg backdrop-blur-sm transition hover:bg-card"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-4 w-4 text-foreground" />
        </button>
      )}
    </div>
  );
}
