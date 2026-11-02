"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cva } from "class-variance-authority";

import { CompactButton } from "@/components/ds/compact-button";
import { CloseIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/**
 * The design system's Tooltip, built from design-system/components/tooltip.md
 * (Nitesh's Figma "Tooltip [1.1]", node 2604:269): a short hint that shows on
 * hover or focus. Never the browser's title.
 *
 *   Tooltip       the Radix tooltip around a trigger (children); content is the words
 *   TooltipPanel  the drawn tooltip on its own (the Components page shows it still)
 *
 *   size     2xs (20 tall) | xs (28 tall) | lg (grows with the text, 280 wide)
 *   variant  light (white) | dark (the strongest fill); the tokens flip with
 *            the theme, so on dark the Light one turns dark grey, the Dark one white
 *   tail     none | top-left | top-center | top-right | bottom-left |
 *            bottom-center | bottom-right | left | right (where it points from)
 *   Large only: icon, title, description, close (shows the close button, a
 *            Compact Button, Ghost, Large 24; onClose, closeLabel)
 *
 * A tail picks the side: a tail on the top edge opens the tooltip below the
 * trigger, and so on. Sizes are the tokens in styles/sizes/tooltip.css; the
 * shadow is --shadow-tooltip there.
 */

export type TooltipSize = "2xs" | "xs" | "lg";
export type TooltipVariant = "light" | "dark";
export type TooltipTail =
  | "none"
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"
  | "left"
  | "right";
type Edge = "top" | "bottom" | "left" | "right";

const panelVariants = cva("ds-shadow relative [--ds-lift:var(--shadow-tooltip)]", {
  variants: {
    size: {
      "2xs": "inline-flex h-tooltip-2xs items-center whitespace-nowrap rounded-tooltip-2xs px-tooltip-2xs-x py-tooltip-2xs-y text-paragraph-xs",
      xs: "inline-flex h-tooltip-xs items-center whitespace-nowrap rounded-tooltip-xs px-tooltip-xs-x py-tooltip-xs-y text-paragraph-sm",
      lg: "flex w-tooltip-lg-w items-start gap-tooltip-lg-gap rounded-tooltip-lg p-tooltip-lg-pad",
    },
    variant: {
      light: "bg-bg-white-0 edge-stroke-soft-200 text-text-strong-950",
      dark: "bg-bg-strong-950 text-text-white-0",
    },
  },
  defaultVariants: { size: "xs", variant: "dark" },
});

// ---- The tail ----

/** Each size's tail tokens: its drawing across (top, bottom) and on a side
 *  (left, right), its distance from the box's corner, and the room the Radix
 *  wrapper keeps for it on each side. */
const TAIL = {
  "2xs": {
    across: "w-tooltip-2xs-tail-w h-tooltip-2xs-tail-box",
    side: "w-tooltip-2xs-tail-box h-tooltip-2xs-tail-w",
    start: "ps-tooltip-2xs-tail-inset",
    end: "pe-tooltip-2xs-tail-inset",
    room: { top: "pt-tooltip-2xs-tail-h", bottom: "pb-tooltip-2xs-tail-h", left: "pl-tooltip-2xs-tail-h", right: "pr-tooltip-2xs-tail-h" },
  },
  xs: {
    across: "w-tooltip-xs-tail-w h-tooltip-xs-tail-box",
    side: "w-tooltip-xs-tail-box h-tooltip-xs-tail-w",
    start: "ps-tooltip-xs-tail-inset",
    end: "pe-tooltip-xs-tail-inset",
    room: { top: "pt-tooltip-xs-tail-h", bottom: "pb-tooltip-xs-tail-h", left: "pl-tooltip-xs-tail-h", right: "pr-tooltip-xs-tail-h" },
  },
  lg: {
    across: "w-tooltip-lg-tail-w h-tooltip-lg-tail-box",
    side: "w-tooltip-lg-tail-box h-tooltip-lg-tail-w",
    start: "ps-tooltip-lg-tail-inset",
    end: "pe-tooltip-lg-tail-inset",
    room: { top: "pt-tooltip-lg-tail-h", bottom: "pb-tooltip-lg-tail-h", left: "pl-tooltip-lg-tail-h", right: "pr-tooltip-lg-tail-h" },
  },
} as const;

/** The row the tail sits in, just outside the box's edge, reaching 1px in. */
const EDGE_ROW: Record<Edge, string> = {
  top: "inset-x-space-0 bottom-full -mb-tooltip-tail-overlap",
  bottom: "inset-x-space-0 top-full -mt-tooltip-tail-overlap",
  left: "inset-y-space-0 right-full -mr-tooltip-tail-overlap items-center",
  right: "inset-y-space-0 left-full -ml-tooltip-tail-overlap items-center",
};

/** The drawing's own grid: the tail's width and height (the same numbers as
 *  its tokens, 8 x 4 and 12 x 6), plus 1 that reaches into the box. The SVG
 *  stretches to the tokens, so changing a token still fits. */
const GRID: Record<TooltipSize, [number, number]> = { "2xs": [8, 4], xs: [12, 6], lg: [12, 6] };

function tailPaths(edge: Edge, w: number, h: number) {
  const o = 1;
  switch (edge) {
    case "top":
      return { box: `0 0 ${w} ${h + o}`, fill: `M0 ${h}L${w / 2} 0L${w} ${h}V${h + o}H0Z`, line: `M0 ${h}L${w / 2} 0L${w} ${h}` };
    case "bottom":
      return { box: `0 0 ${w} ${h + o}`, fill: `M0 ${o}L${w / 2} ${h + o}L${w} ${o}V0H0Z`, line: `M0 ${o}L${w / 2} ${h + o}L${w} ${o}` };
    case "left":
      return { box: `0 0 ${h + o} ${w}`, fill: `M${h} 0L0 ${w / 2}L${h} ${w}H${h + o}V0Z`, line: `M${h} 0L0 ${w / 2}L${h} ${w}` };
    case "right":
      return { box: `0 0 ${h + o} ${w}`, fill: `M${o} 0L${h + o} ${w / 2}L${o} ${w}H0V0Z`, line: `M${o} 0L${h + o} ${w / 2}L${o} ${w}` };
  }
}

function edgeOf(tail: Exclude<TooltipTail, "none">): Edge {
  if (tail.startsWith("top")) return "top";
  if (tail.startsWith("bottom")) return "bottom";
  return tail as Edge;
}

/** The tail: the box's fill, and on Light the box's edge along its two
 *  outer sides. Its base covers the box's edge where they meet. */
function Tail({ size, variant, tail }: { size: TooltipSize; variant: TooltipVariant; tail: Exclude<TooltipTail, "none"> }) {
  const edge = edgeOf(tail);
  const across = edge === "top" || edge === "bottom";
  const align = tail.endsWith("-left") ? TAIL[size].start + " justify-start" : tail.endsWith("-right") ? TAIL[size].end + " justify-end" : "justify-center";
  const [w, h] = GRID[size];
  const p = tailPaths(edge, w, h);
  return (
    <span aria-hidden className={cn("pointer-events-none absolute flex", EDGE_ROW[edge], across ? align : "")}>
      <svg viewBox={p.box} preserveAspectRatio="none" className={cn("block shrink-0 overflow-visible", across ? TAIL[size].across : TAIL[size].side)}>
        <path d={p.fill} className={variant === "light" ? "fill-bg-white-0" : "fill-bg-strong-950"} />
        {variant === "light" && (
          <path d={p.line} fill="none" strokeWidth={1} vectorEffect="non-scaling-stroke" className="stroke-stroke-soft-200" />
        )}
      </svg>
    </span>
  );
}

// ---- The panel ----

export type TooltipPanelProps = Omit<React.ComponentProps<"div">, "title"> & {
  size?: TooltipSize;
  variant?: TooltipVariant;
  tail?: TooltipTail;
  /** Large: a 20 x 20 icon on the left. */
  icon?: React.ReactNode;
  /** Large: the title (text-label-sm). */
  title?: React.ReactNode;
  /** Large: the description (text-paragraph-xs). Children work too. */
  description?: React.ReactNode;
  /** Large: shows the close button, the Compact Button, Ghost, Large (24). */
  close?: boolean;
  /** Large: what pressing the close button does. */
  onClose?: React.MouseEventHandler<HTMLButtonElement>;
  /** Large: the close button's words for screen readers. */
  closeLabel?: string;
};

export function TooltipPanel({
  size = "xs",
  variant = "dark",
  tail = "none",
  icon,
  title,
  description,
  close = false,
  onClose,
  closeLabel = "Close",
  className,
  children,
  ...props
}: TooltipPanelProps) {
  const light = variant === "light";
  // Icon and close: icon/sub-600 on Light, icon/soft-400 on Dark (ours, see the page).
  const iconColour = light ? "text-icon-sub-600" : "text-icon-soft-400";
  const words = description ?? children;
  return (
    <div className={cn(panelVariants({ size, variant }), className)} {...props}>
      {size === "lg" ? (
        <>
          {icon != null && <span className={cn("inline-flex shrink-0 [&_svg]:size-tooltip-lg-icon", iconColour)}>{icon}</span>}
          <div className="flex min-w-0 flex-1 flex-col gap-tooltip-lg-words-gap">
            {title != null && <span className="text-label-sm">{title}</span>}
            {words != null && <span className={cn("text-paragraph-xs", light ? "text-text-sub-600" : "text-text-soft-400")}>{words}</span>}
          </div>
          {close && (
            // The Compact Button's own icon colour gives way to the style's
            // (icon/soft-400 on Dark); its hover and press looks stay its own.
            <CompactButton variant="ghost" size="lg" aria-label={closeLabel} onClick={onClose} className={iconColour}>
              <CloseIcon />
            </CompactButton>
          )}
        </>
      ) : (
        children
      )}
      {tail !== "none" && <Tail size={size} variant={variant} tail={tail} />}
    </div>
  );
}

// ---- The tooltip ----

/** Where Radix opens the tooltip for each tail. */
const PLACEMENT: Record<Exclude<TooltipTail, "none">, { side: Edge; align: "start" | "center" | "end" }> = {
  "top-left": { side: "bottom", align: "start" },
  "top-center": { side: "bottom", align: "center" },
  "top-right": { side: "bottom", align: "end" },
  "bottom-left": { side: "top", align: "start" },
  "bottom-center": { side: "top", align: "center" },
  "bottom-right": { side: "top", align: "end" },
  left: { side: "right", align: "center" },
  right: { side: "left", align: "center" },
};

export type TooltipProps = Omit<TooltipPanelProps, "children" | "content"> & {
  /** The trigger: one element that takes a ref (a Button, a link). */
  children: React.ReactElement;
  /** The words (2X-Small and X-Small). */
  content?: React.ReactNode;
  /** Which side to open on when there is no tail. */
  side?: Edge;
  /** The gap between the tail's tip (or the box) and the trigger, in px. */
  sideOffset?: number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  delayDuration?: number;
};

export function Tooltip({
  children,
  content,
  size = "xs",
  variant = "dark",
  tail = "none",
  side = "top",
  sideOffset = 4,
  open,
  defaultOpen,
  onOpenChange,
  delayDuration,
  ...panel
}: TooltipProps) {
  const place = tail === "none" ? { side, align: "center" as const } : PLACEMENT[tail];
  // The tail sits outside the box: keep room for it inside what Radix measures.
  const room = tail === "none" ? "" : TAIL[size].room[edgeOf(tail)];
  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={place.side}
            align={place.align}
            sideOffset={sideOffset}
            // A tail fixes the side, so the tooltip never flips away from it.
            avoidCollisions={tail === "none"}
            className={cn("z-50 outline-none", room)}
          >
            <TooltipPanel size={size} variant={variant} tail={tail} {...panel}>
              {content}
            </TooltipPanel>
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}

export { panelVariants as tooltipVariants };
