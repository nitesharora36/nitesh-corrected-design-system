#!/usr/bin/env bash
# Makes every Claude Code session on this computer follow Merlin Nitesh's New
# Design System: writes one marked section into ~/.claude/CLAUDE.md (from
# scripts/claude-global.md) that loads this copy's CLAUDE.md. Run it again
# after a pull or a move: it refreshes that section and leaves the rest of
# the file as it was.
#
#   ./scripts/install-claude.sh
set -euo pipefail

repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
target="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/CLAUDE.md"
start='<!-- merlin-design-system: start -->'
end='<!-- merlin-design-system: end -->'

block="$(mktemp)"
rest="$(mktemp)"
trap 'rm -f "$block" "$rest"' EXIT
sed "s#{{REPO}}#${repo}#g" "$repo/scripts/claude-global.md" > "$block"

mkdir -p "$(dirname "$target")"
touch "$target"

if grep -qF "$start" "$target"; then
  # The section is there already: put the new one in its place.
  awk -v s="$start" -v e="$end" -v f="$block" '
    $0 == s { while ((getline line < f) > 0) print line; skip = 1; next }
    $0 == e { skip = 0; next }
    !skip { print }
  ' "$target" > "$rest"
  # cat, not mv, so a CLAUDE.md that is a link stays one.
  cat "$rest" > "$target"
  echo "Refreshed the design system section in $target"
else
  if [ -s "$target" ]; then printf '\n' >> "$target"; fi
  cat "$block" >> "$target"
  echo "Added the design system section to $target"
fi
echo "Every new Claude Code session now loads $repo/CLAUDE.md"
