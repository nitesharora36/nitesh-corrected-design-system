"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * The design system's Button Group, built from
 * design-system/components/button-group.md (Nitesh's Figma "Button Group
 * [1.1]", node 493:8644, and its items, node 226:4669).
 *
 * A row of 2 to 6 joined items that pick or act on one thing: a view switch,
 * a toolbar.
 *
 *   ButtonGroup      size  sm 36 | xs 32 | 2xs 24  (the Button's 2xs is 28)
 *   ButtonGroupItem  a word, a word with leadingIcon and/or trailingIcon, or
 *                    one icon alone (no children; needs an aria-label).
 *                    active marks the picked item (aria-pressed); leave it
 *                    out on a toolbar, where items only act.
 *
 * The group's 1px edge is drawn on top of the items, as the Figma stacks it,
 * so a hovered or disabled item never covers it and every item keeps its
 * exact size. The line between two items is each item's own left edge. The
 * end items take the group's corner instead of the group clipping them, so a
 * focus ring is never cut off. Sizes in styles/sizes/button-group.css.
 */
type ButtonGroupSize = "sm" | "xs" | "2xs";

const SizeContext = React.createContext<ButtonGroupSize>("sm");

const buttonGroupVariants = cva(
  [
    "relative isolate inline-flex bg-bg-white-0",
    // The group's edge, over the items.
    "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:ds-shadow after:edge-stroke-soft-200",
  ],
  {
    variants: {
      size: {
        sm: "h-button-group-sm rounded-button-group-sm",
        xs: "h-button-group-xs rounded-button-group-xs",
        "2xs": "h-button-group-2xs rounded-button-group-2xs",
      },
    },
    defaultVariants: { size: "sm" },
  },
);

const buttonGroupItemVariants = cva(
  [
    "ds-shadow relative inline-flex shrink-0 cursor-pointer items-center justify-center self-stretch whitespace-nowrap outline-none",
    "transition-[background-color,color,box-shadow] duration-150",
    "[&_svg]:shrink-0",
    "bg-bg-white-0 text-text-sub-600",
    // The line between two items.
    "not-first:[--ds-edge:var(--shadow-button-group-divider)]",
    // Hover keeps the words sub-600; only the fill changes.
    "ds-hover:bg-bg-weak-50",
    // Active, the picked item.
    "aria-pressed:bg-bg-weak-50 enabled:aria-pressed:text-text-strong-950",
    // Focus keeps the state's colours and adds the Neutral ring, over the neighbours.
    "ds-focus:z-10 ds-focus:ring-focus-neutral",
    // Disabled has no edge of its own: a line goes only when both items beside it are disabled.
    "disabled:cursor-not-allowed disabled:bg-bg-weak-50 disabled:text-text-disabled-300 disabled:[:disabled+&]:edge-none",
  ],
  {
    variants: {
      size: {
        sm: "gap-button-group-sm-gap text-label-sm first:rounded-l-button-group-sm last:rounded-r-button-group-sm [&_svg]:size-button-group-sm-icon",
        xs: "gap-button-group-xs-gap text-label-sm first:rounded-l-button-group-xs last:rounded-r-button-group-xs [&_svg]:size-button-group-xs-icon",
        "2xs": "gap-button-group-2xs-gap text-label-xs first:rounded-l-button-group-2xs last:rounded-r-button-group-2xs [&_svg]:size-button-group-2xs-icon",
      },
      content: { word: "", icons: "", iconOnly: "px-0" },
    },
    compoundVariants: [
      { size: "sm", content: "word", class: "px-button-group-sm-x" },
      { size: "sm", content: "icons", class: "px-button-group-sm-x-icon" },
      { size: "sm", content: "iconOnly", class: "w-button-group-sm" },
      { size: "xs", content: "word", class: "px-button-group-xs-x" },
      { size: "xs", content: "icons", class: "px-button-group-xs-x-icon" },
      { size: "xs", content: "iconOnly", class: "w-button-group-xs" },
      { size: "2xs", content: "word", class: "px-button-group-2xs-x" },
      { size: "2xs", content: "icons", class: "px-button-group-2xs-x-icon" },
      { size: "2xs", content: "iconOnly", class: "w-button-group-2xs" },
    ],
    defaultVariants: { size: "sm", content: "word" },
  },
);

export type ButtonGroupProps = React.ComponentProps<"div"> & VariantProps<typeof buttonGroupVariants>;

export function ButtonGroup({ size, className, children, ...props }: ButtonGroupProps) {
  const groupSize = size ?? "sm";
  return (
    <SizeContext.Provider value={groupSize}>
      <div role="group" className={cn(buttonGroupVariants({ size: groupSize }), className)} {...props}>
        {children}
      </div>
    </SizeContext.Provider>
  );
}

export type ButtonGroupItemProps = Omit<React.ComponentProps<"button">, "children"> & {
  children?: React.ReactNode;
  /** An icon before the word (or the only icon, with no children). */
  leadingIcon?: React.ReactNode;
  /** An icon after the word. */
  trailingIcon?: React.ReactNode;
  /** The picked item. Sets aria-pressed; leave it out where items only act. */
  active?: boolean;
};

export function ButtonGroupItem({
  leadingIcon,
  trailingIcon,
  active,
  children,
  className,
  type = "button",
  ...props
}: ButtonGroupItemProps) {
  const size = React.useContext(SizeContext);
  const iconOnly = children == null || children === false;
  const content = iconOnly ? "iconOnly" : leadingIcon || trailingIcon ? "icons" : "word";
  return (
    <button
      type={type}
      aria-pressed={active}
      className={cn(buttonGroupItemVariants({ size, content }), className)}
      {...props}
    >
      {leadingIcon}
      {!iconOnly && <span>{children}</span>}
      {trailingIcon}
    </button>
  );
}

export { buttonGroupVariants, buttonGroupItemVariants };
