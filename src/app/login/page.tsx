import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";
import { login } from "@/lib/auth-actions";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const existing = await prisma.user.count();
  if (existing === 0) redirect("/setup");

  const userId = await getSessionUserId();
  if (userId) redirect("/");

  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-page px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-ink-primary">Money Tracker</h1>
          <p className="mt-1 text-sm text-ink-secondary">Enter your username and PIN.</p>
        </div>

        <form action={login} className="space-y-4 rounded-lg border border-line-border bg-surface p-6">
          {error && (
            <p className="rounded-md border border-status-critical p-3 text-sm text-status-critical">
              Wrong username or PIN.
            </p>
          )}

          <div>
            <label htmlFor="username" className="mb-1 block text-sm font-medium text-ink-secondary">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              autoComplete="username"
              className="w-full rounded-md border border-line-border bg-transparent px-3 py-2 text-ink-primary"
            />
          </div>

          <div>
            <label htmlFor="pin" className="mb-1 block text-sm font-medium text-ink-secondary">
              PIN
            </label>
            <input
              id="pin"
              name="pin"
              type="password"
              inputMode="numeric"
              pattern="[0-9]{4}"
              maxLength={4}
              required
              autoComplete="current-password"
              autoFocus
              className="w-full rounded-md border border-line-border bg-transparent px-3 py-2 text-center text-2xl tracking-[0.5em] text-ink-primary"
              placeholder="••••"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-ink hover:opacity-90"
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  );
}
