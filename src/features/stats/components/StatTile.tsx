interface StatTileProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accent?: string;
}

export function StatTile({ icon, label, value, accent }: StatTileProps) {
  return (
    <div className="rounded-2xl bg-card p-3 shadow-card">
      <div
        className="inline-flex h-8 w-8 items-center justify-center rounded-xl"
        style={{
          background:
            accent ??
            "color-mix(in oklab, var(--primary) calc(0.18 * 100%), transparent)",
        }}
      >
        {icon}
      </div>
      <p className="mt-2 text-2xl font-bold leading-none">{value}</p>
      <p className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
