import Link from "next/link";
import { setupAccount } from "@/lib/auth-actions";

export const dynamic = "force-dynamic";

const ERROR_MESSAGES: Record<string, string> = {
  username: "Enter a username.",
  pin: "Your PIN must be exactly 4 digits.",
  mismatch: "The two PINs don't match.",
  taken: "That username is already taken — pick another.",
};

export default async function SetupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-page px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-ink-primary">Create your account</h1>
          <p className="mt-1 text-sm text-ink-secondary">
            Choose a username and a 4-digit PIN. Your data stays private to your account.
          </p>
        </div>

        <form action={setupAccount} className="space-y-4 rounded-lg border border-line-border bg-surface p-6">
          {error && (
            <p className="rounded-md border border-status-critical p-3 text-sm text-status-critical">
              {ERROR_MESSAGES[error] || "Something went wrong. Try again."}
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
              maxLength={40}
              autoComplete="username"
              className="w-full rounded-md border border-line-border bg-transparent px-3 py-2 text-ink-primary"
              placeholder="e.g. alex"
            />
          </div>

          <div>
            <label htmlFor="pin" className="mb-1 block text-sm font-medium text-ink-secondary">
              4-digit PIN
            </label>
            <input
              id="pin"
              name="pin"
              type="password"
              inputMode="numeric"
              pattern="[0-9]{4}"
              maxLength={4}
              required
              autoComplete="new-password"
              className="w-full rounded-md border border-line-border bg-transparent px-3 py-2 text-center text-2xl tracking-[0.5em] text-ink-primary"
              placeholder="••••"
            />
          </div>

          <div>
            <label htmlFor="confirmPin" className="mb-1 block text-sm font-medium text-ink-secondary">
              Confirm PIN
            </label>
            <input
              id="confirmPin"
              name="confirmPin"
              type="password"
              inputMode="numeric"
              pattern="[0-9]{4}"
              maxLength={4}
              required
              autoComplete="new-password"
              className="w-full rounded-md border border-line-border bg-transparent px-3 py-2 text-center text-2xl tracking-[0.5em] text-ink-primary"
              placeholder="••••"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-ink hover:opacity-90"
          >
            Create account
          </button>
        </form>

        <p className="text-center text-sm text-ink-secondary">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-ink-primary underline underline-offset-2">
            Log in
          </Link>
        </p>

        <p className="text-center text-xs text-ink-muted">
          This PIN is a convenience lock, not bank-grade security — pick something your close
          friends couldn't easily guess if you're sharing this app with them.
        </p>
      </div>
    </div>
  );
}
