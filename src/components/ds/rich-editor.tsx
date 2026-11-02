"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cva } from "class-variance-authority";

import { useControllableState } from "@/components/ds/checkbox";
import { Dropdown, DropdownTrigger } from "@/components/ds/dropdown";
import { fieldLookVariants } from "@/components/ds/text-input";
import { Tooltip } from "@/components/ds/tooltip";
import { ChevronDownIcon, ChevronUpIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/**
 * The design system's Rich Editor toolbar, built from
 * design-system/components/rich-editor.md (Nitesh's Figma "Rich Editor
 * [1.1]" 166926:17605, "Rich Editor Items [1.1]" 166251:2701 and "Rich
 * Editor Colors [1.1]" 166331:4100). The toolbar floats over the selected
 * text, or sits on top of a writing box. Plain text with no formatting is the
 * Text Area, not this.
 *
 * RichEditorToolbar  look floating (32 tall, its 1px edge outside, the card
 *                    shadow) | attached (the 36 row on a writing box)
 * RichEditorButton   type text ("Header", "14px") | dropdown (an icon and an
 *                    arrow) | color (a colour dot and an arrow) | icon (an
 *                    icon alone). label (its name, in the Tooltip above it),
 *                    icon, color, active, disabled; menu (the menu it opens:
 *                    a DropdownContent with its rows, or RichEditorColorMenu)
 * RichEditorDivider  the short line between groups of buttons
 * RichEditorColorMenu  the colour menu (132 wide) on Radix's dropdown menu;
 *                    RichEditorColorPanel and RichEditorColorRow draw it
 *                    still, for the Components page
 * RichEditorBox      the toolbar on a writing box (the Figma's example): the
 *                    Text Area's field with the toolbar row on top (the
 *                    page's proposal). toolbar, placeholder, footer (a slot
 *                    for the Text Area's Character Counter)
 *
 *   <RichEditorToolbar>
 *     <RichEditorButton type="text" label="Size" menu={<DropdownContent width="content">...</DropdownContent>}>14px</RichEditorButton>
 *     <RichEditorDivider />
 *     <RichEditorButton label="Bold" icon={<BoldIcon />} active={bold} onClick={toggleBold} />
 *   </RichEditorToolbar>
 *
 * Active means a menu is open (the arrow turns up, in blue; on a button with
 * a menu it follows the menu by itself) or a format is on (icon: the icon
 * turns blue). Proposals the page makes (Open): keyboard focus shows the
 * Neutral ring; Disabled has no fill and the disabled tokens. The colour dots
 * are the state tokens; Yellow, Purple, Sky, Pink and Teal wait for their
 * hues. This draws the toolbar; the writing area is a plain contentEditable,
 * no editor library. Sizes are the tokens in styles/sizes/rich-editor.css.
 */

// ---- Colour dots ----

export type RichEditorColor = "gray" | "blue" | "orange" | "red" | "green";

/** The page's dots in its order. Yellow, Purple, Sky, Pink and Teal have no
 *  hue in the palette yet (page, Open), so they are left out. */
export const RICH_EDITOR_COLORS: { id: RichEditorColor; label: string }[] = [
  { id: "gray", label: "Gray" },
  { id: "blue", label: "Blue" },
  { id: "orange", label: "Orange" },
  { id: "red", label: "Red" },
  { id: "green", label: "Green" },
];

/** Each dot is its state token's base (page, "Where this differs"). Written
 *  out so Tailwind sees them. */
const DOT: Record<RichEditorColor, string> = {
  gray: "bg-state-faded-base",
  blue: "bg-state-information-base",
  orange: "bg-state-warning-base",
  red: "bg-state-error-base",
  green: "bg-state-success-base",
};

/** The same tokens as a text colour, for words a person colours. */
export const RICH_EDITOR_TEXT_COLOR: Record<RichEditorColor, string> = {
  gray: "text-state-faded-base",
  blue: "text-state-information-base",
  orange: "text-state-warning-base",
  red: "text-state-error-base",
  green: "text-state-success-base",
};

/** The 16 x 16 colour dot. */
export function RichEditorDot({ color, disabled, className }: { color: RichEditorColor; disabled?: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("size-rich-editor-dot shrink-0 rounded-rich-editor-dot", disabled ? "bg-icon-disabled-300" : DOT[color], className)}
    />
  );
}

// ---- Button ----

export type RichEditorButtonType = "text" | "dropdown" | "color" | "icon";

const buttonVariants = cva(
  [
    "ds-shadow inline-flex h-rich-editor-button shrink-0 items-center gap-rich-editor-button-gap rounded-rich-editor-button py-rich-editor-button-pad pr-rich-editor-button-pad text-label-sm outline-none",
    "transition-[background-color,color,box-shadow] duration-150 [&_svg]:size-rich-editor-icon [&_svg]:shrink-0",
    // Keyboard focus: the Neutral ring (the page's proposal, Open).
    "ds-focus:ring-focus-neutral",
  ],
  {
    variants: {
      type: {
        text: "pl-rich-editor-button-text-left",
        color: "pl-rich-editor-button-color-left",
        dropdown: "pl-rich-editor-button-pad",
        icon: "pl-rich-editor-button-pad",
      },
      look: {
        default: "cursor-pointer bg-bg-white-0 text-text-sub-600 ds-hover:bg-bg-weak-50",
        active: "cursor-pointer bg-bg-weak-50 text-text-strong-950",
        // The page's proposal (Open): no fill, the disabled tokens.
        disabled: "cursor-not-allowed bg-transparent text-text-disabled-300",
      },
    },
    defaultVariants: { type: "icon", look: "default" },
  },
);

export type RichEditorButtonProps = Omit<React.ComponentProps<"button">, "type" | "color" | "children"> & {
  type?: RichEditorButtonType;
  /** Its name: shown in the Tooltip, and read out for buttons with no word. */
  label: string;
  /** Text: the word ("Header", "14px"). */
  children?: React.ReactNode;
  /** Dropdown and Icon: the 20 x 20 icon. */
  icon?: React.ReactNode;
  /** Color: the dot's colour. */
  color?: RichEditorColor;
  /** A format that is on (icon), or a menu drawn open. A button with a menu
   *  is Active while its menu is open. */
  active?: boolean;
  /** The menu this button opens: a DropdownContent with the Dropdown's rows
   *  (dropdown.md), or the RichEditorColorMenu. */
  menu?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** The Tooltip with its name on hover. On unless false. */
  tooltip?: boolean;
  "data-force"?: "hover" | "focus";
};

export function RichEditorButton({
  type = "icon",
  label,
  children,
  icon,
  color = "gray",
  active,
  disabled,
  menu,
  open,
  defaultOpen = false,
  onOpenChange,
  tooltip = true,
  className,
  onPointerEnter,
  ...props
}: RichEditorButtonProps) {
  const [isOpen, setOpen] = useControllableState(open, defaultOpen, onOpenChange);
  // The tooltip stays shut while the menu is open, and does not pop back up
  // when the closing menu hands the focus back to the button.
  const [tip, setTip] = React.useState(false);
  const menuJustClosed = React.useRef(false);

  const hasMenu = menu != null;
  const arrow = type !== "icon";
  const on = hasMenu ? isOpen : !!active;
  const look = disabled ? "disabled" : on ? "active" : "default";

  const iconColour = disabled
    ? "text-icon-disabled-300"
    : on
      ? type === "icon"
        ? "text-primary-base"
        : "text-icon-strong-950"
      : "text-icon-sub-600";
  const arrowColour = disabled ? "text-icon-disabled-300" : on ? "text-primary-base" : "text-icon-soft-400";

  // Text buttons are named by their word, with the button's name when they differ ("Size, 14px").
  const name =
    type === "text" ? (typeof children === "string" && children !== label ? `${label}, ${children}` : undefined) : label;

  // A button with a Radix menu gets aria-haspopup and aria-expanded from it,
  // so they are only set here when they have a value (an undefined here
  // would wipe out Radix's).
  const aria = {
    ...(name != null && { "aria-label": name }),
    ...(!arrow && !hasMenu && { "aria-pressed": !!active }),
    ...(arrow && !hasMenu && { "aria-haspopup": "menu" as const, "aria-expanded": !!active }),
  };

  const button = (
    <button
      type="button"
      disabled={disabled}
      {...aria}
      className={cn(buttonVariants({ type, look }), className)}
      onPointerEnter={(e) => {
        // A pointer coming back shows the name again, however the menu shut.
        menuJustClosed.current = false;
        onPointerEnter?.(e);
      }}
      {...props}
    >
      {type === "text" && <span className="whitespace-nowrap">{children}</span>}
      {(type === "dropdown" || type === "icon") && (
        <span aria-hidden className={cn("flex", iconColour)}>
          {icon}
        </span>
      )}
      {type === "color" && <RichEditorDot color={color} disabled={disabled} />}
      {arrow && (
        <span aria-hidden className={cn("flex", arrowColour)}>
          {on ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </span>
      )}
    </button>
  );

  const trigger = hasMenu ? <DropdownTrigger asChild>{button}</DropdownTrigger> : button;
  const withTip =
    !tooltip || disabled ? (
      trigger
    ) : (
      <Tooltip
        content={label}
        size="xs"
        variant="dark"
        tail="bottom-center"
        open={tip && !(hasMenu && isOpen)}
        onOpenChange={(next) => {
          if (next && menuJustClosed.current) {
            menuJustClosed.current = false;
            return;
          }
          setTip(next);
        }}
      >
        {trigger}
      </Tooltip>
    );

  if (!hasMenu) return withTip;
  return (
    <Dropdown
      open={isOpen}
      onOpenChange={(next) => {
        if (!next) menuJustClosed.current = true;
        setTip(false);
        setOpen(next);
      }}
    >
      {withTip}
      {menu}
    </Dropdown>
  );
}

// ---- Divider ----

/** A 1px line, 16 tall, centred in a space 4 wide. */
export function RichEditorDivider({ className, ...props }: Omit<React.ComponentProps<"span">, "children">) {
  return (
    <span
      role="separator"
      aria-orientation="vertical"
      className={cn("flex w-rich-editor-divider-space shrink-0 items-center justify-center", className)}
      {...props}
    >
      <span className="h-rich-editor-divider w-rich-editor-divider-line bg-stroke-soft-200" />
    </span>
  );
}

// ---- Toolbar ----

/** Left and right arrows move between the toolbar's buttons. */
function onToolbarKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
  if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
  const buttons = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>("button:not(:disabled)"));
  const at = buttons.indexOf(document.activeElement as HTMLButtonElement);
  if (at < 0) return;
  e.preventDefault();
  buttons[(at + (e.key === "ArrowRight" ? 1 : buttons.length - 1)) % buttons.length]?.focus();
}

const toolbarVariants = cva("items-center", {
  variants: {
    look: {
      // 32 tall, padding 2, 2 apart, corner 8, bg/white-0; the 1px
      // stroke/soft-200 edge outside (a ring, so the 32 and the 2 inside
      // stay), then the card shadow.
      floating: [
        "ds-shadow inline-flex h-rich-editor-toolbar gap-rich-editor-toolbar-gap rounded-rich-editor-toolbar bg-bg-white-0 p-rich-editor-toolbar-pad",
        "lift-card [--ds-edge:var(--shadow-rich-editor-edge)]",
      ],
      // On a writing box: 36 tall, padding 4, 4 apart, a 1px line along its
      // bottom; no corner, edge or shadow of its own. Scrolls sideways when
      // the box is narrow.
      attached: [
        "ds-shadow flex h-rich-editor-box-toolbar w-full shrink-0 gap-rich-editor-box-toolbar-gap overflow-x-auto p-rich-editor-box-toolbar-pad",
        "[--ds-edge:var(--shadow-rich-editor-line-bottom)]",
      ],
    },
  },
  defaultVariants: { look: "floating" },
});

export type RichEditorToolbarProps = React.ComponentProps<"div"> & {
  look?: "floating" | "attached";
};

export function RichEditorToolbar({ look, className, onKeyDown, "aria-label": ariaLabel = "Formatting", ...props }: RichEditorToolbarProps) {
  return (
    <div
      role="toolbar"
      aria-label={ariaLabel}
      onKeyDown={(e) => {
        onToolbarKeyDown(e);
        onKeyDown?.(e);
      }}
      className={cn(toolbarVariants({ look }), className)}
      {...props}
    />
  );
}

// ---- The colour menu ----

/** The colour menu's box: 132 wide, padding 4, rows 4 apart, corner 12. Fill,
 *  edge and shadow are the Dropdown's menu (the page: the menus are the
 *  Dropdown's). */
const colorMenuClass =
  "ds-shadow edge-stroke-soft-200 [--ds-lift:var(--shadow-dropdown-menu)] flex w-rich-editor-color-menu flex-col gap-rich-editor-color-menu-gap rounded-rich-editor-color-menu bg-bg-white-0 p-rich-editor-color-menu-pad outline-none";

/** The menu opens as far from its button as the Dropdown's, on whichever side Radix puts it. */
const MENU_OFFSET =
  "data-[side=bottom]:mt-rich-editor-menu-offset data-[side=top]:mb-rich-editor-menu-offset data-[side=left]:mr-rich-editor-menu-offset data-[side=right]:ml-rich-editor-menu-offset";

export type RichEditorColorRowProps = Omit<React.ComponentProps<"div">, "color"> & {
  color: RichEditorColor;
  /** The colour's name; RICH_EDITOR_COLORS's label unless set. */
  children?: React.ReactNode;
  "data-force"?: "hover" | "focus";
};

/** A row of the colour menu: 32 tall, padding 6, the dot and its name 8
 *  apart, corner 6. The name in text-label-sm, text/sub-600; on hover the
 *  row turns bg/weak-50 and the name text/strong-950. Keyboard focus: the
 *  Neutral ring, as on the Dropdown's rows. */
export function RichEditorColorRow({ color, children, className, ...props }: RichEditorColorRowProps) {
  return (
    <div
      className={cn(
        "ds-shadow flex h-rich-editor-color-row w-full shrink-0 cursor-pointer select-none items-center gap-rich-editor-color-row-gap rounded-rich-editor-color-row p-rich-editor-color-row-pad",
        "text-label-sm text-text-sub-600 outline-none transition-[background-color,color,box-shadow] duration-150",
        "ds-hover:bg-bg-weak-50 ds-hover:text-text-strong-950 ds-focus:ring-focus-neutral",
        className,
      )}
      {...props}
    >
      <RichEditorDot color={color} />
      <span className="truncate">{children ?? RICH_EDITOR_COLORS.find((c) => c.id === color)?.label}</span>
    </div>
  );
}

/** The colour menu drawn still (no Radix), for the Components page. */
export function RichEditorColorPanel({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn(colorMenuClass, className)} {...props} />;
}

export type RichEditorColorMenuProps = Omit<React.ComponentProps<typeof DropdownMenuPrimitive.Content>, "children"> & {
  value?: RichEditorColor;
  onValueChange?: (color: RichEditorColor) => void;
  /** Which colours to offer; all five unless set. */
  colors?: { id: RichEditorColor; label: string }[];
};

/** The colour menu, for a Color button's `menu`. */
export function RichEditorColorMenu({
  value,
  onValueChange,
  colors = RICH_EDITOR_COLORS,
  align = "start",
  className,
  ...props
}: RichEditorColorMenuProps) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content align={align} className={cn("z-50", colorMenuClass, MENU_OFFSET, className)} {...props}>
        <DropdownMenuPrimitive.RadioGroup
          value={value}
          onValueChange={(v) => onValueChange?.(v as RichEditorColor)}
          className="flex flex-col gap-rich-editor-color-menu-gap"
        >
          {colors.map((c) => (
            <DropdownMenuPrimitive.RadioItem key={c.id} value={c.id} textValue={c.label} asChild>
              <RichEditorColorRow color={c.id}>{c.label}</RichEditorColorRow>
            </DropdownMenuPrimitive.RadioItem>
          ))}
        </DropdownMenuPrimitive.RadioGroup>
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  );
}

// ---- The toolbar on a writing box ----

export type RichEditorBoxProps = Omit<React.ComponentProps<"div">, "children" | "onInput"> & {
  /** The toolbar row's buttons and dividers. */
  toolbar: React.ReactNode;
  placeholder?: string;
  /** Under the text: a slot for the Text Area's Character Counter. */
  footer?: React.ReactNode;
  /** Called with the plain text as it changes. */
  onTextChange?: (text: string) => void;
  /** The writing area (a plain contentEditable), for the toolbar's commands. */
  editorRef?: React.Ref<HTMLDivElement>;
  /** The writing area's name for screen readers. */
  textLabel?: string;
  /** Shows the focus look on the Components page. */
  "data-force"?: "focus";
};

/** At rest the Figma's box: corner 12, bg/white-0, a 1px stroke/soft-200
 *  edge inside, the card shadow. While the writing area has the focus, the
 *  Text Area's focus look (its edge and the Neutral ring). The box keeps no
 *  hover fill of its own: the toolbar's buttons show theirs. */
export function RichEditorBox({
  toolbar,
  placeholder = "Placeholder text...",
  footer,
  onTextChange,
  editorRef,
  textLabel = "Text",
  className,
  "data-force": force,
  ...props
}: RichEditorBoxProps) {
  const [text, setText] = React.useState("");
  const [hasFocus, setHasFocus] = React.useState(false);
  const focused = hasFocus || force === "focus";
  return (
    <div
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-rich-editor-box",
        focused
          ? fieldLookVariants({ look: "focus" })
          : "ds-shadow edge-stroke-soft-200 lift-card bg-bg-white-0 transition-[background-color,color,box-shadow] duration-150",
        className,
      )}
      {...props}
    >
      <RichEditorToolbar look="attached">{toolbar}</RichEditorToolbar>
      <div className="flex flex-col gap-rich-editor-box-gap pt-rich-editor-box-top pr-rich-editor-box-right pb-rich-editor-box-bottom pl-rich-editor-box-left">
        <div className="relative">
          {text === "" && (
            <span aria-hidden className="pointer-events-none absolute inset-space-0 text-paragraph-sm text-text-soft-400">
              {placeholder}
            </span>
          )}
          <div
            ref={editorRef}
            role="textbox"
            aria-multiline="true"
            aria-label={textLabel}
            aria-placeholder={placeholder}
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => {
              const t = e.currentTarget.textContent ?? "";
              setText(t);
              onTextChange?.(t);
            }}
            onFocus={() => setHasFocus(true)}
            onBlur={() => setHasFocus(false)}
            className="relative min-h-rich-editor-box-writing text-paragraph-sm text-text-strong-950 outline-none [&_ol]:list-decimal [&_ol]:ps-rich-editor-list-indent [&_ul]:list-disc [&_ul]:ps-rich-editor-list-indent"
          />
        </div>
        {footer}
      </div>
    </div>
  );
}
