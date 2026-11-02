"use client";

import * as React from "react";

import { FieldLabel, HintText } from "@/components/ds/label";
import { fieldLookVariants, fieldTextClass, useFieldLook, useJoinedRef } from "@/components/ds/text-input";
import { InfoIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/**
 * The design system's Text Area, built from design-system/components/text-area.md
 * (Nitesh's Figma "Text Area [1.1]", node 435:5725, with its "Character
 * Counter [1.1]", node 435:5712). One size. It shares its label, hint and
 * states with the Text Input (fieldLookVariants, useFieldLook), so the two
 * stay in step.
 *
 *   label, required, optional, info, labelLink   the label row
 *   hint, hintIcon, error                        the hint row
 *   limit       shows the count ("0/200"); over it, the counter turns red
 *   resizable   the 12 x 12 resize handle (on unless false): drag it to
 *               make the writing area taller, never shorter than its 72
 *
 * data-force="hover" or "focus" shows a state on the Components page. Sizes
 * are the tokens in styles/sizes/text-area.css.
 */

export type TextAreaProps = Omit<React.ComponentProps<"textarea">, "children"> & {
  label?: React.ReactNode;
  required?: boolean;
  optional?: boolean;
  info?: boolean;
  labelLink?: React.ReactNode;
  hint?: React.ReactNode;
  /** The hint's 16 x 16 icon: InfoIcon unless set; null for none. */
  hintIcon?: React.ReactNode;
  error?: boolean;
  /** The most characters; shows the count in the counter row. */
  limit?: number;
  /** The resize handle in the counter row. On unless false. */
  resizable?: boolean;
  "data-force"?: "hover" | "focus";
};

const COUNT = { default: "text-text-soft-400", error: "text-state-error-base", disabled: "text-text-disabled-300" } as const;
const HANDLE = { default: "text-icon-soft-400", error: "text-state-error-base", disabled: "text-icon-disabled-300" } as const;

export function TextArea({
  label,
  required,
  optional,
  info,
  labelLink,
  hint,
  hintIcon,
  error,
  limit,
  resizable = true,
  className,
  id,
  disabled,
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  ref,
  "data-force": force,
  "aria-describedby": describedBy,
  ...props
}: TextAreaProps) {
  const autoId = React.useId();
  const areaId = id ?? autoId;
  const hintId = `${areaId}-hint`;
  const [areaRef, joinRef] = useJoinedRef(ref);
  const { look, text, setTyped, setHasFocus } = useFieldLook({ disabled, error, force, value, defaultValue });

  // The counter turns red only over the limit, not for an error elsewhere.
  const counter = disabled ? "disabled" : limit != null && text.length > limit ? "error" : "default";
  const showCounter = limit != null || resizable;

  const focusArea = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || (e.target as HTMLElement).closest("textarea, button, a, [data-resize]")) return;
    e.preventDefault();
    areaRef.current?.focus();
  };

  // Drag the handle to set the writing area's height; its min-height (72)
  // keeps it from going under where it started.
  const startResize = (e: React.PointerEvent<HTMLSpanElement>) => {
    const area = areaRef.current;
    if (disabled || !area) return;
    e.preventDefault();
    const handle = e.currentTarget;
    const startY = e.clientY;
    const startHeight = area.getBoundingClientRect().height;
    handle.setPointerCapture(e.pointerId);
    const move = (ev: PointerEvent) => {
      area.style.height = `${startHeight + ev.clientY - startY}px`;
    };
    const end = () => {
      handle.removeEventListener("pointermove", move);
      handle.removeEventListener("pointerup", end);
      handle.removeEventListener("pointercancel", end);
    };
    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", end);
    handle.addEventListener("pointercancel", end);
  };

  return (
    <div className={cn("flex w-full flex-col gap-text-area-stack", className)}>
      {label != null && (
        <FieldLabel htmlFor={areaId} required={required} optional={optional} info={info} link={labelLink}>
          {label}
        </FieldLabel>
      )}

      <div
        data-force={force === "hover" ? "hover" : undefined}
        onMouseDown={focusArea}
        className={cn(
          "group/field flex w-full flex-col gap-text-area-gap rounded-text-area pt-text-area-top pr-text-area-right pb-text-area-bottom pl-text-area-left",
          fieldLookVariants({ look }),
        )}
      >
        <textarea
          ref={joinRef}
          id={areaId}
          disabled={disabled}
          value={value}
          defaultValue={defaultValue}
          aria-invalid={error || undefined}
          aria-required={required || undefined}
          aria-describedby={[hint != null ? hintId : null, describedBy].filter(Boolean).join(" ") || undefined}
          onChange={(e) => {
            setTyped(e.target.value);
            onChange?.(e);
          }}
          onFocus={(e) => {
            setHasFocus(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setHasFocus(false);
            onBlur?.(e);
          }}
          className={cn(
            "h-text-area-writing min-h-text-area-writing w-full resize-none bg-transparent text-paragraph-sm outline-none",
            fieldTextClass(look),
          )}
          {...props}
        />

        {showCounter && (
          <div className="flex h-text-area-counter items-center justify-end gap-text-area-counter-gap">
            {limit != null && (
              <span className={cn("text-subheading-2xs uppercase", COUNT[counter])}>
                {text.length}/{limit}
              </span>
            )}
            {resizable && (
              <span
                aria-hidden
                data-resize=""
                onPointerDown={startResize}
                className={cn(
                  "flex size-text-area-handle shrink-0 touch-none",
                  disabled ? "cursor-not-allowed" : "cursor-ns-resize",
                  HANDLE[counter],
                )}
              >
                <svg viewBox="0 0 12 12" fill="none" className="size-full">
                  <path d="M10 2.5 2.5 10M10 6.5 6.5 10" stroke="currentColor" strokeWidth={1} strokeLinecap="round" />
                </svg>
              </span>
            )}
          </div>
        )}
      </div>

      {hint != null && (
        <HintText id={hintId} state={disabled ? "disabled" : error ? "error" : "default"} icon={hintIcon === undefined ? <InfoIcon /> : hintIcon}>
          {hint}
        </HintText>
      )}
    </div>
  );
}
