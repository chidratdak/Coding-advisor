import { formatCurrency, seriesSlotFor } from "@/lib/format";

type CategoryTotal = { category: string; amount: number };

export function CategoryBarChart({
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

  const max = Math.max(...data.map((d) => d.amount));

  return (
    <div className="space-y-3" role="table" aria-label="Spending by category">
      {data.map((d) => {
        const pct = max > 0 ? (d.amount / max) * 100 : 0;
        const slot = seriesSlotFor(d.category);
        return (
          <div key={d.category} role="row" className="flex items-center gap-3">
            <div className="w-28 shrink-0 truncate text-sm text-ink-secondary" role="cell">
              {d.category}
            </div>
            <div className="flex-1 rounded bg-line-grid" role="cell">
              <div
                className="h-4 rounded"
                style={{
                  width: `${Math.max(pct, 2)}%`,
                  backgroundColor: `var(--series-${slot})`,
                }}
              />
            </div>
            <div className="w-24 shrink-0 text-right text-sm tabular-nums text-ink-primary" role="cell">
              {formatCurrency(d.amount, currency)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
