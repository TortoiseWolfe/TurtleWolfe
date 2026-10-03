# TurtleWolfe stream plan: October 6 – November 1, 2026

One row per live slot: the topic, the repo it runs in, and the one-line pitch Hatch turns into the
Twitch title and the Discord event. Built from Hatch's 2026-10-02 content inventory (all public
repos), checked against the repos and live sites on 2026-10-03.

**The grid (ET):** Tue 6 PM *Can We Actually Build It?* · Wed 7 PM *Drupal CMS v2 Free Forever* · Fri 6 PM live build ·
Sat 2 PM live build (lighter, chat-driven) · Sun 10:30 AM Sunday Sharp (its own format, not planned here).
The ScriptHammer channel carries reruns and raids TurtleWolfe at go-live.

**Never on stream:** client work. Every repo below is public and Jonathan's own.

## Week 1: Oct 6 – 11

| Date | Slot | Show | Repo | Pitch |
|---|---|---|---|---|
| Tue 10/6 | 6 PM | **CWBI 002: Can my $200 AI plan run a kitchen?** | can-we-build-it (run sheet `002-ai-kitchen.md`, and the demo repo too) | One AI allowance, one head chef, a line of cheap cooks: the tests and a blind reviewer decide what's actually cooked, and one fault is planted. |
| Wed 10/7 | 7 PM | Drupal I: Install, Recipes and Branding (1 of 3) | gig-city-drupal | A Drupal CMS v2 site running in Docker from a clean clone, before the hour is out. |
| Fri 10/9 | 6 PM | RunIt wedding debrief | runit | Saturday's wedding was the first real beta: what guests did, what broke, and fixing the top issue live. |
| Sat 10/10 | 2 PM | Wireframe Wars | spec-kit-extension-wireframe | Chat votes between generated mockups; the winner becomes a spec rule the build has to honour. |

## Week 2: Oct 13 – 18

| Date | Slot | Show | Repo | Pitch |
|---|---|---|---|---|
| Tue 10/13 | 6 PM | **CWBI 003: Can we name every building downtown?** | ScriptHammer (`/chatt`, `model-city-prd.md`) | The atlas holds 13,877 buildings and 10,743 have no type in OpenStreetMap. The AI says where the gaps are; the count decides, and out comes a canvassing route. |
| Wed 10/14 | 7 PM | Drupal I: Install, Recipes and Branding (2 of 3) | gig-city-drupal | What a Recipe is, and why the whole site installs from one. |
| Fri 10/16 | 6 PM | Rebrand race #1 (DrupalCamp rehearsal) | ScriptHammer | Chat names an app; fork ScriptHammer, run the rebrand script and race the clock to a live URL. |
| Sat 10/17 | 2 PM | Pig factory | Auto-Blender | Chat picks the traits and headless Blender builds the mascot: procedural characters with no hand modelling. |

## Week 3: Oct 20 – 25

| Date | Slot | Show | Repo | Pitch |
|---|---|---|---|---|
| Tue 10/20 | 6 PM | **CWBI 004: Can a phone replace the tape measure?** | ScanDo | LiDAR-scan the stream room, the AI predicts the error, and a tape measure on camera decides. |
| Wed 10/21 | 7 PM | Drupal I: Install, Recipes and Branding (3 of 3) | gig-city-drupal | Components and branding: make the deliberately plain build look like yours. |
| Fri 10/23 | 6 PM | RescueDogs: ship the pilot | RescueDogs | Build the missing piece a first shelter needs to go live, with apply → status → tracker run end to end. |
| Sat 10/24 | 2 PM | Wireframe Wars or a chat pick | spec-kit-extension-wireframe | A spare slot: rerun the most-voted format of the month. |

## Week 4: Oct 27 – Nov 1

| Date | Slot | Show | Repo | Pitch |
|---|---|---|---|---|
| Tue 10/27 | 6 PM | **CWBI 005: Can the rerun channel run itself?** | OBS_MCP_bot | The always-on channel's chat bot: the AI claims it survives a dropped connection and a bad file, and planted faults decide. |
| Wed 10/28 | 7 PM | Drupal II: Content Model and Canvas (1 of 3) | gig-city-drupal | The Event content type, field by field, ready for Canvas pages in November. |
| Fri 10/30 | 6 PM | Rebrand race #2: full dress, timed | ScriptHammer | The DrupalCamp demo end to end against the clock, the day before speakers confirm (Oct 31). |
| Sat 10/31 | 2 PM | Halloween in the playable city | ScriptHammer (`/game`) | Live-code a tiny spooky game on the shared Three.js engine, with chat suggesting the mechanics. |

## Open before a slot is booked

- **10/6:** the kitchen works on can-we-build-it itself, since it's on NX-01 and its Docker test suite is already green. OBS_24_7 lives on the second tower, which is still on an older OpenClaw, so it waits for 10/27. The run sheet's "Before you go live" list still applies.
- **10/27:** needs OBS_24_7's newest code from the second tower, after that machine's OpenClaw upgrade.
- **10/9:** needs the wedding's GitHub issues filed first. If the beta didn't happen, swap in Rebrand race #1.
- **10/20:** ScanDo was last pushed in April on Expo SDK 53. Check a device build before booking the slot (EAS builds are rationed). Fallback: swap it with 10/27.
- **Wednesdays:** these follow modules 10 and 11 of the curriculum below, which track the co-op blog's 11-part *How We Built It* series (Prefaces, then Parts 0–4). If the existing Wednesday show is already past install, start at Drupal II and link the old VODs as prior viewing. Only gig-city-drupal (the public, sanitised extract) goes on screen, never the co-op's own repo or a member's site.
- **DrupalCamp:** Nov 13–14; speakers confirm by Oct 31. The talk's demo (fork → rebrand → live URL) comes from Hatch's inventory and hasn't been checked against the proposal.

## The curriculum (Jonathan's Oct 1 directive)

`curriculum-own-your-stack.md`: a review of chattanooga.digital (what's solid, what's a stub, 12 stale items), then 18 modules and 49 sessions. Every co-op workshop topic and hosted app is mapped to stream-sized sessions, each with a description, a session count and prerequisites.
- **Wednesdays** take the Drupal modules (10–14), starting this month as above.
- **Saturdays** are the draft's best fit for the other modules (1–9, 15–18). **Jonathan decides** whether that starts Oct 10 or after the co-op answers four questions: a current timeline line, which "hack session" is real, which accounting tool, and fresh demo instances vs members' own. October's Saturdays stay as planned until then.

## Corrections to the inventory

- **The *How We Built It* series has 11 parts, not 14** (the blog: Prefaces plus Parts 0–10).
- **`/chatt` is not broken.** On 2026-10-03, a headless browser with WebGL rendered all 13,877 buildings, with no page errors. Hatch's browser has no WebGL, which explains the error it saw.
