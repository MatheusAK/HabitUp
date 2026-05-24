import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface WeeklyTotal {
  date: string;
  label: string;
  count: number;
  total: number;
}

interface WeeklyBarChartProps {
  data: WeeklyTotal[];
}

export function WeeklyBarChart({ data }: WeeklyBarChartProps) {
  return (
    <div className="rounded-2xl bg-card p-3 shadow-card">
      <div className="mb-2 flex items-center justify-between px-1">
        <h3 className="text-sm font-semibold">This week</h3>
        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
          Done vs. planned
        </span>
      </div>
      <div className="h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 6, right: 6, left: -22, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
              tickLine={false}
              axisLine={false}
              width={28}
            />
            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                fontSize: 12,
              }}
            />
            <Bar dataKey="total" fill="var(--muted)" radius={[6, 6, 0, 0]} />
            <Bar dataKey="count" fill="var(--primary)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
