"use client";

import { createGoal } from "@/lib/actions";
import { CURRENCIES, SAVINGS_CATEGORIES } from "@/lib/format";

export function GoalForm() {
  return (
    <form action={createGoal} className="space-y-4 rounded-lg border border-line-border bg-surface p-6">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-ink-secondary">
          Goal name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          maxLength={80}
          placeholder="e.g. Emergency fund"
          className="w-full rounded-md border border-line-border bg-transparent px-3 py-2 text-ink-primary"
        />
      </div>

      <div>
        <label htmlFor="category" className="mb-1 block text-sm font-medium text-ink-secondary">
          Category
        </label>
        <select
          id="category"
          name="category"
          className="w-full rounded-md border border-line-border bg-transparent px-3 py-2 text-ink-primary"
        >
          {SAVINGS_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="targetAmount" className="mb-1 block text-sm font-medium text-ink-secondary">
            Target amount
          </label>
          <input
            id="targetAmount"
            name="targetAmount"
            type="number"
            step="0.01"
            min="0.01"
            max="999999999.99"
            required
            className="w-full rounded-md border border-line-border bg-transparent px-3 py-2 text-ink-primary"
            placeholder="0.00"
          />
        </div>
        <div>
          <label htmlFor="currency" className="mb-1 block text-sm font-medium text-ink-secondary">
            Currency
          </label>
          <select
            id="currency"
            name="currency"
            defaultValue="USD"
            className="w-full rounded-md border border-line-border bg-transparent px-3 py-2 text-ink-primary"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-ink hover:opacity-90"
      >
        Create goal
      </button>
    </form>
  );
}
