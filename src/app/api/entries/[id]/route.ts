import { NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { isAuthed } from "@/lib/auth";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthed())) return NextResponse.json({ ok: false }, { status: 401 });
  const { id } = await params;
  const entry = await prisma.entry.findUnique({ where: { id } });
  if (!entry) return NextResponse.json({ ok: false }, { status: 404 });

  const urls = [
    entry.frontUrl,
    entry.backUrl,
    entry.leftSideUrl,
    entry.rightSideUrl,
  ].filter(Boolean) as string[];
  if (urls.length) {
    try {
      await del(urls);
    } catch {
      // ignore blob deletion failures
    }
  }
  await prisma.entry.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
