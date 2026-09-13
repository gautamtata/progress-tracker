import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { fmt } from "@/lib/time";
import { EntryCarousel } from "@/components/entry-carousel";
import { DeleteEntryButton } from "@/components/delete-entry-button";

export const dynamic = "force-dynamic";

export default async function EntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entry = await prisma.entry.findUnique({ where: { id } });
  if (!entry) notFound();

  const photos = (
    [
      ["Front", entry.frontUrl],
      ["Back", entry.backUrl],
      ["Left side", entry.leftSideUrl],
      ["Right side", entry.rightSideUrl],
    ] as const
  )
    .filter(([, url]) => !!url)
    .map(([pose, url]) => ({ pose, url: url!, date: entry.takenAt.toISOString() }));

  return (
    <main className="mx-auto max-w-3xl px-5 md:px-10 py-10 md:py-14">
      <div className="rise">
        <Link
          href="/"
          className="text-eyebrow text-muted-foreground hover:text-primary transition-colors"
        >
          ← Archive
        </Link>

        <header className="mt-4 mb-10 flex items-end justify-between border-b border-border/60 pb-6 gap-6 flex-wrap">
          <div>
            <p className="text-eyebrow mb-3">Entry</p>
            <div className="flex items-baseline gap-3">
              <h1 className="text-display text-7xl md:text-8xl text-foreground">
                {entry.weight.toFixed(1)}
              </h1>
              <span className="font-mono text-sm text-muted-foreground tracking-wider uppercase">
                {entry.unit}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-eyebrow">Recorded</p>
            <p className="font-mono text-xs text-muted-foreground mt-2">
              {fmt(entry.takenAt, "EEEE")}
            </p>
            <p className="font-mono text-xs text-foreground">
              {fmt(entry.takenAt, "MMM d, yyyy · h:mm a")} PT
            </p>
          </div>
        </header>
      </div>

      <section className="rise" style={{ animationDelay: "0.08s" }}>
        {photos.length > 0 ? (
          <div className="grain-card rounded-lg border border-border/50 p-3 md:p-4">
            <EntryCarousel photos={photos} />
          </div>
        ) : (
          <div className="grain-card rounded-lg border border-border/50 py-16 text-center">
            <p className="text-display text-2xl text-muted-foreground">
              No photographs.
            </p>
          </div>
        )}
      </section>

      {entry.notes && (
        <section
          className="rise mt-8 grain-card rounded-lg border border-border/50 p-6"
          style={{ animationDelay: "0.16s" }}
        >
          <p className="text-eyebrow mb-3">Notes</p>
          <p className="text-display text-xl md:text-2xl text-foreground/90 whitespace-pre-wrap leading-snug">
            “{entry.notes}”
          </p>
        </section>
      )}

      <div className="rise mt-10 pt-6 border-t border-border/60 flex items-center justify-between" style={{ animationDelay: "0.24s" }}>
        <span className="text-eyebrow opacity-60">№ {entry.id.slice(-6)}</span>
        <DeleteEntryButton id={entry.id} />
      </div>
    </main>
  );
}
