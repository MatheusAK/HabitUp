import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const PIE_COLORS = [
  "#a78bfa", "#34d399", "#fbbf24", "#fb7185",
  "#60a5fa", "#f472b6", "#22d3ee", "#c084fc",
];

interface PieEntry {
  name: string;
  emoji: string;
  completions: number;
}

interface DistributionPieProps {
  data: PieEntry[];
  title: string;
  subtitle: string;
}

export function DistributionPie({ data, title, subtitle }: DistributionPieProps) {
  if (data.length === 0) return null;

  return (
    <div className="rounded-2xl bg-card p-3 shadow-card">
      <div className="mb-2 flex items-center justify-between px-1">
        <h3 className="text-sm font-semibold">{title}</h3>
        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
          {subtitle}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="h-36 w-36 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="completions"
                nameKey="name"
                innerRadius={32}
                outerRadius={60}
                paddingAngle={2}
                stroke="var(--card)"
                strokeWidth={2}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="min-w-0 flex-1 space-y-1.5 text-xs">
          {data.map((p, i) => (
            <li key={i} className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
              />
              <span className="truncate">
                {p.emoji} {p.name}
              </span>
              <span className="ml-auto text-muted-foreground">{p.completions}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
