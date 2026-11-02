"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * The design system's Checkbox, built from design-system/components/checkbox.md
 * (Nitesh's Figma "Checkbox [1.1]" 227:2002, "Checkbox Label [1.1]"
 * 231:4897 and "Checkbox Card [1.1]" 261:3896), on Radix's checkbox.
 *
 * Checkbox       the box. size md (20) | sm (16); checked true | false |
 *                "indeterminate"; disabled
 * CheckboxLabel  the box with its words: label, sublabel, badge (a Badge,
 *                a slot), description, link (a Link Button, a slot); flip
 *                puts the box on the right
 * CheckboxCard   a card you pick: type basic | left-icon | avatar |
 *                card-provider | brand | company, its picture in `picture`
 *                (a Key Icon, an Avatar or a logo, a slot)
 *
 * Focus is shown by the box itself (a blue edge, or a darker fill), never a
 * ring. data-force="hover" or "focus" on a box, or "hover" on a card, shows
 * that state on the Components page. Sizes are the tokens in
 * styles/sizes/checkbox.css.
 *
 * ChoiceLabel, ChoiceCard and useControllableState are shared with the
 * Radio and the Switch (radio.md, switch.md: "exactly the Checkbox Label",
 * "exactly the Checkbox Card"), each with its own size tokens.
 */

/** A value the caller may control (value) or leave to the component. */
export function useControllableState<T>(value: T | undefined, defaultValue: T, onChange?: (next: T) => void) {
  const [inner, setInner] = React.useState(defaultValue);
  const controlled = value !== undefined;
  const set = React.useCallback(
    (next: T) => {
      if (!controlled) setInner(next);
      onChange?.(next);
    },
    [controlled, onChange],
  );
  return [controlled ? value : inner, set] as const;
}

const boxVariants = cva(
  "group/checkbox relative inline-flex shrink-0 items-center justify-center rounded-checkbox-box text-static-white outline-none transition-colors duration-150",
  {
    variants: {
      size: {
        md: "m-checkbox-md-inset size-checkbox-md-box",
        sm: "m-checkbox-sm-inset size-checkbox-sm-box",
      },
      disabled: {
        false: [
          "cursor-pointer",
          // Off: the box is the edge's colour; the white face sits on it.
          "data-[state=unchecked]:bg-bg-soft-200 data-[state=unchecked]:ds-hover:bg-bg-sub-300 data-[state=unchecked]:ds-focus:bg-primary-base",
          // On and Indeterminate.
          "not-data-[state=unchecked]:bg-primary-base not-data-[state=unchecked]:ds-hover:bg-primary-dark not-data-[state=unchecked]:ds-focus:bg-primary-darkest",
        ],
        // Off: the edge only, no face. On: a grey fill, the tick still white.
        true: "cursor-not-allowed bg-bg-soft-200",
      },
    },
    defaultVariants: { size: "md", disabled: false },
  },
);

export type CheckboxProps = Omit<React.ComponentProps<typeof CheckboxPrimitive.Root>, "children"> & {
  size?: "md" | "sm";
};

export function Checkbox({ size = "md", disabled, className, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root disabled={disabled} className={cn(boxVariants({ size, disabled: !!disabled }), className)} {...props}>
      {!disabled && (
        <span
          aria-hidden
          className={cn(
            "ds-shadow [--ds-lift:var(--shadow-checkbox-face)] rounded-checkbox-face bg-bg-white-0",
            "group-data-[state=checked]/checkbox:hidden group-data-[state=indeterminate]/checkbox:hidden",
            size === "sm" ? "size-checkbox-sm-face" : "size-checkbox-md-face",
          )}
        />
      )}
      <CheckboxPrimitive.Indicator className="absolute inset-0 flex items-center justify-center">
        {/* The tick, 9.1 x 6.6 with a 1.5 stroke, and the dash, 8 x 1.5. */}
        <svg viewBox="0 0 9.1 6.6" fill="none" aria-hidden className="h-checkbox-tick-h w-checkbox-tick-w group-data-[state=indeterminate]/checkbox:hidden">
          <path d="M0.75 3.3 3.4 5.85 8.35 0.75" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span aria-hidden className="hidden h-checkbox-dash-h w-checkbox-dash-w bg-static-white group-data-[state=indeterminate]/checkbox:block" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

/* ---- The words beside a control, shared with the Radio and the Switch ---- */

type ChoiceWords = {
  label: React.ReactNode;
  /** "(Sublabel)", after the label. */
  sublabel?: React.ReactNode;
  /** A Badge (badge.md) after the label. Pass it Gray when disabled. */
  badge?: React.ReactNode;
  /** A line under the label; turns the label from regular to medium. */
  description?: React.ReactNode;
  /** A Link Button (link-button.md), Primary, Small, under the description. */
  link?: React.ReactNode;
  /** Puts the control on the right. */
  flip?: boolean;
};

/** The control and its words (checkbox.md, "Checkbox Label"): one line, or a
 *  title with a description and a link. Disabled greys the words. */
export function ChoiceLabel({
  htmlFor,
  control,
  disabled,
  label,
  sublabel,
  badge,
  description,
  link,
  flip,
  gaps,
  className,
}: ChoiceWords & {
  htmlFor: string;
  control: React.ReactNode;
  disabled?: boolean;
  /** Size token classes: control to words, the title row, title to description, words to link. */
  gaps: { row: string; title: string; text: string; link: string };
  className?: string;
}) {
  const strong = disabled ? "text-text-sub-600" : "text-text-strong-950";
  const quiet = disabled ? "text-text-soft-400" : "text-text-sub-600";
  const pointer = disabled ? "cursor-not-allowed" : "cursor-pointer";
  const titleRow = (type: string) => (
    <span className={cn("flex items-center", gaps.title)}>
      <span className={cn(type, strong)}>{label}</span>
      {sublabel != null && <span className={cn("text-paragraph-xs", quiet)}>{sublabel}</span>}
      {badge}
    </span>
  );
  const words =
    description == null ? (
      <label htmlFor={htmlFor} className={pointer}>
        {titleRow("text-paragraph-sm")}
      </label>
    ) : (
      <div className={cn("flex min-w-0 flex-col items-start", gaps.link)}>
        <label htmlFor={htmlFor} className={cn("flex flex-col", gaps.text, pointer)}>
          {titleRow("text-label-sm")}
          <span className={cn("text-paragraph-xs", quiet)}>{description}</span>
        </label>
        {link}
      </div>
    );
  return (
    <div className={cn("inline-flex items-start", gaps.row, className)}>
      {flip ? words : control}
      {flip ? control : words}
    </div>
  );
}

/* ---- The card you pick, shared with the Radio and the Switch ---- */

export type ChoiceCardType = "basic" | "left-icon" | "avatar" | "card-provider" | "brand" | "company";
export type ChoiceCardLook = "default" | "active" | "disabled";

/** Default rests with an edge and the card shadow, Hover fills (only from
 *  Default), Active is the primary/base edge, Disabled keeps the edge. */
const CARD_LOOK = {
  default: "cursor-pointer bg-bg-white-0 edge-stroke-soft-200 lift-card ds-hover:bg-bg-weak-50 ds-hover:edge-none ds-hover:lift-none",
  active: "cursor-pointer bg-bg-white-0 edge-primary-base",
  disabled: "cursor-not-allowed bg-bg-white-0 edge-stroke-soft-200",
} as const;

export type ChoiceCardContent = {
  type?: ChoiceCardType;
  /** The picture on the left: a Key Icon, an Avatar, or a brand, company or card logo. */
  picture?: React.ReactNode;
  title: React.ReactNode;
  sublabel?: React.ReactNode;
  /** A Badge (badge.md) after the title. Pass it Gray when disabled. */
  badge?: React.ReactNode;
  description?: React.ReactNode;
};

/** A card that holds a control (checkbox.md, "Checkbox Card"): the picture,
 *  the words, then the control on the right at the top. The whole card is
 *  the control's label, so a click anywhere picks it. */
export function ChoiceCard({
  htmlFor,
  control,
  look,
  type = "basic",
  picture,
  title,
  sublabel,
  badge,
  description,
  sizes,
  className,
  ...props
}: ChoiceCardContent &
  Omit<React.ComponentProps<"label">, "title" | "children"> & {
    htmlFor: string;
    control: React.ReactNode;
    look: ChoiceCardLook;
    /** Size token classes: the card, the 40 picture, the 32 x 24 logo, the title row, title to description. */
    sizes: { card: string; picture: string; logo: string; title: string; text: string };
  }) {
  const off = look === "disabled";
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "group/choice-card ds-shadow flex w-full items-start transition-[background-color,box-shadow] duration-150",
        sizes.card,
        CARD_LOOK[look],
        className,
      )}
      {...props}
    >
      {type !== "basic" && picture != null && (
        <span
          className={cn(
            // A logo passed as an <img> fills the space, as in the Content Label.
            "flex shrink-0 items-center justify-center [&>img]:size-full",
            type === "card-provider" ? cn("overflow-hidden", sizes.logo) : sizes.picture,
          )}
        >
          {picture}
        </span>
      )}
      <span className={cn("flex min-w-0 flex-1 flex-col", sizes.text)}>
        <span className={cn("flex items-center", sizes.title)}>
          <span className={cn("text-label-sm", off ? "text-text-sub-600" : "text-text-strong-950")}>{title}</span>
          {sublabel != null && <span className={cn("text-paragraph-xs", off ? "text-text-soft-400" : "text-text-sub-600")}>{sublabel}</span>}
          {badge}
        </span>
        {description != null && (
          <span className={cn("text-paragraph-xs", off ? "text-text-soft-400" : "text-text-sub-600")}>{description}</span>
        )}
      </span>
      {control}
    </label>
  );
}

/* ---- Checkbox Label and Checkbox Card ---- */

const LABEL_GAPS = {
  row: "gap-checkbox-label-gap",
  title: "gap-checkbox-label-title-gap",
  text: "gap-checkbox-label-text-gap",
  link: "gap-checkbox-label-link-gap",
};
const CARD_SIZES = {
  card: "gap-checkbox-card-gap rounded-checkbox-card p-checkbox-card-pad",
  picture: "size-checkbox-card-picture",
  logo: "h-checkbox-card-logo-h w-checkbox-card-logo-w rounded-checkbox-card-logo",
  title: "gap-checkbox-label-title-gap",
  text: "gap-checkbox-label-text-gap",
};

export type CheckboxLabelProps = Omit<CheckboxProps, "size"> & ChoiceWords;

/** The Medium box with its words. Props other than the words go to the box. */
export function CheckboxLabel({ label, sublabel, badge, description, link, flip, id, disabled, className, ...props }: CheckboxLabelProps) {
  const autoId = React.useId();
  const boxId = id ?? autoId;
  return (
    <ChoiceLabel
      htmlFor={boxId}
      control={<Checkbox id={boxId} disabled={disabled} {...props} />}
      disabled={disabled}
      label={label}
      sublabel={sublabel}
      badge={badge}
      description={description}
      link={link}
      flip={flip}
      gaps={LABEL_GAPS}
      className={className}
    />
  );
}

export type CheckboxCardProps = ChoiceCardContent & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  name?: string;
  value?: string;
  className?: string;
  /** Shows Hover on the Components page. */
  "data-force"?: "hover";
};

/** A card you pick, with the Medium box at its top right. Picked is Active. */
export function CheckboxCard({
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled,
  id,
  name,
  value,
  className,
  "data-force": force,
  ...content
}: CheckboxCardProps) {
  const autoId = React.useId();
  const boxId = id ?? autoId;
  const [on, setOn] = useControllableState(checked, defaultChecked, onCheckedChange);
  const look: ChoiceCardLook = disabled ? "disabled" : on ? "active" : "default";
  return (
    <ChoiceCard
      {...content}
      htmlFor={boxId}
      look={look}
      sizes={CARD_SIZES}
      data-force={force}
      className={className}
      control={
        <Checkbox
          id={boxId}
          name={name}
          value={value}
          checked={on}
          onCheckedChange={(next) => setOn(next === true)}
          disabled={disabled}
          // The card's hover is the box's hover too.
          className={look === "default" ? "group-ds-hover/choice-card:bg-bg-sub-300" : undefined}
        />
      }
    />
  );
}
