<!-- merlin-design-system: start -->
## Design system: Merlin Nitesh's New Design System (hard rule)

- All UI, in every project, comes from Nitesh's design system: its components, type styles, colours, spacing, sizing, padding, corners and states. Never make a component or a size of your own; when it has nothing for the job, ask Nitesh before building.
- The look is exact; behaviour may differ. A project can keep its own components for how things work (ether-web-v1's `@/shared/components/ui`), but what they look like must match the design system exactly.
- Merlin is square: every corner is 0. Round stays only where the shape is the part: radio, switch, avatars and their picture slots, dots, knobs, donut and gauge charts.
- Charts are plain: solid bars, lines, rings and squares in the brand's colours. Never the Neutrino cells (the dotted effect) in any chart.
- Repo: https://github.com/nitesharora36/nitesh-corrected-design-system (private). Local copy: `{{REPO}}`, kept current with `git -C {{REPO}} pull`; see every component with `npm run dev` there, then http://localhost:3100.
- Its full rules load below. Before any UI work, read the component's file, its sizes file and its page in that repo.

@{{REPO}}/CLAUDE.md
<!-- merlin-design-system: end -->
