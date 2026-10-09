#!/usr/bin/env bash
# Sets the Worker's secrets. Each value comes from the gitignored .env when it is there,
# otherwise it is read silently from the terminal (Enter skips it). Values are piped over
# stdin to wrangler: never echoed, never passed as command arguments.
#
#   scripts/set-secrets.sh                 # all five; prompts only for what .env lacks
#   scripts/set-secrets.sh NAME [NAME...]  # just these
#
# Run from the host (it calls docker compose); wrangler itself runs in the dev container.
set -euo pipefail

cd "$(dirname "$0")/.."

ALL=(
  TWITCH_CLIENT_ID
  TWITCH_CLIENT_SECRET
  EVENTSUB_SECRET
  DISCORD_ANNOUNCE_WEBHOOK
  DISCORD_OPS_WEBHOOK
)
if (($#)); then NAMES=("$@"); else NAMES=("${ALL[@]}"); fi

# Read NAME=value from .env without sourcing it (no shell expansion of the value).
envval() {
  [[ -f .env ]] || return 0
  python3 - "$1" <<'PY'
import pathlib, re, sys
for line in pathlib.Path(".env").read_text().splitlines():
    m = re.match(r"\s*" + re.escape(sys.argv[1]) + r"\s*=\s*(.*)$", line)
    if m:
        print(m.group(1).strip().strip('"').strip("'"), end="")
        break
PY
}

for name in "${NAMES[@]}"; do
  value="$(envval "$name")"
  source_label=".env"
  if [[ -z "$value" ]]; then
    source_label="prompt"
    if [[ -t 0 ]]; then
      printf 'Value for %s (input hidden, Enter to skip): ' "$name" >&2
      read -rs value || true
      printf '\n' >&2
    fi
  fi
  if [[ -z "$value" ]]; then
    echo "skip   $name (no value)" >&2
    continue
  fi
  if [[ "$name" == "EVENTSUB_SECRET" ]] && ((${#value} < 10 || ${#value} > 100)); then
    echo "skip   $name: must be 10-100 characters" >&2
    continue
  fi
  if [[ "$name" == DISCORD_*_WEBHOOK && "$value" != https://discord.com/api/webhooks/* ]]; then
    echo "skip   $name: not a Discord webhook URL" >&2
    continue
  fi
  printf '%s' "$value" | docker compose run --rm -T dev npx wrangler secret put "$name" >/dev/null 2>&1 \
    && echo "set    $name (from $source_label)" >&2 \
    || { echo "FAILED $name" >&2; exit 1; }
  unset value
done
