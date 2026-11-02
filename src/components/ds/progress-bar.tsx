"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";
import { LinkButton, type LinkButtonProps } from "@/components/ds/link-button";

/**
 * The design system's Progress Bar, built from
 * design-system/components/progress-bar.md (Nitesh's Figma "Progress Bar
 * [1.1]" node 450:17821, "Progress Bar Line [1.1]" 450:17810, "Progress Bar
 * Label [1.1]" 515:3758, "Circular Progress Bar [1.1]" 466:4652): how far a
 * task has got. Radix Progress underneath, so screen readers hear the value.
 *
 *   ProgressBar          the bar. value 0 to 100, color blue | red | orange |
 *                        green (Empty is value 0). Takes its container's width.
 *   ProgressBarLabel     the bar with words. type top (the title and value
 *                        above) | right (the value after the bar); on top, an
 *                        optional bottom line: link (a ProgressBarLink) and note
 *   ProgressBarLink      the bottom line's link: Link Button, Primary, Small,
 *                        underlined
 *   CircularProgressBar  a ring with the value in the middle. size 80 | 72 |
 *                        64 | 56 | 48 (no value shown at 48)
 *
 * Give each an aria-label (the Label's title names its bar). Sizes are the
 * tokens in styles/sizes/progress-bar.css.
 */

export type ProgressColor = "blue" | "red" | "orange" | "green";

/** The filled part's colour (progress-bar.md, Colours). */
const FILL: Record<ProgressColor, string> = {
  blue: "bg-state-information-base",
  red: "bg-state-error-base",
  orange: "bg-state-warning-base",
  green: "bg-state-success-base",
};

const clamp = (value: number) => Math.min(100, Math.max(0, value));

// ---- The bar ----

export type ProgressBarProps = Omit<React.ComponentProps<typeof ProgressPrimitive.Root>, "value" | "max" | "color"> & {
  /** 0 to 100. */
  value?: number;
  color?: ProgressColor;
};

export function ProgressBar({ value = 0, color = "blue", className, ...props }: ProgressBarProps) {
  const v = clamp(value);
  return (
    <ProgressPrimitive.Root
      value={v}
      max={100}
      className={cn("relative flex h-progress-bar-track w-full overflow-hidden rounded-progress-bar-track bg-bg-soft-200", className)}
      {...props}
    >
      {/* The filled part, from the left edge, as wide as the value, round at both ends. */}
      <ProgressPrimitive.Indicator
        className={cn("h-full rounded-progress-bar-track", FILL[color])}
        style={{ width: `${v}%` }}
      />
    </ProgressPrimitive.Root>
  );
}

// ---- Progress Bar Label ----

export type ProgressBarLabelProps = Omit<React.ComponentProps<"div">, "title" | "color"> & {
  /** top: the title and the value above the bar. right: the value after it. */
  type?: "top" | "right";
  /** On Top: the words above the bar. On Right it names the bar for screen readers. */
  title: React.ReactNode;
  value?: number;
  color?: ProgressColor;
  /** The value as shown ("9 of 10"); the percentage when left out. */
  valueText?: React.ReactNode;
  /** On Top only, the bottom line: a ProgressBarLink ... */
  link?: React.ReactNode;
  /** ... and the sentence after it. */
  note?: React.ReactNode;
};

export function ProgressBarLabel({
  type = "top",
  title,
  value = 0,
  color = "blue",
  valueText,
  link,
  note,
  className,
  ...props
}: ProgressBarLabelProps) {
  const titleId = React.useId();
  const shown = valueText ?? `${Math.round(clamp(value))}%`;

  if (type === "right") {
    return (
      <div className={cn("flex items-center gap-progress-bar-label-right-gap", className)} {...props}>
        <span id={titleId} className="sr-only">
          {title}
        </span>
        <ProgressBar value={value} color={color} aria-labelledby={titleId} className="min-w-0 flex-1" />
        <span className="shrink-0 text-paragraph-xs text-text-sub-600">{shown}</span>
      </div>
    );
  }

  const bottom = link != null || note != null;
  return (
    <div className={cn("flex flex-col gap-progress-bar-label-gap", className)} {...props}>
      <div className="flex items-center gap-progress-bar-label-title-gap">
        <span id={titleId} className="min-w-0 flex-1 text-label-sm text-text-strong-950">
          {title}
        </span>
        <span className="shrink-0 text-paragraph-xs text-text-sub-600">{shown}</span>
      </div>
      <ProgressBar value={value} color={color} aria-labelledby={titleId} />
      {bottom && (
        <div className="flex items-center gap-progress-bar-label-bottom-gap">
          {link}
          {note != null && <span className="min-w-0 text-paragraph-xs text-text-sub-600">{note}</span>}
        </div>
      )}
    </div>
  );
}

/** The Label's bottom link: Link Button, Primary, Small (16), underlined. */
export function ProgressBarLink(props: LinkButtonProps) {
  return <LinkButton {...props} variant="primary" size="sm" underline />;
}

// ---- Circular Progress Bar ----

export type CircularProgressSize = "80" | "72" | "64" | "56" | "48";

/** Each size, its ring's thickness (as --progress-bar-ring) and the value's
 *  type. The 48 shows no value. */
const CIRCLE: Record<CircularProgressSize, { box: string; value?: string }> = {
  "80": { box: "size-progress-bar-circle-80 [--progress-bar-ring:var(--spacing-progress-bar-circle-80-ring)]", value: "text-label-sm" },
  "72": { box: "size-progress-bar-circle-72 [--progress-bar-ring:var(--spacing-progress-bar-circle-72-ring)]", value: "text-label-sm" },
  "64": { box: "size-progress-bar-circle-64 [--progress-bar-ring:var(--spacing-progress-bar-circle-64-ring)]", value: "text-label-sm" },
  "56": { box: "size-progress-bar-circle-56 [--progress-bar-ring:var(--spacing-progress-bar-circle-56-ring)]", value: "text-label-xs" },
  "48": { box: "size-progress-bar-circle-48 [--progress-bar-ring:var(--spacing-progress-bar-circle-48-ring)]" },
};

/** Both circles: centred, the stroke on the ring's middle line, so the ring
 *  fills the box to its edge. */
const ringCircle = "fill-none [r:calc(50%_-_var(--progress-bar-ring)_/_2)] [stroke-width:var(--progress-bar-ring)]";

export type CircularProgressBarProps = Omit<React.ComponentProps<typeof ProgressPrimitive.Root>, "value" | "max"> & {
  size?: CircularProgressSize;
  /** 0 to 100. */
  value?: number;
};

export function CircularProgressBar({ size = "80", value = 0, className, ...props }: CircularProgressBarProps) {
  const v = clamp(value);
  const c = CIRCLE[size];
  return (
    <ProgressPrimitive.Root value={v} max={100} className={cn("relative inline-flex shrink-0", c.box, className)} {...props}>
      {/* Turned a quarter back, so the filled part starts at the top and runs clockwise. Square ends. */}
      <svg aria-hidden className="size-full -rotate-90">
        <circle cx="50%" cy="50%" className={cn(ringCircle, "stroke-bg-soft-200")} />
        {v > 0 && (
          <circle cx="50%" cy="50%" pathLength={100} strokeDasharray={`${v} 100`} className={cn(ringCircle, "stroke-primary-base")} />
        )}
      </svg>
      {c.value && (
        <span
          aria-hidden
          className={cn(
            "absolute inset-progress-bar-circle-value-inset flex items-center justify-center text-text-strong-950",
            c.value,
          )}
        >
          {Math.round(v)}%
        </span>
      )}
    </ProgressPrimitive.Root>
  );
}
