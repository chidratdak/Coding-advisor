import { formatCurrency, seriesSlotFor } from "@/lib/format";

type CategoryTotal = { category: string; amount: number };

const R = 70;
const STROKE = 32;
const CIRCUMFERENCE = 2 * Math.PI * R;

export function CategoryPieChart({
  data,
  currency,
}: {
  data: CategoryTotal[];
  currency: string;
}) {
  if (data.length === 0) {
    return (
      <p className="text-sm text-ink-muted">
        No expenses logged yet for this currency.
      </p>
    );
  }

  const total = data.reduce((sum, d) => sum + d.amount, 0);

  // Order the ring by color slot (not amount) so every category sharing the
  // "Other" fold color sits next to the others that share it - otherwise a
  // different-colored slice could land between them and split one color
  // into two disconnected arcs.
  const ringOrder = data
    .slice()
    .sort((a, b) => seriesSlotFor(a.category) - seriesSlotFor(b.category));

  let cumulative = 0;
  const segments = ringOrder.map((d) => {
    const fraction = total > 0 ? d.amount / total : 0;
    const rawLength = fraction * CIRCUMFERENCE;
    const gap = data.length > 1 ? Math.min(5, rawLength * 0.2) : 0;
    const renderLength = Math.max(rawLength - gap, 0);
    const offset = -cumulative;
    cumulative += rawLength;
    return {
      ...d,
      fraction,
      renderLength,
      offset,
      slot: seriesSlotFor(d.category),
    };
  });

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
      <div className="relative shrink-0">
        <svg width={180} height={180} viewBox="0 0 200 200">
          <g transform="rotate(-90 100 100)">
            {segments.map((s) => (
              <circle
                key={s.category}
                cx={100}
                cy={100}
                r={R}
                fill="none"
                stroke={`var(--series-${s.slot})`}
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeDasharray={`${s.renderLength} ${CIRCUMFERENCE - s.renderLength}`}
                strokeDashoffset={s.offset}
              >
                <title>
                  {s.category}: {formatCurrency(s.amount, currency)} ({s.fraction * 100 < 1 && s.fraction > 0 ? "<1" : (s.fraction * 100).toFixed(0)}%)
                </title>
              </circle>
            ))}
          </g>
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs text-ink-muted">Total spent</span>
          <span className="text-lg font-semibold text-ink-primary">
            {formatCurrency(total, currency)}
          </span>
        </div>
      </div>

      <ul className="w-full min-w-0 space-y-2" aria-label="Spending by category">
        {segments
          .slice()
          .sort((a, b) => b.amount - a.amount)
          .map((s) => (
            <li key={s.category} className="flex items-center gap-2 text-sm">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: `var(--series-${s.slot})` }}
                aria-hidden
              />
              <span className="min-w-0 flex-1 truncate text-ink-secondary">{s.category}</span>
              <span className="shrink-0 tabular-nums text-ink-muted">
                {s.fraction * 100 < 1 && s.fraction > 0 ? "<1" : (s.fraction * 100).toFixed(0)}%
              </span>
              <span className="w-24 shrink-0 text-right tabular-nums text-ink-primary">
                {formatCurrency(s.amount, currency)}
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
}
