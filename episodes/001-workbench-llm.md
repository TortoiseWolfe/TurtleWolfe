# Can We Actually Build It? Episode 001: Can this PC run its own coding model?

**Channel:** TurtleWolfe on Twitch
**Format:** Live build + checker verdict (~60–75 min)
**Real-world stakes:** Whether to buy a GPU upgrade, and which one
**Repo:** can-we-build-it · build `builds/workbench-llm/`

---

## Cold Open (~2 min)

> Local AI coding models are supposed to be free. The ones worth using need about 23 GB of graphics
> memory. This PC has 8, and Windows takes 1.2 of those just to draw the desktop. Can we fix that?
>
> The rule on this show: the AI makes its claims first, on screen, committed to git. Then a checker
> that doesn't care how confident anyone sounds decides whether the build actually works.

---

## Disclosures (~30 s). Say these out loud if you'll recommend products on air

> Some links in chat and on the page are Amazon links. As an Amazon Associate I earn from qualifying purchases.

- Never read an Amazon price on air. Say "current price at the link".
- No giveaways tied to buying through a link. Don't tell chat to bookmark links.

---

## Part 1: The requirement (~5 min)

Show the number that makes this a real question, live:

```bash
nvidia-smi
```

> Ollama asks for at least 64,000 tokens of context for coding agents; GLM-4.7-Flash needs about
> 23 GB of VRAM at that size. This card has 8 GB, and the desktop holds 1,187 MiB of it because the
> i7-12700KF has no integrated graphics.

---

## Part 2: The AI's spec, committed before anything is checked (~10 min)

1. Give the AI the requirement and the parts bin. Record the prompt's SHA-256.
2. Write its claims into `builds/workbench-llm/claims/<date>-<model>.json`, one `{rule_id, claimed_verdict, quote}` per claim, with `recorded_at` set to now.
3. Commit on screen:
   ```bash
   git add builds/workbench-llm/claims && git commit -m "claims: <model> before the checker runs"
   ```

> The checker will refuse a claims file recorded after it runs, so we can't fudge this.

---

## Part 3: The checker's verdict (~10 min)

```bash
docker compose run --rm check check builds/workbench-llm/build.json --claims builds/workbench-llm/claims/<file>.json
```

- Go row by row. PASS, FAIL, or NOT VERIFIABLE; the last means "we don't have that number yet".
- Read the "AI said vs checker says" table. Count the WRONG rows out loud.
- **Planted fault:** reveal what was hidden in `build.json → planted_fault` and whether the AI caught it.

---

## Part 4: The virtual build (~5 min)

Show `output/workbench-llm/render.png`: boxes and clearance envelopes, coloured grey where a size is still unverified.

---

## Part 5: The physical side (~15 min)

Measure on camera whatever the checker couldn't verify. Case clearance: rear slot bracket to the nearest front obstruction; board tray to side panel; PSU bay length. Fill the TODOs, re-run the checker.

---

## Close (~2 min)

> What we learned. What gets built or bought. Next episode's question.
>
> Full build, verdict and render: turtlewolfe.com/builds/workbench-llm

---

## Facts to get right on air

| Claim | Correct version |
|---|---|
| Twitch Affiliate | 4 hours streamed, on 4 different days, at least 3 average viewers on each of those days, 25+ followers |
| Sponsorships for Affiliates (from 2026-08-20) | Need Creator Sponsorship Certification first; brands still choose |
| Amazon disclosure | "As an Amazon Associate I earn from qualifying purchases." Said out loud when recommending out loud |

## Sources

| What | URL |
|---|---|
| GLM-4.7-Flash VRAM at 64k context | https://ollama.com/library/glm-4.7-flash/tags |
| Ollama context guidance | https://docs.ollama.com/context-length |
