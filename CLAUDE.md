# Merlin Nitesh's New Design System

Nitesh's design system in Merlin's colours: every component, token and rule, the same as his Figma library, in code you can run. It is the one source of UI for every product Nitesh works on. Read this file before any UI work, in this repo or any other.

**Set-up on a new computer.** When a session is opened in this repo itself and `~/.claude/CLAUDE.md` has no `<!-- merlin-design-system: start -->` section, offer Nitesh in one line to run `./scripts/install-claude.sh`, so every Claude session on that computer follows this design system. Run it only on his yes.

## The rules

1. **Never make a component of your own.** Every button, field, menu, card, table and panel comes from `src/components/ds/` (the table below). If nothing there fits the job, stop and ask Nitesh. No new component, variant, size or colour gets invented.
2. **Spacing, sizing and padding come from the components.** Each component's heights, paddings, gaps, corners and icon sizes are tokens in `src/styles/sizes/<file>.css` (the button's are in `src/styles/size-tokens.css`). Take them from there; never guess a number.
3. **Never type a value by hand.** Colours only through colour tokens, sizes only through size tokens, words only through type styles. No hex, no rgb(), no Tailwind palette class (`bg-blue-500`), no `text-[13px]`, no `p-[7px]`.
4. **Merlin is square.** Every corner is 0: buttons (the Full Radius variants too), fields, badges, tags, cards, menus, modals, drawers, tables, tracks, bars and scroll thumbs. Round stays round only where the shape is the part: radio, switch, avatars and the picture slots that hold them (people, companies, flags), dots, slider and colour-picker knobs, donut and gauge charts. Never add a rounded corner.
5. **Charts are plain.** Solid bars, lines, rings and squares in the chart's colours, square corners, light value lines, square keys. No Neutrino cells (the dotted effect), no patterns, nothing moving on its own. Use `chart.tsx`; never draw a chart of your own.
6. **The look is exact.** Whatever you build looks exactly like this design system's component: its sizes, padding, gaps, square corners, edges, shadows, type, colours and every state. Behaviour may come from elsewhere (a project's own component, Radix, a library); the look may not.
7. **Light and dark.** Everything works in both: `data-theme="paper"` is light, `data-theme="ink"` is dark (next-themes, on `<html>`).
8. **Type.** Inter for words, DM Mono (`font-data`) for machine data in capitals. Weights 400 and 500 only, never 600 or 700.
9. **Icons.** Hugeicons, Stroke Rounded, only through `src/components/ui/icons.tsx`.
10. **No em dashes or en dashes** in any words a person reads.

## Before you build anything

1. Find the component in the table below.
2. Read its file, `src/components/ds/<file>.tsx`: the comment at the top lists its props, sizes and states.
3. Read its sizes, `src/styles/sizes/<file>.css`.
4. Read its page in `3-base-components/<component>/` (charts and the KPI card: `4-product-components/`): the spec, every state, pictures in light and dark.
5. See it working: `npm install`, `npm run dev`, then http://localhost:3100 (every component in every size and state) and http://localhost:3100/foundations.

## Components

Each file in `src/components/ds/` and what it exports.

| For | File | Exports |
|---|---|---|
| Actions | `button.tsx` | `Button`: `tone` primary, neutral, error; `variant` filled, stroke, lighter, ghost; `size` md 40, sm 36, xs 32, 2xs 28. No children makes it icon only (give it an `aria-label`). |
| | `link-button.tsx`, `compact-button.tsx`, `social-button.tsx`, `fancy-button.tsx` | `LinkButton`, `CompactButton`, `SocialButton`, `FancyButton` |
| | `button-group.tsx` | `ButtonGroup`, `ButtonGroupItem` |
| Fields | `text-input.tsx` | `TextInput` (md 40, sm 36, xs 32), `TextInputPicker`, `TextInputInlinePicker` |
| | `text-area.tsx` | `TextArea` |
| | `label.tsx` | `FieldLabel`, `HintText` |
| | `select.tsx` | `Select`, `SelectItem`, `SelectGroup`, `SelectHeading`, `SelectSeparator`, `CompactSelect`, `SelectInputPicker`, `InlineSelect` |
| | `checkbox.tsx` | `Checkbox`, `CheckboxLabel`, `CheckboxCard`, `ChoiceLabel`, `ChoiceCard` |
| | `radio.tsx` | `RadioGroup`, `Radio`, `RadioLabel`, `RadioCard` |
| | `switch.tsx` | `Switch`, `SwitchLabel`, `SwitchCard`, `IntegrationSwitch` |
| | `slider.tsx`, `rating.tsx`, `color-picker.tsx` | `Slider`; `RatingItem`, `RatingBar` and their parts; `ColorPicker` and its parts |
| | `date-picker.tsx` | `DatePicker`, `RangePicker`, `DatePickerPopover` |
| | `time-picker.tsx` | `TimePicker`, `TimePickerPopover`, `TimeList` |
| | `file-upload.tsx` | `FileUploadArea`, `FileUploadCard`, `FileUploadList`, `ImageUpload` |
| | `rich-editor.tsx` | `RichEditorBox`, `RichEditorToolbar` and their parts |
| Navigation | `tab-menu.tsx` | `TabMenu`, `TabMenuList`, `TabMenuTrigger`, `TabMenuContent` |
| | `segmented-control.tsx` | `SegmentedControl`, `SegmentedControlItem` |
| | `breadcrumbs.tsx` | `Breadcrumbs`, `BreadcrumbItem` |
| | `pagination.tsx` | `Pagination` |
| | `step-indicator.tsx` | `StepIndicator`, `StepMark`, `StepperDot` |
| | `command-menu.tsx` | `CommandMenu` and its parts (search, filters, list, group, item, footer) |
| Menus and overlays | `dropdown.tsx` | `Dropdown`, `DropdownTrigger`, `DropdownContent`, `DropdownItem`, `DropdownCheckboxItem`, `DropdownSub` and the rest of its parts |
| | `popover.tsx` | `Popover`, `PopoverPanel`, `PopoverFooter` |
| | `tooltip.tsx` | `Tooltip`, `TooltipPanel` |
| | `modal.tsx` | `Modal`, `ModalTrigger`, `ModalContent`, `ModalHeader`, `ModalBody`, `ModalFooter`, `StatusModalContent` |
| | `drawer.tsx` | `Drawer`, `DrawerTrigger`, `DrawerContent`, `DrawerHeader`, `DrawerBody`, `DrawerSection`, `DrawerFooter` |
| | `filter.tsx` | `FilterPanel`, `HorizontalFilter` and their parts |
| Feedback | `alert.tsx` | `Alert`, `AlertLink`, `showToast`, `AlertToaster` |
| | `banner.tsx` | `Banner`, `BannerLink` |
| | `progress-bar.tsx` | `ProgressBar`, `CircularProgressBar`, `ProgressBarLabel` |
| | `notification-feed.tsx`, `activity-feed.tsx` | `NotificationFeed`, `ActivityFeed` and their parts |
| Display | `badge.tsx` | `Badge`, `StatusBadge` |
| | `tag.tsx` | `Tag` |
| | `avatar.tsx` | `Avatar`, `AvatarGroup`, `CompactAvatarGroup` |
| | `content-divider.tsx` | `ContentDivider` |
| | `key-components.tsx` | `KeyIcon`, `ContentLabel`, `ContentCard`, `PasswordStrength`, `LegendDot` |
| | `accordion.tsx` | `Accordion`, `AccordionItem` |
| | `scroll.tsx` | `ScrollArea` |
| Data | `table.tsx` | `Table`, `TableHeader`, `TableHeaderCell`, `TableBody`, `TableRow`, `TableCell`, `TableTextCell`, `TableNumberCell`, `TableFooter`, `TableBulkBar`, `useTablePicks` |
| | `chart.tsx` | `ChartCard`, `BarChart`, `LineChart`, `DonutChart`, `Gauge`, `Heatmap`, `BreakdownBar`, `ChartLegend`, `Swatch`: all plain (rule 5) |
| | `kpi-card.tsx` | `KpiCard` |
| | `neutrino-cells.tsx` | The charts' colours from the light's ramp (`useCellTheme`, `rampAt`, `penAt`). Its dotted cells (`CellCanvas`) are not used by any chart: never draw a chart with them |

## Foundations

**Colours.** The Tailwind class is the token's name after its kind: `bg-bg-white-0`, `text-text-sub-600`, `border-stroke-soft-200`, `text-icon-sub-600`.

* Surfaces: `bg-white-0`, `bg-weak-25`, `bg-weak-50`, `bg-soft-200`, `bg-sub-300`, `bg-surface-800`, `bg-strong-950`
* Words: `text-strong-950`, `text-sub-600`, `text-soft-400`, `text-disabled-300`, `text-white-0`
* Edges: `stroke-soft-200`, `stroke-sub-300`, `stroke-strong-950`, `stroke-white-0`
* Icons: `icon-strong-950`, `icon-sub-600`, `icon-soft-400`, `icon-disabled-300`, `icon-white-0`
* Brand: `primary-base` (Merlin purple: `#6e3785` on light, `#8b4dab` on dark), `primary-dark`, `primary-darkest`, `primary-light`, `primary-lighter`, `primary-alpha-10`, `primary-alpha-16`, `primary-alpha-24`. `bg-primary` is an old near-black: the brand is `bg-primary-base`.
* Status: `state-<name>-base`, `-dark`, `-light`, `-lighter`, for success, warning, error, information, away, feature, verified, highlighted, stable and faded
* Fixed: `static-white`, `static-black`. Overlays: `overlay-gray`, `overlay-scrim`

**Type.** One class sets the size, line height, weight and letter spacing. Sizes in px.

| Class | Size / line height | Weight |
|---|---|---|
| `font-display text-title-h1` to `text-title-h6` | 56/64, 48/56, 40/48, 32/40, 24/32, 20/28 | 500 |
| `text-label-xl`, `-lg`, `-md`, `-sm`, `-xs` | 24/32, 18/24, 16/24, 14/20, 12/16 | 500 |
| `text-paragraph-xl`, `-lg`, `-md`, `-sm`, `-xs` | 24/32, 18/24, 16/24, 14/20, 12/16 | 400 |
| `text-subheading-md`, `-sm`, `-xs`, `-2xs`, with `uppercase` | 16/24, 14/20, 12/16, 11/12 | 500 |
| `font-data text-data-md`, `-sm`, `-xs`, `-2xs`, with `uppercase` | 16/24, 14/20, 12/16, 10/16 | 500 |

**Spacing** (`--space-*`, px): 0, 1, 2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 32, 40, 48. In a layout: `gap-space-16`, `p-space-12`, `px-space-32`. Inside a component, use that component's own token (`px-button-md-x`), so one component can change later on its own.

**Corners** (`--corner-*`): square. Every step (0 to 28) is 0 in Merlin, so `rounded-corner-8` draws a square corner; the Figma's steps are kept as names only. `rounded-corner-full` is only for the parts that are round by nature (rule 4).

**Edges, shadows, focus and states** (`src/styles/ds.css`): put `ds-shadow` on the element, then `edge-<colour>` for a 1px inside edge (`edge-stroke-soft-200`), `lift-card` for the card shadow, and `ring-focus-primary`, `ring-focus-neutral` or `ring-focus-error` for the focus ring. States: `ds-hover:`, `ds-focus:`, `ds-active:`, `disabled:`.

**Sizes to know by heart** (px):

| | Height | Side padding | Gap | Corner |
|---|---|---|---|---|
| Button md, sm, xs, 2xs | 40, 36, 32, 28 | 10, 8, 6, 6 | 4, 4, 2, 2 | 0 (square) |
| Text input md, sm, xs | 40, 36, 32 | 12 left 10 right, 10 and 8, 8 and 6 | 8, 8, 6 | 0 (square) |

Every other size is in the component's sizes file.

## Using it in an app

**Same stack** (React 19, Next 15, Tailwind 4): copy `src/components/ds`, `src/components/ui/icons.tsx`, `src/components/input-modality.tsx`, `src/lib` and `src/styles`; import the styles in the order `src/app/globals.css` does; add the packages from `package.json`. Then `import { Button } from "@/components/ds/button";`.

**Another stack** (for example ether-web-v1: React 18, Tailwind 3, a 14px root, its own `@/shared/components/ui`): behaviour can stay that project's (its components, its Radix, its imports, as its own CLAUDE.md says); the look must be exactly this design system's. Restyle what you use until it matches the design system's component: height, padding and gap from its sizes file; square corners; size, line height, weight and letter spacing from its type style; its colour tokens, edges and shadows; every state. Write sizes in px there: the rem values here assume a 16px root (2.5rem is 40px), and a 14px root shrinks them.

## Where things are

| What | Where |
|---|---|
| Components (48 files) | `src/components/ds/` |
| Each component's sizes | `src/styles/sizes/<file>.css` (the button's: `src/styles/size-tokens.css`) |
| Colours, light and dark | `src/styles/theme-tokens.css` (the palette block at the top; the brand is `--palette-blue-*`, now Merlin purple) |
| Type styles | `src/styles/typography-tokens.css` |
| Spacing and corner scales | `src/styles/size-tokens.css` |
| Edges, shadows, focus rings, states | `src/styles/ds.css` |
| Icons | `src/components/ui/icons.tsx` |
| Fonts | `src/app/fonts/` (Inter, DM Mono) |
| Specs and pictures | `1-core-elements/`, `3-base-components/`, `4-product-components/` |
| Tokens as JSON | `tokens/` |
| Every design decision, dated | `DECISIONS.md` |
| How the components were built | `3-base-components/how-they-are-built.md` (its paths are the design copy's: `components/ds/` there is `src/components/ds/` here) |

Older pages and code comments say "Neutrino": the first product this design system was made for. Same system, same tokens.

## Changing it

* A token change reaches every component at once. After any change, run `npm run typecheck` and look at the gallery in light and dark.
* Anything missing or wrong goes to Nitesh first: it gets its page before its code, and every decision goes into `DECISIONS.md` with its date.
* Another product's colours: make a branch (`git switch -c <product>`), change the hex values in the palette block of `src/styles/theme-tokens.css` (light and dark), and push the branch.
