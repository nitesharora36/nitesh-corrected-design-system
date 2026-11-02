"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cva } from "class-variance-authority";

import { Button } from "@/components/ds/button";
import { useControllableState } from "@/components/ds/checkbox";
import { CompactButton } from "@/components/ds/compact-button";
import { CheckCircleIcon, ClockIcon, CloseIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/**
 * The design system's Time Picker, built from
 * design-system/components/time-picker.md (Nitesh's Figma "Time Picker
 * Items" 165483:5687, "Time Picker Select Duration" 165483:6046, "Time
 * Picker Select Status" 165596:41348, and the picker in "Time Picker
 * [Examples]" 166102:5347). A list of times, with duration chips above it
 * when a length can be picked. Never the browser's time input.
 *
 * TimePicker    the assembled picker: header (the picked time, close), the
 *               durations row, the list with its scroll bar, Cancel and Apply.
 *               value (minutes after midnight), onValueChange, options,
 *               durations, duration, onDurationChange, onApply, onCancel, onClose
 * TimePickerPopover  opens a picker under a field, in a popover (page, "In code")
 * TimeList      the list alone (a list box: arrow keys move, Enter picks; the
 *               picked item scrolls into view when it first shows)
 * TimeItem      one time, or a from and a to time (a slot). tick right | center,
 *               active, disabled
 * DurationChip  a length ("30 min"). active, disabled
 * StatusChip    a person's status for a slot. status available | busy |
 *               in-meeting | offline, selected, disabled
 *
 * Times are minutes after midnight; hour12 (on unless false) shows "09:30 AM".
 * Proposals the page makes (Open): the Date Picker's frame, shadow and footer;
 * a 4 gap between "09:30" and "AM"; the durations row scrolls sideways with
 * no scroll bar; Hugeicons' tick in a circle, filled; a picked chip keeps its
 * look on hover; keyboard focus shows the Neutral ring. Sizes are the tokens
 * in styles/sizes/time-picker.css.
 */

// ---- Times ----

const two = (n: number) => String(n).padStart(2, "0");

/** "09:30" and "AM" (or "21:30" and no period when hour12 is off). */
export function splitTime(minutes: number, hour12 = true): { digits: string; period?: string } {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  if (!hour12) return { digits: `${two(h)}:${two(m)}` };
  return { digits: `${two(h % 12 === 0 ? 12 : h % 12)}:${two(m)}`, period: h < 12 ? "AM" : "PM" };
}

/** Times from `start` to `end` (minutes after midnight), every `step` minutes. */
export function timesBetween(start: number, end: number, step: number): TimeOption[] {
  const out: TimeOption[] = [];
  for (let t = start; t <= end; t += step) out.push({ from: t });
  return out;
}

/** One time in the Figma's two colours: the digits, then the period. */
function TimeText({ minutes, hour12, digits, period }: { minutes: number; hour12: boolean; digits: string; period: string }) {
  const t = splitTime(minutes, hour12);
  return (
    <span className="inline-flex items-baseline gap-time-picker-time-gap whitespace-nowrap">
      <span className={digits}>{t.digits}</span>
      {t.period && <span className={period}>{t.period}</span>}
    </span>
  );
}

/** Hugeicons' tick in a circle, filled (page, Open): the circle in the
 *  colour around it, the tick cut out in white. */
const filledTick = "flex shrink-0 [&_svg]:size-full [&_path:first-child]:fill-current [&_path:last-child]:text-static-white";

// ---- Time item ----

export type TimeOption = {
  /** Minutes after midnight. */
  from: number;
  /** A slot's end time, shown on the right. */
  to?: number;
  disabled?: boolean;
};

export type TimeItemProps = Omit<React.ComponentProps<"div">, "children"> & {
  from: number;
  to?: number;
  hour12?: boolean;
  /** Where the tick sits on the picked item: the end of the row, or between the two times. */
  tick?: "right" | "center";
  active?: boolean;
  disabled?: boolean;
  "data-force"?: "hover" | "focus";
};

export function TimeItem({ from, to, hour12 = true, tick = "right", active, disabled, className, tabIndex = -1, ...props }: TimeItemProps) {
  const digits = disabled ? "text-text-disabled-300" : active ? "text-text-strong-950" : "text-text-sub-600";
  const period = disabled ? "text-text-disabled-300" : "text-text-soft-400";
  const mark = active && !disabled && (
    <span aria-hidden className={cn(filledTick, "size-time-picker-item-tick text-primary-base")}>
      <CheckCircleIcon />
    </span>
  );
  return (
    <div
      role="option"
      aria-selected={!!active}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? undefined : tabIndex}
      className={cn(
        "ds-shadow flex h-time-picker-item w-full shrink-0 items-center gap-time-picker-item-gap rounded-time-picker-item px-time-picker-item-x py-time-picker-item-y text-label-sm outline-none",
        "transition-[background-color,box-shadow] duration-150 ds-focus:ring-focus-neutral",
        disabled ? "cursor-not-allowed bg-bg-white-0" : active ? "cursor-pointer bg-bg-weak-50" : "cursor-pointer bg-bg-white-0 ds-hover:bg-bg-weak-50",
        className,
      )}
      {...props}
    >
      <span className="flex min-w-0 flex-1">
        <TimeText minutes={from} hour12={hour12} digits={digits} period={period} />
      </span>
      {tick === "center" && to != null && mark}
      {to != null && (
        <span className="flex min-w-0 flex-1 justify-end">
          <TimeText minutes={to} hour12={hour12} digits={digits} period={period} />
        </span>
      )}
      {(tick === "right" || to == null) && mark}
    </div>
  );
}

// ---- Time list ----

export type TimeListProps = Omit<React.ComponentProps<"div">, "onChange" | "defaultValue"> & {
  options: TimeOption[];
  /** The picked item's `from`. */
  value?: number;
  defaultValue?: number;
  onValueChange?: (minutes: number) => void;
  tick?: "right" | "center";
  hour12?: boolean;
  /** The box the list scrolls in. When the list first shows, the picked item
   *  scrolls to its middle (page, "In code"). */
  scrollBox?: React.RefObject<HTMLElement | null>;
};

export function TimeList({ options, value, defaultValue, onValueChange, tick, hour12 = true, scrollBox, className, ...props }: TimeListProps) {
  const [picked, setPicked] = useControllableState<number | undefined>(value, defaultValue, (v) => v != null && onValueChange?.(v));
  const items = React.useRef<(HTMLDivElement | null)[]>([]);
  const enabled = options.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0);
  const pickedIndex = options.findIndex((o) => o.from === picked && !o.disabled);
  // The one item in the tab order: the picked one, else the first that can be picked.
  const [focusIndex, setFocusIndex] = React.useState(pickedIndex >= 0 ? pickedIndex : (enabled[0] ?? 0));

  // Once, when the list first shows: the picked item to the middle of its box.
  React.useEffect(() => {
    const box = scrollBox?.current;
    const item = items.current[pickedIndex];
    if (!box || !item) return;
    const offset = item.getBoundingClientRect().top - box.getBoundingClientRect().top;
    box.scrollTop += offset - (box.clientHeight - item.offsetHeight) / 2;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const move = (to: number) => {
    setFocusIndex(to);
    items.current[to]?.focus();
  };
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const at = enabled.indexOf(focusIndex);
    if (e.key === "ArrowDown") move(enabled[Math.min(at + 1, enabled.length - 1)]);
    else if (e.key === "ArrowUp") move(enabled[Math.max(at - 1, 0)]);
    else if (e.key === "Home") move(enabled[0]);
    else if (e.key === "End") move(enabled[enabled.length - 1]);
    else if (e.key === "Enter" || e.key === " ") setPicked(options[focusIndex].from);
    else return;
    e.preventDefault();
  };

  return (
    <div
      role="listbox"
      onKeyDown={onKeyDown}
      className={cn("flex flex-col gap-time-picker-list-gap p-time-picker-list-pad", className)}
      {...props}
    >
      {options.map((o, i) => (
        <TimeItem
          key={`${o.from}-${o.to ?? ""}`}
          ref={(el) => {
            items.current[i] = el;
          }}
          from={o.from}
          to={o.to}
          hour12={hour12}
          tick={tick}
          active={o.from === picked}
          disabled={o.disabled}
          tabIndex={i === focusIndex ? 0 : -1}
          onFocus={() => setFocusIndex(i)}
          onClick={() => !o.disabled && setPicked(o.from)}
        />
      ))}
    </div>
  );
}

// ---- Duration chip ----

const durationVariants = cva(
  [
    "ds-shadow inline-flex h-time-picker-duration shrink-0 cursor-pointer items-center gap-time-picker-duration-gap whitespace-nowrap rounded-time-picker-duration px-time-picker-duration-x py-time-picker-duration-y text-label-sm outline-none",
    "transition-[background-color,color,box-shadow] duration-150 ds-focus:ring-focus-neutral",
    "disabled:cursor-not-allowed disabled:bg-bg-weak-50 disabled:text-text-disabled-300 disabled:edge-none disabled:lift-none",
  ],
  {
    variants: {
      active: {
        false: "bg-bg-white-0 text-text-sub-600 edge-stroke-soft-200 lift-card ds-hover:bg-bg-weak-50 ds-hover:lift-none",
        // A picked chip keeps its look under the pointer (page, Open).
        true: "bg-primary-alpha-10 text-primary-base",
      },
    },
    defaultVariants: { active: false },
  },
);

export type DurationChipProps = React.ComponentProps<"button"> & {
  active?: boolean;
  "data-force"?: "hover" | "focus";
};

export function DurationChip({ active = false, children, className, type = "button", ...props }: DurationChipProps) {
  return (
    <button type={type} aria-pressed={active} className={cn(durationVariants({ active }), className)} {...props}>
      {active && (
        <span aria-hidden className={cn(filledTick, "size-time-picker-duration-tick")}>
          <CheckCircleIcon />
        </span>
      )}
      {children}
    </button>
  );
}

// ---- Status chip ----

export type TimeStatus = "available" | "busy" | "in-meeting" | "offline";

/** Each status is one of the Figma's state token groups. Written out so Tailwind sees them. */
const STATUS: Record<TimeStatus, { label: string; dot: string; selected: string }> = {
  available: { label: "Available", dot: "bg-state-success-base", selected: "bg-state-success-lighter text-state-success-dark" },
  busy: { label: "Busy", dot: "bg-state-error-base", selected: "bg-state-error-lighter text-state-error-dark" },
  "in-meeting": { label: "In-meeting", dot: "bg-state-warning-base", selected: "bg-state-warning-lighter text-state-warning-dark" },
  offline: { label: "Offline", dot: "bg-state-faded-base", selected: "bg-state-faded-lighter text-state-faded-dark" },
};

export type StatusChipProps = React.ComponentProps<"button"> & {
  status: TimeStatus;
  selected?: boolean;
  "data-force"?: "hover" | "focus";
};

export function StatusChip({ status, selected, disabled, children, className, type = "button", ...props }: StatusChipProps) {
  const s = STATUS[status];
  return (
    <button
      type={type}
      aria-pressed={!!selected}
      disabled={disabled}
      className={cn(
        "ds-shadow inline-flex h-time-picker-status shrink-0 cursor-pointer items-center gap-time-picker-status-gap whitespace-nowrap rounded-time-picker-status py-time-picker-status-y pr-time-picker-status-right pl-time-picker-status-left text-label-sm outline-none",
        "transition-[background-color,color,box-shadow] duration-150 ds-focus:ring-focus-neutral",
        "disabled:cursor-not-allowed disabled:bg-bg-weak-50 disabled:text-text-disabled-300 disabled:edge-none disabled:lift-none",
        selected ? s.selected : "bg-bg-white-0 text-text-sub-600 edge-stroke-soft-200 lift-card ds-hover:bg-bg-weak-50 ds-hover:lift-none",
        className,
      )}
      {...props}
    >
      <span aria-hidden className="flex size-time-picker-status-dot-space shrink-0 items-center justify-center">
        <span className={cn("size-time-picker-status-dot rounded-time-picker-status-dot", disabled ? "bg-icon-disabled-300" : s.dot)} />
      </span>
      {children ?? s.label}
    </button>
  );
}

// ---- The scroll bar beside the list ----

/** The list's own scroll bar, as the Figma draws it: 16 wide, a line on its
 *  left, a 4 x 48 thumb. The browser's own bar is hidden. Drag the thumb, or
 *  scroll the list. */
function useScrollThumb() {
  const viewport = React.useRef<HTMLDivElement>(null);
  const track = React.useRef<HTMLDivElement>(null);
  const thumb = React.useRef<HTMLSpanElement>(null);
  const [state, setState] = React.useState({ offset: 0, show: false });

  const room = () => {
    const v = viewport.current;
    const t = track.current;
    const th = thumb.current;
    if (!v || !t || !th) return null;
    return { scroll: v.scrollHeight - v.clientHeight, travel: t.clientHeight - th.offsetHeight };
  };
  const sync = React.useCallback(() => {
    const r = room();
    const v = viewport.current;
    if (!r || !v) return;
    setState({ offset: r.scroll > 0 ? (v.scrollTop / r.scroll) * r.travel : 0, show: r.scroll > 0 });
  }, []);

  const startDrag = (e: React.PointerEvent<HTMLSpanElement>) => {
    const v = viewport.current;
    const r = room();
    if (!v || !r || r.travel <= 0) return;
    e.preventDefault();
    const el = e.currentTarget;
    const startY = e.clientY;
    const startTop = v.scrollTop;
    el.setPointerCapture(e.pointerId);
    const onMove = (ev: PointerEvent) => {
      v.scrollTop = startTop + ((ev.clientY - startY) * r.scroll) / r.travel;
    };
    const end = () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", end);
      el.removeEventListener("pointercancel", end);
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
  };

  return { viewport, track, thumb, state, sync, startDrag };
}

// ---- The assembled picker ----

export type TimePickerDuration = { label: string; minutes: number; disabled?: boolean };

export type TimePickerProps = {
  value?: number;
  defaultValue?: number;
  onValueChange?: (minutes: number) => void;
  /** The times in the list: every 30 minutes of the day unless set. */
  options?: TimeOption[];
  /** The duration chips above the list; none, no row. */
  durations?: TimePickerDuration[];
  duration?: number;
  defaultDuration?: number;
  onDurationChange?: (minutes: number) => void;
  tick?: "right" | "center";
  hour12?: boolean;
  onApply?: (picked: { time?: number; duration?: number }) => void;
  onCancel?: () => void;
  onClose?: () => void;
  className?: string;
};

const EVERY_HALF_HOUR = timesBetween(0, 23 * 60 + 30, 30);

export function TimePicker({
  value,
  defaultValue,
  onValueChange,
  options = EVERY_HALF_HOUR,
  durations,
  duration,
  defaultDuration,
  onDurationChange,
  tick,
  hour12 = true,
  onApply,
  onCancel,
  onClose,
  className,
}: TimePickerProps) {
  const [time, setTime] = useControllableState<number | undefined>(value, defaultValue, (v) => v != null && onValueChange?.(v));
  const [length, setLength] = useControllableState<number | undefined>(duration, defaultDuration, (v) => v != null && onDurationChange?.(v));
  const scroll = useScrollThumb();
  const { sync } = scroll;

  // Place the thumb once the list has scrolled the picked time into view
  // (the list does that first), and again when the times change.
  React.useEffect(() => {
    sync();
  }, [sync, options]);

  return (
    <div
      className={cn(
        "ds-shadow flex w-time-picker flex-col overflow-hidden rounded-time-picker bg-bg-white-0 edge-stroke-soft-200 [--ds-lift:var(--shadow-time-picker-panel)]",
        className,
      )}
    >
      <div className="ds-shadow flex h-time-picker-header shrink-0 items-center gap-time-picker-header-gap px-time-picker-header-x py-time-picker-header-y [--ds-edge:var(--shadow-time-picker-line-bottom)]">
        <span aria-hidden className="flex shrink-0 text-icon-soft-400 [&_svg]:size-time-picker-header-icon">
          <ClockIcon />
        </span>
        <span className="flex min-w-0 flex-1 text-label-md">
          {time != null && <TimeText minutes={time} hour12={hour12} digits="text-text-sub-600" period="text-text-soft-400" />}
        </span>
        {onClose && (
          <CompactButton variant="ghost" size="lg" fullRadius aria-label="Close" onClick={onClose}>
            <CloseIcon />
          </CompactButton>
        )}
      </div>

      {durations && durations.length > 0 && (
        <div
          role="group"
          aria-label="Duration"
          className={cn(
            "ds-shadow flex shrink-0 gap-time-picker-durations-gap overflow-x-auto px-time-picker-durations-x py-time-picker-durations-y [--ds-edge:var(--shadow-time-picker-line-bottom)]",
            "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          )}
        >
          {durations.map((d) => (
            <DurationChip key={d.minutes} active={length === d.minutes} disabled={d.disabled} onClick={() => setLength(d.minutes)}>
              {d.label}
            </DurationChip>
          ))}
        </div>
      )}

      <div className="flex h-time-picker-times shrink-0">
        <div
          ref={scroll.viewport}
          onScroll={sync}
          className="relative min-w-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <TimeList
            aria-label="Time"
            options={options}
            value={time}
            onValueChange={setTime}
            tick={tick}
            hour12={hour12}
            scrollBox={scroll.viewport}
          />
        </div>
        <div
          aria-hidden
          className="ds-shadow flex w-time-picker-scrollbar shrink-0 px-time-picker-scrollbar-x py-time-picker-scrollbar-y [--ds-edge:var(--shadow-time-picker-line-left)]"
        >
          <div ref={scroll.track} className="relative flex-1">
            <span
              ref={scroll.thumb}
              onPointerDown={scroll.startDrag}
              style={{ transform: `translateY(${scroll.state.offset}px)` }}
              className={cn(
                "absolute top-space-0 left-space-0 h-time-picker-thumb-h w-time-picker-thumb-w touch-none rounded-time-picker-thumb bg-bg-sub-300",
                !scroll.state.show && "invisible",
              )}
            />
          </div>
        </div>
      </div>

      <div className="ds-shadow flex shrink-0 gap-time-picker-footer-gap p-time-picker-footer-pad [--ds-edge:var(--shadow-time-picker-line-top)]">
        <Button tone="neutral" variant="stroke" size="sm" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="sm" className="flex-1" onClick={() => onApply?.({ time, duration: length })}>
          Apply
        </Button>
      </div>
    </div>
  );
}

// ---- Opening the picker under a field ----

export type TimePickerPopoverProps = {
  /** The field the picker opens under (one element that takes a ref). */
  anchor: React.ReactElement;
  /** The picker. */
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: "start" | "center" | "end";
};

/** The picker in a popover under its field (page, "In code"), with the Date
 *  Picker's gap. The picker draws its own frame, edge and shadow. */
export function TimePickerPopover({ anchor, children, open, onOpenChange, align = "start" }: TimePickerPopoverProps) {
  return (
    <PopoverPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <PopoverPrimitive.Anchor asChild>{anchor}</PopoverPrimitive.Anchor>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align={align}
          sideOffset={0}
          // The gap is a token, kept as room inside what Radix measures.
          className="z-50 outline-none data-[side=bottom]:pt-time-picker-popover-gap data-[side=top]:pb-time-picker-popover-gap"
        >
          {children}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

export { durationVariants };
