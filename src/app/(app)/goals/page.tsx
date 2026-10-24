import { prisma } from "@/lib/prisma";
import { deleteGoal } from "@/lib/actions";
import { GoalForm } from "@/components/GoalForm";
import { SavingsGoalCard } from "@/components/SavingsGoalCard";

export const dynamic = "force-dynamic";

export default async function GoalsPage() {
  const goals = await prisma.savingsGoal.findMany({
    include: { transactions: { where: { type: "SAVINGS" } } },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold text-ink-primary">Savings goals</h1>

      <section className="space-y-4">
        {goals.length === 0 ? (
          <p className="text-sm text-ink-muted">No savings goals yet — create one below.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {goals.map((g) => (
              <div key={g.id} className="space-y-2">
                <SavingsGoalCard
                  name={g.name}
                  category={g.category}
                  target={g.targetAmount}
                  currency={g.currency}
                  saved={g.transactions.reduce((sum, t) => sum + t.amount, 0)}
                />
                <form action={deleteGoal.bind(null, g.id)}>
                  <button
                    type="submit"
                    className="text-xs text-ink-muted hover:text-status-critical"
                  >
                    Delete goal
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">
          New goal
        </h2>
        <GoalForm />
      </section>
    </div>
  );
}
