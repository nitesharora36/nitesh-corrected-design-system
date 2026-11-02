<!-- Copied from the design copy (neutrino-frontend-v3) by scripts/sync.mjs. Edit it there, then run `npm run sync`. -->

# Tokens

Every design decision as a named value. The code reads the CSS; these JSON files carry the same values for other tools (Figma's Tokens Studio, Style Dictionary, a native app).

| File | What | In code |
|---|---|---|
| [colors.json](colors.json) | The palette, then every colour token for light and for dark, named as in the Figma (`bg/white-0`, `text/sub-600`, `state/error/base` ...) | `src/styles/theme-tokens.css` (`--bg-white-0`, Tailwind `bg-bg-white-0`) |
| [typography.json](typography.json) | The Figma's 34 text styles | `src/styles/typography-tokens.css` (`text-label-sm`, `font-display text-title-h4` ...) |
| [spacing.json](spacing.json) | The spacing scale (05-Spacing) | `src/styles/size-tokens.css` (`--space-12`, `gap-space-12`) |
| [radius.json](radius.json) | The corner scale (04-Radius) | `src/styles/size-tokens.css` (`--corner-10`, `rounded-corner-10`) |
| [shadows.json](shadows.json) | Shadows many components share, light and dark | `src/styles/theme-tokens.css` (`shadow-card` ...) |
| [motion.json](motion.json) | Speeds | `src/styles/theme.css` (`--motion-base`) |

## How the colours are layered

1. **Palette**: the scales (Gray, Blue, the status families). The only place a hex is written.
2. **Tokens**: what each job uses, with a light and a dark value, named exactly as the variables in the Figma.
3. **Components and screens**: use tokens only. Never a palette step, never a hex.

Change a palette step and every token on it follows; point a token at another step and every component using it follows, in both themes. The full table, with what each token is for: [1-core-elements/1-color-palette](../1-core-elements/1-color-palette).

## Each component's sizes

A component's heights, paddings, gaps and corners are tokens too, one file per component in [`src/styles/sizes/`](../src/styles/sizes), each pointing at a step of the scales above.
