"use client";

import { photoSrc } from "@/lib/photo";
import Link from "next/link";
import Image from "next/image";
import { fmt } from "@/lib/time";

type Entry = {
  id: string;
  takenAt: string;
  weight: number;
  unit: string;
  notes: string | null;
  frontUrl: string | null;
  backUrl: string | null;
  sideUrl: string | null;
};

export function EntryList({ entries }: { entries: Entry[] }) {
  if (!entries.length) {
    return (
      <div className="grain-card rounded-lg border border-border/50 py-16 text-center">
        <p className="text-display text-2xl text-muted-foreground">
          The first page is blank.
        </p>
        <Link
          href="/new"
          className="mt-3 inline-block text-eyebrow text-primary hover:text-foreground transition-colors"
        >
          Begin →
        </Link>
      </div>
    );
  }
  return (
    <ol className="grain-card rounded-lg border border-border/50 overflow-hidden">
      {entries.map((e, i) => {
        const thumbs = [e.frontUrl, e.backUrl, e.sideUrl].filter(Boolean) as string[];
        return (
          <li key={e.id}>
            <Link
              href={`/entry/${e.id}`}
              className="group grid grid-cols-[3rem_1fr_auto] md:grid-cols-[4rem_8rem_1fr_auto] items-center gap-4 md:gap-6 px-4 md:px-6 py-4 hover:bg-foreground/[0.03] transition-colors border-t border-border/40 first:border-t-0"
            >
              <span className="font-mono text-xs text-muted-foreground tabular-nums">
                №{String(entries.length - i).padStart(3, "0")}
              </span>
              <div className="hidden md:flex -space-x-2">
                {thumbs.length > 0 ? (
                  thumbs.slice(0, 3).map((url, idx) => (
                    <div
                      key={idx}
                      className="relative h-10 w-10 rounded-full ring-2 ring-card overflow-hidden bg-muted"
                    >
                      <Image
                        src={photoSrc(url)}
                        unoptimized
                        alt=""
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                  ))
                ) : (
                  <div className="h-10 w-10 rounded-full ring-2 ring-card bg-muted/40 flex items-center justify-center">
                    <span className="font-mono text-[0.6rem] text-muted-foreground">—</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-display text-2xl text-foreground leading-none">
                  {e.weight.toFixed(1)}
                  <span className="font-mono text-[0.45em] text-muted-foreground ml-1.5 not-italic align-middle">
                    {e.unit}
                  </span>
                </span>
                <span className="font-mono text-[0.7rem] text-muted-foreground mt-1.5">
                  {fmt(e.takenAt)}
                </span>
              </div>
              <span className="font-mono text-xs text-muted-foreground group-hover:text-primary transition-colors">
                →
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
