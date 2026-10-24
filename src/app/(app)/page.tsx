import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StatTile } from "@/components/StatTile";
import { CategoryPieChart } from "@/components/CategoryPieChart";
import { SavingsGoalCard } from "@/components/SavingsGoalCard";
import { TransactionList } from "@/components/TransactionList";
import { MonthYearPicker } from "@/components/MonthYearPicker";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  const [allTransactions, goals] = await Promise.all([
    prisma.transaction.findMany({ orderBy: [{ date: "desc" }, { createdAt: "desc" }] }),
    prisma.savingsGoal.findMany({
      include: { transactions: { where: { type: "SAVINGS" } } },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const now = new Date();
  const params = await searchParams;
  const parsedMonth = Number(params.month);
  const parsedYear = Number(params.year);
  const month =
    Number.isInteger(parsedMonth) && parsedMonth >= 1 && parsedMonth <= 12
      ? parsedMonth
      : now.getUTCMonth() + 1;
  const year = Number.isInteger(parsedYear) && parsedYear >= 2000 && parsedYear <= 2100 ? parsedYear : now.getUTCFullYear();

  const isCurrentMonth = month === now.getUTCMonth() + 1 && year === now.getUTCFullYear();

  const monthStart = new Date(Date.UTC(year, month - 1, 1));
  const monthEnd = new Date(Date.UTC(year, month, 1));
  const transactions = allTransactions.filter((t) => t.date >= monthStart && t.date < monthEnd);

  const years = Array.from(
    new Set([...allTransactions.map((t) => t.date.getUTCFullYear()), now.getUTCFullYear()])
  ).sort((a, b) => b - a);

  const currencies = Array.from(new Set(transactions.map((t) => t.currency))).sort();

  const recent = transactions.slice(0, 10);

  const todayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-ink-primary">Dashboard</h1>
        <Link
          href="/add"
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-ink hover:opacity-90"
        >
          + Add transaction
        </Link>
      </div>

      <MonthYearPicker month={month} year={year} years={years} />

      {allTransactions.length === 0 && (
        <div className="rounded-lg border border-line-border bg-surface p-6 text-center text-sm text-ink-secondary">
          No transactions yet.{" "}
          <Link href="/add" className="font-medium text-ink-primary underline underline-offset-2">
            Add your first one
          </Link>
          .
        </div>
      )}

      {allTransactions.length > 0 && currencies.length === 0 && (
        <div className="rounded-lg border border-line-border bg-surface p-6 text-center text-sm text-ink-secondary">
          No transactions for this month.
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
        const spentToday = allTransactions
          .filter(
            (t) =>
              t.currency === currency &&
              t.type === "EXPENSE" &&
              t.date >= todayStart &&
              t.date < todayEnd
          )
          .reduce((sum, t) => sum + t.amount, 0);

        // Savings contributions count as "where the money goes" too, each
        // shown under its goal's name - but stay out of the Expenses stat
        // above, which is spending only.
        const byCategory = new Map<string, number>();
        for (const t of rows) {
          if (t.type !== "EXPENSE" && t.type !== "SAVINGS") continue;
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
            <div className={`grid grid-cols-2 gap-4 ${isCurrentMonth ? "sm:grid-cols-5" : "sm:grid-cols-4"}`}>
              <StatTile
                label="Remaining"
                amount={remaining}
                currency={currency}
                tone={remaining < 0 ? "critical" : "good"}
              />
              {isCurrentMonth && (
                <StatTile label="Spent Today" amount={spentToday} currency={currency} tone="critical" />
              )}
              <StatTile label="Income" amount={totalIncome} currency={currency} />
              <StatTile label="Expenses" amount={totalExpense} currency={currency} />
              <StatTile label="Saved" amount={totalSaved} currency={currency} />
            </div>

            <div className="rounded-lg border border-line-border bg-surface p-5">
              <h3 className="mb-4 text-sm font-medium text-ink-secondary">
                Where your money goes
              </h3>
              <CategoryPieChart data={categoryTotals} currency={currency} />
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
            <Link href="/goals" className="text-sm font-medium text-ink-primary underline underline-offset-2">
              Manage goals
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {goals.map((g) => (
              <SavingsGoalCard
                key={g.id}
                name={g.name}
                category={g.category}
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
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">
              Recent transactions
            </h2>
            <Link
              href="/transactions"
              className="text-sm font-medium text-ink-primary underline underline-offset-2"
            >
              View all ({allTransactions.length})
            </Link>
          </div>
          <div className="rounded-lg border border-line-border bg-surface p-5">
            <TransactionList rows={recent} />
          </div>
        </section>
      )}
    </div>
  );
}
