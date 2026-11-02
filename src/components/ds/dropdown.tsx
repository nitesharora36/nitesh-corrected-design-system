"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cva } from "class-variance-authority";

import { Button } from "@/components/ds/button";
import { Checkbox, useControllableState } from "@/components/ds/checkbox";
import { ContentDivider } from "@/components/ds/content-divider";
import { Switch } from "@/components/ds/switch";
import { ChevronRightIcon, CrossCircleIcon, SearchIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/**
 * The design system's Dropdown, built from design-system/components/dropdown.md
 * (Nitesh's Figma "Dropdown Items [1.1]", node 379:6629, and "Dropdown Misc
 * Items [1.1]", node 414:8031), on Radix's dropdown menu. Every menu in the
 * product is this menu with these rows; the Select's list (select.md) too.
 *
 *   <Dropdown>
 *     <DropdownTrigger asChild><Button>Open</Button></DropdownTrigger>
 *     <DropdownContent>
 *       <DropdownItem label="Settings" picture={<SettingsIcon />} shortcut="⌘S" />
 *       <DropdownSeparator />
 *       <DropdownCheckboxItem label="Show hidden" />
 *     </DropdownContent>
 *   </Dropdown>
 *
 * DropdownContent   the menu: padding 8, rows 4 apart, corner 16, 300 wide
 *                   (width menu | trigger | content)
 * DropdownItem      a row that acts. size sm 36 | lg 56; type basic | country |
 *                   avatar | provider | brand | company (its picture in
 *                   `picture`); label, sublabel, description (Large), badge (a
 *                   Badge, a slot), shortcut ("⌘1"), action (a Link Button on
 *                   Small, a Button on Large, a slot), rightIcon, disabled
 * DropdownCheckboxItem  a row that turns something on: control checkbox (the
 *                   Checkbox on the left) | switch (the Switch on the right)
 * DropdownSub, DropdownSubTrigger (a row with the chevron), DropdownSubContent
 * DropdownGroup, DropdownHeading (a Content Divider, Text), DropdownSeparator
 *                   (a Content Divider, Line Spacing)
 * DropdownSearch, DropdownButtonRow, DropdownCaption   the extra rows
 * DropdownPanel, DropdownRow   the menu and a row drawn still, for the
 *                   Components page (data-force="hover" or "focus" on a row)
 *
 * Hover changes only the fill; a pick shows as the Checkbox or Switch on (or,
 * in a Select, a check on the right). Keyboard focus is the Neutral focus
 * ring around the row (the page's proposal). Sizes are the tokens in
 * styles/sizes/dropdown.css; the shadow is --shadow-dropdown-menu there.
 */

export type DropdownRowSize = "sm" | "lg";
export type DropdownRowType = "basic" | "country" | "avatar" | "provider" | "brand" | "company";

// ---- The menu ----

/** The menu's box: bg/white-0, a stroke/soft-200 edge inside, the menu shadow, corner 16. */
export const dropdownMenuSurface =
  "ds-shadow edge-stroke-soft-200 [--ds-lift:var(--shadow-dropdown-menu)] rounded-dropdown-menu bg-bg-white-0 outline-none";
/** Inside the box: padding 8, rows 4 apart. */
export const dropdownMenuBody = "flex flex-col gap-dropdown-menu-gap p-dropdown-menu-pad";
/** A group keeps its rows 4 apart too. */
export const dropdownMenuGroup = "flex flex-col gap-dropdown-menu-gap";

const MENU_WIDTH = {
  menu: "w-dropdown-menu-w",
  trigger: "w-(--radix-dropdown-menu-trigger-width)",
  content: "w-max",
} as const;
export type DropdownMenuWidth = keyof typeof MENU_WIDTH;

/** The menu opens 10 from its button, on whichever side Radix puts it. */
const OFFSET =
  "data-[side=bottom]:mt-dropdown-menu-offset data-[side=top]:mb-dropdown-menu-offset data-[side=left]:mr-dropdown-menu-offset data-[side=right]:ml-dropdown-menu-offset";

export const Dropdown = DropdownMenuPrimitive.Root;
/** The button that opens the menu: pass asChild and a Button, an Avatar or a Compact Button. */
export const DropdownTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownSub = DropdownMenuPrimitive.Sub;

export type DropdownContentProps = React.ComponentProps<typeof DropdownMenuPrimitive.Content> & {
  width?: DropdownMenuWidth;
};

export function DropdownContent({ width = "menu", align = "start", className, ...props }: DropdownContentProps) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        align={align}
        className={cn(
          "z-50 max-h-(--radix-dropdown-menu-content-available-height) overflow-y-auto",
          dropdownMenuSurface,
          dropdownMenuBody,
          MENU_WIDTH[width],
          OFFSET,
          className,
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

export function DropdownSubContent({
  width = "menu",
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent> & { width?: DropdownMenuWidth }) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.SubContent
        className={cn(
          "z-50 max-h-(--radix-dropdown-menu-content-available-height) overflow-y-auto",
          dropdownMenuSurface,
          dropdownMenuBody,
          MENU_WIDTH[width],
          // Past the parent menu's padding, so it opens at the parent's edge.
          "data-[side=right]:ml-dropdown-menu-pad data-[side=left]:mr-dropdown-menu-pad",
          className,
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

/** The menu drawn still (no Radix), for the Components page. */
export function DropdownPanel({
  width = "menu",
  className,
  ...props
}: React.ComponentProps<"div"> & { width?: Exclude<DropdownMenuWidth, "trigger"> }) {
  return <div className={cn(dropdownMenuSurface, dropdownMenuBody, MENU_WIDTH[width], className)} {...props} />;
}

export function DropdownGroup({ className, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return <DropdownMenuPrimitive.Group className={cn(dropdownMenuGroup, className)} {...props} />;
}

/** A group's heading ("SUPPORT"): the Content Divider, Text (24 tall). */
export function DropdownHeading({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <DropdownMenuPrimitive.Label asChild>
      <ContentDivider type="text" className={className}>
        {children}
      </ContentDivider>
    </DropdownMenuPrimitive.Label>
  );
}

/** Between groups: the Content Divider, Line Spacing (4 tall). */
export function DropdownSeparator({ className }: { className?: string }) {
  return (
    <DropdownMenuPrimitive.Separator asChild>
      <ContentDivider type="line-spacing" className={className} />
    </DropdownMenuPrimitive.Separator>
  );
}

// ---- A row (Dropdown Items) ----

const rowVariants = cva(
  [
    // The Default fill, bg/white-0, is the menu's own showing through, so a
    // row scrolled to the menu's top never covers its edge.
    "group/row ds-shadow flex w-full shrink-0 cursor-pointer select-none items-center bg-transparent text-left outline-none",
    "transition-[background-color,box-shadow] duration-150",
    // Hover changes only the fill. Keyboard focus: the Neutral ring (the page's proposal).
    "ds-hover:bg-bg-weak-50 ds-focus:ring-focus-neutral",
    "aria-disabled:cursor-not-allowed",
  ],
  {
    variants: {
      size: {
        sm: "h-dropdown-sm gap-dropdown-sm-gap rounded-dropdown-sm p-dropdown-sm-pad",
        lg: "h-dropdown-lg gap-dropdown-lg-gap rounded-dropdown-lg p-dropdown-lg-pad",
      },
    },
    defaultVariants: { size: "sm" },
  },
);

/** Flags, avatars and logos drop to 48% in a Disabled row; icons take icon/disabled-300. */
const PICTURE_OFF = "opacity-dropdown-picture-off";

/** The picture: 20 x 20 on Small (a card logo 26 x 20); on Large an Avatar
 *  at 40, anything else in a 40 circle with an edge and the card shadow, no
 *  fill (an icon or flag at 20, a logo at 24, a card logo at 32 x 24). */
export function DropdownPicture({
  size,
  type,
  disabled,
  children,
}: {
  size: DropdownRowSize;
  type: DropdownRowType;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  const fade = disabled && type !== "basic" ? PICTURE_OFF : "";
  const fill = "[&>img]:size-full [&>img]:object-contain [&>svg]:size-full";
  if (size === "sm") {
    return (
      <span
        aria-hidden
        className={cn(
          "flex shrink-0 items-center justify-center overflow-hidden",
          type === "provider" ? "h-dropdown-sm-picture w-dropdown-sm-provider-w" : "size-dropdown-sm-picture",
          fill,
          fade,
        )}
      >
        {children}
      </span>
    );
  }
  if (type === "avatar") {
    return (
      <span aria-hidden className={cn("flex size-dropdown-lg-picture shrink-0 items-center justify-center", fade)}>
        {children}
      </span>
    );
  }
  return (
    <span
      aria-hidden
      className={cn(
        "ds-shadow edge-stroke-soft-200 flex size-dropdown-lg-picture shrink-0 items-center justify-center rounded-dropdown-lg-picture",
        disabled ? "lift-none" : "lift-card",
        type === "basic" || type === "country" ? "p-dropdown-lg-icon-pad" : type === "provider" ? "" : "p-dropdown-lg-logo-pad",
      )}
    >
      <span
        className={cn(
          "flex items-center justify-center overflow-hidden",
          type === "provider" ? "h-dropdown-lg-provider-h w-dropdown-lg-provider-w" : "size-full",
          fill,
          fade,
        )}
      >
        {children}
      </span>
    </span>
  );
}

/** The shortcut key's box: padding 2 and 6, corner 4, bg/white-0, a stroke/soft-200 edge. */
function DropdownKey({ children, disabled }: { children: React.ReactNode; disabled?: boolean }) {
  return (
    <kbd
      className={cn(
        "ds-shadow edge-stroke-soft-200 shrink-0 rounded-dropdown-key bg-bg-white-0 px-dropdown-key-x py-dropdown-key-y font-sans text-subheading-xs uppercase",
        disabled ? "text-text-disabled-300" : "text-text-sub-600",
      )}
    >
      {children}
    </kbd>
  );
}

export type DropdownRowProps = Omit<React.ComponentProps<"div">, "children"> & {
  size?: DropdownRowSize;
  type?: DropdownRowType;
  /** An icon (Basic), a flag, an Avatar, a card or brand or company logo. */
  picture?: React.ReactNode;
  label: React.ReactNode;
  /** "(Sublabel)", 4 after the label. */
  sublabel?: React.ReactNode;
  /** Large only: a line 4 under the label. */
  description?: React.ReactNode;
  /** A Badge (badge.md), Lighter, Blue, Medium. Pass it Gray when the row is disabled. */
  badge?: React.ReactNode;
  /** The shortcut key, for example "⌘1". */
  shortcut?: React.ReactNode;
  /** The Checkbox (Medium) on the left, on when checked. */
  checkbox?: boolean;
  /** The Switch on the right, on when checked. */
  toggle?: boolean;
  checked?: boolean;
  /** A Link Button, Primary, Medium on Small rows; a Button, Primary, Lighter, X-Small on Large rows. */
  action?: React.ReactNode;
  /** The 20 x 20 icon on the right: a chevron for a sub-menu, or a check. */
  rightIcon?: React.ReactNode;
  disabled?: boolean;
  /** Shows a state on the Components page. */
  "data-force"?: "hover" | "focus";
};

/** A row as it looks. DropdownItem and the Select's rows are this row inside
 *  Radix; on its own it is the row drawn still. */
export function DropdownRow({
  size = "sm",
  type = "basic",
  picture,
  label,
  sublabel,
  description,
  badge,
  shortcut,
  checkbox,
  toggle,
  checked = false,
  action,
  rightIcon,
  disabled,
  className,
  onPointerEnter,
  onPointerLeave,
  "data-force": force,
  ...props
}: DropdownRowProps) {
  // The Checkbox and Switch show their own Hover while the row is hovered.
  const [pointerIn, setPointerIn] = React.useState(false);
  const partsForce = !disabled && (force === "hover" || pointerIn) ? "hover" : undefined;
  const strong = disabled ? "text-text-disabled-300" : "text-text-strong-950";

  return (
    <div
      aria-disabled={disabled || undefined}
      data-force={force}
      onPointerEnter={(e) => {
        setPointerIn(true);
        onPointerEnter?.(e);
      }}
      onPointerLeave={(e) => {
        setPointerIn(false);
        onPointerLeave?.(e);
      }}
      className={cn(rowVariants({ size }), disabled ? "text-icon-disabled-300" : "text-icon-sub-600", className)}
      {...props}
    >
      {checkbox && (
        // Drawn only: the whole row is the control.
        <Checkbox checked={checked} disabled={disabled} tabIndex={-1} aria-hidden data-force={partsForce} className="pointer-events-none" />
      )}
      {picture != null && (
        <DropdownPicture size={size} type={type} disabled={disabled}>
          {picture}
        </DropdownPicture>
      )}
      <span className="flex min-w-0 flex-1 flex-col gap-dropdown-description-gap">
        <span className="flex min-w-0 items-center gap-dropdown-sublabel-gap">
          <span className={cn("truncate", size === "lg" ? "text-label-sm" : "text-paragraph-sm", strong)}>{label}</span>
          {sublabel != null && (
            <span className={cn("shrink-0 text-paragraph-xs", disabled ? "text-text-disabled-300" : "text-text-soft-400")}>{sublabel}</span>
          )}
        </span>
        {size === "lg" && description != null && (
          <span className={cn("truncate text-paragraph-xs", disabled ? "text-text-disabled-300" : "text-text-sub-600")}>{description}</span>
        )}
      </span>
      {badge}
      {shortcut != null && <DropdownKey disabled={disabled}>{shortcut}</DropdownKey>}
      {toggle && <Switch checked={checked} disabled={disabled} tabIndex={-1} aria-hidden data-force={partsForce} className="pointer-events-none" />}
      {action != null && (
        // Its own button: a click on it does not pick the row.
        <span className="flex shrink-0" onClick={(e) => e.stopPropagation()}>
          {action}
        </span>
      )}
      {rightIcon != null && (
        <span aria-hidden className="flex shrink-0 empty:hidden [&_svg]:size-dropdown-icon">
          {rightIcon}
        </span>
      )}
    </div>
  );
}

// ---- Rows in the menu ----

export type DropdownItemProps = Omit<DropdownRowProps, "checkbox" | "toggle" | "checked" | "onSelect"> & {
  onSelect?: (event: Event) => void;
  /** The words the menu's type-ahead matches, when the label is not plain text. */
  textValue?: string;
};

/** A row that does something (Edit, Log out). */
export function DropdownItem({ onSelect, textValue, disabled, ...row }: DropdownItemProps) {
  return (
    <DropdownMenuPrimitive.Item asChild disabled={disabled} onSelect={onSelect} textValue={textValue}>
      <DropdownRow disabled={disabled} {...row} />
    </DropdownMenuPrimitive.Item>
  );
}

export type DropdownCheckboxItemProps = Omit<DropdownRowProps, "checkbox" | "toggle" | "checked" | "onSelect"> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** checkbox: the Checkbox on the left; switch: the Switch on the right. */
  control?: "checkbox" | "switch";
  /** Keeps the menu open after a pick, so several can be turned on. */
  keepOpen?: boolean;
  textValue?: string;
};

/** A row that turns something on or off. */
export function DropdownCheckboxItem({
  checked,
  defaultChecked = false,
  onCheckedChange,
  control = "checkbox",
  keepOpen = true,
  textValue,
  disabled,
  ...row
}: DropdownCheckboxItemProps) {
  const [on, setOn] = useControllableState(checked, defaultChecked, onCheckedChange);
  return (
    <DropdownMenuPrimitive.CheckboxItem
      asChild
      checked={on}
      onCheckedChange={setOn}
      disabled={disabled}
      textValue={textValue}
      onSelect={keepOpen ? (e) => e.preventDefault() : undefined}
    >
      <DropdownRow checkbox={control === "checkbox"} toggle={control === "switch"} checked={on} disabled={disabled} {...row} />
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

/** A row that opens a sub-menu: the chevron on the right. It keeps the Hover
 *  fill while its sub-menu is open. */
export function DropdownSubTrigger({
  textValue,
  disabled,
  className,
  ...row
}: Omit<DropdownRowProps, "rightIcon" | "checkbox" | "toggle" | "checked"> & { textValue?: string }) {
  return (
    <DropdownMenuPrimitive.SubTrigger asChild disabled={disabled} textValue={textValue}>
      <DropdownRow
        disabled={disabled}
        rightIcon={<ChevronRightIcon />}
        className={cn("data-[state=open]:bg-bg-weak-50", className)}
        {...row}
      />
    </DropdownMenuPrimitive.SubTrigger>
  );
}

// ---- Extra rows (Dropdown Misc Items) ----

export type DropdownSearchProps = Omit<React.ComponentProps<"input">, "size" | "type"> & {
  /** Called when the clear icon empties the field. */
  onClear?: () => void;
  clearLabel?: string;
  /** Shows a state on the Components page. */
  "data-force"?: "hover";
};

/** The search row: a search icon and the words, 8 apart, and a clear icon
 *  while typing. No corner, no edge; it fills the menu's width. */
export function DropdownSearch({
  value,
  defaultValue,
  onChange,
  onKeyDown,
  onClear,
  clearLabel = "Clear search",
  placeholder = "Search...",
  className,
  ref,
  "data-force": force,
  ...props
}: DropdownSearchProps) {
  const [typed, setTyped] = React.useState(() => (defaultValue == null ? "" : String(defaultValue)));
  const text = value != null ? String(value) : typed;
  const typing = text !== "";
  const own = React.useRef<HTMLInputElement | null>(null);

  return (
    <div
      data-force={force}
      className={cn(
        // bg/white-0 at rest is the menu's own (as on the rows).
        "group/search flex h-dropdown-search w-full shrink-0 items-center gap-dropdown-search-gap bg-transparent p-dropdown-search-pad",
        "transition-colors duration-150 ds-hover:bg-bg-weak-50",
        className,
      )}
    >
      <SearchIcon
        className={cn(
          "size-dropdown-search-icon shrink-0",
          typing ? "text-icon-sub-600" : "text-icon-soft-400 group-ds-hover/search:text-icon-sub-600",
        )}
      />
      <input
        ref={(node) => {
          own.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        type="search"
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        onChange={(e) => {
          setTyped(e.target.value);
          onChange?.(e);
        }}
        onKeyDown={(e) => {
          // Letters are for the field, not the menu's type-ahead.
          if (e.key.length === 1) e.stopPropagation();
          onKeyDown?.(e);
        }}
        className={cn(
          "min-w-0 flex-1 bg-transparent text-paragraph-sm text-text-strong-950 outline-none [&::-webkit-search-cancel-button]:hidden",
          "placeholder:text-text-soft-400 group-ds-hover/search:placeholder:text-text-sub-600",
        )}
        {...props}
      />
      {typing && (
        <button
          type="button"
          aria-label={clearLabel}
          onClick={() => {
            setTyped("");
            onClear?.();
            own.current?.focus();
          }}
          className="ds-shadow flex shrink-0 cursor-pointer rounded-dropdown-clear text-icon-soft-400 outline-none ds-focus:ring-focus-neutral [&_svg]:size-dropdown-search-icon"
        >
          <CrossCircleIcon />
        </button>
      )}
    </div>
  );
}

export type DropdownButtonRowProps = Omit<React.ComponentProps<"button">, "children"> & {
  children: React.ReactNode;
  leadingIcon?: React.ReactNode;
};

/** One Button, Neutral, Stroke, X-Small (32), full width ("Add Workspace"). */
export function DropdownButtonRow({ className, ...button }: DropdownButtonRowProps) {
  return (
    <div className={cn("flex h-dropdown-button-row w-full shrink-0 items-center p-dropdown-button-row-pad", className)}>
      <Button tone="neutral" variant="stroke" size="xs" className="w-full" {...button} />
    </div>
  );
}

/** One line of small print ("v.1.5.69 · Terms & Conditions"). */
export function DropdownCaption({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "flex h-dropdown-caption w-full shrink-0 items-center p-dropdown-caption-pad text-paragraph-sm text-text-soft-400",
        className,
      )}
      {...props}
    />
  );
}

export { rowVariants as dropdownRowVariants };
