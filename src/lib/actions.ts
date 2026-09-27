"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTransaction(formData: FormData) {
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
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Amount must be a positive number.");
  }

  if (type === "SAVINGS") {
    if (!goalId) throw new Error("Pick a savings goal.");
    const goal = await prisma.savingsGoal.findUniqueOrThrow({ where: { id: goalId } });
    // A goal is denominated in one currency - the contribution must match it.
    currency = goal.currency;
  }

  await prisma.transaction.create({
    data: {
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
  await prisma.transaction.delete({ where: { id } });
  revalidatePath("/");
}

export async function createGoal(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const category = String(formData.get("category") || "Emergency Fund");
  const targetAmount = Number(formData.get("targetAmount"));
  const currency = String(formData.get("currency") || "USD");

  if (!name) throw new Error("Goal name is required.");
  if (!Number.isFinite(targetAmount) || targetAmount <= 0) {
    throw new Error("Target amount must be a positive number.");
  }

  await prisma.savingsGoal.create({ data: { name, category, targetAmount, currency } });

  revalidatePath("/goals");
  revalidatePath("/");
  revalidatePath("/add");
  redirect("/goals");
}

export async function deleteGoal(id: string) {
  await prisma.savingsGoal.delete({ where: { id } });
  revalidatePath("/goals");
  revalidatePath("/");
}
