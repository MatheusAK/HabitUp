import { CheckCircle2 } from "lucide-react";
import { useStore } from "@/lib/habits-store";

interface WeeklyTotal {
  date: string;
  label: string;
  count: number;
  total: number;
}

interface WeeklyBarChartProps {
  data: WeeklyTotal[];
  title: string;
  subtitle: string;
}

export function WeeklyBarChart({ data, title, subtitle }: WeeklyBarChartProps) {
  const locale = useStore((s) => s.locale);

  const weekDone = data.reduce((n, d) => n + d.count, 0);
  const weekTotal = data.reduce((n, d) => n + d.total, 0);
  const weekRate = weekTotal > 0 ? Math.round((weekDone / weekTotal) * 100) : 0;

  return (
    <div className="rounded-xl bg-card p-3 shadow-card">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="text-[10px] text-muted-foreground">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary leading-none">{weekRate}%</span>
          <span className="text-[10px] text-muted-foreground">
            {weekDone}/{weekTotal}
          </span>
        </div>
      </div>

      <div className="space-y-1.5">
        {data.map((d) => {
          const pct = d.total > 0 ? d.count / d.total : 0;
          const allDone = d.total > 0 && d.count === d.total;
          const hasAny = d.count > 0;
          const dayName = new Date(d.date + "T00:00:00").toLocaleDateString(locale, {
            weekday: "narrow",
          });

          return (
            <div key={d.date} className="flex items-center gap-2">
              <span className="w-4 shrink-0 text-center text-[10px] font-semibold text-muted-foreground">
                {dayName}
              </span>

              <div className="relative h-4 flex-1 overflow-hidden rounded-full bg-muted/40">
                {pct > 0 && (
                  <div
                    className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
                      allDone ? "bg-success" : "bg-primary"
                    }`}
                    style={{ width: `${Math.max(pct * 100, pct > 0 ? 8 : 0)}%` }}
                  />
                )}
              </div>

              <div className="w-10 shrink-0 flex items-center justify-end gap-0.5">
                {allDone && <CheckCircle2 className="h-2.5 w-2.5 text-success shrink-0" />}
                <span
                  className={`text-[10px] font-semibold tabular-nums ${
                    d.total === 0
                      ? "text-muted-foreground/40"
                      : allDone
                        ? "text-success"
                        : hasAny
                          ? "text-primary"
                          : "text-muted-foreground/60"
                  }`}
                >
                  {d.total === 0 ? "—" : `${d.count}/${d.total}`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
