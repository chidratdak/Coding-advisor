import { randomBytes, scryptSync, timingSafeEqual, createHmac } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

function sessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set.");
  return secret;
}

export function hashPin(pin: string): { hash: string; salt: string } {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(pin, salt, 64).toString("hex");
  return { hash, salt };
}

export function verifyPin(pin: string, salt: string, hash: string): boolean {
  const candidate = scryptSync(pin, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

function sign(payload: string): string {
  return createHmac("sha256", sessionSecret()).update(payload).digest("hex");
}

export async function createSession(userId: string) {
  const expires = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  const payload = `${userId}.${expires}`;
  const signature = sign(payload);
  const value = `${payload}.${signature}`;

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(SESSION_COOKIE)?.value;
  if (!value) return null;

  const parts = value.split(".");
  if (parts.length !== 3) return null;
  const [userId, expiresStr, signature] = parts;

  const expected = sign(`${userId}.${expiresStr}`);
  const sigBuf = Buffer.from(signature, "hex");
  const expectedBuf = Buffer.from(expected, "hex");
  if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
    return null;
  }

  const expires = Number(expiresStr);
  if (!Number.isFinite(expires) || Date.now() > expires) return null;

  return userId;
}

// Call at the top of every protected server component. Sends first-time
// visitors to create their account, everyone else to the PIN login.
export async function requireAuth(): Promise<string> {
  const userCount = await prisma.user.count();
  if (userCount === 0) redirect("/setup");

  const userId = await getSessionUserId();
  if (!userId) redirect("/login");

  return userId;
}
