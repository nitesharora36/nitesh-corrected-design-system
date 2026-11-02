"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cva } from "class-variance-authority";
import {
  DayPicker,
  useDayRender,
  useNavigation,
  type CaptionProps,
  type ClassNames,
  type DateRange,
  type DayProps,
  type Matcher,
} from "react-day-picker";
import { format, getDay, isSameDay, startOfDay, startOfMonth, startOfYear, subDays, subMonths } from "date-fns";

import { Button } from "@/components/ds/button";
import { CompactButton } from "@/components/ds/compact-button";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/**
 * The design system's Date Picker and Range Picker, built from
 * design-system/components/date-picker.md (Nitesh's Figma "Date & Range
 * Picker [1.1]", node 446:7414, with its Day Cells, Day Labels, Date
 * Selector and Period Range). The calendar is react-day-picker 8 with
 * date-fns (its keyboard and its grid), drawn only with our tokens: its
 * month header and day cells are ours.
 *
 * DatePicker       one month, picks one day. value, onValueChange, onApply, onCancel
 * RangePicker      two months and the quick picks, picks a from and a to day.
 *                  value ({ from, to }), onValueChange, quickPicks, onApply, onCancel
 * DatePickerPopover  opens a picker under a field (the Text Input's Date
 *                  type), the page's proposal (Open, "What opens the picker")
 *
 * The parts, for the Components page and for screens that need one alone:
 * DatePickerMonthHeader (arrows both | previous | next | none),
 * DatePickerDay (state default | selected | in-range, marked, band, disabled),
 * DatePickerQuickPick (active).
 *
 * Weeks start on Monday. Days from the months either side fill the first and
 * last rows in the Disabled look and cannot be picked. Proposals the page
 * makes (Open): today carries the Marked dot; a sixth row when a month needs
 * it; a range band with corner 8 only at its two ends in each row; a
 * disabled day in a range lets the band show through; keyboard focus shows
 * the Neutral ring (the Primary ring on a Selected day). Sizes are the
 * tokens in styles/sizes/date-picker.css.
 */

// ---- Month header (Date Selector) ----

export type DatePickerArrows = "both" | "previous" | "next" | "none";

/** Padding by which arrows show: one arrow keeps 36 on the other side, so
 *  the month name stays centred. */
const HEADER_PAD: Record<DatePickerArrows, string> = {
  both: "p-date-picker-header-pad",
  previous: "py-date-picker-header-pad pl-date-picker-header-pad pr-date-picker-header-far",
  next: "py-date-picker-header-pad pl-date-picker-header-far pr-date-picker-header-pad",
  none: "py-date-picker-header-bare-y px-date-picker-header-pad",
};

export type DatePickerMonthHeaderProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** The month's name, for example "October 2026". */
  children: React.ReactNode;
  arrows?: DatePickerArrows;
  onPrevious?: () => void;
  onNext?: () => void;
  previousDisabled?: boolean;
  nextDisabled?: boolean;
};

export function DatePickerMonthHeader({
  children,
  arrows = "both",
  onPrevious,
  onNext,
  previousDisabled,
  nextDisabled,
  id,
  className,
  ...props
}: DatePickerMonthHeaderProps) {
  const previous = arrows === "both" || arrows === "previous";
  const next = arrows === "both" || arrows === "next";
  return (
    <div
      className={cn(
        "flex h-date-picker-header items-center gap-date-picker-header-gap rounded-date-picker-header bg-bg-weak-50",
        HEADER_PAD[arrows],
        className,
      )}
      {...props}
    >
      {previous && (
        <CompactButton variant="white" size="lg" aria-label="Previous month" onClick={onPrevious} disabled={previousDisabled}>
          <ChevronLeftIcon />
        </CompactButton>
      )}
      <div id={id} aria-live="polite" className="min-w-0 flex-1 truncate text-center text-label-sm text-text-sub-600">
        {children}
      </div>
      {next && (
        <CompactButton variant="white" size="lg" aria-label="Next month" onClick={onNext} disabled={nextDisabled}>
          <ChevronRightIcon />
        </CompactButton>
      )}
    </div>
  );
}

// ---- Day cell ----

export type DatePickerDayState = "default" | "selected" | "in-range";

const dayVariants = cva(
  [
    "ds-shadow relative flex size-date-picker-day shrink-0 cursor-pointer items-center justify-center rounded-date-picker-day py-date-picker-day-y text-label-sm outline-none",
    "transition-[background-color,color,box-shadow] duration-150",
    "disabled:cursor-not-allowed disabled:text-text-disabled-300",
  ],
  {
    variants: {
      state: {
        default: "bg-bg-white-0 text-text-sub-600 ds-hover:bg-bg-weak-50 ds-hover:text-text-strong-950 ds-focus:ring-focus-neutral",
        selected: "bg-primary-base text-static-white ds-focus:ring-focus-primary",
        // No fill, so the band shows (a disabled day in a range too: page, Open).
        "in-range": "bg-transparent text-primary-base ds-hover:bg-bg-weak-50 ds-hover:text-text-strong-950 ds-focus:ring-focus-neutral",
      },
    },
    defaultVariants: { state: "default" },
  },
);

const DOT: Record<DatePickerDayState, string> = {
  default: "bg-primary-base",
  selected: "bg-primary-lighter",
  "in-range": "bg-primary-base",
};

export type DatePickerDayProps = Omit<React.ComponentProps<"button">, "children"> & {
  /** The day's number. */
  children: React.ReactNode;
  state?: DatePickerDayState;
  /** The small dot under the number. */
  marked?: boolean;
  /** The range band behind the day. from: the band starts here (the range's
   *  first day, or a Monday); to: it stops here (the last day, or a Sunday). */
  band?: { from: boolean; to: boolean };
  "data-force"?: "hover" | "focus";
};

export function DatePickerDay({ children, state = "default", marked, band, disabled, className, type = "button", ...props }: DatePickerDayProps) {
  return (
    <div className="relative flex">
      {band && (
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-y-space-0 bg-primary-alpha-10",
            band.from ? "left-space-0 rounded-l-date-picker-day" : "-left-date-picker-band-reach",
            band.to ? "right-space-0 rounded-r-date-picker-day" : "-right-date-picker-band-reach",
          )}
        />
      )}
      <button type={type} disabled={disabled} className={cn(dayVariants({ state }), className)} {...props}>
        {children}
        {marked && (
          <span aria-hidden className="pointer-events-none absolute inset-x-space-0 bottom-date-picker-dot-bottom flex justify-center">
            <span className={cn("size-date-picker-dot rounded-date-picker-dot", disabled ? "bg-icon-disabled-300" : DOT[state])} />
          </span>
        )}
      </button>
    </div>
  );
}

// ---- Quick pick (Period Range) ----

export type DatePickerQuickPickProps = React.ComponentProps<"button"> & {
  /** The picked one (the Figma's Active). */
  active?: boolean;
  "data-force"?: "hover" | "focus";
};

export function DatePickerQuickPick({ active, className, type = "button", ...props }: DatePickerQuickPickProps) {
  return (
    <button
      type={type}
      aria-pressed={active}
      className={cn(
        "ds-shadow flex h-date-picker-pick w-full shrink-0 cursor-pointer items-center rounded-date-picker-pick py-date-picker-pick-y pr-date-picker-pick-right pl-date-picker-pick-left text-left text-label-sm outline-none",
        "transition-[background-color,color,box-shadow] duration-150 ds-focus:ring-focus-neutral",
        active ? "bg-bg-weak-50 text-text-strong-950" : "bg-bg-white-0 text-text-sub-600 ds-hover:bg-bg-weak-50",
        className,
      )}
      {...props}
    />
  );
}

export type DatePickerQuickPickOption = {
  label: string;
  /** The range it picks, from today. None for All time. */
  range: (today: Date) => DateRange | undefined;
};

/** The Figma's eight quick picks. */
export const DATE_PICKER_QUICK_PICKS: DatePickerQuickPickOption[] = [
  { label: "Today", range: (t) => ({ from: t, to: t }) },
  { label: "Last 7 days", range: (t) => ({ from: subDays(t, 6), to: t }) },
  { label: "Last 30 days", range: (t) => ({ from: subDays(t, 29), to: t }) },
  { label: "Last 3 months", range: (t) => ({ from: subMonths(t, 3), to: t }) },
  { label: "Last 12 months", range: (t) => ({ from: subMonths(t, 12), to: t }) },
  { label: "Month to date", range: (t) => ({ from: startOfMonth(t), to: t }) },
  { label: "Year to date", range: (t) => ({ from: startOfYear(t), to: t }) },
  { label: "All time", range: () => undefined },
];

// ---- The calendar inside both pickers ----

function PickerCaption({ id, displayMonth }: CaptionProps) {
  const { goToMonth, previousMonth, nextMonth } = useNavigation();
  return (
    <DatePickerMonthHeader
      id={id}
      onPrevious={() => previousMonth && goToMonth(previousMonth)}
      onNext={() => nextMonth && goToMonth(nextMonth)}
      previousDisabled={!previousMonth}
      nextDisabled={!nextMonth}
    >
      {format(displayMonth, "MMMM yyyy")}
    </DatePickerMonthHeader>
  );
}

function PickerDay({ date, displayMonth }: DayProps) {
  // react-day-picker 8 types its ref without null.
  const ref = React.useRef<HTMLButtonElement>(null) as React.RefObject<HTMLButtonElement>;
  const day = useDayRender(date, displayMonth, ref);
  if (day.isHidden) return <div role="gridcell" className="size-date-picker-day" />;

  const m = day.activeModifiers;
  const outside = !!m.outside;
  const start = !!m.range_start;
  const end = !!m.range_end;
  const middle = !!m.range_middle;
  // A band only when the range covers more than one day.
  const inBand = middle || ((start || end) && !(start && end));
  const weekday = getDay(date); // 0 is Sunday
  const band = inBand ? { from: start || weekday === 1, to: end || weekday === 0 } : undefined;
  // A day from another month never takes the Selected fill: its own month shows it.
  const state: DatePickerDayState = middle || (outside && inBand) ? "in-range" : m.selected && !outside ? "selected" : "default";

  // react-day-picker's own look (its class and style) is left out; ours is the cell.
  const { children, disabled, ...buttonProps } = day.buttonProps;
  delete buttonProps.className;
  delete buttonProps.style;
  return (
    <DatePickerDay ref={ref} state={state} marked={!!m.marked} band={band} disabled={outside || !!disabled} {...buttonProps}>
      {children}
    </DatePickerDay>
  );
}

const CALENDAR_CLASSES: ClassNames = {
  root: "",
  months: "flex",
  month: "flex w-date-picker-month shrink-0 flex-col gap-date-picker-gap p-date-picker-month-pad",
  table: "flex flex-col gap-date-picker-gap",
  head: "flex",
  head_row: "flex gap-date-picker-gap",
  head_cell: "flex size-date-picker-day items-center justify-center bg-bg-white-0 py-date-picker-day-y text-label-sm text-text-soft-400",
  tbody: "flex flex-col gap-date-picker-gap",
  row: "flex gap-date-picker-gap",
  cell: "flex p-space-0",
  vhidden: "sr-only",
};

/** The weekday letters: MO, TU, WE, TH, FR, SA, SU. */
const formatWeekdayName = (d: Date) => format(d, "EEEEEE").toUpperCase();

function useToday() {
  // Read once, so the marked dot and the quick picks agree for the session.
  return React.useState(() => startOfDay(new Date()))[0];
}

/** The picked day or range. The caller's whenever it passes `value`, even
 *  undefined (nothing picked), so clearing a pick never brings an older one
 *  back; the picker's own otherwise. */
function usePicked<T>(controlled: boolean, value: T | undefined, defaultValue: T | undefined, onChange?: (next: T | undefined) => void) {
  const [inner, setInner] = React.useState(defaultValue);
  const set = React.useCallback(
    (next: T | undefined) => {
      if (!controlled) setInner(next);
      onChange?.(next);
    },
    [controlled, onChange],
  );
  return [controlled ? value : inner, set] as const;
}

const panel = "ds-shadow inline-flex rounded-date-picker bg-bg-white-0 edge-stroke-soft-200 [--ds-lift:var(--shadow-date-picker-panel)]";
const lineTop = "ds-shadow [--ds-edge:var(--shadow-date-picker-line-top)]";

// ---- Date Picker ----

export type DatePickerProps = {
  /** The picked day. Passing it (undefined for none) makes the caller own it. */
  value?: Date;
  defaultValue?: Date;
  onValueChange?: (date: Date | undefined) => void;
  /** The month on show; the picked day's month (or today's) unless set. */
  defaultMonth?: Date;
  /** Days that carry the Marked dot ("something is on this day"). */
  marked?: Date[];
  /** Today carries the Marked dot (the page's proposal). On unless false. */
  markToday?: boolean;
  /** Days that cannot be picked. */
  disabled?: Matcher | Matcher[];
  /** Cancel and Apply. On unless false. */
  footer?: boolean;
  onApply?: (date: Date | undefined) => void;
  onCancel?: () => void;
  className?: string;
};

export function DatePicker(props: DatePickerProps) {
  const {
    value,
    defaultValue,
    onValueChange,
    defaultMonth,
    marked,
    markToday = true,
    disabled,
    footer = true,
    onApply,
    onCancel,
    className,
  } = props;
  const today = useToday();
  const [picked, setPicked] = usePicked("value" in props, value, defaultValue, onValueChange);
  return (
    <div className={cn(panel, "flex-col", className)}>
      <DayPicker
        mode="single"
        selected={picked}
        onSelect={(d) => setPicked(d)}
        defaultMonth={defaultMonth ?? picked ?? today}
        today={today}
        weekStartsOn={1}
        showOutsideDays
        disabled={disabled}
        modifiers={{ marked: [...(marked ?? []), ...(markToday ? [today] : [])] }}
        formatters={{ formatWeekdayName }}
        classNames={CALENDAR_CLASSES}
        components={{ Caption: PickerCaption, Day: PickerDay }}
      />
      {footer && (
        <div className={cn("flex gap-date-picker-footer-gap p-date-picker-footer-pad", lineTop)}>
          <Button tone="neutral" variant="stroke" size="sm" className="flex-1" onClick={onCancel}>
            Cancel
          </Button>
          <Button size="sm" className="flex-1" onClick={() => onApply?.(picked)}>
            Apply
          </Button>
        </div>
      )}
    </div>
  );
}

// ---- Range Picker ----

const formatDate = (d: Date) => format(d, "MMM d, yyyy");

/** The picked range in words, after "Range:". */
function rangeWords(range: DateRange | undefined, pick: string | undefined) {
  if (!range?.from) return pick === "All time" ? pick : "";
  if (!range.to || isSameDay(range.from, range.to)) return formatDate(range.from);
  return `${formatDate(range.from)} - ${formatDate(range.to)}`;
}

export type RangePickerProps = {
  /** The picked range. Passing it (undefined for none) makes the caller own it. */
  value?: DateRange;
  defaultValue?: DateRange;
  onValueChange?: (range: DateRange | undefined) => void;
  /** The first of the two months on show. */
  defaultMonth?: Date;
  /** The quick picks on the left: the Figma's eight unless set; false for none. */
  quickPicks?: DatePickerQuickPickOption[] | false;
  marked?: Date[];
  markToday?: boolean;
  disabled?: Matcher | Matcher[];
  footer?: boolean;
  onApply?: (range: DateRange | undefined) => void;
  onCancel?: () => void;
  className?: string;
};

export function RangePicker(props: RangePickerProps) {
  const {
    value,
    defaultValue,
    onValueChange,
    defaultMonth,
    quickPicks = DATE_PICKER_QUICK_PICKS,
    marked,
    markToday = true,
    disabled,
    footer = true,
    onApply,
    onCancel,
    className,
  } = props;
  const today = useToday();
  const [range, setRange] = usePicked("value" in props, value, defaultValue, onValueChange);
  const [month, setMonth] = React.useState(() => startOfMonth(defaultMonth ?? range?.from ?? subMonths(today, 1)));
  const [pick, setPick] = React.useState<string>();

  const choose = (option: DatePickerQuickPickOption) => {
    const next = option.range(today);
    setPick(option.label);
    setRange(next);
    // Show the range's last day in the second month.
    setMonth(startOfMonth(subMonths(next?.to ?? today, 1)));
  };

  return (
    <div className={cn(panel, className)}>
      {quickPicks && (
        <div
          className={cn(
            "flex w-date-picker-picks shrink-0 flex-col gap-date-picker-picks-gap px-date-picker-picks-x pt-date-picker-picks-top pb-date-picker-picks-bottom",
            "ds-shadow [--ds-edge:var(--shadow-date-picker-line-right)]",
          )}
        >
          {quickPicks.map((option) => (
            <DatePickerQuickPick key={option.label} active={pick === option.label} onClick={() => choose(option)}>
              {option.label}
            </DatePickerQuickPick>
          ))}
        </div>
      )}
      <div className="flex flex-col">
        <DayPicker
          mode="range"
          numberOfMonths={2}
          selected={range}
          onSelect={(next) => {
            setPick(undefined);
            setRange(next);
          }}
          month={month}
          onMonthChange={setMonth}
          today={today}
          weekStartsOn={1}
          showOutsideDays
          disabled={disabled}
          modifiers={{ marked: [...(marked ?? []), ...(markToday ? [today] : [])] }}
          formatters={{ formatWeekdayName }}
          classNames={{ ...CALENDAR_CLASSES, caption_end: "ds-shadow [--ds-edge:var(--shadow-date-picker-line-left)]" }}
          components={{ Caption: PickerCaption, Day: PickerDay }}
        />
        {footer && (
          <div className={cn("flex items-center gap-date-picker-footer-gap p-date-picker-footer-pad pl-date-picker-footer-range-left", lineTop)}>
            <p className="min-w-0 flex-1 truncate">
              <span className="text-paragraph-sm text-text-sub-600">Range:</span>{" "}
              <span className="text-label-sm text-text-strong-950">{rangeWords(range, pick)}</span>
            </p>
            <Button tone="neutral" variant="stroke" size="sm" className="w-date-picker-footer-button" onClick={onCancel}>
              Cancel
            </Button>
            <Button size="sm" className="w-date-picker-footer-button" onClick={() => onApply?.(range)}>
              Apply
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// ---- Opening a picker under a field ----

export type DatePickerPopoverProps = {
  /** The field the picker opens under (one element that takes a ref). */
  anchor: React.ReactElement;
  /** The picker. */
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: "start" | "center" | "end";
  /** Words for screen readers, for the opened picker. */
  "aria-label"?: string;
};

const FOCUSABLE = "input, button, [tabindex]";

export function DatePickerPopover({
  anchor,
  children,
  open,
  onOpenChange,
  align = "start",
  "aria-label": label = "Choose a date",
}: DatePickerPopoverProps) {
  // Typed as Radix types it; at run time it is whatever element the field is.
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  // Closed by a click somewhere else: focus stays where the person clicked.
  const clickedAway = React.useRef(false);
  const inField = (target: EventTarget | null) => !!target && !!anchorRef.current?.contains(target as Node);

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <PopoverPrimitive.Anchor asChild ref={anchorRef}>
        {anchor}
      </PopoverPrimitive.Anchor>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          ref={contentRef}
          aria-label={label}
          align={align}
          sideOffset={0}
          // The gap is a token, kept as room inside what Radix measures.
          className="z-50 outline-none data-[side=bottom]:pt-date-picker-popover-gap data-[side=top]:pb-date-picker-popover-gap"
          // Opening: keyboard focus goes to the day the calendar offers
          // (the picked day, else today, else the 1st), not the first arrow.
          onOpenAutoFocus={(e) => {
            clickedAway.current = false;
            const day = contentRef.current?.querySelector<HTMLElement>('button[role="gridcell"][tabindex="0"]');
            if (day) {
              e.preventDefault();
              day.focus();
            }
          }}
          // A click on the field itself leaves the picker open.
          onInteractOutside={(e) => {
            if (inField(e.target)) e.preventDefault();
            else clickedAway.current = true;
          }}
          // Closing with Escape, Cancel or Apply: focus goes back to the field.
          onCloseAutoFocus={(e) => {
            if (clickedAway.current) return;
            const el = anchorRef.current;
            const field = el?.matches(FOCUSABLE) ? el : el?.querySelector<HTMLElement>(FOCUSABLE);
            if (field) {
              e.preventDefault();
              field.focus();
            }
          }}
        >
          {children}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

export { dayVariants as datePickerDayVariants };
export type { DateRange };
