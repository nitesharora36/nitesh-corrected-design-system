<!-- Copied from the design copy (neutrino-frontend-v3) by scripts/sync.mjs. Edit it there, then run `npm run sync`. -->

# Motions & Animations

| | |
|---|---|
| Figma | [Motions & Animations](https://www.figma.com/design/Ao3YVgFYdQIF0znq2ToqVl?node-id=553-14960) page |
| Status | Written 23 Oct 2026 from the Figma; the code's speeds differ (see Open) |
| In code | [`src/styles/theme.css`](../../src/styles/theme.css), [`tokens/motion.json`](../../tokens/motion.json) |

Status: written 23 Oct 2026, read from the Figma's Motions & Animations page. The code's speeds do not all match it yet; waits for Nitesh.

Figma: "Motion & Animation [Overview]" (node 2814:1329) on the Motions & Animations page (553:14960) of https://www.figma.com/design/Ao3YVgFYdQIF0znq2ToqVl.

## Speeds (the Figma)

Five speeds. Which one depends on the size of what moves and how far it travels: small and near is fast, big and far is slow.

| Name | Speed | When | Type |
|---|---|---|---|
| Extra Fast | 100ms | While hovering | Dissolve, ease out |
| Fast | 200ms | While hovering | Dissolve, ease out |
| Normal | 300ms | While hovering | Dissolve, ease out |
| Slow | 400ms | While hovering | Dissolve, ease out |
| Extra Slow | 500ms | While hovering | Dissolve, ease out |

## In code today

* The components (`components/ds/`) change colour, edge and shadow on hover, focus and press over 150ms (`duration-150`), between the Figma's Extra Fast and Fast.
* The Alert's toasts and the Drawer open and close with `tw-animate-css`.
* `styles/theme.css` names three speeds: `--motion-fast` 120ms, `--motion-base` 200ms, `--motion-slow` 400ms.
* The charts' cells and the chat's thinking mark hold still when the computer asks for reduced motion (`prefers-reduced-motion`).

| Code | Value | Nearest Figma speed |
|---|---|---|
| `--motion-fast` | 120ms | Extra Fast (100ms) |
| `--motion-base` | 200ms | Fast (200ms) |
| `--motion-slow` | 400ms | Slow (400ms) |

## Open

* Move the code to the Figma's five speeds, one token each (Extra Fast 100 to Extra Slow 500)? The components' 150ms hover would become Extra Fast (100) or Fast (200).
