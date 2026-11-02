"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";

import { cn } from "@/lib/utils";
import { AddIcon, MinusIcon } from "@/components/ui/icons";

/**
 * The design system's Accordion, built from design-system/components/accordion.md
 * (Nitesh's Figma "Accordion [1.1]", node 210:4022), on Radix's accordion: a
 * title a person clicks to show or hide the words under it.
 *
 *   <Accordion type="single" collapsible>
 *     <AccordionItem value="billing" title="How does billing work?" icon={<InfoIcon />}>
 *       The words under it.
 *     </AccordionItem>
 *   </Accordion>
 *
 * Accordion      Radix's root (type single | multiple, value, onValueChange);
 *                its items sit 10 apart
 * AccordionItem  title; children is the description; icon, the left icon
 *                (off when left out); flip puts the plus or minus on the
 *                left, in place of the left icon; disabled
 *
 * States: Default (an edge and the card shadow), Hover (bg/weak-50, the plus
 * darker), Active (open, bg/weak-50 with or without the pointer). Ours (page,
 * Open): keyboard focus puts the Neutral focus ring around the whole
 * accordion, and Disabled is the Hover fill with the words and icons in
 * their disabled colours. data-force="hover" or "focus" on an item shows
 * that state on the Components page. Sizes are the tokens in
 * styles/sizes/accordion.css.
 */

export type AccordionProps = React.ComponentProps<typeof AccordionPrimitive.Root>;

export function Accordion({ className, ...props }: AccordionProps) {
  return <AccordionPrimitive.Root className={cn("flex flex-col gap-accordion-list-gap", className)} {...props} />;
}

export type AccordionItemProps = Omit<React.ComponentProps<typeof AccordionPrimitive.Item>, "title" | "children"> & {
  title: React.ReactNode;
  /** The left icon, 20 x 20. */
  icon?: React.ReactNode;
  /** The plus or minus on the left, in place of the left icon. */
  flip?: boolean;
  /** The description, shown when open. */
  children?: React.ReactNode;
  "data-force"?: "hover" | "focus";
};

const ICON = "inline-flex shrink-0 [&_svg]:size-accordion-icon";

export function AccordionItem({ title, icon, flip = false, disabled, className, children, ...props }: AccordionItemProps) {
  // The plus (closed) or minus (open): icon/soft-400 at rest, icon/sub-600
  // under the pointer and open. Disabled wins over both.
  const sign = (
    <span
      aria-hidden
      className={cn(
        ICON,
        "text-icon-soft-400 group-ds-hover/accordion:text-icon-sub-600 group-data-[state=open]/accordion:text-icon-sub-600",
        "group-data-disabled/accordion:text-icon-disabled-300!",
      )}
    >
      <AddIcon className="group-data-[state=open]/accordion:hidden" />
      <MinusIcon className="hidden group-data-[state=open]/accordion:block" />
    </span>
  );
  const hasDescription = children != null && children !== false;
  // Something on the left: the left icon, or the flipped plus.
  const leftSide = flip || icon != null;

  return (
    <AccordionPrimitive.Item
      disabled={disabled}
      className={cn(
        "group/accordion ds-shadow rounded-accordion bg-bg-white-0 edge-stroke-soft-200 lift-card transition-[background-color,box-shadow] duration-150",
        "ds-hover:bg-bg-weak-50 ds-hover:edge-none ds-hover:lift-none",
        "data-[state=open]:bg-bg-weak-50 data-[state=open]:edge-none data-[state=open]:lift-none",
        "data-disabled:bg-bg-weak-50 data-disabled:edge-none data-disabled:lift-none",
        // The title is the button; its keyboard focus rings the whole accordion.
        "has-focus-visible:ring-focus-neutral data-[force=focus]:ring-focus-neutral",
        className,
      )}
      {...props}
    >
      <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger
          className={cn(
            "flex w-full cursor-pointer items-start gap-accordion-gap p-accordion-pad text-start outline-none disabled:cursor-not-allowed",
            // Open, the description takes over below the title.
            hasDescription && "data-[state=open]:pb-0",
          )}
        >
          {flip
            ? sign
            : icon != null && (
                <span aria-hidden className={cn(ICON, "text-icon-sub-600 group-data-disabled/accordion:text-icon-disabled-300")}>
                  {icon}
                </span>
              )}
          {/* The words fill the space between the icons and wrap; the icons stay on the title's line. */}
          <span className="min-w-0 flex-1 text-label-sm text-text-strong-950 group-data-disabled/accordion:text-text-disabled-300">
            {title}
          </span>
          {!flip && sign}
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      {hasDescription && (
        <AccordionPrimitive.Content
          className={cn(
            "pt-accordion-words-gap pb-accordion-pad text-paragraph-sm text-text-sub-600",
            leftSide ? "ps-accordion-indent" : "ps-accordion-pad",
            flip ? "pe-accordion-pad" : "pe-accordion-indent",
          )}
        >
          {children}
        </AccordionPrimitive.Content>
      )}
    </AccordionPrimitive.Item>
  );
}
