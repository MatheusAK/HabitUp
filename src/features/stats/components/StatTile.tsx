interface StatTileProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accent?: string;
}

export function StatTile({ icon, label, value, accent }: StatTileProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-card">
      <div
        className="inline-flex h-8 w-8 items-center justify-center rounded-xl"
        style={{
          background:
            accent ??
            "color-mix(in oklab, var(--primary) 14%, transparent)",
        }}
      >
        {icon}
      </div>
      <p className="mt-3 text-2xl font-bold leading-none tracking-tight">{value}</p>
      <p className="mt-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
