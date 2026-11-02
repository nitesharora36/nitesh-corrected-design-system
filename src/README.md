# The code

| Folder | What | Where it comes from |
|---|---|---|
| `components/ds/` | The design system's components, one file each | Copied from the design copy (same path there) |
| `components/ui/icons.tsx` | Every icon, one name per use (Hugeicons, Stroke Rounded) | Copied |
| `lib/utils.ts` | `cn()`, which merges class names and knows the type sizes | Copied (only the part the components use) |
| `lib/neutrino-light.ts` | The colour maths behind the charts' cells | Copied |
| `styles/` | The tokens: colours (`theme-tokens.css`), type (`typography-tokens.css`), spacing and corners (`size-tokens.css`), states and focus rings (`ds.css`) | Copied |
| `styles/sizes/` | Each component's own sizes, pointing at the scales | Copied |
| `gallery/` | The Components page: one section per component, every size and state | Copied from the design copy's playground |
| `app/` | The gallery app (Next.js): the layout, the two pages, the fonts | This repo's own (the fonts are copied) |
| `site/` | The top bar and the Foundations page; `docs-map.json` and `foundations-data.ts` are written by the sync | This repo's own |

"Copied" files are overwritten by `npm run sync`: change them in the design copy.
