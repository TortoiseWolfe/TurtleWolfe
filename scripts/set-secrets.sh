#!/usr/bin/env bash
# Sets each Worker secret. Values are read silently and piped over stdin;
# they are never echoed and never passed as command arguments.
set -euo pipefail

cd "$(dirname "$0")/.."

SECRETS=(
  TWITCH_CLIENT_ID
  TWITCH_CLIENT_SECRET
  EVENTSUB_SECRET
  DISCORD_ANNOUNCE_WEBHOOK
  DISCORD_OPS_WEBHOOK
)

for name in "${SECRETS[@]}"; do
  printf 'Value for %s (input hidden): ' "$name" >&2
  read -rs value
  printf '\n' >&2
  if [[ -z "$value" ]]; then
    echo "Skipping ${name}: empty value." >&2
    continue
  fi
  if [[ "$name" == "EVENTSUB_SECRET" ]] && (( ${#value} < 10 || ${#value} > 100 )); then
    echo "EVENTSUB_SECRET must be 10-100 characters; skipping." >&2
    continue
  fi
  printf '%s' "$value" | docker compose run --rm -T dev npx wrangler secret put "$name"
  unset value
done
