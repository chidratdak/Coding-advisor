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
          <div key={d.category} role="row" className="space-y-1">
            <div className="flex items-baseline justify-between text-sm" role="cell">
              <span className="text-ink-secondary">{d.category}</span>
              <span className="tabular-nums text-ink-primary">
                {formatCurrency(d.amount, currency)}
              </span>
            </div>
            <div className="rounded bg-line-grid" role="cell">
              <div
                className="h-3 rounded"
                style={{
                  width: `${Math.max(pct, 2)}%`,
                  backgroundColor: `var(--series-${slot})`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
