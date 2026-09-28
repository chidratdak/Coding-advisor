import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { TransactionList } from "@/components/TransactionList";

export const dynamic = "force-dynamic";

export default async function AllTransactionsPage() {
  const userId = await requireAuth();

  const transactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-ink-primary">All transactions</h1>
        <Link href="/" className="text-sm font-medium text-ink-primary underline underline-offset-2">
          Back to dashboard
        </Link>
      </div>

      <div className="rounded-lg border border-line-border bg-surface p-5">
        <TransactionList rows={transactions} />
      </div>
    </div>
  );
}
