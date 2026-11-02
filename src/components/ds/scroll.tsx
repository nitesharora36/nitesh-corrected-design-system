"use client";

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * The design system's Scroll, built from design-system/components/scroll.md
 * (Nitesh's Figma "Scroll [1.1]", node 166941:61889), on Radix's scroll
 * area, which draws its own track and thumb so they look the same in every
 * browser. Every scrollbar we style ourselves is this; never style one by hand.
 *
 *   <ScrollArea className="h-..."> long content </ScrollArea>
 *
 *   size         md 20 (the default) | sm 16 | xs 12, the track across.
 *                Small and X-Small are for compact places, such as menus
 *   variant      default (a white track) | lighter (a grey track)
 *   orientation  vertical (the default) | horizontal | both. Sideways is
 *                ours (page, Open): the same track on its side, its edge
 *                along the top
 *   type         when the track shows. hover (the default): while the
 *                pointer is over the area or it scrolls (page, Open);
 *                always: all the time
 *
 * The area needs a height, or a max height, to scroll. The track sits over
 * the content's edge, so content that should stay clear of it keeps that
 * much padding. The thumb turns one step stronger under the pointer and
 * while dragged (page, Open); data-force="hover" or "active" shows that on
 * the Components page. Sizes are the tokens in styles/sizes/scroll.css.
 */

export type ScrollSize = "md" | "sm" | "xs";
export type ScrollVariant = "default" | "lighter";

const trackVariants = cva("ds-shadow flex touch-none select-none", {
  variants: {
    orientation: {
      // Down the right side, its edge on the left; or along the bottom, its edge on top.
      vertical: "flex-row py-scroll-end [--ds-edge:var(--shadow-scroll-edge-y)]",
      horizontal: "flex-col px-scroll-end [--ds-edge:var(--shadow-scroll-edge-x)]",
    },
    size: { md: "", sm: "", xs: "" },
    variant: { default: "bg-bg-white-0", lighter: "bg-bg-weak-50" },
  },
  compoundVariants: [
    // The side space leaves the thumb its 4 across.
    { orientation: "vertical", size: "md", class: "w-scroll-md px-scroll-md-side" },
    { orientation: "vertical", size: "sm", class: "w-scroll-sm px-scroll-sm-side" },
    { orientation: "vertical", size: "xs", class: "w-scroll-xs px-scroll-xs-side" },
    { orientation: "horizontal", size: "md", class: "h-scroll-md py-scroll-md-side" },
    { orientation: "horizontal", size: "sm", class: "h-scroll-sm py-scroll-sm-side" },
    { orientation: "horizontal", size: "xs", class: "h-scroll-xs py-scroll-xs-side" },
  ],
  defaultVariants: { orientation: "vertical", size: "md", variant: "default" },
});

// The thumb uses line colours as its fill, as in the Figma.
const thumbVariants = cva("relative flex-1 rounded-scroll-thumb transition-colors duration-150", {
  variants: {
    variant: {
      default: "bg-stroke-soft-200 ds-hover:bg-stroke-sub-300 ds-active:bg-stroke-sub-300",
      lighter: "bg-stroke-sub-300 ds-hover:bg-icon-soft-400 ds-active:bg-icon-soft-400",
    },
  },
  defaultVariants: { variant: "default" },
});

function Track({
  orientation,
  size,
  variant,
  force,
}: {
  orientation: "vertical" | "horizontal";
  size: ScrollSize;
  variant: ScrollVariant;
  force?: string;
}) {
  return (
    <ScrollAreaPrimitive.Scrollbar orientation={orientation} className={trackVariants({ orientation, size, variant })}>
      <ScrollAreaPrimitive.Thumb data-force={force} className={thumbVariants({ variant })} />
    </ScrollAreaPrimitive.Scrollbar>
  );
}

export type ScrollAreaProps = React.ComponentProps<typeof ScrollAreaPrimitive.Root> & {
  size?: ScrollSize;
  variant?: ScrollVariant;
  orientation?: "vertical" | "horizontal" | "both";
  /** Classes for the part that scrolls, inside the area. */
  viewportClassName?: string;
  viewportRef?: React.Ref<HTMLDivElement>;
  /** The Components page: shows the thumb's Hover or dragged look. */
  "data-force"?: "hover" | "active";
};

export function ScrollArea({
  size = "md",
  variant = "default",
  orientation = "vertical",
  viewportClassName,
  viewportRef,
  "data-force": force,
  className,
  children,
  ...props
}: ScrollAreaProps) {
  return (
    <ScrollAreaPrimitive.Root className={cn("relative flex min-h-0 flex-col overflow-hidden", className)} {...props}>
      {/* A flex child rather than a full height, so a max height on the area
          works too. Radix wraps the content in a table, which would stretch
          to the widest line and stop words ending in "..."; a block keeps the
          area's width, and wider content still scrolls sideways. */}
      <ScrollAreaPrimitive.Viewport ref={viewportRef} className={cn("min-h-0 w-full flex-1 outline-none [&>div]:block!", viewportClassName)}>
        {children}
      </ScrollAreaPrimitive.Viewport>
      {orientation !== "horizontal" && <Track orientation="vertical" size={size} variant={variant} force={force} />}
      {orientation !== "vertical" && <Track orientation="horizontal" size={size} variant={variant} force={force} />}
      {orientation === "both" && <ScrollAreaPrimitive.Corner className={variant === "lighter" ? "bg-bg-weak-50" : "bg-bg-white-0"} />}
    </ScrollAreaPrimitive.Root>
  );
}

export { trackVariants as scrollTrackVariants, thumbVariants as scrollThumbVariants };
