import { deleteTransaction } from "@/lib/actions";
import { formatCurrency, formatDate } from "@/lib/format";

type Row = {
  id: string;
  type: string;
  amount: number;
  currency: string;
  category: string;
  note: string | null;
  date: Date;
};

const TYPE_LABEL: Record<string, string> = {
  INCOME: "Income",
  EXPENSE: "Expense",
  SAVINGS: "Savings",
};

const TYPE_TONE: Record<string, string> = {
  INCOME: "text-status-good",
  EXPENSE: "text-status-critical",
  SAVINGS: "text-ink-primary",
};

export function TransactionList({ rows }: { rows: Row[] }) {
  if (rows.length === 0) {
    return <p className="text-sm text-ink-muted">No transactions yet.</p>;
  }

  return (
    <ul className="divide-y divide-line-grid">
      {rows.map((row) => (
        <li key={row.id} className="flex items-center justify-between gap-4 py-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${TYPE_TONE[row.type]}`}>
                {TYPE_LABEL[row.type]}
              </span>
              <span className="text-sm text-ink-secondary">{row.category}</span>
            </div>
            {row.note && (
              <div className="truncate text-xs text-ink-muted">{row.note}</div>
            )}
            <div className="text-xs text-ink-muted">{formatDate(row.date)}</div>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="text-sm font-semibold tabular-nums text-ink-primary">
              {row.type === "EXPENSE" ? "-" : "+"}
              {formatCurrency(row.amount, row.currency)}
            </span>
            <form action={deleteTransaction.bind(null, row.id)}>
              <button
                type="submit"
                className="text-xs text-ink-muted hover:text-status-critical"
                aria-label={`Delete ${TYPE_LABEL[row.type]} transaction`}
              >
                Delete
              </button>
            </form>
          </div>
        </li>
      ))}
    </ul>
  );
}
