"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { CarouselApi } from "@/components/ui/carousel";
import { fmt } from "@/lib/time";

export type ArchivePhoto = {
  entryId: string;
  url: string;
  date: string;
  weight: number;
  unit: string;
};

const POSES = [
  { key: "front", label: "Front" },
  { key: "back", label: "Back" },
  { key: "leftSide", label: "Left side" },
  { key: "rightSide", label: "Right side" },
] as const;

export type PoseKey = (typeof POSES)[number]["key"];

export function PoseArchive({
  byPose,
}: {
  byPose: Record<PoseKey, ArchivePhoto[]>;
}) {
  const total = POSES.reduce((acc, p) => acc + byPose[p.key].length, 0);
  if (total === 0) {
    return (
      <div className="grain-card rounded-lg border border-border/50 py-16 text-center">
        <p className="text-display text-2xl text-muted-foreground">
          No photographs yet.
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {POSES.map((p) => (
        <PoseColumn key={p.key} label={p.label} photos={byPose[p.key]} />
      ))}
    </div>
  );
}

function PoseColumn({
  label,
  photos,
}: {
  label: string;
  photos: ArchivePhoto[];
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  if (api) {
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }

  return (
    <div className="grain-card rounded-lg border border-border/50 p-3 md:p-4">
      <div className="flex items-baseline justify-between mb-3 px-1">
        <p className="text-eyebrow">{label}</p>
        <p className="font-mono text-[0.65rem] text-muted-foreground">
          {photos.length === 0
            ? "—"
            : `${current + 1} / ${photos.length}`}
        </p>
      </div>
      {photos.length === 0 ? (
        <div className="aspect-[3/4] rounded-md border border-dashed border-border flex items-center justify-center">
          <p className="text-eyebrow opacity-50">No {label.toLowerCase()} photos</p>
        </div>
      ) : (
        <>
          <Carousel className="w-full" setApi={setApi}>
            <CarouselContent>
              {photos.map((p) => (
                <CarouselItem key={`${p.entryId}-${p.url}`}>
                  <Link
                    href={`/entry/${p.entryId}`}
                    className="block relative aspect-[3/4] w-full bg-muted/40 rounded-md overflow-hidden group"
                  >
                    <Image
                      src={p.url}
                      alt={`${label} on ${fmt(p.date, "MMM d, yyyy")}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 350px"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-background/85 via-background/30 to-transparent pointer-events-none" />
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/85 via-background/20 to-transparent pointer-events-none" />
                    <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
                      <span className="font-mono text-[0.65rem] text-foreground bg-background/55 backdrop-blur px-2 py-1 rounded uppercase tracking-[0.14em]">
                        {fmt(p.date, "MMM d, yyyy")}
                      </span>
                      <span className="font-mono text-[0.65rem] text-foreground bg-background/55 backdrop-blur px-2 py-1 rounded">
                        {fmt(p.date, "h:mm a")}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
                      <span className="text-display text-3xl text-foreground leading-none">
                        {p.weight.toFixed(1)}
                        <span className="font-mono text-[0.4em] text-muted-foreground ml-1.5 not-italic align-middle">
                          {p.unit}
                        </span>
                      </span>
                      <span className="font-mono text-[0.65rem] text-foreground/80 group-hover:text-primary transition-colors">
                        view →
                      </span>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            {photos.length > 1 && (
              <>
                <CarouselPrevious className="left-2 h-8 w-8 bg-background/60 backdrop-blur border-border/60" />
                <CarouselNext className="right-2 h-8 w-8 bg-background/60 backdrop-blur border-border/60" />
              </>
            )}
          </Carousel>
          {photos.length > 1 && (
            <div className="flex items-center justify-center gap-1.5 pt-3 flex-wrap">
              {photos.map((p, i) => (
                <button
                  key={`dot-${p.entryId}-${i}`}
                  onClick={() => api?.scrollTo(i)}
                  className={`h-1 rounded-full transition-all ${
                    i === current
                      ? "w-6 bg-primary"
                      : "w-1.5 bg-border hover:bg-muted-foreground"
                  }`}
                  aria-label={`Show photo from ${fmt(p.date, "MMM d, yyyy")}`}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
