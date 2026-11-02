"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva } from "class-variance-authority";

import { Button } from "@/components/ds/button";
import { ButtonGroup, ButtonGroupItem } from "@/components/ds/button-group";
import { useControllableState } from "@/components/ds/checkbox";
import { SegmentedControl, SegmentedControlItem } from "@/components/ds/segmented-control";
import { Select, SelectItem } from "@/components/ds/select";
import { TextInput } from "@/components/ds/text-input";
import { CalendarIcon, ChevronDownIcon, ChevronRightIcon, FilterIcon, SearchIcon, SettingsIcon, SortIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/**
 * The design system's Filter, built from design-system/components/filter.md
 * (Nitesh's Figma "Horizontal Filter [1.1]" 4370:6018, "Vertical Filter Items
 * [1.1]" 4379:1183, "Vertical Filter Header [1.1]" 4379:2209, "Vertical
 * Filter Footer [1.1]" 4415:863, and the panel in the page's blocks). Made
 * only of the other components; it draws nothing of its own but the
 * panel's box, its lines and its left rows.
 *
 * HorizontalFilter  the bar above a table or a calendar, 36 tall, 12 between
 *                   the parts. type table (the Segmented Control of views,
 *                   then Search, Filter, the icon button, Sort by) | calendar
 *                   ("Today", the date Button Group, then Search, Filter, the
 *                   icon button). search, filter, iconButton and sortBy turn
 *                   parts off; filterPanel opens from the Filter button.
 * FilterPanel       the panel: the groups down the left (Radix tabs), the
 *                   chosen group's header, search row and choices on the
 *                   right, and the footer (Clear, Apply). groups: value,
 *                   label, icon, title, headerIcon, headerAction (a Link
 *                   Button, Gray, Medium), search, content, disabled
 * FilterItem        a row on the left: icon, the word; active adds the chevron
 * FilterHeader, FilterSearchRow, FilterChoices (choices 16 apart, fields 12),
 * FilterChoice (a Checkbox or Radio Label with its note), FilterFooter
 *
 * Group headings are the Content Divider, Solid Text; pass one in a group's
 * content. The Date choice belongs to the Date Picker (later). Sizes are the
 * tokens in styles/sizes/filter.css; the panel's shadow is --shadow-filter-panel.
 */

// ---- Rows on the left (Vertical Filter Items) ----

const itemVariants = cva(
  [
    "group/item ds-shadow flex h-filter-item w-full shrink-0 cursor-pointer items-center gap-filter-item-gap rounded-filter-item p-filter-item-pad text-left outline-none",
    "transition-[background-color,box-shadow] duration-150",
    // Keyboard focus: the Neutral ring (the page's proposal).
    "ds-focus:ring-focus-neutral disabled:cursor-not-allowed",
  ],
  {
    variants: {
      look: {
        default: "bg-bg-white-0 ds-hover:bg-bg-weak-50",
        active: "bg-bg-weak-50",
        // No fill (the page's proposal, as the Dropdown's Disabled row).
        disabled: "bg-transparent",
      },
    },
    defaultVariants: { look: "default" },
  },
);

const ITEM_ICON = {
  default: "text-icon-soft-400 group-ds-hover/item:text-icon-sub-600",
  active: "text-primary-base",
  disabled: "text-icon-disabled-300",
} as const;
const ITEM_WORD = { default: "text-text-sub-600", active: "text-text-strong-950", disabled: "text-text-disabled-300" } as const;

export type FilterItemProps = Omit<React.ComponentProps<"button">, "children"> & {
  children: React.ReactNode;
  /** A 20 x 20 icon before the word. */
  icon?: React.ReactNode;
  /** The group on show: the Active look and the chevron. */
  active?: boolean;
  "data-force"?: "hover" | "focus";
};

/** 36 tall, padding 8, gap 8, corner 8: the icon, the word filling the
 *  space, and on Active a chevron in icon/soft-400. */
export function FilterItem({ icon, active, disabled, children, className, type = "button", ...props }: FilterItemProps) {
  const look = disabled ? "disabled" : active ? "active" : "default";
  return (
    <button type={type} disabled={disabled} className={cn(itemVariants({ look }), className)} {...props}>
      {icon != null && <span className={cn("flex shrink-0 [&_svg]:size-filter-icon", ITEM_ICON[look])}>{icon}</span>}
      <span className={cn("min-w-0 flex-1 truncate text-label-sm", ITEM_WORD[look])}>{children}</span>
      {look === "active" && <ChevronRightIcon className="size-filter-icon shrink-0 text-icon-soft-400" />}
    </button>
  );
}

// ---- The right side's parts ----

const LINE_BOTTOM = "ds-shadow [--ds-edge:var(--shadow-filter-line-bottom)]";

/** 52 tall, padding 16 and 20, gap 8, the line at the bottom: an icon and the
 *  title on the left, a Link Button (Gray, Medium) on the right. */
export function FilterHeader({
  icon,
  title,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: React.ReactNode;
  /** A Link Button (link-button.md), Gray, Medium: "Clear", "Select All". */
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex h-filter-header shrink-0 items-center gap-filter-header-gap bg-bg-white-0 px-filter-header-x py-filter-header-y", LINE_BOTTOM, className)}>
      {icon != null && <span className="flex shrink-0 text-icon-sub-600 [&_svg]:size-filter-icon">{icon}</span>}
      <span className="min-w-0 flex-1 truncate text-label-sm text-text-strong-950">{title}</span>
      {action}
    </div>
  );
}

export type FilterSearchRowProps = Omit<React.ComponentProps<"input">, "size" | "type"> & {
  /** The shortcut key, for example "⌘F". */
  shortcut?: React.ReactNode;
};

/** 44 tall, padding 12 and 20, gap 8, the line at the bottom: the search
 *  icon, the words and a shortcut key box. */
export function FilterSearchRow({ shortcut, placeholder = "Search...", className, ...props }: FilterSearchRowProps) {
  return (
    <div className={cn("flex h-filter-search-row shrink-0 items-center gap-filter-search-row-gap px-filter-search-row-x py-filter-search-row-y", LINE_BOTTOM, className)}>
      <SearchIcon className="size-filter-icon shrink-0 text-icon-soft-400" />
      <input
        type="search"
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-paragraph-sm text-text-strong-950 outline-none placeholder:text-text-soft-400 [&::-webkit-search-cancel-button]:hidden"
        {...props}
      />
      {shortcut != null && (
        <kbd className="ds-shadow edge-stroke-soft-200 shrink-0 rounded-filter-key bg-bg-white-0 px-filter-key-x py-filter-key-y font-sans text-subheading-xs uppercase text-text-sub-600">
          {shortcut}
        </kbd>
      )}
    </div>
  );
}

/** Padding 20: Checkbox or Radio Labels 16 apart (choices), or Text Inputs 12 apart (fields). */
export function FilterChoices({ kind = "choices", className, ...props }: React.ComponentProps<"div"> & { kind?: "choices" | "fields" }) {
  return (
    <div
      className={cn("flex flex-col p-filter-choices-pad", kind === "fields" ? "gap-filter-fields-gap" : "gap-filter-choices-gap", className)}
      {...props}
    />
  );
}

/** A Checkbox Label or Radio Label (children) with an optional note 12 after
 *  it ("(Recipient)"), in text-paragraph-xs, text/soft-400. */
export function FilterChoice({ note, children, className }: { note?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center gap-filter-note-gap", className)}>
      {children}
      {note != null && <span className="text-paragraph-xs text-text-soft-400">{note}</span>}
    </div>
  );
}

/** 68 tall, padding 16 and 20, the line on top: Clear (Neutral, Stroke) and
 *  Apply (Primary, Filled), Small, sharing the width, 16 apart. */
export function FilterFooter({
  clearLabel = "Clear",
  applyLabel = "Apply",
  onClear,
  onApply,
  className,
}: {
  clearLabel?: React.ReactNode;
  applyLabel?: React.ReactNode;
  onClear?: () => void;
  onApply?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "ds-shadow [--ds-edge:var(--shadow-filter-line-top)] flex h-filter-footer shrink-0 items-center gap-filter-footer-gap bg-bg-white-0 px-filter-footer-x py-filter-footer-y",
        className,
      )}
    >
      <Button tone="neutral" variant="stroke" size="sm" className="flex-1" onClick={onClear}>
        {clearLabel}
      </Button>
      <Button tone="primary" variant="filled" size="sm" className="flex-1" onClick={onApply}>
        {applyLabel}
      </Button>
    </div>
  );
}

// ---- The filter panel ----

export type FilterGroup = {
  value: string;
  /** The row's word on the left. */
  label: React.ReactNode;
  /** The row's icon on the left. */
  icon?: React.ReactNode;
  /** The header's title; the label unless set. */
  title?: React.ReactNode;
  headerIcon?: React.ReactNode;
  /** A Link Button, Gray, Medium, on the header's right. */
  headerAction?: React.ReactNode;
  /** The search row under the header. */
  search?: boolean | { placeholder?: string; shortcut?: React.ReactNode };
  /** The choices: FilterChoices, and a Content Divider, Solid Text, before a group of them. */
  content: React.ReactNode;
  disabled?: boolean;
};

export type FilterPanelProps = {
  groups: FilterGroup[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  clearLabel?: React.ReactNode;
  applyLabel?: React.ReactNode;
  onClear?: () => void;
  onApply?: () => void;
  className?: string;
  "aria-label"?: string;
};

/** 696 wide, corner 20, bg/white-0, no edge, --shadow-filter-panel; height
 *  follows the content. Left column 224 (padding 12, rows 8 apart, a line on
 *  its right); right side 472. */
export function FilterPanel({
  groups,
  value,
  defaultValue,
  onValueChange,
  clearLabel,
  applyLabel,
  onClear,
  onApply,
  className,
  "aria-label": ariaLabel = "Filters",
}: FilterPanelProps) {
  const [current, setCurrent] = useControllableState(value, defaultValue ?? groups[0]?.value ?? "", onValueChange);
  return (
    <TabsPrimitive.Root
      orientation="vertical"
      value={current}
      onValueChange={setCurrent}
      className={cn(
        "ds-shadow [--ds-lift:var(--shadow-filter-panel)] flex w-filter-panel-w overflow-hidden rounded-filter-panel bg-bg-white-0",
        className,
      )}
    >
      <TabsPrimitive.List
        aria-label={ariaLabel}
        className="ds-shadow [--ds-edge:var(--shadow-filter-line-right)] flex w-filter-left-w shrink-0 flex-col gap-filter-left-gap p-filter-left-pad"
      >
        {groups.map((g) => (
          <TabsPrimitive.Trigger key={g.value} value={g.value} disabled={g.disabled} asChild>
            <FilterItem icon={g.icon} active={current === g.value} disabled={g.disabled}>
              {g.label}
            </FilterItem>
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
      <div className="flex w-filter-right-w shrink-0 flex-col">
        {groups.map((g) => {
          const search = g.search === true ? {} : g.search || null;
          return (
            <TabsPrimitive.Content key={g.value} value={g.value} className="flex flex-1 flex-col outline-none">
              <FilterHeader icon={g.headerIcon} title={g.title ?? g.label} action={g.headerAction} />
              {search && <FilterSearchRow placeholder={search.placeholder} shortcut={search.shortcut} />}
              <div className="flex-1">{g.content}</div>
            </TabsPrimitive.Content>
          );
        })}
        <FilterFooter clearLabel={clearLabel} applyLabel={applyLabel} onClear={onClear} onApply={onApply} />
      </div>
    </TabsPrimitive.Root>
  );
}

// ---- Horizontal Filter ----

export type HorizontalFilterProps = {
  type?: "table" | "calendar";
  className?: string;

  /** Table: the views in the Segmented Control (All, Income, Expenses). */
  views?: { value: string; label: React.ReactNode }[];
  view?: string;
  defaultView?: string;
  onViewChange?: (value: string) => void;
  viewsLabel?: string;

  /** Calendar: the "Today" Button and the date Button Group. */
  todayLabel?: React.ReactNode;
  onToday?: () => void;
  rangeLabel?: React.ReactNode;
  onRange?: () => void;
  datesLabel?: React.ReactNode;
  onDates?: () => void;

  /** The Search (the Text Input, Search, Small, 300 wide). On by default. */
  search?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  /** The shortcut key in the Search, as the Figma's table blocks ("⌘1"). The
   *  caller listens for it and focuses the field through searchRef. */
  searchShortcut?: React.ReactNode;
  searchRef?: React.Ref<HTMLInputElement>;

  /** The Filter button. On by default. */
  filter?: boolean;
  filterLabel?: React.ReactNode;
  onFilter?: () => void;
  /** A FilterPanel that opens under the Filter button. */
  filterPanel?: React.ReactNode;
  filterOpen?: boolean;
  onFilterOpenChange?: (open: boolean) => void;

  /** The icon button (a settings icon unless set). On by default. */
  iconButton?: boolean;
  iconButtonIcon?: React.ReactNode;
  iconButtonLabel?: string;
  onIconButton?: () => void;

  /** Table: Sort by (the Select, Basic, Small, as wide as its words). On by default. */
  sortBy?: boolean;
  sortPlaceholder?: React.ReactNode;
  sortOptions?: { value: string; label: React.ReactNode }[];
  sortValue?: string;
  defaultSortValue?: string;
  onSortChange?: (value: string) => void;
};

export function HorizontalFilter({
  type = "table",
  className,
  views = [],
  view,
  defaultView,
  onViewChange,
  viewsLabel = "View",
  todayLabel = "Today",
  onToday,
  rangeLabel = "Last 7 days",
  onRange,
  datesLabel,
  onDates,
  search = true,
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  searchShortcut,
  searchRef,
  filter = true,
  filterLabel = "Filter",
  onFilter,
  filterPanel,
  filterOpen,
  onFilterOpenChange,
  iconButton = true,
  iconButtonIcon,
  iconButtonLabel = "Settings",
  onIconButton,
  sortBy = true,
  sortPlaceholder = "Sort by",
  sortOptions = [],
  sortValue,
  defaultSortValue,
  onSortChange,
}: HorizontalFilterProps) {
  const [panelOpen, setPanelOpen] = useControllableState(filterOpen, false, onFilterOpenChange);

  const filterButton = (
    <Button tone="neutral" variant="stroke" size="sm" leadingIcon={<FilterIcon />} onClick={onFilter}>
      {filterLabel}
    </Button>
  );

  return (
    <div className={cn("flex h-filter-bar w-full items-center justify-between gap-filter-bar-gap", className)}>
      <div className="flex items-center gap-filter-bar-gap">
        {type === "table" ? (
          views.length > 0 && (
            <div className="w-filter-views-w">
              <SegmentedControl value={view} defaultValue={defaultView ?? views[0].value} onValueChange={onViewChange} aria-label={viewsLabel}>
                {views.map((v) => (
                  <SegmentedControlItem key={v.value} value={v.value}>
                    {v.label}
                  </SegmentedControlItem>
                ))}
              </SegmentedControl>
            </div>
          )
        ) : (
          <>
            <Button tone="neutral" variant="stroke" size="sm" onClick={onToday}>
              {todayLabel}
            </Button>
            <ButtonGroup size="sm">
              <ButtonGroupItem trailingIcon={<ChevronDownIcon />} onClick={onRange}>
                {rangeLabel}
              </ButtonGroupItem>
              <ButtonGroupItem leadingIcon={<CalendarIcon />} onClick={onDates}>
                {datesLabel}
              </ButtonGroupItem>
            </ButtonGroup>
          </>
        )}
      </div>

      <div className="flex items-center gap-filter-bar-gap">
        {search && (
          <div className="w-filter-search-w">
            <TextInput
              ref={searchRef}
              size="sm"
              type="search"
              aria-label="Search"
              placeholder={searchPlaceholder}
              shortcut={searchShortcut}
              value={searchValue}
              onChange={onSearchChange ? (e) => onSearchChange(e.target.value) : undefined}
            />
          </div>
        )}
        {filter &&
          (filterPanel != null ? (
            <PopoverPrimitive.Root open={panelOpen} onOpenChange={setPanelOpen}>
              <PopoverPrimitive.Trigger asChild>{filterButton}</PopoverPrimitive.Trigger>
              <PopoverPrimitive.Portal>
                <PopoverPrimitive.Content
                  align="end"
                  className="z-50 outline-none data-[side=bottom]:mt-filter-panel-offset data-[side=top]:mb-filter-panel-offset"
                >
                  {filterPanel}
                </PopoverPrimitive.Content>
              </PopoverPrimitive.Portal>
            </PopoverPrimitive.Root>
          ) : (
            filterButton
          ))}
        {iconButton && (
          <Button tone="neutral" variant="stroke" size="sm" leadingIcon={iconButtonIcon ?? <SettingsIcon />} aria-label={iconButtonLabel} onClick={onIconButton} />
        )}
        {type === "table" && sortBy && (
          <Select
            size="sm"
            icon={<SortIcon />}
            placeholder={sortPlaceholder}
            aria-label="Sort by"
            value={sortValue}
            defaultValue={defaultSortValue}
            onValueChange={onSortChange}
            className="w-auto"
          >
            {sortOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </Select>
        )}
      </div>
    </div>
  );
}
