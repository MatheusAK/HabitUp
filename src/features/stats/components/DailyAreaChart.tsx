import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

interface DailyTotal {
  date: string;
  label: string;
  count: number;
  total: number;
}

interface DailyAreaChartProps {
  data: DailyTotal[];
  title: string;
  subtitle: string;
}

export function DailyAreaChart({ data, title, subtitle }: DailyAreaChartProps) {
  const total = data.reduce((n, d) => n + d.count, 0);
  const avg = data.length > 0 ? (total / data.length).toFixed(1) : "0";
  
  return (
    <div className="rounded-xl bg-card p-3 shadow-card">
      <div className="mb-1.5 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="text-[10px] text-muted-foreground">{subtitle}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold leading-none text-primary">{total}</p>
          <p className="text-[9px] text-muted-foreground">~{avg}/dia</p>
        </div>
      </div>
      <div className="h-24 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="fillCount30" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.5} />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              tick={{ fontSize: 8, fill: "var(--muted-foreground)" }}
              interval={6}
              tickLine={false}
              axisLine={false}
              dy={4}
            />
            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 11,
                padding: "6px 10px",
              }}
              labelStyle={{ color: "var(--foreground)", fontWeight: 600 }}
              formatter={(value: number) => [`${value} feitos`, ""]}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="var(--primary)"
              strokeWidth={1.5}
              fill="url(#fillCount30)"
              dot={false}
              activeDot={{ r: 3, fill: "var(--primary)" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
