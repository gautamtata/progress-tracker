"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { fmtDate } from "@/lib/time";

type Point = { date: string; weight: number; unit: string };

const config = {
  weight: { label: "Weight", color: "var(--primary)" },
} satisfies ChartConfig;

export function WeightChart({ data }: { data: Point[] }) {
  if (!data.length) {
    return (
      <p className="font-mono text-xs text-muted-foreground py-12 text-center uppercase tracking-[0.18em]">
        No data — yet.
      </p>
    );
  }
  const unit = data[0]?.unit ?? "lbs";
  return (
    <ChartContainer config={config} className="h-[280px] w-full">
      <AreaChart data={data} margin={{ left: 4, right: 12, top: 12, bottom: 4 }}>
        <defs>
          <linearGradient id="weight-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          vertical={false}
          stroke="var(--border)"
          strokeDasharray="2 4"
        />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          tickFormatter={(v) => fmtDate(v)}
          minTickGap={40}
          tick={{
            fill: "var(--muted-foreground)",
            fontFamily: "var(--font-jetbrains)",
            fontSize: 10,
            letterSpacing: "0.08em",
          }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          domain={["dataMin - 2", "dataMax + 2"]}
          width={36}
          tick={{
            fill: "var(--muted-foreground)",
            fontFamily: "var(--font-jetbrains)",
            fontSize: 10,
          }}
        />
        <ChartTooltip
          cursor={{
            stroke: "var(--primary)",
            strokeWidth: 1,
            strokeDasharray: "3 3",
          }}
          content={
            <ChartTooltipContent
              labelFormatter={(v) => fmtDate(v as string)}
              formatter={(value) => [`${value} ${unit}`, "Weight"]}
            />
          }
        />
        <Area
          dataKey="weight"
          type="monotone"
          stroke="var(--primary)"
          strokeWidth={2}
          fill="url(#weight-fill)"
          dot={{ r: 2.5, fill: "var(--primary)", strokeWidth: 0 }}
          activeDot={{
            r: 5,
            fill: "var(--primary)",
            stroke: "var(--background)",
            strokeWidth: 2,
          }}
        />
      </AreaChart>
    </ChartContainer>
  );
}
