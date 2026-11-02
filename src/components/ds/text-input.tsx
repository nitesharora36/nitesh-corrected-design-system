"use client";

import * as React from "react";
import { cva } from "class-variance-authority";

import { Button } from "@/components/ds/button";
import { FieldLabel, HintText } from "@/components/ds/label";
import {
  CalendarIcon,
  CardIcon,
  ChevronDownIcon,
  EmojiIcon,
  EyeIcon,
  EyeOffIcon,
  InfoIcon,
  LockIcon,
  MailIcon,
  SearchIcon,
} from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/**
 * The design system's Text Input, built from design-system/components/text-input.md
 * (Nitesh's Figma "Text Input [1.1]", node 266:5251). Label, field and hint.
 *
 *   size     md 40 | sm 36 | xs 32
 *   appearance  stroke (the Figma's) | filled (Neutrino: a grey fill, no edge)
 *   type     basic | email | phone | card | website | amount | date | search |
 *            password | button | dropdown | emoji: each is Basic plus one part
 *   label    the label row, with required, optional, info and labelLink
 *   hint     the hint row (an info icon unless hintIcon says otherwise)
 *   error    the error edge, and the hint in red
 *   leftIcon, rightIcon   icons in the field; a type brings its own left icon
 *
 * States follow the page: Placeholder (nothing typed), Hover, Focus, Filled,
 * Disabled, Error and Error focused. data-force="hover" or "focus" shows one
 * on the Components page. Sizes are the tokens in styles/sizes/text-input.css.
 *
 * Phone, Amount and Dropdown take their picker in `picker`. The real pickers
 * come with the Select (select.md); until then TextInputPicker (Phone,
 * Amount) and TextInputInlinePicker (Dropdown) are plain look-alike buttons.
 */

export type TextInputType =
  | "basic"
  | "email"
  | "phone"
  | "card"
  | "website"
  | "amount"
  | "date"
  | "search"
  | "password"
  | "button"
  | "dropdown"
  | "emoji";

/** The field's state, worked out by useFieldLook. Shared with the Text Area. */
export type FieldLook = "placeholder" | "filled" | "focus" | "disabled" | "error" | "error-focus";

/** The field's fill, edge, ring and icon colour in each state (text-input.md
 *  and text-area.md, "Colours"). Hover lives only on the two resting looks,
 *  so it never covers a focus or an error. */
export const fieldLookVariants = cva("ds-shadow transition-[background-color,color,box-shadow] duration-150", {
  variants: {
    look: {
      placeholder:
        "bg-bg-white-0 edge-stroke-soft-200 lift-card text-icon-soft-400 ds-hover:bg-bg-weak-50 ds-hover:edge-none ds-hover:lift-none ds-hover:text-icon-sub-600",
      filled: "bg-bg-white-0 edge-stroke-soft-200 lift-card text-icon-sub-600 ds-hover:bg-bg-weak-50 ds-hover:edge-none ds-hover:lift-none",
      focus: "bg-bg-white-0 edge-stroke-strong-950 ring-focus-neutral text-icon-sub-600",
      disabled: "cursor-not-allowed bg-bg-weak-50 text-icon-disabled-300",
      error: "bg-bg-white-0 edge-state-error-base text-icon-sub-600",
      "error-focus": "bg-bg-white-0 edge-state-error-base ring-focus-error text-icon-sub-600",
    },
  },
});

/** The Filled appearance (Neutrino, 21 Oct 2026, the Workflow Studio's drawer,
 *  after OpenAI's Agent Builder; text-input.md): a bg/weak-50 fill and no edge
 *  or shadow at rest, a step darker under the pointer, the Neutral focus ring
 *  when focused. Error keeps the error edge. */
export const filledFieldLookVariants = cva("ds-shadow transition-[background-color,color,box-shadow] duration-150", {
  variants: {
    look: {
      placeholder: "bg-bg-weak-50 edge-none lift-none text-icon-soft-400 ds-hover:bg-bg-soft-200 ds-hover:text-icon-sub-600",
      filled: "bg-bg-weak-50 edge-none lift-none text-icon-sub-600 ds-hover:bg-bg-soft-200",
      focus: "bg-bg-weak-50 edge-none lift-none ring-focus-neutral text-icon-sub-600",
      disabled: "cursor-not-allowed bg-bg-weak-25 text-icon-disabled-300",
      error: "bg-bg-weak-50 edge-state-error-base text-icon-sub-600",
      "error-focus": "bg-bg-weak-50 edge-state-error-base ring-focus-error text-icon-sub-600",
    },
  },
});

/** The typed words and the placeholder in each state. The field carries
 *  group/field, so the placeholder lightens with the field's hover. */
export function fieldTextClass(look: FieldLook) {
  if (look === "disabled") return "cursor-not-allowed text-text-disabled-300 placeholder:text-text-disabled-300";
  return cn(
    "text-text-strong-950 placeholder:text-text-soft-400",
    look === "placeholder" && "group-ds-hover/field:placeholder:text-text-sub-600",
  );
}

const asText = (v: unknown) => (v == null ? "" : Array.isArray(v) ? v.join(",") : String(v));

/** Works out the look: focus from the field's own input (or data-force),
 *  Placeholder or Filled from whether anything is typed. Hover is CSS. */
export function useFieldLook({
  disabled,
  error,
  force,
  value,
  defaultValue,
}: {
  disabled?: boolean;
  error?: boolean;
  force?: "hover" | "focus";
  value?: unknown;
  defaultValue?: unknown;
}) {
  const [typed, setTyped] = React.useState(() => asText(defaultValue));
  const [hasFocus, setHasFocus] = React.useState(false);
  const text = value != null ? asText(value) : typed;
  const focused = force === "focus" || hasFocus;
  const look: FieldLook = disabled
    ? "disabled"
    : error
      ? focused
        ? "error-focus"
        : "error"
      : focused
        ? "focus"
        : text === ""
          ? "placeholder"
          : "filled";
  return { look, text, setTyped, setHasFocus };
}

/** Our ref plus the caller's, on one element. */
export function useJoinedRef<T>(ref: React.Ref<T> | undefined) {
  const own = React.useRef<T | null>(null);
  const join = React.useCallback(
    (node: T | null) => {
      own.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as { current: T | null }).current = node;
    },
    [ref],
  );
  return [own, join] as const;
}

const TextInputContext = React.createContext<{ disabled: boolean }>({ disabled: false });

const FIELD_SIZE = {
  md: "h-text-input-md rounded-text-input-md",
  sm: "h-text-input-sm rounded-text-input-sm",
  xs: "h-text-input-xs rounded-text-input-xs",
} as const;
const PART_SIZE = {
  md: "gap-text-input-md-gap pl-text-input-md-left pr-text-input-md-right",
  sm: "gap-text-input-sm-gap pl-text-input-sm-left pr-text-input-sm-right",
  xs: "gap-text-input-xs-gap pl-text-input-xs-left pr-text-input-xs-right",
} as const;
const PART_Y = { md: "py-text-input-md-y", sm: "py-text-input-sm-y", xs: "py-text-input-xs-y" } as const;

const ICON = "flex shrink-0 [&_svg]:size-text-input-icon";

const NATIVE_TYPE: Record<TextInputType, React.HTMLInputTypeAttribute> = {
  basic: "text",
  email: "email",
  phone: "tel",
  card: "text",
  website: "url",
  amount: "text",
  date: "text",
  search: "search",
  password: "password",
  button: "text",
  dropdown: "text",
  emoji: "text",
};
const INPUT_MODE: Partial<Record<TextInputType, React.HTMLAttributes<HTMLInputElement>["inputMode"]>> = {
  phone: "tel",
  card: "numeric",
  amount: "decimal",
};
/** The left icon each type brings (text-input.md, "Types"). */
const TYPE_ICON: Partial<Record<TextInputType, React.ReactNode>> = {
  email: <MailIcon />,
  date: <CalendarIcon />,
  emoji: <EmojiIcon />,
  password: <LockIcon />,
  search: <SearchIcon />,
  card: <CardIcon />,
};

export type TextInputProps = Omit<React.ComponentProps<"input">, "size" | "type" | "prefix" | "children"> & {
  size?: "md" | "sm" | "xs";
  /** stroke (the Figma's: white, an edge and the card shadow) | filled (a grey fill, no edge). */
  appearance?: "stroke" | "filled";
  type?: TextInputType;
  label?: React.ReactNode;
  /** The `*` after the label (and aria-required on the input). */
  required?: boolean;
  /** "(Optional)" after the label. */
  optional?: boolean;
  /** The info icon in the label row. */
  info?: boolean;
  /** A Link Button at the end of the label row. */
  labelLink?: React.ReactNode;
  hint?: React.ReactNode;
  /** The hint's 16 x 16 icon: InfoIcon unless set; null for none. */
  hintIcon?: React.ReactNode;
  error?: boolean;
  /** The icon on the left. A type's own icon unless set; null for none. */
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  /** Search: the shortcut key on the right, for example "⌘K". */
  shortcut?: React.ReactNode;
  /** Card: the card brand's logo, in a 32 x 24 box on the right. */
  cardLogo?: React.ReactNode;
  /** Website: the prefix box on the left. "https://" unless set. */
  prefix?: React.ReactNode;
  /** Amount: the currency sign before the number, for example "$". */
  currency?: React.ReactNode;
  /** Phone (left), Amount (right) and Dropdown (inside, right): the picker. */
  picker?: React.ReactNode;
  /** Button: the icon-only Neutral Ghost button on the right. */
  action?: { icon: React.ReactNode; label: string; onClick?: () => void };
  /** Shows a state on the Components page. */
  "data-force"?: "hover" | "focus";
};

export function TextInput({
  size = "md",
  appearance = "stroke",
  type = "basic",
  label,
  required,
  optional,
  info,
  labelLink,
  hint,
  hintIcon,
  error,
  leftIcon,
  rightIcon,
  shortcut,
  cardLogo,
  prefix,
  currency,
  picker,
  action,
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
}: TextInputProps) {
  const autoId = React.useId();
  const inputId = id ?? autoId;
  const hintId = `${inputId}-hint`;
  const [inputRef, joinRef] = useJoinedRef(ref);
  const { look, setTyped, setHasFocus } = useFieldLook({ disabled, error, force, value, defaultValue });
  const [shown, setShown] = React.useState(false);

  const quiet = disabled ? "text-text-disabled-300" : "text-text-sub-600";
  const left = leftIcon === undefined ? TYPE_ICON[type] : leftIcon;

  // The divided parts sit outside the input part, with a 1px line between.
  const before =
    type === "website" ? (
      <span className={cn("flex shrink-0 items-center px-text-input-prefix-x py-text-input-prefix-y text-paragraph-sm", quiet)}>
        {prefix ?? "https://"}
      </span>
    ) : type === "phone" ? (
      picker
    ) : null;
  const after =
    type === "amount" ? (
      picker
    ) : type === "button" && action ? (
      <Button
        tone="neutral"
        variant="ghost"
        size={size}
        leadingIcon={action.icon}
        aria-label={action.label}
        onClick={action.onClick}
        disabled={disabled}
      />
    ) : null;

  const focusInput = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || (e.target as HTMLElement).closest("input, button, a")) return;
    e.preventDefault();
    inputRef.current?.focus();
  };

  return (
    <TextInputContext.Provider value={{ disabled: !!disabled }}>
      <div className={cn("flex w-full flex-col gap-text-input-stack", className)}>
        {label != null && (
          <FieldLabel htmlFor={inputId} required={required} optional={optional} info={info} link={labelLink}>
            {label}
          </FieldLabel>
        )}

        <div
          data-force={force === "hover" ? "hover" : undefined}
          onMouseDown={focusInput}
          className={cn(
            "group/field flex w-full items-stretch",
            FIELD_SIZE[size],
            appearance === "filled" ? filledFieldLookVariants({ look }) : fieldLookVariants({ look }),
          )}
        >
          {before}
          <div
            className={cn(
              "flex min-w-0 flex-1 items-center",
              PART_SIZE[size],
              type === "card" && size === "md" ? "py-text-input-card-y" : PART_Y[size],
              before != null && "border-l border-stroke-soft-200",
              after != null && "border-r border-stroke-soft-200",
            )}
          >
            {left != null && (
              <span aria-hidden className={ICON}>
                {left}
              </span>
            )}
            {type === "amount" && currency != null && <span className={cn("shrink-0 text-paragraph-sm", quiet)}>{currency}</span>}
            <input
              ref={joinRef}
              id={inputId}
              type={type === "password" && shown ? "text" : NATIVE_TYPE[type]}
              inputMode={INPUT_MODE[type]}
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
                "min-w-0 flex-1 bg-transparent text-paragraph-sm outline-none [&::-webkit-search-cancel-button]:hidden",
                fieldTextClass(look),
              )}
              {...props}
            />
            {rightIcon != null && (
              <span aria-hidden className={ICON}>
                {rightIcon}
              </span>
            )}
            {type === "password" && (
              <button
                type="button"
                disabled={disabled}
                onClick={() => setShown((s) => !s)}
                aria-label={shown ? "Hide password" : "Show password"}
                aria-controls={inputId}
                className={cn(ICON, "cursor-pointer disabled:cursor-not-allowed", disabled ? "text-icon-disabled-300" : "text-icon-soft-400")}
              >
                {shown ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            )}
            {type === "search" && shortcut != null && (
              <kbd
                className={cn(
                  "ds-shadow edge-stroke-soft-200 shrink-0 rounded-text-input-key bg-bg-white-0 px-text-input-key-x py-text-input-key-y font-sans text-subheading-xs uppercase",
                  disabled ? "text-text-disabled-300" : "text-text-soft-400",
                )}
              >
                {shortcut}
              </kbd>
            )}
            {type === "card" && cardLogo != null && (
              <span className="flex h-text-input-card-logo-h w-text-input-card-logo-w shrink-0 items-center justify-center overflow-hidden rounded-text-input-card-logo">
                {cardLogo}
              </span>
            )}
            {type === "dropdown" && picker}
          </div>
          {after}
        </div>

        {hint != null && (
          <HintText
            id={hintId}
            state={disabled ? "disabled" : error ? "error" : "default"}
            icon={hintIcon === undefined ? <InfoIcon /> : hintIcon}
          >
            {hint}
          </HintText>
        )}
      </div>
    </TextInputContext.Provider>
  );
}

export type TextInputPickerProps = React.ComponentProps<"button"> & {
  /** The country's flag, or the currency's. */
  flag?: React.ReactNode;
};

/** Phone's country picker and Amount's currency picker, as they look: a
 *  flag, the code in text/strong-950 and a down arrow. A plain button until
 *  the Select is built; its trigger then takes this place. */
export function TextInputPicker({ flag, children, className, disabled, ...props }: TextInputPickerProps) {
  const field = React.useContext(TextInputContext);
  const off = disabled ?? field.disabled;
  return (
    <button
      type="button"
      disabled={off}
      className={cn(
        "flex shrink-0 cursor-pointer items-center gap-text-input-picker-gap py-text-input-picker-y pl-text-input-picker-left pr-text-input-picker-right text-paragraph-sm disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    >
      {flag != null && (
        <span aria-hidden className="flex shrink-0">
          {flag}
        </span>
      )}
      <span className={off ? "text-text-disabled-300" : "text-text-strong-950"}>{children}</span>
      <ChevronDownIcon className={cn("size-text-input-icon shrink-0", off ? "text-icon-disabled-300" : "text-icon-sub-600")} />
    </button>
  );
}

export type TextInputInlinePickerProps = React.ComponentProps<"button"> & {
  icon?: React.ReactNode;
};

/** Dropdown's small picker inside the field: an icon in icon/soft-400, the
 *  choice in text/sub-600 and a down arrow, 4 apart. A plain button until
 *  the Select is built. */
export function TextInputInlinePicker({ icon, children, className, disabled, ...props }: TextInputInlinePickerProps) {
  const field = React.useContext(TextInputContext);
  const off = disabled ?? field.disabled;
  return (
    <button
      type="button"
      disabled={off}
      className={cn(
        "flex shrink-0 cursor-pointer items-center gap-text-input-inline-picker-gap text-paragraph-sm disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    >
      {icon != null && (
        <span aria-hidden className={cn(ICON, off ? "text-icon-disabled-300" : "text-icon-soft-400")}>
          {icon}
        </span>
      )}
      <span className={off ? "text-text-disabled-300" : "text-text-sub-600"}>{children}</span>
      <ChevronDownIcon className={cn("size-text-input-icon shrink-0", off ? "text-icon-disabled-300" : "text-icon-sub-600")} />
    </button>
  );
}
