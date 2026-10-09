# afa-stream-alerts

Twitch go-live alerts and stream watchdogs for the TurtleWolfe and ScriptHammer channels, as a
small Cloudflare Worker that runs with every home PC switched off.

- **Go-live:** Twitch tells the Worker the moment a channel goes live, and it posts to Discord
  #announcements. Reruns (titles starting "[Rerun]") post without pinging anyone.
- **Watchdogs:** they ping a private ops channel when a scheduled stream doesn't start, or when
  the always-on channel drops.
- **Self-repair:** Twitch quietly cancels subscriptions whose receiver keeps failing, so the
  Worker checks its subscription daily, repairs it, and says so.
- **Health:** `GET /health` answers 503 if the Worker's cron has stopped, for UptimeRobot.

Also here: [`tools/twitch-schedule/`](tools/twitch-schedule/), command-line tools for the
TurtleWolfe channel's schedule and title.

Spec: [`specs/001-go-live-alerts/spec.md`](specs/001-go-live-alerts/spec.md).
Development is Docker-only; see `CLAUDE.md`.
