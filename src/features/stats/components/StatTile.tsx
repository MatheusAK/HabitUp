import { useEffect, useRef, useState } from "react";

interface StatTileProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accent?: string;
  highlight?: boolean;
  size?: "normal" | "large";
}

function AnimatedNumber({ value }: { value: number }) {
  const [displayed, setDisplayed] = useState(0);
  const prevValue = useRef(0);
  
  useEffect(() => {
    const start = prevValue.current;
    const end = value;
    const duration = 600;
    const startTime = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      
      setDisplayed(Math.round(start + (end - start) * eased));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
    prevValue.current = value;
  }, [value]);
  
  return <>{displayed}</>;
}

export function StatTile({ icon, label, value, accent, highlight, size = "normal" }: StatTileProps) {
  const isNumber = typeof value === "number";
  const isLarge = size === "large";
  
  return (
    <div 
      className={`relative overflow-hidden rounded-xl border bg-card shadow-card transition-all ${
        highlight ? "border-primary/40" : "border-border/40"
      } ${isLarge ? "p-3" : "p-2.5"}`}
    >
      {highlight && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 to-transparent" />
      )}
      <div className="relative flex items-center gap-2.5">
        <div
          className={`flex shrink-0 items-center justify-center rounded-lg ${isLarge ? "h-9 w-9" : "h-7 w-7"}`}
          style={{
            background: accent ?? "color-mix(in oklab, var(--primary) 14%, transparent)",
          }}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className={`font-bold leading-none tracking-tight ${isLarge ? "text-xl" : "text-lg"}`}>
            {isNumber ? <AnimatedNumber value={value} /> : value}
          </p>
          <p className="mt-0.5 truncate text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}
