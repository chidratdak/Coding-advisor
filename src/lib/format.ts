export const CURRENCIES = [
  { code: "CNY", label: "CNY - Chinese Yuan" },
  { code: "USD", label: "USD - US Dollar" },
  { code: "LAK", label: "LAK - Lao Kip" },
  { code: "THB", label: "THB - Thai Baht" },
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number]["code"];

// A generous cap for a single amount - large enough for any real personal
// transaction, small enough to catch a fat-fingered extra digit or two.
export const MAX_AMOUNT = 999_999_999.99;

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

// Fixed order, never cycled - matches the categorical slot order (the 7
// palette-photo colors: Fern, Bluebell, Honey, Peony, Fennel, Pistachio,
// Cherry Blossom). Only the first 7 get a distinct color; everything after
// folds into slot 8 ("Other") - each slice still carries its own label in
// the list beside the chart, so sharing a color past the 7th doesn't hurt
// readability.
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

const DISTINCT_SLOTS = 7;
const OTHER_SLOT = 8;

export function seriesSlotFor(category: string): number {
  const idx = CATEGORY_COLOR_ORDER.indexOf(category as any);
  // Fold anything past the distinct slots into the shared "Other" slot - never cycle.
  return idx === -1 || idx >= DISTINCT_SLOTS ? OTHER_SLOT : idx + 1;
}
