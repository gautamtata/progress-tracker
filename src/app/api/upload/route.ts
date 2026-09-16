import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { isAuthed } from "@/lib/auth";

export async function POST(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ ok: false }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  const pose = String(form.get("pose") ?? "photo");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "no file" }, { status: 400 });
  }

  const ext = file.name.split(".").pop() || "jpg";
  const key = `entries/${Date.now()}-${pose}-${crypto.randomUUID()}.${ext}`;
  const blob = await put(key, file, {
    access: "private",
    contentType: file.type || undefined,
  });
  return NextResponse.json({ ok: true, url: blob.url });
}

export const runtime = "nodejs";
