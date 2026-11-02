import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * The design system's Link Button, built from
 * design-system/components/link-button.md (Nitesh's Figma "Link Buttons
 * [1.1]", node 168:4889).
 *
 * Words that work like a link ("Forgot password?", "Reply"). No fill, no
 * edge, no shadow.
 *
 *   variant    the Figma's Style: gray | black | primary | error | modifiable
 *              (modifiable takes the colour of the words it sits in, white
 *              on a Filled alert or banner)
 *   size       md 20 | sm 16
 *   underline  the line at rest; Hover and Focus always show it, Disabled
 *              never does
 *
 * With href it is an <a> (it goes somewhere), without one a <button> (it
 * does something); the look is the same. Keyboard focus adds the focus ring
 * of its type (page, Open 1), with a corner of 4. Sizes in
 * styles/sizes/link-button.css.
 */
const linkButtonVariants = cva(
  [
    "ds-shadow inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-link-button outline-none",
    "transition-[color,box-shadow] duration-150",
    "[&_svg]:shrink-0",
    // The line: solid, in the words' colour, the font's own thickness and distance, through the tails.
    "decoration-auto underline-offset-auto [text-decoration-skip-ink:none]",
    "ds-hover:underline ds-focus:underline",
    "disabled:cursor-not-allowed disabled:text-text-disabled-300 disabled:no-underline",
    "aria-disabled:cursor-not-allowed aria-disabled:text-text-disabled-300 aria-disabled:no-underline",
  ],
  {
    variants: {
      variant: {
        gray: "text-text-sub-600 ds-focus:text-text-strong-950 ds-focus:ring-focus-neutral",
        black: "text-text-strong-950 ds-focus:ring-focus-neutral",
        primary: "text-primary-base ds-hover:text-primary-dark ds-focus:text-primary-base ds-focus:ring-focus-primary",
        error: "text-state-error-base ds-hover:text-state-error-hover ds-focus:text-state-error-base ds-focus:ring-focus-error",
        modifiable: "text-inherit ds-focus:ring-focus-neutral",
      },
      size: {
        md: "h-link-button-md gap-link-button-md-gap text-label-sm [&_svg]:size-link-button-md-icon",
        sm: "h-link-button-sm gap-link-button-sm-gap text-label-xs [&_svg]:size-link-button-sm-icon",
      },
      underline: { true: "underline", false: "no-underline" },
    },
    defaultVariants: { variant: "gray", size: "md", underline: false },
  },
);

type LinkButtonOwnProps = VariantProps<typeof linkButtonVariants> & {
  children?: React.ReactNode;
  /** An icon before the words. */
  leadingIcon?: React.ReactNode;
  /** An icon after the words. */
  trailingIcon?: React.ReactNode;
};

type LinkButtonAsButton = LinkButtonOwnProps & Omit<React.ComponentProps<"button">, "children"> & { href?: undefined };
type LinkButtonAsLink = LinkButtonOwnProps &
  Omit<React.ComponentProps<"a">, "children"> & { href: string; disabled?: boolean };

export type LinkButtonProps = LinkButtonAsButton | LinkButtonAsLink;

export function LinkButton({
  variant,
  size,
  underline,
  leadingIcon,
  trailingIcon,
  children,
  className,
  ...props
}: LinkButtonProps) {
  const classes = cn(linkButtonVariants({ variant, size, underline }), className);
  const content = (
    <>
      {leadingIcon}
      {children != null && children !== false && <span>{children}</span>}
      {trailingIcon}
    </>
  );

  if (typeof props.href === "string") {
    const { href, disabled, ...anchor } = props as Omit<LinkButtonAsLink, keyof LinkButtonOwnProps | "className">;
    // A disabled link goes nowhere: no href, so it also leaves the tab order.
    return disabled ? (
      <a aria-disabled="true" className={classes} {...anchor}>
        {content}
      </a>
    ) : (
      <a href={href} className={classes} {...anchor}>
        {content}
      </a>
    );
  }

  const { type = "button", ...button } = props as Omit<LinkButtonAsButton, keyof LinkButtonOwnProps | "className">;
  return (
    <button type={type} className={classes} {...button}>
      {content}
    </button>
  );
}

export { linkButtonVariants };
