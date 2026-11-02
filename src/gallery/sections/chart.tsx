"use client";

import { useState } from "react";

import { Button } from "@/components/ds/button";
import {
  BarChart,
  BreakdownBar,
  ChartCard,
  ChartHues,
  ChartLegend,
  DonutChart,
  Gauge,
  Heatmap,
  LineChart,
  formatCompact,
} from "@/components/ds/chart";
import { Group, Labelled } from "../parts";

// Example numbers for a data centre group: illustrative, not real.
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const POWER = [3.2, 3.1, 3.4, 3.6, 3.9, 4.3, 4.4, 4.2, 3.9, 3.7, 3.5, 3.4].map((mw, i) => ({ month: MONTHS[i], mw }));

const INCIDENTS = [
  { hall: "Hall 1", y2025: 14, y2026: 9 },
  { hall: "Hall 2", y2025: 11, y2026: 12 },
  { hall: "Hall 3", y2025: 22, y2026: 15 },
  { hall: "Hall 4", y2025: 8, y2026: 6 },
  { hall: "Hall 5", y2025: 17, y2026: 11 },
];
const INCIDENT_SERIES = [
  { key: "y2026", label: "2026" },
  { key: "y2025", label: "2025" },
];

const TICKETS = [
  { site: "Hyderabad DC2", tickets: 412 },
  { site: "Mumbai DC1", tickets: 356 },
  { site: "Chennai DC1", tickets: 298 },
  { site: "Pune DC3", tickets: 211 },
  { site: "Delhi DC1", tickets: 164 },
  { site: "Bengaluru DC4", tickets: 120 },
];

// The Figma's BarLineChart (198309:63497), its shape, in this page's sites.
const JOBS = [
  { month: "Jan", hyd: 63, mum: 100, che: 35 },
  { month: "Feb", hyd: 9, mum: 15, che: 30 },
  { month: "Mar", hyd: 70, mum: 91, che: 57 },
  { month: "Apr", hyd: 43, mum: 37, che: 25 },
  { month: "May", hyd: 52, mum: 68, che: 44 },
  { month: "Jun", hyd: 76, mum: 84, che: 61 },
];
const JOB_SERIES = [
  { key: "hyd", label: "Hyderabad" },
  { key: "mum", label: "Mumbai" },
  { key: "che", label: "Chennai" },
];

const RUNS = [182, 204, 197, 231, 256, 248, 270, 301, 288, 312, 335, 329, 358, 384].map((runs, i) => ({ day: `${i + 6} Oct`, runs }));

const COOLING = MONTHS.map((month, i) => ({
  month,
  hall1: 310 + Math.round(70 * Math.sin((i - 2) / 1.9)),
  hall2: 250 + Math.round(55 * Math.sin((i - 3) / 1.9)),
  hall3: 190 + Math.round(40 * Math.sin((i - 1) / 1.9)),
}));
const COOLING_SERIES = [
  { key: "hall1", label: "Hall 1" },
  { key: "hall2", label: "Hall 2" },
  { key: "hall3", label: "Hall 3" },
];

const SPEND = [
  { label: "Compute", value: 42000 },
  { label: "Storage", value: 18500 },
  { label: "Network", value: 9800 },
  { label: "Support", value: 6200 },
  { label: "Licences", value: 4100 },
  { label: "Backup", value: 2300 },
];
const SEVERITY = [
  { label: "Low", value: 81 },
  { label: "Medium", value: 58 },
  { label: "High", value: 34 },
  { label: "Critical", value: 12 },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = Array.from({ length: 24 }, (_, h) => `${String(h).padStart(2, "0")}:00`);
/** Alerts by hour: busier in working hours and on weekdays, a little noise. */
const ALERTS = DAYS.map((_, d) =>
  HOURS.map((__, h) => {
    const work = Math.exp(-(((h - 14) / 5) ** 2));
    const weekday = d < 5 ? 1 : 0.45;
    const noise = ((d * 37 + h * 101) % 17) / 17;
    const v = Math.round((2 + 14 * work * weekday + 4 * noise) * (h === 3 && d === 2 ? 3 : 1));
    return v < 3 ? 0 : v;
  }),
);

const STORAGE = [
  { label: "Hot", value: 42 },
  { label: "Warm", value: 31 },
  { label: "Cold", value: 18 },
  { label: "Archive", value: 9 },
];

const mw = (v: number) => `${v} MW`;
const usd = (v: number) => `$${formatCompact(v)}`;

export function ChartSection() {
  const [refreshing, setRefreshing] = useState(false);
  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2400);
  };

  return (
    <div className="flex flex-col gap-space-40">
      <p className="m-0 max-w-3xl text-paragraph-sm text-text-sub-600">
        Merlin&apos;s charts are plain: solid bars, lines, rings and squares in the brand&apos;s colour, square corners, light value lines.
        Move over a chart or use the arrow keys to move between the data. A chart can also wear green, red or amber: one hue for the chart, or
        one per series.
      </p>

      <Group label="Cube form, three series, a hue each (after the Figma's BarLineChart)">
        <ChartCard title="Jobs run by site" subtitle="Thousands, January to June" hue={["blue", "green", "red"]} legend={<ChartLegend series={JOB_SERIES} />}>
          <BarChart data={JOBS} xKey="month" series={JOB_SERIES} form="cube" aria-label="Jobs run by site, January to June" />
        </ChartCard>
      </Group>

      <div className="grid grid-cols-1 gap-space-16 lg:grid-cols-2">
        <Group label="Cube form, one series, values at the tips">
          <ChartCard title="Power draw" subtitle="MW per month, Hyderabad DC2">
            <BarChart data={POWER.slice(0, 6)} xKey="month" series={[{ key: "mw", label: "Power" }]} form="cube" valueLabels format={mw} aria-label="Power draw by month, January to June" />
          </ChartCard>
        </Group>
        <Group label="Cube form, two series in one hue (green)">
          <ChartCard title="Incidents by hall" subtitle="This year against last" hue="green" legend={<ChartLegend series={INCIDENT_SERIES} />}>
            <BarChart data={INCIDENTS} xKey="hall" series={INCIDENT_SERIES} form="cube" aria-label="Incidents by hall, 2026 and 2025" />
          </ChartCard>
        </Group>
      </div>

      <Group label="In green, red and amber">
        <div className="grid grid-cols-1 gap-space-16 lg:grid-cols-3">
          <ChartCard title="Power draw" subtitle="Green" hue="green">
            <BarChart data={POWER} xKey="month" series={[{ key: "mw", label: "Power" }]} format={mw} aria-label="Power draw by month, in green" />
          </ChartCard>
          <ChartCard title="Agent runs per day" subtitle="Red" hue="red">
            <LineChart data={RUNS} xKey="day" series={[{ key: "runs", label: "Runs" }]} aria-label="Agent runs per day, in red" />
          </ChartCard>
          <ChartCard title="Spend by service" subtitle="Amber" hue="amber">
            <DonutChart data={SPEND} format={usd} centre={{ value: usd(SPEND.reduce((s, d) => s + d.value, 0)), label: "this month" }} aria-label="Spend by service, in amber" />
          </ChartCard>
          <ChartCard title="Cooling load" subtitle="Three lines, a hue each" hue={["blue", "green", "red"]} legend={<ChartLegend series={COOLING_SERIES} kind="line" />}>
            <LineChart data={COOLING} xKey="month" series={COOLING_SERIES} aria-label="Cooling load by hall, a hue each" />
          </ChartCard>
          <ChartCard title="Storage by tier" subtitle="Red" hue="red">
            <BreakdownBar items={STORAGE} format={(v) => `${v} TB`} aria-label="Storage by tier, in red" />
          </ChartCard>
          <ChartCard title="Capacity used" subtitle="Blue, green, red, amber">
            <div className="flex flex-wrap items-start gap-space-16">
              {(["blue", "green", "red", "amber"] as const).map((hue) => (
                <ChartHues key={hue} hue={hue}>
                  <Gauge size="sm" value={64} aria-label={`Capacity used, in ${hue}`} />
                </ChartHues>
              ))}
            </div>
          </ChartCard>
        </div>
      </Group>

      <Group label="Columns, one series: try it (hover, arrow keys)">
        <ChartCard title="Power draw" subtitle="MW per month, Hyderabad DC2">
          <BarChart data={POWER} xKey="month" series={[{ key: "mw", label: "Power" }]} format={mw} aria-label="Power draw by month" />
        </ChartCard>
      </Group>

      <div className="grid grid-cols-1 gap-space-16 lg:grid-cols-2">
        <Group label="Columns, two series, values at the tips">
          <ChartCard title="Incidents by hall" subtitle="This year against last" legend={<ChartLegend series={INCIDENT_SERIES} />}>
            <BarChart data={INCIDENTS} xKey="hall" series={INCIDENT_SERIES} valueLabels aria-label="Incidents by hall, 2026 and 2025" />
          </ChartCard>
        </Group>
        <Group label="Horizontal bars: a ranking">
          <ChartCard title="Open tickets by site" subtitle="This week">
            <BarChart data={TICKETS} xKey="site" series={[{ key: "tickets", label: "Tickets" }]} orientation="horizontal" aria-label="Open tickets by site" />
          </ChartCard>
        </Group>
      </div>

      <div className="grid grid-cols-1 gap-space-16 lg:grid-cols-2">
        <Group label="Line, one series, with a light fill at its foot">
          <ChartCard title="Agent runs per day" subtitle="Last 14 days">
            <LineChart data={RUNS} xKey="day" series={[{ key: "runs", label: "Runs" }]} aria-label="Agent runs per day, last 14 days" />
          </ChartCard>
        </Group>
        <Group label="Lines, three series: colour, the third dashed">
          <ChartCard title="Cooling load" subtitle="kW, by hall" legend={<ChartLegend series={COOLING_SERIES} kind="line" />}>
            <LineChart data={COOLING} xKey="month" series={COOLING_SERIES} aria-label="Cooling load by hall, kW per month" />
          </ChartCard>
        </Group>
      </div>

      <div className="grid grid-cols-1 gap-space-16 lg:grid-cols-2">
        <Group label="Donut: six parts fold to five (Other)">
          <ChartCard title="Spend by service" subtitle="October">
            <DonutChart data={SPEND} format={usd} centre={{ value: usd(SPEND.reduce((s, d) => s + d.value, 0)), label: "this month" }} aria-label="Spend by service, October" />
          </ChartCard>
        </Group>
        <Group label="Pie">
          <ChartCard title="Alerts by severity" subtitle="Last 30 days">
            <DonutChart pie data={SEVERITY} aria-label="Alerts by severity, last 30 days" />
          </ChartCard>
        </Group>
      </div>

      <Group label="Gauges">
        <div className="flex flex-wrap items-start gap-space-32">
          <Gauge value={72} label="Capacity used" aria-label="Capacity used" />
          <Gauge value={99.2} display={(v) => `${v}%`} label="SLA this month" aria-label="SLA this month" />
          <Gauge value={46} label="Budget used" aria-label="Budget used" />
          <Labelled label="Small (the KPI card's)">
            <Gauge size="sm" value={64} aria-label="Goal reached" />
          </Labelled>
        </div>
      </Group>

      <Group label="Heatmap: one solid square per value, the light's sequential range">
        <ChartCard title="Alerts by hour" subtitle="Last week, every site">
          <Heatmap rows={DAYS} cols={HOURS} values={ALERTS} colEvery={3} aria-label="Alerts by hour and day, last week" />
        </ChartCard>
      </Group>

      <Group label="Breakdown bar">
        <ChartCard title="Storage by tier" subtitle="100 TB in use" className="max-w-xl">
          <BreakdownBar items={STORAGE} format={(v) => `${v} TB`} aria-label="Storage by tier" />
        </ChartCard>
      </Group>

      <Group label="States: loading, refreshing (the chart held and dimmed), empty">
        <div className="grid grid-cols-1 gap-space-16 lg:grid-cols-3">
          <ChartCard title="Loading" subtitle="No data yet: an empty plot">
            <BarChart data={[]} xKey="month" series={[{ key: "mw", label: "Power" }]} loading aria-label="Power draw, loading" />
          </ChartCard>
          <ChartCard
            title="Refreshing"
            subtitle="Press Refresh"
            actions={
              <Button size="xs" tone="neutral" variant="stroke" onClick={refresh} disabled={refreshing}>
                Refresh
              </Button>
            }
          >
            <LineChart data={RUNS} xKey="day" series={[{ key: "runs", label: "Runs" }]} loading={refreshing} aria-label="Agent runs per day, refreshing" />
          </ChartCard>
          <ChartCard title="Empty" subtitle="Nothing in this period">
            <BarChart data={[]} xKey="month" series={[{ key: "mw", label: "Power" }]} aria-label="Power draw, no data" />
          </ChartCard>
        </div>
      </Group>
    </div>
  );
}
