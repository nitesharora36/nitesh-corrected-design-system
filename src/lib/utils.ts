import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// The type sizes in styles/typography-tokens.css. tailwind-merge reads any
// unknown text-<name> as a colour, so without this list cn("text-label-sm",
// "text-text-secondary") would silently drop the size. Keep it in step with
// the --text-* tokens in that file.
const TYPE_SIZES = [
  "title-h1", "title-h2", "title-h3", "title-h4", "title-h5", "title-h6",
  "landing-h1", "landing-h2", "landing-h3", "landing-h4", "landing-h5", "landing-h6",
  "label-xl", "label-lg", "label-md", "label-sm", "label-compact", "label-xs",
  "paragraph-xl", "paragraph-lg", "paragraph-md", "paragraph-sm", "paragraph-compact", "paragraph-xs",
  "subheading-md", "subheading-sm", "subheading-xs", "subheading-2xs",
  "data-md", "data-sm", "data-xs", "data-2xs",
  "docs-label", "docs-paragraph",
  "chat", "chat-input", "greeting", "badge-plan", "wordmark",
  "nav", "nav-label",
];

const twMerge = extendTailwindMerge({
  extend: { theme: { text: TYPE_SIZES } },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** @deprecated Alias of {@link cn} — same behavior; prefer `cn` in new code. */
export const cx = cn;
