"use client";

/**
 * The design system's charts, built from design-system/components/chart.md.
 * Merlin's charts are plain (Nitesh, 3 Nov 2026): solid bars, lines, rings
 * and squares in the chart's colours, square corners, light value lines; no
 * Neutrino cells and nothing moving on its own. The colours still come from
 * the light's ramp (components/ds/neutrino-cells.tsx reads it).
 *
 *   <ChartCard title="Power draw" subtitle="MW, last 12 months">
 *     <BarChart data={rows} xKey="month" series={[{ key: "mw", label: "Power" }]} aria-label="Power draw by month" />
 *   </ChartCard>
 *
 * BarChart        columns (or horizontal bars for a ranking), one to three
 *                 series, value labels at the tips; compact for a KPI card;
 *                 form="cube" draws wider columns
 * LineChart       a line over a light fill, one to three series, the
 *                 crosshair; compact (a sparkline)
 * DonutChart      a ring (or a pie) of slices, five at most, with its legend
 * Gauge           a ring filled to its value, the value in the middle
 * Heatmap         one solid square per value on the ramp's sequential range
 * BreakdownBar    one band cut into its parts, with its legend
 * ChartCard       the card a chart sits in: title, subtitle, legend, actions
 * ChartLegend     the series' keys (a square in each series' colour)
 * ChartHues       the hue of the charts inside it (blue, green, red, amber),
 *                 or one per series; ChartCard's hue sets it
 *
 * Data comes as rows (data, xKey, series), as the agent writes it. Every
 * chart is a focusable group: the arrow keys move between data with the
 * same tooltip as the pointer, and a table of its data sits in the page for
 * screen readers. Words never sit on the marks, and never wear the series'
 * colour. Sizes are the tokens in styles/sizes/chart.css.
 */
import * as React from "react";

import {
  ChartHueContext,
  nearestIndex,
  penAt,
  rampAt,
  useCellTheme,
  type ChartHue,
  type CellTheme,
  type Point,
  type RampPlace,
} from "@/components/ds/neutrino-cells";
import { usingKeyboard } from "@/components/input-modality";
import { cn } from "@/lib/utils";

export type { ChartHue };

/* ── Shared pieces ── */

export type ChartSeries = { key: string; label: string };
export type ChartDatum = Record<string, string | number | null | undefined>;
export type ChartFormat = (v: number) => string;

const compactNumber = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
const fullNumber = new Intl.NumberFormat("en", { maximumFractionDigits: 2 });
/** 0, 1.2K, 3.4M: axes and tight spaces. */
export const formatCompact: ChartFormat = (v) => compactNumber.format(v);
/** 1,284.5: tooltips and tables. */
export const formatNumber: ChartFormat = (v) => fullNumber.format(v);

const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : 0);

/** A series' place on the ramp (chart.md, Colour and identity). */
export const seriesT = (si: number) => (th: CellTheme) => th.series[si] ?? th.series[th.series.length - 1];
/** A slice's place: the largest hottest, stepping down to the second series' place. */
export const sliceT = (k: number, n: number) => (th: CellTheme) => (n <= 1 ? 1 : 1 - ((1 - (th.series[1] ?? 0.5)) * k) / (n - 1));

/** Whether series `si` wears its own hue: ChartCard's hue is a list of two
 *  or more, one per series. */
const ownHue = (si: number, hues: ChartHue[]) => hues.length > 1 && si < hues.length;

/** A series' look: its ramp place and pen. With a hue of its own the hue
 *  tells the series apart, so each sits at the hot end; in one hue they
 *  step down the ramp. */
export function seriesLook(si: number, hues: ChartHue[]) {
  return ownHue(si, hues) ? { t: seriesT(0), pen: si } : { t: seriesT(si), pen: 0 };
}

/** A series' colour: its bars, its line and markers, its key. */
const seriesColour = (th: CellTheme, si: number, hues: ChartHue[]) =>
  ownHue(si, hues) ? penAt(th, si, th.hueLine) : rampAt(th, th.series[si] ?? 0.75);

/** The hue of every chart, legend and key inside it: one, or a list with
 *  one per series (the first is also the chart's own: its fill and gauge). */
export function ChartHues({ hue, children }: { hue: ChartHue | ChartHue[]; children: React.ReactNode }) {
  const key = Array.isArray(hue) ? hue.join(",") : hue;
  // key stands for hue, which may be a new array each render.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const hues = React.useMemo(() => (Array.isArray(hue) ? hue : [hue]), [key]);
  return <ChartHueContext.Provider value={hues}>{children}</ChartHueContext.Provider>;
}

/** The canvas numbers from styles/sizes/chart.css, in px. These defaults
 *  are only for a page without that stylesheet. */
type Px = {
  cell: number;
  pitch: number;
  cellSm: number;
  pitchSm: number;
  heatCell: number;
  heatPitch: number;
  barMax: number;
  cubeMax: number;
  donutRing: number;
  gaugeRing: number;
  gaugeRingSm: number;
  line: number;
  lineSm: number;
};
const PX_FALLBACK: Px = { cell: 3, pitch: 5, cellSm: 2, pitchSm: 4, heatCell: 12, heatPitch: 15, barMax: 24, cubeMax: 48, donutRing: 28, gaugeRing: 14, gaugeRingSm: 8, line: 2, lineSm: 1.5 };

/** How much larger a chart draws its lines, bars and rings than the tokens
 *  say: 1 everywhere, more where the chart is shown scaled down (a canvas's
 *  cover on the canvases page, canvas-live-cover.tsx), so they stay visible
 *  once shrunk (28 Oct 2026). */
export const ChartPxBoost = React.createContext(1);

function useChartPx(): Px {
  const boost = React.useContext(ChartPxBoost);
  const px = useChartPxTokens();
  return React.useMemo(
    () =>
      boost === 1
        ? px
        : (Object.fromEntries(Object.entries(px).map(([k, v]) => [k, v * boost])) as Px),
    [px, boost],
  );
}

function useChartPxTokens(): Px {
  const [px, setPx] = React.useState<Px>(PX_FALLBACK);
  React.useEffect(() => {
    const cs = getComputedStyle(document.documentElement);
    const v = (name: string, fallback: number) => parseFloat(cs.getPropertyValue(name)) || fallback;
    setPx({
      cell: v("--chart-cell", PX_FALLBACK.cell),
      pitch: v("--chart-pitch", PX_FALLBACK.pitch),
      cellSm: v("--chart-cell-sm", PX_FALLBACK.cellSm),
      pitchSm: v("--chart-pitch-sm", PX_FALLBACK.pitchSm),
      heatCell: v("--chart-heat-cell", PX_FALLBACK.heatCell),
      heatPitch: v("--chart-heat-pitch", PX_FALLBACK.heatPitch),
      barMax: v("--chart-bar-max", PX_FALLBACK.barMax),
      cubeMax: v("--chart-cube-max", PX_FALLBACK.cubeMax),
      donutRing: v("--chart-donut-ring", PX_FALLBACK.donutRing),
      gaugeRing: v("--chart-gauge-ring", PX_FALLBACK.gaugeRing),
      gaugeRingSm: v("--chart-gauge-ring-sm", PX_FALLBACK.gaugeRingSm),
      line: v("--chart-line", PX_FALLBACK.line),
      lineSm: v("--chart-line-sm", PX_FALLBACK.lineSm),
    });
  }, []);
  return px;
}

/** A box's size, kept current. */
function useBox() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [box, setBox] = React.useState({ w: 0, h: 0 });
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const w = Math.round(el.clientWidth);
      const h = Math.round(el.clientHeight);
      setBox((b) => (b.w === w && b.h === h ? b : { w, h }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, box] as const;
}

/** Hover and keyboard focus over n data: the arrows move, Escape leaves. */
function useDatumFocus(n: number) {
  const [hover, setHover] = React.useState(-1);
  const keys = {
    tabIndex: 0,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (!n) return;
      const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (step) {
        e.preventDefault();
        setHover((h) => (h < 0 ? 0 : (h + step + n) % n));
      } else if (e.key === "Home" || e.key === "End") {
        e.preventDefault();
        setHover(e.key === "Home" ? 0 : n - 1);
      } else if (e.key === "Escape") setHover(-1);
    },
    onFocus: (e: React.FocusEvent<HTMLElement>) => {
      if (e.currentTarget.matches(":focus-visible") && usingKeyboard()) setHover((h) => (h < 0 ? 0 : h));
    },
    onBlur: () => setHover(-1),
    onPointerLeave: () => setHover(-1),
  };
  return { hover, setHover, keys };
}

/** Clean ticks from 0 to past the top value (0, 2K, 4K, 6K). */
export function niceTicks(max: number, count = 4) {
  if (!(max > 0)) return [0, 1];
  const raw = max / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const f = raw / mag;
  const step = (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * mag;
  const ticks: number[] = [];
  for (let v = 0; v <= Math.ceil(max / step) * step + step / 2; v += step) ticks.push(+v.toFixed(10));
  return ticks;
}

/** Name every nth category, so no name runs into the next: each wants its
 *  own width (the axis words are 12px, about 6.5 a letter, with room either
 *  side), and at least `least` px (27 Oct 2026: names longer than "Mar", a
 *  payer or a facility, ran into each other on a canvas). */
function labelEvery(names: string[], w: number, least: number) {
  const longest = names.reduce((m, s) => Math.max(m, s.length), 0);
  const need = Math.max(least, longest * 6.5 + 12);
  return Math.max(1, Math.ceil((names.length * need) / Math.max(1, w)));
}

/** The plot's class: a focusable box with the Primary focus ring. */
const PLOT = "absolute rounded-chart-plot outline-none ds-shadow ds-focus:ring-focus-primary";
const AXIS_TEXT = "text-paragraph-xs text-text-muted tabular-nums whitespace-nowrap";

/** A row of the tooltip; `line` (a series index) keys it with a line instead of a square. */
type TipRow = { key: string; t: RampPlace; pen?: number; value: string; label: string; line?: number };

/** A series' key for legends and tooltips: a small solid square in its
 *  colour; `pen` picks the series' hue when each series has its own. */
export function Swatch({ t, pen = 0, className }: { t: RampPlace; pen?: number; className?: string }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const theme = useCellTheme(ref);
  const colour = theme ? penAt(theme, pen, typeof t === "function" ? t(theme) : t) : undefined;
  return <span ref={ref} aria-hidden className={cn("size-chart-swatch shrink-0", className)} style={{ background: colour }} />;
}

/** A chart's marks, drawn plain on a canvas: drawn again when the data, the
 *  size, hover or the theme change (`drawKey` says when); nothing moves on
 *  its own. Faded while the data is on its way. */
function ChartCanvas({
  w,
  h,
  draw,
  drawKey,
  loading = false,
}: {
  w: number;
  h: number;
  draw: (ctx: CanvasRenderingContext2D, th: CellTheme) => void;
  drawKey: string;
  loading?: boolean;
}) {
  const ref = React.useRef<HTMLCanvasElement>(null);
  const theme = useCellTheme(ref);
  React.useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !theme || w < 4 || h < 4) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    draw(ctx, theme);
    // draw is a new closure every render; drawKey says when its output changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, w, h, drawKey]);
  return (
    <canvas
      ref={ref}
      aria-hidden
      className={cn("pointer-events-none absolute left-0 top-0", loading && "opacity-45")}
      style={{ width: w, height: h }}
    />
  );
}

/** The value lines across the plot, one per tick (the last at the foot). */
function drawGrid(ctx: CanvasRenderingContext2D, th: CellTheme, ys: number[], w: number, h: number) {
  ctx.fillStyle = th.grid;
  for (const y of ys) ctx.fillRect(0, Math.min(Math.max(Math.round(y), 1), h) - 1, w, 1);
}

/** Where the tooltip goes, so it never hides the mark it describes: above
 *  the mark when there is room, else beside it (`side` is half the mark's
 *  width), on the side with more room. */
function tipPlace(x: number, y: number, w: number, side = 0) {
  if (y >= 76) return { left: x, top: y - 12, tx: x < w * 0.22 ? "0%" : x > w * 0.78 ? "-100%" : "-50%", ty: "-100%" };
  const right = x < w * 0.62;
  return { left: right ? x + side + 12 : x - side - 12, top: Math.max(0, y), tx: right ? "0%" : "-100%", ty: "0%" };
}

/** The tooltip: the card's own colours (so a series' key reads the same as
 *  on the card), the value first and strong, the name after it. */
function ChartTip({ x, y, w, side, title, rows }: { x: number; y: number; w: number; side?: number; title?: React.ReactNode; rows: TipRow[] }) {
  const at = tipPlace(x, y, w, side);
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute z-10 flex w-max flex-col gap-chart-tip-gap rounded-tooltip-xs bg-bg-white-0 px-tooltip-xs-x py-chart-tip-y ds-shadow edge-stroke-soft-200 [--ds-lift:var(--shadow-tooltip)]"
      style={{ left: at.left, top: at.top, transform: `translate(${at.tx}, ${at.ty})` }}
    >
      {title != null && <span className="text-paragraph-xs text-text-sub-600">{title}</span>}
      {rows.map((r) => (
        <span key={r.key} className="flex items-center gap-chart-tip-row">
          {r.line != null ? <LineKey series={r.line} /> : <Swatch t={r.t} pen={r.pen} />}
          <span className="text-label-sm text-text-strong-950 tabular-nums">{r.value}</span>
          <span className="text-paragraph-xs text-text-sub-600">{r.label}</span>
        </span>
      ))}
    </div>
  );
}

/** The chart's data as a table, for screen readers. */
function DataTable({ caption, head, rows }: { caption: string; head: string[]; rows: (string | number)[][] }) {
  return (
    <table className="sr-only">
      <caption>{caption}</caption>
      <thead>
        <tr>
          {head.map((h) => (
            <th key={h} scope="col">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            {r.map((c, j) =>
              j === 0 ? (
                <th key={j} scope="row">
                  {c}
                </th>
              ) : (
                <td key={j}>{c}</td>
              ),
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** What the keyboard is on, said aloud. */
function Live({ text }: { text: string }) {
  return (
    <span aria-live="polite" className="sr-only">
      {text}
    </span>
  );
}

/* ── The card and the legend ── */

export type ChartCardProps = Omit<React.ComponentProps<"section">, "title"> & {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Buttons on the right of the title. */
  actions?: React.ReactNode;
  /** Under the title: a ChartLegend. */
  legend?: React.ReactNode;
  /** The hue of the charts in the card (ChartHues): blue by default. */
  hue?: ChartHue | ChartHue[];
};

export function ChartCard({ title, subtitle, actions, legend, hue, className, children, ...props }: ChartCardProps) {
  const card = (
    <section
      className={cn("flex min-w-0 flex-col gap-chart-card-gap rounded-chart-card bg-bg-white-0 p-chart-card-pad ds-shadow edge-stroke-soft-200 lift-card", className)}
      {...props}
    >
      <div className="flex items-start gap-space-12">
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-label-sm text-text-strong-950">{title}</span>
          {subtitle != null && <span className="text-paragraph-xs text-text-sub-600">{subtitle}</span>}
        </div>
        {actions}
      </div>
      {legend}
      {children}
    </section>
  );
  return hue ? <ChartHues hue={hue}>{card}</ChartHues> : card;
}

/** Each series' key, for two or more series (one series needs none: the
 *  title says it). `kind="line"` keys a line chart's series with a stroke,
 *  as its marks are lines; the rest with a square. */
export function ChartLegend({ series, kind = "swatch", className }: { series: ChartSeries[]; kind?: "swatch" | "line"; className?: string }) {
  const hues = React.useContext(ChartHueContext);
  if (series.length < 2) return null;
  return (
    <div className={cn("flex flex-wrap items-center gap-x-chart-legend-gap gap-y-space-4", className)}>
      {series.map((s, i) => (
        <span key={s.key} className="inline-flex items-center gap-chart-legend-key-gap text-label-xs text-text-sub-600">
          {kind === "line" ? <LineKey series={i} /> : <Swatch {...seriesLook(i, hues)} />}
          {s.label}
        </span>
      ))}
    </div>
  );
}

/** Each series' dash, in line widths: the first two solid (their colours
 *  are measured apart), the third dashed, as its colour alone is too close. */
const LINE_DASH: number[][] = [[], [], [3, 2.5]];

/** A line chart's key: a short stroke in the series' colour and dash. */
export function LineKey({ series: si, className }: { series: number; className?: string }) {
  const ref = React.useRef<HTMLCanvasElement>(null);
  const theme = useCellTheme(ref);
  const hues = React.useContext(ChartHueContext);
  React.useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !theme) return;
    const box = canvas.getBoundingClientRect();
    const w = box.width || 16;
    const h = box.height || 13;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const lw = parseFloat(getComputedStyle(canvas).getPropertyValue("--chart-line")) || 2;
    ctx.lineWidth = lw;
    ctx.lineCap = "round";
    ctx.setLineDash((LINE_DASH[si] ?? []).map((v) => v * lw));
    ctx.strokeStyle = seriesColour(theme, si, hues);
    ctx.beginPath();
    ctx.moveTo(lw, h / 2);
    ctx.lineTo(w - lw, h / 2);
    ctx.stroke();
  }, [theme, si, hues]);
  return <canvas ref={ref} aria-hidden className={cn("h-chart-swatch w-chart-line-key shrink-0", className)} />;
}

/* ── Bars ── */

export type BarChartProps = {
  data: ChartDatum[];
  xKey: string;
  /** One to three. */
  series: ChartSeries[];
  /** vertical: columns. horizontal: a ranking, names on the left, values at the tips. */
  orientation?: "vertical" | "horizontal";
  /** Values at the bars' tips (vertical; horizontal always shows them). */
  valueLabels?: boolean;
  format?: ChartFormat;
  /** No axes, the last bar the strongest: the KPI card's picture. */
  compact?: boolean;
  /** flat: columns. cube: wider columns, up to their own token (the
   *  Figma's BarLineChart boxes, drawn flat like the rest). Columns only. */
  form?: "flat" | "cube";
  loading?: boolean;
  /** The sentence under an empty chart. */
  empty?: string;
  className?: string;
  "aria-label": string;
};

export function BarChart({
  data,
  xKey,
  series,
  orientation = "vertical",
  form = "flat",
  valueLabels = false,
  format = formatCompact,
  compact = false,
  loading = false,
  empty = "No data for this period.",
  className,
  "aria-label": label,
}: BarChartProps) {
  const px = useChartPx();
  const [plotRef, box] = useBox();
  const n = data.length;
  const { hover, setHover, keys } = useDatumFocus(n);
  const horizontal = orientation === "horizontal" && !compact;
  const cube = form === "cube" && !horizontal && !compact;
  const hues = React.useContext(ChartHueContext);
  const max = Math.max(0, ...data.flatMap((d) => series.map((s) => num(d[s.key]))));
  const ticks = niceTicks(max);
  const top = horizontal || compact ? max || 1 : ticks[ticks.length - 1];
  const S = Math.max(1, Math.min(3, series.length));
  const shown = series.slice(0, S);
  const isEmpty = !loading && n === 0;
  const { w, h } = box;

  const yOf = (v: number) => h * (1 - v / top);
  const xOf = (v: number) => w * (v / top);
  const band = (horizontal ? h : w) / Math.max(1, n);
  /** A bar's thickness: at most the token's px, about 62% of its band
   *  shared by the series (a cube up to its own token, 80% of the band). */
  const bar = Math.max(2, Math.min(cube ? px.cubeMax : px.barMax, (band * (cube ? 0.8 : 0.62)) / S));
  const gap = S > 1 ? 2 : 0;
  const group = S * bar + (S - 1) * gap;

  // Solid, square-cornered bars in each series' colour; the hovered
  // category's band shaded behind them.
  const draw = (ctx: CanvasRenderingContext2D, th: CellTheme) => {
    if (isEmpty) return;
    if (!horizontal && !compact) drawGrid(ctx, th, ticks.map(yOf), w, h);
    if (!compact && hover >= 0 && hover < n) {
      ctx.fillStyle = th.grid;
      ctx.globalAlpha = 0.6;
      if (horizontal) ctx.fillRect(0, band * hover, w, band);
      else ctx.fillRect(band * hover, 0, band, h);
      ctx.globalAlpha = 1;
    }
    data.forEach((d, b) => {
      const first = band * (b + 0.5) - group / 2;
      // The KPI picture: the current period strongest, the rest quieter.
      ctx.globalAlpha = compact && b !== n - 1 ? 0.45 : 1;
      shown.forEach((s, si) => {
        const v = num(d[s.key]);
        if (v <= 0) return;
        const at = first + si * (bar + gap);
        ctx.fillStyle = seriesColour(th, si, hues);
        if (horizontal) ctx.fillRect(0, at, xOf(v), bar);
        else ctx.fillRect(at, yOf(v), bar, h - yOf(v));
      });
    });
    ctx.globalAlpha = 1;
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!n) return;
    const r = e.currentTarget.getBoundingClientRect();
    const at = horizontal ? e.clientY - r.top : e.clientX - r.left;
    setHover(Math.min(n - 1, Math.max(0, Math.floor(at / band))));
  };

  const describe = (b: number) =>
    `${data[b]?.[xKey] ?? ""}: ${shown.map((s) => `${s.label} ${formatNumber(num(data[b]?.[s.key]))}`).join(", ")}`;

  // The tooltip sits over the hovered bar's tip.
  let tip: React.ReactNode = null;
  if (hover >= 0 && hover < n && w > 0) {
    const d = data[hover];
    const peak = Math.max(...shown.map((s) => num(d[s.key])));
    const centre = band * (hover + 0.5);
    tip = (
      <ChartTip
        x={horizontal ? xOf(peak) : centre}
        y={horizontal ? centre : yOf(peak)}
        w={w}
        side={horizontal ? 48 : group / 2}
        title={String(d[xKey] ?? "")}
        rows={shown.map((s, si) => ({ key: s.key, ...seriesLook(si, hues), value: formatNumber(num(d[s.key])), label: s.label }))}
      />
    );
  }

  const every = labelEvery(data.map((d) => String(d[xKey] ?? "")), w, 44);
  const canvas = (
    <ChartCanvas
      w={w}
      h={h}
      draw={draw}
      drawKey={`${JSON.stringify(data)}|${shown.map((s) => s.key)}|${orientation}|${form}|${hues.join()}|${compact}|${isEmpty}|${top}|${bar}|${hover}`}
      loading={loading}
    />
  );

  return (
    <div role="group" aria-label={label} className={cn("relative w-full", compact ? "h-kpi-card-picture" : "h-chart-height", className)}>
      {horizontal ? (
        <>
          <div aria-hidden className="absolute bottom-0 left-0 top-0 w-chart-label-col">
            {box.h > 0 &&
              data.map((d, b) => (
                <span
                  key={b}
                  className="absolute left-0 right-chart-value-gap -translate-y-1/2 truncate text-paragraph-xs text-text-sub-600"
                  style={{ top: band * (b + 0.5) }}
                >
                  {String(d[xKey] ?? "")}
                </span>
              ))}
          </div>
          <div ref={plotRef} className={cn(PLOT, "bottom-0 left-chart-label-col right-chart-end top-0")} onPointerMove={onPointerMove} {...keys}>
            {canvas}
            {box.w > 0 &&
              data.map((d, b) => (
                <span
                  key={b}
                  aria-hidden
                  className={cn("absolute -translate-y-1/2 pl-chart-value-gap", AXIS_TEXT)}
                  style={{ left: xOf(Math.max(...shown.map((s) => num(d[s.key])))), top: band * (b + 0.5) }}
                >
                  {format(Math.max(...shown.map((s) => num(d[s.key]))))}
                </span>
              ))}
            {tip}
          </div>
        </>
      ) : compact ? (
        <div ref={plotRef} className={cn(PLOT, "inset-0")} onPointerMove={onPointerMove} {...keys}>
          {canvas}
          {tip}
        </div>
      ) : (
        <>
          <div aria-hidden className="absolute bottom-chart-axis-x left-0 top-chart-plot-top w-chart-axis-y">
            {box.h > 0 &&
              n > 0 &&
              ticks.map((v) => (
                <span key={v} className={cn("absolute right-chart-value-gap -translate-y-1/2", AXIS_TEXT)} style={{ top: yOf(v) }}>
                  {formatCompact(v)}
                </span>
              ))}
          </div>
          <div
            ref={plotRef}
            className={cn(PLOT, "bottom-chart-axis-x left-chart-axis-y right-0 top-chart-plot-top")}
            onPointerMove={onPointerMove}
            {...keys}
          >
            {canvas}
            {valueLabels &&
              box.w > 0 &&
              band >= 28 &&
              data.map((d, b) => {
                const v = Math.max(...shown.map((s) => num(d[s.key])));
                return (
                  <span
                    key={b}
                    aria-hidden
                    className={cn("absolute -translate-x-1/2 -translate-y-full pb-space-4", AXIS_TEXT)}
                    style={{ left: band * (b + 0.5), top: yOf(v) }}
                  >
                    {format(v)}
                  </span>
                );
              })}
            {tip}
          </div>
          <div aria-hidden className="absolute bottom-0 left-chart-axis-y right-0 h-chart-axis-x">
            {box.w > 0 &&
              data.map((d, b) =>
                b % every ? null : (
                  <span
                    key={b}
                    className={cn("absolute top-1/2 -translate-x-1/2 -translate-y-1/2", AXIS_TEXT)}
                    style={{ left: band * (b + 0.5) }}
                  >
                    {String(d[xKey] ?? "")}
                  </span>
                ),
              )}
          </div>
        </>
      )}
      {isEmpty && <span className="absolute inset-x-0 bottom-0 text-center text-paragraph-sm text-text-muted">{empty}</span>}
      <Live text={hover >= 0 && hover < n ? describe(hover) : ""} />
      <DataTable
        caption={label}
        head={[xKey, ...shown.map((s) => s.label)]}
        rows={data.map((d) => [String(d[xKey] ?? ""), ...shown.map((s) => formatNumber(num(d[s.key])))])}
      />
    </div>
  );
}

/* ── Lines ── */

export type LineChartProps = {
  data: ChartDatum[];
  xKey: string;
  /** One to three. */
  series: ChartSeries[];
  /** The light fill under the line (on by default). */
  area?: boolean;
  format?: ChartFormat;
  /** A sparkline: no axes. */
  compact?: boolean;
  loading?: boolean;
  empty?: string;
  className?: string;
  "aria-label": string;
};

export function LineChart({
  data,
  xKey,
  series,
  area,
  format = formatCompact,
  compact = false,
  loading = false,
  empty = "No data for this period.",
  className,
  "aria-label": label,
}: LineChartProps) {
  const px = useChartPx();
  const [plotRef, box] = useBox();
  const n = data.length;
  const { hover, setHover, keys } = useDatumFocus(n);
  const hues = React.useContext(ChartHueContext);
  const S = Math.max(1, Math.min(3, series.length));
  const shown = series.slice(0, S);
  const glow = area ?? true;
  const max = Math.max(0, ...data.flatMap((d) => shown.map((s) => num(d[s.key]))));
  const ticks = niceTicks(max);
  const top = compact ? max * 1.08 || 1 : ticks[ticks.length - 1];
  const cell = compact ? px.cellSm : px.cell;
  const pitch = compact ? px.pitchSm : px.pitch;
  const isEmpty = !loading && n === 0;
  const { w, h } = box;
  const pad = pitch;
  const xAt = (i: number) => (n <= 1 ? w / 2 : pad + ((w - 2 * pad) * i) / (n - 1));
  const yOf = (v: number) => {
    const inset = compact ? cell : 0;
    return inset + (h - 2 * inset) * (1 - v / top);
  };
  const lines = React.useMemo(
    () => shown.map((s) => data.map((d, i): Point => ({ x: xAt(i), y: yOf(num(d[s.key])) }))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, shown.map((s) => s.key).join(), w, h, top, compact],
  );

  const lineW = compact ? px.lineSm : px.line;
  // The value lines, a light fill under the highest line, a thin rule at
  // the hovered point, the lines (the weaker first, so the strongest sits on
  // top) and a square on each series' hovered point.
  const draw = (ctx: CanvasRenderingContext2D, th: CellTheme) => {
    if (isEmpty || !n || !lines[0]?.length) return;
    if (!compact) drawGrid(ctx, th, ticks.map(yOf), w, h);
    if (glow) {
      const peak = lines[0].map((q, k) => ({ x: q.x, y: Math.min(...lines.map((pts) => pts[k].y)) }));
      ctx.fillStyle = seriesColour(th, 0, hues);
      ctx.globalAlpha = 0.1;
      ctx.beginPath();
      ctx.moveTo(peak[0].x, h);
      peak.forEach((q) => ctx.lineTo(q.x, q.y));
      ctx.lineTo(peak[n - 1].x, h);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    const hovered = hover >= 0 && hover < n;
    if (hovered) {
      ctx.fillStyle = rampAt(th, 0.5);
      ctx.globalAlpha = 0.5;
      ctx.fillRect(Math.round(lines[0][hover].x) - 0.5, 0, 1, h);
      ctx.globalAlpha = 1;
    }
    ctx.lineWidth = lineW;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    for (let si = lines.length - 1; si >= 0; si--) {
      ctx.setLineDash((LINE_DASH[si] ?? []).map((v) => v * lineW));
      ctx.strokeStyle = seriesColour(th, si, hues);
      ctx.beginPath();
      lines[si].forEach((q, k) => (k ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y)));
      ctx.stroke();
    }
    ctx.setLineDash([]);
    if (hovered) {
      const s = lineW * 2 + 3;
      lines.forEach((pts, si) => {
        const q = pts[hover];
        ctx.fillStyle = th.surface;
        ctx.fillRect(q.x - s / 2 - 2, q.y - s / 2 - 2, s + 4, s + 4);
        ctx.fillStyle = seriesColour(th, si, hues);
        ctx.fillRect(q.x - s / 2, q.y - s / 2, s, s);
      });
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!n || !lines[0]?.length) return;
    const r = e.currentTarget.getBoundingClientRect();
    setHover(nearestIndex(lines[0], e.clientX - r.left));
  };

  const describe = (i: number) =>
    `${data[i]?.[xKey] ?? ""}: ${shown.map((s) => `${s.label} ${formatNumber(num(data[i]?.[s.key]))}`).join(", ")}`;

  let tip: React.ReactNode = null;
  if (hover >= 0 && hover < n && w > 0) {
    const d = data[hover];
    tip = (
      <ChartTip
        x={xAt(hover)}
        y={Math.min(...lines.map((pts) => pts[hover].y))}
        w={w}
        side={pitch + 4}
        title={String(d[xKey] ?? "")}
        rows={shown.map((s, si) => ({ key: s.key, ...seriesLook(si, hues), value: formatNumber(num(d[s.key])), label: s.label, line: si }))}
      />
    );
  }

  const every = labelEvery(data.map((d) => String(d[xKey] ?? "")), w, 48);
  const last = n ? lines[0][n - 1] : null;
  const plot = (
    <div
      ref={plotRef}
      className={cn(PLOT, compact ? "inset-0" : cn("bottom-chart-axis-x left-chart-axis-y top-chart-plot-top", S === 1 ? "right-chart-end" : "right-0"))}
      {...keys}
      onPointerMove={onPointerMove}
    >
      <ChartCanvas
        w={w}
        h={h}
        draw={draw}
        drawKey={`${JSON.stringify(data)}|${shown.map((s) => s.key)}|${glow}|${compact}|${isEmpty}|${top}|${hues.join()}|${hover}`}
        loading={loading}
      />
      {/* The last value at the line's end (one series). */}
      {!compact && S === 1 && last && w > 0 && (
        <span aria-hidden className={cn("absolute -translate-y-1/2 pl-chart-value-gap", AXIS_TEXT)} style={{ left: last.x, top: last.y }}>
          {format(num(data[n - 1][shown[0].key]))}
        </span>
      )}
      {tip}
    </div>
  );

  return (
    <div role="group" aria-label={label} className={cn("relative w-full", compact ? "h-kpi-card-picture" : "h-chart-height", className)}>
      {!compact && (
        <div aria-hidden className="absolute bottom-chart-axis-x left-0 top-chart-plot-top w-chart-axis-y">
          {box.h > 0 &&
            n > 0 &&
            ticks.map((v) => (
              <span key={v} className={cn("absolute right-chart-value-gap -translate-y-1/2", AXIS_TEXT)} style={{ top: yOf(v) }}>
                {formatCompact(v)}
              </span>
            ))}
        </div>
      )}
      {plot}
      {!compact && (
        <div aria-hidden className={cn("absolute bottom-0 left-chart-axis-y h-chart-axis-x", S === 1 ? "right-chart-end" : "right-0")}>
          {box.w > 0 &&
            data.map((d, i) =>
              i % every ? null : (
                <span key={i} className={cn("absolute top-1/2 -translate-x-1/2 -translate-y-1/2", AXIS_TEXT)} style={{ left: xAt(i) }}>
                  {String(d[xKey] ?? "")}
                </span>
              ),
            )}
        </div>
      )}
      {isEmpty && <span className="absolute inset-x-0 bottom-0 text-center text-paragraph-sm text-text-muted">{empty}</span>}
      <Live text={hover >= 0 && hover < n ? describe(hover) : ""} />
      <DataTable
        caption={label}
        head={[xKey, ...shown.map((s) => s.label)]}
        rows={data.map((d) => [String(d[xKey] ?? ""), ...shown.map((s) => formatNumber(num(d[s.key])))])}
      />
    </div>
  );
}

/* ── Donut and pie ── */

export type DonutSlice = { label: string; value: number };

export type DonutChartProps = {
  data: DonutSlice[];
  /** A disc instead of a ring. */
  pie?: boolean;
  format?: ChartFormat;
  /** In the ring's middle: usually the total and what it counts. */
  centre?: { value: React.ReactNode; label?: React.ReactNode };
  /** The legend beside the ring (on by default). */
  legend?: boolean;
  loading?: boolean;
  className?: string;
  "aria-label": string;
};

const MAX_SLICES = 5;

/** Largest first; past five, the rest fold into Other. */
function foldSlices(data: DonutSlice[]): DonutSlice[] {
  const sorted = [...data].filter((d) => d.value > 0).sort((a, b) => b.value - a.value);
  if (sorted.length <= MAX_SLICES) return sorted;
  const head = sorted.slice(0, MAX_SLICES - 1);
  const rest = sorted.slice(MAX_SLICES - 1).reduce((s, d) => s + d.value, 0);
  return [...head, { label: "Other", value: rest }];
}

export function DonutChart({ data, pie = false, format = formatNumber, centre, legend = true, loading = false, className, "aria-label": label }: DonutChartProps) {
  const px = useChartPx();
  const [plotRef, box] = useBox();
  const slices = React.useMemo(() => foldSlices(data), [data]);
  const N = slices.length;
  const { hover, setHover, keys } = useDatumFocus(N);
  const total = slices.reduce((s, d) => s + d.value, 0) || 1;
  const { w, h } = box;
  const TAU = Math.PI * 2;
  const cx = w / 2, cy = h / 2;
  const r1 = Math.min(w, h) / 2 - px.pitch / 2;
  const r0 = pie ? 0 : r1 - px.donutRing;
  const spans = React.useMemo(() => {
    let a = 0;
    return slices.map((d) => {
      const a0 = a;
      a += (d.value / total) * TAU;
      return [a0, a] as const;
    });
  }, [slices, total, TAU]);
  const share = (v: number) => `${Math.round((v / total) * 100)}%`;

  // Solid slices, the hovered one full and the rest faded, cut apart by a
  // thin line in the card's colour. Angles run clockwise from twelve
  // o'clock; the canvas counts from three.
  const draw = (ctx: CanvasRenderingContext2D, th: CellTheme) => {
    if (!N || r1 <= 0) return;
    const turn = (a: number) => a - Math.PI / 2;
    slices.forEach((_, k) => {
      ctx.globalAlpha = hover >= 0 && hover !== k ? 0.4 : 1;
      ctx.fillStyle = rampAt(th, sliceT(k, N)(th));
      ctx.beginPath();
      ctx.arc(cx, cy, r1, turn(spans[k][0]), turn(spans[k][1]));
      if (r0 > 0) ctx.arc(cx, cy, r0, turn(spans[k][1]), turn(spans[k][0]), true);
      else ctx.lineTo(cx, cy);
      ctx.closePath();
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    if (N < 2) return;
    ctx.strokeStyle = th.surface;
    ctx.lineWidth = 2;
    for (const [a] of spans) {
      ctx.beginPath();
      ctx.moveTo(cx + Math.sin(a) * r0, cy - Math.cos(a) * r0);
      ctx.lineTo(cx + Math.sin(a) * (r1 + 1), cy - Math.cos(a) * (r1 + 1));
      ctx.stroke();
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - r.left - cx, y = e.clientY - r.top - cy;
    const d = Math.hypot(x, y);
    if (d > r1 + px.pitch * 2 || d < r0 - px.pitch * 2) return setHover(-1);
    let a = Math.atan2(x, -y);
    if (a < 0) a += TAU;
    setHover(spans.findIndex(([a0, a1]) => a >= a0 && a <= a1));
  };

  let tip: React.ReactNode = null;
  if (hover >= 0 && hover < N && w > 0) {
    const mid = (spans[hover][0] + spans[hover][1]) / 2;
    tip = (
      <ChartTip
        x={cx + Math.sin(mid) * (r1 + 4)}
        y={Math.max(0, cy - Math.cos(mid) * (r1 + 4) - 20)}
        w={w}
        side={4}
        rows={[{ key: "v", t: sliceT(hover, N), value: `${format(slices[hover].value)} (${share(slices[hover].value)})`, label: slices[hover].label }]}
      />
    );
  }

  return (
    <div role="group" aria-label={label} className={cn("flex flex-wrap items-center gap-chart-donut-gap", className)}>
      <div className="relative size-chart-donut shrink-0">
        <div ref={plotRef} className={cn(PLOT, "inset-0 rounded-full")} onPointerMove={onPointerMove} {...keys}>
          <ChartCanvas w={w} h={h} draw={draw} drawKey={`${JSON.stringify(slices)}|${pie}|${r1}|${r0}|${hover}`} loading={loading} />
          {tip}
        </div>
        {centre && !pie && (
          <div aria-hidden className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-title-h5 text-text-strong-950">{centre.value}</span>
            {centre.label != null && <span className="text-paragraph-xs text-text-muted">{centre.label}</span>}
          </div>
        )}
      </div>
      {legend && (
        <ul className="m-0 flex min-w-chart-legend-min flex-1 list-none flex-col gap-chart-legend-row p-0">
          {slices.map((d, k) => (
            <li
              key={d.label}
              className={cn("flex items-center gap-chart-legend-key-gap text-paragraph-sm", hover >= 0 && hover !== k && "opacity-60")}
              onPointerEnter={() => setHover(k)}
              onPointerLeave={() => setHover(-1)}
            >
              <Swatch t={sliceT(k, N)} />
              <span className="min-w-0 flex-1 truncate text-text-sub-600">{d.label}</span>
              <span className="text-label-sm text-text-strong-950 tabular-nums">{format(d.value)}</span>
              <span className="text-paragraph-xs text-text-muted tabular-nums">{share(d.value)}</span>
            </li>
          ))}
        </ul>
      )}
      <Live text={hover >= 0 && hover < N ? `${slices[hover].label}: ${format(slices[hover].value)}, ${share(slices[hover].value)}` : ""} />
      <DataTable caption={label} head={["Part", "Value", "Share"]} rows={slices.map((d) => [d.label, format(d.value), share(d.value)])} />
    </div>
  );
}

/* ── Gauge ── */

export type GaugeProps = {
  value: number;
  max?: number;
  /** md: 120 with the value in title-h5. sm: the KPI card's 64. */
  size?: "md" | "sm";
  /** Under the value (md only). */
  label?: React.ReactNode;
  /** The middle's words; the share by default. */
  display?: (value: number, max: number) => string;
  loading?: boolean;
  className?: string;
  "aria-label": string;
};

export function Gauge({ value, max = 100, size = "md", label, display, loading = false, className, "aria-label": ariaLabel }: GaugeProps) {
  const px = useChartPx();
  const [plotRef, box] = useBox();
  const { keys } = useDatumFocus(1);
  const { w, h } = box;
  const share = Math.max(0, Math.min(1, value / (max || 1)));
  const words = display ? display(value, max) : `${Math.round(share * 100)}%`;
  const ring = size === "sm" ? px.gaugeRingSm : px.gaugeRing;
  const pitch = size === "sm" ? px.pitchSm : px.pitch;

  // The track all round in the soft stroke, then the share filled in the
  // strongest colour from twelve o'clock, clockwise.
  const draw = (ctx: CanvasRenderingContext2D, th: CellTheme) => {
    const r1 = Math.min(w, h) / 2 - pitch / 2;
    const r0 = r1 - ring;
    if (r0 <= 0) return;
    const arc = (to: number) => {
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, r1, -Math.PI / 2, -Math.PI / 2 + to);
      ctx.arc(w / 2, h / 2, r0, -Math.PI / 2 + to, -Math.PI / 2, true);
      ctx.closePath();
      ctx.fill();
    };
    ctx.fillStyle = th.grid;
    arc(Math.PI * 2);
    if (share <= 0) return;
    ctx.fillStyle = rampAt(th, 1);
    arc(share * Math.PI * 2);
  };

  // Only the value sits inside the ring; its label goes under it, so no
  // word ever sits on the light (chart.md, Rules).
  return (
    <div role="group" aria-label={ariaLabel} className={cn("flex shrink-0 flex-col items-center gap-space-8", className)}>
      <div className={cn("relative", size === "sm" ? "size-kpi-card-gauge" : "size-chart-gauge")}>
        <div ref={plotRef} className={cn(PLOT, "inset-0 rounded-full")} {...keys}>
          <ChartCanvas w={w} h={h} draw={draw} drawKey={`${share}|${size}|${ring}|${pitch}`} loading={loading} />
        </div>
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 flex items-center justify-center",
            size === "sm" ? "text-label-sm text-text-strong-950" : "font-display text-title-h5 text-text-strong-950",
          )}
        >
          {words}
        </span>
      </div>
      {label != null && size === "md" && <span className="text-paragraph-xs text-text-muted">{label}</span>}
      <span className="sr-only">{`${ariaLabel}: ${words}`}</span>
    </div>
  );
}

/* ── Heatmap ── */

export type HeatmapProps = {
  /** The row names (top to bottom) and the column names (left to right). */
  rows: string[];
  cols: string[];
  /** values[row][col]. */
  values: number[][];
  format?: ChartFormat;
  /** Name every nth column (3; to fit, as many as have room). */
  colEvery?: number;
  /** Grow the cells to fill the box the heatmap sits in, such as a canvas's
   *  card (27 Oct 2026), keeping a cell's share of its pitch (12 of 15) and
   *  never below that size. Give the heatmap a height (`h-full`). */
  fit?: boolean;
  loading?: boolean;
  className?: string;
  "aria-label": string;
};

export function Heatmap({ rows, cols, values, format = formatNumber, colEvery, fit = false, loading = false, className, "aria-label": label }: HeatmapProps) {
  const px = useChartPx();
  const R = rows.length, C = cols.length;
  const { hover, setHover, keys } = useDatumFocus(R * C);
  const max = Math.max(1, ...values.flat().map(num));
  // The pitch: 15, or to fit, as much as the room allows: the plot column's
  // width, and the box's height less what the names, the key and the gaps
  // take (measured, so it follows their tokens).
  const [rootRef, root] = useBox();
  const [innerRef, inner] = useBox();
  const [colRef, col] = useBox();
  const [plotRef, plot] = useBox();
  const share = px.heatCell / px.heatPitch;
  let pitch = px.heatPitch;
  if (fit && R > 0 && C > 0 && col.w > 0 && root.h > 0 && inner.h > 0) {
    const room = root.h - (inner.h - plot.h);
    pitch = Math.max(px.heatPitch, Math.floor(Math.min(col.w / (C - 1 + share), room / (R - 1 + share))));
  }
  const cellPx = Math.round(pitch * share);
  const w = C * pitch - (pitch - cellPx);
  const h = R * pitch - (pitch - cellPx);
  const every = colEvery ?? (fit ? labelEvery(cols, w, 0) : 3);
  const tOf = (th: CellTheme, v: number) => th.seq[0] + (th.seq[1] - th.seq[0]) * (v / max);

  // One solid square per value (an empty one in the soft stroke); the
  // hovered square outlined in the strongest colour.
  const draw = (ctx: CanvasRenderingContext2D, th: CellTheme) => {
    for (let r = 0; r < R; r++) {
      for (let c = 0; c < C; c++) {
        const v = num(values[r]?.[c]);
        ctx.fillStyle = v > 0 ? rampAt(th, tOf(th, v)) : th.grid;
        ctx.fillRect(c * pitch, r * pitch, cellPx, cellPx);
      }
    }
    if (hover < 0) return;
    ctx.strokeStyle = rampAt(th, 1);
    ctx.lineWidth = 2;
    ctx.strokeRect((hover % C) * pitch + 1, Math.floor(hover / C) * pitch + 1, cellPx - 2, cellPx - 2);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const b = e.currentTarget.getBoundingClientRect();
    const c = Math.floor((e.clientX - b.left) / pitch);
    const r = Math.floor((e.clientY - b.top) / pitch);
    setHover(r >= 0 && r < R && c >= 0 && c < C ? r * C + c : -1);
  };

  let tip: React.ReactNode = null;
  if (hover >= 0) {
    const r = Math.floor(hover / C), c = hover % C;
    tip = (
      <ChartTip
        x={c * pitch + cellPx / 2}
        y={r * pitch}
        w={w}
        title={`${rows[r]}, ${cols[c]}`}
        rows={[{ key: "v", t: (th) => tOf(th, num(values[r]?.[c])), value: format(num(values[r]?.[c])), label: "" }]}
      />
    );
  }

  return (
    <div ref={rootRef} role="group" aria-label={label} className={cn("min-w-0", className)}>
      <div ref={innerRef} className="flex min-w-0 flex-col gap-space-12">
      <div className="flex max-w-full gap-space-8 overflow-x-auto pb-space-4">
        <div aria-hidden className="relative min-w-chart-heat-label shrink-0" style={{ height: h }}>
          {/* The column takes its longest name's width, so no name is cut
              (27 Oct 2026: "Facility A" ran past a 40 wide column). */}
          <span className={cn("invisible block", AXIS_TEXT)}>
            {rows.reduce((a, b) => (b.length > a.length ? b : a), "")}
          </span>
          {rows.map((name, r) => (
            <span key={name} className={cn("absolute right-0 -translate-y-1/2", AXIS_TEXT)} style={{ top: r * pitch + cellPx / 2 }}>
              {name}
            </span>
          ))}
        </div>
        <div ref={colRef} className={cn("flex flex-col gap-space-6", fit ? "min-w-0 flex-1" : "shrink-0")}>
          <div ref={plotRef} className={cn(PLOT, "relative")} style={{ width: w, height: h }} onPointerMove={onPointerMove} {...keys}>
            <ChartCanvas w={w} h={h} draw={draw} drawKey={`${JSON.stringify(values)}|${pitch}|${hover}`} loading={loading} />
            {tip}
          </div>
          <div aria-hidden className="relative h-chart-axis-x" style={{ width: w }}>
            {cols.map((name, c) =>
              c % every ? null : (
                <span
                  key={name}
                  // Under its cell: at the cell's start, or centred on a
                  // cell grown to fit.
                  className={cn("absolute top-0", fit && "-translate-x-1/2", AXIS_TEXT)}
                  style={{ left: fit ? c * pitch + cellPx / 2 : c * pitch }}
                >
                  {name}
                </span>
              ),
            )}
          </div>
        </div>
      </div>
      <HeatKey />
      </div>
      <Live text={hover >= 0 ? `${rows[Math.floor(hover / C)]}, ${cols[hover % C]}: ${format(num(values[Math.floor(hover / C)]?.[hover % C]))}` : ""} />
      <DataTable caption={label} head={["", ...cols]} rows={rows.map((name, r) => [name, ...cols.map((_, c) => format(num(values[r]?.[c])))])} />
    </div>
  );
}

/** "Less" to "More": five squares across the heatmap's range. */
function HeatKey() {
  return (
    <div aria-hidden className="flex items-center gap-space-6 text-paragraph-xs text-text-muted">
      Less
      {[0.08, 0.3, 0.55, 0.8, 1].map((u) => (
        <Swatch key={u} t={(th) => th.seq[0] + (th.seq[1] - th.seq[0]) * u} />
      ))}
      More
    </div>
  );
}

/* ── Breakdown bar ── */

export type BreakdownBarProps = {
  items: DonutSlice[];
  format?: ChartFormat;
  /** The legend under the band (on by default). */
  legend?: boolean;
  loading?: boolean;
  className?: string;
  "aria-label": string;
};

export function BreakdownBar({ items, format = formatNumber, legend = true, loading = false, className, "aria-label": label }: BreakdownBarProps) {
  const [plotRef, box] = useBox();
  const N = items.length;
  const { hover, setHover, keys } = useDatumFocus(N);
  const total = items.reduce((s, d) => s + Math.max(0, d.value), 0) || 1;
  const { w, h } = box;
  const edges = React.useMemo(() => {
    let x = 0;
    return items.map((d) => {
      const x0 = x;
      x += (Math.max(0, d.value) / total) * w;
      return [x0, x] as const;
    });
  }, [items, total, w]);
  const share = (v: number) => `${Math.round((v / total) * 100)}%`;

  // Colour follows each part, in the order given; a 2px gap between parts,
  // the hovered one full and the rest faded.
  const draw = (ctx: CanvasRenderingContext2D, th: CellTheme) => {
    items.forEach((_, k) => {
      const [x0, x1] = edges[k];
      const from = x0 + (k > 0 ? 2 : 0);
      if (x1 <= from) return;
      ctx.globalAlpha = hover >= 0 && hover !== k ? 0.4 : 1;
      ctx.fillStyle = rampAt(th, sliceT(k, N)(th));
      ctx.fillRect(from, 0, x1 - from, h);
    });
    ctx.globalAlpha = 1;
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const x = e.clientX - e.currentTarget.getBoundingClientRect().left;
    setHover(edges.findIndex(([x0, x1]) => x >= x0 && x <= x1));
  };

  return (
    <div role="group" aria-label={label} className={cn("flex w-full flex-col gap-space-12", className)}>
      <div className="relative h-chart-breakdown w-full">
        <div ref={plotRef} className={cn(PLOT, "inset-0")} onPointerMove={onPointerMove} {...keys}>
          <ChartCanvas w={w} h={h} draw={draw} drawKey={`${JSON.stringify(items)}|${w}|${hover}`} loading={loading} />
          {hover >= 0 && hover < N && w > 0 && (
            <ChartTip
              x={(edges[hover][0] + edges[hover][1]) / 2}
              y={0}
              w={w}
              rows={[{ key: "v", t: sliceT(hover, N), value: `${format(items[hover].value)} (${share(items[hover].value)})`, label: items[hover].label }]}
            />
          )}
        </div>
      </div>
      {legend && (
        <div className="flex flex-wrap items-center gap-x-chart-legend-gap gap-y-space-4">
          {items.map((d, k) => (
            <span key={d.label} className="inline-flex items-center gap-chart-legend-key-gap text-label-xs text-text-sub-600">
              <Swatch t={sliceT(k, N)} />
              {d.label}
              <span className="text-paragraph-xs text-text-muted tabular-nums">{share(d.value)}</span>
            </span>
          ))}
        </div>
      )}
      <Live text={hover >= 0 && hover < N ? `${items[hover].label}: ${format(items[hover].value)}, ${share(items[hover].value)}` : ""} />
      <DataTable caption={label} head={["Part", "Value", "Share"]} rows={items.map((d) => [d.label, format(d.value), share(d.value)])} />
    </div>
  );
}
