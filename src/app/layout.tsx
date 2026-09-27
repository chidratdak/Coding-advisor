import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Money Tracker",
  description: "Track your daily income, expenses, and savings goals.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans" style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif' }}>
        <header className="border-b border-line-border bg-surface">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-lg font-semibold text-ink-primary">
              Money Tracker
            </Link>
            <nav className="flex gap-6 text-sm font-medium text-ink-secondary">
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
          </div>
        </header>
        <main className="mx-auto max-w-4xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
