import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ds/button";

/**
 * The design system's Content Divider, built from
 * design-system/components/content-divider.md (Nitesh's Figma "Content
 * Divider [1.1]", node 414:4401). Every line that separates content is this;
 * never a hand-drawn border or <hr>.
 *
 *   type  line | line-spacing | text-line | text | solid-text |
 *         icon-button | icon-button-group | text-button | text-button-group
 *
 *   text-line, text, solid-text   children is the word ("OR", "Today")
 *   icon-button                   icon, buttonLabel (its aria-label), onButtonClick
 *   text-button                   children is the Button's word; icon goes before it
 *   *-button-group                children is the Button Group (X-Small, 32)
 *
 * The buttons are the Button, Neutral, Stroke, X-Small (32). Every type takes
 * the full width of its container. Lines are 1px in stroke/soft-200. Sizes
 * are the tokens in styles/sizes/content-divider.css.
 */

export type ContentDividerType =
  | "line"
  | "line-spacing"
  | "text-line"
  | "text"
  | "solid-text"
  | "icon-button"
  | "icon-button-group"
  | "text-button"
  | "text-button-group";

export type ContentDividerProps = Omit<React.ComponentProps<"div">, "children"> & {
  type?: ContentDividerType;
  /** The word, the Text Button's word, or the Button Group. */
  children?: React.ReactNode;
  /** The Icon Button's icon, or an icon before the Text Button's word. */
  icon?: React.ReactNode;
  /** The Icon Button's words for screen readers. */
  buttonLabel?: string;
  /** What pressing the button does (Icon Button, Text Button). */
  onButtonClick?: React.MouseEventHandler<HTMLButtonElement>;
};

/** One of the two lines either side of a word, button or group. */
function Rule() {
  return <span aria-hidden className="h-content-divider-line min-w-0 flex-1 bg-stroke-soft-200" />;
}

export function ContentDivider({
  type = "line",
  children,
  icon,
  buttonLabel,
  onButtonClick,
  className,
  ...props
}: ContentDividerProps) {
  switch (type) {
    case "line":
      return (
        <div role="separator" className={cn("h-content-divider-line w-full shrink-0 bg-stroke-soft-200", className)} {...props} />
      );

    case "line-spacing":
      // 4 tall: the line with 1.5 above and below.
      return (
        <div
          role="separator"
          className={cn("flex h-content-divider-spacing w-full shrink-0 flex-col justify-center py-content-divider-spacing-y", className)}
          {...props}
        >
          <span className="h-content-divider-line w-full bg-stroke-soft-200" />
        </div>
      );

    case "text-line":
      return (
        <div className={cn("flex h-content-divider-text-line w-full items-center gap-content-divider-gap", className)} {...props}>
          <Rule />
          <span className="shrink-0 text-subheading-2xs uppercase text-text-soft-400">{children}</span>
          <Rule />
        </div>
      );

    case "text":
      return (
        <div
          className={cn(
            "flex h-content-divider-text w-full items-center px-content-divider-text-x py-content-divider-text-y text-subheading-xs uppercase text-text-soft-400",
            className,
          )}
          {...props}
        >
          {children}
        </div>
      );

    case "solid-text":
      return (
        <div
          className={cn(
            "flex h-content-divider-solid w-full items-center bg-bg-weak-50 px-content-divider-solid-x py-content-divider-solid-y text-subheading-xs uppercase text-text-soft-400",
            className,
          )}
          {...props}
        >
          {children}
        </div>
      );

    default: {
      // The four button types: a line, the button or group in the middle, a line.
      let middle: React.ReactNode = children;
      if (type === "icon-button") {
        middle = <Button tone="neutral" variant="stroke" size="xs" leadingIcon={icon} aria-label={buttonLabel} onClick={onButtonClick} />;
      } else if (type === "text-button") {
        middle = (
          <Button tone="neutral" variant="stroke" size="xs" leadingIcon={icon} onClick={onButtonClick}>
            {children}
          </Button>
        );
      }
      return (
        <div className={cn("flex h-content-divider-button w-full items-center gap-content-divider-gap", className)} {...props}>
          <Rule />
          <div className="flex shrink-0">{middle}</div>
          <Rule />
        </div>
      );
    }
  }
}
