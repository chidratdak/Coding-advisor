import { formatCurrency } from "@/lib/format";

export function StatTile({
  label,
  amount,
  currency = "USD",
  tone = "neutral",
}: {
  label: string;
  amount: number;
  currency?: string;
  tone?: "neutral" | "good" | "critical";
}) {
  const toneClass =
    tone === "good"
      ? "text-status-good"
      : tone === "critical"
      ? "text-status-critical"
      : "text-ink-primary";

  return (
    <div className="rounded-lg border border-line-border bg-surface p-4">
      <div className="text-sm font-medium text-ink-secondary">{label}</div>
      <div
        className={`mt-1 whitespace-nowrap text-xl font-semibold tabular-nums ${toneClass}`}
        style={{ fontVariantNumeric: "proportional-nums" }}
      >
        {formatCurrency(amount, currency)}
      </div>
    </div>
  );
}
