import { NextResponse } from "next/server";
import { signIn, signOut } from "@/lib/auth";

export async function POST(req: Request) {
  const { password } = await req.json();
  const ok = await signIn(String(password ?? ""));
  if (!ok) return NextResponse.json({ ok: false }, { status: 401 });
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await signOut();
  return NextResponse.json({ ok: true });
}
