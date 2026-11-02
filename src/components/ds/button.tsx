import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * The design system's Button, built from design-system/components/button.md
 * (Nitesh's Figma "Buttons [1.1]", node 129:1422).
 *
 *   tone     the Figma's Type:  primary | neutral | error
 *   variant  the Figma's Style: filled | stroke | lighter | ghost
 *   size     md 40 | sm 36 | xs 32 | 2xs 28
 *
 * Colours are the design tokens (colors.md), sizes the size tokens in
 * styles/size-tokens.css, states the ds-* variants in styles/ds.css (so the
 * playground's Components page can force a state with data-force).
 * With no children it is icon-only and needs an aria-label.
 */
const buttonVariants = cva(
  [
    "ds-shadow inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap text-label-sm outline-none",
    "transition-[background-color,color,box-shadow] duration-150",
    "[&_svg]:size-button-icon [&_svg]:shrink-0",
    "disabled:cursor-not-allowed disabled:bg-bg-weak-25 disabled:text-text-disabled-300 disabled:edge-none disabled:lift-none disabled:ring-none",
  ],
  {
    variants: {
      tone: { primary: "", neutral: "", error: "" },
      variant: { filled: "", stroke: "", lighter: "", ghost: "" },
      size: {
        md: "h-button-md gap-button-md-gap rounded-button-md px-button-md-x",
        sm: "h-button-sm gap-button-sm-gap rounded-button-sm px-button-sm-x",
        xs: "h-button-xs gap-button-xs-gap rounded-button-xs px-button-xs-x",
        "2xs": "h-button-2xs gap-button-2xs-gap rounded-button-2xs px-button-2xs-x",
      },
      iconOnly: { true: "px-0", false: "" },
    },
    compoundVariants: [
      // Icon only: a square as tall as the button.
      { iconOnly: true, size: "md", class: "w-button-md" },
      { iconOnly: true, size: "sm", class: "w-button-sm" },
      { iconOnly: true, size: "xs", class: "w-button-xs" },
      { iconOnly: true, size: "2xs", class: "w-button-2xs" },

      // Filled
      { tone: "primary", variant: "filled", class: "bg-primary-base text-static-white ds-hover:bg-primary-dark ds-focus:ring-focus-primary" },
      { tone: "neutral", variant: "filled", class: "bg-bg-surface-800 text-text-white-0 ds-hover:bg-bg-strong-950 ds-focus:ring-focus-neutral" },
      { tone: "error", variant: "filled", class: "bg-state-error-base text-static-white ds-hover:bg-state-error-hover ds-focus:ring-focus-error" },

      // Stroke
      {
        tone: "primary", variant: "stroke",
        class: "bg-bg-white-0 edge-primary-base text-primary-base ds-hover:bg-primary-alpha-10 ds-hover:edge-none ds-focus:bg-bg-white-0 ds-focus:edge-primary-base ds-focus:ring-focus-primary",
      },
      {
        tone: "neutral", variant: "stroke",
        class: "bg-bg-white-0 edge-stroke-soft-200 lift-card text-text-sub-600 ds-hover:bg-bg-weak-50 ds-hover:edge-none ds-hover:lift-none ds-hover:text-text-strong-950 ds-focus:bg-bg-white-0 ds-focus:edge-stroke-strong-950 ds-focus:lift-none ds-focus:text-text-strong-950 ds-focus:ring-focus-neutral",
      },
      {
        tone: "error", variant: "stroke",
        class: "bg-bg-white-0 edge-state-error-base text-state-error-base ds-hover:bg-state-error-lighter ds-hover:edge-none ds-focus:bg-bg-white-0 ds-focus:edge-state-error-base ds-focus:ring-focus-error",
      },

      // Lighter
      {
        tone: "primary", variant: "lighter",
        class: "bg-primary-alpha-10 text-primary-base ds-hover:bg-bg-white-0 ds-hover:edge-primary-base ds-focus:bg-bg-white-0 ds-focus:edge-primary-base ds-focus:ring-focus-primary",
      },
      {
        tone: "neutral", variant: "lighter",
        class: "bg-bg-weak-50 text-text-sub-600 ds-hover:bg-bg-white-0 ds-hover:edge-stroke-soft-200 ds-hover:lift-card ds-hover:text-text-strong-950 ds-focus:bg-bg-white-0 ds-focus:edge-stroke-strong-950 ds-focus:lift-none ds-focus:text-text-strong-950 ds-focus:ring-focus-neutral",
      },
      {
        tone: "error", variant: "lighter",
        class: "bg-state-error-lighter text-state-error-base ds-hover:bg-bg-white-0 ds-hover:edge-state-error-base ds-focus:bg-bg-white-0 ds-focus:edge-state-error-base ds-focus:ring-focus-error",
      },

      // Ghost
      {
        tone: "primary", variant: "ghost",
        class: "bg-transparent text-primary-base ds-hover:bg-primary-alpha-10 ds-focus:bg-bg-white-0 ds-focus:edge-primary-base ds-focus:ring-focus-primary",
      },
      {
        tone: "neutral", variant: "ghost",
        class: "bg-transparent text-text-sub-600 ds-hover:bg-bg-weak-50 ds-hover:text-text-strong-950 ds-focus:bg-bg-white-0 ds-focus:edge-stroke-strong-950 ds-focus:text-text-strong-950 ds-focus:ring-focus-neutral",
      },
      {
        tone: "error", variant: "ghost",
        class: "bg-transparent text-state-error-base ds-hover:bg-state-error-lighter ds-focus:bg-bg-white-0 ds-focus:edge-state-error-base ds-focus:ring-focus-error",
      },
    ],
    defaultVariants: { tone: "primary", variant: "filled", size: "md", iconOnly: false },
  },
);

export type ButtonProps = Omit<React.ComponentProps<"button">, "children"> &
  Omit<VariantProps<typeof buttonVariants>, "iconOnly"> & {
    children?: React.ReactNode;
    /** An icon before the word (or the only icon, with no children). */
    leadingIcon?: React.ReactNode;
    /** An icon after the word. */
    trailingIcon?: React.ReactNode;
  };

export function Button({
  tone,
  variant,
  size,
  leadingIcon,
  trailingIcon,
  children,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  const iconOnly = children == null || children === false;
  return (
    <button type={type} className={cn(buttonVariants({ tone, variant, size, iconOnly }), className)} {...props}>
      {leadingIcon}
      {!iconOnly && <span className="px-button-label-x">{children}</span>}
      {trailingIcon}
    </button>
  );
}

export { buttonVariants };
