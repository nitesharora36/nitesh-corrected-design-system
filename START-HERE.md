# Start here

The whole design system in one folder: every component, token, style and font, plus a gallery app to see them. Copied from Neutrino on 2 Nov 2026, to reuse in another product with its own colours and brand.

## See it

You need Node 20 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3100 (every component) and http://localhost:3100/foundations (colours, type, spacing, corners, shadows, icons).

## Where the code is

| What | Where |
|---|---|
| Components (48) | `src/components/ds/` |
| Icons | `src/components/ui/icons.tsx` (Hugeicons) |
| Colours, light and dark | `src/styles/theme-tokens.css` |
| Type styles | `src/styles/typography-tokens.css` |
| Spacing and corners | `src/styles/size-tokens.css` |
| Each component's sizes | `src/styles/sizes/<component>.css` |
| States, edges, focus rings | `src/styles/ds.css` |
| Fonts | `src/app/fonts/` (Inter, DM Mono: both free to use) |
| Tokens as JSON, for other tools | `tokens/` |
| Each component's spec and pictures | `3-base-components/`, `4-product-components/` |

To use them in another app: copy `src/components/ds`, `src/components/ui/icons.tsx`, `src/components/input-modality.tsx`, `src/lib` and `src/styles`, then import the styles as `src/app/globals.css` does. The packages they need are in `package.json`.

## Change the brand

Every component reads its colours, sizes and type from tokens, so one change in a token file changes every component.

1. **Colours.** In `src/styles/theme-tokens.css`, the top block holds the palette: `--palette-gray-*`, `--palette-blue-*` and the rest, each a hex value. Change the hex values; every token points at them. The brand colour is the blue scale (`--primary-base` uses `--palette-blue-500` on light and `-400` on dark). Ignore the note there saying "do not edit by hand": that was for Neutrino's own generator, which is not in this copy. Edit here.
2. **Light and dark.** The light tokens sit under `:root`, the dark ones under the dark theme block in the same file. Change both.
3. **Font.** Put the new font file in `src/app/fonts/`, load it in `src/app/layout.tsx`, and point `--font-sans` and `--font-display` at it in `src/styles/typography-tokens.css`. Sizes and line heights are in the same file.
4. **Corners and spacing.** `--corner-*` and `--space-*` in `src/styles/size-tokens.css`. Rounder or squarer everywhere from one place. Merlin is square: every `--corner-*` step is 0, and only the parts that are round by nature use `--corner-full`.
5. **Shadows.** The `--shadow-*` lines in `src/styles/theme-tokens.css` and the component size files.
6. **Logo and pictures.** `2-assets/` and `public/`.

After a change, `npm run dev` shows it on every component at once. `npm run typecheck` checks the code.

## Good to know

* The pages in `3-base-components/` describe Neutrino's colours by name (for example "primary blue"). They stay right once you change the values: the token names do not change.
* Light and dark come from `next-themes`: `data-theme="paper"` is light, `data-theme="ink"` is dark.
* `bg-primary` is an old near-black. The brand colour is `bg-primary-base`.
