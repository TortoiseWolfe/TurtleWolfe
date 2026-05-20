# Implementation Checklist: Portfolio Visual Overhaul

**Purpose:** Unit tests for the _requirements writing_ (spec.md, plan.md, research.md, and the signed-off wireframe issues file). Validates that requirements are complete, clear, consistent, measurable, and well-scoped BEFORE `/speckit.tasks` and `/speckit.implement` run. Does NOT validate the implementation itself.
**Created:** 2026-05-17
**Feature:** 047 — Portfolio Visual Overhaul
**Spec:** [spec.md](../spec.md) · **Plan:** [plan.md](../plan.md) · **Research:** [research.md](../research.md) · **Wireframe:** [06-nostromo-crt.svg](../wireframes/06-nostromo-crt.svg) · **Issues:** [06-nostromo-crt.issues.md](../../../../docs/design/wireframes/047-portfolio-visual-overhaul/06-nostromo-crt.issues.md)
**Focus:** UX / visual completeness · Accessibility & reduced-motion · Performance / NFR · Scope & boundary
**Depth:** Comprehensive multi-dimensional (release-gate rigor)
**Audience:** Author + reviewer (co-authored validation)

---

## Requirement Completeness

- [ ] CHK001 — Are the visual treatments for every section of the home page (hero, Featured Projects, More Work, Stats+Demos, Services, Certifications, Community, CTA, Footer) explicitly specified, or is "inner sections inherit the new theme tokens" the only guidance? [Completeness, Spec §FR-013]
- [ ] CHK002 — Are requirements defined for what happens to the existing `LayeredTurtleWolfeLogo` + `AnimatedLogo` brand marks in the CRT aesthetic — kept, restyled, or replaced? [Completeness, Spec §Assumptions, Issues §Brand mark]
- [ ] CHK003 — Are requirements specified for the Footer's content in the new aesthetic (decorative ASCII mark, "designed and built by Jonathan" credit, copyright year)? [Completeness, Spec §FR-007 implied + Issues §Hero composition]
- [ ] CHK004 — Are requirements documented for the GlobalNav's behavior across all 35 themes (not just CRT), or is the scroll-shrink + backdrop-blur only specified for CRT? [Completeness, Spec §FR-007, Spec §FR-010]
- [ ] CHK005 — Are the boot sequence's five lines specified verbatim (exact characters, ordering, terminal arrow)? [Completeness, Spec §Resolved decision 4]
- [ ] CHK006 — Is the manifest content (all tech-stack labels and ordering) specified verbatim? [Completeness, Spec §FR-008 + Issues §Hero composition]
- [ ] CHK007 — Are the ASCII diagrams for each project card specified at the character level, or only described in prose (e.g. "ASCII route map with nodes and edges")? [Completeness, Spec §UI Mockup + Issues §Project cards]
- [ ] CHK008 — Are requirements defined for the CTA button labels (`> ./contact.sh` and `> ./resume.pdf`) — is the literal terminal-command styling required, or are alternative phrasings acceptable? [Completeness, Spec §UI Mockup]
- [ ] CHK009 — Are requirements defined for the status bar's content beyond `MU/TH/UR 6000 :: PORT 3000 :: <timestamp>` — does the timestamp update live, frozen at page-load time, or render statically? [Completeness, Spec §UI Mockup]
- [ ] CHK010 — Are requirements defined for the page when JavaScript is disabled (boot sequence, manifest retype, scroll reveals, cursor halo, magnetic hover all rely on JS)? [Completeness, Spec §Edge Cases]
- [ ] CHK011 — Are requirements documented for the cursor halo's appearance, size, and behavior on different pointer types (fine vs coarse)? [Completeness, Spec §FR-009 + Issues §Motion]
- [ ] CHK012 — Are requirements specified for the scroll-shrink trigger threshold (e.g. "after hero leaves viewport" — is that 100% of hero, 50%, a fixed pixel value)? [Completeness, Spec §FR-007]
- [ ] CHK013 — Are requirements defined for the magnetic hover effect's strength (pixel offset, easing) and disable conditions beyond coarse pointer? [Completeness, Spec §FR-006]
- [ ] CHK014 — Are requirements defined for the scroll-reveal "screen wipe" clip-path animation (duration, easing, direction)? [Completeness, Spec §FR-005, Issues §Motion]
- [ ] CHK015 — Is the SEO meta description requirement specified for the rebuilt home page, or does it inherit from the existing meta unchanged? [Completeness, Gap]
- [ ] CHK016 — Are requirements specified for the OG image / social preview when the aesthetic changes (current OG image references previous visual treatment)? [Completeness, Gap]
- [ ] CHK017 — Are requirements documented for the "scroll for full project grid →" mobile hint shown in the wireframe? [Completeness, Spec §UI Mockup mobile]

## Requirement Clarity

- [ ] CHK018 — Is "phosphor bloom on text (CSS `text-shadow` with low blur, phosphor green at low opacity)" quantified with specific blur radius, opacity value, and offset? [Clarity, Spec §UI Mockup + Issues §Background]
- [ ] CHK019 — Is the scanline pattern's drift speed ("~30s per cycle") quantified as exact CSS animation duration or range? [Clarity, Spec §UI Mockup motion]
- [ ] CHK020 — Is the manifest refresh interval ("~12s") quantified with tolerance (e.g. ±2s acceptable) or required to be exact? [Clarity, Spec §Resolved decision 5]
- [ ] CHK021 — Is the boot sequence duration ("~700ms total") quantified with per-character timing (e.g. 30ms per char + 60ms inter-line pause) or only as a total? [Clarity, Spec §Resolved decision 4 + Research §R2]
- [ ] CHK022 — Is the block cursor's blink rate ("1Hz") specified as 500ms on / 500ms off, or 200ms on / 800ms off, or any other split? [Clarity, Spec §UI Mockup motion]
- [ ] CHK023 — Is "the design half visually emphasized" in the tagline quantified with specific weight, color, or size ratios versus the developer half? [Clarity, Spec §FR-001, Issues §Hero composition]
- [ ] CHK024 — Is the "screen wipe" clip-path animation defined with specific path coordinates / shape (rectangle, polygon) or only described prosaically? [Clarity, Spec §FR-005]
- [ ] CHK025 — Is "phosphor green" pinned to a single hex (`#4ade80` per issues file) or are #51cf66 and others acceptable alternatives? [Clarity, Spec §UI Mockup + Issues §Palette]
- [ ] CHK026 — Is "italic-leaning serif" for the project card titles required to be Instrument Serif (matching the hero), or may it be a different serif? [Clarity, Spec §Resolved decision 1 + Issues §Project cards]
- [ ] CHK027 — Is the "CRT bezel surround" specified with concrete dimensions, materials/colors, and corner-radius, or only as "chunky"? [Clarity, Spec §UI Mockup + Issues §Background]
- [ ] CHK028 — Is the "soft halftone or microfilm pattern" specified as a concrete CSS/SVG pattern with parameters, or just named? [Clarity, Gap, conflicts with Issues which says "scanlines, NOT halftone"]
- [ ] CHK029 — Is "near-black" pinned to `#050907` consistently, or are `#000`, `#0b0f1f`, and `#080b18` all acceptable in different contexts? [Clarity, Spec §UI Mockup vs. wireframe inline colors]
- [ ] CHK030 — Is "humanizing contrast against the mono" defined with measurable typography metrics (e.g. minimum X-height ratio, ascender difference), or only by example? [Clarity, Spec §UI Mockup + Issues §Typography]
- [ ] CHK031 — Is the cursor halo's diameter/radius specified, or only described as "halo"? [Clarity, Spec §FR-009 + Issues §Motion]

## Requirement Consistency

- [ ] CHK032 — Do the typography requirements for the hero name in spec §UI Mockup match the typography requirements in the issues file (both specify Instrument Serif italic) and the research file (R8)? [Consistency, Spec / Issues / Research]
- [ ] CHK033 — Does the spec's "boot sequence types in over ~700ms" align with research §R2's "~30ms per char + 60ms inter-line pause" math (5 lines × ~22 chars avg × 30ms + 4 × 60ms = ~3.5s, NOT 700ms)? [Conflict, Spec §Resolved 4 vs Research §R2]
- [ ] CHK034 — Do the prefers-reduced-motion suppression lists in spec §FR-009 and research §R6 enumerate the same set of motions? [Consistency, Spec §FR-009 vs Research §R6]
- [ ] CHK035 — Does the spec's "Geist Sans/Mono replaced" align with plan.md's removal of Geist from `layout.tsx:25-56`? [Consistency, Spec §Resolved 2 vs Plan §Technical Context]
- [ ] CHK036 — Is the new component count consistent across spec (implicit), plan (~9 new components named), and research (no count)? [Consistency, Plan §Project Structure]
- [ ] CHK037 — Does plan.md's claim that `data-model.md` is N/A align with spec.md's §Key Entities listing "Project Card", "Theme Token Set", "Aesthetic Direction"? [Conflict, Plan §Phase 1 vs Spec §Key Entities]
- [ ] CHK038 — Does the spec's "all 35 DaisyUI themes remain selectable" align with research §R4's "36-theme limit not hit" — is the new total 35 (replacing one) or 36 (adding one)? [Conflict, Spec §FR-010 vs Research §R4]
- [ ] CHK039 — Is the wireframe's "no bottom nav on mobile" callout consistent with plan.md leaving GlobalNav untouched (the only nav)? [Consistency, Wireframe §callout 7 vs Plan]
- [ ] CHK040 — Does the spec's "Featured Projects (with case studies)" section preservation align with the wireframe showing only 3 cards (no "More Work" 8-card grid)? [Consistency, Spec §FR-013 vs Wireframe]

## Acceptance Criteria Quality (Measurability)

- [ ] CHK041 — Is SC-001 ("five design professionals … three answer with 'designer'") feasible to verify pre-launch, or does it require post-launch user testing? [Measurability, Spec §SC-001]
- [ ] CHK042 — Are the LCP/CLS/TBT thresholds (SC-002/003/004) tied to a specific verification environment (Lighthouse mobile preset, slow-4G throttling, median of N runs)? [Measurability, Spec §SC-002–004]
- [ ] CHK043 — Is "zero new WCAG AA failures … compared to the pre-overhaul baseline" (SC-005) measurable — does the baseline exist, and is the diff process specified? [Measurability, Spec §SC-005]
- [ ] CHK044 — Is "Playwright end-to-end smoke tests pass" (SC-006) tied to a specific test file / test name list? [Measurability, Spec §SC-006]
- [ ] CHK045 — Is "no motion … no canvas/SVG decorative animation, and no marquee scrolling occurs" (SC-007) verifiable via automated Playwright check or manual only? [Measurability, Spec §SC-007]
- [ ] CHK046 — Is SC-009's "regression screenshot diff … covers all callouts" objectively scored, or is it judgment-based? [Measurability, Spec §SC-009]
- [ ] CHK047 — Is SC-010's "5-file pattern, validated by the existing CI/CD component-structure check" tied to a specific CI job name / script path? [Measurability, Spec §SC-010]

## Scenario Coverage

### Primary scenarios

- [ ] CHK048 — Are requirements defined for first-time visitor on a fresh browser (no localStorage)? [Coverage, Spec §US-001]
- [ ] CHK049 — Are requirements defined for returning visitor whose previous theme choice is preserved? [Coverage, Research §R9]
- [ ] CHK050 — Are requirements defined for the recruiter/art-director viewing on a 1440-wide laptop and a 390-wide phone (the specific viewports cited in SC-001)? [Coverage, Spec §SC-001]

### Alternate scenarios

- [ ] CHK051 — Are requirements defined for users who land on the page during the boot sequence's typing (vs. after it completes) — should clicks during typing skip to the end? [Coverage, Gap]
- [ ] CHK052 — Are requirements defined for users who scroll before the boot sequence completes? [Coverage, Gap]
- [ ] CHK053 — Are requirements defined for users who switch themes mid-page-load (during boot sequence) — what happens to the in-flight animation? [Coverage, Spec §Edge cases vs Boot sequence]
- [ ] CHK054 — Are requirements defined for users who toggle prefers-reduced-motion mid-session (between page load and scroll)? [Coverage, Spec §Edge cases]

### Exception / error scenarios

- [ ] CHK055 — Are requirements defined for font load failure (Instrument Serif or JetBrains Mono 404 from Google) — what fallback chain renders the page? [Coverage, Research §R8 mentions fallbacks but spec doesn't require them]
- [ ] CHK056 — Are requirements defined for motion library load failure (lazy import fails) — does the page still render functionally? [Coverage, Gap]
- [ ] CHK057 — Are requirements defined for a project image (e.g. `spoketo-work/map-view.png`) failing to load — does the card show a fallback or break? [Coverage, Spec §Edge cases mention this only indirectly]
- [ ] CHK058 — Are requirements defined for a malformed `localStorage.theme` value — does ThemeScript fall back gracefully or break? [Coverage, Spec §FR-010 implied]
- [ ] CHK059 — Are requirements defined for ASCII diagrams in screen readers that don't support `aria-hidden` properly (older AT)? [Coverage, Research §R7]

### Recovery scenarios

- [ ] CHK060 — Are requirements defined for restoring the previous (`turtlewolfe-dark` or earlier) home page if the overhaul fails in production (rollback strategy)? [Coverage, Gap]
- [ ] CHK061 — Are requirements defined for a partial deploy (e.g. fonts load but motion lib doesn't)? [Coverage, Gap]

### Non-functional

- [ ] CHK062 — Are requirements defined for the page's behavior on very-wide viewports (3440px+) — does the hero center, max-width, or fill? [Coverage, Spec §Edge cases]
- [ ] CHK063 — Are requirements defined for the page's behavior on very-narrow viewports (<320px), or is 320px the floor? [Coverage, Spec §FR-013, Edge cases]
- [ ] CHK064 — Are requirements defined for printing the page (print stylesheet)? [Coverage, Gap]
- [ ] CHK065 — Are requirements defined for the page's behavior in browsers that don't support CSS `clip-path` (used by scroll wipe)? [Coverage, Gap]

## Edge Case Coverage

- [ ] CHK066 — Are requirements defined for the visual when the user navigates back to the page (BFCache restore) — does the boot sequence replay? [Edge Case, Gap]
- [ ] CHK067 — Are requirements defined for the visual when a screen reader is in linear browse mode versus app mode? [Edge Case, Gap]
- [ ] CHK068 — Are requirements defined for the visual under Windows High Contrast Mode (overrides text/background)? [Edge Case, Gap]
- [ ] CHK069 — Are requirements defined for the manifest retype when the manifest's content is being read aloud by a screen reader? [Edge Case, Gap]
- [ ] CHK070 — Are requirements defined for the cursor halo behavior when the cursor leaves the viewport (does the halo follow off-screen)? [Edge Case, Gap]
- [ ] CHK071 — Are requirements defined for users who have JavaScript enabled but disabled CSS animations specifically (rare but possible)? [Edge Case, Gap]

## Non-Functional Requirements

### Performance

- [ ] CHK072 — Is the motion library's bundle-size budget specified (e.g. "≤ 35KB gz")? [Completeness, Research §R10 estimates 30KB but spec doesn't bound it]
- [ ] CHK073 — Is the font budget specified (e.g. "≤ 50KB total fonts")? [Completeness, Research §R10 estimates ~42KB but spec doesn't bound it]
- [ ] CHK074 — Are the LCP/CLS/TBT verification conditions specified (which device, network, Chrome version, Lighthouse preset)? [Clarity, Spec §SC-002–004]

### Accessibility

- [ ] CHK075 — Are keyboard navigation requirements specified (tab order, focus trapping, escape behavior)? [Completeness, Gap]
- [ ] CHK076 — Are screen-reader announcement requirements specified for the boot sequence (does it announce, or is it `aria-hidden`)? [Completeness, Gap]
- [ ] CHK077 — Are screen-reader announcement requirements specified for the manifest retype (live region, polite/assertive, or muted)? [Completeness, Gap]
- [ ] CHK078 — Are focus-ring color requirements specified for non-CRT themes (the issues file says "dashed phosphor green at 2px" — what color in `cupcake`?)? [Completeness, Spec §FR-011, Issues §Accessibility]
- [ ] CHK079 — Are color-blind palette requirements specified (the existing colorblind filter must still distinguish phosphor green from amber from red — is that verified)? [Completeness, Spec §FR-012, US-003]
- [ ] CHK080 — Is the `aria-label` content for ASCII diagrams specified verbatim, or only the pattern? [Completeness, Research §R7]
- [ ] CHK081 — Are touch-target dimensions specified for every interactive element, or only the existing 44px global rule? [Completeness, Spec §SC requires 44px]

### Reduced motion

- [ ] CHK082 — Are the "halt" behaviors specified for every motion (does scanline drift freeze in place, snap to start, or fade out)? [Completeness, Spec §FR-009]
- [ ] CHK083 — Is the JS-gate `useReducedMotion` hook contract specified (return value, SSR safety, change-event reactivity)? [Completeness, Research §R6 specifies this]
- [ ] CHK084 — Are requirements defined for the CSS gate's `!important` overrides (could they cascade-conflict with theme tokens)? [Completeness, Research §R6]

### Browser support

- [ ] CHK085 — Is the supported browser matrix specified (the plan says "latest 2 versions of Chrome/Edge/Firefox/Safari" but spec doesn't)? [Completeness, Plan §Technical Context vs Spec gap]
- [ ] CHK086 — Are requirements defined for browsers without backdrop-filter support (used by GlobalNav scroll-shrink)? [Completeness, Gap]

## Dependencies & Assumptions

- [ ] CHK087 — Is the assumption that `motion` v11+ is React 19 compatible validated, or only stated? [Assumption, Research §R1]
- [ ] CHK088 — Is the assumption that "the user is fine adding 2 Google Fonts" documented (privacy / GDPR — Google Fonts loaded via next/font is self-hosted, so no third-party request at runtime)? [Assumption, Research §R8]
- [ ] CHK089 — Is the assumption that "the 35-theme cap is not a hard DaisyUI limit" validated against DaisyUI 5 docs, or only stated? [Assumption, Research §R4]
- [ ] CHK090 — Is the assumption that the existing `ThemeScript.tsx` will accept a one-line default-theme change without other refactors documented? [Assumption, Research §R9]
- [ ] CHK091 — Are dependencies on the existing component generator (plopfile) specified — what happens if a new component category (e.g. organisms) is missing from the plop config? [Dependency, Plan §Project Structure]
- [ ] CHK092 — Are dependencies on the existing brand SVGs (`turtlewolfe-logo.svg`, `printing-mallet.svg`, `script-tags.svg`) specified — what if their dimensions or palettes change mid-feature? [Dependency, Spec §Out of scope]

## Ambiguities & Conflicts

- [ ] CHK093 — The spec says the existing `LayeredTurtleWolfeLogo` "remains on-brand and is kept" (Assumptions); the plan says it stays in `src/components/atomic/SpinningLogo/` "UNTOUCHED"; the issues file says it's "rendered inside an ASCII box frame on the page" — is the box frame implemented inside the existing component or as a wrapper? [Ambiguity, Spec / Plan / Issues]
- [ ] CHK094 — The wireframe shows a "MU/TH/UR 6000" status bar with a live-looking timestamp; the spec lists no requirement for actual timestamp behavior — is it real-time, page-load-frozen, or always the same literal string? [Ambiguity, Spec §UI Mockup]
- [ ] CHK095 — The spec says "the page is intentionally mono-heavy — that _is_ the aesthetic" (Issues §Typography) but FR-002 specifies a body face in addition to display + mono — which is binding? [Conflict, Spec §FR-002 vs Issues §Typography]
- [ ] CHK096 — The spec says "all 35 themes remain selectable" but research says "ship a 36th"; the issues file says "ship as a new theme" — is the answer 35 (replace) or 36 (add)? [Conflict, Spec / Research / Issues]
- [ ] CHK097 — The wireframe shows a single project card on mobile with "scroll for full project grid →" hint; the plan says ProjectShowcaseCard is rebuilt with the CRT variant — is the mobile single-card view a new component or a responsive collapse of the existing grid? [Ambiguity, Wireframe vs Plan]
- [ ] CHK098 — Plan.md's claim that "user stories US-001/US-002/US-003 are independently testable" is asserted but not demonstrated — is it specified how to test US-001 (recruiter response) without US-002 (scrolling) being implemented? [Ambiguity, Plan implied vs Spec §User Stories]

## Scope & Boundary

- [ ] CHK099 — Is the scope boundary between "home page rebuild" and "inner pages inherit tokens passively" specified — what does "passively" mean (no CSS changes? matching-theme tokens only? acceptable visual divergence)? [Clarity, Spec §Scope + Plan §Structure Decision]
- [ ] CHK100 — Are the criteria for "this feature is complete" specified — must all 7 wireframe callouts be implemented, or is partial implementation acceptable? [Completeness, Spec §Success Criteria implied]
- [ ] CHK101 — Is the boundary between the new components and the existing `AnimatedLogo` specified — the plan says AnimatedLogo "may not be used in CRT hero (the boot sequence replaces the letter-pop)" — is that a soft "may" or a hard "is not used"? [Ambiguity, Plan §Project Structure]
- [ ] CHK102 — Is the boundary between "5-file pattern enforced" and "small hooks like `useReducedMotion`" specified — the hook is one .ts file, not a 5-file component; is the constitution satisfied? [Completeness, Constitution §I vs Plan §Project Structure]
- [ ] CHK103 — Is the rollout strategy specified — does this ship in one PR, or as multiple smaller PRs (theme first, then components, then page rebuild)? [Completeness, Gap]
- [ ] CHK104 — Is the criteria for "out of scope" enforced — what stops the implement phase from creeping into rebuilding `/about` or `/projects/*` because they "look inconsistent now"? [Completeness, Spec §Out of scope vs Implementation discipline]

---

## How to work this checklist

1. **Author pass (me):** I review each item against spec.md, plan.md, research.md, and the issues file. For each:
   - [x] = requirement is well-specified, no action needed
   - [ ] (leave unchecked) = requirement gap or ambiguity surfaced; needs reviewer decision

2. **Reviewer pass (you):** Skim the items I left unchecked. For each:
   - Decide: update spec/plan/research to close the gap, OR accept the ambiguity and document it as a known acceptable risk in the spec's Assumptions section, OR push the decision into `/speckit.tasks`

3. **Gate criterion:** Before `/speckit.tasks` runs, every item must be either checked OR explicitly acknowledged in spec/plan as an open question with a chosen disposition.

4. **Re-run:** A second `/speckit.checklist` invocation can generate a fresh sister file (e.g. `motion.md` or `a11y.md`) for narrower deep dives; this file is the comprehensive multi-dimensional gate.

---

## Categorization summary

| Category                    | Items              |
| --------------------------- | ------------------ |
| Requirement Completeness    | 17 (CHK001–CHK017) |
| Requirement Clarity         | 14 (CHK018–CHK031) |
| Requirement Consistency     | 9 (CHK032–CHK040)  |
| Acceptance Criteria Quality | 7 (CHK041–CHK047)  |
| Scenario Coverage           | 18 (CHK048–CHK065) |
| Edge Case Coverage          | 6 (CHK066–CHK071)  |
| Non-Functional Requirements | 15 (CHK072–CHK086) |
| Dependencies & Assumptions  | 6 (CHK087–CHK092)  |
| Ambiguities & Conflicts     | 6 (CHK093–CHK098)  |
| Scope & Boundary            | 6 (CHK099–CHK104)  |
| **Total**                   | **104**            |

## Traceability rate

96 of 104 items (~92%) reference a specific spec/plan/research/issues section or carry an explicit `[Gap]` / `[Ambiguity]` / `[Conflict]` / `[Assumption]` marker. Exceeds the ≥80% minimum.

## Resolved items (co-authored 2026-05-17)

The following six items were the highest-value conflicts/gaps surfaced by this checklist and were resolved before `/speckit.tasks`:

- **CHK033 — Boot timing math:** Spec wins; research updated. Boot completes in ~700ms typical / ~1.2s worst case via ~10ms/char + ~30ms inter-line pause. (Was ~3.5s in research math.) [research.md §R2 updated]
- **CHK037 — Key Entities:** Plan wins; spec §Key Entities removed. data-model.md correctly says N/A — these were conceptual, not persistent. [spec.md §Key Entities replaced]
- **CHK038 + CHK096 — Theme count:** Ship as 36th. `turtlewolfe-crt` adds alongside the existing 35 (none removed). [spec.md §FR-010 + Resolved 3 updated, research.md §R4 updated]
- **CHK078 — Focus ring in non-CRT themes:** Use `var(--color-primary)` everywhere; resolves per-theme. Contrast verified per theme against `--color-base-100`. [spec.md §FR-011 added, issues §Accessibility updated]
- **CHK095 — Body font:** Issues wins; FR-002 updated. Only 2 faces ship — Instrument Serif (display, hero name + card titles) and JetBrains Mono (everything else including body). `--font-body` aliases to `--font-mono`. [spec.md §FR-002 + Resolved 2 updated, issues §Typography updated]
- **CHK028 — Texture:** Scanlines win (spec). Wireframe annotation's halftone/microfilm language was leftover from V04 (Andor) and is superseded. [spec.md §Resolved 6 added]

Remaining open items: 98 unresolved (mostly Completeness / Edge Case gaps). These will be either picked up by `/speckit.tasks` as task acceptance criteria, deferred as known acceptable risks documented in spec §Assumptions, or addressed during `/speckit.implement` with author judgment.
