<!-- Copied from the design copy (neutrino-frontend-v3) by scripts/sync.mjs. Edit it there, then run `npm run sync`. -->

> Written for the agents that built the components in the design copy (paths below are the design copy's: `components/ds/` is `src/components/ds/` here). The rules hold for anyone building or changing a component.

# Brief: build Neutrino design-system components in code

How every coded component in `components/ds/` is built. Written 19 Oct 2026 for the helper agents that built them in parallel; any Claude building or fixing a component follows it. A helper does not commit (the lead session does); a single session working alone commits on `design/nitesh` after the checks, never pushes.

Nitesh (product designer) wants the real, coded components, built ONLY from the written spec pages, so he can click them and mark changes. You build some of them. Accuracy to the spec page is the whole job: every height, padding, gap, corner, edge, type style, colour token and state on the page. Nothing invented. Where the page lists a proposal under "Open" or "Where this differs from the Figma", build OUR version (the proposals stand).

## Repo

* `~/Desktop/8 Bit Overall/8Bit Product/neutrino-frontend-v3` (Next.js 15, React 19, Tailwind 4.1, branch `design/nitesh`). Do not switch branches, do not push.
* Node and bun: `export PATH="$HOME/.local/node/bin:$PATH"` first in every shell command.
* The dev server runs on http://localhost:3002 (the preview config `neutrino-dev`; a helper never starts or stops it). Your work shows at http://localhost:3002/playground/components.

## Read first

1. `design-system/README.md` (the rules; "Sizes work the same way").
2. `design-system/colors/colors.md` (token names), `design-system/typography/typography.md` (Figma style to class), `design-system/shadows/shadows.md`.
3. The spec pages of your components in `design-system/components/`, all of them, plus any page they point to.
4. THE PATTERN TO COPY: `components/ds/button.tsx`, `styles/ds.css`, `styles/size-tokens.css`, `app/(playground)/playground/components/sections/button.tsx`, `app/(playground)/playground/components/parts.tsx`. Match their style, naming and comment density.

## How components are written

* **Colours**: only the token classes: `bg-bg-white-0`, `text-text-sub-600`, `text-icon-sub-600` (icons follow `currentColor`, so usually set the text colour), `bg-primary-base`, `text-static-white`, `bg-state-error-lighter`, `bg-overlay-gray`. Any token `a/b-c` is the class colour name `a-b-c`. No hex, no rgb(), no Tailwind palette classes (`scripts/check-colours.sh` must not get worse).
* **Edges, shadows, focus rings** (styles/ds.css): put `ds-shadow` on the element, then `edge-<colour>` for a 1px inside edge (`edge-stroke-soft-200`, `edge-primary-base`), `lift-card` for `--shadow-card`, `ring-focus-neutral` / `ring-focus-primary` / `ring-focus-error` for the focus ring (a 2px gap, then 2px of colour, 4px in all), and `edge-none` / `lift-none` / `ring-none` to clear one. Real CSS borders only where the spec's edge is truly a divider line (for example a table rule).
* **Other shadows** the page writes out (a menu, a modal, a knob): define each as a plain CSS variable in YOUR size file, outside `@theme`: `:root { --shadow-<component>-<part>: <light layers>; }` and `:root:where([data-theme="ink"], [data-theme="dark"]) { --shadow-<component>-<part>: <dark value>; }` following `shadows.md` (on dark a shadow keeps only its 1px ring layer, else `0 0 0 0 transparent`). Apply it through the shadow parts: `ds-shadow` plus an arbitrary property that sets `--ds-lift` to your variable, for example `[--ds-lift:var(--shadow-dropdown-menu)]` (always a real name there: Tailwind reads this file, and a placeholder in brackets breaks the whole stylesheet). Do NOT put shadows in `@theme`: Tailwind bakes the light value into a `shadow-*` utility and the dark theme never reaches it.
* **States**: `ds-hover:`, `ds-focus:`, `ds-active:` (they also apply when the element has `data-force="hover"` / `"focus"` / `"active"`, which the Components page uses). `disabled:` for disabled. `aria-checked`, `data-state` and similar for picked states, as Radix sets them.
* **Sizes**: never type a number in a class. Every height, width, padding, gap, corner and icon size is a token in YOUR file `styles/sizes/<slug>.css` inside `@theme { }`:
  * `--spacing-<component>-<part>` gives `h-`, `w-`, `size-`, `p-`, `px-`, `py-`, `gap-`, `top-` ... (`--spacing-tag-x` is `px-tag-x`).
  * `--radius-<component>-<part>` gives `rounded-<component>-<part>`.
  * Point at the Figma scale where the value is on it: `var(--space-10)`, `var(--corner-8)` (see `styles/size-tokens.css`). Values off the scale (a 36 height, a 13 face) are written in rem with the px in a comment: `2.25rem; /* 36 */`.
  * The scales are also usable directly for layout inside the Components page sections: `gap-space-16`, `p-space-12`, `rounded-corner-8`. Inside a component, use a component token, so Nitesh can change that one component later.
  * Prefix every token with your component's name, so tokens never clash.
* **Type**: the class from `typography.md` exactly (`text-label-sm`, `text-paragraph-xs`, `text-subheading-2xs uppercase`, `font-display text-title-h5`). Never a size, weight or letter spacing by hand.
* **Icons**: Hugeicons only, through `components/ui/icons.tsx` (see the "design system" block there: ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon, CopyIcon, CheckIcon, InfoIcon, UserIcon, MailIcon, LockIcon, CalendarIcon, HomeIcon, GridIcon, StarIcon, PinIcon, DeleteIcon, BellIcon, SunIcon, SearchIcon, CloseIcon, AddIcon, FileIcon, UploadIcon ...). Need another? Add it to that block with the Edit tool (never rewrite the file): import the glyph from `@hugeicons/core-free-icons` (check the name exists with `grep -rl "\bNameIcon\b" node_modules/@hugeicons/core-free-icons/dist | head -1`) and export `export const XIcon = icon(Glyph, "XIcon");`. Others edit that file too: if your Edit fails because the file changed, Read it again and retry.
* **Behaviour**: use the Radix primitive where one exists (`@radix-ui/react-checkbox`, `-radio-group`, `-tooltip`, `-popover`, `-dropdown-menu`, `-select`, `-dialog`, `-tabs`, `-accordion`, `-slider`, `-scroll-area`, `-progress`, `-avatar`), `cmdk` for the command menu, `react-day-picker` and `date-fns` for dates. Style them only with our tokens. Keyboard focus must show the focus ring the page gives.
* **Composition**: a part that is another component is a slot (`badge?: React.ReactNode`, `trailing?: React.ReactNode`), not re-drawn. Import other design-system components from `@/components/ds/<slug>` ONLY if the file exists when you start (`ls components/ds`). If it does not, keep the slot and leave that example out of your section; say so in your report.
* **API**: one file per component family, `components/ds/<slug>.tsx`, named exports, a short doc comment at the top like `button.tsx` (what it is, which page, the main props). Props names in plain words that match the page (`size="md"`, `variant`, `tone`, `checked`, `disabled`). Use `cva` for variants, `cn` from `@/lib/utils` to merge classes. A new `--text-*` type name is not allowed; if `cn` drops a class you need, tell me.
* **Accessibility**: real `<button>`, `<input>`, `<label>`; `aria-label` on icon-only controls; Radix's roles.

## The Components page section

Replace the placeholder `app/(playground)/playground/components/sections/<slug>.tsx` (keep its exported function name, for example `TagSection`). Show every size, type, style and state the page lists, using `Group` and `Labelled` from `../parts`. Show hover and focus with `data-force="hover"` / `data-force="focus"` on the element, disabled with `disabled`. Use short real words (Overview, Members, Save). Keep the real interaction working too (clicking a checkbox checks it).

## Files you may touch

* Write: `components/ds/<your slugs>.tsx`, `styles/sizes/<your slugs>.css`, `app/(playground)/playground/components/sections/<your slugs>.tsx`.
* Edit only by adding: `components/ui/icons.tsx` (the design-system block).
* NOTHING else: not other helpers' files, not `styles/ds.css`, not `styles/size-tokens.css`, not `components/ui/*` (except icons.tsx), not the product's screens, not the spec pages.

## Checks before you finish (all from the repo root, with the PATH export)

1. `bunx tsc --noEmit -p . 2>&1 | grep -E "components/ds/|playground/components/|icons.tsx"` prints nothing for your files.
2. Every class compiles: `cp design-system/build/tw-check.mjs ./.tw-check-<slug>.mjs && node ./.tw-check-<slug>.mjs <your files> ; rm -f ./.tw-check-<slug>.mjs`. Fix every real class it lists (it also lists plain words; ignore those).
3. `bash scripts/check-colours.sh` shows no new problems (32 `text-[Npx]` and 1 deleted token are old).
4. `curl -s -o /dev/null -w "%{http_code}" --max-time 180 http://localhost:3002/playground/components` gives 200.
5. No em dashes or en dashes anywhere in your files (`grep -n "—\|–" <files>`).

Do not open a browser; I check the page visually.

## What to return

For each component: the files, what is built (sizes, types, states), what you left out and why (a missing dependency, something the page does not say), and anything on the page you found ambiguous.
