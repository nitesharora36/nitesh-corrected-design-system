"use client";

/**
 * The design system's KPI Card, built from design-system/components/kpi-card.md:
 * one number that matters, how it moved, and a small plain picture of how it
 * got there (the charts of components/ds/chart.tsx).
 *
 *   <KpiCard label="Power draw" value="4.2 MW" change={{ value: 8.4, good: "down" }}
 *     period="vs last month" trend={{ type: "line", data: [...], labels: [...] }} />
 *
 * label, icon       the name (text-label-sm, text/sub-600) and a 20 x 20 icon
 * value             the number, already formatted (font-display title-h5)
 * change            the signed change in percent; `good` says which way is
 *                   good (up for revenue, down for cost), so the Badge is
 *                   green or red; 0 is gray
 * period            what the change compares with ("vs last month")
 * trend             line (a sparkline), bars (mini bars, the last period
 *                   strongest), gauge (a 64 ring beside the number), or
 *                   breakdown (a band cut into its parts, with its legend)
 * loading           a grey bar for the value, the picture's wall wiping
 * Sizes are the tokens in styles/sizes/kpi-card.css.
 */
import * as React from "react";

import { Badge } from "@/components/ds/badge";
import { BarChart, BreakdownBar, Gauge, LineChart, formatNumber, type ChartFormat, type DonutSlice } from "@/components/ds/chart";
import { ArrowDownIcon, ArrowUpIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export type KpiTrend =
  | { type: "line"; data: number[]; labels?: string[] }
  | { type: "bars"; data: number[]; labels?: string[] }
  | { type: "gauge"; value: number; max?: number }
  | { type: "breakdown"; items: DonutSlice[] };

export type KpiCardProps = Omit<React.ComponentProps<"div">, "children"> & {
  label: React.ReactNode;
  icon?: React.ReactNode;
  /** The number, already formatted (1,284, 12.9K, $4.2M). */
  value: React.ReactNode;
  /** The change in percent, signed, and which way is good. */
  change?: { value: number; good?: "up" | "down" };
  period?: React.ReactNode;
  trend?: KpiTrend;
  /** How the picture's tooltip writes a value. */
  format?: ChartFormat;
  loading?: boolean;
};

const pct = new Intl.NumberFormat("en", { maximumFractionDigits: 1 });

export function KpiCard({
  label,
  icon,
  value,
  change,
  period,
  trend,
  format = formatNumber,
  loading = false,
  className,
  ...props
}: KpiCardProps) {
  const name = typeof label === "string" ? label : "Value";
  const up = (change?.value ?? 0) > 0;
  const flat = !change || change.value === 0;
  const good = (change?.good ?? "up") === "up" ? up : !up;
  const rows = (data: number[], labels?: string[]) => data.map((v, i) => ({ x: labels?.[i] ?? `${i + 1}`, v }));

  return (
    <div
      className={cn("flex min-w-0 flex-col gap-kpi-card-gap rounded-kpi-card bg-bg-white-0 p-kpi-card-pad ds-shadow edge-stroke-soft-200 lift-card", className)}
      {...props}
    >
      <div className="flex items-center gap-kpi-card-head-gap">
        {icon != null && <span className="inline-flex size-kpi-card-icon shrink-0 text-icon-soft-400 [&_svg]:size-full">{icon}</span>}
        <span className="min-w-0 truncate text-label-sm text-text-sub-600">{label}</span>
      </div>

      <div className="flex items-center gap-kpi-card-side-gap">
        <div className="flex min-w-0 flex-1 flex-col gap-kpi-card-value-gap">
          {loading ? (
            <span aria-label="Loading" className="h-kpi-card-loading-h w-kpi-card-loading-value rounded-kpi-card-loading bg-bg-weak-50" />
          ) : (
            <span className="font-display text-title-h5 text-text-strong-950">{value}</span>
          )}
          {!loading && change && (
            <div className="flex flex-wrap items-center gap-kpi-card-change-gap">
              <Badge
                size="sm"
                variant="lighter"
                color={flat ? "gray" : good ? "green" : "red"}
                leadingIcon={flat ? undefined : up ? <ArrowUpIcon /> : <ArrowDownIcon />}
              >
                {`${up ? "+" : ""}${pct.format(change.value)}%`}
              </Badge>
              {period != null && <span className="whitespace-nowrap text-paragraph-xs text-text-muted">{period}</span>}
            </div>
          )}
        </div>
        {trend?.type === "gauge" && (
          <Gauge size="sm" value={trend.value} max={trend.max} loading={loading} aria-label={`${name}, share of the goal`} />
        )}
      </div>

      {trend?.type === "line" && (
        <LineChart
          compact
          data={rows(trend.data, trend.labels)}
          xKey="x"
          series={[{ key: "v", label: name }]}
          format={format}
          loading={loading}
          aria-label={`${name}, trend`}
        />
      )}
      {trend?.type === "bars" && (
        <BarChart
          compact
          data={rows(trend.data, trend.labels)}
          xKey="x"
          series={[{ key: "v", label: name }]}
          format={format}
          loading={loading}
          aria-label={`${name}, by period`}
        />
      )}
      {trend?.type === "breakdown" && <BreakdownBar items={trend.items} format={format} loading={loading} aria-label={`${name}, breakdown`} />}
    </div>
  );
}
