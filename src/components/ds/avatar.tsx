"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";
import { AddIcon, CloseIcon, StarIcon } from "@/components/ui/icons";

/**
 * The design system's Avatar, its corner marks, Avatar Group and Compact
 * Avatar Group, built from design-system/components/avatar.md (Nitesh's
 * Figma "Avatar [1.1]" node 245:18786, "Top Status [1.1]" 245:18697,
 * "Bottom Status [1.1]" 245:18721, "Avatar Group [1.1]" 581:6198, "Compact
 * Avatar Group [1.1]" 2906:14962). Every picture of a person is this Avatar.
 *
 * Avatar
 *   size        80 | 72 | 64 | 56 | 48 | 40 | 32 | 24 | 20 (a full circle)
 *   src, alt    the photo (Radix Avatar: the initials show until it loads,
 *               or if it fails). A cut-out photo shows the colour behind it.
 *   name        gives the initials, and the colour when color is left out
 *               (one person always gets the same colour)
 *   color       gray | blue | red (Yellow, Sky and Purple wait for their hues)
 *   No photo and no name: the placeholder person.
 *   topMark     favorite | add | remove | notification
 *   bottomMark  online | offline | busy, or company={<img .../>} for a logo
 *               (Verified, Pin and Away wait for their hues)
 *
 * AvatarGroup (size, more) and CompactAvatarGroup (size 40 | 32 | 24,
 * variant default | stroke, more) take Avatars as children.
 *
 * Sizes and rings are the tokens in styles/sizes/avatar.css.
 */

export type AvatarSize = "80" | "72" | "64" | "56" | "48" | "40" | "32" | "24" | "20";
export type AvatarColor = "gray" | "blue" | "red" | "brand";

/** The circle, and the initials' type at each size. */
const SIZE: Record<AvatarSize, string> = {
  "80": "size-avatar-80 font-display text-title-h5",
  "72": "size-avatar-72 font-display text-title-h5",
  "64": "size-avatar-64 font-display text-title-h5",
  "56": "size-avatar-56 text-label-lg",
  "48": "size-avatar-48 text-label-lg",
  "40": "size-avatar-40 text-label-md",
  "32": "size-avatar-32 text-label-sm",
  "24": "size-avatar-24 text-label-xs",
  // Ours: 11, so two letters clear the 20 circle (24 Oct 2026; the Figma uses 12).
  "20": "size-avatar-20 text-subheading-2xs",
};

const MARK_SIZE: Record<AvatarSize, string> = {
  "80": "size-avatar-80-mark",
  "72": "size-avatar-72-mark",
  "64": "size-avatar-64-mark",
  "56": "size-avatar-56-mark",
  "48": "size-avatar-48-mark",
  "40": "size-avatar-40-mark",
  "32": "size-avatar-32-mark",
  "24": "size-avatar-24-mark",
  "20": "size-avatar-20-mark",
};

/** The circle in the colour's light, the initials in its dark (the state
 *  tokens, so on dark the circle softens and the initials lighten). */
const COLOUR: Record<AvatarColor, string> = {
  gray: "bg-state-faded-light text-state-faded-dark",
  blue: "bg-state-information-light text-state-information-dark",
  red: "bg-state-error-light text-state-error-dark",
  // Neutrino only (23 Oct 2026): the brand's cobalt, for the workspace's
  // initials. The Figma's Blue is the Information status blue.
  brand: "bg-primary-alpha-16 text-primary-base",
};
const COLOURS: AvatarColor[] = ["gray", "blue", "red"];

/** The same name always lands on the same colour. */
function colourFor(name: string): AvatarColor {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return COLOURS[hash % COLOURS.length];
}

function initialsOf(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const first = words[0]?.[0] ?? "";
  const last = words.length > 1 ? words[words.length - 1][0] : "";
  return (first + last).toUpperCase();
}

/** The placeholder person: a white head, and a white body at 72%, scaled to
 *  the avatar (the shapes of the Figma's empty avatar, public/avatar-default.svg). */
function Placeholder() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-full text-static-white">
      <ellipse cx="12" cy="23.4" rx="9.6" ry="7.2" fill="currentColor" fillOpacity={0.72} />
      <circle cx="12" cy="9.6" r="4.8" fill="currentColor" />
    </svg>
  );
}

// ---- Corner marks ----

export type AvatarTopMarkType = "favorite" | "add" | "remove" | "notification";
export type AvatarBottomMarkType = "online" | "offline" | "busy";

const TOP_MARK: Record<AvatarTopMarkType, { fill: string; Icon?: React.ComponentType; label: string }> = {
  favorite: { fill: "bg-state-success-base", Icon: StarIcon, label: "Favorite" },
  add: { fill: "bg-state-faded-base", Icon: AddIcon, label: "Add" },
  remove: { fill: "bg-state-error-base", Icon: CloseIcon, label: "Remove" },
  notification: { fill: "bg-state-error-base", label: "New notification" },
};

const BOTTOM_MARK: Record<AvatarBottomMarkType, { fill: string; label: string }> = {
  online: { fill: "bg-state-success-base", label: "Online" },
  offline: { fill: "bg-state-faded-base", label: "Offline" },
  busy: { fill: "bg-state-error-base", label: "Busy" },
};

/** Every mark: a circle with a ring in bg/white-0, so it reads as cut out. */
const markBase =
  "ds-shadow inline-flex shrink-0 items-center justify-center rounded-avatar-mark [--ds-lift:var(--shadow-avatar-mark)] [&>*]:size-avatar-mark-icon";

type MarkProps = Omit<React.ComponentProps<"span">, "children"> & {
  /** The size of the avatar it sits on (the mark's own size follows). */
  size?: AvatarSize;
};

/** The Figma's Top Status: a coloured circle with a white icon, or a dot. */
export function AvatarTopMark({ type, size = "40", className, ...props }: MarkProps & { type: AvatarTopMarkType }) {
  const m = TOP_MARK[type];
  return (
    <span role="img" aria-label={m.label} className={cn(markBase, MARK_SIZE[size], m.fill, "text-icon-white-0", className)} {...props}>
      {m.Icon && <m.Icon />}
    </span>
  );
}

/** The Figma's Bottom Status: a status dot, or a company's logo on bg/white-0. */
export function AvatarBottomMark({
  type,
  company,
  size = "40",
  className,
  ...props
}: MarkProps & { type?: AvatarBottomMarkType; company?: React.ReactNode }) {
  if (company != null) {
    return (
      <span className={cn(markBase, MARK_SIZE[size], "bg-bg-white-0", className)} {...props}>
        {company}
      </span>
    );
  }
  const m = BOTTOM_MARK[type ?? "online"];
  return <span role="img" aria-label={m.label} className={cn(markBase, MARK_SIZE[size], m.fill, className)} {...props} />;
}

// ---- Avatar ----

/** An Avatar Group or Compact Avatar Group hands its size to its avatars. */
const GroupSize = React.createContext<AvatarSize | undefined>(undefined);

export type AvatarProps = Omit<React.ComponentProps<"span">, "color" | "children"> & {
  size?: AvatarSize;
  src?: string;
  alt?: string;
  name?: string;
  color?: AvatarColor;
  topMark?: AvatarTopMarkType;
  bottomMark?: AvatarBottomMarkType;
  /** A company's logo in the bottom corner, in place of a status dot. */
  company?: React.ReactNode;
};

export function Avatar({ size, src, alt, name, color, topMark, bottomMark, company, className, ...props }: AvatarProps) {
  const groupSize = React.useContext(GroupSize);
  const s = size ?? groupSize ?? "40";
  const colour = color ?? (name ? colourFor(name) : "gray");
  const initials = name ? initialsOf(name) : "";
  const label = alt ?? name;

  return (
    <span className={cn("relative inline-flex shrink-0", SIZE[s], className)} {...props}>
      {/* The circle is the picture for screen readers; the marks beside it keep their own words. */}
      <AvatarPrimitive.Root
        role={label ? "img" : undefined}
        aria-label={label}
        className={cn("flex size-full select-none items-center justify-center overflow-hidden rounded-avatar", COLOUR[colour])}
      >
        {src && <AvatarPrimitive.Image src={src} alt="" className="size-full object-cover" />}
        <AvatarPrimitive.Fallback className="flex size-full items-center justify-center">
          {initials || <Placeholder />}
        </AvatarPrimitive.Fallback>
      </AvatarPrimitive.Root>
      {topMark && (
        <span className="absolute top-avatar-mark-inset right-avatar-mark-inset flex">
          <AvatarTopMark type={topMark} size={s} />
        </span>
      )}
      {(bottomMark || company != null) && (
        <span className="absolute right-avatar-mark-inset bottom-avatar-mark-inset flex">
          <AvatarBottomMark type={bottomMark} company={company} size={s} />
        </span>
      )}
    </span>
  );
}

// ---- Avatar Group ----

const OVERLAP: Record<AvatarSize, string> = {
  "80": "-ms-avatar-group-80",
  "72": "-ms-avatar-group-72",
  "64": "-ms-avatar-group-64",
  "56": "-ms-avatar-group-56",
  "48": "-ms-avatar-group-48",
  "40": "-ms-avatar-group-40",
  "32": "-ms-avatar-group-32",
  "24": "-ms-avatar-group-24",
  "20": "-ms-avatar-group-20",
};

export type AvatarGroupProps = React.ComponentProps<"div"> & {
  size?: AvatarSize;
  /** How many more people: the last circle, "+9". */
  more?: number;
};

/** Avatars of one size in a row, each overlapping the one before, each with
 *  a 2px ring in stroke/white-0 outside it. */
export function AvatarGroup({ size = "40", more, children, className, ...props }: AvatarGroupProps) {
  const items = React.Children.toArray(children);
  const ring = "ds-shadow inline-flex shrink-0 rounded-avatar [--ds-lift:var(--shadow-avatar-group)]";
  return (
    <GroupSize.Provider value={size}>
      <div className={cn("flex items-center", className)} {...props}>
        {items.map((child, i) => (
          <span key={i} className={cn(ring, i > 0 && OVERLAP[size])}>
            {child}
          </span>
        ))}
        {more != null && more > 0 && (
          <span
            aria-label={`${more} more`}
            className={cn(ring, items.length > 0 && OVERLAP[size], SIZE[size], "items-center justify-center bg-bg-weak-50 text-text-sub-600")}
          >
            +{more}
          </span>
        )}
      </div>
    </GroupSize.Provider>
  );
}

// ---- Compact Avatar Group ----

export type CompactAvatarGroupProps = React.ComponentProps<"div"> & {
  size?: "40" | "32" | "24";
  /** default: bg/white-0. stroke: also a 1px stroke/soft-200 edge outside. */
  variant?: "default" | "stroke";
  /** How many more people: "+4" after the avatars. */
  more?: number;
};

/** A pill holding up to three avatars overlapping by 2, then the count. */
export function CompactAvatarGroup({ size = "32", variant = "default", more, children, className, ...props }: CompactAvatarGroupProps) {
  const items = React.Children.toArray(children).slice(0, 3);
  return (
    <GroupSize.Provider value={size}>
      <div
        className={cn(
          "inline-flex items-center rounded-avatar-compact bg-bg-white-0 py-avatar-compact-y pl-avatar-compact-left pr-avatar-compact-right",
          variant === "stroke" && "ds-shadow [--ds-lift:var(--shadow-avatar-compact-stroke)]",
          className,
        )}
        {...props}
      >
        <span className="flex items-center">
          {items.map((child, i) => (
            <span key={i} className={cn("inline-flex shrink-0", i > 0 && "-ms-avatar-compact-overlap")}>
              {child}
            </span>
          ))}
        </span>
        {more != null && more > 0 && (
          <span aria-label={`${more} more`} className="ms-avatar-compact-count-gap text-paragraph-sm text-text-sub-600">
            +{more}
          </span>
        )}
      </div>
    </GroupSize.Provider>
  );
}
