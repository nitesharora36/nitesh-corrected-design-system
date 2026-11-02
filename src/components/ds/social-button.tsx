"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * The design system's Social Button, built from
 * design-system/components/social-button.md (Nitesh's Figma "Social Buttons
 * [1.1]", node 180:4264).
 *
 * Signing in or connecting with another company's account.
 *
 *   brand    apple | x | google | facebook | linkedin | github | dropbox
 *   variant  the Figma's Style: filled (the brand's colour) | stroke (white
 *            with an edge)
 *
 * One size, 40 tall. With no children it is the icon-only square and needs an
 * aria-label. The words are the product's ("Continue with ..."); the page
 * does not set them.
 *
 * Built from the page's proposals: Disabled is the Button's Disabled with the
 * logo grey (Open 4), and on dark Filled Apple and X take the Stroke look, as
 * their black would vanish on the dark page (Open 5).
 *
 * The logos are stand-in marks in the brand's colours until the brands' own
 * artwork is added (to components/brand-mark.tsx, the page's "In code").
 * Brand colours and sizes in styles/sizes/social-button.css.
 */
export type SocialBrand = "apple" | "x" | "google" | "facebook" | "linkedin" | "github" | "dropbox";

const socialButtonVariants = cva(
  [
    "ds-shadow inline-flex h-social-button shrink-0 cursor-pointer items-center justify-center gap-social-button-gap whitespace-nowrap rounded-social-button text-label-sm outline-none",
    "transition-[background-color,color,box-shadow] duration-150",
    "[&_svg]:size-social-button-logo [&_svg]:shrink-0",
    "disabled:cursor-not-allowed disabled:bg-bg-weak-25 disabled:bg-none disabled:text-text-disabled-300 disabled:edge-none disabled:lift-none disabled:ring-none",
  ],
  {
    variants: {
      brand: { apple: "", x: "", google: "", facebook: "", linkedin: "", github: "", dropbox: "" },
      variant: {
        filled: "text-static-white ds-focus:ring-focus-neutral",
        stroke: [
          "bg-bg-white-0 edge-stroke-soft-200 lift-card text-text-strong-950",
          "ds-hover:bg-bg-weak-50 ds-hover:edge-none ds-hover:lift-none",
          "ds-focus:bg-bg-white-0 ds-focus:edge-stroke-strong-950 ds-focus:lift-none ds-focus:ring-focus-neutral",
        ],
      },
      iconOnly: { true: "w-social-button px-0", false: "pl-social-button-left pr-social-button-right" },
    },
    compoundVariants: [
      // Filled: the brand's colour; on hover a layer at 16% over it.
      { variant: "filled", brand: "apple", class: "bg-(--social-apple-fill) ds-hover:bg-(image:--social-button-hover-white)" },
      { variant: "filled", brand: "x", class: "bg-(--social-twitter-fill) ds-hover:bg-(image:--social-button-hover-white)" },
      { variant: "filled", brand: "github", class: "bg-(--social-github-fill) ds-hover:bg-(image:--social-button-hover-white)" },
      { variant: "filled", brand: "google", class: "bg-(--social-google-fill) ds-hover:bg-(image:--social-button-hover-black)" },
      { variant: "filled", brand: "facebook", class: "bg-(--social-facebook-fill) ds-hover:bg-(image:--social-button-hover-black)" },
      { variant: "filled", brand: "linkedin", class: "bg-(--social-linkedin-fill) ds-hover:bg-(image:--social-button-hover-black)" },
      { variant: "filled", brand: "dropbox", class: "bg-(--social-dropbox-fill) ds-hover:bg-(image:--social-button-hover-black)" },

      // Dark: Filled Apple and X take the Stroke look (page, Open 5).
      {
        variant: "filled",
        brand: ["apple", "x"],
        class: [
          "dark:bg-bg-white-0 dark:edge-stroke-soft-200 dark:lift-card dark:text-text-strong-950",
          "dark:ds-hover:bg-bg-weak-50 dark:ds-hover:bg-none dark:ds-hover:edge-none dark:ds-hover:lift-none",
          "dark:ds-focus:bg-bg-white-0 dark:ds-focus:edge-stroke-strong-950 dark:ds-focus:lift-none",
          "dark:disabled:bg-bg-weak-25 dark:disabled:edge-none dark:disabled:lift-none dark:disabled:text-text-disabled-300",
        ],
      },
    ],
    defaultVariants: { variant: "filled", iconOnly: false },
  },
);

export type SocialButtonProps = Omit<React.ComponentProps<"button">, "children"> &
  Omit<VariantProps<typeof socialButtonVariants>, "brand" | "iconOnly"> & {
    brand: SocialBrand;
    /** The words. Leave them out for the icon-only square (then give an aria-label). */
    children?: React.ReactNode;
  };

export function SocialButton({ brand, variant, children, className, disabled, type = "button", ...props }: SocialButtonProps) {
  const iconOnly = children == null || children === false;
  // Filled shows the logo in its one-colour white form; Disabled turns it grey.
  // Both follow the words' colour.
  const mono = (variant ?? "filled") === "filled" || Boolean(disabled);
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(socialButtonVariants({ brand, variant, iconOnly }), className)}
      {...props}
    >
      <BrandLogo brand={brand} mono={mono} />
      {!iconOnly && <span>{children}</span>}
    </button>
  );
}

/** Stand-in marks on a 20 grid, in the brand's colours, or in the words'
 *  colour when mono. Not the brands' artwork. */
function BrandLogo({ brand, mono }: { brand: SocialBrand; mono: boolean }) {
  const gradientId = `social-facebook-${React.useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const svg = { viewBox: "0 0 20 20", "aria-hidden": true, focusable: false } as const;

  switch (brand) {
    case "apple":
      return (
        <svg {...svg} className={mono ? "fill-current" : "fill-(--social-apple)"}>
          <path d="M10 6.6C8.9 5.8 7.6 5.6 6.5 6 4.9 6.6 4 8.2 4 10.3c0 3.1 2 6.2 3.6 6.2.9 0 1.5-.5 2.4-.5s1.5.5 2.4.5c1.6 0 3.6-3.1 3.6-6.2 0-2.1-.9-3.7-2.5-4.3-1.1-.4-2.4-.2-3.5.6z" />
          <path d="M10.3 5.3c-.1-1.7 1.1-3.1 2.7-3.3.1 1.7-1.1 3.1-2.7 3.3z" />
        </svg>
      );
    case "x":
      return (
        <svg {...svg} fill="none" strokeWidth={2.25} strokeLinecap="round" className={mono ? "stroke-current" : "stroke-(--social-twitter)"}>
          <path d="M4.5 4.5l11 11M15.5 4.5l-11 11" />
        </svg>
      );
    case "github":
      return (
        <svg {...svg} className={mono ? "fill-current stroke-current" : "fill-(--social-github) stroke-(--social-github)"}>
          <circle cx="10" cy="10" r="7" fill="none" strokeWidth={2.5} />
          <circle cx="10" cy="10" r="2.5" stroke="none" />
        </svg>
      );
    case "google":
      return (
        <svg {...svg} fill="none" strokeWidth={3}>
          <path d="M5.4 5.4A6.5 6.5 0 0 1 14.6 5.4" className={mono ? "stroke-current" : "stroke-(--social-google-red)"} />
          <path d="M14.6 5.4A6.5 6.5 0 0 1 14.6 14.6M10 10h6.5" className={mono ? "stroke-current" : "stroke-(--social-google-blue)"} />
          <path d="M14.6 14.6A6.5 6.5 0 0 1 5.4 14.6" className={mono ? "stroke-current" : "stroke-(--social-google-green)"} />
          <path d="M5.4 14.6A6.5 6.5 0 0 1 5.4 5.4" className={mono ? "stroke-current" : "stroke-(--social-google-yellow)"} />
        </svg>
      );
    case "facebook":
      return (
        <svg {...svg}>
          {!mono && (
            <defs>
              <linearGradient id={gradientId} x1="0" y1="1" x2="0" y2="0">
                <stop offset="0" className="[stop-color:var(--social-facebook-bottom)]" />
                <stop offset="1" className="[stop-color:var(--social-facebook-top)]" />
              </linearGradient>
            </defs>
          )}
          <circle cx="10" cy="10" r="9" fill={mono ? "currentColor" : `url(#${gradientId})`} />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...svg} className={mono ? "fill-current" : "fill-(--social-linkedin)"}>
          <rect x="2" y="2" width="16" height="16" rx="3.5" />
        </svg>
      );
    case "dropbox":
      return (
        <svg {...svg} strokeLinejoin="round" className={mono ? "fill-current" : "fill-(--social-dropbox)"}>
          <path d="M10 2.5 17.5 10 10 17.5 2.5 10z" />
        </svg>
      );
  }
}

export { socialButtonVariants };
