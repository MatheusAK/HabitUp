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
    <div className="rounded-2xl bg-card p-4 shadow-card">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="text-[11px] text-muted-foreground">{subtitle}</p>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-xl font-bold text-primary leading-none">{weekRate}%</span>
          <span className="text-[10px] text-muted-foreground">
            {weekDone} / {weekTotal}
          </span>
        </div>
      </div>

      <div className="space-y-2.5">
        {data.map((d) => {
          const pct = d.total > 0 ? d.count / d.total : 0;
          const allDone = d.total > 0 && d.count === d.total;
          const hasAny = d.count > 0;
          const dayName = new Date(d.date + "T00:00:00").toLocaleDateString(locale, {
            weekday: "short",
          });

          return (
            <div key={d.date} className="flex items-center gap-3">
              <span className="w-8 shrink-0 text-right text-[11px] font-medium uppercase text-muted-foreground">
                {dayName}
              </span>

              <div className="relative h-5 flex-1 overflow-hidden rounded-full bg-muted/60">
                {pct > 0 && (
                  <div
                    className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
                      allDone ? "bg-gradient-success" : "bg-gradient-hero"
                    }`}
                    style={{ width: `${Math.max(pct * 100, pct > 0 ? 6 : 0)}%` }}
                  />
                )}
              </div>

              <div className="w-12 shrink-0 flex items-center justify-end gap-1">
                {allDone && <CheckCircle2 className="h-3 w-3 text-success shrink-0" />}
                <span
                  className={`text-[11px] font-semibold tabular-nums ${
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
