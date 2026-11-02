"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { ChevronRightIcon } from "@/components/ui/icons";

/**
 * The design system's Tab Menu, built from design-system/components/tab-menu.md
 * (Nitesh's Figma "Tab Menu Horizontal [1.1]", node 3511:9958, and "Tab Menu
 * Vertical [1.1]", node 3516:10411). Radix Tabs underneath, so the arrow keys
 * move between tabs.
 *
 *   <TabMenu defaultValue="overview" orientation="horizontal">
 *     <TabMenuList aria-label="Project" end={compactButton}>
 *       <TabMenuTrigger value="overview" icon={<HomeIcon />} badge={badge} arrow>Overview</TabMenuTrigger>
 *     </TabMenuList>
 *     <TabMenuContent value="overview">...</TabMenuContent>
 *   </TabMenu>
 *
 *   orientation  horizontal (a bar across the top) | vertical (rows down the side)
 *   variant      vertical only: card (in a white card) | list (no container)
 *   slots        badge (a Badge), end (a Compact Button at the end of the
 *                horizontal bar), heading (a Content Divider, Text type, on
 *                top of the vertical rows)
 *
 * Sizes are the tokens in styles/sizes/tab-menu.css, states the ds-* variants
 * in styles/ds.css plus Radix's data-state="active".
 */
type Orientation = "horizontal" | "vertical";
const OrientationContext = React.createContext<Orientation>("horizontal");

export type TabMenuProps = React.ComponentProps<typeof TabsPrimitive.Root>;

export function TabMenu({ orientation = "horizontal", ...props }: TabMenuProps) {
  return (
    <OrientationContext.Provider value={orientation}>
      <TabsPrimitive.Root orientation={orientation} {...props} />
    </OrientationContext.Provider>
  );
}

export type TabMenuListProps = React.ComponentProps<typeof TabsPrimitive.List> & {
  /** Vertical only: card (padding, a white card with an edge and a shadow) or list (no container). */
  variant?: "card" | "list";
  /** Vertical only: a Content Divider, Text type, on top of the rows. */
  heading?: React.ReactNode;
  /** Horizontal only: a Compact Button at the right end of the bar. */
  end?: React.ReactNode;
};

/** The tabs' container. className goes on the bar (horizontal) or the card (vertical). */
export function TabMenuList({ variant = "card", heading, end, className, ...props }: TabMenuListProps) {
  const orientation = React.useContext(OrientationContext);

  if (orientation === "vertical") {
    return (
      <div
        className={cn(
          "flex flex-col gap-tab-menu-rows-gap",
          variant === "card" && "ds-shadow edge-stroke-soft-200 lift-card rounded-tab-menu-card bg-bg-white-0 p-tab-menu-card-pad",
          className,
        )}
      >
        {heading}
        <TabsPrimitive.List className="flex flex-col gap-tab-menu-rows-gap" {...props} />
      </div>
    );
  }

  return (
    // The bar's two lines are drawn inside it (--shadow-tab-menu-bar), so the
    // bar stays 48 with its 14 padding, and the tabs are the 20 between.
    <div
      className={cn(
        "ds-shadow [--ds-edge:var(--shadow-tab-menu-bar)] flex h-tab-menu-bar w-full items-stretch gap-tab-menu-bar-gap bg-bg-white-0 py-tab-menu-bar-y",
        className,
      )}
    >
      <TabsPrimitive.List className="flex items-stretch gap-tab-menu-bar-gap" {...props} />
      {end != null && <div className="ml-auto flex items-center">{end}</div>}
    </div>
  );
}

const triggerVariants = cva(
  [
    "group/tab ds-shadow relative flex shrink-0 cursor-pointer items-center gap-tab-menu-tab-gap whitespace-nowrap text-left text-label-sm outline-none",
    "transition-[background-color,color,box-shadow] duration-150",
    "text-text-sub-600 ds-hover:text-text-strong-950 data-[state=active]:text-text-strong-950",
    // The page proposes the Neutral focus ring, as on the Tag.
    "ds-focus:ring-focus-neutral",
    "disabled:cursor-not-allowed",
  ],
  {
    variants: {
      orientation: {
        // The active line: 2px of primary/base, the tab's width, on the bar's
        // bottom line (the bar's padding below the tab).
        horizontal: [
          "after:pointer-events-none after:absolute after:inset-x-0 after:-bottom-tab-menu-bar-y after:h-tab-menu-active-line",
          "data-[state=active]:after:bg-primary-base",
        ],
        // A row; no line (the page's one change to the Figma).
        vertical: [
          "h-tab-menu-row w-full rounded-tab-menu-row bg-bg-white-0 p-tab-menu-row-pad",
          "ds-hover:bg-bg-weak-50 data-[state=active]:bg-bg-weak-50",
        ],
      },
    },
    defaultVariants: { orientation: "horizontal" },
  },
);

export type TabMenuTriggerProps = React.ComponentProps<typeof TabsPrimitive.Trigger> & {
  /** A 20 x 20 icon before the word: icon/sub-600, primary/base when active. */
  icon?: React.ReactNode;
  /** A Badge after the word. */
  badge?: React.ReactNode;
  /** The arrow at the end: an 18 x 18 chevron in a 20 x 20 white circle. */
  arrow?: boolean;
};

export function TabMenuTrigger({ icon, badge, arrow = false, children, className, ...props }: TabMenuTriggerProps) {
  const orientation = React.useContext(OrientationContext);
  return (
    <TabsPrimitive.Trigger className={cn(triggerVariants({ orientation }), className)} {...props}>
      {icon != null && (
        <span className="flex shrink-0 text-icon-sub-600 group-data-[state=active]/tab:text-primary-base [&_svg]:size-tab-menu-icon">
          {icon}
        </span>
      )}
      {children != null && <span className={cn(orientation === "vertical" && "min-w-0 flex-1 truncate")}>{children}</span>}
      {badge}
      {arrow && (
        <span
          aria-hidden
          className="flex size-tab-menu-arrow shrink-0 items-center justify-center rounded-tab-menu-arrow bg-bg-white-0 p-tab-menu-arrow-pad text-icon-sub-600 [&_svg]:size-tab-menu-arrow-icon"
        >
          <ChevronRightIcon />
        </span>
      )}
    </TabsPrimitive.Trigger>
  );
}

/** The panel a tab shows. Unstyled: the page gives it no look. */
export const TabMenuContent = TabsPrimitive.Content;
