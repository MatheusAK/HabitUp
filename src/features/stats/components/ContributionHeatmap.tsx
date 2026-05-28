import { useMemo } from "react";
import { toLocalISO, useStore, type Habit } from "@/lib/habits-store";
import { useLocale } from "@/lib/i18n";

interface ContributionHeatmapProps {
  habits: Habit[];
}

function getCompletionData(habits: Habit[], days: number) {
  const data: { date: string; count: number; total: number; intensity: number }[] = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const iso = toLocalISO(d);
    const dow = d.getDay();
    
    const eligible = habits.filter((h) => {
      if (h.createdAt > iso) return false;
      if (h.frequency === "daily") return true;
      if (h.frequency === "specific") return (h.scheduledDays ?? []).includes(dow);
      return false;
    });
    
    const count = habits.filter((h) => h.completions.includes(iso)).length;
    const total = eligible.length;
    const intensity = total > 0 ? count / total : 0;
    
    data.push({ date: iso, count, total, intensity });
  }
  
  return data;
}

export function ContributionHeatmap({ habits }: ContributionHeatmapProps) {
  const t = useLocale();
  const locale = useStore((s) => s.locale);
  
  const data = useMemo(() => getCompletionData(habits, 84), [habits]); // 12 weeks
  
  // Group by weeks (7 days each)
  const weeks: typeof data[] = [];
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7));
  }
  
  // Calculate stats
  const perfectDays = data.filter(d => d.total > 0 && d.count === d.total).length;
  const activeDays = data.filter(d => d.count > 0).length;
  const consistencyRate = data.length > 0 ? Math.round((activeDays / data.length) * 100) : 0;
  
  const getIntensityClass = (intensity: number, total: number) => {
    if (total === 0) return "bg-muted/30";
    if (intensity === 0) return "bg-muted/50";
    if (intensity < 0.25) return "bg-primary/20";
    if (intensity < 0.5) return "bg-primary/40";
    if (intensity < 0.75) return "bg-primary/60";
    if (intensity < 1) return "bg-primary/80";
    return "bg-primary";
  };
  
  const dayLabels = ["D", "S", "T", "Q", "Q", "S", "S"];
  if (locale === "en") {
    dayLabels[0] = "S"; dayLabels[1] = "M"; dayLabels[2] = "T"; 
    dayLabels[3] = "W"; dayLabels[4] = "T"; dayLabels[5] = "F"; dayLabels[6] = "S";
  }

  return (
    <div className="rounded-xl bg-card p-3 shadow-card">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">{t.consistency}</h3>
          <p className="text-[10px] text-muted-foreground">{t.last30days}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-lg font-bold leading-none text-primary">{consistencyRate}%</p>
            <p className="text-[9px] text-muted-foreground">{activeDays} dias</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold leading-none text-success">{perfectDays}</p>
            <p className="text-[9px] text-muted-foreground">{t.perfectDays}</p>
          </div>
        </div>
      </div>
      
      <div className="flex gap-0.5">
        {/* Day labels */}
        <div className="flex flex-col gap-0.5 pr-1">
          {[0, 2, 4, 6].map((i) => (
            <div key={i} className="flex h-2.5 w-2.5 items-center justify-center">
              {i % 2 === 0 && (
                <span className="text-[7px] text-muted-foreground/70">{dayLabels[i]}</span>
              )}
            </div>
          ))}
        </div>
        
        {/* Heatmap grid */}
        <div className="flex flex-1 gap-0.5 overflow-x-auto scrollbar-hide">
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-0.5">
              {week.map((day, dayIdx) => (
                <div
                  key={day.date}
                  className={`h-2.5 w-2.5 rounded-[2px] transition-colors ${getIntensityClass(day.intensity, day.total)}`}
                  title={`${day.date}: ${day.count}/${day.total}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-2 flex items-center justify-end gap-1">
        <span className="text-[8px] text-muted-foreground/70">{t.lessActive}</span>
        <div className="flex gap-0.5">
          <div className="h-2 w-2 rounded-[2px] bg-muted/50" />
          <div className="h-2 w-2 rounded-[2px] bg-primary/25" />
          <div className="h-2 w-2 rounded-[2px] bg-primary/50" />
          <div className="h-2 w-2 rounded-[2px] bg-primary/75" />
          <div className="h-2 w-2 rounded-[2px] bg-primary" />
        </div>
        <span className="text-[8px] text-muted-foreground/70">{t.moreActive}</span>
      </div>
    </div>
  );
}
