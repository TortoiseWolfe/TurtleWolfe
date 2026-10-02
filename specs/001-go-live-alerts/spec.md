# 001 · Go-live alerts and stream watchdog

A small Cloudflare Worker for the Action Figure Automata (AFA). When a TurtleWolfe stream
starts, it posts to Discord #announcements. It also watches for streams that should be live
and aren't, and pings a private ops channel. It runs in Cloudflare's cloud, so it works with
both of Jonathan's PCs switched off.

## Why

- MEE6's Twitch alerts are Premium-only. Streamcord runs 1 to 5 minutes late, needs
  permission to ping everyone, and can fail silently.
- Twitch quietly revokes a webhook subscription whose receiver keeps failing, so the Worker
  has to repair its own subscription and say so.
- Decided on 2026-10-02:
  - TurtleWolfe (an Affiliate) is live-only: Tue and Fri 6 PM ET, Sat 2 PM, Wed 7 PM Drupal,
    Sun 10:30 AM Sunday Sharp.
  - ScriptHammer's channel (not an Affiliate) will run always-on reruns later.
  - Reruns are labelled with a title that starts with "[Rerun]" and never ping anyone.

## Out of scope

Raids, chat, OBS control, the Twitch "Rerun" checkbox (the API can't set it), creating
Discord events, and any user-token (OAuth) flow. Only an app access token is used.

## Behaviour

### Config: `BROADCASTERS` (a JSON var in wrangler.toml)

```json
[
  {"login": "turtlewolfe", "announce": true, "mention": "none", "watchdog": "none"},
  {"login": "scripthammer", "announce": false, "mention": "none", "watchdog": "none"}
]
```

- `announce`: post to #announcements when this channel goes live, and keep a
  `stream.online` subscription for it.
- `mention`: `"none"`, `"everyone"`, or `"role:<numeric id>"`. Applies only to non-rerun
  go-live posts.
- `watchdog`: `"none"`, `"schedule"` (alert when a scheduled segment didn't start) or
  `"always_on"` (alert when the channel has been offline longer than the grace period).
- Parse and validate at startup with `parseBroadcasters(raw)`. An invalid entry throws
  with a message naming the bad field. A config error must never be swallowed.
- The logins above are placeholders until confirmed at deploy.

### Secrets (wrangler secrets, never in code or in wrangler.toml)

`TWITCH_CLIENT_ID`, `TWITCH_CLIENT_SECRET`, `EVENTSUB_SECRET` (10–100 chars),
`DISCORD_ANNOUNCE_WEBHOOK`, `DISCORD_OPS_WEBHOOK`.

### Other vars

- `PUBLIC_URL`: the Worker's own origin. The EventSub callback is `${PUBLIC_URL}/eventsub`.
- `ALWAYS_ON_GRACE_MIN`: default `15`.
- KV namespace binding `STATE`.

### Routes

- `POST /eventsub`: Twitch EventSub webhook.
- `GET /health`: liveness check for UptimeRobot.
- Anything else: 404.

### `POST /eventsub`

1. Read the raw body as text and verify it before parsing JSON:
   - Headers: `Twitch-Eventsub-Message-Id`, `Twitch-Eventsub-Message-Timestamp`,
     `Twitch-Eventsub-Message-Signature`, `Twitch-Eventsub-Message-Type`.
   - Expected signature: `"sha256=" + hex(HMAC-SHA256(EVENTSUB_SECRET, id + timestamp + rawBody))`.
     Compute it with WebCrypto (`crypto.subtle`) and compare in constant time.
   - Missing header or bad signature → 403. A timestamp more than 10 minutes from now
     (either direction) → 403.
2. Deduplicate: if KV `msg:<id>` exists, return 204 and do nothing. Otherwise put it with a
   24 h TTL.
3. By message type:
   - `webhook_callback_verification`: return 200 with the raw `challenge` string as the
     body and `Content-Type: text/plain`.
   - `revocation`: post an ops alert naming the subscription type, the broadcaster and
     `subscription.status`, then return 204.
   - `notification` with subscription type `stream.online`: handle as below, return 204.
   - Anything else: 204.
4. Respond fast. Twitch times out after a few seconds, so the Discord post should run in
   `ctx.waitUntil`. In tests, await it.

### Go-live handling (`stream.online` notification)

- Look up the broadcaster config by `event.broadcaster_user_login`, case-insensitive.
  Skip it if it's missing or `announce` is false.
- Cooldown: if KV `announced:<login>` exists, skip; a quick reconnect must not re-announce.
  Otherwise put it with a 30 min TTL.
- Get the title from `GET https://api.twitch.tv/helix/channels?broadcaster_id=<event.broadcaster_user_id>`
  (field `title`). If that call fails, post anyway with the title "(title unavailable)".
- A stream is a rerun when the title starts with `[Rerun]` (case-insensitive, after trimming)
  or `event.type === "rerun"`.
- Message (`buildAnnouncement`):
  - Live: `{prefix}**{broadcaster_user_name} is live:** {title}\nhttps://twitch.tv/{login}`.
    `prefix` is `@everyone ` or `<@&ID> ` per `mention`, or empty.
    `allowed_mentions` is `{"parse":["everyone"]}` for everyone, `{"roles":["ID"]}` for a role,
    and `{"parse":[]}` for none.
  - Rerun: `**{broadcaster_user_name}** rerun: {title}\nhttps://twitch.tv/{login}`, and
    `allowed_mentions` is always `{"parse":[]}`.
- Post to `DISCORD_ANNOUNCE_WEBHOOK`.

### Discord posting (`postDiscord(url, payload)`)

- POST JSON. A 2xx is success.
- 429: wait `retry_after` seconds (from the JSON body, else the `Retry-After` header,
  capped at 5 s) and retry once.
- 404 or 401 means the webhook is gone. Don't retry. Return a result saying so. When the
  failing webhook is the announce one, post an ops alert ("announce webhook returned 404").
- Never throw out of the Worker because Discord failed.
- Never log a webhook URL or any secret.

### Twitch API helpers

- App token: `POST https://id.twitch.tv/oauth2/token` with form fields `client_id`,
  `client_secret`, `grant_type=client_credentials`. Cache it in KV `token:app` with a TTL of
  `expires_in - 300` seconds.
- `helix(path, query)`: GET with headers `Client-Id` and `Authorization: Bearer <token>`.
  On a 401, clear the cached token, fetch a new one and retry once.
- `userId(login)`: `GET /helix/users?login=<login>` → `data[0].id`. Cache in KV `uid:<login>`
  for 7 days.
- `isLive(userId)`: `GET /helix/streams?user_id=<id>` → `data.length > 0`.
- Subscriptions: `GET /helix/eventsub/subscriptions?type=stream.online`,
  `POST /helix/eventsub/subscriptions`, and `DELETE /helix/eventsub/subscriptions?id=<id>`.
  The POST body is
  `{"type":"stream.online","version":"1","condition":{"broadcaster_user_id":ID},"transport":{"method":"webhook","callback":CALLBACK,"secret":EVENTSUB_SECRET}}`.

### Scheduled handler (one cron: `*/10 * * * *`)

Each run does these, in order, each one isolated so that one failing doesn't stop the rest:

1. **Reconcile subscriptions** if KV `reconcile:last` is missing or older than 24 h. That also
   covers the first run after deploy. For every `announce: true` broadcaster:
   - Find subscriptions for this broadcaster whose `transport.callback` equals our callback.
   - One `enabled` → nothing to do.
   - Any with a failure status (`webhook_callback_verification_failed`,
     `notification_failures_exceeded`, `authorization_revoked`, `user_removed`,
     `version_removed`) → delete them, create a new one, and post ops "repaired
     stream.online subscription for {login} (was {status})".
   - None at all → create one; ops message "created stream.online subscription for {login}".
   - Only `webhook_callback_verification_pending` → leave it alone.
   - Never touch subscriptions that point at another callback.
   - On success, put `reconcile:last` = now.
2. **Watchdogs.** For each broadcaster:
   - `"schedule"`: `GET /helix/schedule?broadcaster_id=<id>&start_time=<now-30min ISO>&first=10`.
     A 404 means no schedule: skip. If `vacation` is not null and now falls inside it: skip.
     For each segment with `canceled_until === null` whose `start_time` is between 20 and
     5 minutes ago: if not live and KV `alert:sched:<segment.id>:<start_time>` is missing,
     post ops "{login}: scheduled '{title}' at {start_time} hasn't started", then put the
     key with a 2 day TTL.
   - `"always_on"`: if not live and KV `offline:<login>` is missing, put `{"since":now}`.
     Once offline for at least `ALWAYS_ON_GRACE_MIN` minutes and not yet alerted, post ops
     "{login} has been offline for N min" and record that it alerted. If live and
     `offline:<login>` exists: if it alerted, post ops "{login} is back live"; then delete
     the key either way.
3. Put KV `cron:last` = now (ISO) last, even if steps 1 or 2 hit errors, and post one ops
   alert summarising any step that threw (without secrets).

### `GET /health`

- `cron:last` within the last 30 min → 200 `{"ok":true,"lastCron":"<iso>"}`.
- Otherwise → 503 `{"ok":false,"lastCron":<iso or null>}`.
- UptimeRobot watches this URL, so a Worker whose cron has stopped gets noticed.

### Ops alert format

- Content: `[afa-stream-alerts] <message>`. `allowed_mentions` is always `{"parse":[]}`.
  The private channel's own notification setting delivers the phone push.

## Engineering rules

- TypeScript strict. Runtime: Cloudflare Workers, with no Node-only APIs in `src/`.
- **Dependency injection for testability:**
  - every module takes a `deps` object `{ fetch, now, kv, waitUntil? }` instead of
    touching globals;
  - `src/index.ts` is the only file that wires the real `globalThis.fetch`, `Date.now`,
    `env.STATE` and `ctx.waitUntil`.
- Layout:
  - `src/index.ts`: the entry point, `export default { fetch, scheduled }`
  - `src/config.ts`
  - `src/verify.ts`
  - `src/eventsub.ts`
  - `src/announce.ts`
  - `src/discord.ts`
  - `src/twitch.ts`
  - `src/reconcile.ts`
  - `src/watchdog.ts`
  - `src/health.ts`
  - `test/<module>.test.ts` for each module, with a fake KV (Map-backed get/put/delete that
    records TTLs) and a fake fetch (route table plus a call log).
- **Tests are written first** and must be able to fail. Each one asserts on the exact
  outgoing request (URL, method, body) or the exact response. In signature tests, compute
  the expected HMAC with `node:crypto` (allowed in tests only), so WebCrypto is
  cross-checked against an independent implementation.
- Minimum cases:
  - verify: valid; tampered body; wrong secret; stale timestamp (11 min); missing header;
    malformed signature prefix.
  - eventsub: challenge returns the exact text; duplicate id → no second post; revocation →
    one ops post; unknown type → 204.
  - announce:
    - live with each mention kind gets the exact payload;
    - a rerun by title and a rerun by `type` both get no mention;
    - `announce:false` → no post;
    - the cooldown suppresses a second go-live within 30 min;
    - a title-fetch failure posts "(title unavailable)".
  - discord: 429 then 200 → two calls; 404 → no retry, and an ops alert when it's the
    announce webhook.
  - twitch: the token is cached; a 401 refreshes and retries once.
  - reconcile:
    - enabled → no writes;
    - failed → DELETE then POST, plus an ops post;
    - none → POST;
    - pending → nothing;
    - a sub with another callback is untouched;
    - skipped when `reconcile:last` is under 24 h old.
  - watchdog:
    - schedule: a due segment that isn't live → one alert, and a second run → none; live →
      none; canceled → none; future → none; 404 → none.
    - always_on: grace honoured, one alert, "back live" message, and the key cleared.
  - health: fresh → 200; stale or missing → 503.
- `package.json` scripts: `test` (`vitest run`), `typecheck` (`tsc --noEmit`), `dev`
  (`wrangler dev`), `deploy` (`wrangler deploy`). Commit the lockfile.
- `wrangler.toml`: `name = "afa-stream-alerts"`, `main = "src/index.ts"`, a current
  `compatibility_date`, `[triggers] crons = ["*/10 * * * *"]`, a `STATE` KV binding with
  the placeholder id `REPLACE_AT_DEPLOY`, and the vars above with the placeholder logins.

## Check (must pass before review)

```
docker compose -p afa-stream-alerts-check run --rm dev sh -c "npm ci && npm run typecheck && npm test"
```

## Deploy (later, needs Jonathan or Hatch; not part of this build)

1. Register a Twitch app at https://dev.twitch.tv/console (needs two-factor sign-in). That
   gives the client ID and secret.
2. Create two Discord webhooks: one for #announcements, one for a private ops channel.
3. Create the KV namespace, set the secrets with `scripts/set-secrets.sh` (it reads each
   value silently, never as a command argument), then `npm run deploy`, all inside the dev
   container.
4. Point an UptimeRobot keyword monitor at `/health`.
