import { NextResponse } from "next/server";
import { get } from "@vercel/blob";
import { isAuthed } from "@/lib/auth";

export const runtime = "nodejs";

function isBlobUrl(u: string): boolean {
  try {
    const { protocol, hostname } = new URL(u);
    return protocol === "https:" && hostname.endsWith(".blob.vercel-storage.com");
  } catch {
    return false;
  }
}

export async function GET(req: Request) {
  if (!(await isAuthed())) return new NextResponse(null, { status: 401 });

  const u = new URL(req.url).searchParams.get("u");
  if (!u || !isBlobUrl(u)) return new NextResponse(null, { status: 400 });

  const ifNoneMatch = req.headers.get("if-none-match") ?? undefined;
  const result = await get(u, { access: "private", ifNoneMatch });
  if (!result) return new NextResponse(null, { status: 404 });

  const cache = "private, max-age=31536000, immutable";
  if (result.statusCode === 304) {
    return new NextResponse(null, { status: 304, headers: { "Cache-Control": cache } });
  }

  return new NextResponse(result.stream, {
    status: 200,
    headers: {
      "Content-Type": result.blob.contentType,
      "Content-Length": String(result.blob.size),
      ETag: result.blob.etag,
      "Cache-Control": cache,
    },
  });
}
