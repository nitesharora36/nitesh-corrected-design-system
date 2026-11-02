import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * The design system's Fancy Button, built from
 * design-system/components/fancy-button.md (Nitesh's Figma "Fancy Buttons
 * [1.1]", node 181:5291). When to use it instead of the Button is not
 * decided yet: ask Nitesh before using one.
 *
 *   tone  the Figma's Type: neutral (dark) | basic (white) | primary (blue) |
 *         error (the Figma's Destructive, named as on the Button; page, Open 6)
 *   size  md 40 | sm 36 | xs 32
 *
 * Every layer of the Figma, bottom up:
 *   1. fill         the type's colour token
 *   2. shine        a white gradient over the fill, 16%, 24% on hover
 *   3. inside edge  a 1px white gradient line just inside the border, cut to
 *                   the corner (a ::before with a mask)
 *   4. ring         1px outside, no blur   } one shadow token per type,
 *   5. drop shadow                         } --shadow-fancy-<type>
 * Basic has only the fill, ring and drop shadow. Keyboard focus adds the
 * focus ring of its type outside the 1px ring (page, Open 1). Layers and
 * sizes in styles/sizes/fancy-button.css.
 */
const SHINE_AND_EDGE = [
  "bg-(image:--fancy-button-shine) ds-hover:bg-(image:--fancy-button-shine-hover)",
  "before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:p-fancy-button-edge",
  "before:bg-(image:--fancy-button-edge) before:[mask:var(--fancy-button-edge-mask)]",
];

const fancyButtonVariants = cva(
  [
    "ds-shadow relative inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap text-label-sm outline-none",
    "transition-[background-color,color,box-shadow] duration-150",
    "[&_svg]:size-fancy-button-icon [&_svg]:shrink-0",
    // Disabled, every type: the Button's Disabled, no shine, no inside edge, no ring, no shadow.
    "disabled:cursor-not-allowed disabled:bg-bg-weak-25 disabled:bg-none disabled:text-text-disabled-300 disabled:lift-none disabled:ring-none disabled:before:hidden",
  ],
  {
    variants: {
      tone: {
        neutral: [
          "bg-bg-strong-950 text-text-white-0 [--ds-lift:var(--shadow-fancy-neutral)]",
          "ds-focus:[--ds-ring:var(--shadow-fancy-button-focus-neutral)]",
          SHINE_AND_EDGE,
        ],
        basic: [
          "bg-bg-white-0 text-text-sub-600 [--ds-lift:var(--shadow-fancy-stroke)]",
          "ds-hover:bg-bg-weak-50 ds-hover:text-text-strong-950 ds-hover:lift-none",
          "ds-focus:[--ds-ring:var(--shadow-fancy-button-focus-neutral)]",
        ],
        primary: [
          "bg-primary-base text-static-white [--ds-lift:var(--shadow-fancy-primary)]",
          "ds-focus:[--ds-ring:var(--shadow-fancy-button-focus-primary)]",
          SHINE_AND_EDGE,
        ],
        error: [
          "bg-state-error-base text-static-white [--ds-lift:var(--shadow-fancy-error)]",
          "ds-focus:[--ds-ring:var(--shadow-fancy-button-focus-error)]",
          SHINE_AND_EDGE,
        ],
      },
      size: {
        md: "h-fancy-button-md gap-fancy-button-md-gap rounded-fancy-button-md px-fancy-button-md-x",
        sm: "h-fancy-button-sm gap-fancy-button-sm-gap rounded-fancy-button-sm px-fancy-button-sm-x",
        xs: "h-fancy-button-xs gap-fancy-button-xs-gap rounded-fancy-button-xs px-fancy-button-xs-x",
      },
    },
    defaultVariants: { tone: "neutral", size: "md" },
  },
);

export type FancyButtonProps = Omit<React.ComponentProps<"button">, "children"> &
  VariantProps<typeof fancyButtonVariants> & {
    /** The word. */
    children: React.ReactNode;
    /** An icon before the word. */
    leadingIcon?: React.ReactNode;
    /** An icon after the word. */
    trailingIcon?: React.ReactNode;
  };

export function FancyButton({
  tone,
  size,
  leadingIcon,
  trailingIcon,
  children,
  className,
  type = "button",
  ...props
}: FancyButtonProps) {
  return (
    <button type={type} className={cn(fancyButtonVariants({ tone, size }), className)} {...props}>
      {leadingIcon}
      <span className="px-fancy-button-label-x">{children}</span>
      {trailingIcon}
    </button>
  );
}

export { fancyButtonVariants };
