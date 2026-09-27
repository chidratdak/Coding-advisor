export const CURRENCIES = [
  { code: "CNY", label: "CNY - Chinese Yuan" },
  { code: "USD", label: "USD - US Dollar" },
  { code: "LAK", label: "LAK - Lao Kip" },
  { code: "THB", label: "THB - Thai Baht" },
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
  "Drinks",
  "Beauty & Self-Care",
  "Groceries",
  "Personal Items",
  "Education",
  "Utilities",
  "Transport",
  "Family",
  "Others",
] as const;

export const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Gift",
  "Investment",
  "Other",
] as const;

export const SAVINGS_CATEGORIES = ["Stocks", "Gold", "Emergency Fund"] as const;

// Fixed order, never cycled - matches the categorical slot order.
// Only the first 7 get a distinct color; everything after folds into
// slot 8 ("Other") - each bar still carries its own text label, so
// sharing a color past the 7th category doesn't hurt readability.
export const CATEGORY_COLOR_ORDER = [
  "Food",
  "Drinks",
  "Beauty & Self-Care",
  "Groceries",
  "Personal Items",
  "Education",
  "Utilities",
  "Transport",
  "Family",
  "Others",
  "Salary",
  "Freelance",
  "Gift",
  "Investment",
  "Other",
] as const;

export function seriesSlotFor(category: string): number {
  const idx = CATEGORY_COLOR_ORDER.indexOf(category as any);
  // 8 categorical slots available; fold anything past slot 8 into "Other" (slot 8) - never cycle.
  const slot = idx === -1 || idx >= 8 ? 8 : idx + 1;
  return slot;
}
