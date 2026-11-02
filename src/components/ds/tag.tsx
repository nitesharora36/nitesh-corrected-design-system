"use client";

import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { CloseIcon } from "@/components/ui/icons";

/**
 * The design system's Tag, built from design-system/components/tag.md
 * (Nitesh's Figma "Tag [1.1]", node 431:16147): a small label a person can
 * pick, filter by or remove. A label that only reports a status is the Badge.
 *
 *   variant    the Figma's Style: stroke | gray (on hover the two swap looks)
 *   tone       neutral (the Figma's) | blue (Neutrino, 21 Oct 2026: a value
 *              that comes from somewhere else, such as an earlier workflow
 *              step; the Badge's Lighter Blue look, tag.md)
 *   active     picked (the Figma's Active state)
 *   disabled
 *   picture    a 16 x 16 icon, avatar, flag, brand or company logo before the
 *              word (the Figma's Left Icon, Avatar, Country, Brand, Company)
 *   count      an optional "(4)" after the word
 *   onDismiss  shows the close icon, its own button (dismissLabel names it)
 *   onClick    makes the whole tag a button you press (with active, a toggle)
 *
 * One size, 24 tall: the tokens in styles/sizes/tag.css. Hover and focus are
 * the ds-* variants in styles/ds.css, so the Components page can force them
 * with data-force on the tag (and on the close icon through dismissProps).
 */
const tagVariants = cva(
  [
    "group/tag ds-shadow relative inline-flex h-tag shrink-0 items-center whitespace-nowrap rounded-tag py-tag-y text-label-xs",
    "transition-[background-color,color,box-shadow] duration-150",
  ],
  {
    variants: {
      variant: { stroke: "", gray: "" },
      tone: { neutral: "", blue: "" },
      state: {
        default: "text-text-sub-600 ds-focus:ring-focus-neutral has-[[data-tag-main]:focus-visible]:ring-focus-neutral",
        active: "bg-bg-white-0 edge-stroke-strong-950 text-text-strong-950 ds-focus:ring-focus-neutral has-[[data-tag-main]:focus-visible]:ring-focus-neutral",
        disabled: "cursor-not-allowed bg-bg-weak-50 text-text-disabled-300",
      },
      picture: { true: "pl-tag-x-picture", false: "pl-tag-x" },
      dismiss: { true: "pr-tag-x-close", false: "pr-tag-x" },
    },
    compoundVariants: [
      // At rest; on hover the two styles swap looks.
      { variant: "stroke", tone: "neutral", state: "default", class: "bg-bg-white-0 edge-stroke-soft-200 ds-hover:bg-bg-weak-50 ds-hover:edge-none" },
      { variant: "gray", tone: "neutral", state: "default", class: "bg-bg-weak-50 ds-hover:bg-bg-white-0 ds-hover:edge-stroke-soft-200" },
      // Blue: one look for both styles, the information tint; hover a step stronger.
      { tone: "blue", state: "default", class: "bg-state-information-lighter text-state-information-dark ds-hover:bg-state-information-light" },
      { tone: "blue", state: "active", class: "bg-state-information-lighter edge-state-information-base text-state-information-dark" },
    ],
    defaultVariants: { variant: "stroke", tone: "neutral", state: "default", picture: false, dismiss: false },
  },
);

/** The picture and the close icon: icon colours by state (avatars, flags and
 *  logos keep their own). Hover darkens both, one rule for every tag. */
const iconColour = {
  default: "text-icon-soft-400 group-ds-hover/tag:text-icon-sub-600",
  active: "text-icon-strong-950",
  disabled: "text-icon-disabled-300",
} as const;

const countColour = {
  default: "text-text-soft-400",
  active: "text-text-sub-600",
  disabled: "text-text-disabled-300",
} as const;

type DataAttributes = { [key: `data-${string}`]: string | undefined };

export type TagProps = Omit<React.ComponentProps<"span">, "children" | "onClick"> & {
  children: React.ReactNode;
  /** The Figma's Style. */
  variant?: "stroke" | "gray";
  /** neutral (the Figma's) or blue (a value from somewhere else). */
  tone?: "neutral" | "blue";
  /** Picked. With onClick it is announced as a pressed toggle. */
  active?: boolean;
  disabled?: boolean;
  /** A 16 x 16 picture before the word: an icon, an Avatar, a flag, a logo. */
  picture?: React.ReactNode;
  /** A number shown as "(4)" after the word. */
  count?: React.ReactNode;
  /** Makes the tag a button (picking or filtering). */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Shows the close icon; called when it is pressed. */
  onDismiss?: React.MouseEventHandler<HTMLButtonElement>;
  /** The close icon's words for screen readers. */
  dismissLabel?: string;
  /** Passed to the close icon's button (data-force="focus" on the Components page). */
  dismissProps?: Omit<React.ComponentProps<"button">, "onClick" | "children"> & DataAttributes;
};

export function Tag({
  children,
  variant,
  tone = "neutral",
  active,
  disabled = false,
  picture,
  count,
  onClick,
  onDismiss,
  dismissLabel = "Remove",
  dismissProps,
  className,
  ...props
}: TagProps) {
  const state = disabled ? "disabled" : active ? "active" : "default";
  const dismiss = onDismiss != null;
  // A blue tag's picture and close icon are its words' blue.
  const icons = tone === "blue" && state !== "disabled" ? "text-state-information-dark" : iconColour[state];

  const content = (
    <>
      {picture != null && (
        <span
          className={cn(
            "flex size-tag-picture shrink-0 items-center justify-center me-tag-picture-gap [&>*]:size-tag-picture",
            icons,
          )}
        >
          {picture}
        </span>
      )}
      <span>{children}</span>
      {count != null && <span className={cn("ms-tag-count-gap text-paragraph-xs", countColour[state])}>({count})</span>}
    </>
  );

  return (
    <span
      aria-disabled={disabled || undefined}
      className={cn(tagVariants({ variant, tone, state, picture: picture != null, dismiss }), className)}
      {...props}
    >
      {onClick ? (
        // The whole tag presses: the button's ::after covers it, under the
        // close icon. aria-pressed only when the caller says if it is picked.
        <button
          type="button"
          data-tag-main=""
          aria-pressed={active}
          disabled={disabled}
          onClick={onClick}
          className="inline-flex cursor-pointer items-center outline-none after:absolute after:inset-space-0 after:rounded-tag disabled:cursor-not-allowed"
        >
          {content}
        </button>
      ) : (
        <span className="inline-flex items-center">{content}</span>
      )}
      {dismiss && (
        <button
          type="button"
          aria-label={dismissLabel}
          disabled={disabled}
          {...dismissProps}
          onClick={onDismiss}
          className={cn(
            "ds-shadow relative ms-tag-close-gap flex size-tag-close shrink-0 cursor-pointer items-center justify-center rounded-tag-close outline-none ds-focus:ring-focus-neutral [&_svg]:size-tag-close",
            "disabled:cursor-not-allowed",
            icons,
            dismissProps?.className,
          )}
        >
          <CloseIcon />
        </button>
      )}
    </span>
  );
}

export { tagVariants };
