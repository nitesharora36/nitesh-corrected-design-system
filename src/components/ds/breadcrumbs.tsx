import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { ChevronRightIcon } from "@/components/ui/icons";

/**
 * The design system's Breadcrumbs, built from design-system/components/breadcrumbs.md
 * (Nitesh's Figma "Breadcrumbs Group [1.1]", node 447:8832, and "Breadcrumb
 * Items [1.1]", node 447:8767).
 *
 *   <Breadcrumbs divider="arrow">
 *     <BreadcrumbItem href="/" icon={<HomeIcon />}>Home</BreadcrumbItem>
 *     <BreadcrumbItem current>Members</BreadcrumbItem>
 *   </Breadcrumbs>
 *
 *   divider  arrow (a right chevron) | slash | dot, drawn between every item
 *   icon     an icon before the word; with no word the item is icon-only and
 *            needs an aria-label
 *   current  the page you are on (the Figma's Active), the last item
 *
 * Sizes are the tokens in styles/sizes/breadcrumbs.css, states the ds-*
 * variants in styles/ds.css. Icons follow the word's colour: the page's icon
 * tokens are the same steps as its word tokens.
 */
export type BreadcrumbsProps = React.ComponentProps<"nav"> & {
  divider?: "arrow" | "slash" | "dot";
};

export function Breadcrumbs({ divider = "arrow", children, className, ...props }: BreadcrumbsProps) {
  const items = React.Children.toArray(children).filter(React.isValidElement);
  return (
    <nav aria-label="Breadcrumb" className={className} {...props}>
      {/* m-space-0, p-space-0 and list-none undo the app's base list styles. */}
      <ol className="m-space-0 flex h-breadcrumbs list-none items-center gap-breadcrumbs-gap p-space-0">
        {items.map((item, i) => (
          <React.Fragment key={item.key ?? i}>
            {i > 0 && <BreadcrumbDivider divider={divider} />}
            <li className="m-space-0 flex">{item}</li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
}

/** The mark between two items: an arrow icon, or a slash or dot in Label/Small. */
function BreadcrumbDivider({ divider }: { divider: NonNullable<BreadcrumbsProps["divider"]> }) {
  return (
    <li
      aria-hidden
      className={cn(
        "m-space-0 flex size-breadcrumbs-divider shrink-0 items-center justify-center",
        divider === "arrow" ? "text-icon-disabled-300 [&_svg]:size-breadcrumbs-divider" : "text-label-sm text-text-disabled-300",
      )}
    >
      {divider === "arrow" ? <ChevronRightIcon /> : divider === "slash" ? "/" : "•"}
    </li>
  );
}

const itemVariants = cva(
  [
    "ds-shadow inline-flex h-breadcrumbs shrink-0 items-center gap-breadcrumbs-item-gap whitespace-nowrap text-label-sm outline-none",
    "transition-[color,box-shadow] duration-150",
    "[&_svg]:size-breadcrumbs-icon [&_svg]:shrink-0",
    // The page proposes the Neutral focus ring, as on the Tag.
    "ds-focus:ring-focus-neutral",
  ],
  {
    variants: {
      current: {
        false: "text-text-sub-600 ds-hover:text-text-strong-950",
        true: "text-text-strong-950",
      },
    },
    defaultVariants: { current: false },
  },
);

export type BreadcrumbItemProps = React.ComponentProps<"a"> & {
  /** An icon before the word (or the only content). */
  icon?: React.ReactNode;
  /** The page you are on: the Figma's Active state. */
  current?: boolean;
};

/** One step of the trail: a link (with href) or plain words (without). */
export function BreadcrumbItem({ icon, current = false, href, children, className, ...props }: BreadcrumbItemProps) {
  const classes = cn(itemVariants({ current }), className);
  const content = (
    <>
      {icon}
      {children}
    </>
  );
  if (href) {
    return (
      <a href={href} aria-current={current ? "page" : undefined} className={classes} {...props}>
        {content}
      </a>
    );
  }
  return (
    <span aria-current={current ? "page" : undefined} className={classes} {...(props as React.ComponentProps<"span">)}>
      {content}
    </span>
  );
}
