import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { TransactionForm } from "@/components/TransactionForm";

export const dynamic = "force-dynamic";

export default async function AddTransactionPage() {
  const userId = await requireAuth();

  const goals = await prisma.savingsGoal.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, currency: true },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-ink-primary">Add a transaction</h1>
      <TransactionForm goals={goals} />
    </div>
  );
}
