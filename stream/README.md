# stream/

The TurtleWolfe channel's side jobs. Each started as its own repo and moved here on
2026-10-09, history included, because they serve this channel and had no reason to live
apart. Each keeps its own `CLAUDE.md`, tests and Docker setup; read that file before
working in it.

| Folder | What it is | Runs where |
|---|---|---|
| `alerts/` | Twitch go-live posts to Discord, stream watchdogs, and the channel's schedule tools (was `afa-stream-alerts`) | A Cloudflare Worker, deployed with `wrangler` from `alerts/`. The root `.github/workflows/stream-alerts-health.yml` checks its `/health` every 3 hours |
| `can-we-build-it/` | Parts bin, compatibility checker and virtual build for the "Can we actually build it?" segment | Locally, through its own `compose.yaml` |

**The web app ignores this folder.** TurtleWolfe's typecheck, lint, vitest, Prettier and
Docker build context all exclude `stream/`, so neither side's tooling trips on the other.

**Secrets stay out of git.** Each job's keys live in its own gitignored `.env` (and the
Worker's in `wrangler secret`), never in a committed file. Each folder's own `.gitignore`
still applies here.
