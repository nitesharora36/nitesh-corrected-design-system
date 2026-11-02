"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

import * as Icons from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { COLOR_GROUPS, CORNERS, MOTION, SHADOWS, SPACE, TYPE_STYLES } from "./foundations-data";

const SECTIONS = [
  { id: "colors", name: "Colours", note: "Every colour token, in the theme picked above. Each one has a light and a dark value." },
  { id: "typography", name: "Typography", note: "The Figma's text styles, each set by its code classes." },
  { id: "spacing", name: "Spacing", note: "The spacing scale. Every padding and gap in a component is a step of it." },
  { id: "corners", name: "Corners", note: "Merlin is square: every step of the scale is 0. Only the parts that are round by nature (radio, switch, avatars, dots, knobs) use corner-full." },
  { id: "shadows", name: "Shadows", note: "The shadows many components share. On dark most of them fall away." },
  { id: "icons", name: "Icons", note: "Hugeicons, Stroke Rounded: every icon the product names, at 20." },
  { id: "motion", name: "Motion", note: "The speeds in code. Hover a row to see it." },
];

/** A computed colour as hex, with its opacity when it is see-through. */
function hex(value: string): string {
  let parts: number[] | null = null;
  const rgb = value.match(/rgba?\(([^)]+)\)/);
  const srgb = value.match(/color\(srgb ([\d.e-]+) ([\d.e-]+) ([\d.e-]+)(?: \/ ([\d.e-]+))?\)/);
  if (rgb) parts = rgb[1].split(/[\s,/]+/).filter(Boolean).map(Number);
  else if (srgb) parts = [Number(srgb[1]) * 255, Number(srgb[2]) * 255, Number(srgb[3]) * 255, srgb[4] === undefined ? 1 : Number(srgb[4])];
  if (!parts) return value;
  const [r, g, b, a = 1] = parts;
  const h = (n: number) => Math.round(n).toString(16).padStart(2, "0");
  const out = `#${h(r)}${h(g)}${h(b)}`.toUpperCase();
  return a < 1 ? `${out} at ${Math.round(a * 100)}%` : out;
}

function Swatch({ token, css, use, theme }: { token: string; css: string; use: string; theme?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState("");
  useEffect(() => {
    if (ref.current) setValue(hex(getComputedStyle(ref.current).backgroundColor));
  }, [theme]);
  return (
    <div className="flex flex-col gap-space-6">
      <div ref={ref} className="h-space-40 rounded-corner-8 border border-stroke-soft-200" style={{ background: `var(--${css})` }} />
      <div className="flex flex-col gap-space-2">
        <span className="text-label-xs text-text-strong-950">{token}</span>
        <span className="font-data text-data-2xs uppercase text-text-soft-400">{value}</span>
        <span className="text-paragraph-xs text-text-sub-600">{use}</span>
      </div>
    </div>
  );
}

const ICONS = Object.entries(Icons)
  .filter(([name, value]) => name.endsWith("Icon") && typeof value === "function")
  .sort(([a], [b]) => a.localeCompare(b)) as [string, Icons.Icon][];

/** The Core Elements, drawn from the tokens: what 1-core-elements describes. */
export function Foundations() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dark = mounted && (resolvedTheme === "dark" || resolvedTheme === "ink");

  return (
    <div className="h-full overflow-y-auto bg-bg-white-0 text-text-strong-950">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-space-48 px-space-32 py-space-32">
        <header className="flex flex-wrap items-end justify-between gap-space-16">
          <div className="flex flex-col gap-space-4">
            <h1 className="font-display text-title-h4">Foundations</h1>
            <p className="max-w-2xl text-paragraph-sm text-text-sub-600">
              The Core Elements every component is made of, drawn from the tokens themselves. Switch the theme to see dark.
            </p>
          </div>
          <div role="group" aria-label="Theme" className="flex gap-space-4 rounded-corner-10 bg-bg-weak-50 p-space-4">
            {[
              { id: "light", label: "Light", on: !dark },
              { id: "dark", label: "Dark", on: dark },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                aria-pressed={t.on}
                onClick={() => setTheme(t.id)}
                className={cn(
                  "rounded-corner-6 px-space-12 py-space-4 text-label-sm",
                  t.on ? "bg-bg-white-0 text-text-strong-950 shadow-card" : "text-text-soft-400 hover:text-text-sub-600",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </header>

        {SECTIONS.map((s) => (
          <section key={s.id} id={s.id} className="flex scroll-mt-space-32 flex-col gap-space-24 border-t border-stroke-soft-200 pt-space-32">
            <div className="flex flex-col gap-space-4">
              <h2 className="font-display text-title-h5">{s.name}</h2>
              <p className="text-paragraph-sm text-text-sub-600">{s.note}</p>
            </div>

            {s.id === "colors" &&
              COLOR_GROUPS.map((g) => (
                <div key={g.group} className="flex flex-col gap-space-12">
                  <p className="text-subheading-2xs uppercase text-text-soft-400">{g.group}</p>
                  <div className="grid grid-cols-2 gap-space-16 sm:grid-cols-3 lg:grid-cols-5">
                    {g.tokens.map((t) => (
                      <Swatch key={t.token} {...t} theme={resolvedTheme} />
                    ))}
                  </div>
                </div>
              ))}

            {s.id === "typography" && (
              <div className="flex flex-col">
                {TYPE_STYLES.map((t) => (
                  <div key={t.figma} className="grid grid-cols-1 items-baseline gap-space-8 border-b border-stroke-soft-200 py-space-16 lg:grid-cols-[280px_1fr]">
                    <div className="flex flex-col gap-space-2">
                      <span className="text-label-sm text-text-strong-950">{t.figma}</span>
                      <span className="text-paragraph-xs text-text-soft-400">{t.spec}</span>
                      <code className="font-data text-data-2xs text-text-sub-600">{t.className}</code>
                    </div>
                    <p className={cn("truncate text-text-strong-950", t.className)}>Neutrino answers every question</p>
                  </div>
                ))}
              </div>
            )}

            {s.id === "spacing" && (
              <div className="flex flex-wrap items-end gap-space-24">
                {SPACE.map((x) => (
                  <div key={x.name} className="flex flex-col items-center gap-space-8">
                    <div className="bg-primary-alpha-24" style={{ width: `var(--${x.name})`, height: `var(--${x.name})`, minWidth: 1, minHeight: 1 }} />
                    <span className="text-label-xs text-text-strong-950">{x.value}</span>
                    <span className="font-data text-data-2xs uppercase text-text-soft-400">--{x.name}</span>
                  </div>
                ))}
              </div>
            )}

            {s.id === "corners" && (
              <div className="flex flex-wrap gap-space-24">
                {CORNERS.map((x) => (
                  <div key={x.name} className="flex flex-col items-center gap-space-8">
                    <div className="size-16 border border-stroke-sub-300 bg-bg-weak-50" style={{ borderRadius: `var(--${x.name})` }} />
                    <span className="text-label-xs text-text-strong-950">{x.value}</span>
                    <span className="font-data text-data-2xs uppercase text-text-soft-400">--{x.name}</span>
                  </div>
                ))}
              </div>
            )}

            {s.id === "shadows" && (
              <div className="flex flex-wrap gap-space-32 bg-bg-weak-25 p-space-32">
                {SHADOWS.map((x) => (
                  <div key={x.name} className="flex flex-col items-center gap-space-8">
                    <div className={cn("h-space-48 w-40 rounded-corner-12 bg-bg-white-0", x.className)} />
                    <span className="font-data text-data-2xs uppercase text-text-soft-400">{x.name}</span>
                  </div>
                ))}
              </div>
            )}

            {s.id === "icons" && (
              <div className="grid grid-cols-2 gap-space-8 sm:grid-cols-4 lg:grid-cols-6">
                {ICONS.map(([name, Icon]) => (
                  <div key={name} className="flex items-center gap-space-8 rounded-corner-8 px-space-8 py-space-6">
                    <Icon size={20} className="shrink-0 text-icon-sub-600" />
                    <span className="truncate text-paragraph-xs text-text-sub-600">{name}</span>
                  </div>
                ))}
              </div>
            )}

            {s.id === "motion" && (
              <div className="flex flex-col gap-space-8">
                {MOTION.map((x) => (
                  <div
                    key={x.name}
                    className="flex items-center justify-between rounded-corner-8 bg-bg-weak-50 px-space-16 py-space-12 transition-colors hover:bg-primary-alpha-16"
                    style={{ transitionDuration: `var(--${x.name})` }}
                  >
                    <span className="text-label-sm text-text-strong-950">--{x.name}</span>
                    <span className="font-data text-data-xs uppercase text-text-sub-600">{x.value}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
