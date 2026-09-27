export const CURRENCIES = [
  { code: "USD", label: "USD - US Dollar" },
  { code: "THB", label: "THB - Thai Baht" },
  { code: "CNY", label: "CNY - Chinese Yuan" },
  { code: "LAK", label: "LAK - Lao Kip" },
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number]["code"];

export function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

export const EXPENSE_CATEGORIES = [
  "Food",
  "Housing",
  "Transport",
  "Utilities",
  "Entertainment",
  "Health",
  "Shopping",
  "Other",
] as const;

export const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Gift",
  "Investment",
  "Other",
] as const;

// Fixed order, never cycled - matches the categorical slot order.
export const CATEGORY_COLOR_ORDER = [
  "Food",
  "Housing",
  "Transport",
  "Utilities",
  "Entertainment",
  "Health",
  "Shopping",
  "Salary",
  "Freelance",
  "Gift",
  "Investment",
  "Other",
] as const;

export function seriesSlotFor(category: string): number {
  const idx = CATEGORY_COLOR_ORDER.indexOf(category as any);
  // 8 categorical slots available; fold anything past slot 8 into "Other" (slot 8).
  const slot = idx === -1 ? 8 : (idx % 8) + 1;
  return slot;
}
