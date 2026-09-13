import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isAuthed } from "@/lib/auth";

const createSchema = z.object({
  takenAt: z.string(),
  weight: z.number().positive(),
  unit: z.enum(["lbs", "kg"]),
  notes: z.string().optional().nullable(),
  frontUrl: z.string().url().optional().nullable(),
  backUrl: z.string().url().optional().nullable(),
  leftSideUrl: z.string().url().optional().nullable(),
  rightSideUrl: z.string().url().optional().nullable(),
});

export async function POST(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ ok: false }, { status: 401 });
  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;
  const entry = await prisma.entry.create({
    data: {
      takenAt: new Date(data.takenAt),
      weight: data.weight,
      unit: data.unit,
      notes: data.notes ?? null,
      frontUrl: data.frontUrl ?? null,
      backUrl: data.backUrl ?? null,
      leftSideUrl: data.leftSideUrl ?? null,
      rightSideUrl: data.rightSideUrl ?? null,
    },
  });
  return NextResponse.json({ ok: true, entry });
}
