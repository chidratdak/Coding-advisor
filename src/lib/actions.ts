"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Keeps amounts within a range currency formatting and the UI can display sanely.
const MAX_AMOUNT = 999_999_999.99;

export async function createTransaction(formData: FormData) {
  const userId = await requireAuth();

  const type = String(formData.get("type"));
  const amount = Number(formData.get("amount"));
  const category = String(formData.get("category") || "Other");
  const note = String(formData.get("note") || "").trim() || null;
  const dateInput = String(formData.get("date") || "");
  const goalId = String(formData.get("goalId") || "") || null;
  let currency = String(formData.get("currency") || "USD");

  if (!["INCOME", "EXPENSE", "SAVINGS"].includes(type)) {
    throw new Error("Invalid transaction type.");
  }
  if (!Number.isFinite(amount) || amount <= 0 || amount > MAX_AMOUNT) {
    throw new Error(`Amount must be a positive number up to ${MAX_AMOUNT.toLocaleString()}.`);
  }

  if (type === "SAVINGS") {
    if (!goalId) throw new Error("Pick a savings goal.");
    const goal = await prisma.savingsGoal.findFirstOrThrow({ where: { id: goalId, userId } });
    // A goal is denominated in one currency - the contribution must match it.
    currency = goal.currency;
  }

  await prisma.transaction.create({
    data: {
      userId,
      type: type as "INCOME" | "EXPENSE" | "SAVINGS",
      amount,
      currency,
      category: type === "SAVINGS" ? "Savings" : category,
      note,
      date: dateInput ? new Date(dateInput) : new Date(),
      goalId: type === "SAVINGS" ? goalId : null,
    },
  });

  revalidatePath("/");
  redirect("/");
}

export async function deleteTransaction(id: string) {
  const userId = await requireAuth();
  await prisma.transaction.deleteMany({ where: { id, userId } });
  revalidatePath("/");
}

export async function createGoal(formData: FormData) {
  const userId = await requireAuth();

  const name = String(formData.get("name") || "").trim();
  const category = String(formData.get("category") || "Emergency Fund");
  const targetAmount = Number(formData.get("targetAmount"));
  const currency = String(formData.get("currency") || "USD");

  if (!name) throw new Error("Goal name is required.");
  if (!Number.isFinite(targetAmount) || targetAmount <= 0 || targetAmount > MAX_AMOUNT) {
    throw new Error(`Target amount must be a positive number up to ${MAX_AMOUNT.toLocaleString()}.`);
  }

  await prisma.savingsGoal.create({ data: { userId, name, category, targetAmount, currency } });

  revalidatePath("/goals");
  revalidatePath("/");
  revalidatePath("/add");
  redirect("/goals");
}

export async function deleteGoal(id: string) {
  const userId = await requireAuth();
  await prisma.savingsGoal.deleteMany({ where: { id, userId } });
  revalidatePath("/goals");
  revalidatePath("/");
}
