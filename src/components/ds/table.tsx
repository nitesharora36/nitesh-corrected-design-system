"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { CompactButton } from "@/components/ds/compact-button";
import { ContentDivider } from "@/components/ds/content-divider";
import { ScrollArea } from "@/components/ds/scroll";
import { ChevronDownIcon, ChevronRightIcon, ChevronUpIcon, CloseIcon, SortIcon } from "@/components/ui/icons";

/**
 * The design system's Table, built from design-system/components/table.md:
 * Nitesh's Figma Table page 553:14955 ("Table Header Cell [1.1]", "Table Row
 * Cell [1.1]", "Sorting Icons [1.1]", the Blocks' "Horizontal Filter
 * [1.1]"), and what he decided on 23 Oct 2026 ("The table family"): the box
 * and the header of his Projects reference, and the working parts of the
 * grouped table he picked. Every list of records with columns is this. A CSS
 * grid, so a header cell and the cells under it share their column's width.
 *
 *   <HorizontalFilter views={...} searchShortcut="⌘1" ... />   the bar above (filter.md), 16 over the table
 *   <Table size="xl" columns={["fill", "fill", "status-badge", "button"]} overlay={<TableBulkBar ... />}>
 *     <TableHeader>
 *       <TableHeaderCell checkbox={<Checkbox />} sort="default" onSort={...} onWidthChange={...}>Name</TableHeaderCell>
 *       ...
 *       <TableHeaderCell />                         (Empty, over the buttons)
 *     </TableHeader>
 *     <TableBody>
 *       <TableGroupRow label="Hyderabad DC2" count={5} open onToggle={...} />
 *       <TableRow selected={...}>
 *         <TableTextCell priority="leading" control={<Checkbox />} picture={<TableLogo>...</TableLogo>} title="..." description="..." />
 *         <TableCell><StatusBadge status="completed" variant="stroke" mark="icon" /></TableCell>
 *         <TableNumberCell tone="positive">+₹1,800</TableNumberCell>
 *         <TableCell align="center">...</TableCell>
 *       </TableRow>
 *     </TableBody>
 *     <TableFooter><TableCell>20 alerts</TableCell>...<TableNumberCell>-₹9,320</TableNumberCell></TableFooter>
 *   </Table>
 *
 * Table            size xl (two lines, 64 rows) | lg (one line, 48) | grid
 *                  (the Excel kind: 40 rows on lines). columns: "fill"
 *                  (shares the free width), a cell type with its Figma width
 *                  (button 64, button-group 96, toggle 64, rating 132,
 *                  progress-bar 196, status-badge 120, badge-group 178,
 *                  avatar-group 156; ours: index 48, number 96) or any CSS track. framed (on):
 *                  the box, everything 4 inside its edge; off: the Figma's
 *                  bare table, for a table inside a card. overlay: the bulk
 *                  bar. A height (className) makes the rows scroll under the
 *                  pinned header; too narrow and it scrolls sideways.
 *                  tabIndex and onKeyDown: moving through the rows by keys
 * TableHeader      the 36 grey bar, corner 8, pinned while the rows scroll
 * TableHeaderCell  the word; checkbox (a slot); sort default | up | down with
 *                  onSort (the arrows show on hover and on the sorted
 *                  column); onWidthChange(width | null): a handle on its edge to
 *                  drag, a double click resets; align; disabled; sticky. No
 *                  children: the Empty cell
 * TableBody        the rows, the Content Divider's Line Spacing between them
 *                  (a grid's rows sit on their lines instead)
 * TableGroupRow    a group's row: fold chevron, name, count, a summary, and
 *                  a total under one column (aggregateAt); pinned under the
 *                  header while its rows scroll
 * TableRow         hover greys every cell together; selected tints it
 *                  primary/alpha-10; active: the keyboard's row (the focus
 *                  ring while the table has keyboard focus); onClick: a row
 *                  that opens something
 * TableTextCell    priority leading | regular | passive; control; picture;
 *                  title; description (two-line rows only)
 * TableNumberCell  right aligned, tabular figures; tone default | positive |
 *                  negative | passive
 * TableCell        any other cell; align left | center | right; in a grid,
 *                  selected (the picked cell's ring)
 * TableCellInput   a grid cell being edited
 * TableIndexCell   a grid's row number
 * TableLogo        a brand or company logo in a 40 or 32 circle
 * TableMessage     loading (three quiet rows) | empty | error, across the table
 * TableFooter      a row pinned under the rows: counts and totals, in cells
 * TableBulkBar     picked rows: "3 picked", their actions, clear
 * useTablePicks    picking rows: one, a Shift range, all, a set's state
 * useTableGrid     a grid's picked cell: arrows, Tab, Enter or typing edits, Escape
 *
 * Sizes are the tokens in styles/sizes/table.css.
 */

export type TableSize = "xl" | "lg" | "grid";
type TableContext = { size: TableSize; framed: boolean; footer?: boolean };
const TableCtx = React.createContext<TableContext>({ size: "xl", framed: true });
const useTable = () => React.useContext(TableCtx);

const CELL_HEIGHT: Record<TableSize, string> = { xl: "h-table-row-xl", lg: "h-table-row-lg", grid: "h-table-row-grid" };
/** A grid's cells sit on lines: one under each, one before each but the first. */
const GRID_CELL = "border-b border-stroke-soft-200 not-first:border-l px-table-grid-x";

export type TableColumn =
  | "fill"
  | "button"
  | "button-group"
  | "toggle"
  | "rating"
  | "progress-bar"
  | "status-badge"
  | "badge-group"
  | "avatar-group"
  | "index"
  | "number"
  | (string & {});

const COLUMN: Record<string, string> = {
  fill: "minmax(var(--table-col-fill-min), 1fr)",
  button: "var(--table-col-button)",
  "button-group": "var(--table-col-button-group)",
  toggle: "var(--table-col-toggle)",
  rating: "var(--table-col-rating)",
  "progress-bar": "var(--table-col-progress-bar)",
  "status-badge": "var(--table-col-status-badge)",
  "badge-group": "var(--table-col-badge-group)",
  "avatar-group": "var(--table-col-avatar-group)",
  index: "var(--table-col-index)",
  number: "var(--table-col-number)",
};

// ---- The table ----

export type TableProps = Omit<React.ComponentProps<"div">, "children"> & {
  columns: TableColumn[];
  size?: TableSize;
  /** The box around the table (on). Off: the Figma's bare table, for inside a card. */
  framed?: boolean;
  /** Floats over the box's foot: the bulk bar. */
  overlay?: React.ReactNode;
  children: React.ReactNode;
};

/** className goes on the outside (the box): a height there makes the rows
 *  scroll under the header. Other props go on the table itself. */
export function Table({ columns, size = "xl", framed = true, overlay, className, style, children, ...props }: TableProps) {
  const template = columns.map((c) => COLUMN[c] ?? c).join(" ");
  return (
    <TableCtx.Provider value={{ size, framed }}>
      <div
        className={cn(
          "relative flex min-h-0 flex-col",
          // The box, from the Projects reference: white, the hairline edge,
          // corner 12, the header bar 4 inside it so the corners nest.
          framed && "ds-shadow edge-stroke-soft-200 rounded-table-frame bg-bg-white-0 p-table-frame-pad",
          className,
        )}
      >
        <ScrollArea orientation="both" className="w-full flex-1">
          <div
            role={size === "grid" ? "grid" : "table"}
            className="group/table grid w-full outline-none"
            style={{ gridTemplateColumns: template, ...style }}
            {...props}
          >
            {children}
          </div>
        </ScrollArea>
        {overlay}
      </div>
    </TableCtx.Provider>
  );
}

/** Keeps a cell in view when the table scrolls sideways; its fill follows its row's. */
const STICKY = "sticky left-0 z-10 bg-inherit";

// ---- Header ----

/** The header: a white band pinned at the top (behind the bar's corners and
 *  the 8 under it, so nothing that scrolls by shows there), the grey bar in it. */
export function TableHeader({ className, children, ...props }: React.ComponentProps<"div">) {
  const { size } = useTable();
  const grid = size === "grid";
  return (
    <div role="rowgroup" className={cn("sticky top-0 z-20 col-span-full grid grid-cols-subgrid bg-bg-white-0", !grid && "pb-table-header-below")}>
      <div
        role="row"
        className={cn(
          "col-span-full grid h-table-header grid-cols-subgrid bg-bg-weak-50",
          // A grid's lines run on from the header, so it sits on them.
          grid ? "rounded-t-table-header border-b border-stroke-soft-200" : "rounded-table-header",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}

export type TableSort = "default" | "up" | "down";

const ARIA_SORT: Record<TableSort, "none" | "ascending" | "descending"> = { default: "none", up: "ascending", down: "descending" };

const ALIGN = { left: "justify-start", center: "justify-center", right: "justify-end" } as const;

export type TableHeaderCellProps = Omit<React.ComponentProps<"div">, "onWidthChange"> & {
  /** A checkbox at the start, Medium (20). A slot. */
  checkbox?: React.ReactNode;
  /** The sort arrows after the word: default (up and down), up, down. */
  sort?: TableSort;
  /** Makes the word and arrows a button that sorts. */
  onSort?: React.MouseEventHandler<HTMLButtonElement>;
  /** A handle on the cell's edge: the new width while dragging, null on a double click (back to its own). */
  onWidthChange?: (width: number | null) => void;
  /** As the cells under it: numbers right (the arrows then sit before the word). */
  align?: keyof typeof ALIGN;
  disabled?: boolean;
  sticky?: boolean;
  /** The Components page: shows the sort button's focus ring. */
  "data-force"?: "focus";
};

export function TableHeaderCell({
  checkbox,
  sort,
  onSort,
  onWidthChange,
  align = "left",
  disabled = false,
  sticky = false,
  "data-force": force,
  className,
  children,
  ...props
}: TableHeaderCellProps) {
  const { size } = useTable();
  const sorted = sort === "up" || sort === "down";
  // The sorted column's word and arrow darker (page, 19 Oct 2026).
  const word = disabled ? "text-text-disabled-300" : sorted ? "text-text-strong-950" : "text-text-sub-600";
  const arrow = disabled ? "text-icon-disabled-300" : sorted ? "text-icon-sub-600" : "text-icon-soft-400";
  const Arrow = sort === "up" ? ChevronUpIcon : sort === "down" ? ChevronDownIcon : SortIcon;
  // Calm, as the Projects reference: a column that can sort shows its arrows
  // on hover (and keyboard focus); the sorted one always (23 Oct 2026).
  const quiet = !!onSort && !sorted && !disabled;
  const label = (
    <>
      <span className="truncate">{children}</span>
      {sort && (
        <span
          aria-hidden
          className={cn(
            "inline-flex shrink-0 transition-opacity duration-150 [&_svg]:size-table-sort-icon",
            arrow,
            quiet && "opacity-0 group-hover/th:opacity-100 group-focus-within/th:opacity-100",
          )}
        >
          <Arrow />
        </span>
      )}
    </>
  );
  const hasWord = children != null && children !== false;
  const flip = align === "right" && "flex-row-reverse";
  const drag = React.useRef<{ x: number; w: number } | null>(null);

  return (
    <div
      role="columnheader"
      aria-sort={sort ? ARIA_SORT[sort] : undefined}
      className={cn(
        "group/th relative flex min-w-0 items-center gap-table-header-gap py-table-header-y text-paragraph-sm",
        size === "grid" ? "border-stroke-soft-200 px-table-grid-x not-first:border-l" : "px-table-header-x",
        ALIGN[align],
        word,
        sticky && [STICKY, "first:rounded-s-table-header"],
        className,
      )}
      {...props}
    >
      {checkbox != null && <span className="inline-flex shrink-0">{checkbox}</span>}
      {hasWord &&
        (onSort ? (
          <button
            type="button"
            onClick={onSort}
            disabled={disabled}
            data-force={force}
            className={cn(
              "ds-shadow flex min-w-0 cursor-pointer items-center gap-table-sort-gap rounded-table-sort text-start outline-none ds-focus:ring-focus-neutral disabled:cursor-not-allowed",
              flip,
            )}
          >
            {label}
          </button>
        ) : (
          <span className={cn("flex min-w-0 items-center gap-table-sort-gap", flip)}>{label}</span>
        ))}
      {onWidthChange && (
        <span
          role="separator"
          aria-orientation="vertical"
          aria-label="Column width"
          title="Drag to size the column. Double click to reset."
          onPointerDown={(e) => {
            e.preventDefault();
            e.currentTarget.setPointerCapture(e.pointerId);
            drag.current = { x: e.clientX, w: e.currentTarget.parentElement?.getBoundingClientRect().width ?? 0 };
          }}
          onPointerMove={(e) => {
            if (drag.current) onWidthChange(Math.round(drag.current.w + e.clientX - drag.current.x));
          }}
          onPointerUp={() => (drag.current = null)}
          onDoubleClick={() => onWidthChange(null)}
          className="absolute inset-y-space-0 right-space-0 z-10 w-table-resize translate-x-1/2 cursor-col-resize after:absolute after:inset-y-table-header-y after:left-1/2 after:w-px after:bg-transparent hover:after:bg-stroke-sub-300"
        />
      )}
    </div>
  );
}

// ---- Body ----

const isGroupRow = (node: unknown) => React.isValidElement(node) && node.type === TableGroupRow;

/** The rows, with the Content Divider's Line Spacing type between each two;
 *  a group's rows hang straight from its row. A grid's rows sit on their
 *  lines instead, the last one open to the box. */
export function TableBody({ className, children, ...props }: React.ComponentProps<"div">) {
  const { size } = useTable();
  const grid = size === "grid";
  const rows = React.Children.toArray(children);
  return (
    <div
      role="rowgroup"
      className={cn("col-span-full grid grid-cols-subgrid", grid && "[&>[role=row]:last-child>*]:border-b-0", className)}
      {...props}
    >
      {rows.map((row, i) => (
        <React.Fragment key={React.isValidElement(row) && row.key != null ? row.key : i}>
          {!grid && i > 0 && !isGroupRow(rows[i - 1]) && <ContentDivider type="line-spacing" role="none" className="col-span-full my-table-divider-y" />}
          {row}
        </React.Fragment>
      ))}
    </div>
  );
}

export type TableGroupRowProps = Omit<React.ComponentProps<"div">, "children"> & {
  label: React.ReactNode;
  count?: number;
  /** Quiet words after the count ("2 open · 3 resolved"). */
  summary?: React.ReactNode;
  /** A total, under the column at aggregateAt (counted from 0). */
  aggregate?: React.ReactNode;
  aggregateAt?: number;
  open?: boolean;
  onToggle?: () => void;
  /** A checkbox that picks the group's rows. A slot. */
  control?: React.ReactNode;
};

/** A group's row: no fill, its name in Label Small with the fold chevron,
 *  pinned under the header while its rows scroll (the next group's row
 *  slides over it). */
export function TableGroupRow({ label, count, summary, aggregate, aggregateAt, open = true, onToggle, control, className, ...props }: TableGroupRowProps) {
  const { size } = useTable();
  const grid = size === "grid";
  const total = aggregate != null && aggregateAt != null;
  const pad = grid ? "px-table-grid-x" : "px-table-cell-pad";
  return (
    <div
      role="row"
      aria-expanded={onToggle ? open : undefined}
      className={cn(
        "sticky z-10 col-span-full grid h-table-group grid-cols-subgrid bg-bg-white-0 text-paragraph-sm",
        grid ? "top-table-header border-b border-stroke-soft-200" : "top-table-group-top",
        className,
      )}
      {...props}
    >
      <div role="cell" className={cn("flex min-w-0 items-center", pad)} style={{ gridColumn: total ? `1 / ${aggregateAt + 1}` : "1 / -1" }}>
        {/* Stays in view when the table scrolls sideways. */}
        <div className="sticky left-table-cell-pad flex min-w-0 items-center gap-table-group-gap">
          {control != null && <span className="inline-flex shrink-0">{control}</span>}
          <button
            type="button"
            onClick={onToggle}
            disabled={!onToggle}
            className="flex min-w-0 items-center gap-table-group-gap rounded-table-sort outline-none ds-shadow ds-focus:ring-focus-neutral [&_svg]:size-table-sort-icon [&_svg]:shrink-0 [&_svg]:text-icon-sub-600"
          >
            {onToggle && (open ? <ChevronDownIcon /> : <ChevronRightIcon />)}
            <span className="truncate text-label-sm text-text-strong-950">{label}</span>
            {count != null && <span className="text-paragraph-xs tabular-nums text-text-soft-400">{count}</span>}
          </button>
          {summary != null && <span className="min-w-0 truncate text-paragraph-xs text-text-soft-400">{summary}</span>}
        </div>
      </div>
      {total && (
        <div role="cell" className={cn("flex min-w-0 items-center justify-end tabular-nums text-text-sub-600", pad)} style={{ gridColumn: `${aggregateAt + 1} / span 1` }}>
          {aggregate}
        </div>
      )}
    </div>
  );
}

export type TableRowProps = React.ComponentProps<"div"> & {
  /** Picked: its checkbox or radio is on. Tinted primary/alpha-10 (23 Oct 2026). */
  selected?: boolean;
  /** The keyboard's row: the Neutral focus ring while the table has keyboard focus. */
  active?: boolean;
  "data-force"?: "hover" | "focus";
};

/** Under the pointer an unticked checkbox or radio in the row shows its own
 *  Hover look (bg/sub-300), as the Figma's Hover row. */
const ROW_HOVER_CONTROLS = [
  "ds-hover:[&_[role=checkbox][data-state=unchecked]:not(:disabled,:focus-visible)]:bg-bg-sub-300",
  "ds-hover:[&_[role=radio][data-state=unchecked]:not(:disabled,:focus-visible)]:bg-bg-sub-300",
];

export function TableRow({ selected = false, active = false, onClick, onKeyDown, onMouseDown, className, ...props }: TableRowProps) {
  const { size, framed } = useTable();
  const opens = onClick != null;
  const grid = size === "grid";
  return (
    <div
      role="row"
      aria-selected={selected || undefined}
      data-selected={selected || undefined}
      data-active={active || undefined}
      tabIndex={opens ? 0 : undefined}
      onClick={onClick}
      onMouseDown={(event) => {
        onMouseDown?.(event);
        // Shift-click picks a range of rows, never a run of the page's words.
        if (event.shiftKey) event.preventDefault();
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        // A row that opens something opens on Enter, as a link does.
        if (opens && event.key === "Enter" && event.target === event.currentTarget) event.currentTarget.click();
      }}
      className={cn(
        // isolate: a sticky cell's layer stays inside its row, under the header.
        "ds-shadow isolate col-span-full grid grid-cols-subgrid outline-none transition-colors duration-150",
        CELL_HEIGHT[size],
        // Picked: primary/alpha-10 over the white, as one solid colour, so a
        // pinned cell (which takes its row's fill) still hides what scrolls under it.
        selected ? "bg-(--table-row-picked) ds-hover:bg-(--table-row-picked-hover)" : ["bg-bg-white-0", !grid && "ds-hover:bg-bg-weak-50"],
        !grid && [framed ? "rounded-table-row-framed" : "rounded-table-row", ROW_HOVER_CONTROLS],
        opens && "cursor-pointer ds-focus:ring-focus-neutral",
        active && "group-focus-visible/table:ring-focus-neutral",
        className,
      )}
      {...props}
    />
  );
}

// ---- Cells ----

export type TablePriority = "leading" | "regular" | "passive";

const TITLE: Record<TablePriority, string> = {
  leading: "text-label-sm text-text-strong-950", // the column that names the row
  regular: "text-paragraph-sm text-text-strong-950",
  passive: "text-paragraph-sm text-text-sub-600", // quiet facts
};

export type TableTextCellProps = Omit<React.ComponentProps<"div">, "title"> & {
  priority?: TablePriority;
  /** A checkbox or a radio, Medium (20). A slot. */
  control?: React.ReactNode;
  /** A Key Icon (Medium on two-line rows, Small on one-line), an Avatar (40
   *  or 24), a TableLogo, or a card provider or file format icon (32). A slot. */
  picture?: React.ReactNode;
  title: React.ReactNode;
  /** Two-line rows only. */
  description?: React.ReactNode;
  sticky?: boolean;
};

export function TableTextCell({
  priority = "regular",
  control,
  picture,
  title,
  description,
  sticky = false,
  className,
  ...props
}: TableTextCellProps) {
  const { size, framed } = useTable();
  const grid = size === "grid";
  return (
    <div
      role={grid ? "gridcell" : "cell"}
      className={cn(
        // The height is fixed: the picture and words sit in the middle.
        "flex min-w-0 items-center gap-table-text-gap",
        grid ? GRID_CELL : "py-table-cell-pad pr-table-text-right pl-table-cell-pad",
        CELL_HEIGHT[size],
        sticky && [STICKY, !grid && (framed ? "first:rounded-s-table-row-framed" : "first:rounded-s-table-row")],
        className,
      )}
      {...props}
    >
      {control != null && <span className="inline-flex shrink-0">{control}</span>}
      {picture != null && <span className="inline-flex shrink-0">{picture}</span>}
      <div className="flex min-w-0 flex-1 flex-col gap-table-words-gap">
        <span className={cn("truncate", TITLE[priority])}>{title}</span>
        {size === "xl" && description != null && <span className="truncate text-paragraph-xs text-text-sub-600">{description}</span>}
      </div>
    </div>
  );
}

export type TableCellProps = React.ComponentProps<"div"> & {
  /** Button and Toggle: center. Button Group and numbers: right. The rest: left. */
  align?: keyof typeof ALIGN;
  /** A grid's picked cell: a 2px primary/base ring inside it. */
  selected?: boolean;
  /** Stays in view when the table scrolls sideways (a footer's first cell under a sticky column). */
  sticky?: boolean;
};

/** Padding 12 on every side, its parts 8 apart (a grid's: 12 at the sides,
 *  on its lines; in the footer: the header's height). */
export function TableCell({ align = "left", selected = false, sticky = false, className, ...props }: TableCellProps) {
  const { size, footer } = useTable();
  const grid = size === "grid";
  return (
    <div
      role={grid ? "gridcell" : "cell"}
      aria-selected={grid ? selected : undefined}
      className={cn(
        "flex min-w-0 items-center gap-table-cell-gap",
        footer ? ["h-table-header", grid ? "px-table-grid-x" : "px-table-cell-pad"] : [grid ? GRID_CELL : "p-table-cell-pad", CELL_HEIGHT[size]],
        ALIGN[align],
        sticky && STICKY,
        selected && "relative z-1 outline-2 -outline-offset-2 outline-primary-base",
        className,
      )}
      {...props}
    />
  );
}

const TONE = {
  default: "text-text-strong-950",
  positive: "text-state-success-base",
  negative: "text-state-error-base",
  passive: "text-text-sub-600",
} as const;

export type TableNumberCellProps = TableCellProps & { tone?: keyof typeof TONE };

/** A figure: right aligned, tabular, so a column's digits line up. */
export function TableNumberCell({ tone = "default", className, ...props }: TableNumberCellProps) {
  return <TableCell align="right" className={cn("text-paragraph-sm tabular-nums", TONE[tone], className)} {...props} />;
}

/** A grid cell being edited: a bare field filling the cell, in its type (the
 *  cell keeps the picked ring). */
export function TableCellInput({ align = "left", className, ...props }: React.ComponentProps<"input"> & { align?: "left" | "right" }) {
  return (
    <input
      className={cn(
        "size-full min-w-0 bg-transparent text-paragraph-sm text-text-strong-950 outline-none",
        align === "right" && "text-right tabular-nums",
        className,
      )}
      {...props}
    />
  );
}

/** A grid's row number; active: the row of the picked cell. */
export function TableIndexCell({ active = false, className, ...props }: React.ComponentProps<"div"> & { active?: boolean }) {
  return (
    <div
      role="rowheader"
      className={cn(
        "flex h-table-row-grid items-center justify-center border-b border-stroke-soft-200 text-paragraph-xs tabular-nums",
        active ? "text-text-strong-950" : "text-text-soft-400",
        className,
      )}
      {...props}
    />
  );
}

/** A brand or company logo in a circle: bg/white-0, a 1px stroke/soft-200
 *  edge, the card shadow, padding 6. 40 on two-line rows (the logo 28), 32 on one-line. */
export function TableLogo({ className, ...props }: React.ComponentProps<"span">) {
  const { size } = useTable();
  return (
    <span
      className={cn(
        "ds-shadow edge-stroke-soft-200 lift-card inline-flex shrink-0 items-center justify-center overflow-hidden rounded-table-logo bg-bg-white-0 p-table-logo-pad [&>*]:size-full",
        size === "xl" ? "size-table-logo-xl" : "size-table-logo-lg",
        className,
      )}
      {...props}
    />
  );
}

/** The row size, for slots that change with it (the Key Icon, the Avatar, the buttons). */
export function useTableSize() {
  return useTable().size;
}

// ---- Around the rows ----

export type TableMessageProps = {
  kind: "loading" | "empty" | "error";
  children?: React.ReactNode;
  /** A Link Button or Button after the words ("Clear the search"). */
  action?: React.ReactNode;
};

/** Across the table: three quiet rows while it loads; a line of words when
 *  nothing is there, or when the request failed (never an empty table for a failure). */
export function TableMessage({ kind, children, action }: TableMessageProps) {
  const { size } = useTable();
  if (kind === "loading") {
    return (
      <>
        {[0, 1, 2].map((i) => (
          <div key={i} role="row" aria-busy className={cn("col-span-full flex items-center px-table-cell-pad", CELL_HEIGHT[size])}>
            <span className="h-table-skeleton-h w-1/3 animate-pulse rounded-table-sort bg-bg-weak-50" />
          </div>
        ))}
      </>
    );
  }
  return (
    <div
      role="row"
      className={cn(
        "col-span-full flex flex-wrap items-center justify-center gap-table-cell-gap py-table-message-y text-center text-paragraph-sm",
        kind === "error" ? "text-state-error-base" : "text-text-sub-600",
      )}
    >
      <span role="cell">{children}</span>
      {action}
    </div>
  );
}

/** A row pinned under the rows, after the last one: counts and totals, in
 *  TableCell and TableNumberCell so each total sits under its column. */
export function TableFooter({ className, ...props }: React.ComponentProps<"div">) {
  const ctx = useTable();
  return (
    <TableCtx.Provider value={{ ...ctx, footer: true }}>
      <div
        role="row"
        className={cn(
          "sticky bottom-space-0 z-20 col-span-full grid grid-cols-subgrid border-t border-stroke-soft-200 bg-bg-white-0 text-paragraph-sm text-text-sub-600",
          ctx.size !== "grid" && "mt-table-divider-y",
          className,
        )}
        {...props}
      />
    </TableCtx.Provider>
  );
}

/** Picked rows: how many, what can be done to all of them, clear. Floats
 *  over the box's foot (Table's overlay), with the Dropdown's shadow. */
export function TableBulkBar({ count, onClear, children }: { count: number; onClear: () => void; children?: React.ReactNode }) {
  if (count === 0) return null;
  return (
    <div className="pointer-events-none absolute inset-x-space-0 bottom-table-bulk-below z-30 flex justify-center">
      <div
        role="toolbar"
        aria-label={`${count} picked`}
        className="ds-shadow edge-stroke-soft-200 [--ds-lift:var(--shadow-table-bulk)] pointer-events-auto flex items-center gap-table-bulk-gap rounded-table-bulk bg-bg-white-0 py-table-bulk-y pr-table-bulk-y pl-table-bulk-x"
      >
        <span className="text-label-sm tabular-nums text-text-strong-950">{count} picked</span>
        {children != null && <span aria-hidden className="h-table-bulk-line w-px bg-stroke-soft-200" />}
        {children}
        <CompactButton variant="ghost" size="lg" aria-label="Clear the picks" onClick={onClear}>
          <CloseIcon />
        </CompactButton>
      </div>
    </div>
  );
}

// ---- Behaviour ----

/** Picking rows by id: one, a Shift range over `order` (the rows in view, in
 *  order), many, all; a set's state for a header or group checkbox. */
export function useTablePicks(order: string[]) {
  const [picked, setPicked] = React.useState<Set<string>>(() => new Set());
  const anchor = React.useRef<string | null>(null);
  const setMany = React.useCallback(
    (ids: string[], on: boolean) =>
      setPicked((p) => {
        const next = new Set(p);
        ids.forEach((id) => (on ? next.add(id) : next.delete(id)));
        return next;
      }),
    [],
  );
  const toggle = (id: string, shift = false) => {
    const a = anchor.current ? order.indexOf(anchor.current) : -1;
    const b = order.indexOf(id);
    if (shift && a >= 0 && b >= 0) {
      setMany(order.slice(Math.min(a, b), Math.max(a, b) + 1), true);
      return;
    }
    setMany([id], !picked.has(id));
    anchor.current = id;
  };
  /** true, "indeterminate" or false: a checkbox over `ids`. */
  const stateOf = (ids: string[]): boolean | "indeterminate" =>
    ids.length > 0 && ids.every((id) => picked.has(id)) ? true : ids.some((id) => picked.has(id)) ? "indeterminate" : false;
  return { picked, toggle, setMany, stateOf, clear: () => setPicked(new Set()), count: picked.size };
}

/** A grid's picked cell and its editing, as a spreadsheet's: arrows move,
 *  Tab moves on, Enter (or typing) edits, Enter saves and moves down, Escape
 *  cancels. */
export function useTableGrid({ rows, cols, onCommit }: { rows: number; cols: number; onCommit?: (row: number, col: number, value: string) => void }) {
  const [cell, setCell] = React.useState<[number, number]>([0, 0]);
  const [editing, setEditing] = React.useState<string | null>(null);
  const move = (dr: number, dc: number) => setCell(([r, c]) => [Math.max(0, Math.min(rows - 1, r + dr)), Math.max(0, Math.min(cols - 1, c + dc))]);
  const commit = () => {
    if (editing != null) onCommit?.(cell[0], cell[1], editing);
    setEditing(null);
  };
  /** On the table while not editing; on the field while editing. `current` is the picked cell's value. */
  const onKeyDown = (e: React.KeyboardEvent, current: string) => {
    if (editing != null) {
      if (e.key === "Enter") {
        e.preventDefault();
        commit();
        move(1, 0);
      } else if (e.key === "Escape") {
        e.preventDefault();
        setEditing(null);
      } else if (e.key === "Tab") {
        e.preventDefault();
        commit();
        move(0, e.shiftKey ? -1 : 1);
      }
      return;
    }
    const keys: Record<string, [number, number]> = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
    if (keys[e.key]) {
      e.preventDefault();
      move(...keys[e.key]);
    } else if (e.key === "Tab") {
      e.preventDefault();
      move(0, e.shiftKey ? -1 : 1);
    } else if (e.key === "Enter" || e.key === "F2") {
      e.preventDefault();
      setEditing(current);
    } else if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      setEditing(e.key);
    }
  };
  return {
    cell,
    pick: (r: number, c: number) => setCell([r, c]),
    editing,
    setEditing,
    commit,
    onKeyDown,
  };
}
