# Twitch channel tools (TurtleWolfe)

Change the TurtleWolfe channel's schedule, title and category from the command line, through
the Twitch Helix API. Stdlib-only Python, run through Docker like everything else in this repo.

These tools moved here on 2026-10-02 from the Eduity and Chattanooga-Digital repos (the
`scripts/twitch/` copies). They manage **your** channel, so their keys belong in your repo, not
in a client's settings file.

> **Hatch now edits the Twitch schedule directly**, through its own browser. `schedule.md` is the
> March 2026 grid and is out of date. Running `sync_schedule.py --apply` with it would overwrite
> Hatch's grid, so update `schedule.md` first or don't use the sync.

## Keys

The app is **"TurtleWolfe Schedule Manager"** (https://dev.twitch.tv/console/apps, owned by the
TurtleWolfe account). Its keys live in this repo's gitignored `.env`:

```env
TWITCH_CLIENT_ID=...
TWITCH_CLIENT_SECRET=...
TWITCH_BROADCASTER_ID=...
# added by `auth device`, never by hand:
TWITCH_ACCESS_TOKEN=...
TWITCH_REFRESH_TOKEN=...
```

The same app's ID and secret also feed the go-live alert Worker (its wrangler secrets). If you
ever press **New Secret** on the app, update `.env` and the Worker's secret together.

## Sign in (once, and whenever the token dies)

```bash
docker compose run --rm twitch auth device
```

It prints a link and a short code. Open the link signed in as TurtleWolfe and approve the code.
The tokens go straight into `.env` and are never printed. The scopes are
`channel:manage:schedule` and `channel:manage:broadcast` only.

Do **not** use third-party token sites (the old README pointed at twitchtokengenerator.com): a
token made there was seen by that site.

## Use

```bash
docker compose run --rm twitch channel info
docker compose run --rm twitch channel update --title "Drupal CMS v2 — Live Build"
docker compose run --rm twitch channel update --game "Software and Game Development"
docker compose run --rm twitch schedule get
docker compose run --rm twitch schedule create --title "Special Stream" \
  --start "2026-11-01T18:00:00-04:00" --duration 90 --category "Software and Game Development"
docker compose run --rm twitch categories search --query "Software"
```

The client refreshes an expired access token by itself and writes the new one back to `.env`.
