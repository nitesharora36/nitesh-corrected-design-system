"use client";

/**
 * The Neutrino cells: the engine every chart draws with
 * (design-system/components/chart.md). The detector wall of the brand's cells
 * form (8bit Branding, the-light.md) and the chat home's field
 * (components/chat-flow/home-field.tsx): a lattice of small squares where
 * grey cells wait and blue cells are caught.
 *
 *   makeLattice / newPicture / light ...   a chart paints its data into a
 *                                           Picture: per cell an energy (how
 *                                           much of it the data covers), a
 *                                           place on the light's ramp, the
 *                                           datum it belongs to and when it
 *                                           ignites.
 *   CellCanvas                              draws a Picture on a canvas and
 *                                           keeps it alive: arrival, the
 *                                           deck's calm twinkle, the cursor's
 *                                           warmth, a click's pulse, the
 *                                           loading wipe, hover.
 *   CellSwatch                              a legend key: a few cells in a
 *                                           series' colour and pattern.
 *   ChartHueContext                         the hue the cells wear: the
 *                                           light's blue, green, red or
 *                                           amber, one for the chart or one
 *                                           per series (a picture's pens).
 *
 * Colours come only from the tokens (--chart-cells-* in theme-tokens.css,
 * which point at the home field's), so both themes work and no literal colour
 * lives here. Reduced motion shows the still. The frame loop sleeps when a
 * chart is out of view. jsdom has no canvas: drawing bails when getContext
 * returns null.
 */
import * as React from "react";

import { buildLut, clamp01, fillStyle, parseColour, rnd, smooth, smoothstep, type RGB } from "@/lib/neutrino-light";
import { cn } from "@/lib/utils";

export const LUT_N = 64;
const SEED = 11;
// The four tones of a caught cell: the deck's four, raised so the data reads.
const TONES = [0.7, 0.8, 0.9, 1];
// The share of the wall's cells that wait at rest, each a little different.
const WALL_SHARE = 0.62;
// The deck's twinkle (D024): a cell holds a state 1.2 to 2 s and steps in
// 90 ms; the lit cells breathe at 30 fps.
const STEP_MS = 90;
const FPS = 30;
// Arrival: ignition spreads over ARRIVE_SPREAD ms along each cell's order,
// each cell easing in over ARRIVE_EASE.
const ARRIVE_SPREAD = 760;
const ARRIVE_EASE = 260;
// The cursor's warmth on the wall (the home's signal form, smaller), and a
// click's pulse.
const HEAT_RADIUS = 30;
const HEAT_TAU = 420;
const HEAT_ALPHA = 0.5;
const PULSE_SPEED = 0.3; // px per ms
const PULSE_WIDTH = 12;
const PULSE_MS = 900;
// Hover: the datum under the pointer climbs the ramp and brightens; the rest dim.
const HOVER_T = 0.14;
const HOVER_LIFT = 1.15;
const HOVER_DIM = 0.55;
// Loading: a band of warm cells crossing the wall.
const WIPE_MS = 1700;
const WIPE_WIDTH = 0.24;

/* ── The theme: the light's ramp and the wall, from the tokens ── */

/** The hues a chart can wear: the light's blue, and the palette's green, red
 *  and amber on the same ramp (--chart-cells-ramp-*). */
export type ChartHue = "blue" | "green" | "red" | "amber";
export const CHART_HUES: ChartHue[] = ["blue", "green", "red", "amber"];

/** The hues inside it: one for every chart and key, or one per series (the
 *  first is the chart's own: its wall's warmth, its lines, its markers).
 *  ChartCard's hue sets it. */
export const ChartHueContext = React.createContext<ChartHue[]>(["blue"]);

export type CellTheme = {
  /** The ramp, cold to hot, LUT_N canvas fill styles. Hot is the strongest
   *  contrast against the card in both themes. In the chart's first hue. */
  lut: string[];
  /** Every hue's ramp. */
  luts: Record<ChartHue, string[]>;
  /** The ramps a picture's pens draw with: the context's hues, in order. */
  pens: string[][];
  /** A line's place on its ramp when each series has its own hue. */
  hueLine: number;
  rest: string;
  restAlpha: number;
  gain: number;
  /** The ramp position of each series, strongest first. */
  series: number[];
  /** The sequential range (heatmaps): from, to. */
  seq: [number, number];
  /** The card's colour, for the ring around a marker. */
  surface: string;
};

export function readCellTheme(el: Element): CellTheme | null {
  const cs = getComputedStyle(el);
  const list = (name: string) =>
    cs
      .getPropertyValue(name)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  const nums = (name: string) => list(name).map(parseFloat).filter((v) => !Number.isNaN(v));
  const stops = list("--chart-cells-ramp")
    .map(parseColour)
    .filter((c): c is RGB => c !== null);
  const rest = parseColour(cs.getPropertyValue("--color-chart-cells-rest"));
  if (stops.length < 2 || !rest) return null;
  const at = nums("--chart-cells-ramp-stops");
  const positions = at.length === stops.length ? at : stops.map((_, i) => i / (stops.length - 1));
  const one = (name: string, fallback: number) => nums(name)[0] ?? fallback;
  const series = nums("--chart-cells-series");
  const seq = nums("--chart-cells-seq");
  const blue = buildLut(stops, positions, LUT_N);
  const ramp = (hue: ChartHue) => {
    if (hue === "blue") return blue;
    const own = list(`--chart-cells-ramp-${hue}`)
      .map(parseColour)
      .filter((c): c is RGB => c !== null);
    return own.length === positions.length ? buildLut(own, positions, LUT_N) : blue;
  };
  const luts = Object.fromEntries(CHART_HUES.map((hue) => [hue, ramp(hue)])) as Record<ChartHue, string[]>;
  return {
    lut: blue,
    luts,
    pens: [blue],
    hueLine: one("--chart-cells-hue-line", 1),
    rest: fillStyle(rest),
    restAlpha: one("--chart-cells-rest-alpha", 0.05),
    gain: one("--chart-cells-gain", 1),
    series: series.length ? series : [1, 0.5, 0.75],
    seq: seq.length === 2 ? [seq[0], seq[1]] : [0.4, 1],
    surface: cs.getPropertyValue("--bg-white-0").trim() || "transparent",
  };
}

/** A theme in the given hues: the first is the chart's, each is a pen. */
export function tintTheme(th: CellTheme, hues: ChartHue[]): CellTheme {
  const pens = hues.map((hue) => th.luts[hue]);
  return { ...th, lut: pens[0] ?? th.lut, pens: pens.length ? pens : [th.lut] };
}

/** The cell theme of an element, in the hues around it (ChartHueContext),
 *  read again when the app's theme changes. */
export function useCellTheme(ref: React.RefObject<Element | null>) {
  const hues = React.useContext(ChartHueContext);
  const hueKey = hues.join(",");
  const [base, setTheme] = React.useState<CellTheme | null>(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => setTheme(readCellTheme(el));
    read();
    const watch = new MutationObserver(read);
    watch.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "data-greys"] });
    return () => watch.disconnect();
  }, [ref]);
  // hueKey stands for hues: the context gives a new array each render.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useMemo(() => base && tintTheme(base, hues), [base, hueKey]);
}

/** A colour on pen `pen`'s ramp at t. */
export function penAt(th: CellTheme, pen: number, t: number) {
  return (th.pens[pen] ?? th.lut)[Math.round(clamp01(t) * (LUT_N - 1))];
}

/** A colour on the ramp at t (0 cold, 1 hot). */
export function rampAt(th: CellTheme, t: number) {
  return th.lut[Math.round(clamp01(t) * (LUT_N - 1))];
}

/* ── The lattice and the picture ── */

export type Lattice = {
  w: number;
  h: number;
  size: number;
  pitch: number;
  cols: number;
  rows: number;
  /** The first cell's left and top: the lattice sits on the box's bottom edge, centred across. */
  ox: number;
  oy: number;
};

export function makeLattice(w: number, h: number, size: number, pitch: number): Lattice {
  const cols = Math.max(1, Math.floor((w - size) / pitch) + 1);
  const rows = Math.max(1, Math.floor((h - size) / pitch) + 1);
  const ox = Math.floor((w - ((cols - 1) * pitch + size)) / 2);
  const oy = Math.floor(h - ((rows - 1) * pitch + size));
  return { w, h, size, pitch, cols, rows, ox, oy };
}

/** A cell's centre. */
export const centreX = (l: Lattice, i: number) => l.ox + i * l.pitch + l.size / 2;
export const centreY = (l: Lattice, j: number) => l.oy + j * l.pitch + l.size / 2;
/** The cell column or row nearest a point. */
export const colAt = (l: Lattice, x: number) => Math.round((x - l.ox - l.size / 2) / l.pitch);
export const rowAt = (l: Lattice, y: number) => Math.round((y - l.oy - l.size / 2) / l.pitch);

export type Picture = {
  /** How much of the cell the data covers, 0 to 1. */
  e: Float32Array;
  /** Its place on the ramp. */
  t: Float32Array;
  /** The datum it belongs to, -1 for none. */
  mark: Int32Array;
  /** When it ignites, 0 first to 1 last. */
  order: Float32Array;
  /** The waiting wall: 0 for no cell, else its share of the wall alpha. */
  wall: Float32Array;
  /** A tick row: the wall there sits at twice its alpha. */
  tick: Uint8Array;
  tone: Float32Array;
  period: Float32Array;
  phase: Float32Array;
  /** The pen each cell was lit with: its hue, an index into the theme's pens. */
  pen: Uint8Array;
  /** The pen light() lights with now; a chart sets it before each series. */
  ink: number;
};

export function newPicture(l: Lattice, wallShare = WALL_SHARE): Picture {
  const n = l.cols * l.rows;
  const wall = new Float32Array(n);
  const tone = new Float32Array(n);
  const period = new Float32Array(n);
  const phase = new Float32Array(n);
  for (let j = 0; j < l.rows; j++) {
    for (let i = 0; i < l.cols; i++) {
      const k = j * l.cols + i;
      if (rnd(i, j, SEED) < wallShare) wall[k] = 0.55 + 0.9 * rnd(i, j, SEED + 1);
      tone[k] = TONES[Math.floor(rnd(i, j, SEED + 2) * TONES.length)];
      period[k] = 1200 + rnd(i, j, SEED + 3) * 800;
      phase[k] = rnd(i, j, SEED + 4) * 2000;
    }
  }
  return {
    e: new Float32Array(n),
    t: new Float32Array(n),
    mark: new Int32Array(n).fill(-1),
    order: new Float32Array(n),
    wall,
    tick: new Uint8Array(n),
    tone,
    period,
    phase,
    pen: new Uint8Array(n),
    ink: 0,
  };
}

/** Which cells a series lights: every cell, a checkerboard, or one in four.
 *  Patterns carry a series' identity beside its colour (chart.md). */
export type CellPattern = "solid" | "checker" | "sparse";
export const PATTERNS: CellPattern[] = ["solid", "checker", "sparse"];

export function patternOn(pattern: CellPattern, i: number, j: number) {
  if (pattern === "checker") return (i + j) % 2 === 0;
  if (pattern === "sparse") return i % 2 === 0 && j % 2 === 0;
  return true;
}

/** Lights cell (i, j): energy e at ramp position t, for datum `mark`,
 *  igniting at `order`. The strongest claim on a cell wins. */
export function light(l: Lattice, p: Picture, i: number, j: number, e: number, t: number, mark: number, order: number) {
  if (i < 0 || j < 0 || i >= l.cols || j >= l.rows || e <= 0) return;
  const k = j * l.cols + i;
  if (e <= p.e[k]) return;
  p.e[k] = Math.min(1, e);
  p.t[k] = clamp01(t);
  p.mark[k] = mark;
  p.order[k] = clamp01(order);
  p.pen[k] = p.ink;
}

/** Marks the row nearest y as a tick row (a gridline made of the wall). */
export function tickRow(l: Lattice, p: Picture, y: number) {
  const j = rowAt(l, y);
  if (j < 0 || j >= l.rows) return;
  for (let i = 0; i < l.cols; i++) p.tick[j * l.cols + i] = 1;
}

/** How much of a cell's span [c0, c0 + size] lies inside [a, b]. */
export function cover(c0: number, size: number, a: number, b: number) {
  return clamp01((Math.min(c0 + size, b) - Math.max(c0, a)) / size);
}

/** A column of cells from yTop down to yBase over x0 to x1 (a bar): cool at
 *  the base, hot at its own end, igniting from the base up. */
export function fillColumn(
  l: Lattice,
  p: Picture,
  x0: number,
  x1: number,
  yTop: number,
  yBase: number,
  tLo: number,
  tHi: number,
  mark: number,
  order0: number,
  orderSpan: number,
  pattern: CellPattern = "solid",
) {
  const span = Math.max(1, yBase - yTop);
  for (let i = 0; i < l.cols; i++) {
    const cx = centreX(l, i);
    if (cx < x0 || cx > x1) continue;
    for (let j = 0; j < l.rows; j++) {
      const y0 = l.oy + j * l.pitch;
      const e = cover(y0, l.size, yTop, yBase);
      if (e <= 0 || !patternOn(pattern, i, j)) continue;
      const rel = clamp01((yBase - (y0 + l.size / 2)) / span);
      light(l, p, i, j, e, tLo + (tHi - tLo) * rel, mark, order0 + orderSpan * rel);
    }
  }
}

/** The cube form's faces and top, as places below the bar's hot end: the
 *  left face (base to top), the right face, and the top at the hot end. */
const CUBE_LEFT: [number, number] = [0.7, 0.58];
const CUBE_RIGHT: [number, number] = [0.22, 0.1];

/** A bar as a cube (the bar chart's cube form, after the Figma's
 *  BarLineChart, 198309:63497): a box turned to its front edge, so the left
 *  face sits lower on the ramp than the right, and the top is a flat
 *  diamond of the hottest cells, a row higher across the middle. Each face
 *  keeps the column's rise, cool at the base; it ignites from the base up,
 *  the top last. */
export function fillCube(
  l: Lattice,
  p: Picture,
  x0: number,
  x1: number,
  yTop: number,
  yBase: number,
  tHi: number,
  mark: number,
  order0: number,
  orderSpan: number,
  pattern: CellPattern = "solid",
) {
  const cols: number[] = [];
  for (let i = 0; i < l.cols; i++) {
    const cx = centreX(l, i);
    if (cx >= x0 && cx <= x1) cols.push(i);
  }
  if (!cols.length) return;
  const half = Math.floor(cols.length / 2);
  const faces = orderSpan * 0.85;
  if (half > 0) {
    const xEnd = centreX(l, cols[half - 1]) + 0.5;
    fillColumn(l, p, x0, xEnd, yTop, yBase, tHi - CUBE_LEFT[0], tHi - CUBE_LEFT[1], mark, order0, faces, pattern);
  }
  const xStart = centreX(l, cols[half]) - 0.5;
  fillColumn(l, p, xStart, x1, yTop, yBase, tHi - CUBE_RIGHT[0], tHi - CUBE_RIGHT[1], mark, order0, faces, pattern);

  // The top: the bar's first row of cells, and the row over it across the middle half.
  const jTop = Math.max(0, Math.floor((yTop - l.oy - l.size) / l.pitch) + 1);
  if (jTop >= l.rows || l.oy + jTop * l.pitch >= yBase) return;
  const capped = (i: number, j: number) => {
    if (j < 0) return;
    const k = j * l.cols + i;
    p.e[k] = 1;
    p.t[k] = clamp01(tHi);
    p.mark[k] = mark;
    p.order[k] = clamp01(order0 + orderSpan);
    p.pen[k] = p.ink;
  };
  cols.forEach((i, c) => {
    capped(i, jTop);
    if (cols.length >= 3 && c >= Math.floor(cols.length * 0.25) && c < Math.ceil(cols.length * 0.75)) capped(i, jTop - 1);
  });
}

/** A row of cells from x0 to xEnd over y0 to y1 (a horizontal bar): cool at
 *  the label end, hot at its tip, igniting towards the tip. */
export function fillRow(
  l: Lattice,
  p: Picture,
  y0: number,
  y1: number,
  x0: number,
  xEnd: number,
  tLo: number,
  tHi: number,
  mark: number,
  order0: number,
  orderSpan: number,
  pattern: CellPattern = "solid",
) {
  const span = Math.max(1, xEnd - x0);
  for (let j = 0; j < l.rows; j++) {
    const cy = centreY(l, j);
    if (cy < y0 || cy > y1) continue;
    for (let i = 0; i < l.cols; i++) {
      const cx0 = l.ox + i * l.pitch;
      const e = cover(cx0, l.size, x0, xEnd);
      if (e <= 0 || !patternOn(pattern, i, j)) continue;
      const rel = clamp01((cx0 + l.size / 2 - x0) / span);
      light(l, p, i, j, e, tLo + (tHi - tLo) * rel, mark, order0 + orderSpan * rel);
    }
  }
}

export type Point = { x: number; y: number };

/** The line's y at x, along the polyline (clamped at its ends). */
export function yOnLine(pts: Point[], x: number) {
  if (x <= pts[0].x) return pts[0].y;
  for (let s = 1; s < pts.length; s++) {
    if (x <= pts[s].x) {
      const a = pts[s - 1], b = pts[s];
      return a.y + ((b.y - a.y) * (x - a.x)) / Math.max(1e-6, b.x - a.x);
    }
  }
  return pts[pts.length - 1].y;
}

/** The point nearest x, by index. */
export function nearestIndex(pts: Point[], x: number) {
  let best = 0;
  for (let s = 1; s < pts.length; s++) if (Math.abs(pts[s].x - x) < Math.abs(pts[best].x - x)) best = s;
  return best;
}

/** The field at a line's foot (chart.md, Line; Nitesh, 19 Oct 2026: the
 *  line sharp, the Neutrino effect at the bottom). Under the line the cells
 *  light from the baseline up: brightest and hottest at the foot, thinning
 *  and cooling as they rise, gone before they reach the line, so a dark gap
 *  keeps the line alone, as the home's glow rises from the foot. The line
 *  itself is drawn sharp over the cells by the chart. */
export function fillFoot(l: Lattice, p: Picture, pts: Point[], t: number, strength: number) {
  if (!pts.length) return;
  const xFirst = pts[0].x, xLast = pts[pts.length - 1].x;
  for (let i = 0; i < l.cols; i++) {
    const cx = centreX(l, i);
    if (cx < xFirst || cx > xLast) continue;
    const yLine = yOnLine(pts, cx);
    const span = l.h - yLine;
    if (span < l.pitch * 2) continue;
    const mark = nearestIndex(pts, cx);
    const order = (cx - xFirst) / Math.max(1, xLast - xFirst);
    for (let j = 0; j < l.rows; j++) {
      const cy = centreY(l, j);
      if (cy < yLine + l.pitch * 1.5) continue;
      // 0 at the foot, 1 at the line.
      const rise = (l.h - cy) / span;
      const e = strength * (1 - smoothstep(0.08, 0.9, rise));
      if (e < 0.03 || rnd(i, j, SEED + 7) > 1.05 - rise * 0.95) continue;
      light(l, p, i, j, e, t - 0.5 * rise, mark, order);
    }
  }
}

/** A slice of a ring (or a disc when r0 is 0), from angle a0 to a1 in
 *  radians clockwise from twelve o'clock, cut from its neighbours by a dark
 *  gap of `gapCells` cells. */
export function fillRing(
  l: Lattice,
  p: Picture,
  cx: number,
  cy: number,
  r0: number,
  r1: number,
  a0: number,
  a1: number,
  t0: number,
  t1: number,
  mark: number,
  pattern: CellPattern,
  gapCells = 1,
  e0 = 1,
) {
  const TAU = Math.PI * 2;
  for (let j = 0; j < l.rows; j++) {
    const y = centreY(l, j);
    if (Math.abs(y - cy) > r1 + l.pitch) continue;
    for (let i = 0; i < l.cols; i++) {
      const x = centreX(l, i);
      const r = Math.hypot(x - cx, y - cy);
      if (r > r1 + l.pitch / 2 || r < r0 - l.pitch / 2) continue;
      let a = Math.atan2(x - cx, cy - y);
      if (a < 0) a += TAU;
      if (a < a0 || a > a1) continue;
      // The dark cut: the arc length to the slice's edges, in cells.
      const edge = Math.min(a - a0, a1 - a) * Math.max(r, l.pitch);
      if (gapCells > 0 && a1 - a0 < TAU - 1e-6 && edge < l.pitch * gapCells * 0.6) continue;
      const radial = clamp01(Math.min(r - r0, r1 - r) / l.pitch + 0.5);
      if (radial <= 0 || !patternOn(pattern, i, j)) continue;
      const along = (a - a0) / Math.max(1e-6, a1 - a0);
      light(l, p, i, j, radial * e0, t0 + (t1 - t0) * along, mark, a / TAU);
    }
  }
}

/* ── Drawing ── */

type FrameState = {
  /** The time, for the twinkle; null draws the still. */
  ms: number | null;
  /** Ms since the arrival began; Infinity once arrived. */
  elapsed: number;
  hover: number;
  heat: Float32Array | null;
  /** The loading wipe's place, 0 to 1, or null. */
  wipe: number | null;
  /** 1, or less while a refresh holds the old chart. */
  dim: number;
};

/** The deck's twinkle for cells: each cell holds one of four states for its
 *  period (rest, lift, peak, dip) and steps between them in STEP_MS. */
function twinkleState(k: number, slot: number) {
  const r = rnd(k, slot, SEED + 9);
  if (r < 0.05) return 1.12;
  if (r < 0.075) return 1.25;
  if (r < 0.11) return 0.6;
  return 1;
}

function twinkle(p: Picture, k: number, ms: number) {
  const t = ms + p.phase[k];
  const period = p.period[k];
  const slot = Math.floor(t / period);
  const now = twinkleState(k, slot);
  const before = twinkleState(k, slot - 1);
  return before + (now - before) * smooth((t - slot * period) / STEP_MS);
}

function drawCells(ctx: CanvasRenderingContext2D, l: Lattice, p: Picture, th: CellTheme, s: FrameState) {
  ctx.clearRect(0, 0, l.w, l.h);
  const n = l.cols * l.rows;
  const { size, pitch, ox, oy, cols } = l;
  const arrived = s.elapsed === Infinity;
  const wallIn = arrived ? 1 : smooth(s.elapsed / 300);
  let alpha = -1;

  // The wall: the cells waiting, faint and uneven, the tick rows twice as strong.
  ctx.fillStyle = th.rest;
  for (let k = 0; k < n; k++) {
    let w = p.wall[k];
    if (p.tick[k]) w = Math.max(w, 0.9) * 2;
    if (!w || p.e[k] >= 0.6) continue;
    const a = Math.floor(Math.min(1, th.restAlpha * w * wallIn * s.dim) * 255) / 255;
    if (a <= 0) continue;
    if (a !== alpha) ctx.globalAlpha = alpha = a;
    ctx.fillRect(ox + (k % cols) * pitch, oy + Math.floor(k / cols) * pitch, size, size);
  }

  // The caught cells, by their pen and their place on its ramp.
  const buckets: number[][] = [];
  const alphas = new Float32Array(n);
  for (let k = 0; k < n; k++) {
    const e = p.e[k];
    if (e <= 0) continue;
    let a = e * p.tone[k] * th.gain * s.dim;
    if (s.ms !== null) a *= twinkle(p, k, s.ms);
    if (!arrived) a *= smooth((s.elapsed - p.order[k] * ARRIVE_SPREAD) / ARRIVE_EASE);
    let t = p.t[k];
    if (s.hover >= 0 && p.mark[k] >= 0) {
      if (p.mark[k] === s.hover) {
        t += HOVER_T;
        a *= HOVER_LIFT;
      } else a *= HOVER_DIM;
    }
    a = Math.floor(Math.min(1, a) * 255) / 255;
    if (a <= 0) continue;
    alphas[k] = a;
    (buckets[p.pen[k] * LUT_N + Math.round(clamp01(t) * (LUT_N - 1))] ??= []).push(k);
  }
  for (let b = 0; b < buckets.length; b++) {
    const cells = buckets[b];
    if (!cells) continue;
    ctx.fillStyle = (th.pens[Math.floor(b / LUT_N)] ?? th.lut)[b % LUT_N];
    for (const k of cells) {
      if (alphas[k] !== alpha) ctx.globalAlpha = alpha = alphas[k];
      ctx.fillRect(ox + (k % cols) * pitch, oy + Math.floor(k / cols) * pitch, size, size);
    }
  }

  // The loading wipe: a soft band of warm cells crossing the wall.
  if (s.wipe !== null) {
    const band = l.w * WIPE_WIDTH;
    const centre = -band / 2 + s.wipe * (l.w + band);
    for (let k = 0; k < n; k++) {
      if (!p.wall[k]) continue;
      const cx = ox + (k % cols) * pitch + size / 2;
      const d = (cx - centre) / (band / 2);
      if (Math.abs(d) > 1.6) continue;
      const v = Math.exp(-d * d * 2);
      const a = Math.floor(Math.min(1, v * 0.42 * th.gain) * 255) / 255;
      if (a <= 0) continue;
      ctx.fillStyle = rampAt(th, 0.35 + 0.45 * v);
      if (a !== alpha) ctx.globalAlpha = alpha = a;
      ctx.fillRect(ox + (k % cols) * pitch, oy + Math.floor(k / cols) * pitch, size, size);
    }
  }

  // The cursor's warmth: the wall lights in blue under it and fades behind it.
  if (s.heat) {
    for (let k = 0; k < n; k++) {
      const hv = s.heat[k];
      if (hv < 1 / 255) continue;
      const a = Math.floor(Math.min(1, hv * HEAT_ALPHA * th.gain) * 255) / 255;
      if (a <= 0) continue;
      ctx.fillStyle = rampAt(th, 0.4 + 0.45 * hv);
      if (a !== alpha) ctx.globalAlpha = alpha = a;
      ctx.fillRect(ox + (k % cols) * pitch, oy + Math.floor(k / cols) * pitch, size, size);
    }
  }
  ctx.globalAlpha = 1;
}

/** Warms the cells within `radius` of (x, y) to at least the kernel's value. */
function stamp(l: Lattice, heat: Float32Array, x: number, y: number, radius: number, strength: number) {
  const sigma = radius / 2.2;
  const i0 = Math.max(0, Math.floor((x - l.ox - radius) / l.pitch));
  const i1 = Math.min(l.cols - 1, Math.ceil((x - l.ox + radius) / l.pitch));
  const j0 = Math.max(0, Math.floor((y - l.oy - radius) / l.pitch));
  const j1 = Math.min(l.rows - 1, Math.ceil((y - l.oy + radius) / l.pitch));
  for (let j = j0; j <= j1; j++) {
    const cy = centreY(l, j);
    for (let i = i0; i <= i1; i++) {
      const cx = centreX(l, i);
      const d2 = (cx - x) ** 2 + (cy - y) ** 2;
      if (d2 > radius * radius) continue;
      const v = strength * Math.exp(-d2 / (2 * sigma * sigma));
      const k = j * l.cols + i;
      if (v > heat[k]) heat[k] = v;
    }
  }
}

/** A pulse's ring at radius r. */
function stampRing(l: Lattice, heat: Float32Array, x: number, y: number, r: number, strength: number) {
  const reach = r + PULSE_WIDTH * 2;
  const i0 = Math.max(0, Math.floor((x - l.ox - reach) / l.pitch));
  const i1 = Math.min(l.cols - 1, Math.ceil((x - l.ox + reach) / l.pitch));
  const j0 = Math.max(0, Math.floor((y - l.oy - reach) / l.pitch));
  const j1 = Math.min(l.rows - 1, Math.ceil((y - l.oy + reach) / l.pitch));
  for (let j = j0; j <= j1; j++) {
    for (let i = i0; i <= i1; i++) {
      const d = Math.hypot(centreX(l, i) - x, centreY(l, j) - y);
      const v = strength * Math.exp(-(((d - r) / PULSE_WIDTH) ** 2));
      const k = j * l.cols + i;
      if (v > heat[k]) heat[k] = v;
    }
  }
}

/* ── One shared frame loop for every chart on a page ── */

type Tick = (now: number) => boolean;
const ticks = new Set<Tick>();
let raf = 0;

function loop(now: number) {
  raf = 0;
  for (const fn of Array.from(ticks)) if (!fn(now)) ticks.delete(fn);
  if (ticks.size) raf = requestAnimationFrame(loop);
}

function onFrame(fn: Tick) {
  ticks.add(fn);
  if (!raf) raf = requestAnimationFrame(loop);
}

/* ── The canvas ── */

/** Drawn over the cells each frame: lines, markers, the crosshair, the
 *  runner. `progress` runs 0 to 1 through the arrival (1 when still).
 *  Returns true while it moves on its own. */
export type CellOverlay = (ctx: CanvasRenderingContext2D, l: Lattice, th: CellTheme, ms: number | null, progress: number) => boolean | void;

export type CellCanvasProps = {
  /** The box, in px (the chart measures it). */
  w: number;
  h: number;
  /** The cell and its pitch, in px. */
  cell: number;
  pitch: number;
  /** Paints the data into the picture. */
  paint: (l: Lattice, p: Picture, th: CellTheme) => void;
  /** Paints again when this changes (the data, the scale). */
  paintKey: string;
  /** The share of cells that wait at rest; 1 for a heatmap's grid. */
  wallShare?: number;
  /** The datum to lift, -1 for none. */
  hover?: number;
  /** The wall alone with the wipe (no data yet), or the wipe over a held chart. */
  loading?: boolean;
  /** Markers, the crosshair, the runner: drawn over the cells each frame.
   *  Returns true while it moves on its own. */
  overlay?: CellOverlay;
  /** The wall answers the pointer (warmth and a click's pulse). */
  warm?: boolean;
  /** Ignite when first seen. Off for small pictures that should simply be there. */
  arrive?: boolean;
  className?: string;
};

/** Draw the still, never the twinkle or the arrival, as under reduced motion:
 *  for charts shown many at a time and small (a canvas's cover on the
 *  canvases page, canvas-live-cover.tsx), so a page of them costs no frames
 *  (28 Oct 2026). */
export const CellsStill = React.createContext(false);

export function CellCanvas({
  w,
  h,
  cell,
  pitch,
  paint,
  paintKey,
  wallShare = WALL_SHARE,
  hover = -1,
  loading = false,
  overlay,
  warm = true,
  arrive = true,
  className,
}: CellCanvasProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const theme = useCellTheme(canvasRef);
  const forceStill = React.useContext(CellsStill);
  // The latest props, for the frame loop, without restarting it.
  const live = React.useRef({ hover, loading, overlay, warm, theme });
  live.current = { hover, loading, overlay, warm, theme };
  const s = React.useRef({
    l: null as Lattice | null,
    p: null as Picture | null,
    heat: null as Float32Array | null,
    arrival: null as number | null,
    visible: false,
    still: false,
    running: false,
    pointer: null as Point | null,
    pulses: [] as { x: number; y: number; t0: number }[],
    lastNow: 0,
    lastDraw: 0,
    overlayMoving: false,
  }).current;
  const kick = React.useRef<() => void>(() => {});

  // Paint the picture when the data, the size or the theme change.
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !theme || w < 4 || h < 4) return;
    const dpr = window.devicePixelRatio || 1;
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }
    canvas.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0);
    const l = makeLattice(w, h, cell, pitch);
    const p = newPicture(l, wallShare);
    paint(l, p, theme);
    const same = s.l && s.l.cols === l.cols && s.l.rows === l.rows;
    s.heat = same && s.heat ? s.heat : new Float32Array(l.cols * l.rows);
    s.l = l;
    s.p = p;
    kick.current();
    // paint is a new closure every render; paintKey says when its output changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, w, h, cell, pitch, wallShare, paintKey]);

  // Hover and loading change what a frame shows, even when the loop sleeps.
  React.useEffect(() => kick.current(), [hover, loading]);

  // The frame loop: arrival, the twinkle, the warmth, the overlay.
  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    s.still = forceStill || (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);

    const frame = (now: number | null) => {
      const { l, p } = s;
      const th = live.current.theme;
      if (!l || !p || !th) return false;
      const L = live.current;
      const dt = s.lastNow && now !== null ? Math.min(100, now - s.lastNow) : 16;
      if (now !== null) s.lastNow = now;
      let busy = false;
      if (s.heat && now !== null) {
        const fade = Math.exp(-dt / HEAT_TAU);
        for (let k = 0; k < s.heat.length; k++) {
          const v = s.heat[k] * fade;
          s.heat[k] = v < 0.004 ? 0 : v;
          if (v >= 0.004) busy = true;
        }
        if (L.warm && s.pointer) {
          stamp(l, s.heat, s.pointer.x, s.pointer.y, HEAT_RADIUS, 1);
          busy = true;
        }
        s.pulses = s.pulses.filter((q) => now - q.t0 < PULSE_MS);
        for (const q of s.pulses) {
          const age = now - q.t0;
          stampRing(l, s.heat, q.x, q.y, age * PULSE_SPEED, 0.9 * (1 - smooth(age / PULSE_MS)));
          busy = true;
        }
      }
      const elapsed = s.arrival === null || now === null ? Infinity : now - s.arrival;
      const arriving = elapsed < ARRIVE_SPREAD + ARRIVE_EASE + 320;
      const wipe = L.loading && now !== null ? (now % WIPE_MS) / WIPE_MS : null;
      const fast = busy || arriving || wipe !== null || s.overlayMoving;
      if (now !== null && !fast && now - s.lastDraw < 1000 / FPS) return true;
      s.lastDraw = now ?? 0;
      drawCells(ctx, l, p, th, {
        ms: now,
        elapsed: arriving ? elapsed : Infinity,
        hover: L.hover,
        heat: s.heat,
        wipe,
        dim: L.loading && p.e.some((v) => v > 0) ? 0.45 : 1,
      });
      const progress = arriving ? clamp01(elapsed / (ARRIVE_SPREAD + ARRIVE_EASE)) : 1;
      s.overlayMoving = !!L.overlay?.(ctx, l, th, now, progress);
      return true;
    };

    const tick = (now: number) => {
      // Out of view, still, or nothing to draw yet (the picture or the theme
      // not ready): the loop lets go, and the next kick starts it again. A
      // canvas whose first frame came before its picture once stayed blank,
      // hover and all, because `running` stayed set (28 Oct 2026).
      if (!s.visible || s.still || !frame(now)) {
        s.running = false;
        return false;
      }
      return true;
    };

    kick.current = () => {
      if (s.still || !s.visible) {
        frame(null);
        return;
      }
      if (!s.running) {
        s.running = true;
        onFrame(tick);
      }
    };

    const io = new IntersectionObserver(([entry]) => {
      s.visible = entry.isIntersecting;
      if (s.visible && s.arrival === null) s.arrival = s.still || !arrive ? -1e9 : performance.now();
      kick.current();
    });
    io.observe(canvas);

    // The pointer, on the plot (the canvas's box).
    const host = canvas.parentElement;
    const point = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const move = (e: PointerEvent) => {
      s.pointer = point(e);
      kick.current();
    };
    const leave = () => {
      s.pointer = null;
    };
    const down = (e: PointerEvent) => {
      if (!live.current.warm) return;
      const q = point(e);
      s.pulses.push({ ...q, t0: performance.now() });
      kick.current();
    };
    host?.addEventListener("pointermove", move);
    host?.addEventListener("pointerleave", leave);
    host?.addEventListener("pointerdown", down);
    return () => {
      io.disconnect();
      s.visible = false;
      host?.removeEventListener("pointermove", move);
      host?.removeEventListener("pointerleave", leave);
      host?.removeEventListener("pointerdown", down);
      kick.current = () => {};
    };
    // Set up once; the loop reads the latest props from `live`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("pointer-events-none absolute left-0 top-0", className)}
      style={{ width: w, height: h }}
    />
  );
}

/* ── A legend key ── */

/** A ramp position, or one read from the theme (a series' or a slice's). */
export type RampPlace = number | ((th: CellTheme) => number);

/** A few cells in a series' colour and pattern, for legends and tooltips;
 *  `pen` picks the series' hue when each series has its own. */
export function CellSwatch({ t, pattern = "solid", pen = 0, className }: { t: RampPlace; pattern?: CellPattern; pen?: number; className?: string }) {
  const ref = React.useRef<HTMLCanvasElement>(null);
  const theme = useCellTheme(ref);
  React.useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !theme) return;
    const box = canvas.getBoundingClientRect();
    const w = box.width || 13;
    const h = box.height || 13;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cs = getComputedStyle(canvas);
    const size = parseFloat(cs.getPropertyValue("--chart-cell")) || 3;
    const pitch = parseFloat(cs.getPropertyValue("--chart-pitch")) || 5;
    const l = makeLattice(w, h, size, pitch);
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = penAt(theme, pen, typeof t === "function" ? t(theme) : t);
    for (let j = 0; j < l.rows; j++) {
      for (let i = 0; i < l.cols; i++) {
        if (!patternOn(pattern, i, j)) continue;
        ctx.globalAlpha = TONES[Math.floor(rnd(i, j, SEED + 2) * TONES.length)];
        ctx.fillRect(l.ox + i * pitch, l.oy + j * pitch, size, size);
      }
    }
    ctx.globalAlpha = 1;
  }, [theme, t, pattern, pen]);
  return <canvas ref={ref} aria-hidden className={cn("size-chart-swatch shrink-0", className)} />;
}
