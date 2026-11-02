import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * The design system's Compact Button, built from
 * design-system/components/compact-button.md (Nitesh's Figma "Compact Button
 * [1.1]", node 189:3646).
 *
 * A small icon-only control inside another component: the close on a modal
 * or a tooltip, a row's "more", the date picker's arrows. One icon, nothing
 * else, so it always needs an aria-label.
 *
 *   variant     the Figma's Style: stroke | ghost | white | modifiable
 *               (modifiable is for a coloured fill, such as a Filled alert)
 *   size        lg 24 | md 20
 *   fullRadius  off: corner 6; on: a circle
 *   active      on (a toggle that is on): the Active look, aria-pressed.
 *               Pressing it shows Active too.
 *
 * Keyboard focus adds the Neutral focus ring on every style (page, Open 1).
 * Sizes in styles/sizes/compact-button.css.
 */
const compactButtonVariants = cva(
  [
    "ds-shadow inline-flex shrink-0 cursor-pointer items-center justify-center outline-none",
    "transition-[background-color,color,box-shadow] duration-150",
    "[&_svg]:shrink-0",
    "ds-focus:ring-focus-neutral",
    // Disabled drops the fill, edge and shadow, leaving a faint icon (as the Figma; page, Open 3).
    "disabled:cursor-not-allowed disabled:bg-transparent disabled:text-icon-disabled-300 disabled:edge-none disabled:lift-none disabled:ring-none",
  ],
  {
    variants: {
      variant: {
        stroke: "bg-bg-white-0 edge-stroke-soft-200 lift-card text-icon-sub-600",
        ghost: "bg-transparent text-icon-sub-600",
        white: "bg-bg-white-0 lift-card text-icon-sub-600",
        modifiable: [
          "bg-transparent text-static-white",
          "ds-hover:not-aria-pressed:bg-(--compact-button-modifiable-fill)",
          "ds-active:not-aria-pressed:bg-(--compact-button-modifiable-fill) ds-active:not-aria-pressed:edge-static-white",
          "enabled:aria-pressed:bg-(--compact-button-modifiable-fill) enabled:aria-pressed:edge-static-white",
        ],
      },
      size: {
        lg: "size-compact-button-lg p-compact-button-lg-pad [&_svg]:size-compact-button-lg-icon",
        md: "size-compact-button-md p-compact-button-md-pad [&_svg]:size-compact-button-md-icon",
      },
      fullRadius: { true: "rounded-compact-button-full", false: "rounded-compact-button" },
    },
    compoundVariants: [
      // Stroke, Ghost and White share Hover and Active; only their Default differs.
      // A button that is on keeps the Active look under the pointer.
      {
        variant: ["stroke", "ghost", "white"],
        class: [
          "ds-hover:not-aria-pressed:bg-bg-weak-50 ds-hover:not-aria-pressed:edge-none ds-hover:not-aria-pressed:lift-none ds-hover:not-aria-pressed:text-icon-strong-950",
          "ds-active:not-aria-pressed:bg-bg-surface-800 ds-active:not-aria-pressed:edge-none ds-active:not-aria-pressed:lift-none ds-active:not-aria-pressed:text-icon-white-0",
          "enabled:aria-pressed:bg-bg-surface-800 enabled:aria-pressed:edge-none enabled:aria-pressed:lift-none enabled:aria-pressed:text-icon-white-0",
        ],
      },
    ],
    defaultVariants: { variant: "stroke", size: "lg", fullRadius: false },
  },
);

export type CompactButtonProps = Omit<React.ComponentProps<"button">, "children" | "aria-label"> &
  VariantProps<typeof compactButtonVariants> & {
    /** The one icon. */
    children: React.ReactNode;
    /** Words for screen readers; the button shows only an icon. */
    "aria-label": string;
    /** On, for a toggle: the Active look. Sets aria-pressed. */
    active?: boolean;
  };

export function CompactButton({
  variant,
  size,
  fullRadius,
  active,
  className,
  type = "button",
  ...props
}: CompactButtonProps) {
  return (
    <button
      type={type}
      aria-pressed={active}
      className={cn(compactButtonVariants({ variant, size, fullRadius }), className)}
      {...props}
    />
  );
}

export { compactButtonVariants };
