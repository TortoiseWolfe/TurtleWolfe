# Can We Actually Build It? Episode 003: Can we name every building downtown?

**Channel:** TurtleWolfe on Twitch · **Streams:** Tue 2026-10-13, 6 PM ET
**Format:** Two AI claims committed first, one script decides, and out comes a canvassing route (~60-75 min)
**Real-world stakes:** Whether the Building Registry in ScriptHammer's Model City plan (MC-2 to MC-4) starts with a desk pass over data we already hold or with feet on the street, and which 250 m square gets walked first
**Repo:** can-we-build-it · build `builds/003-chatt-registry/` (no `build.json`: this build is a count, not a parts list) · subject data: ScriptHammer (public)

> **Spoiler warning.** The "Facts to get right on air" section holds the answers to both of the AI's
> claims. Don't open this file on screen, and never put it in the AI's session, until the claims are
> committed. The AI sees `builds/003-chatt-registry/briefing.md` and nothing else.

---

## Cold Open (~3 min)

> The title asks if we can name every building downtown. The honest answer is no, and we can't even
> settle that live: of the 13,877 buildings on our map of the city, 400 have a name in OpenStreetMap.
> That's 2.9%.
>
> What we can settle live is smaller. 10,743 of those buildings have no type the map can use (not a
> house, not a shop, not a church). So: how many of them does the data already know enough about to
> type, and where is the grey thickest?
>
> The rule on this show: the AI makes its claims first, on screen, committed to git. Then a script that
> doesn't care how confident anyone sounds does the counting. Tonight that's two claims, one script, and
> a walking route for whoever goes out to fix the map.

---

## Disclosures (~30 s). Say these out loud if you'll recommend products on air

> Some links in chat and on the page are Amazon links. As an Amazon Associate I earn from qualifying purchases.

- This episode recommends no products. If you mention one anyway, say the line above, never read a price, no giveaways tied to links.
- Say once: the buildings come from OpenStreetMap, (c) OpenStreetMap contributors, open data under the ODbL.

---

## Part 1: The requirement (~8 min)

Show what "untyped" means, live, before any number is claimed.

1. Open `/chatt` (https://tortoisewolfe.github.io/ScriptHammer/chatt/) in the clean browser profile and switch the colour chip to **type**. Grey is the buildings OpenStreetMap hasn't typed. Rehearse this: the code's default colour mode and one comment in `buildings.ts` disagree, so check which mode loads on the stream machine.
2. Show the rule on the GitHub page for `src/twin/cesium/buildings.ts`: the `TYPE_BUCKETS` table and `typeBucket()`. A building is untyped when its `building` tag is missing, is `yes`, or is a value the table doesn't list.
3. Show one record from the file:
   ```bash
   python3 -c "import json,sys; print(json.dumps(json.load(open(sys.argv[1]))[0], indent=1))" \
     ~/repos/ScriptHammer/public/twins/chatt/buildings-wide.json
   ```
4. Say why it matters. The Registry plan scores a building on name, height, address and contact, 25% each; a building with no type isn't even on the first rung. The Registry is a plan (`model-city-prd.md`), not shipped, so tonight's route is the first thing it would produce.

> Given as a starting fact, not claimed: 13,877 buildings, 10,743 untyped. Everything else is counted
> after the claims are in.

---

## Part 2: The AI's claims, committed before anything is counted (~12 min)

1. Put `builds/003-chatt-registry/briefing.md` on screen and read it. It holds the rule, the two questions and the grid's axes; it holds neither answer. Record its hash:
   ```bash
   sha256sum builds/003-chatt-registry/briefing.md
   ```
2. Chat guesses first (optional poll). A: what share of the untyped could the data already type, under 1%, 1-5%, 5-20%, over 20%? B: which part of town is greyest?
3. Give the briefing to a fresh AI session, in an empty folder, with no file or web tools. Paste its JSON answer into the claims file, with `recorded_at` set to now:
   ```bash
   mkdir -p builds/003-chatt-registry/claims
   date -u +%Y-%m-%dT%H:%M:%SZ
   ```
   ```json
   {"model": "<model id>", "recorded_at": "<now, UTC>", "prompt_sha256": "<from step 1>",
    "claims": [ <the AI's two claims, pasted unchanged> ]}
   ```
   Save it as `builds/003-chatt-registry/claims/2026-10-13-<model>.json`.
4. Commit on screen, and push so GitHub's clock, not ours, proves the order:
   ```bash
   git switch -c cwbi-003-live
   git add builds/003-chatt-registry/claims && git commit -m "claims: <model> before count.py runs"
   git push -u origin cwbi-003-live
   git log -1 --format='%h %cI %s'
   ```
   Merge `cwbi-003-live` after the show.

**How the claims will be scored (read this out before the count):**
- **A (how many could be typed from tags already in the file):** PASS if within 10% of count.py's number, else FAIL.
- **B (the three greyest cells):** PASS only if all three are in count.py's top 3, in any order. Otherwise FAIL, and say how many hit and how many landed in the top 10. A label outside the grid is a miss.
- A claim that isn't one whole number, or three cell labels, is NOT VERIFIABLE. Ask once more on camera and show both answers.

> The checker for parts (`partsbin check --claims`) doesn't read this file. The order is proven by the
> commit and the push, and by the rule that count.py hasn't run yet.

---

## Part 3: The count decides (~15 min)

```bash
docker compose --progress quiet run --rm --entrypoint python3 check builds/003-chatt-registry/count.py
```

Two harmless "No services to build" warnings print first; run `clear` after the prompt if they bother you. Go top to bottom:

1. **The `sha256` line.** It must say "= the July 2026 snapshot". That's the proof that everyone is counting the same file, and that the numbers will still be the same next week.
2. **Total, typed, untyped.** Read the five typed buckets, then the split of the untyped into `building=yes` and values the table doesn't know.
3. **Could be typed from tags already in the file.** Read the three lines (any of the eight tags, with a use tag, name only) and the by-tag rows. Say what the tool does *not* do: it counts buildings that carry a tag a mapper could read the type from; it doesn't assign the bucket.
4. **Fill in the table:**

| Claim | AI said | count.py says | Verdict |
|---|---|---|---|
| A: untyped buildings the data could already type | | | |
| B: the three cells with the most untyped | | | hits ___ of 3, ___ in the top 10 |

5. **The top 10 cells.** Read the `tag-typable` column last. The Facts section says what it shows; let chat react first.
6. **The route.** This is the payoff: read the order, the legs and the total, then say plainly that it's straight lines between cell centres, not streets.

> The tool is plain code you can read: `builds/003-chatt-registry/count.py` copies the rule from
> `buildings.ts`, and a test fails if either one changes without the other.

---

## Part 4: The map (~10 min)

The "virtual build" this time is the city itself.

1. Back in `/chatt`, type chip on. Fly to the top cell's centre (35.03391, -85.29920). Work out in rehearsal how you'll steer there; this sheet doesn't assume a go-to-coordinates box.
2. Look at the grey. Say what you see in your own words; don't claim a neighbourhood name that you haven't confirmed on the map.
3. Open one grey building on openstreetmap.org, **logged out**: https://www.openstreetmap.org/way/78344228 sits in that cell (checked 2026-10-11: it carries `building=yes` and `source=USGS Ortho`, and hasn't been edited since 2010). The file's id for this building is its OpenStreetMap way id. Show how little the page says.
4. Do not edit OpenStreetMap on stream, and don't sign in.

---

## Part 5: The physical side (~12 min)

**This is the plan for a later stream. Don't promise the walk live, and don't set a date on air.**

1. Put the top cell's numbers on screen (92 untyped of 108 buildings, and none of the 92 carries a name or use tag, so a desk pass can't type them).
2. Describe the walk: one 250 m square, street by street, house number order (the Registry plan's walk-order idea, MC-3). Per building, record only what's visible from the street: the real type, the house number, a name if it's signed.
3. Proposal (confirm before the show): collect no owner or contact details on this walk, even though the Registry plan's CSV (MC-4) has owner columns. Those are for a different, consented outreach.
4. Show the route as the order of the next cells: after the first square, the walk continues to the next two, a few hundred metres on. The far cell at the end of the route is a drive, not a walk.
5. Any OpenStreetMap edit comes from what someone saw on the ground, not from imagery or from the AI's guess.

---

## Close (~3 min)

> What we learned: what the claims got right and wrong, what share of the grey the data could already
> fix, and that the greyest square is not a hot spot but the first stop on a long list. What gets done
> next: the walk, on a later stream. Next episode's question: CWBI 004, "Can a phone replace the tape
> measure?" (Tue 10/20, 6 PM).
>
> The counts use the July 2026 snapshot so they stay stable on screen. OpenStreetMap changes every day,
> so a live pull would give new numbers; that's a possible future episode.
>
> The sheet, the script and the committed claims: the `builds/003-chatt-registry` folder of
> can-we-build-it in the TurtleWolfe repo on GitHub.

---

## On-screen moments (cue sheet)

| When | On screen | Why it lands |
|---|---|---|
| Cold open | `/chatt` full city, type chip on | One look shows how much of the map is grey |
| Part 1 | `typeBucket()` on GitHub, then one record | The rule is three lines; the data is plain JSON |
| Part 2 | `briefing.md` and its `sha256sum` | The AI is told the question and nothing else |
| Part 2 | The AI's JSON, then `git log -1` after the push | The claims, in the open, before any counting |
| Part 3 | The `sha256 ... July 2026 snapshot` line | Everyone is counting the same file |
| Part 3 | The could-be-typed block and the by-tag rows | The AI's number meets the count |
| Part 3 | The filled-in table | The verdict, row by row |
| Part 3 | The top-10 table, then the route line | Out comes a canvassing route |
| Part 4 | The camera flying to the top cell | The abstract cell becomes real streets |
| Part 4 | One OpenStreetMap way, logged out | What "untyped" looks like to a mapper |
| Part 5 | The plan for the walk | A promise to the future, not to tonight |

---

## Before you go live

Do these the day before, in this order:

1. **Prove the numbers.** From `~/repos/TurtleWolfe/stream/can-we-build-it`, run the suite with ScriptHammer mounted, so the copy of the typing rule is compared to `buildings.ts` and the live data file to the snapshot: `docker compose run --rm -v "$HOME/repos/ScriptHammer:/scripthammer:ro" -e SCRIPTHAMMER_DIR=/scripthammer test`. Everything must pass with nothing skipped. A failure means ScriptHammer changed: fix `count.py`, then the numbers below, before anything else.
2. **Prove `/chatt` on the stream machine.** It needs WebGL there. Open it, switch to the type chip, and fly to the top cell. The 2026-10-03 check (all 13,877 buildings drawn, no page errors) used a headless browser, so it says nothing about this PC's GPU or browser. Take three screenshots (whole city, the top cell, one grey building) as the fallback.
3. **Write nothing into the AI's session but the briefing.** The AI session is fresh, in an empty folder, with no repo, file, web or code tools. Do a throwaway dry run of Part 2 with it and record the screen; those claims are not the live claims. If the live run stalls, cut to the recording.
4. **Pre-warm Docker.** `docker compose build test check`. Then run the Part 3 command once and confirm the `sha256` line says "= the July 2026 snapshot". Use the default compose project name (no `-p`): its network already exists, and a new name can fail on the address-pool limit.
5. **Check the screen.** The count.py output is about 105 characters wide: make sure the terminal font is big enough to read in OBS and still fits.
6. **Check the clock.** `recorded_at` comes from `date -u`; make sure the machine's time is right.
7. **Check git.** `git status` is clean in the can-we-build-it checkout on `main`, and `git push` works without a prompt.
8. **Make a clean browser profile** for the stream: no client tabs, no bookmarks bar, no saved logins.

**Never show on screen:**
- anything of chattanooga.digital: it is a client, so no tab, bookmark, history suggestion or search result
- `ls ~/repos`, `git worktree list`, or any file picker that lists the repo folders: the names are client names. Start in `can-we-build-it` and stay there
- ScriptHammer's `.env` files or any login, admin or Supabase page; any `.env` file anywhere
- the inbox or any Gmail search result (client mail lives there)
- `~/.claude/settings.json`, the private hooks folder, the plans and the memory folder (names throughout)
- this run sheet, until the claims are committed (it holds the answers)
- OpenStreetMap signed in; do not edit the map live

**If it goes wrong live:**
- `/chatt` is blank, black or slow (WebGL): don't reload in a loop. Say so, switch to the screenshots from step 2, and carry on; the counting never needed the page.
- Docker "address pools exhausted" (a new compose project name, or too many stale networks): use the default project name. If it still fails, remove unused ones: `docker network prune -f --filter label=com.docker.compose.project` (only networks with no containers go).
- The `sha256` line says "DIFFERS": you're counting a different file (a re-baked ScriptHammer copy, or a stray `CHATT_BUILDINGS`). Use the Part 3 Docker command, which reads the bundled July snapshot. The numbers in this sheet are only true for the snapshot.
- The AI's answer isn't the JSON asked for, or a cell label is outside the grid: that is NOT VERIFIABLE or a miss by the scoring rule. Ask once more on camera and show both answers. Never edit a committed claim.
- Someone pastes or reads a count to the AI before it has claimed: say so on air, and mark that claim "told, not claimed".
- Chat asks to fix a building in OpenStreetMap right now: it needs someone on the street, so that's the later stream. Say so.
- Don't add `?live` to the `/chatt` URL: it pulls OpenStreetMap live, so the numbers won't match anything here.

---

## Facts to get right on air

| Claim | Correct version |
|---|---|
| Twitch Affiliate | 4 hours streamed, on 4 different days, at least 3 average viewers on each of those days, 25+ followers |
| Sponsorships for Affiliates (from 2026-08-20) | Need Creator Sponsorship Certification first; brands still choose |
| Amazon disclosure | "As an Amazon Associate I earn from qualifying purchases." Said out loud when recommending out loud |
| The data | 13,877 building footprints in `buildings-wide.json`, from OpenStreetMap, baked in July 2026 (committed in ScriptHammer on 2026-07-19; the file on disk is dated 2026-07-23, so say "July" and not a day). The counts below use that snapshot |
| "Downtown" | The title is loose. The file covers the wide atlas box, 35.0078 to 35.076 N and -85.345 to -85.255 W: about 7.6 km by 8.2 km, well beyond the downtown core |
| Named buildings | 400 of 13,877 carry a `name`: 2.9%. That's why "name every building" can't be decided live |
| The untyped share | 10,743 of 13,877 are untyped: 77.4%. A code comment in `buildings.ts` says 72%; say 77% for this file |
| Typed, by bucket | 3,134 typed (22.6%): residential 2,717, commercial 160, ancillary 127, civic 83, industrial 47 |
| What untyped is made of | 10,704 are `building=yes`. 39 have a value the table doesn't map: storage_tank 18, construction 6, service 5, and ten others with one each (cafe, synagogue, chapel, religious, kindergarten, sports_centre, ship, carport, train_station, ruins) |
| Registry | A plan in ScriptHammer's `model-city-prd.md` (MC-2 completeness, MC-3 walk order, MC-4 CSV). Nothing is built yet: there is no registry page in the app as of 2026-10-11 |

**From count.py on 2026-10-11** (the answers to the AI's two claims; the same run is pinned in `tests/test_chatt_registry.py`):

| Claim | Number |
|---|---|
| A: untyped buildings carrying at least one of the eight tags | **323**, 3.0% of the untyped. 226 of them carry a use tag (amenity, shop, tourism, office, craft, leisure or healthcare); 97 carry only a name |
| A, by tag (a building can carry several, so rows overlap) | name 268, amenity 150, shop 26, tourism 39, office 3, craft 1, leisure 7, healthcare 8 |
| What "could be typed" means | The building carries a tag a mapper could read the type from. count.py doesn't assign the bucket, and a bare name still needs a human to read it |
| B: top 3 cells by untyped | **r20c18** (92 of 108 buildings; centre 35.03391, -85.29920), **r21c17** (81 of 84; 35.03166, -85.30194), **r22c17** (75 of 75; 35.02941, -85.30194). Together 248 untyped |
| B: next seven | r17c20 69, r31c13 68, r23c26 67, r23c27 66, r21c28 65, r12c29 64, r16c20 62 |
| It is not a hot spot | The top 10 cells hold 709 of the 10,743 untyped: 6.6%. The grey is everywhere; 792 cells hold buildings. Not one of the top 10 cells has a single building the data could type from tags |
| The grid | 250 m cells. Row 0 starts at latitude 35.080 and counts south; column 0 starts at longitude -85.350 and counts east. The corner is arbitrary, so another corner would move the cells a little; say so |
| The route | Nearest-neighbour walk from r20c18: r20c18, r21c17, r22c17, r17c20, r16c20, r23c26, r23c27, r21c28, r12c29, r31c13. Legs in metres: 354, 250, 1,458, 250, 2,305, 250, 559, 2,264, 6,210. **Total about 13,899 m (13.9 km)**, one-way, straight lines between cell centres, not streets |
| Reading the route | The first five stops take about 2.3 km. The last leg alone, 6.2 km to r31c13 in the far south-west, is nearly half the total. Nearest-neighbour is a quick heuristic, not the shortest tour |
| A sample grey building | OpenStreetMap way 78344228, in r20c18: `building=yes`, `source=USGS Ortho`, version 1, last edited 2010-09-20 |
| Live data | A live OpenStreetMap pull would give different numbers (mappers edit daily). That's a possible future episode, not this one |

## Sources

| What | URL or path |
|---|---|
| The building data (13,877 footprints) | https://github.com/TortoiseWolfe/ScriptHammer/blob/main/public/twins/chatt/buildings-wide.json |
| The typing rule: `TYPE_BUCKETS`, `typeBucket()` | https://github.com/TortoiseWolfe/ScriptHammer/blob/main/src/twin/cesium/buildings.ts |
| The Registry plan (MC-2 to MC-4) | https://github.com/TortoiseWolfe/ScriptHammer/blob/main/model-city-prd.md |
| The atlas page | https://tortoisewolfe.github.io/ScriptHammer/chatt/ |
| The count, the prompt and the pinned snapshot | `builds/003-chatt-registry/` here: `count.py`, `briefing.md`, `buildings-wide.2026-07.json.gz` |
| The test that pins them | `tests/test_chatt_registry.py` here |
| OpenStreetMap data licence | https://www.openstreetmap.org/copyright |
| The sample building | https://www.openstreetmap.org/way/78344228 |
