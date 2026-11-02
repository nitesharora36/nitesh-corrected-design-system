"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

import { useControllableState } from "@/components/ds/checkbox";
import { HeartIcon, StarIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/**
 * The design system's Rating, built from design-system/components/rating.md
 * (Nitesh's Figma "Rating Items [1.0]" 532:4137, "Rating & Review [1.0]"
 * 532:4340, "Rating Cell [1.1]" 532:4160, "Rating Bar [1.1]" 535:4658 and
 * "Rating Bar Area [1.1]" 535:4994).
 *
 * RatingItem      one star or heart. look empty-line | empty-filled | half |
 *                 full, size sm 20 | lg 32 (the cell's)
 * RatingReview    a score shown, read only: value (halves allowed), align
 *                 only | vertical | horizontal, words ("4.5 ∙ 5.2K
 *                 Ratings"), link (a slot for the Link Button, Gray, Medium,
 *                 underlined). With align="only" and nothing else it is the
 *                 five 20 x 20 stars 2 apart a table cell shows.
 * RatingCell      one star or heart in a square button. selected
 * RatingBar       five cells a person picks from (Radix radio group):
 *                 type emoji | number | star | heart, value, onValueChange
 * RatingBarArea   the Rating Bar on a box for written feedback: text,
 *                 placeholder, limit (the counter), error
 *
 * The filled star waits for Yellow (state/away, not in the palette yet):
 * until then it is state/warning/base, Amber, which the page finds too
 * brown. The heart is state/error/base. The star and heart are Hugeicons'
 * Stroke Rounded shapes; Empty Filled, Half and Full fill the same shape
 * (the page asks Nitesh to pick a solid set; Open). The emojis are the
 * system's (the page asks which; Open).
 *
 * Proposals the page makes (Open), built: a score of 3 fills the first
 * three stars or hearts, and Hover fills every cell up to the pointer;
 * keyboard focus shows the Neutral ring around the Rating Cell and each
 * cell of the bar; the writing box takes the Text Area's states (Hover,
 * Focus, Filled, Error) and its counter when a limit is set. There is no
 * Disabled look (the page asks whether one is needed), so there is no
 * disabled prop. data-force="hover" or "focus" shows a state on the
 * Components page (on the bar: hoverValue, focusValue). Sizes are the
 * tokens in styles/sizes/rating.css.
 */

export type RatingType = "star" | "heart";
export type RatingLook = "empty-line" | "empty-filled" | "half" | "full";

/** The filled colour. The star's Yellow is not in the palette yet. */
const FULL: Record<RatingType, string> = {
  star: "text-state-warning-base",
  heart: "text-state-error-base",
};

/** The same colour when the Rating Cell is hovered: the item turns Full. */
const FULL_ON_CELL_HOVER: Record<RatingType, string> = {
  star: "group-ds-hover/cell:text-state-warning-base",
  heart: "group-ds-hover/cell:text-state-error-base",
};

const GLYPH: Record<RatingType, Record<"sm" | "lg", string>> = {
  star: { sm: "[&_svg]:size-rating-item-star", lg: "[&_svg]:size-rating-item-lg-star" },
  heart: { sm: "[&_svg]:size-rating-item-heart", lg: "[&_svg]:size-rating-item-lg-heart" },
};

/** Fill the Hugeicons outline with its own colour. */
const filled = "[&_path]:fill-current";

// ---- Rating Item ----

export type RatingItemProps = Omit<React.ComponentProps<"span">, "children"> & {
  type?: RatingType;
  look?: RatingLook;
  size?: "sm" | "lg";
};

export function RatingItem({ type = "star", look = "full", size = "sm", className, ...props }: RatingItemProps) {
  const Glyph = type === "star" ? StarIcon : HeartIcon;
  const empty = look === "empty-line" || look === "empty-filled";
  return (
    <span
      aria-hidden
      className={cn(
        "relative flex shrink-0 items-center justify-center",
        size === "sm" ? "size-rating-item" : "size-rating-item-lg",
        GLYPH[type][size],
        empty ? "text-stroke-sub-300" : FULL[type],
        (look === "empty-filled" || look === "full") && filled,
        className,
      )}
      {...props}
    >
      <Glyph />
      {look === "half" && (
        // The left half filled, over the outline, in the same colour.
        <span className={cn("absolute inset-space-0 flex items-center justify-center", filled)} style={{ clipPath: "inset(0 50% 0 0)" }}>
          <Glyph />
        </span>
      )}
    </span>
  );
}

/** The look of item `n` (1 to max) for a score: full, then a half, then empty. */
function lookFor(n: number, score: number, empty: RatingLook): RatingLook {
  if (score >= n) return "full";
  if (score >= n - 0.5) return "half";
  return empty;
}

// ---- Rating & Review ----

export type RatingReviewProps = Omit<React.ComponentProps<"div">, "children"> & {
  type?: RatingType;
  /** The score, 0 to max; halves show a Half item. */
  value: number;
  max?: number;
  /** only: the items alone. vertical: the words under them. horizontal: beside them. */
  align?: "only" | "vertical" | "horizontal";
  /** The score and count, for example "4.5 ∙ 5.2K Ratings". */
  words?: React.ReactNode;
  /** A link to the reviews: the Link Button, Gray, Medium, underlined. */
  link?: React.ReactNode;
  /** What a screen reader says for the items; "4.5 out of 5" unless set. */
  label?: string;
};

export function RatingReview({ type = "star", value, max = 5, align = "only", words, link, label, className, ...props }: RatingReviewProps) {
  const items = (
    <span role="img" aria-label={label ?? `${value} out of ${max}`} className="flex shrink-0 gap-rating-review-items-gap">
      {Array.from({ length: max }, (_, i) => (
        <RatingItem key={i} type={type} look={lookFor(i + 1, value, "empty-filled")} />
      ))}
    </span>
  );
  const text = align !== "only" && (words != null || link != null) && (
    <span className="flex h-rating-review-words items-center gap-rating-review-words-gap">
      {words != null && <span className="text-paragraph-sm text-text-strong-950">{words}</span>}
      {link}
    </span>
  );
  return (
    <div
      className={cn("flex items-start gap-rating-review-gap", align === "vertical" ? "flex-col" : "flex-row", className)}
      {...props}
    >
      {items}
      {text}
    </div>
  );
}

// ---- Rating Cell ----

export type RatingCellProps = Omit<React.ComponentProps<"button">, "children" | "type"> & {
  /** The Figma's Type: star | heart (the button is always type="button"). */
  type?: RatingType;
  selected?: boolean;
  "data-force"?: "hover" | "focus";
};

export function RatingCell({ type = "star", selected, className, ...props }: RatingCellProps) {
  return (
    <button
      type="button"
      aria-pressed={!!selected}
      className={cn(
        "group/cell ds-shadow flex size-rating-cell shrink-0 cursor-pointer items-center justify-center rounded-rating-cell bg-bg-white-0 p-rating-cell-pad outline-none",
        "edge-stroke-soft-200 lift-card transition-[background-color,box-shadow] duration-150 ds-focus:ring-focus-neutral",
        !selected && "ds-hover:bg-bg-weak-50 ds-hover:edge-none ds-hover:lift-none",
        className,
      )}
      {...props}
    >
      {/* Default shows Empty Filled; Hover and Selected show Full. */}
      <RatingItem type={type} size="lg" look={selected ? "full" : "empty-filled"} className={selected ? undefined : FULL_ON_CELL_HOVER[type]} />
    </button>
  );
}

// ---- Rating Bar ----

export type RatingBarType = "emoji" | "number" | RatingType;

/** pensive, confused, neutral, slightly smiling, grinning */
const EMOJI = [
  { face: "\u{1F614}", name: "pensive" },
  { face: "\u{1F615}", name: "confused" },
  { face: "\u{1F610}", name: "neutral" },
  { face: "\u{1F642}", name: "slightly smiling" },
  { face: "\u{1F600}", name: "grinning" },
];

export type RatingBarProps = Omit<React.ComponentProps<"div">, "defaultValue" | "dir" | "children"> & {
  type?: RatingBarType;
  /** The picked score, 1 to 5. */
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  /** Shows the Hover look as if the pointer were on this cell (the Components page). */
  hoverValue?: number;
  /** Shows the focus ring on this cell (the Components page). */
  focusValue?: number;
  /** Draw the bar's own edge. Off inside the Rating Bar Area, whose card draws it. */
  framed?: boolean;
};

export function RatingBar({
  type = "star",
  value,
  defaultValue,
  onValueChange,
  hoverValue,
  focusValue,
  framed = true,
  className,
  "aria-label": ariaLabel = "Rating",
  ...props
}: RatingBarProps) {
  const [score, setScore] = useControllableState<number | undefined>(value, defaultValue, (v) => v != null && onValueChange?.(v));
  const [pointer, setPointer] = React.useState<number>();
  const hover = pointer ?? hoverValue ?? 0;
  const shapes = type === "star" || type === "heart";

  return (
    <RadioGroupPrimitive.Root
      value={score != null ? String(score) : ""}
      onValueChange={(v) => setScore(Number(v))}
      orientation="horizontal"
      aria-label={ariaLabel}
      onPointerLeave={() => setPointer(undefined)}
      // isolate keeps the focused cell and the edge above it inside the bar.
      className={cn("relative isolate flex h-rating-bar w-full bg-bg-white-0", className)}
      {...props}
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const picked = score === n;
        const hovered = hover >= n;
        return (
          <RadioGroupPrimitive.Item
            key={n}
            value={String(n)}
            aria-label={type === "emoji" ? `${n}, ${EMOJI[n - 1].name}` : `${n} of 5`}
            onPointerEnter={() => setPointer(n)}
            // Number is the one bar with a per-cell Hover look (the digit darkens).
            data-force={focusValue === n ? "focus" : type === "number" && hoverValue === n ? "hover" : undefined}
            className={cn(
              "group/bar ds-shadow flex min-w-0 flex-1 cursor-pointer items-center justify-center px-rating-bar-x py-rating-bar-y outline-none",
              "not-first:[--ds-edge:var(--shadow-rating-bar-divider)] transition-[background-color,color,box-shadow] duration-150",
              // The focused cell's ring lies over its neighbours.
              "ds-focus:z-10 ds-focus:ring-focus-neutral",
              // Emoji and Number: only the picked cell takes the fill.
              !shapes && picked && "bg-bg-weak-50",
            )}
          >
            {type === "number" && (
              <span className={cn("text-label-sm", picked ? "text-text-strong-950" : "text-text-sub-600 group-ds-hover/bar:text-text-strong-950")}>{n}</span>
            )}
            {type === "emoji" && (
              <span aria-hidden className="flex size-rating-bar-emoji items-center justify-center text-label-lg">
                {EMOJI[n - 1].face}
              </span>
            )}
            {shapes && <RatingItem type={type} look={score != null && score >= n ? "full" : hovered ? "empty-filled" : "empty-line"} />}
          </RadioGroupPrimitive.Item>
        );
      })}
      {framed && <span aria-hidden className="ds-shadow pointer-events-none absolute inset-space-0 z-20 edge-stroke-soft-200" />}
    </RadioGroupPrimitive.Root>
  );
}

// ---- Rating Bar Area ----

export type RatingBarAreaProps = Omit<RatingBarProps, "framed"> & {
  placeholder?: string;
  text?: string;
  defaultText?: string;
  onTextChange?: (text: string) => void;
  /** The writing box's name for screen readers. */
  textLabel?: string;
  /** The most characters; shows the Text Area's count ("0/200") under the writing area. */
  limit?: number;
  /** The writing box's Error look, the Text Area's: the error edge, and the Error ring on focus. */
  error?: boolean;
  /** Shows the writing box's Hover or Focus on the Components page. */
  "data-force"?: "hover" | "focus";
};

export function RatingBarArea({
  placeholder = "Tell us why!",
  text,
  defaultText,
  onTextChange,
  textLabel = "Why this score",
  limit,
  error,
  className,
  "data-force": force,
  ...bar
}: RatingBarAreaProps) {
  const [words, setWords] = useControllableState(text, defaultText ?? "", onTextChange);
  const [hasFocus, setHasFocus] = React.useState(false);
  const writingRef = React.useRef<HTMLTextAreaElement>(null);
  const focus = force === "focus" || hasFocus;
  const over = limit != null && words.length > limit;

  // A press on the box's padding puts the caret in the writing area, as in the Text Area.
  const focusWriting = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("textarea")) return;
    e.preventDefault();
    writingRef.current?.focus();
  };

  return (
    <div
      className={cn(
        "ds-shadow relative isolate flex w-full flex-col rounded-rating-area bg-bg-white-0 transition-[box-shadow] duration-150",
        // The writing box's focus is the Text Area's: the Neutral ring (Error ring in Error), around the card.
        focus && (error ? "ring-focus-error" : "ring-focus-neutral"),
        className,
      )}
    >
      {/* The bar is clipped to the card's top corners. */}
      <RatingBar
        framed={false}
        className="rounded-t-rating-area [&>button:first-of-type]:rounded-tl-rating-area [&>button:last-of-type]:rounded-tr-rating-area"
        {...bar}
      />
      <div
        data-force={force === "hover" ? "hover" : undefined}
        onMouseDown={focusWriting}
        className={cn(
          "group/writing ds-shadow flex cursor-text flex-col gap-rating-area-counter-gap rounded-b-rating-area p-rating-area-pad",
          // The line between the bar and the writing box.
          "[--ds-edge:var(--shadow-rating-area-line)] transition-[background-color] duration-150",
          // Hover is the Text Area's: bg/weak-50, the placeholder darkens. None while focused or in Error.
          !focus && !error && "ds-hover:bg-bg-weak-50",
        )}
      >
        <textarea
          ref={writingRef}
          aria-label={textLabel}
          aria-invalid={error || undefined}
          placeholder={placeholder}
          value={words}
          onChange={(e) => setWords(e.target.value)}
          onFocus={() => setHasFocus(true)}
          onBlur={() => setHasFocus(false)}
          className={cn(
            "block h-rating-area-writing w-full resize-none bg-transparent text-paragraph-sm text-text-strong-950 outline-none placeholder:text-text-soft-400",
            !focus && !error && "group-ds-hover/writing:placeholder:text-text-sub-600",
          )}
        />
        {limit != null && (
          // The Text Area's count: red only over the limit.
          <div className="flex h-rating-area-counter items-center justify-end">
            <span className={cn("text-subheading-2xs uppercase", over ? "text-state-error-base" : "text-text-soft-400")}>
              {words.length}/{limit}
            </span>
          </div>
        )}
      </div>
      {/* The card's edge, over everything inside it, so a filled or focused cell never covers it. */}
      <span
        aria-hidden
        className={cn(
          "ds-shadow pointer-events-none absolute inset-space-0 z-20 rounded-rating-area transition-[box-shadow] duration-150",
          error ? "edge-state-error-base" : focus ? "edge-stroke-strong-950" : "edge-stroke-soft-200",
        )}
      />
    </div>
  );
}
