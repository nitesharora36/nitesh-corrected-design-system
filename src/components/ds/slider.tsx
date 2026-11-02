"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { useControllableState } from "@/components/ds/checkbox";
import { TooltipPanel } from "@/components/ds/tooltip";
import { cn } from "@/lib/utils";

/**
 * The design system's Slider and Range Slider, built from
 * design-system/components/slider.md (Nitesh's Figma "Slider [1.1]"
 * 2617:1169 and "Range Slider [1.1]" 2617:1588), on Radix's slider. One
 * value gives one dot (Slider), two values two dots (Range Slider).
 *
 *   value, defaultValue, onValueChange, min, max, step, disabled   as Radix
 *              (one value or two; it is always horizontal, as the Figma)
 *   label      the label row: the label, "(Optional)" (optional) and the value
 *              on the right (showValue, on unless false)
 *   tooltip    the value in a Tooltip (2X-Small, Dark) above each dot; it
 *              rises above the slider row, so with the label row on too it
 *              covers the row (the page does not say how the two stack)
 *   format    how a value reads, for example (v) => `$${v}`
 *   aria-label the dots' name when there is no label row
 *
 * A Range Slider's two dots read as "from" and "to" after the name.
 * The dot's centre is the value, so at either end it hangs 8 past the track
 * (one rule for every dot, the page's "Where this differs"). With nothing
 * picked (a Slider at its start, a Range Slider at both ends) the dots'
 * centres and the line between them turn bg/soft-200. Proposals the page
 * makes (Open): Hover turns the filled part and the centres primary/dark;
 * keyboard focus puts the Primary ring around the dot; Disabled greys them
 * and drops the dot's shadow. data-force="hover" or "focus" shows a state on
 * the Components page. Sizes are the tokens in styles/sizes/slider.css.
 */

export type SliderProps = Omit<
  React.ComponentProps<typeof SliderPrimitive.Root>,
  "children" | "value" | "defaultValue" | "onValueChange" | "orientation"
> & {
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
  label?: React.ReactNode;
  optional?: boolean;
  /** The value at the right end of the label row. On unless false. */
  showValue?: boolean;
  tooltip?: boolean;
  format?: (value: number) => string;
  "data-force"?: "hover" | "focus";
};

export function Slider({
  value,
  defaultValue,
  onValueChange,
  min = 0,
  max = 100,
  disabled,
  label,
  optional,
  showValue = true,
  tooltip,
  format = String,
  className,
  "data-force": force,
  "aria-label": ariaLabel,
  ...props
}: SliderProps) {
  const [values, setValues] = useControllableState<number[]>(value, defaultValue ?? [min], onValueChange);
  const labelId = React.useId();
  const range = values.length > 1;
  // Nothing picked yet: a Slider at its start, a Range Slider at both ends.
  const zero = range ? values[0] <= min && values[values.length - 1] >= max : values[0] <= min;
  const colour = disabled ? "bg-icon-disabled-300" : zero ? "bg-bg-soft-200" : "bg-primary-base group-ds-hover/slider:bg-primary-dark";

  return (
    <div className={cn("flex w-full flex-col gap-slider-stack", className)}>
      {label != null && (
        <div className="flex h-slider-label items-center gap-slider-label-gap text-paragraph-xs">
          <span id={labelId} className={disabled ? "text-text-disabled-300" : "text-text-sub-600"}>
            {label}
          </span>
          {optional && <span className={disabled ? "text-text-disabled-300" : "text-text-soft-400"}>(Optional)</span>}
          {showValue && (
            <span className={cn("min-w-0 flex-1 truncate text-right", disabled ? "text-text-disabled-300" : "text-text-sub-600")}>
              {values.map((v) => format(v)).join(" - ")}
            </span>
          )}
        </div>
      )}

      <SliderPrimitive.Root
        value={values}
        onValueChange={setValues}
        min={min}
        max={max}
        disabled={disabled}
        data-force={force === "hover" ? "hover" : undefined}
        className="group/slider relative flex h-slider-row w-full touch-none select-none items-center data-disabled:cursor-not-allowed"
        {...props}
      >
        <SliderPrimitive.Track className="relative h-slider-track w-full grow overflow-hidden rounded-slider-track bg-bg-soft-200">
          <SliderPrimitive.Range className={cn("absolute h-full rounded-slider-track transition-colors duration-150", colour)} />
        </SliderPrimitive.Track>

        {values.map((v, i) => {
          // A Range Slider's dots: the name, then "from" or "to".
          const end = range ? (i === 0 ? "from" : "to") : undefined;
          const thumbId = `${labelId}-${i}`;
          return (
            // The thumb itself takes no room, so Radix puts it exactly on the
            // value (no inset at the ends); the dot is drawn around it.
            <SliderPrimitive.Thumb
              key={i}
              id={thumbId}
              aria-label={ariaLabel && end ? `${ariaLabel}, ${end}` : (ariaLabel ?? end)}
              aria-labelledby={label != null ? (end ? `${labelId} ${thumbId}` : labelId) : undefined}
              aria-valuetext={format(v)}
              data-force={force === "focus" ? "focus" : undefined}
              className="group/thumb relative block size-space-0 outline-none"
            >
              <span
                aria-hidden
                className={cn(
                  "ds-shadow absolute -top-slider-dot-half -left-slider-dot-half flex size-slider-dot items-center justify-center rounded-slider-dot bg-static-white",
                  "transition-[box-shadow] duration-150 group-ds-focus/thumb:ring-focus-primary",
                  disabled ? "" : "cursor-grab [--ds-lift:var(--shadow-slider-dot)]",
                )}
              >
                <span className={cn("size-slider-dot-centre rounded-slider-dot transition-colors duration-150", colour)} />
              </span>
              {tooltip && (
                // Centred over the dot, the tail's tip 4 above it.
                <span aria-hidden className="pointer-events-none absolute inset-x-space-0 bottom-slider-tooltip-bottom flex justify-center">
                  <TooltipPanel size="2xs" variant="dark" tail="bottom-center">
                    {format(v)}
                  </TooltipPanel>
                </span>
              )}
            </SliderPrimitive.Thumb>
          );
        })}
      </SliderPrimitive.Root>
    </div>
  );
}
