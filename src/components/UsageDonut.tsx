import { SERVICES } from "@/lib/services";

const RADIUS = 52;
const STROKE = 16;
const CIRC = 2 * Math.PI * RADIUS;

/**
 * Donut of usage-per-service (mock data from SERVICES.usage).
 * Pure SVG stroke-dasharray, no chart lib.
 */
export function UsageDonut() {
  const total = SERVICES.reduce((sum, s) => sum + s.usage, 0);
  const top = [...SERVICES].sort((a, b) => b.usage - a.usage)[0];

  let offset = 0;
  const arcs = SERVICES.map((s) => {
    const frac = s.usage / total;
    const dash = frac * CIRC;
    const arc = {
      slug: s.slug,
      color: s.color,
      dasharray: `${dash} ${CIRC - dash}`,
      dashoffset: -offset,
    };
    offset += dash;
    return arc;
  });

  const topPct = Math.round((top.usage / total) * 100);

  return (
    <div className="grid grid-cols-[auto_1fr] items-center gap-5">
      <div className="relative h-32 w-32">
        <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
          <circle
            cx="70"
            cy="70"
            r={RADIUS}
            fill="none"
            stroke="var(--border)"
            strokeWidth={STROKE}
          />
          {arcs.map((a) => (
            <circle
              key={a.slug}
              cx="70"
              cy="70"
              r={RADIUS}
              fill="none"
              stroke={a.color}
              strokeWidth={STROKE}
              strokeDasharray={a.dasharray}
              strokeDashoffset={a.dashoffset}
              strokeLinecap="butt"
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[9px] font-semibold uppercase tracking-wide text-muted">
            Mais usado
          </span>
          <span className="mt-0.5 max-w-[70px] text-[11px] font-semibold leading-tight">
            {top.short}
          </span>
          <span className="text-sm font-bold" style={{ color: top.color }}>
            {topPct}%
          </span>
        </div>
      </div>

      <ul className="space-y-2">
        {SERVICES.map((s) => (
          <li key={s.slug} className="flex items-center gap-2 text-sm">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ background: s.color }}
            />
            <span className="flex-1 truncate text-muted">{s.short}</span>
            <span className="font-semibold tabular-nums">
              {Math.round((s.usage / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
