<!-- Copied from the design copy (neutrino-frontend-v3) by scripts/sync.mjs. Edit it there, then run `npm run sync`. -->

# Assets

Status: written 23 Oct 2026. What the Figma's Assets pages hold, and which of them the product has in code.

Figma: the Assets section of https://www.figma.com/design/Ao3YVgFYdQIF0znq2ToqVl.

| Figma page | Node | What it holds | In code |
|---|---|---|---|
| Brand | 2771:1469 | The brand's marks | The 8bit and Neutrino logos in `public/` (`8bit*`, `neutrino-*`) |
| Placeholder | 172:5573 | Stand-in pictures | `public/avatar-default.svg`, the avatar without a photo |
| Country Flags | 2771:1471 | Flags | Not yet: the Dropdown shows emoji flags for now |
| Emojies | 2771:1472 | Emojis | Not yet |
| Appstore Badges | 2771:1470 | App store badges | Not yet |
| Thumbnails | 193450:30395 | Thumbnails | Not yet |
| Others | 2771:1473 | Ten cursors (Arrow, Pointer, Grab, Grabbed, Zoom In, Zoom Out, Move, Help, Text, Typing) | Not yet: the product uses the browser's own cursors |

Not a Figma page: the logos of the tools Neutrino connects to (Slack, Notion, Microsoft, Azure ...), in `public/brand/`. The Components page uses a few of them as sample logos (Avatar, Select, Tag, Checkbox ...).

## Open

* The Dropdown's flags are emoji and its card logos grey stand-ins: there is no artwork for them in `public/brand` yet.

## Folders

| Figma page | Here |
|---|---|
| [Brand](https://www.figma.com/design/Ao3YVgFYdQIF0znq2ToqVl?node-id=2771-1469) | [1-brand](1-brand) |
| [Placeholder](https://www.figma.com/design/Ao3YVgFYdQIF0znq2ToqVl?node-id=172-5573) | [2-placeholder](2-placeholder) |
| [Country Flags](https://www.figma.com/design/Ao3YVgFYdQIF0znq2ToqVl?node-id=2771-1471) | [3-country-flags](3-country-flags) |
| [Emojies](https://www.figma.com/design/Ao3YVgFYdQIF0znq2ToqVl?node-id=2771-1472) | [4-emojis](4-emojis) |
| [Appstore Badges](https://www.figma.com/design/Ao3YVgFYdQIF0znq2ToqVl?node-id=2771-1470) | [5-appstore-badges](5-appstore-badges) |
| [Thumbnails](https://www.figma.com/design/Ao3YVgFYdQIF0znq2ToqVl?node-id=193450-30395) | [6-thumbnails](6-thumbnails) |
| [Others](https://www.figma.com/design/Ao3YVgFYdQIF0znq2ToqVl?node-id=2771-1473) | [7-others](7-others) |
| (not in the Figma) | [8-tool-logos](8-tool-logos) |
