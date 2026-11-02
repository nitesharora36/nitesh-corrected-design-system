"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";

import { useControllableState } from "@/components/ds/checkbox";
import { ContentDivider } from "@/components/ds/content-divider";
import {
  DropdownRow,
  dropdownMenuBody,
  dropdownMenuGroup,
  dropdownMenuSurface,
  type DropdownRowType,
} from "@/components/ds/dropdown";
import { FieldLabel, HintText } from "@/components/ds/label";
import { fieldLookVariants, type FieldLook } from "@/components/ds/text-input";
import { SortIcon, BuildingIcon, CheckIcon, ChevronDownIcon, ChevronUpIcon, GlobeIcon, InfoIcon, UserIcon } from "@/components/ui/icons";
import { usingKeyboard } from "@/components/input-modality";
import { cn } from "@/lib/utils";

/**
 * The design system's Select, built from design-system/components/select.md
 * (Nitesh's Figma "Select [1.1]" 270:1085, "Compact Select [1.1]" 377:5083,
 * "Compact Select for Input [1.1]" 307:16883, "Inline Select [1.1]"
 * 332:4537), on Radix's select. Picking one value from a list. The list that
 * opens is the Dropdown's menu with Small rows (dropdown.md).
 *
 *   <Select label="Country" type="country" placeholder="Select a country">
 *     <SelectItem value="us" picture={flag}>United States</SelectItem>
 *   </Select>
 *
 * Select             label, field and hint. size md 40 | sm 36 | xs 32;
 *                    type basic | country | avatar | provider | brand | company;
 *                    icon (Basic's icon), showPicture, badge (a Badge, a slot),
 *                    label with required, optional, info, labelLink; hint; error
 * CompactSelect      as wide as its content: type icon | country | basic
 *                    ("48"), size md | sm | xs, error. The Pagination's
 *                    "7 / page" is type basic, size xs.
 * SelectInputPicker  the Compact Select for Input: the flag, the code and the
 *                    arrow inside the Text Input's Phone and Amount (its
 *                    `picker` slot). size follows the field.
 * InlineSelect       no box, 20 tall: type icon | country. The Text Input's
 *                    Dropdown type (its `picker` slot).
 * SelectItem         a row of the list: the label (children), picture,
 *                    sublabel, badge, code (the short words the closed picker
 *                    shows: "USD", "+1", "48"), disabled. The picked row gets
 *                    the check on the right.
 * SelectGroup, SelectHeading, SelectSeparator   groups in the list
 *
 * States follow the page: Default (nothing picked), Hover, Focus (open, or
 * keyboard focus), Filled, Disabled, Error, and Error focused (the page's
 * proposal: the error edge and the Error focus ring). data-force="hover" or
 * "focus" shows one on the Components page; the two pickers inside fields
 * take "hover", "active" (open) or "focus" (the keyboard ring). Items must be
 * children (or inside groups) of their Select, so the closed field can show
 * the picked one's picture and words. Sizes are the tokens in
 * styles/sizes/select.css.
 */

export type SelectSize = "md" | "sm" | "xs";
export type SelectType = DropdownRowType;

// ---- The list ----

/** The rows' type, so a Country Select shows Country rows. */
/** `mark`: where the picked row's check sits. Right on the Figma's lists;
 *  left on a settings row's list (OpenAI's inspector, 21 Oct 2026), where
 *  every row keeps the check's room so the words line up. */
const ListContext = React.createContext<{ type: DropdownRowType; mark?: "left" | "right" }>({ type: "basic" });

const LIST_WIDTH = {
  /** As wide as the field (the Select). */
  field: "w-(--radix-select-trigger-width)",
  /** At least as wide as the picker, else as its rows (the Compact Select). */
  fit: "w-max min-w-(--radix-select-trigger-width)",
  /** The menu's own 300 (the pickers inside a field). */
  menu: "w-dropdown-menu-w",
} as const;

function SelectList({ width, children }: { width: keyof typeof LIST_WIDTH; children: React.ReactNode }) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        position="popper"
        align="start"
        className={cn(
          "z-50 max-h-(--radix-select-content-available-height) overflow-hidden",
          dropdownMenuSurface,
          LIST_WIDTH[width],
          // 10 below the field (or above it, when there is no room below).
          "data-[side=bottom]:mt-select-list-offset data-[side=top]:mb-select-list-offset",
        )}
      >
        <SelectPrimitive.Viewport className={dropdownMenuBody}>{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

export type SelectItemProps = Omit<React.ComponentProps<typeof SelectPrimitive.Item>, "children" | "asChild"> & {
  /** The row's words. */
  children: React.ReactNode;
  /** An icon, a flag, an Avatar (size 20) or a logo. */
  picture?: React.ReactNode;
  sublabel?: React.ReactNode;
  /** A Badge (badge.md), Lighter, Blue, Medium. */
  badge?: React.ReactNode;
  /** The short words the closed Compact Select, Input picker or Inline Select shows. */
  code?: React.ReactNode;
};

/** A Dropdown Item, Small, of the Select's type; the picked one has the check. */
export function SelectItem({ children, picture, sublabel, badge, code, disabled, className, ...props }: SelectItemProps) {
  const { type, mark = "right" } = React.useContext(ListContext);
  void code; // read by the closed picker, not drawn in the row
  const check = (
    <SelectPrimitive.ItemIndicator>
      <CheckIcon />
    </SelectPrimitive.ItemIndicator>
  );
  return (
    <SelectPrimitive.Item disabled={disabled} asChild {...props}>
      <DropdownRow
        size="sm"
        type={type}
        picture={
          mark === "left" ? (
            // The check's room on every row, the check only on the picked one.
            <span aria-hidden className="flex size-dropdown-icon shrink-0 items-center justify-center text-icon-strong-950 [&_svg]:size-select-mark">
              {check}
            </span>
          ) : (
            picture
          )
        }
        label={<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>}
        sublabel={sublabel}
        badge={badge}
        disabled={disabled}
        // The picked row is filled, bg/weak-50, the hover's fill (21 Oct 2026).
        className={cn("data-[state=checked]:bg-bg-weak-50", className)}
        rightIcon={mark === "left" ? undefined : check}
      />
    </SelectPrimitive.Item>
  );
}

export function SelectGroup({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group className={cn(dropdownMenuGroup, className)} {...props} />;
}

/** A group's heading: the Dropdown's, a Content Divider, Text. */
export function SelectHeading({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <SelectPrimitive.Label asChild>
      <ContentDivider type="text" className={className}>
        {children}
      </ContentDivider>
    </SelectPrimitive.Label>
  );
}

/** Between groups: a Content Divider, Line Spacing. */
export function SelectSeparator({ className }: { className?: string }) {
  return (
    <SelectPrimitive.Separator asChild>
      <ContentDivider type="line-spacing" className={className} />
    </SelectPrimitive.Separator>
  );
}

// ---- Shared ----

type Picked = { label: React.ReactNode; picture?: React.ReactNode; code?: React.ReactNode };

/** The SelectItem with this value among the children (and their groups). */
function findItem(children: React.ReactNode, value: string | undefined): Picked | undefined {
  if (!value) return undefined;
  let found: Picked | undefined;
  React.Children.forEach(children, (child) => {
    if (found || !React.isValidElement(child)) return;
    const props = child.props as { value?: unknown; children?: React.ReactNode; picture?: React.ReactNode; code?: React.ReactNode };
    if (child.type === SelectItem && props.value === value) {
      found = { label: props.children, picture: props.picture, code: props.code };
    } else if (props.children != null) {
      found = findItem(props.children, value);
    }
  });
  return found;
}

type RootProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
};

/** Value and open state, either controlled or left to the component, plus
 *  whether the trigger has keyboard focus (a click never shows the ring). */
function usePicker({ value, defaultValue = "", onValueChange, open, defaultOpen = false, onOpenChange }: RootProps) {
  const [current, setCurrent] = useControllableState(value, defaultValue, onValueChange);
  const [isOpen, setOpen] = useControllableState(open, defaultOpen, onOpenChange);
  const [keyboard, setKeyboard] = React.useState(false);
  const focusProps = {
    onFocus: (e: React.FocusEvent<HTMLButtonElement>) => setKeyboard(e.currentTarget.matches(":focus-visible") && usingKeyboard()),
    onBlur: () => setKeyboard(false),
  };
  return { current, setCurrent, isOpen, setOpen, keyboard, focusProps };
}

const lookOf = ({ disabled, error, focused, filled }: { disabled?: boolean; error?: boolean; focused: boolean; filled: boolean }): FieldLook =>
  disabled ? "disabled" : error ? (focused ? "error-focus" : "error") : focused ? "focus" : filled ? "filled" : "placeholder";

/** The arrow: down, or up while the list is open. */
function Arrow({ up, className }: { up: boolean; className?: string }) {
  const Glyph = up ? ChevronUpIcon : ChevronDownIcon;
  return <Glyph className={cn("size-select-arrow shrink-0", className)} />;
}

const PICTURE_OFF = "opacity-select-picture-off";

// ---- Select ----

const FIELD_SIZE = {
  md: "h-select-md gap-select-md-gap rounded-select-md",
  sm: "h-select-sm gap-select-sm-gap rounded-select-sm",
  xs: "h-select-xs gap-select-xs-gap rounded-select-xs",
} as const;
const FIELD_PAD = {
  md: "py-select-md-y pl-select-md-left pr-select-md-right",
  sm: "py-select-sm-y pl-select-sm-left pr-select-sm-right",
  xs: "py-select-xs-y pl-select-xs-left pr-select-xs-right",
} as const;
const PROVIDER_PAD = { md: "p-select-md-provider-pad", sm: "p-select-sm-provider-pad", xs: "p-select-xs-provider-pad" } as const;

/** The words in each look: the empty words text/sub-600, then text/strong-950. */
const WORDS: Record<FieldLook, string> = {
  placeholder: "text-text-sub-600",
  filled: "text-text-strong-950",
  focus: "text-text-strong-950",
  disabled: "text-text-disabled-300",
  error: "text-text-strong-950",
  "error-focus": "text-text-strong-950",
};

/** Before a pick each type shows a stand-in (select.md, Layout). */
function standIn(type: SelectType, icon: React.ReactNode) {
  switch (type) {
    case "country":
      return <GlobeIcon />;
    case "avatar":
      return <UserIcon />;
    case "brand":
      return <BuildingIcon />;
    case "company":
      return <span className="ds-shadow edge-stroke-soft-200 size-full rounded-select-company" />;
    case "provider":
      return <span className="size-full rounded-select-card bg-bg-soft-200" />;
    default:
      return icon;
  }
}

export type SelectProps = RootProps & {
  size?: SelectSize;
  type?: SelectType;
  label?: React.ReactNode;
  /** "(Optional)" after the label. (required adds the `*`.) */
  optional?: boolean;
  /** The info icon in the label row. */
  info?: boolean;
  /** A Link Button at the end of the label row. */
  labelLink?: React.ReactNode;
  hint?: React.ReactNode;
  /** The hint's icon: InfoIcon unless set; null for none. */
  hintIcon?: React.ReactNode;
  error?: boolean;
  /** The words before a pick. */
  placeholder?: React.ReactNode;
  /** Basic: the icon on the left. */
  icon?: React.ReactNode;
  /** The picture on the left (on by default). */
  showPicture?: boolean;
  /** A Badge (badge.md), Lighter, Blue, Medium, after the words. */
  badge?: React.ReactNode;
  /** SelectItem rows (or groups of them). */
  children: React.ReactNode;
  id?: string;
  className?: string;
  "aria-label"?: string;
  /** Shows a state on the Components page. */
  "data-force"?: "hover" | "focus";
};

export function Select({
  size = "md",
  type = "basic",
  label,
  required,
  optional,
  info,
  labelLink,
  hint,
  hintIcon,
  error,
  disabled,
  placeholder = "Select...",
  icon,
  showPicture = true,
  badge,
  children,
  id,
  name,
  className,
  "aria-label": ariaLabel,
  "data-force": force,
  ...root
}: SelectProps) {
  const autoId = React.useId();
  const triggerId = id ?? autoId;
  const hintId = `${triggerId}-hint`;
  const { current, setCurrent, isOpen, setOpen, keyboard, focusProps } = usePicker(root);
  const picked = findItem(children, current);
  const open = isOpen || force === "focus";
  const look = lookOf({ disabled, error, focused: open || keyboard, filled: picked != null });

  const picture = showPicture ? (picked?.picture ?? standIn(type, icon)) : null;
  const real = picked?.picture != null || type === "company" || type === "provider";

  return (
    <div className={cn("flex w-full flex-col gap-select-stack", className)}>
      {label != null && (
        // The label stays the same in every state, as on the Text Input.
        <FieldLabel htmlFor={triggerId} required={required} optional={optional} info={info} link={labelLink}>
          {label}
        </FieldLabel>
      )}

      <SelectPrimitive.Root
        value={current}
        onValueChange={setCurrent}
        open={isOpen}
        onOpenChange={setOpen}
        disabled={disabled}
        required={required}
        name={name}
      >
        <SelectPrimitive.Trigger
          id={triggerId}
          aria-label={ariaLabel}
          aria-invalid={error || undefined}
          aria-describedby={hint != null ? hintId : undefined}
          data-force={force === "hover" ? "hover" : undefined}
          {...focusProps}
          className={cn(
            "flex w-full min-w-0 cursor-pointer items-center text-left outline-none disabled:cursor-not-allowed",
            FIELD_SIZE[size],
            type === "provider" ? PROVIDER_PAD[size] : FIELD_PAD[size],
            fieldLookVariants({ look }),
          )}
        >
          {picture != null && (
            <span
              aria-hidden
              className={cn(
                "flex shrink-0 items-center justify-center overflow-hidden [&>img]:size-full [&>img]:object-contain [&>svg]:size-full",
                type === "provider" ? "h-select-card-h w-select-card-w" : "size-select-picture",
                disabled && real && PICTURE_OFF,
              )}
            >
              {picture}
            </span>
          )}
          <span className={cn("min-w-0 flex-1 truncate text-paragraph-sm", WORDS[look])}>{picked ? picked.label : placeholder}</span>
          {badge}
          {/* The arrow follows the field's icon colour, but is icon/strong-950 in Error (as drawn). */}
          <Arrow up={open} className={look === "error" || look === "error-focus" ? "text-icon-strong-950" : undefined} />
        </SelectPrimitive.Trigger>

        <ListContext.Provider value={{ type }}>
          <SelectList width="field">{children}</SelectList>
        </ListContext.Provider>
      </SelectPrimitive.Root>

      {hint != null && (
        <HintText id={hintId} state={disabled ? "disabled" : error ? "error" : "default"} icon={hintIcon === undefined ? <InfoIcon /> : hintIcon}>
          {hint}
        </HintText>
      )}
    </div>
  );
}

// ---- Compact Select ----

export type CompactSelectType = "icon" | "country" | "basic";

const COMPACT_SIZE = {
  md: "h-select-compact-md gap-select-compact-md-gap rounded-select-compact-md",
  sm: "h-select-compact-sm gap-select-compact-sm-gap rounded-select-compact-sm",
  xs: "h-select-compact-xs gap-select-compact-xs-gap rounded-select-compact-xs",
} as const;
const COMPACT_PAD: Record<SelectSize, Record<CompactSelectType, string>> = {
  md: {
    icon: "p-select-compact-md-pad",
    country: "p-select-compact-md-pad",
    basic: "py-select-compact-md-pad pr-select-compact-md-pad pl-select-compact-md-basic-left",
  },
  sm: {
    icon: "p-select-compact-sm-pad",
    country: "p-select-compact-sm-pad",
    basic: "py-select-compact-sm-pad pr-select-compact-sm-pad pl-select-compact-sm-basic-left",
  },
  xs: {
    icon: "p-select-compact-xs-pad",
    country: "py-select-compact-xs-pad pr-select-compact-xs-pad pl-select-compact-xs-country-left",
    basic: "py-select-compact-xs-pad pr-select-compact-xs-pad pl-select-compact-xs-basic-left",
  },
};

/** The Compact Select's colours (select.md, Compact Select, Colours): its
 *  word and icon a step darker than the Select's, no shadow in Error (ours). */
const COMPACT_BOX: Record<FieldLook, string> = {
  placeholder: "bg-bg-white-0 edge-stroke-soft-200 lift-card ds-hover:bg-bg-weak-50 ds-hover:edge-none ds-hover:lift-none",
  filled: "bg-bg-white-0 edge-stroke-soft-200 lift-card ds-hover:bg-bg-weak-50 ds-hover:edge-none ds-hover:lift-none",
  focus: "bg-bg-white-0 edge-stroke-strong-950 ring-focus-neutral",
  disabled: "cursor-not-allowed bg-bg-weak-50",
  error: "bg-bg-white-0 edge-state-error-base",
  "error-focus": "bg-bg-white-0 edge-state-error-base ring-focus-error",
};
const COMPACT_WORD: Record<FieldLook, string> = {
  placeholder: "text-text-sub-600 group-ds-hover/compact:text-text-strong-950",
  filled: "text-text-strong-950",
  focus: "text-text-strong-950",
  disabled: "text-text-disabled-300",
  error: "text-text-strong-950",
  "error-focus": "text-text-strong-950",
};
const COMPACT_ICON: Record<FieldLook, string> = {
  placeholder: "text-icon-sub-600 group-ds-hover/compact:text-icon-strong-950",
  filled: "text-icon-strong-950",
  focus: "text-icon-strong-950",
  disabled: "text-icon-disabled-300",
  error: "text-icon-strong-950",
  "error-focus": "text-icon-strong-950",
};
const COMPACT_ARROW: Record<FieldLook, string> = {
  placeholder: "text-icon-soft-400 group-ds-hover/compact:text-icon-sub-600",
  filled: "text-icon-sub-600",
  focus: "text-icon-strong-950",
  disabled: "text-icon-disabled-300",
  error: "text-icon-sub-600",
  "error-focus": "text-icon-sub-600",
};

export type CompactSelectProps = RootProps & {
  type?: CompactSelectType;
  size?: SelectSize;
  error?: boolean;
  /** Before a pick: a word (Basic) or an icon (Icon). Country shows a globe. */
  placeholder?: React.ReactNode;
  /** It has no label of its own, so it needs one for screen readers. */
  "aria-label": string;
  children: React.ReactNode;
  id?: string;
  className?: string;
  "data-force"?: "hover" | "focus";
};

export function CompactSelect({
  type = "basic",
  size = "md",
  error,
  disabled,
  placeholder,
  children,
  id,
  name,
  className,
  "aria-label": ariaLabel,
  "data-force": force,
  ...root
}: CompactSelectProps) {
  const { current, setCurrent, isOpen, setOpen, keyboard, focusProps } = usePicker(root);
  const picked = findItem(children, current);
  const open = isOpen || force === "focus";
  const look = lookOf({ disabled, error, focused: open || keyboard, filled: picked != null });

  let content: React.ReactNode;
  if (type === "basic") {
    content = <span className={cn("whitespace-nowrap text-paragraph-sm", COMPACT_WORD[look])}>{picked ? (picked.code ?? picked.label) : placeholder}</span>;
  } else {
    const flag = type === "country";
    content = (
      <span
        aria-hidden
        className={cn(
          "flex shrink-0 items-center justify-center overflow-hidden [&>img]:size-full [&>img]:object-contain [&>svg]:size-full",
          flag ? (size === "xs" ? "size-select-compact-xs-flag" : "size-select-compact-flag") : "size-select-compact-icon",
          COMPACT_ICON[look],
          disabled && flag && picked?.picture != null && PICTURE_OFF,
        )}
      >
        {picked?.picture ?? (flag ? <GlobeIcon /> : placeholder)}
      </span>
    );
  }

  return (
    <SelectPrimitive.Root
      value={current}
      onValueChange={setCurrent}
      open={isOpen}
      onOpenChange={setOpen}
      disabled={disabled}
      required={root.required}
      name={name}
    >
      <SelectPrimitive.Trigger
        id={id}
        aria-label={ariaLabel}
        aria-invalid={error || undefined}
        data-force={force === "hover" ? "hover" : undefined}
        {...focusProps}
        className={cn(
          "group/compact ds-shadow inline-flex shrink-0 cursor-pointer items-center outline-none transition-[background-color,box-shadow] duration-150",
          COMPACT_SIZE[size],
          COMPACT_PAD[size][type],
          COMPACT_BOX[look],
          className,
        )}
      >
        {content}
        <Arrow up={open} className={COMPACT_ARROW[look]} />
      </SelectPrimitive.Trigger>
      <ListContext.Provider value={{ type: type === "country" ? "country" : "basic" }}>
        <SelectList width="fit">{children}</SelectList>
      </ListContext.Provider>
    </SelectPrimitive.Root>
  );
}

// ---- Compact Select for Input ----

const INPUT_SIZE = {
  md: "h-select-input-md gap-select-input-md-gap py-select-input-md-y pl-select-input-md-left pr-select-input-md-right",
  sm: "h-select-input-sm gap-select-input-sm-gap py-select-input-sm-y pl-select-input-sm-left pr-select-input-sm-right",
  xs: "h-select-input-xs gap-select-input-xs-gap py-select-input-xs-y pl-select-input-xs-left pr-select-input-xs-right",
} as const;

type PickerForce = "hover" | "active" | "focus";

export type SelectInputPickerProps = RootProps & {
  /** The Text Input's size. */
  size?: SelectSize;
  /** The flag before the code (on by default). */
  flag?: boolean;
  /** Before a pick. */
  placeholder?: React.ReactNode;
  "aria-label": string;
  /** SelectItem rows: a flag in `picture`, the code in `code`. */
  children: React.ReactNode;
  className?: string;
  /** hover, active (the open look) or focus (the keyboard ring), for the Components page. */
  "data-force"?: PickerForce;
};

/** The country or currency picker inside the Text Input's Phone and Amount.
 *  No edge, corner, shadow or fill of its own: the field gives those, so its
 *  bg/white-0 and Hover bg/weak-50 are the field's own (the field turns
 *  bg/weak-50 under the pointer, and a fill here would cover the field's
 *  edge and corners). Keyboard focus: the Neutral ring (the page's proposal). */
export function SelectInputPicker({
  size = "md",
  flag = true,
  placeholder,
  disabled,
  children,
  name,
  className,
  "aria-label": ariaLabel,
  "data-force": force,
  ...root
}: SelectInputPickerProps) {
  const { current, setCurrent, isOpen, setOpen } = usePicker(root);
  const picked = findItem(children, current);
  const active = !disabled && (isOpen || force === "active");

  return (
    <SelectPrimitive.Root value={current} onValueChange={setCurrent} open={isOpen} onOpenChange={setOpen} disabled={disabled} name={name}>
      <SelectPrimitive.Trigger
        aria-label={ariaLabel}
        data-force={force === "hover" || force === "focus" ? force : undefined}
        className={cn(
          "group/picker ds-shadow flex shrink-0 cursor-pointer items-center rounded-select-input outline-none ds-focus:ring-focus-neutral disabled:cursor-not-allowed",
          INPUT_SIZE[size],
          className,
        )}
      >
        {flag && (
          <span
            aria-hidden
            className={cn(
              "flex shrink-0 items-center justify-center overflow-hidden [&>img]:size-full [&>img]:object-contain [&>svg]:size-full",
              size === "xs" ? "size-select-input-xs-flag" : "size-select-input-flag",
              disabled ? (picked?.picture != null ? PICTURE_OFF : "text-icon-disabled-300") : "text-icon-sub-600",
            )}
          >
            {picked?.picture ?? <GlobeIcon />}
          </span>
        )}
        <span className="flex items-center gap-select-input-code-gap">
          <span className={cn("whitespace-nowrap text-paragraph-sm", disabled ? "text-text-disabled-300" : "text-text-strong-950")}>
            {picked ? (picked.code ?? picked.label) : placeholder}
          </span>
          <Arrow
            up={active}
            className={
              disabled ? "text-icon-disabled-300" : active ? "text-icon-strong-950" : "text-icon-sub-600 group-ds-hover/picker:text-icon-strong-950"
            }
          />
        </span>
      </SelectPrimitive.Trigger>
      <ListContext.Provider value={{ type: "country" }}>
        <SelectList width="menu">{children}</SelectList>
      </ListContext.Provider>
    </SelectPrimitive.Root>
  );
}

// ---- Inline Select ----

export type InlineSelectProps = RootProps & {
  type?: "icon" | "country";
  /** A value in a settings row (Neutrino, 21 Oct 2026, the step drawer):
   *  the word in Paragraph Compact (13/20) and text/strong-950 at rest, and
   *  the up-down chevrons in place of the arrow. */
  row?: boolean;
  /** Icon type: the 20 x 20 icon before the word. */
  icon?: React.ReactNode;
  placeholder?: React.ReactNode;
  "aria-label": string;
  children: React.ReactNode;
  className?: string;
  /** hover, active (the open look) or focus (the keyboard ring), for the Components page. */
  "data-force"?: PickerForce;
};

/** A picker with no box, inside a field or a line: the Text Input's Dropdown
 *  type. Keyboard focus: the Neutral ring (the page's proposal). */
export function InlineSelect({
  type = "icon",
  row = false,
  icon,
  placeholder,
  disabled,
  children,
  name,
  className,
  "aria-label": ariaLabel,
  "data-force": force,
  ...root
}: InlineSelectProps) {
  const { current, setCurrent, isOpen, setOpen } = usePicker(root);
  const picked = findItem(children, current);
  const active = !disabled && (isOpen || force === "active");
  const country = type === "country";

  const iconColour = disabled ? "text-icon-disabled-300" : active ? "text-icon-sub-600" : "text-icon-soft-400 group-ds-hover/inline:text-icon-sub-600";
  // At rest the word is text/sub-600 on the Icon type, text/strong-950 on Country (as drawn).
  const wordColour = disabled
    ? "text-text-disabled-300"
    : active || country || (row && picked)
      ? "text-text-strong-950"
      : "text-text-sub-600 group-ds-hover/inline:text-text-strong-950";
  const arrowColour = disabled ? "text-icon-disabled-300" : active ? "text-icon-strong-950" : "text-icon-sub-600 group-ds-hover/inline:text-icon-strong-950";

  return (
    <SelectPrimitive.Root value={current} onValueChange={setCurrent} open={isOpen} onOpenChange={setOpen} disabled={disabled} name={name}>
      <SelectPrimitive.Trigger
        aria-label={ariaLabel}
        data-force={force === "hover" || force === "focus" ? force : undefined}
        className={cn(
          "group/inline ds-shadow flex h-select-inline shrink-0 cursor-pointer items-center rounded-select-inline outline-none ds-focus:ring-focus-neutral disabled:cursor-not-allowed",
          country ? "gap-select-inline-flag-gap" : "gap-select-inline-icon-gap",
          className,
        )}
      >
        {country ? (
          <span
            aria-hidden
            className={cn(
              "flex size-select-inline-flag shrink-0 items-center justify-center overflow-hidden [&>img]:size-full [&>img]:object-contain [&>svg]:size-full",
              disabled ? (picked?.picture != null ? PICTURE_OFF : "text-icon-disabled-300") : "text-icon-sub-600",
            )}
          >
            {picked?.picture ?? <GlobeIcon />}
          </span>
        ) : (
          icon != null && (
            <span aria-hidden className={cn("flex shrink-0 [&_svg]:size-select-inline-icon", iconColour)}>
              {picked?.picture ?? icon}
            </span>
          )
        )}
        <span className="flex items-center gap-select-inline-arrow-gap">
          <span className={cn("whitespace-nowrap", row ? "text-paragraph-compact" : "text-paragraph-sm", wordColour)}>
            {picked ? (picked.code ?? picked.label) : placeholder}
          </span>
          {row ? (
            // A settings row's pick shows the up-down chevrons (OpenAI's inspector, 21 Oct 2026).
            <SortIcon className={cn("size-select-arrow shrink-0", arrowColour)} />
          ) : (
            <Arrow up={active} className={arrowColour} />
          )}
        </span>
      </SelectPrimitive.Trigger>
      <ListContext.Provider value={{ type: country ? "country" : "basic", mark: row ? "left" : "right" }}>
        <SelectList width="menu">{children}</SelectList>
      </ListContext.Provider>
    </SelectPrimitive.Root>
  );
}
