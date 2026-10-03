# TurtleWolfe stream plan: October 6 – November 1, 2026

One row per live slot: the topic, the repo it runs in, and the one-line pitch Hatch turns into the
Twitch title and the Discord event. Built from Hatch's 2026-10-02 content inventory (all public
repos), checked against the repos and live sites on 2026-10-03.

**The grid (ET):** Tue 6 PM *Can We Actually Build It?* · Wed 7 PM Drupal CMS · Fri 6 PM live build ·
Sat 2 PM live build (lighter, chat-driven) · Sun 10:30 AM Sunday Sharp (its own format, not planned here).
The ScriptHammer channel carries reruns and raids TurtleWolfe at go-live.

**Never on stream:** client work. Every repo below is public and Jonathan's own.

## Week 1: Oct 6 – 11

| Date | Slot | Show | Repo | Pitch |
|---|---|---|---|---|
| Tue 10/6 | 6 PM | **CWBI 002: Can my $200 AI plan run a kitchen?** | can-we-build-it (run sheet `002-ai-kitchen.md`) · demo repo OBS_MCP_bot | One AI allowance, one head chef, a line of cheap cooks: the tests and a blind reviewer decide what's actually cooked, and one fault is planted. |
| Wed 10/7 | 7 PM | Drupal: *How We Built It*, part 1 | gig-city-drupal | Stand the teaching build up from a clean clone and walk through what each piece is for. |
| Fri 10/9 | 6 PM | RunIt wedding debrief | runit | Saturday's wedding was the first real beta: what guests did, what broke, and fixing the top issue live. |
| Sat 10/10 | 2 PM | Wireframe Wars | spec-kit-extension-wireframe | Chat votes between generated mockups; the winner becomes a spec rule the build has to honour. |

## Week 2: Oct 13 – 18

| Date | Slot | Show | Repo | Pitch |
|---|---|---|---|---|
| Tue 10/13 | 6 PM | **CWBI 003: Can we name every building downtown?** | ScriptHammer (`/chatt`, `model-city-prd.md`) | The atlas holds 13,877 buildings and 10,743 have no type in OpenStreetMap. The AI says where the gaps are; the count decides, and out comes a canvassing route. |
| Wed 10/14 | 7 PM | Drupal: *How We Built It*, part 2 | gig-city-drupal | Next post in the series, built live. |
| Fri 10/16 | 6 PM | Rebrand race #1 (DrupalCamp rehearsal) | ScriptHammer | Chat names an app; fork ScriptHammer, run the rebrand script and race the clock to a live URL. |
| Sat 10/17 | 2 PM | Pig factory | Auto-Blender | Chat picks the traits and headless Blender builds the mascot: procedural characters with no hand modelling. |

## Week 3: Oct 20 – 25

| Date | Slot | Show | Repo | Pitch |
|---|---|---|---|---|
| Tue 10/20 | 6 PM | **CWBI 004: Can a phone replace the tape measure?** | ScanDo | LiDAR-scan the stream room, the AI predicts the error, and a tape measure on camera decides. |
| Wed 10/21 | 7 PM | Drupal: *How We Built It*, part 3 | gig-city-drupal | Next post in the series, built live. |
| Fri 10/23 | 6 PM | RescueDogs: ship the pilot | RescueDogs | Build the missing piece a first shelter needs to go live, with apply → status → tracker run end to end. |
| Sat 10/24 | 2 PM | Wireframe Wars or a chat pick | spec-kit-extension-wireframe | A spare slot: rerun the most-voted format of the month. |

## Week 4: Oct 27 – Nov 1

| Date | Slot | Show | Repo | Pitch |
|---|---|---|---|---|
| Tue 10/27 | 6 PM | **CWBI 005: Can the rerun channel run itself?** | OBS_MCP_bot | The always-on channel's chat bot: the AI claims it survives a dropped connection and a bad file, and planted faults decide. |
| Wed 10/28 | 7 PM | Drupal: *How We Built It*, part 4 | gig-city-drupal | Next post in the series, built live. |
| Fri 10/30 | 6 PM | Rebrand race #2: full dress, timed | ScriptHammer | The DrupalCamp demo end to end against the clock, the day before speakers confirm (Oct 31). |
| Sat 10/31 | 2 PM | Halloween in the playable city | ScriptHammer (`/game`) | Live-code a tiny spooky game on the shared Three.js engine, with chat suggesting the mechanics. |

## Open before a slot is booked

- **10/6:** does the second tower hold newer OBS_24_7 code than GitHub (last push 2025-10-23)? The run sheet's "Before you go live" list still applies.
- **10/9:** needs the wedding's GitHub issues filed first. If the beta didn't happen, swap in Rebrand race #1.
- **10/20:** ScanDo was last pushed in April on Expo SDK 53. Check a device build before booking the slot (EAS builds are rationed). Fallback: swap it with 10/27.
- **Wednesdays:** the 14-post *How We Built It* order isn't written down in gig-city-drupal's README. Parts 1–4 follow the blog series.
- **DrupalCamp:** Nov 13–14; speakers confirm by Oct 31. The talk's demo (fork → rebrand → live URL) comes from Hatch's inventory and hasn't been checked against the proposal.

## Corrections to the inventory

- **`/chatt` is not broken.** On 2026-10-03, a headless browser with WebGL rendered all 13,877 buildings, with no page errors. Hatch's browser has no WebGL, which explains the error it saw.
