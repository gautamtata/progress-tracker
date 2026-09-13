"use client";

import Image from "next/image";
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

type Photo = { pose: string; url: string; date?: string };

export function EntryCarousel({ photos }: { photos: Photo[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  if (api) {
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }

  return (
    <div className="space-y-3">
      <Carousel className="w-full" setApi={setApi}>
        <CarouselContent>
          {photos.map((p, i) => (
            <CarouselItem key={`${p.pose}-${i}`}>
              <div className="relative aspect-[3/4] w-full bg-muted/40 rounded-md overflow-hidden">
                <Image
                  src={p.url}
                  alt={p.pose}
                  fill
                  sizes="(max-width: 768px) 100vw, 700px"
                  className="object-contain"
                  priority={i === 0}
                />
                <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-background/80 to-transparent pointer-events-none" />
                <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
                  <span className="text-eyebrow text-foreground bg-background/50 backdrop-blur px-2 py-1 rounded">
                    {p.pose}
                  </span>
                  {p.date && (
                    <span className="font-mono text-[0.65rem] text-foreground bg-background/50 backdrop-blur px-2 py-1 rounded text-right">
                      {fmt(p.date, "MMM d, yyyy")}
                    </span>
                  )}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {photos.length > 1 && (
          <>
            <CarouselPrevious className="left-3 bg-background/60 backdrop-blur border-border/60" />
            <CarouselNext className="right-3 bg-background/60 backdrop-blur border-border/60" />
          </>
        )}
      </Carousel>
      {photos.length > 1 && (
        <div className="flex items-center justify-center gap-2 pt-1">
          {photos.map((p, i) => (
            <button
              key={`${p.pose}-dot-${i}`}
              onClick={() => api?.scrollTo(i)}
              className={`h-1 rounded-full transition-all ${
                i === current ? "w-8 bg-primary" : "w-2 bg-border hover:bg-muted-foreground"
              }`}
              aria-label={`Show ${p.pose}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
