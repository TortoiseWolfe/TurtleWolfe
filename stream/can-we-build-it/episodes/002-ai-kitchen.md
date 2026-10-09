# Can We Actually Build It? Episode 002: Can my $200 AI plan run a kitchen?

**Channel:** TurtleWolfe on Twitch (main). Some segments are cut for the co-host bot's channel, see "Which channel" below.
**Format:** Live director run + two checkers scoring side by side + one planted fault (~60-75 min)
**Real-world stakes:** Whether the tiered setup becomes the default for batch work, and whether the cheap Jev check gets promoted from "watches only" to a real gate that can skip the Opus review
**Repo:** can-we-build-it (these notes) · demo repo: TODO, pick before going live (see "Before you go live")
**Public companion:** https://tortoisewolfe.github.io/AI_Workflow/05-advanced-orchestration/setup-tutorial.html (draft, not landed yet when this was written)

---

## Cold Open (~2 min)

> One AI plan, one weekly allowance shared across every model. The expensive model costs several times
> the cheap one for every turn, and a single fat day last week burned about $49 of API-equivalent.
> Can that plan run a whole kitchen: one head chef that plans and tastes, a line of cheap cooks that
> do the chopping, and code that says whether anything is actually cooked?
>
> The rule on this show: the AI makes its claims first, on screen. Then something that doesn't care
> how confident anyone sounds decides. Tonight the deciders are the repo's own tests, a blind Opus
> reviewer, and a one-hundredth-of-a-cent yes/no model called Jev.

---

## Disclosures (~30 s). Say these out loud only if you recommend products on air

> Some links in chat and on the page are Amazon links. As an Amazon Associate I earn from qualifying purchases.

- This episode recommends no hardware. If you mention a part anyway, say the line above, never read a price, no giveaways tied to links.
- Say plainly that Jev (TypeSafe) and Muse (Meta) are other companies' products and that nobody is sponsoring this.

---

## Part 1: The requirement (~5 min)

Show the number that makes this a real question, live:

```bash
nvidia-smi
```

> Last episode's card: 8 GB, about 1.2 GB held by the desktop. A coding agent wants 64,000 tokens of
> context and 19-23 GB. So the free local-model route is closed, and the only kitchen on offer is the
> one the plan already pays for: Opus, Sonnet and Haiku.

Then show the plan's usage page (`/usage`) BEFORE anything runs and leave a screenshot up. Say the
caveat out loud: the 41% saving below is priced from API ratios (Opus : Sonnet : Haiku = 4 : 2 : 1);
the plan's own weighting isn't published, so the before/after on this screen is the real measure.

---

## Part 2: The head chef's claims, committed before anything is cooked (~8 min)

1. State the goal for the batch (3 well-specified, mostly mechanical changes in the demo repo).
2. Run the director. Its first phase is the Plan: Opus, read-only, writes one item per change:
   `{tier, files[], check, accept_cmd, acceptance[], jev_checks[]}`.
3. Before any worker starts, put the plan on screen and save it: that is this show's "claims first".
   Read three things aloud for each item: which cook (haiku or sonnet), which files it may touch, and the
   `jev_checks` (narrow yes/no questions that quote the exact code the finished change must contain).
4. Show what Opus kept for itself (`opus_keep`) and why. A good plan says "this one needs taste, not a cook".

> The baseline then proves the thermometer before anyone cooks: every regression check must already be
> green on a clean copy of main, and every "is it done?" test must be red. A test that already passes
> proves nothing, and the director throws that item out.

Cue: `git worktree list` after the Baseline phase, to show the detached base worktree.

---

## Part 3: The line cooks (~12 min)

Run phase by phase, narrating while it works:

```bash
git worktree list            # one station per item: <repo>-wf-<id>, branch wf/<id>
docker network ls            # name the compose project (-p): no stray <dir>_default networks
```

- Per item: Haiku (mechanical) or Sonnet (a small build) works in its own worktree and commits.
- A separate Haiku "shell proxy" runs the checks and relays sentinel lines (`__RC_CHECK=0__`,
  `__HEAD=<sha>__`, `__FILE=<path>__`). Plain JavaScript parses them. The cook's own "I tested it" is ignored.
- If a plate fails: one retry at the same tier, then Haiku escalates to Sonnet, then it's capped.
- Count out loud: first-pass checks, escalations, capped items.

> Nobody is served on a cook's say-so. The thermometer is plain code.

---

## Part 4: Jev scores alongside Opus (~10 min)

During each item's check, the Jev pre-screen prints one score per narrow question and a minimum:
`__JEV_Q0=0.99__ ... __JEV_MIN=0.98__`. Opus's blind review is still the real verdict; Jev is only recorded next to it.

1. Show the questions the planner wrote, then the scores. Chat guesses first: will Jev agree with Opus?
2. Show the run report's `metrics.jevShadow` (`scored`, `agreedWithOpus`).
3. Live side experiment (each call is about $0.0001): ask Jev the same planted-wrong-value diff three ways.

| Question style | Right code | Planted fault |
|---|---|---|
| "Does this meet every acceptance criterion?" (whole dish) | 0.72 | 0.70 |
| A worded check | 0.98 | 0.69 |
| "Is X written as `<exact code text>`?" | 0.99 | 0.03 |

> Jev compares text, it doesn't do arithmetic. Ask about a line you can quote and it is sharp; ask about
> the whole dish and it shrugs. That's why the planner has to write quotable questions.

Honest framing to say on air: on 2026-09-30, two director runs with 3 items each went 6 of 6 ready, Opus
passed all six on the first look, and Jev agreed 6 of 6 (lowest scores 0.98-0.99). All six items were good,
so that shows Jev raised no false alarm; it does not prove it catches faults in real work. Jev can also
be nudged by text injected into a diff, so it stays a shadow until several runs agree.

---

## Part 5: The planted fault and the blind review (~10 min)

Before the stream, plant one fault off-air in a cook's output: a wrong value in the code AND the test
edited to agree, so the whole suite still passes. Commit a SHA-256 of the fault's description beforehand so
chat can see it was fixed before the review.

1. Chat predicts: will the blind reviewer catch it? Poll.
2. Show that the checker is green: suite passes, acceptance passes. Nothing in the tests objects.
3. Run the blind Opus review (`reviewer-senior`: spec + `git diff BASE..HEAD`, no author reasoning).
4. Reveal the planted fault and whether the reviewer flagged the value AND the test edited to protect it.

> Tests are only as honest as whoever last edited them. The reviewer's job is the thing the tests can't see.

Reference result to quote only if asked: in the first pilot, a 5/8" plywood entry set to 9/16" (spec says
19/32") with its test changed to match passed the suite, and the blind reviewer returned "revise".

---

## Part 6: It broke on stream, the WSL freeze (~7 min)

Tell this from evidence. Do NOT recreate it live: the only way out of the loop was a full reboot.

- The setup: a second WSL distro (OpenClaw's gateway) boots with systemd. Its `systemd-binfmt` service
  flushes every binfmt entry on start and unregisters on stop. WSL distros share one kernel, so Windows
  programs stopped launching from Linux for everyone ("exec format error"), and Docker's entries went too.
- The fix for that, one line: `systemctl mask systemd-binfmt.service` inside that distro.
- The part that froze the terminals: restarting that distro by hand while its tray app was running. The tray
  kept rebooting it every few seconds; WSL powered it off ~28 s after each boot; it looped 53 times in about
  half an hour, Docker Desktop's proxy broke, terminals froze, reboot needed.
- Show the evidence: the gateway journal's "The system will power off now!" about every 32 s, and the tray
  log's "Server closed connection: 1012" in pairs.
- The structural fix: `instanceIdleTimeout=-1` under `[general]` in `.wslconfig` (side effect: distros never
  idle out). If asked how to restart that distro safely: quit the tray first, terminate, relaunch the tray.

> The lesson for a kitchen: the day's worst outage came from the helper's helper, not the AI.

---

## Part 7: The verdict and the numbers (~8 min)

Show `/usage` again and compare with the Part 1 screenshot, then read the scorecard:

| Result | Number | Say it this way |
|---|---|---|
| Pilot, 5 items | 4 of 5 right first time; 1 capped (README described a file another item was changing) | "The one that failed taught the planner to merge coupled items." |
| Pilot cost | $4.74 vs $8.03 if all Opus, about 41% cheaper | "API-equivalent, not plan quota." |
| Jev shadow, 2026-09-30 | 6 of 6 ready, Opus first-round pass 6 of 6, Jev agreed 6 of 6 | "Small sample; no false alarms yet." |
| Cost of one Jev check | about $0.0001 | |
| Tonight's run | fill in live: ready / capped / escalations / jevShadow / `/usage` delta | |

> So, can a $200 plan run a kitchen? For a batch of well-specified, mostly mechanical changes: yes, and
> cheaper. For anything that needs taste or client input: the head chef keeps it, and that's by design.

---

## Part 8 (optional, cut first): the front-of-house helpers (~5 min)

- Windows toast: when the run ends, ring the bell with `openclaw_tray.py notify "<title>" "<body>"`.
  It needs no model and no approval. Say honestly that the OpenClaw agent itself has no model connected yet.
- Notes between assistants: show ONLY a clean, rehearsed `[CC>MUSE]` draft. Never open the inbox.
- Say that Claude can draft but cannot send, and that the Windows helper asks before every command.

---

## Close (~2 min)

> What we learned. Whether Jev earns a promotion. Next episode's question.
>
> Setup, step by step: the AI_Workflow setup-tutorial page (link in chat once it's live).

---

## On-screen moments (cue sheet)

| When | On screen | Why it lands |
|---|---|---|
| Part 1 | `nvidia-smi`, then `/usage` screenshot (before) | The number, and the baseline to beat |
| Part 2 | The Plan's items, `opus_keep`, then `git worktree list` | The claims, in the open, before anyone cooks |
| Part 3 | Worktrees appearing; sentinel lines scrolling past | The kitchen visibly working |
| Part 3 | A capped or escalated item (if one happens) | Failure shown, not hidden |
| Part 4 | `__JEV_Q0=..__` lines beside Opus's verdict | Two checkers, one plate |
| Part 4 | The three-question table, live | Wording is the whole trick |
| Part 5 | Chat poll, green suite, then "revise" | The reveal |
| Part 6 | Gateway journal and the 53-loop count | The "it broke on stream" story |
| Part 7 | `/usage` after, scorecard filled in live | The verdict |
| Part 8 | Windows toast on the desktop | Fun, and proves the helper is real |

---

## Which channel

| Segment | Main channel | Co-host bot's channel | Notes |
|---|---|---|---|
| Cold open, requirement, verdict | Yes | Short version only | The $200-plan question is the hook |
| Director run (Parts 2-3) | Yes, the centrepiece | No | Long, needs the screen and the repo |
| Jev vs Opus scoring (Part 4) | Yes | Yes, as a game | Bot guesses a score before Jev reveals it; the bot is another vendor's agent, so the rivalry writes itself |
| Planted fault, blind review (Part 5) | Yes | Yes, as a prediction | A "will the reviewer catch it?" poll suits a chat-bot audience |
| WSL freeze story (Part 6) | Yes | Short cut | The bot's own gateway distro is part of the story: say so on air |
| Windows toast (Part 8) | Optional | Yes | The tray notification is the bot's own family of tooling |
| Notes between assistants (Part 8) | Optional | Yes, if rehearsed | Two assistants passing notes is a good bit |

The co-host bot is an older OpenClaw agent that runs its own Twitch channel on the local network and
used to co-host. The plan is to connect it over the LAN; the scope is TBD and nothing is built. Treat every
bot-channel idea above as a proposal. Open questions to settle first: how the bot's channel is addressed
from the main stream (raid, shared screen, or separate stream), and whether the bot's output is moderated
for client names.

---

## Before you go live

Do these the day before, in this order:

1. Pick the demo repo and write its `.claude/director.json` (checks named `CHECK_<THING>`, every `docker compose` with `-p <name>-wf`). Prove each check green on a clean base. None of this exists yet for the show.
2. Pre-warm the Docker image. A cold image build in one of the repos took about 8 minutes: too long to watch live.
3. Do one full dry run with a throwaway goal. Record it. If the live run stalls, cut to the recording.
4. Check `/usage` for weekly headroom: a live run spends real plan quota.
5. Plant the Part 5 fault off-air and commit its SHA-256.
6. Check that a full WSL restart has happened since `instanceIdleTimeout=-1` was written; the guard only applies after one.
7. Confirm `docker network ls` is clean and the gateway distro's `systemd-binfmt` is still masked.

**Never show on screen:**
- the inbox or any Gmail search result (client mail lives there)
- `~/.claude/settings.json` and the private hooks folder (hook names refer to clients)
- the to-do/plans files and the memory folder (names throughout)
- `~/.config/typesafe/api-key`, the OpenClaw token file and its gateway config
- any `.env` file

**If it goes wrong live:**
- Docker "address pools exhausted": `docker network prune -f --filter label=com.docker.compose.project`
- Windows programs fail from Linux ("exec format error"): check the binfmt mask first; do not terminate the gateway distro with the tray running
- A new helper file isn't found: the director falls back to general-purpose with an explicit model; say so
- Sentinel relayed without its closing underscores: the regex tolerates it; show it as a feature

---

## Facts to get right on air

| Claim | Correct version |
|---|---|
| Twitch Affiliate | 4 hours streamed, on 4 different days, at least 3 average viewers on each of those days, 25+ followers |
| Sponsorships for Affiliates (from 2026-08-20) | Need Creator Sponsorship Certification first; brands still choose |
| Amazon disclosure | "As an Amazon Associate I earn from qualifying purchases." Said out loud when recommending out loud |
| Model price ratio | Opus : Sonnet : Haiku is about 4 : 2 : 1 per token at API prices. The plan's own weighting isn't published |
| "41% cheaper" | API-equivalent on one pilot, not a measurement of plan quota |
| Anthropic's limit increase (SpaceX deal, 2026-05-06) | Doubled the five-hour window only. Weekly caps were not raised |
| Routing Claude Code to non-Claude models | Anthropic doesn't support routing Claude Code to non-Claude models through any gateway |
| Jev | TypeSafe's decision-only model; compares text, no arithmetic; can be nudged by injected text, so never the only gate |
| Muse | Meta's cloud personal agent (launched 2026-09-08). Connector data can train Meta's AI, so no client details in notes |
| OpenClaw | The tray app's own agent has no model connected yet; what runs today needs none (notify, approved short commands) |

## Sources

| What | URL |
|---|---|
| The setup, step by step (public draft) | https://tortoisewolfe.github.io/AI_Workflow/05-advanced-orchestration/setup-tutorial.html |
| The picture of the whole setup | https://tortoisewolfe.github.io/AI_Workflow/05-advanced-orchestration/ai-kitchen-map.html |
| Why it is tiered, and the first pilot | https://tortoisewolfe.github.io/AI_Workflow/05-advanced-orchestration/head-chef-line-cooks.html |
| Anthropic limits (SpaceX deal) | https://www.anthropic.com/news/higher-limits-spacex |
| Claude Code and non-Claude models | https://code.claude.com/docs/en/llm-gateway |
| Ollama context guidance | https://docs.ollama.com/context-length |
