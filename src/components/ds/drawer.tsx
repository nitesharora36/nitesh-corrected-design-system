"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ds/button";
import { CompactButton } from "@/components/ds/compact-button";
import { ContentDivider } from "@/components/ds/content-divider";
import { KeyIcon } from "@/components/ds/key-components";
import { ScrollArea, type ScrollAreaProps } from "@/components/ds/scroll";
import { CloseIcon } from "@/components/ui/icons";

/**
 * The design system's Drawer, built from design-system/components/drawer.md
 * (Nitesh's Figma Drawer page 486:7366), on Radix's dialog: a panel that
 * slides in against the right edge, the full height of the screen, while
 * the page stays in view.
 *
 *   <Drawer open={open} onOpenChange={setOpen}>
 *     <DrawerTrigger asChild><Button>Details</Button></DrawerTrigger>
 *     <DrawerContent>
 *       <DrawerHeader size="lg" type="left-icon" icon={<FileIcon />} title="..." description="..." />
 *       <DrawerBody>
 *         <DrawerSection>...</DrawerSection>
 *         <DrawerSection band="Owner">...</DrawerSection>
 *       </DrawerBody>
 *       <DrawerFooter />
 *     </DrawerContent>
 *   </Drawer>
 *
 * DrawerContent, DrawerPanel  floating: 8 in from the edges, corner 20, the
 *                medium shadow (drawer.md); off: docked to the right edge
 * Drawer         backdrop off (the default): no backdrop, the page stays
 *                usable beside it and a click on the page leaves it open.
 *                backdrop on: overlay/gray behind it, and the page waits
 *                until it closes (page, Open)
 * DrawerHeader   size sm 64 (title only) | md (Neutrino: a 28 picture, the
 *                title and a line of words) | lg 88 (title and description);
 *                type basic | left-icon (icon); badge (the number Badge, a
 *                slot), link (a Link Button, a slot), line (the Content
 *                Divider along the bottom), close (on by default)
 * DrawerBody     scrolls between the header and footer, with the Scroll
 * DrawerSection  padding 20, items 16 apart; band="Word" puts the Content
 *                Divider's Solid Text band above it, the section 12 below
 * DrawerFooter   type stretch (the default) | basic | checkbox | toggle |
 *                stepper | link-button; leading is the left part (a slot);
 *                cancel and confirm are the buttons' words (null leaves one out)
 *
 * DrawerPanel draws the panel still, for the Components page; the parts
 * also work on their own there. Sizes are the tokens in
 * styles/sizes/drawer.css.
 */

/** True inside a DrawerContent: the parts then use Radix's Title,
 *  Description and Close. */
const InDialog = React.createContext(false);
/** The Drawer's backdrop setting, for its content. */
const Backdrop = React.createContext(false);

// The product's base styles give paragraphs and headings margins
// (styles/typography.css); the title and description never take them.
function Title({ className, children }: { className: string; children: React.ReactNode }) {
  return React.useContext(InDialog) ? (
    <DialogPrimitive.Title className={cn("m-space-0", className)}>{children}</DialogPrimitive.Title>
  ) : (
    <p className={cn("m-space-0", className)}>{children}</p>
  );
}

function Description({ className, children }: { className: string; children: React.ReactNode }) {
  return React.useContext(InDialog) ? (
    <DialogPrimitive.Description className={cn("m-space-0", className)}>{children}</DialogPrimitive.Description>
  ) : (
    <p className={cn("m-space-0", className)}>{children}</p>
  );
}

/** A button that closes the drawer when it is in one. */
function Closes({ children }: { children: React.ReactElement }) {
  return React.useContext(InDialog) ? <DialogPrimitive.Close asChild>{children}</DialogPrimitive.Close> : children;
}

// ---- The panel ----

/** bg/white-0. Docked: a 1px stroke/soft-200 line down the left side, no
 *  corner, no shadow. Floating: corner 20 and the medium shadow, no line.
 *  Header at the top, Footer at the bottom, the body between. */
const PANEL = "ds-shadow flex w-drawer max-w-full flex-col bg-bg-white-0 outline-none";
const DOCKED = "[--ds-edge:var(--shadow-drawer-panel-line)]";
const FLOATING = "overflow-hidden rounded-drawer-floating [--ds-lift:var(--shadow-drawer)]";

export type DrawerProps = Omit<React.ComponentProps<typeof DialogPrimitive.Root>, "modal"> & {
  /** overlay/gray behind the drawer, and the page waits until it closes. */
  backdrop?: boolean;
};

export function Drawer({ backdrop = false, ...props }: DrawerProps) {
  return (
    <Backdrop.Provider value={backdrop}>
      <DialogPrimitive.Root modal={backdrop} {...props} />
    </Backdrop.Provider>
  );
}

export const DrawerTrigger = DialogPrimitive.Trigger;
export const DrawerClose = DialogPrimitive.Close;

export type DrawerContentProps = React.ComponentProps<typeof DialogPrimitive.Content> & {
  /** 8 in from the top, right and bottom, corner 20, the medium shadow. */
  floating?: boolean;
};

export function DrawerContent({ floating = false, className, children, onInteractOutside, ...props }: DrawerContentProps) {
  const backdrop = React.useContext(Backdrop);
  return (
    <DialogPrimitive.Portal>
      {backdrop && <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-overlay-gray" />}
      <DialogPrimitive.Content
        // Without a backdrop the drawer sits beside the work: using the page leaves it open.
        onInteractOutside={(event) => {
          onInteractOutside?.(event);
          if (!backdrop) event.preventDefault();
        }}
        className={cn(
          PANEL,
          floating ? cn(FLOATING, "fixed inset-y-drawer-inset right-drawer-inset z-50") : cn(DOCKED, "fixed inset-y-0 right-0 z-50"),
          "data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right",
          className,
        )}
        {...props}
      >
        <InDialog.Provider value>{children}</InDialog.Provider>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

/** The panel, still: the Components page and anywhere a drawer is drawn in
 *  place (the Workflow Studio's step drawer). Floating, the caller keeps it
 *  8 in from the edges (`m-drawer-inset`). */
export function DrawerPanel({ floating = false, className, ...props }: React.ComponentProps<"div"> & { floating?: boolean }) {
  return <div className={cn(PANEL, floating ? FLOATING : DOCKED, className)} {...props} />;
}

// ---- Header ----

export type DrawerHeaderProps = Omit<React.ComponentProps<"div">, "title"> & {
  /** sm 64 (title only) | md (Neutrino: a 28 picture, the title, a line of
   *  words under it) | lg 88 (the Key Icon, title and description). */
  size?: "sm" | "md" | "lg";
  type?: "basic" | "left-icon";
  /** Left Icon's icon: bare 24 on Small, a 28 picture (an app's tile, a logo)
   *  on Medium, in the Key Icon, Large (48), Stroke on Large. */
  icon?: React.ReactNode;
  /** Small: a 24 picture, corner 6, 8 before the title: an app's logo or a
   *  step's kind tile, as its card shows it (Neutrino, 22 Oct 2026, the
   *  Workflow Studio's step drawers). */
  picture?: React.ReactNode;
  title: React.ReactNode;
  /** Medium and Large. */
  description?: React.ReactNode;
  /** The number Badge (Filled, Red, Medium, Number on), 8 after the title. A slot. */
  badge?: React.ReactNode;
  /** A Link Button (Gray, Medium, no underline) just before the close button. A slot. */
  link?: React.ReactNode;
  /** The Content Divider, Line type, along the bottom. */
  line?: boolean;
  /** The close button, on by default. */
  close?: boolean;
  /** Outside a DrawerContent, what the close button does. */
  onClose?: React.MouseEventHandler<HTMLButtonElement>;
  closeLabel?: string;
};

export function DrawerHeader({
  size = "sm",
  type = "basic",
  icon,
  picture,
  title,
  description,
  badge,
  link,
  line = false,
  close = true,
  onClose,
  closeLabel = "Close",
  className,
  ...props
}: DrawerHeaderProps) {
  const lg = size === "lg";
  const md = size === "md";
  return (
    <div
      className={cn(
        // Small and Medium centre everything on one line; Large keeps the icon and the close button at the top.
        "relative flex shrink-0 bg-bg-white-0",
        lg
          ? "min-h-drawer-header-lg items-start gap-drawer-header-lg-gap p-drawer-header-pad"
          : md
            ? "items-center gap-drawer-header-md-gap px-drawer-header-md-x pt-drawer-header-md-top pb-drawer-header-md-bottom"
            : "min-h-drawer-header-sm items-center gap-drawer-header-sm-gap p-drawer-header-pad",
        className,
      )}
      {...props}
    >
      {type === "left-icon" &&
        icon != null &&
        (lg ? (
          <KeyIcon size="lg" variant="stroke">
            {icon}
          </KeyIcon>
        ) : md ? (
          <span
            aria-hidden
            className="flex size-drawer-header-md-picture shrink-0 items-center justify-center overflow-hidden rounded-drawer-header-md-picture text-icon-sub-600 [&>*]:size-full"
          >
            {icon}
          </span>
        ) : (
          <span aria-hidden className="inline-flex shrink-0 text-icon-sub-600 [&_svg]:size-drawer-header-sm-icon">
            {icon}
          </span>
        ))}
      {/* The words fill the space between the icon and the close button. */}
      <div className={cn("flex min-w-0 flex-1 flex-col", md ? "gap-drawer-header-md-words-gap" : "gap-drawer-header-words-gap")}>
        <div className="flex items-center gap-drawer-header-badge-gap">
          {!lg && !md && picture != null ? (
            <div className="flex min-w-0 items-center gap-drawer-header-sm-picture-gap">
              <span
                aria-hidden
                className="flex size-drawer-header-sm-picture shrink-0 items-center justify-center overflow-hidden rounded-drawer-header-sm-picture [&>*]:size-full"
              >
                {picture}
              </span>
              <Title className="min-w-0 text-label-lg text-text-strong-950">{title}</Title>
            </div>
          ) : (
            <Title className={cn("min-w-0 text-text-strong-950", md ? "truncate text-label-md" : "text-label-lg")}>{title}</Title>
          )}
          {badge != null && <span className="inline-flex shrink-0">{badge}</span>}
        </div>
        {(lg || md) && description != null && (
          <Description className={cn("text-text-sub-600", md ? "truncate text-paragraph-xs" : "text-paragraph-sm")}>{description}</Description>
        )}
      </div>
      {(link != null || close) && (
        <div className={cn("flex shrink-0 items-center", lg ? "gap-drawer-header-lg-gap" : md ? "gap-drawer-header-md-gap" : "gap-drawer-header-sm-gap")}>
          {link}
          {close && (
            <Closes>
              <CompactButton variant="ghost" size="lg" aria-label={closeLabel} onClick={onClose}>
                <CloseIcon />
              </CompactButton>
            </Closes>
          )}
        </div>
      )}
      {line && <ContentDivider type="line" className="absolute inset-x-0 bottom-0" />}
    </div>
  );
}

// ---- Body ----

export type DrawerBodyProps = ScrollAreaProps;

/** Fills the space between the header and footer and scrolls there, with the
 *  Scroll (page, Open); the header and footer stay put. */
export function DrawerBody({ className, ...props }: DrawerBodyProps) {
  return <ScrollArea className={cn("flex-1", className)} {...props} />;
}

export type DrawerSectionProps = React.ComponentProps<"div"> & {
  /** The word of a Content Divider, Solid Text band above the section. */
  band?: React.ReactNode;
};

/** Not a Figma component: padding 20 on every side, items 16 apart. */
export function DrawerSection({ band, className, ...props }: DrawerSectionProps) {
  return (
    <>
      {band != null && <ContentDivider type="solid-text">{band}</ContentDivider>}
      <div
        className={cn(
          "flex flex-col gap-drawer-section-gap p-drawer-section-pad",
          band != null && "pt-drawer-section-band-top",
          className,
        )}
        {...props}
      />
    </>
  );
}

// ---- Footer ----

export type DrawerFooterType = "stretch" | "basic" | "checkbox" | "toggle" | "stepper" | "link-button";

export type DrawerFooterProps = React.ComponentProps<"div"> & {
  type?: DrawerFooterType;
  /** The left part: a Checkbox Label, a Switch Label, the Stepper Dot or a Link Button. A slot. */
  leading?: React.ReactNode;
  /** The Neutral Stroke button's words; null leaves it out. Inside a drawer it closes it. */
  cancel?: React.ReactNode;
  /** The Primary Filled button's words; null leaves it out. */
  confirm?: React.ReactNode;
  onCancel?: React.MouseEventHandler<HTMLButtonElement>;
  onConfirm?: React.MouseEventHandler<HTMLButtonElement>;
};

/** Roomier than the Modal's: padding 20, gaps 16, Medium (40) buttons. */
export function DrawerFooter({
  type = "stretch",
  leading,
  cancel = "Cancel",
  confirm = "Continue",
  onCancel,
  onConfirm,
  className,
  ...props
}: DrawerFooterProps) {
  const stretch = type === "stretch";
  // Stretch: the buttons share the full width equally.
  const share = stretch ? "flex-1" : undefined;
  return (
    <div
      className={cn(
        "ds-shadow [--ds-edge:var(--shadow-drawer-footer-line)] flex min-h-drawer-footer shrink-0 items-center gap-drawer-footer-gap bg-bg-white-0 p-drawer-footer-pad",
        className,
      )}
      {...props}
    >
      {!stretch && type !== "basic" && leading != null && <div className="flex min-w-0 flex-1 items-center">{leading}</div>}
      <div className={cn("flex items-center gap-drawer-footer-gap", stretch ? "flex-1" : "ms-auto shrink-0")}>
        {cancel != null && (
          <Closes>
            <Button tone="neutral" variant="stroke" onClick={onCancel} className={share}>
              {cancel}
            </Button>
          </Closes>
        )}
        {confirm != null && (
          <Button onClick={onConfirm} className={share}>
            {confirm}
          </Button>
        )}
      </div>
    </div>
  );
}
