import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { CheckCircleIcon, CircleIcon, CloseIcon, CrossCircleIcon } from "@/components/ui/icons";

/**
 * The design system's Key Components, built from
 * design-system/components/key-components.md (Nitesh's Figma, the Key
 * Components page 263:1844): small parts the other components are made of.
 * (The Label and Hint Text are in components/ds/label.tsx.)
 *
 *   KeyIcon           an icon in a circle. size 2xl 64 | xl 56 | lg 48 | md 40 | sm 32,
 *                     variant stroke | lighter, color gray | blue | orange | red | green
 *   ContentLabel      a title, a description, an optional picture on the left
 *                     and an optional Badge or Switch on the right. size md 40 | lg 48
 *   ContentCard       the Content Label in a card, with a close icon (onClose)
 *   PasswordStrength  three bars, a line of text and the conditions
 *   ChartLegend       a dot and its word; LegendDot the dot alone (md | sm)
 *
 * Yellow, Purple, Sky, Pink and Teal wait for their hues. Sizes are the
 * tokens in styles/sizes/key-components.css.
 */

export type KeyColor = "gray" | "blue" | "orange" | "red" | "green";

// ---- Key Icon ----

const keyIconVariants = cva("ds-shadow inline-flex shrink-0 items-center justify-center rounded-key-icon", {
  variants: {
    size: {
      "2xl": "size-key-icon-2xl p-key-icon-2xl-pad [&_svg]:size-key-icon-2xl-icon",
      xl: "size-key-icon-xl p-key-icon-xl-pad [&_svg]:size-key-icon-xl-icon",
      lg: "size-key-icon-lg p-key-icon-lg-pad [&_svg]:size-key-icon-lg-icon",
      md: "size-key-icon-md p-key-icon-md-pad [&_svg]:size-key-icon-md-icon",
      sm: "size-key-icon-sm p-key-icon-sm-pad [&_svg]:size-key-icon-sm-icon",
    },
    variant: {
      stroke: "bg-bg-white-0 edge-stroke-soft-200 lift-card",
      lighter: "",
    },
    // The icon: Gray icon/sub-600, any other colour its state's base.
    color: {
      gray: "text-icon-sub-600",
      blue: "text-state-information-base",
      orange: "text-state-warning-base",
      red: "text-state-error-base",
      green: "text-state-success-base",
    },
  },
  compoundVariants: [
    { variant: "lighter", color: "gray", class: "bg-state-faded-lighter" },
    { variant: "lighter", color: "blue", class: "bg-state-information-lighter" },
    { variant: "lighter", color: "orange", class: "bg-state-warning-lighter" },
    { variant: "lighter", color: "red", class: "bg-state-error-lighter" },
    { variant: "lighter", color: "green", class: "bg-state-success-lighter" },
  ],
  defaultVariants: { size: "md", variant: "stroke", color: "gray" },
});

export type KeyIconProps = Omit<React.ComponentProps<"span">, "color"> & {
  size?: "2xl" | "xl" | "lg" | "md" | "sm";
  variant?: "stroke" | "lighter";
  color?: KeyColor;
  /** The icon. */
  children: React.ReactNode;
};

export function KeyIcon({ size, variant, color, className, children, ...props }: KeyIconProps) {
  return (
    <span className={cn(keyIconVariants({ size, variant, color }), className)} {...props}>
      {children}
    </span>
  );
}

// ---- Content Label ----

const LABEL_SIZE = {
  md: { box: "min-h-content-label-md", picture: "size-content-label-md", title: "text-label-sm", description: "text-paragraph-xs" },
  lg: { box: "min-h-content-label-lg", picture: "size-content-label-lg", title: "text-label-md", description: "text-paragraph-sm" },
} as const;

export type ContentLabelProps = Omit<React.ComponentProps<"div">, "title"> & {
  size?: "md" | "lg";
  title: React.ReactNode;
  /** Shown as "(Sublabel)" after the title. */
  sublabel?: React.ReactNode;
  description?: React.ReactNode;
  /** On the left, 40 or 48: a KeyIcon, an Avatar, a brand or company logo. */
  picture?: React.ReactNode;
  /** On the right: a Badge or a Switch. */
  trailing?: React.ReactNode;
};

export function ContentLabel({ size = "md", title, sublabel, description, picture, trailing, className, ...props }: ContentLabelProps) {
  const s = LABEL_SIZE[size];
  return (
    <div className={cn("flex items-center gap-content-label-gap", s.box, className)} {...props}>
      {picture != null && (
        <span className={cn("flex shrink-0 items-center justify-center [&>img]:size-full", s.picture)}>{picture}</span>
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-content-label-words-gap">
        <div className="flex items-center gap-content-label-sublabel-gap">
          <span className={cn("text-text-strong-950", s.title)}>{title}</span>
          {sublabel != null && <span className="text-paragraph-xs text-text-sub-600">({sublabel})</span>}
        </div>
        {description != null && <span className={cn("text-text-sub-600", s.description)}>{description}</span>}
      </div>
      {trailing != null && <div className="flex shrink-0 items-center">{trailing}</div>}
    </div>
  );
}

// ---- Content Card ----

export type ContentCardProps = Omit<ContentLabelProps, "size"> & {
  /** Shows the close icon; called when it is pressed. */
  onClose?: React.MouseEventHandler<HTMLButtonElement>;
  /** The close icon's words for screen readers. */
  closeLabel?: string;
};

/** The Content Label (Medium) in the Checkbox Card's card: padding 16,
 *  gap 14, corner 12, bg/white-0, a stroke/soft-200 edge, the card shadow.
 *  It takes its container's width; the close icon sits on the right, at the
 *  top, like the Checkbox Card's box. */
export function ContentCard({ onClose, closeLabel = "Close", className, ...label }: ContentCardProps) {
  return (
    <div
      className={cn(
        "ds-shadow flex min-h-content-card w-full items-start gap-content-card-gap rounded-content-card bg-bg-white-0 p-content-card-pad edge-stroke-soft-200 lift-card",
        className,
      )}
    >
      <ContentLabel size="md" className="min-w-0 flex-1" {...label} />
      {onClose && (
        <button
          type="button"
          aria-label={closeLabel}
          onClick={onClose}
          className="ds-shadow flex size-content-card-close shrink-0 cursor-pointer items-center justify-center rounded-content-card-close text-icon-sub-600 outline-none ds-focus:ring-focus-neutral [&_svg]:size-content-card-close"
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
}

// ---- Password Strength ----

export type PasswordStrengthLevel = "empty" | "weak" | "moderate" | "strong";

/** Bars 1 to 3 at each strength. */
const BARS: Record<PasswordStrengthLevel, [string, string, string]> = {
  empty: ["bg-bg-soft-200", "bg-bg-soft-200", "bg-bg-soft-200"],
  weak: ["bg-state-error-base", "bg-bg-soft-200", "bg-bg-soft-200"],
  moderate: ["bg-state-error-base", "bg-state-warning-base", "bg-bg-soft-200"],
  strong: ["bg-state-error-base", "bg-state-warning-base", "bg-state-success-base"],
};
const LEVEL = { empty: 0, weak: 1, moderate: 2, strong: 3 } as const;

export type PasswordStrengthProps = React.ComponentProps<"div"> & {
  strength: PasswordStrengthLevel;
  /** Each condition and whether the password meets it. */
  conditions: { label: React.ReactNode; met: boolean }[];
  /** Typing has started: a condition not met shows a cross, not an empty circle. */
  typing?: boolean;
  /** The line above the conditions. */
  hint?: React.ReactNode;
};

/** Shown under a password field: a column with an 8px gap. */
export function PasswordStrength({
  strength,
  conditions,
  typing = false,
  hint = "Must contain at least;",
  className,
  ...props
}: PasswordStrengthProps) {
  return (
    <div className={cn("flex flex-col gap-password-strength-gap", className)} {...props}>
      <div
        role="meter"
        aria-label="Password strength"
        aria-valuemin={LEVEL.empty}
        aria-valuemax={LEVEL.strong}
        aria-valuenow={LEVEL[strength]}
        aria-valuetext={strength}
        className="flex gap-password-strength-bar-gap"
      >
        {BARS[strength].map((fill, i) => (
          <span key={i} className={cn("h-password-strength-bar flex-1 rounded-password-strength-bar", fill)} />
        ))}
      </div>
      <span className="text-paragraph-xs text-text-sub-600">{hint}</span>
      <div role="list" className="flex flex-col gap-password-strength-gap">
        {conditions.map((c, i) => (
          <div key={i} role="listitem" className="flex items-center gap-password-strength-icon-gap text-paragraph-xs text-text-sub-600">
            <span
              className={cn(
                "inline-flex shrink-0 [&_svg]:size-password-strength-icon",
                c.met ? "text-state-success-base" : "text-icon-soft-400",
              )}
            >
              {c.met ? <CheckCircleIcon /> : typing ? <CrossCircleIcon /> : <CircleIcon />}
            </span>
            <span>
              {c.label}
              <span className="sr-only">{c.met ? ", met" : ", not met"}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- Chart Legend and Legend Dot ----

export type LegendColor = KeyColor | "light-gray" | "disabled";

/** The dot's colour: the state's base; Light Gray and Disabled icon/disabled-300.
 *  Chart colours are not decided yet, so the legends follow the state colours. */
const DOT: Record<LegendColor, string> = {
  gray: "bg-state-faded-base",
  blue: "bg-state-information-base",
  orange: "bg-state-warning-base",
  red: "bg-state-error-base",
  green: "bg-state-success-base",
  "light-gray": "bg-icon-disabled-300",
  disabled: "bg-icon-disabled-300",
};

export type LegendDotProps = Omit<React.ComponentProps<"span">, "color" | "children"> & {
  /** md: a 20 x 20 box. sm: a 16 x 16 box. The circle is 12 in both, with a 2px stroke/white-0 ring. */
  size?: "md" | "sm";
  color?: LegendColor;
};

export function LegendDot({ size = "md", color = "blue", className, ...props }: LegendDotProps) {
  return (
    <span
      aria-hidden
      className={cn("inline-flex shrink-0 items-center justify-center", size === "md" ? "size-legend-dot-md" : "size-legend-dot-sm", className)}
      {...props}
    >
      <span className={cn("ds-shadow size-legend-dot rounded-legend-dot [--ds-lift:var(--shadow-legend-dot)]", DOT[color])} />
    </span>
  );
}

export type ChartLegendProps = Omit<React.ComponentProps<"span">, "color"> & {
  color?: LegendColor;
  disabled?: boolean;
  /** The word. */
  children: React.ReactNode;
};

/** A 16 x 16 dot and its word, 4px apart. */
export function ChartLegend({ color = "blue", disabled = false, className, children, ...props }: ChartLegendProps) {
  return (
    <span
      className={cn("inline-flex items-center gap-legend-gap text-label-xs", disabled ? "text-text-disabled-300" : "text-text-sub-600", className)}
      {...props}
    >
      <LegendDot size="sm" color={disabled ? "disabled" : color} />
      {children}
    </span>
  );
}

export { keyIconVariants };
