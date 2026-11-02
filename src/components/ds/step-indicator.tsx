import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { CheckIcon, ChevronRightIcon } from "@/components/ui/icons";

/**
 * The design system's Step Indicator, built from
 * design-system/components/step-indicator.md (Nitesh's Figma "Step Indicator
 * Horizontal [1.1]", node 3507:28, "Step Indicator Vertical [1.1]", node
 * 3507:227, and "Stepper Dot [1.1]", node 479:14398).
 *
 *   <StepIndicator direction="horizontal" steps={["Account", "Workspace", "Invite"]} current={1} />
 *
 *   direction  horizontal (a row, chevrons between) | vertical (a column of rows)
 *   steps      the words, in order
 *   current    the active step, counted from 0; the steps before it are
 *              Completed, the ones after it Default
 *
 *   <StepMark state="active" number={2} />     the circle on its own
 *   <StepperDot size="sm" count={3} current={0} />   dots for short flows
 *
 * It shows where a person is; it is not a control. Sizes are the tokens in
 * styles/sizes/step-indicator.css.
 */
type StepState = "default" | "active" | "completed";
type Direction = "horizontal" | "vertical";

const markVariants = cva(
  "flex size-step-indicator-mark shrink-0 items-center justify-center rounded-step-indicator-mark p-step-indicator-mark-pad text-label-xs [&_svg]:size-step-indicator-tick",
  {
    variants: {
      state: {
        default: "ds-shadow bg-bg-white-0 text-text-sub-600",
        active: "bg-primary-base text-static-white",
        completed: "bg-state-success-base text-static-white",
      },
      // Default's edge: a 1px line in the row, the card shadow in the column.
      direction: { horizontal: "", vertical: "" },
    },
    compoundVariants: [
      { state: "default", direction: "horizontal", class: "edge-stroke-soft-200" },
      { state: "default", direction: "vertical", class: "lift-card" },
    ],
    defaultVariants: { state: "default", direction: "horizontal" },
  },
);

export type StepMarkProps = {
  state?: StepState;
  /** The step's number, shown in Default and Active; Completed shows a tick. */
  number: number;
  direction?: Direction;
  className?: string;
};

/** The 20 x 20 circle: the number, or a tick once the step is done. */
export function StepMark({ state = "default", number, direction = "horizontal", className }: StepMarkProps) {
  return (
    <span aria-hidden className={cn(markVariants({ state, direction }), className)}>
      {state === "completed" ? <CheckIcon /> : number}
    </span>
  );
}

const stateOf = (i: number, current: number): StepState => (i < current ? "completed" : i === current ? "active" : "default");

const stepVariants = cva("m-space-0 flex items-center whitespace-nowrap text-paragraph-sm", {
  variants: {
    direction: {
      horizontal: "h-step-indicator-step gap-step-indicator-step-gap",
      vertical: "ds-shadow h-step-indicator-row gap-step-indicator-row-gap rounded-step-indicator-row p-step-indicator-row-pad",
    },
    state: { default: "", active: "", completed: "" },
  },
  compoundVariants: [
    { direction: "horizontal", state: "default", class: "text-text-sub-600" },
    { direction: "horizontal", state: "active", class: "text-text-strong-950" },
    { direction: "horizontal", state: "completed", class: "text-text-strong-950" },
    { direction: "vertical", state: "default", class: "bg-bg-weak-50 text-text-sub-600" },
    { direction: "vertical", state: "active", class: "bg-bg-white-0 lift-card text-text-strong-950" },
    { direction: "vertical", state: "completed", class: "bg-bg-weak-50 text-text-sub-600" },
  ],
  defaultVariants: { direction: "horizontal", state: "default" },
});

export type StepIndicatorProps = Omit<React.ComponentProps<"ol">, "children"> & {
  direction?: Direction;
  steps: React.ReactNode[];
  /** The active step, counted from 0. */
  current: number;
};

export function StepIndicator({ direction = "horizontal", steps, current, className, ...props }: StepIndicatorProps) {
  const vertical = direction === "vertical";
  return (
    // m-space-0, p-space-0 and list-none undo the app's base list styles.
    <ol
      className={cn(
        "m-space-0 flex list-none p-space-0",
        vertical ? "flex-col gap-step-indicator-v-gap" : "items-center gap-step-indicator-h-gap",
        className,
      )}
      {...props}
    >
      {steps.map((step, i) => {
        const state = stateOf(i, current);
        return (
          <React.Fragment key={i}>
            {!vertical && i > 0 && (
              <li aria-hidden className="m-space-0 flex shrink-0 text-icon-soft-400 [&_svg]:size-step-indicator-chevron">
                <ChevronRightIcon />
              </li>
            )}
            <li aria-current={state === "active" ? "step" : undefined} className={stepVariants({ direction, state })}>
              <StepMark state={state} number={i + 1} direction={direction} />
              <span className={cn(vertical && "min-w-0 flex-1 truncate")}>
                {step}
                {state === "completed" && <span className="sr-only">, completed</span>}
              </span>
              {vertical && state === "active" && (
                <span aria-hidden className="flex shrink-0 text-icon-sub-600 [&_svg]:size-step-indicator-chevron">
                  <ChevronRightIcon />
                </span>
              )}
            </li>
          </React.Fragment>
        );
      })}
    </ol>
  );
}

const dotVariants = cva("flex items-center", {
  variants: {
    size: {
      sm: "gap-step-indicator-dot-sm-gap [&>span]:size-step-indicator-dot-sm",
      xs: "gap-step-indicator-dot-xs-gap [&>span]:size-step-indicator-dot-xs",
    },
  },
  defaultVariants: { size: "sm" },
});

export type StepperDotProps = {
  /** sm: 8 x 8 dots, 10 apart | xs: 4 x 4 dots, 6 apart. */
  size?: "sm" | "xs";
  /** How many dots; the Figma draws three. */
  count?: number;
  /** The current step, counted from 0. */
  current: number;
  className?: string;
};

/** Dots for short flows: the current step's dot is primary/base, the others bg/soft-200. */
export function StepperDot({ size = "sm", count = 3, current, className }: StepperDotProps) {
  return (
    <div role="img" aria-label={`Step ${current + 1} of ${count}`} className={cn(dotVariants({ size }), className)}>
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className={cn("shrink-0 rounded-step-indicator-dot", i === current ? "bg-primary-base" : "bg-bg-soft-200")} />
      ))}
    </div>
  );
}
