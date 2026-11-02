"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cva } from "class-variance-authority";

import { ChoiceCard, ChoiceLabel, useControllableState, type ChoiceCardContent, type ChoiceCardLook } from "@/components/ds/checkbox";
import { cn } from "@/lib/utils";

/**
 * The design system's Radio, built from design-system/components/radio.md
 * (Nitesh's Figma "Radio [1.1]" 515:4242, "Radio Label [1.1]" 515:4282 and
 * "Radio Card [1.1]" 515:4347), on Radix's radio group. The Checkbox's twin:
 * the same label, card and states; only the button differs.
 *
 * RadioGroup  holds the radios: value, defaultValue, onValueChange, disabled
 * Radio       the round button, one size. value; disabled
 * RadioLabel  the button with its words: label, sublabel, badge (a slot),
 *             description, link (a slot); flip puts the button on the right
 * RadioCard   a card you pick: type basic | left-icon | avatar |
 *             card-provider | brand | company, its picture in `picture`
 *
 * Focus is shown by the button itself (a blue edge, or a darker fill), never
 * a ring. data-force="hover" or "focus" on a radio, or "hover" on a card,
 * shows that state on the Components page. Sizes are the tokens in
 * styles/sizes/radio.css.
 */

const RadioGroupContext = React.createContext<{ value: string; disabled: boolean }>({ value: "", disabled: false });

export type RadioGroupProps = Omit<React.ComponentProps<typeof RadioGroupPrimitive.Root>, "value" | "defaultValue" | "onValueChange"> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

export function RadioGroup({ value, defaultValue = "", onValueChange, disabled, ...props }: RadioGroupProps) {
  const [current, setCurrent] = useControllableState(value, defaultValue, onValueChange);
  return (
    <RadioGroupContext.Provider value={{ value: current, disabled: !!disabled }}>
      <RadioGroupPrimitive.Root value={current} onValueChange={setCurrent} disabled={disabled} {...props} />
    </RadioGroupContext.Provider>
  );
}

const radioVariants = cva(
  "group/radio inline-flex shrink-0 items-center justify-center m-radio-inset size-radio-circle rounded-radio-circle outline-none transition-colors duration-150",
  {
    variants: {
      disabled: {
        false: [
          "cursor-pointer",
          // Off: the circle is the edge's colour; the white face sits on it.
          "data-[state=unchecked]:bg-bg-soft-200 data-[state=unchecked]:ds-hover:bg-bg-sub-300 data-[state=unchecked]:ds-focus:bg-primary-base",
          // On: filled, with the dot.
          "data-[state=checked]:bg-primary-base data-[state=checked]:ds-hover:bg-primary-dark data-[state=checked]:ds-focus:bg-primary-darkest",
        ],
        // Off: the edge only, no face. On: a grey fill, the dot still bg/white-0.
        true: "cursor-not-allowed bg-bg-soft-200",
      },
    },
    defaultVariants: { disabled: false },
  },
);

export type RadioProps = Omit<React.ComponentProps<typeof RadioGroupPrimitive.Item>, "children">;

export function Radio({ disabled, className, ...props }: RadioProps) {
  const group = React.useContext(RadioGroupContext);
  const off = !!(disabled || group.disabled);
  return (
    <RadioGroupPrimitive.Item disabled={disabled} className={cn(radioVariants({ disabled: off }), className)} {...props}>
      {!off && (
        <span
          aria-hidden
          className="ds-shadow [--ds-lift:var(--shadow-radio-face)] size-radio-face rounded-radio-circle bg-bg-white-0 group-data-[state=checked]/radio:hidden"
        />
      )}
      {/* The dot is bg/white-0, not static/white: dark grey on the blue in dark. */}
      <RadioGroupPrimitive.Indicator className="size-radio-dot rounded-radio-circle bg-bg-white-0" />
    </RadioGroupPrimitive.Item>
  );
}

const LABEL_GAPS = {
  row: "gap-radio-label-gap",
  title: "gap-radio-label-title-gap",
  text: "gap-radio-label-text-gap",
  link: "gap-radio-label-link-gap",
};
const CARD_SIZES = {
  card: "gap-radio-card-gap rounded-radio-card p-radio-card-pad",
  picture: "size-radio-card-picture",
  logo: "h-radio-card-logo-h w-radio-card-logo-w rounded-radio-card-logo",
  title: "gap-radio-label-title-gap",
  text: "gap-radio-label-text-gap",
};

export type RadioLabelProps = RadioProps & {
  label: React.ReactNode;
  sublabel?: React.ReactNode;
  badge?: React.ReactNode;
  description?: React.ReactNode;
  link?: React.ReactNode;
  flip?: boolean;
};

/** The radio with its words. Props other than the words go to the radio. */
export function RadioLabel({ label, sublabel, badge, description, link, flip, id, disabled, className, ...props }: RadioLabelProps) {
  const group = React.useContext(RadioGroupContext);
  const autoId = React.useId();
  const radioId = id ?? autoId;
  return (
    <ChoiceLabel
      htmlFor={radioId}
      control={<Radio id={radioId} disabled={disabled} {...props} />}
      disabled={disabled || group.disabled}
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

export type RadioCardProps = ChoiceCardContent & {
  value: string;
  disabled?: boolean;
  id?: string;
  className?: string;
  /** Shows Hover on the Components page. */
  "data-force"?: "hover";
};

/** A card you pick, with the radio at its top right. Picked is Active. */
export function RadioCard({ value, disabled, id, className, "data-force": force, ...content }: RadioCardProps) {
  const group = React.useContext(RadioGroupContext);
  const autoId = React.useId();
  const radioId = id ?? autoId;
  const look: ChoiceCardLook = disabled || group.disabled ? "disabled" : group.value === value ? "active" : "default";
  return (
    <ChoiceCard
      {...content}
      htmlFor={radioId}
      look={look}
      sizes={CARD_SIZES}
      data-force={force}
      className={className}
      control={
        <Radio
          id={radioId}
          value={value}
          disabled={disabled}
          // The card's hover is the radio's hover too.
          className={look === "default" ? "group-ds-hover/choice-card:bg-bg-sub-300" : undefined}
        />
      }
    />
  );
}
