import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StatTile } from "@/components/StatTile";
import { CategoryBarChart } from "@/components/CategoryBarChart";
import { SavingsGoalCard } from "@/components/SavingsGoalCard";
import { TransactionList } from "@/components/TransactionList";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [transactions, goals] = await Promise.all([
    prisma.transaction.findMany({ orderBy: { date: "desc" } }),
    prisma.savingsGoal.findMany({
      include: { transactions: { where: { type: "SAVINGS" } } },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const currencies = Array.from(new Set(transactions.map((t) => t.currency))).sort();

  const recent = transactions.slice(0, 15);

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-ink-primary">Dashboard</h1>
        <Link
          href="/add"
          className="rounded-md bg-series-1 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          + Add transaction
        </Link>
      </div>

      {currencies.length === 0 && (
        <div className="rounded-lg border border-line-border bg-surface p-6 text-center text-sm text-ink-secondary">
          No transactions yet.{" "}
          <Link href="/add" className="font-medium text-series-1">
            Add your first one
          </Link>
          .
        </div>
      )}

      {currencies.map((currency) => {
        const rows = transactions.filter((t) => t.currency === currency);
        const totalIncome = rows
          .filter((t) => t.type === "INCOME")
          .reduce((sum, t) => sum + t.amount, 0);
        const totalExpense = rows
          .filter((t) => t.type === "EXPENSE")
          .reduce((sum, t) => sum + t.amount, 0);
        const totalSaved = rows
          .filter((t) => t.type === "SAVINGS")
          .reduce((sum, t) => sum + t.amount, 0);
        const remaining = totalIncome - totalExpense - totalSaved;

        const byCategory = new Map<string, number>();
        for (const t of rows) {
          if (t.type !== "EXPENSE") continue;
          byCategory.set(t.category, (byCategory.get(t.category) ?? 0) + t.amount);
        }
        const categoryTotals = Array.from(byCategory, ([category, amount]) => ({
          category,
          amount,
        })).sort((a, b) => b.amount - a.amount);

        return (
          <section key={currency} className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">
              {currency}
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatTile
                label="Remaining"
                amount={remaining}
                currency={currency}
                tone={remaining < 0 ? "critical" : "good"}
              />
              <StatTile label="Income" amount={totalIncome} currency={currency} />
              <StatTile label="Expenses" amount={totalExpense} currency={currency} />
              <StatTile label="Saved" amount={totalSaved} currency={currency} />
            </div>

            <div className="rounded-lg border border-line-border bg-surface p-5">
              <h3 className="mb-4 text-sm font-medium text-ink-secondary">
                Where your money goes
              </h3>
              <CategoryBarChart data={categoryTotals} currency={currency} />
            </div>
          </section>
        );
      })}

      {goals.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">
              Savings goals
            </h2>
            <Link href="/goals" className="text-sm font-medium text-series-1">
              Manage goals
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {goals.map((g) => (
              <SavingsGoalCard
                key={g.id}
                name={g.name}
                target={g.targetAmount}
                currency={g.currency}
                saved={g.transactions.reduce((sum, t) => sum + t.amount, 0)}
              />
            ))}
          </div>
        </section>
      )}

      {recent.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">
            Recent transactions
          </h2>
          <div className="rounded-lg border border-line-border bg-surface p-5">
            <TransactionList rows={recent} />
          </div>
        </section>
      )}
    </div>
  );
}
