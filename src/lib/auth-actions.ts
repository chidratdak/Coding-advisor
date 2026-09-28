"use server";

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { hashPin, verifyPin, createSession, clearSession } from "@/lib/auth";
import { redirect } from "next/navigation";

const PIN_PATTERN = /^\d{4}$/;

export async function setupAccount(formData: FormData) {
  const username = String(formData.get("username") || "").trim();
  const pin = String(formData.get("pin") || "");
  const confirmPin = String(formData.get("confirmPin") || "");

  if (!username) redirect("/setup?error=username");
  if (!PIN_PATTERN.test(pin)) redirect("/setup?error=pin");
  if (pin !== confirmPin) redirect("/setup?error=mismatch");

  const { hash, salt } = hashPin(pin);

  let userId: string;
  try {
    const user = await prisma.user.create({
      data: { username, pinHash: hash, pinSalt: salt },
    });
    userId = user.id;
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      redirect("/setup?error=taken");
    }
    throw err;
  }

  await createSession(userId);
  redirect("/");
}

export async function login(formData: FormData) {
  const username = String(formData.get("username") || "").trim();
  const pin = String(formData.get("pin") || "");

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || !PIN_PATTERN.test(pin) || !verifyPin(pin, user.pinSalt, user.pinHash)) {
    redirect("/login?error=1");
  }

  await createSession(user!.id);
  redirect("/");
}

export async function logout() {
  await clearSession();
  redirect("/login");
}
