import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { WeightChart } from "@/components/weight-chart";
import { PoseArchive, type ArchivePhoto, type PoseKey } from "@/components/pose-archive";
import { fmt, fmtDate } from "@/lib/time";

export const dynamic = "force-dynamic";

function delta(curr: number, prev: number | null) {
  if (prev == null) return null;
  const d = curr - prev;
  if (Math.abs(d) < 0.05) return { sign: "·", val: "0.0" };
  return { sign: d > 0 ? "↑" : "↓", val: Math.abs(d).toFixed(1) };
}

export default async function DashboardPage() {
  const entries = await prisma.entry.findMany({
    orderBy: { takenAt: "desc" },
    take: 200,
  });

  const latest = entries[0];
  const previous = entries[1];
  const trend = latest ? delta(latest.weight, previous?.weight ?? null) : null;

  const weights = entries.map((e) => e.weight);
  const high = weights.length ? Math.max(...weights) : null;
  const low = weights.length ? Math.min(...weights) : null;

  const chartData = [...entries]
    .reverse()
    .map((e) => ({ date: e.takenAt.toISOString(), weight: e.weight, unit: e.unit }));

  // group photos by pose, oldest → newest so the carousel reads as a progress timeline
  const ordered = [...entries].reverse();
  const byPose: Record<PoseKey, ArchivePhoto[]> = {
    front: [],
    back: [],
    leftSide: [],
    rightSide: [],
  };
  for (const e of ordered) {
    const base = {
      entryId: e.id,
      date: e.takenAt.toISOString(),
      weight: e.weight,
      unit: e.unit,
    };
    if (e.frontUrl) byPose.front.push({ ...base, url: e.frontUrl });
    if (e.backUrl) byPose.back.push({ ...base, url: e.backUrl });
    if (e.leftSideUrl) byPose.leftSide.push({ ...base, url: e.leftSideUrl });
    if (e.rightSideUrl) byPose.rightSide.push({ ...base, url: e.rightSideUrl });
  }

  const today = new Date().toISOString();

  return (
    <main className="mx-auto max-w-6xl px-5 md:px-10 py-10 md:py-14">
      {/* Masthead */}
      <header className="rise flex items-end justify-between border-b border-border/60 pb-6 mb-10">
        <div>
          <p className="text-eyebrow mb-3">A Personal Record · Vol. I</p>
          <h1 className="text-display text-5xl md:text-7xl">
            <span className="text-foreground">Pro</span>
            <span className="text-primary">gress</span>
            <span className="text-foreground">.</span>
          </h1>
        </div>
        <div className="hidden md:flex flex-col items-end text-right">
          <span className="text-eyebrow">{fmt(today, "EEEE")}</span>
          <span className="font-mono text-xs text-muted-foreground mt-1">
            {fmt(today, "MMM d, yyyy · h:mm a")} PT
          </span>
        </div>
      </header>

      {/* Hero — the latest weigh-in */}
      <section
        className="rise grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-10 md:gap-14 mb-14"
        style={{ animationDelay: "0.08s" }}
      >
        <div className="flex flex-col justify-between min-h-[220px]">
          <p className="text-eyebrow">Latest weigh-in</p>
          {latest ? (
            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-display text-[6.5rem] md:text-[9rem] text-foreground">
                  {latest.weight.toFixed(1)}
                </span>
                <span className="font-mono text-sm text-muted-foreground tracking-wider uppercase">
                  {latest.unit}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <span className="font-mono text-xs text-muted-foreground">
                  {fmt(latest.takenAt)}
                </span>
                {trend && (
                  <span
                    className={`font-mono text-xs ${
                      trend.sign === "↓"
                        ? "text-primary"
                        : trend.sign === "↑"
                        ? "text-destructive"
                        : "text-muted-foreground"
                    }`}
                  >
                    {trend.sign} {trend.val} {latest.unit} vs prev
                  </span>
                )}
              </div>
            </div>
          ) : (
            <p className="text-display text-5xl text-muted-foreground">
              No record yet.
            </p>
          )}
          <Link
            href="/new"
            className="group mt-6 inline-flex items-center gap-2 self-start font-mono text-xs uppercase tracking-[0.18em] text-primary hover:text-foreground transition-colors"
          >
            <span className="h-px w-8 bg-primary group-hover:w-12 transition-all" />
            Record an entry
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-px bg-border/60 rounded-lg overflow-hidden">
          <Stat label="Entries" value={entries.length.toString()} />
          <Stat
            label="High"
            value={high != null ? high.toFixed(1) : "—"}
            unit={latest?.unit}
          />
          <Stat
            label="Low"
            value={low != null ? low.toFixed(1) : "—"}
            unit={latest?.unit}
          />
        </div>
      </section>

      {/* Chart */}
      <section className="rise mb-14" style={{ animationDelay: "0.16s" }}>
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-display text-3xl md:text-4xl">Trajectory</h2>
          <p className="text-eyebrow">
            {entries.length > 1
              ? `${fmtDate(entries[entries.length - 1].takenAt)} → ${fmtDate(latest!.takenAt)}`
              : "—"}
          </p>
        </div>
        <div className="grain-card rounded-lg border border-border/50 p-5 md:p-7">
          <WeightChart data={chartData} />
        </div>
      </section>

      {/* Archive — per-pose carousels */}
      <section className="rise" style={{ animationDelay: "0.24s" }}>
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-display text-3xl md:text-4xl">Archive</h2>
          <p className="text-eyebrow">By pose · oldest to newest</p>
        </div>
        <PoseArchive byPose={byPose} />
      </section>

      <footer className="mt-20 pt-6 border-t border-border/60 flex items-center justify-between text-eyebrow">
        <span>Pacific Time</span>
        <span>Kept privately, only by you.</span>
      </footer>
    </main>
  );
}

function Stat({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit?: string;
}) {
  return (
    <div className="grain-card p-4 md:p-5 flex flex-col justify-between min-h-[110px]">
      <p className="text-eyebrow">{label}</p>
      <p className="text-display text-3xl md:text-4xl text-foreground">
        {value}
        {unit && (
          <span className="font-mono text-[0.55em] text-muted-foreground ml-1.5 not-italic">
            {unit}
          </span>
        )}
      </p>
    </div>
  );
}
