# CLAUDE.md

A Cloudflare Worker for the Action Figure Automata (AFA): Twitch go-live posts to Discord, plus
watchdogs that ping a private ops channel. The spec is `specs/001-go-live-alerts/spec.md`; read it first.

## Rules

- **Docker-first.** Never run `npm`, `npx` or `wrangler` on the host. Use the `dev` service:
  `docker compose run --rm dev npm ci`, then `npm run typecheck` and `npm test` the same way.
- **The check:** `docker compose -p afa-stream-alerts-check run --rm dev sh -c "npm ci && npm run typecheck && npm test"`.
  A change isn't done until it's green.
- **Secrets never go in code, wrangler.toml, commits or command lines.** They're wrangler secrets
  set by `scripts/set-secrets.sh`, which reads them silently.
- **Tests first** (Vitest). Every module takes injected `deps` (`fetch`, `now`, `kv`); only
  `src/index.ts` touches real globals.
- No Node-only APIs in `src/`; it runs on the Workers runtime. `node:crypto` is allowed in tests only.
- Never log webhook URLs, tokens or the EventSub secret.
