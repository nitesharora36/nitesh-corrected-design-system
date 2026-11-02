"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cva } from "class-variance-authority";

import { Button } from "@/components/ds/button";
import { ChoiceCard, ChoiceLabel, useControllableState, type ChoiceCardContent, type ChoiceCardLook } from "@/components/ds/checkbox";
import { cn } from "@/lib/utils";

/**
 * The design system's Switch, built from design-system/components/switch.md
 * (Nitesh's Figma "Switch [1.1]" 385:4086, "Switch Label [1.1]" 385:4580,
 * "Switch Card [1.1]" 385:4733 and "Integration Switch [1.1]" 3678:14609),
 * on Radix's switch. A setting that takes effect at once.
 *
 * Switch             the switch, one size. checked, defaultChecked,
 *                    onCheckedChange, disabled
 * SwitchLabel        the switch with its words (the Checkbox Label's)
 * SwitchCard         a card with the switch at its top right (the Checkbox Card's)
 * IntegrationSwitch  an app you turn on: direction horizontal | vertical,
 *                    variant card | list, logo, title, badge (a slot),
 *                    description, an optional button (action), the switch
 *
 * States: Default, Hover, Pressed (the knob shrinks), Disabled, and keyboard
 * focus, the Primary focus ring around the track (ours, switch.md).
 * data-force="hover", "active" (Pressed) or "focus" on a switch, or "hover"
 * on a card, shows that state on the Components page. Sizes are the tokens
 * in styles/sizes/switch.css.
 */

const trackVariants = cva(
  "group/switch ds-shadow inline-flex shrink-0 items-center m-switch-inset h-switch-track-h w-switch-track-w rounded-switch-track p-switch-knob-inset outline-none transition-[background-color,box-shadow] duration-150 ds-focus:ring-focus-primary",
  {
    variants: {
      disabled: {
        false: [
          "cursor-pointer",
          "data-[state=unchecked]:bg-bg-soft-200 data-[state=unchecked]:ds-hover:bg-bg-sub-300 data-[state=unchecked]:ds-active:bg-bg-soft-200",
          "data-[state=checked]:bg-primary-base data-[state=checked]:ds-hover:bg-primary-dark data-[state=checked]:ds-active:bg-primary-base",
        ],
        // The same On and Off, apart from where the knob sits.
        true: "cursor-not-allowed bg-bg-white-0 edge-stroke-soft-200",
      },
    },
    defaultVariants: { disabled: false },
  },
);

export type SwitchProps = Omit<React.ComponentProps<typeof SwitchPrimitive.Root>, "children">;

export function Switch({ disabled, className, ...props }: SwitchProps) {
  return (
    <SwitchPrimitive.Root disabled={disabled} className={cn(trackVariants({ disabled: !!disabled }), className)} {...props}>
      {/* A 12 x 12 seat that slides; the knob sits centred in it, so when it
          shrinks to 10 it stays centred where it was. */}
      <SwitchPrimitive.Thumb className="flex size-switch-knob shrink-0 items-center justify-center transition-transform duration-150 data-[state=checked]:translate-x-switch-knob-travel">
        <span
          className={cn(
            "rounded-switch-knob transition-[width,height] duration-150",
            disabled
              ? "size-switch-knob-small bg-bg-soft-200"
              : "ds-shadow [--ds-lift:var(--shadow-switch-knob)] size-switch-knob bg-static-white group-ds-active/switch:size-switch-knob-small",
          )}
        />
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );
}

const LABEL_GAPS = {
  row: "gap-switch-label-gap",
  title: "gap-switch-label-title-gap",
  text: "gap-switch-label-text-gap",
  link: "gap-switch-label-link-gap",
};
const CARD_SIZES = {
  card: "gap-switch-card-gap rounded-switch-card p-switch-card-pad",
  picture: "size-switch-card-picture",
  logo: "h-switch-card-logo-h w-switch-card-logo-w rounded-switch-card-logo",
  title: "gap-switch-label-title-gap",
  text: "gap-switch-label-text-gap",
};

export type SwitchLabelProps = SwitchProps & {
  label: React.ReactNode;
  sublabel?: React.ReactNode;
  badge?: React.ReactNode;
  description?: React.ReactNode;
  link?: React.ReactNode;
  flip?: boolean;
};

/** The switch with its words. Props other than the words go to the switch. */
export function SwitchLabel({ label, sublabel, badge, description, link, flip, id, disabled, className, ...props }: SwitchLabelProps) {
  const autoId = React.useId();
  const switchId = id ?? autoId;
  return (
    <ChoiceLabel
      htmlFor={switchId}
      control={<Switch id={switchId} disabled={disabled} {...props} />}
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

export type SwitchCardProps = ChoiceCardContent & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  name?: string;
  className?: string;
  /** Shows Hover on the Components page. */
  "data-force"?: "hover";
};

/** A card with the switch at its top right. On is Active. */
export function SwitchCard({
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled,
  id,
  name,
  className,
  "data-force": force,
  ...content
}: SwitchCardProps) {
  const autoId = React.useId();
  const switchId = id ?? autoId;
  const [on, setOn] = useControllableState(checked, defaultChecked, onCheckedChange);
  const look: ChoiceCardLook = disabled ? "disabled" : on ? "active" : "default";
  return (
    <ChoiceCard
      {...content}
      htmlFor={switchId}
      look={look}
      sizes={CARD_SIZES}
      data-force={force}
      className={className}
      control={
        <Switch
          id={switchId}
          name={name}
          checked={on}
          onCheckedChange={setOn}
          disabled={disabled}
          // The card's hover is the switch's hover too.
          className={look === "default" ? "group-ds-hover/choice-card:bg-bg-sub-300" : undefined}
        />
      }
    />
  );
}

export type IntegrationSwitchProps = {
  /** horizontal: one row, centred. vertical: stacked, the button full width. */
  direction?: "horizontal" | "vertical";
  /** card: in a card. list: a plain row in a list, no fill, edge or shadow. */
  variant?: "card" | "list";
  /** The app's logo: 24 in a 40 circle (card), 32 in a 48 circle (list). */
  logo: React.ReactNode;
  title: React.ReactNode;
  /** A Badge (badge.md), 4 after the title. */
  badge?: React.ReactNode;
  description?: React.ReactNode;
  /** The button's word: a Neutral Stroke Small Button. None if unset. */
  action?: React.ReactNode;
  onAction?: () => void;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  name?: string;
  className?: string;
};

export function IntegrationSwitch({
  direction = "horizontal",
  variant = "card",
  logo,
  title,
  badge,
  description,
  action,
  onAction,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  id,
  name,
  className,
}: IntegrationSwitchProps) {
  const autoId = React.useId();
  const titleId = `${id ?? autoId}-title`;
  const descriptionId = `${id ?? autoId}-description`;
  const card = variant === "card";
  const vertical = direction === "vertical";
  return (
    <div
      className={cn(
        "flex gap-switch-integration-gap",
        vertical ? "flex-col" : "items-center",
        card && "ds-shadow rounded-switch-integration bg-bg-white-0 edge-stroke-soft-200 lift-card p-switch-integration-pad",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "ds-shadow flex shrink-0 items-center justify-center rounded-switch-integration-circle bg-bg-white-0 edge-stroke-soft-200 lift-card p-switch-integration-logo-pad",
          card
            ? "size-switch-integration-card-circle [&>*]:size-switch-integration-card-logo"
            : "size-switch-integration-list-circle [&>*]:size-switch-integration-list-logo",
          vertical && "self-start",
        )}
      >
        {logo}
      </span>
      <span className={cn("flex min-w-0 flex-col gap-switch-integration-text-gap", vertical ? "self-stretch" : "flex-1")}>
        <span className="flex items-center gap-switch-integration-title-gap">
          <span id={titleId} className={cn(card ? "text-label-sm" : "text-label-md", "text-text-strong-950")}>
            {title}
          </span>
          {badge}
        </span>
        {description != null && (
          <span id={descriptionId} className={cn(card ? "text-paragraph-xs" : "text-paragraph-sm", "text-text-sub-600")}>
            {description}
          </span>
        )}
      </span>
      {action != null && (
        <Button tone="neutral" variant="stroke" size="sm" onClick={onAction} disabled={disabled} className={vertical ? "w-full" : undefined}>
          {action}
        </Button>
      )}
      <span className={cn("flex shrink-0", vertical && "self-start")}>
        <Switch
          id={id}
          name={name}
          checked={checked}
          defaultChecked={defaultChecked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          aria-labelledby={titleId}
          aria-describedby={description != null ? descriptionId : undefined}
        />
      </span>
    </div>
  );
}
