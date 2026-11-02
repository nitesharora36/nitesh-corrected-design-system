/** The brand's light as maths (8bit Branding's gradient.js, D025): colour
 *  mixed in OKLab so a ramp from navy to sky stays blue and never greys out
 *  in the middle, the deck's seeded hash, and the easing every form uses.
 *  Shared by the chart cells (components/ds/neutrino-cells.ts).
 *  components/chat-flow/home-field.tsx keeps its own copy of the same maths
 *  from before this file. No literal colour lives here: colours come in from
 *  the tokens and go out as canvas fill styles. */

export type RGB = [number, number, number];
type Lab = [number, number, number];

export function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

export function smooth(t: number) {
  const c = clamp01(t);
  return c * c * (3 - 2 * c);
}

/** 0 up to `a`, 1 from `b`, eased between. */
export function smoothstep(a: number, b: number, v: number) {
  return smooth((v - a) / (b - a));
}

/** A stable hash in [0, 1), the deck's own, so the same seed draws the same field. */
export function rnd(a: number, b: number, s: number) {
  let h = Math.imul(a | 0, 374761393) ^ Math.imul(b | 0, 668265263) ^ Math.imul(s | 0, 1442695041);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

/** A computed colour (a hex, or the browser's rgb form) as channels, or null. */
export function parseColour(value: string): RGB | null {
  const t = value.trim();
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(t);
  if (hex) {
    let h = hex[1];
    if (h.length === 3) h = h.replace(/./g, "$&$&");
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  const fn = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(t);
  if (fn) return [+fn[1], +fn[2], +fn[3]];
  return null;
}

function lin(c: number) {
  c /= 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function oklab([r8, g8, b8]: RGB): Lab {
  const r = lin(r8), g = lin(g8), b = lin(b8);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function fromOklab([L, a, b]: Lab): RGB {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
  const gamma = (v: number) => {
    const c = clamp01(v);
    return Math.round(255 * (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055));
  };
  return [
    gamma(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    gamma(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    gamma(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
}

/** A canvas fill style for channels (built here, so no literal colour sits in the source). */
export function fillStyle([r, g, b]: RGB) {
  return "#" + [r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("");
}

/** The ramp, cold to hot, as `n` canvas fill styles: piecewise linear in
 *  OKLab between the stops at their positions, as the deck's rampAt. */
export function buildLut(stops: RGB[], at: number[], n: number): string[] {
  const labs = stops.map(oklab);
  const out: string[] = [];
  for (let k = 0; k < n; k++) {
    const t = k / (n - 1);
    let i = 1;
    while (i < labs.length - 1 && t > at[i]) i++;
    const a = labs[i - 1], b = labs[i];
    const u = clamp01((t - at[i - 1]) / (at[i] - at[i - 1]));
    out.push(fillStyle(fromOklab([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u])));
  }
  return out;
}
