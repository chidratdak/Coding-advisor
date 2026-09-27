import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { logout } from "@/lib/auth-actions";
import { BottomNav } from "@/components/BottomNav";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();

  return (
    <>
      <header className="border-b border-line-border bg-surface">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="text-lg font-semibold text-ink-primary">
            Money Tracker
          </Link>
          <div className="flex items-center gap-6 text-sm font-medium text-ink-secondary">
            <nav className="hidden items-center gap-6 sm:flex">
              <Link href="/" className="hover:text-ink-primary">
                Dashboard
              </Link>
              <Link href="/add" className="hover:text-ink-primary">
                Add Transaction
              </Link>
              <Link href="/goals" className="hover:text-ink-primary">
                Savings Goals
              </Link>
            </nav>
            <form action={logout}>
              <button type="submit" className="hover:text-ink-primary">
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8 pb-24 sm:px-6 sm:pb-8">{children}</main>
      <BottomNav />
    </>
  );
}
