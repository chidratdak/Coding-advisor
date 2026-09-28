"use client";

import { useState } from "react";
import Link from "next/link";
import { createTransaction } from "@/lib/actions";
import { CURRENCIES, EXPENSE_CATEGORIES, INCOME_CATEGORIES, MAX_AMOUNT } from "@/lib/format";

type Goal = { id: string; name: string; currency: string };

const SAVINGS_CATEGORY_VALUE = "Savings";

export function TransactionForm({ goals }: { goals: Goal[] }) {
  const [type, setType] = useState<"EXPENSE" | "INCOME">("EXPENSE");
  const [category, setCategory] = useState<string>(EXPENSE_CATEGORIES[0]);
  const today = new Date().toISOString().slice(0, 10);

  const categories = type === "INCOME" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const isGoalContribution = type === "EXPENSE" && category === SAVINGS_CATEGORY_VALUE;
  const effectiveType = isGoalContribution ? "SAVINGS" : type;

  function handleTypeChange(t: "EXPENSE" | "INCOME") {
    setType(t);
    setCategory(t === "INCOME" ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]);
  }

  return (
    <form action={createTransaction} className="space-y-5 rounded-lg border border-line-border bg-surface p-6">
      <div>
        <label className="mb-2 block text-sm font-medium text-ink-secondary">Type</label>
        <div className="flex gap-2">
          {(["EXPENSE", "INCOME"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => handleTypeChange(t)}
              className={`rounded-md px-4 py-2 text-sm font-medium ${
                type === t
                  ? "bg-accent text-accent-ink"
                  : "bg-line-grid text-ink-secondary"
              }`}
            >
              {t === "EXPENSE" ? "Expense" : "Income"}
            </button>
          ))}
        </div>
        <input type="hidden" name="type" value={effectiveType} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="amount" className="mb-1 block text-sm font-medium text-ink-secondary">
            Amount
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            max={MAX_AMOUNT}
            required
            className="w-full rounded-md border border-line-border bg-transparent px-3 py-2 text-ink-primary"
            placeholder="0.00"
          />
        </div>

        {!isGoalContribution && (
          <div>
            <label htmlFor="currency" className="mb-1 block text-sm font-medium text-ink-secondary">
              Currency
            </label>
            <select
              id="currency"
              name="currency"
              defaultValue="CNY"
              className="w-full rounded-md border border-line-border bg-transparent px-3 py-2 text-ink-primary"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div>
        <label htmlFor="category" className="mb-1 block text-sm font-medium text-ink-secondary">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-md border border-line-border bg-transparent px-3 py-2 text-ink-primary"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
          {type === "EXPENSE" && <option value={SAVINGS_CATEGORY_VALUE}>Savings</option>}
        </select>
      </div>

      {isGoalContribution &&
        (goals.length === 0 ? (
          <p className="rounded-md bg-line-grid p-3 text-sm text-ink-secondary">
            You don&apos;t have a savings goal yet.{" "}
            <Link href="/goals" className="font-medium text-ink-primary underline underline-offset-2">
              Create one first
            </Link>
            .
          </p>
        ) : (
          <div>
            <label htmlFor="goalId" className="mb-1 block text-sm font-medium text-ink-secondary">
              Which goal is this for?
            </label>
            <select
              id="goalId"
              name="goalId"
              required
              className="w-full rounded-md border border-line-border bg-transparent px-3 py-2 text-ink-primary"
            >
              {goals.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name} ({g.currency})
                </option>
              ))}
            </select>
          </div>
        ))}

      <div>
        <label htmlFor="date" className="mb-1 block text-sm font-medium text-ink-secondary">
          Date
        </label>
        <input
          id="date"
          name="date"
          type="date"
          defaultValue={today}
          className="w-full rounded-md border border-line-border bg-transparent px-3 py-2 text-ink-primary"
        />
      </div>

      <div>
        <label htmlFor="note" className="mb-1 block text-sm font-medium text-ink-secondary">
          Note (optional)
        </label>
        <input
          id="note"
          name="note"
          type="text"
          maxLength={200}
          className="w-full rounded-md border border-line-border bg-transparent px-3 py-2 text-ink-primary"
          placeholder="e.g. Lunch with friends"
        />
      </div>

      <button
        type="submit"
        disabled={isGoalContribution && goals.length === 0}
        className="w-full rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-ink hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Save transaction
      </button>
    </form>
  );
}
