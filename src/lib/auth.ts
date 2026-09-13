import { cookies } from "next/headers";

export const AUTH_COOKIE = "pt_auth";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

function getSecret(): string {
  const secret = process.env.APP_PASSWORD;
  if (!secret) throw new Error("APP_PASSWORD env var not set");
  return secret;
}

export async function isAuthed(): Promise<boolean> {
  const jar = await cookies();
  return jar.get(AUTH_COOKIE)?.value === getSecret();
}

export async function signIn(password: string): Promise<boolean> {
  if (password !== getSecret()) return false;
  const jar = await cookies();
  jar.set(AUTH_COOKIE, password, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
  return true;
}

export async function signOut() {
  const jar = await cookies();
  jar.delete(AUTH_COOKIE);
}
