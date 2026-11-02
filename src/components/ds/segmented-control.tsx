"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * The design system's Segmented Control, built from
 * design-system/components/segmented-control.md (Nitesh's Figma "Segmented
 * Control [1.1]", node 2604:114, and its segments, node 2603:2062). Radix
 * Radio Group underneath: exactly one segment is picked, and the arrow keys
 * move the pick.
 *
 *   <SegmentedControl defaultValue="week" aria-label="Range">
 *     <SegmentedControlItem value="day">Day</SegmentedControlItem>
 *     <SegmentedControlItem value="week" icon={<CalendarIcon />}>Week</SegmentedControlItem>
 *   </SegmentedControl>
 *
 *   size   md 36 (the Figma's) | sm 28 (proposed: the sidebar's Chat and Canvas switch)
 *   label  a slot for the Label (key-components.md), 6px above the track
 *   item   a word, an icon and a word, or an icon only (then give it an aria-label)
 *
 * The track is full width and the segments share it equally. Sizes are the
 * tokens in styles/sizes/segmented-control.css, states the ds-* variants in
 * styles/ds.css plus Radix's data-state="checked". Icons follow the word's
 * colour: the page's icon tokens are the same steps as its word tokens.
 */
type Size = "md" | "sm";
const SizeContext = React.createContext<Size>("md");

const trackVariants = cva("flex w-full items-center", {
  variants: {
    size: {
      md: "h-segmented-control-md gap-segmented-control-md-gap rounded-segmented-control-md bg-bg-weak-50 p-segmented-control-md-pad",
      // The sidebar's track sits in the selected-row grey.
      sm: "h-segmented-control-sm gap-segmented-control-sm-gap rounded-segmented-control-sm bg-bg-weak-25 p-segmented-control-sm-pad",
    },
  },
  defaultVariants: { size: "md" },
});

export type SegmentedControlProps = React.ComponentProps<typeof RadioGroupPrimitive.Root> & {
  size?: Size;
  /** The Label above the track (key-components.md). It also names the group. */
  label?: React.ReactNode;
};

export function SegmentedControl({ size = "md", label, className, ...props }: SegmentedControlProps) {
  const labelId = React.useId();
  const track = (
    <RadioGroupPrimitive.Root
      orientation="horizontal"
      aria-labelledby={label != null ? labelId : undefined}
      className={cn(trackVariants({ size }), label == null && className)}
      {...props}
    />
  );
  return (
    <SizeContext.Provider value={size}>
      {label == null ? (
        track
      ) : (
        <div className={cn("flex flex-col gap-segmented-control-label-gap", className)}>
          <div id={labelId}>{label}</div>
          {track}
        </div>
      )}
    </SizeContext.Provider>
  );
}

const segmentVariants = cva(
  [
    "ds-shadow flex min-w-0 flex-1 cursor-pointer items-center justify-center whitespace-nowrap outline-none",
    "transition-[background-color,color,box-shadow] duration-150",
    "[&_svg]:size-segmented-control-icon [&_svg]:shrink-0",
    // Default and Hover: no fill.
    "text-text-soft-400 data-[state=unchecked]:ds-hover:text-text-sub-600",
    // Active (picked): white, lifted.
    "data-[state=checked]:bg-bg-white-0 data-[state=checked]:text-text-strong-950 data-[state=checked]:[--ds-lift:var(--shadow-segmented-control-picked)]",
    // The page proposes the Neutral focus ring, as on the Button Group.
    "ds-focus:ring-focus-neutral",
    "disabled:cursor-not-allowed disabled:text-text-disabled-300",
  ],
  {
    variants: {
      size: {
        md: "h-segmented-control-md-segment gap-segmented-control-md-segment-gap rounded-segmented-control-md-segment p-segmented-control-md-segment-pad text-label-sm",
        // The sidebar's 13px words: Label/Compact.
        sm: "h-segmented-control-sm-segment gap-segmented-control-sm-segment-gap rounded-segmented-control-sm-segment px-segmented-control-sm-segment-x text-label-compact",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export type SegmentedControlItemProps = React.ComponentProps<typeof RadioGroupPrimitive.Item> & {
  /** A 20 x 20 icon before the word (or the only content, with an aria-label). */
  icon?: React.ReactNode;
};

export function SegmentedControlItem({ icon, children, className, ...props }: SegmentedControlItemProps) {
  const size = React.useContext(SizeContext);
  return (
    <RadioGroupPrimitive.Item className={cn(segmentVariants({ size }), className)} {...props}>
      {icon}
      {children != null && <span className="min-w-0 truncate">{children}</span>}
    </RadioGroupPrimitive.Item>
  );
}
