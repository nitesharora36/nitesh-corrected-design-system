"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva } from "class-variance-authority";
import { Command, useCommandState } from "cmdk";

import { useControllableState } from "@/components/ds/checkbox";
import { CompactButton } from "@/components/ds/compact-button";
import { LinkButton } from "@/components/ds/link-button";
import { ArrowDownIcon, ArrowUpIcon, CloseIcon, InfoIcon, ReturnKeyIcon, SearchIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/**
 * The design system's Command Menu, built from
 * design-system/components/command-menu.md (Nitesh's Figma "Command Menu
 * Search Input [1.1]" 4187:559, "Command Menu Items [1.1]" 4171:15653 and
 * "Command Menu Footer [1.1]" 4172:16590): searching or jumping anywhere from
 * the keyboard. cmdk does the searching and the arrow keys; the dialog is
 * Radix's.
 *
 *   <CommandMenu trigger={<Button>Search</Button>}>
 *     <CommandMenuSearch shortcut="⌘K" />
 *     <CommandMenuList>
 *       <CommandMenuGroup heading="Pages">
 *         <CommandMenuItem value="Settings" label="Settings" type="icon" picture={<SettingsIcon />} />
 *       </CommandMenuGroup>
 *     </CommandMenuList>
 *     <CommandMenuFooter />
 *   </CommandMenu>
 *
 * CommandMenu        the menu in a dialog: open, defaultOpen, onOpenChange,
 *                    trigger. Whether ⌘K opens it is for Nitesh to decide
 *                    (the page), so it binds no key.
 * CommandMenuPanel   the menu itself (600 wide), without the dialog
 * CommandMenuSearch  the search field: placeholder, shortcut ("⌘K"), info;
 *                    while typing a clear button takes the info icon's place
 * CommandMenuFilters the "Searching for" row: Tags (Gray, with close) as children
 * CommandMenuList, CommandMenuGroup (heading, action: a Link Button, Gray,
 *                    Small, such as "See All")
 * CommandMenuItem    a row: size sm 40 | md 64; type basic (words only) |
 *                    icon | avatar | brand | company | country (its picture in
 *                    `picture`); label, sublabel, description (Medium), badge
 *                    (a Badge, Lighter, Gray, a slot), shortcut, action (the
 *                    Compact Button: Ghost at rest, White on the row you are
 *                    on), disabled. value is what the search matches.
 * CommandMenuRow     a row drawn still (data-force="hover"), for the Components page
 * CommandMenuFooter  the key hints and the help line with its Link Button
 *
 * The row the arrow keys (or the pointer) are on takes the Hover look; the
 * search field keeps keyboard focus, so rows get no focus ring (the page's
 * proposals). Disabled rows are the Dropdown's Disabled row (proposal). Each
 * part's line is drawn inside it; the last group has none, the footer draws
 * its own on top. Sizes are the tokens in styles/sizes/command-menu.css.
 */

export type CommandMenuRowSize = "sm" | "md";
export type CommandMenuRowType = "basic" | "icon" | "avatar" | "brand" | "company" | "country";

const LINE_BOTTOM = "ds-shadow [--ds-edge:var(--shadow-command-menu-line-bottom)]";
const LINE_TOP = "ds-shadow [--ds-edge:var(--shadow-command-menu-line-top)]";

/** The shortcut key's box: padding 2 and 6, corner 4, bg/white-0, a stroke/soft-200 edge, text/soft-400. */
function CommandMenuKey({ children, disabled }: { children: React.ReactNode; disabled?: boolean }) {
  return (
    <kbd
      className={cn(
        "ds-shadow edge-stroke-soft-200 shrink-0 rounded-command-menu-key bg-bg-white-0 px-command-menu-key-x py-command-menu-key-y font-sans text-subheading-xs uppercase",
        disabled ? "text-text-disabled-300" : "text-text-soft-400",
      )}
    >
      {children}
    </kbd>
  );
}

// ---- The menu ----

export type CommandMenuPanelProps = React.ComponentProps<typeof Command>;

/** 600 wide, corner 16, bg/white-0, a stroke/soft-200 edge inside, the menu shadow. */
export function CommandMenuPanel({ className, label = "Command Menu", ...props }: CommandMenuPanelProps) {
  return (
    <Command
      label={label}
      className={cn(
        "ds-shadow edge-stroke-soft-200 [--ds-lift:var(--shadow-command-menu)] flex max-h-full w-command-menu-w max-w-full flex-col overflow-hidden rounded-command-menu bg-bg-white-0 outline-none",
        className,
      )}
      {...props}
    />
  );
}

export type CommandMenuProps = CommandMenuPanelProps & {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** The button that opens it: one element that takes a ref. */
  trigger?: React.ReactElement;
};

/** The menu in a dialog over the page, on the Modal's backdrop (overlay/gray). */
export function CommandMenu({ open, defaultOpen = false, onOpenChange, trigger, label = "Command Menu", ...panel }: CommandMenuProps) {
  const [isOpen, setOpen] = useControllableState(open, defaultOpen, onOpenChange);
  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={setOpen}>
      {trigger != null && <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>}
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-space-0 z-50 bg-overlay-gray" />
        <DialogPrimitive.Content aria-describedby={undefined} className="fixed inset-space-0 z-50 m-auto flex h-fit max-h-full w-fit max-w-full outline-none">
          <DialogPrimitive.Title className="sr-only">{label}</DialogPrimitive.Title>
          <CommandMenuPanel label={label} {...panel} />
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

// ---- Search field ----

export type CommandMenuSearchProps = {
  placeholder?: string;
  /** The shortcut key, for example "⌘K". */
  shortcut?: React.ReactNode;
  /** The info icon on the right (on by default). */
  info?: boolean;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  clearLabel?: string;
  className?: string;
  /** Shows a state on the Components page. */
  "data-force"?: "hover";
};

/** 48 tall, padding 14 and 20, gap 8, the line at the bottom. Its fill is the
 *  menu's own bg/white-0 in every state. */
export function CommandMenuSearch({
  placeholder = "Search...",
  shortcut,
  info = true,
  value,
  defaultValue = "",
  onValueChange,
  clearLabel = "Clear search",
  className,
  "data-force": force,
}: CommandMenuSearchProps) {
  const [text, setText] = useControllableState(value, defaultValue, onValueChange);
  const typing = text !== "";
  return (
    <div
      data-force={force}
      className={cn(
        "group/search flex h-command-menu-search w-full shrink-0 items-center gap-command-menu-search-gap px-command-menu-search-x py-command-menu-search-y",
        LINE_BOTTOM,
        className,
      )}
    >
      <SearchIcon className={cn("size-command-menu-icon shrink-0", typing ? "text-primary-base" : "text-icon-soft-400")} />
      <Command.Input
        value={text}
        onValueChange={setText}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-paragraph-sm text-text-strong-950 outline-none placeholder:text-text-soft-400 group-ds-hover/search:placeholder:text-text-sub-600"
      />
      {shortcut != null && <CommandMenuKey>{shortcut}</CommandMenuKey>}
      {typing ? (
        <CompactButton variant="ghost" size="md" aria-label={clearLabel} onClick={() => setText("")}>
          <CloseIcon />
        </CompactButton>
      ) : (
        info && <InfoIcon className="size-command-menu-icon shrink-0 text-icon-disabled-300" />
      )}
    </div>
  );
}

// ---- Filter tags ----

/** Padding 16 and 20: the heading ("Searching for"), then the Tags, 12 under it, 8 apart. */
export function CommandMenuFilters({
  heading = "Searching for",
  children,
  className,
}: {
  heading?: React.ReactNode;
  /** Tags (tag.md), Gray, with their close icon. */
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex shrink-0 flex-col gap-command-menu-filters-gap px-command-menu-filters-x py-command-menu-filters-y", LINE_BOTTOM, className)}>
      <p className="text-label-xs text-text-sub-600">{heading}</p>
      <div className="flex flex-wrap items-center gap-command-menu-tags-gap">{children}</div>
    </div>
  );
}

// ---- List and groups ----

export function CommandMenuList({ className, ...props }: React.ComponentProps<typeof Command.List>) {
  return <Command.List className={cn("min-h-space-0 flex-1 overflow-y-auto", className)} {...props} />;
}

export type CommandMenuGroupProps = Omit<React.ComponentProps<typeof Command.Group>, "heading"> & {
  heading?: string;
  /** A Link Button, Gray, Small ("See All"), at the end of the heading row. */
  action?: React.ReactNode;
};

/** Padding 16 top, 8 sides, 12 bottom; the heading (text-label-xs), then the
 *  rows 8 under it, with no gap between rows. */
export function CommandMenuGroup({ heading, action, className, children, ...props }: CommandMenuGroupProps) {
  return (
    <Command.Group
      heading={heading}
      className={cn(
        "relative pt-command-menu-group-top px-command-menu-group-x pb-command-menu-group-bottom",
        LINE_BOTTOM,
        // The last group shown has no line: the footer draws its own on top.
        "[&:not(:has(~[cmdk-group]:not([hidden])))]:edge-none",
        "[&_[cmdk-group-heading]]:mb-command-menu-group-heading-gap [&_[cmdk-group-heading]]:px-command-menu-heading-x [&_[cmdk-group-heading]]:text-label-xs [&_[cmdk-group-heading]]:text-text-sub-600",
        className,
      )}
      {...props}
    >
      {action != null && <div className="absolute top-command-menu-group-top right-command-menu-group-action-right flex">{action}</div>}
      {children}
    </Command.Group>
  );
}

// ---- Rows ----

const rowVariants = cva(
  [
    "flex w-full shrink-0 cursor-pointer select-none items-center bg-bg-white-0 text-left outline-none transition-colors duration-150",
    // The row the pointer or the arrow keys are on: the Hover fill.
    "ds-hover:bg-bg-weak-50 data-[selected=true]:bg-bg-weak-50",
    "aria-disabled:cursor-not-allowed",
  ],
  {
    variants: {
      size: {
        sm: "h-command-menu-sm gap-command-menu-sm-gap rounded-command-menu-sm px-command-menu-sm-x py-command-menu-sm-y",
        md: "h-command-menu-md gap-command-menu-md-gap rounded-command-menu-md p-command-menu-md-pad",
      },
    },
    defaultVariants: { size: "sm" },
  },
);

export type CommandMenuRowContent = {
  size?: CommandMenuRowSize;
  type?: CommandMenuRowType;
  /** An icon, an Avatar, a brand or company logo, a flag. */
  picture?: React.ReactNode;
  label: React.ReactNode;
  /** "(Sublabel)", 4 after the label. */
  sublabel?: React.ReactNode;
  /** Medium only: a line 4 under the label. */
  description?: React.ReactNode;
  /** A Badge (badge.md), Lighter, Gray, Medium. */
  badge?: React.ReactNode;
  shortcut?: React.ReactNode;
  /** The Compact Button, Medium (20), at the end. */
  action?: { icon: React.ReactNode; label: string; onClick?: () => void };
  disabled?: boolean;
};

const PICTURE_OFF = "opacity-command-menu-picture-off";

/** The picture: 20 on Small; on Medium an Avatar at 40, anything else in a
 *  40 circle, bg/white-0, a stroke/soft-200 edge, the card shadow (an icon
 *  at 20, a logo or a flag at 24). */
function RowPicture({ size, type, disabled, children }: { size: CommandMenuRowSize; type: CommandMenuRowType; disabled?: boolean; children: React.ReactNode }) {
  const fade = disabled && type !== "icon" ? PICTURE_OFF : "";
  const fill = "[&>img]:size-full [&>img]:object-contain [&>svg]:size-full";
  if (size === "sm" || type === "avatar") {
    return (
      <span
        aria-hidden
        className={cn(
          "flex shrink-0 items-center justify-center overflow-hidden",
          size === "sm" ? "size-command-menu-sm-picture" : "size-command-menu-md-picture",
          fill,
          fade,
        )}
      >
        {children}
      </span>
    );
  }
  return (
    <span
      aria-hidden
      className={cn(
        "ds-shadow edge-stroke-soft-200 lift-card flex size-command-menu-md-picture shrink-0 items-center justify-center rounded-command-menu-picture bg-bg-white-0",
        type === "icon" ? "p-command-menu-md-icon-pad" : "p-command-menu-md-logo-pad",
      )}
    >
      <span className={cn("flex size-full items-center justify-center overflow-hidden", fill, fade)}>{children}</span>
    </span>
  );
}

/** What a row holds, left to right: the picture, the words, the Badge, the
 *  shortcut key, the button. `active` is the row you are on. */
function RowBody({
  size = "sm",
  type = "basic",
  picture,
  label,
  sublabel,
  description,
  badge,
  shortcut,
  action,
  disabled,
  active,
}: CommandMenuRowContent & { active: boolean }) {
  const quiet = disabled ? "text-text-disabled-300" : "text-text-sub-600";
  return (
    <>
      {type !== "basic" && picture != null && (
        <RowPicture size={size} type={type} disabled={disabled}>
          {picture}
        </RowPicture>
      )}
      <span className="flex min-w-0 flex-1 flex-col gap-command-menu-description-gap">
        <span className="flex min-w-0 items-center gap-command-menu-sublabel-gap">
          <span className={cn("truncate", size === "md" ? "text-label-sm" : "text-paragraph-sm", disabled ? "text-text-disabled-300" : "text-text-strong-950")}>
            {label}
          </span>
          {sublabel != null && <span className={cn("shrink-0 text-paragraph-xs", quiet)}>{sublabel}</span>}
        </span>
        {size === "md" && description != null && <span className={cn("truncate text-paragraph-xs", quiet)}>{description}</span>}
      </span>
      {badge}
      {shortcut != null && <CommandMenuKey disabled={disabled}>{shortcut}</CommandMenuKey>}
      {action != null && (
        <CompactButton
          variant={active ? "white" : "ghost"}
          size="md"
          aria-label={action.label}
          disabled={disabled}
          onClick={(e) => {
            // Its own action: it does not pick the row.
            e.stopPropagation();
            action.onClick?.();
          }}
        >
          {action.icon}
        </CompactButton>
      )}
    </>
  );
}

export type CommandMenuItemProps = CommandMenuRowContent & {
  /** What the search matches, and the row's id for the arrow keys. */
  value: string;
  /** More words the search matches. */
  keywords?: string[];
  onSelect?: (value: string) => void;
  className?: string;
};

export function CommandMenuItem({ value, keywords, onSelect, disabled, className, ...content }: CommandMenuItemProps) {
  const active = useCommandState((state) => state.value === value.trim());
  return (
    <Command.Item
      value={value}
      keywords={keywords}
      onSelect={onSelect}
      disabled={disabled}
      className={cn(rowVariants({ size: content.size }), disabled ? "text-icon-disabled-300" : "text-icon-sub-600", className)}
    >
      <RowBody {...content} disabled={disabled} active={active && !disabled} />
    </Command.Item>
  );
}

/** A row drawn still (no cmdk), for the Components page. */
export function CommandMenuRow({
  className,
  "data-force": force,
  ...content
}: CommandMenuRowContent & { className?: string; "data-force"?: "hover" }) {
  return (
    <div
      aria-disabled={content.disabled || undefined}
      data-force={force}
      className={cn(rowVariants({ size: content.size }), content.disabled ? "text-icon-disabled-300" : "text-icon-sub-600", className)}
    >
      <RowBody {...content} active={force === "hover" && !content.disabled} />
    </div>
  );
}

// ---- Footer ----

/** A 20 x 20 key: padding 2, corner 4, bg/weak-50, a stroke/soft-200 edge, a 16 arrow. */
function HintKey({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="ds-shadow edge-stroke-soft-200 flex size-command-menu-hint-key shrink-0 items-center justify-center rounded-command-menu-hint-key bg-bg-weak-50 p-command-menu-hint-key-pad text-icon-sub-600 [&_svg]:size-command-menu-hint-icon">
      {children}
    </kbd>
  );
}

export type CommandMenuFooterProps = {
  helpText?: React.ReactNode;
  helpLabel?: React.ReactNode;
  /** Where the Link Button goes; without it, onHelp runs. */
  helpHref?: string;
  onHelp?: () => void;
  className?: string;
};

/** 48 tall, padding 14 and 20, gap 12, the line on top: the key hints on the
 *  left, the help line and a Link Button, Primary, Small on the right. */
export function CommandMenuFooter({
  helpText = "Not what you're looking for? Try the",
  helpLabel = "Help Center",
  helpHref,
  onHelp,
  className,
}: CommandMenuFooterProps) {
  return (
    <div
      className={cn(
        "flex h-command-menu-footer w-full shrink-0 items-center gap-command-menu-footer-gap px-command-menu-footer-x py-command-menu-footer-y text-paragraph-xs text-text-sub-600",
        LINE_TOP,
        className,
      )}
    >
      <span className="flex items-center gap-command-menu-hint-gap">
        <HintKey>
          <ArrowUpIcon />
        </HintKey>
        <HintKey>
          <ArrowDownIcon />
        </HintKey>
        Navigate
      </span>
      <span className="flex items-center gap-command-menu-hint-gap">
        <HintKey>
          <ReturnKeyIcon />
        </HintKey>
        Select
      </span>
      <span className="ms-auto flex items-center gap-command-menu-help-gap">
        {helpText}
        {helpHref ? (
          <LinkButton variant="primary" size="sm" href={helpHref}>
            {helpLabel}
          </LinkButton>
        ) : (
          <LinkButton variant="primary" size="sm" onClick={onHelp}>
            {helpLabel}
          </LinkButton>
        )}
      </span>
    </div>
  );
}

export { rowVariants as commandMenuRowVariants };
