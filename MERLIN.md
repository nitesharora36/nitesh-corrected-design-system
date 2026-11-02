# Merlin colours

This copy of the design system kit (from ~/Downloads/design-system-kit.zip, 2 Nov 2026) wears Merlin's colours:

* The brand scale (`--palette-blue-*` in `src/styles/theme-tokens.css`) is Merlin's purple, by role: 500 is the primary base `#6e3785`, 400 is the primary on dark `#8b4dab`, 50 to 950 run from `#f6f1fa` to `#1b101e`. The name stays "blue" so every token still points at it.
* Two greys match Merlin's: gray-100 `#f7f7f7` (bg/weak-50) and gray-500 `#7b7b7b`.
* Merlin is square (Nitesh, 3 Nov 2026): every step of the corner scale (`--corner-2` to `--corner-28` in `src/styles/size-tokens.css`) is 0, and so is every pill, track and round button. Round stays round only where the shape is the part: radio, switch, avatars and the picture slots that hold them, dots, slider and colour-picker knobs, donut and gauge charts.
* Charts are plain (3 Nov 2026): solid bars, lines, rings and squares; the Neutrino cells are no longer drawn in any chart.
* The look is exact: anything built with this design system, in any app, looks exactly like these components. Behaviour may come from elsewhere.
* Everything else (sizes, type, states) is the kit's own.

Run it with `npm install` then `npm run dev`, and open http://localhost:3100.
