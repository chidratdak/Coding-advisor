import { formatCurrency } from "@/lib/format";

export function SavingsGoalCard({
  name,
  saved,
  target,
  currency,
}: {
  name: string;
  saved: number;
  target: number;
  currency: string;
}) {
  const pct = target > 0 ? Math.min((saved / target) * 100, 100) : 0;
  const reached = saved >= target;

  return (
    <div className="rounded-lg border border-line-border bg-surface p-4">
      <div className="flex items-baseline justify-between">
        <span className="font-medium text-ink-primary">{name}</span>
        <span className="text-sm text-ink-secondary">
          {formatCurrency(saved, currency)} / {formatCurrency(target, currency)}
        </span>
      </div>
      <div className="mt-2 h-3 rounded bg-line-grid">
        <div
          className="h-3 rounded"
          style={{
            width: `${Math.max(pct, saved > 0 ? 2 : 0)}%`,
            backgroundColor: reached ? "var(--status-good)" : "var(--series-1)",
          }}
        />
      </div>
      <div className="mt-1 text-xs text-ink-muted">
        {reached ? "Goal reached" : `${pct.toFixed(0)}% of the way there`}
      </div>
    </div>
  );
}
