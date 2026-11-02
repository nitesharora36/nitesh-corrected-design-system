"use client";

import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ds/button";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@/components/ui/icons";

/**
 * The design system's Pagination, built from design-system/components/pagination.md
 * (Nitesh's Figma "Pagination Group [1.1]", node 513:3892, and "Pagination
 * Cells [1.1]", node 513:3681).
 *
 *   <Pagination variant="basic" defaultPage={2} pageCount={16} perPage={select} />
 *
 *   variant    the Figma's Type: basic (square cells) | full-radius (round
 *              cells) | group (one bar, like the Button Group)
 *   page       the current page, from 1 (or defaultPage, uncontrolled)
 *   summary    "Page 2 of 16" on the left; on unless false
 *   perPage    a slot on the right for the per-page Select (X-Small, 32),
 *              built after the Select page
 *
 * The row: the summary, First, Previous, the page cells, Next, Last, then
 * per page. First, Previous, Next and Last are the Button (Neutral, Ghost,
 * X-Small, icon only); in the Group type they are cells of the bar. Sizes are
 * the tokens in styles/sizes/pagination.css, states the ds-* variants in
 * styles/ds.css. Icons in cells follow the number's colour, the same steps.
 */
type Variant = "basic" | "full-radius" | "group";

const cellVariants = cva(
  [
    "ds-shadow inline-flex h-pagination-cell min-w-pagination-cell shrink-0 items-center justify-center whitespace-nowrap p-pagination-cell-pad text-label-sm outline-none",
    "transition-[background-color,color,box-shadow] duration-150",
    "[&_svg]:size-pagination-icon [&_svg]:shrink-0",
    "edge-stroke-soft-200",
  ],
  {
    variants: {
      variant: {
        basic: "rounded-pagination-cell",
        "full-radius": "rounded-pagination-cell-round",
        // Joined: each cell overlaps the one before by its edge, so the two
        // edges read as one 1px divider; the ends take the bar's corner.
        group: [
          "-ml-pagination-group-line first:ml-space-0 first:rounded-l-pagination-group last:rounded-r-pagination-group",
          "ds-focus:z-10",
        ],
      },
      // Selected, the current page: the page's proposal, the Hover grey fill
      // and the strong number, so it stands out.
      selected: {
        true: "bg-bg-weak-50 text-text-strong-950",
        false: "bg-bg-white-0 text-text-sub-600",
      },
      interactive: {
        true: [
          "cursor-pointer ds-focus:ring-focus-neutral",
          "disabled:cursor-not-allowed disabled:bg-bg-white-0 disabled:text-text-disabled-300",
        ],
        false: "cursor-default",
      },
    },
    compoundVariants: [
      // Hover: the grey fill. Separate cells also drop their edge; in the
      // Group the edges are the bar's dividers, so they stay (as in the
      // Button Group).
      { selected: false, interactive: true, class: "ds-hover:bg-bg-weak-50" },
      { selected: false, interactive: true, variant: "basic", class: "ds-hover:edge-none" },
      { selected: false, interactive: true, variant: "full-radius", class: "ds-hover:edge-none" },
    ],
    defaultVariants: { variant: "basic", selected: false, interactive: true },
  },
);

export type PaginationCellProps = React.ComponentProps<"button"> & {
  variant?: Variant;
  /** The current page. */
  selected?: boolean;
};

/** One page cell (a number, or an arrow in the Group type). */
export function PaginationCell({ variant = "basic", selected = false, className, type = "button", ...props }: PaginationCellProps) {
  return (
    <button
      type={type}
      aria-current={selected ? "page" : undefined}
      className={cn(cellVariants({ variant, selected, interactive: true }), className)}
      {...props}
    />
  );
}

/** The "..." cell where pages are skipped. Not a control. */
export function PaginationGap({ variant = "basic", className }: { variant?: Variant; className?: string }) {
  return (
    <span aria-hidden className={cn(cellVariants({ variant, selected: false, interactive: false }), className)}>
      ...
    </span>
  );
}

/** The pages to show: all of them up to 7, else the first, the last and the
 *  current one with one each side, a gap where pages are skipped. Always 7
 *  cells, so the row does not jump. */
export function pageList(page: number, count: number): (number | "gap")[] {
  const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);
  if (count <= 7) return range(1, count);
  if (page <= 4) return [...range(1, 5), "gap", count];
  if (page >= count - 3) return [1, "gap", ...range(count - 4, count)];
  return [1, "gap", page - 1, page, page + 1, "gap", count];
}

export type PaginationProps = Omit<React.ComponentProps<"nav">, "onChange"> & {
  variant?: Variant;
  /** The current page, from 1. Leave it out and use defaultPage to let the control keep it. */
  page?: number;
  defaultPage?: number;
  pageCount: number;
  onPageChange?: (page: number) => void;
  /** "Page 2 of 16" on the left. */
  summary?: boolean;
  /** The per-page picker on the right: the Select, X-Small (32). */
  perPage?: React.ReactNode;
};

export function Pagination({
  variant = "basic",
  page: pageProp,
  defaultPage = 1,
  pageCount,
  onPageChange,
  summary = true,
  perPage,
  className,
  ...props
}: PaginationProps) {
  const [ownPage, setOwnPage] = React.useState(defaultPage);
  const page = Math.min(Math.max(pageProp ?? ownPage, 1), Math.max(pageCount, 1));
  const go = (next: number) => {
    if (next < 1 || next > pageCount || next === page) return;
    if (pageProp === undefined) setOwnPage(next);
    onPageChange?.(next);
  };

  const arrows = [
    { label: "First page", icon: <ChevronDoubleLeftIcon />, to: 1, off: page <= 1 },
    { label: "Previous page", icon: <ChevronLeftIcon />, to: page - 1, off: page <= 1 },
    { label: "Next page", icon: <ChevronRightIcon />, to: page + 1, off: page >= pageCount },
    { label: "Last page", icon: <ChevronDoubleRightIcon />, to: pageCount, off: page >= pageCount },
  ];
  const arrow = (a: (typeof arrows)[number]) =>
    variant === "group" ? (
      <PaginationCell key={a.label} variant="group" aria-label={a.label} disabled={a.off} onClick={() => go(a.to)}>
        {a.icon}
      </PaginationCell>
    ) : (
      <Button
        key={a.label}
        tone="neutral"
        variant="ghost"
        size="xs"
        leadingIcon={a.icon}
        aria-label={a.label}
        disabled={a.off}
        onClick={() => go(a.to)}
      />
    );

  return (
    <nav aria-label="Pagination" className={cn("flex h-pagination items-center gap-pagination-parts-gap", className)} {...props}>
      {summary && (
        <span className="whitespace-nowrap text-paragraph-sm text-text-sub-600">
          Page {page} of {pageCount}
        </span>
      )}
      <div className={cn("flex items-center", variant !== "group" && "gap-pagination-gap")}>
        {arrows.slice(0, 2).map(arrow)}
        {pageList(page, pageCount).map((p, i) =>
          p === "gap" ? (
            <PaginationGap key={`gap-${i}`} variant={variant} />
          ) : (
            <PaginationCell key={p} variant={variant} selected={p === page} aria-label={`Page ${p}`} onClick={() => go(p)}>
              {p}
            </PaginationCell>
          ),
        )}
        {arrows.slice(2).map(arrow)}
      </div>
      {perPage}
    </nav>
  );
}
