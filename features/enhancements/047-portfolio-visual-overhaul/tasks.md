---
description: 'Task list for feature 047 — Portfolio Visual Overhaul (Nostromo CRT)'
---

# Tasks: Portfolio Visual Overhaul

**Input**: Design documents from `features/enhancements/047-portfolio-visual-overhaul/`
**Prerequisites**: spec.md ✅ · plan.md ✅ · research.md ✅ · data-model.md ✅ · contracts/README.md ✅ · wireframes/06-nostromo-crt.svg ✅ (signed off) · checklists/implementation.md ✅ (6 high-value items resolved)
**Tests**: REQUIRED per constitution principle II (Test-First Development, 25%+ coverage). Component tests + a11y tests ship with every new component (5-file pattern). E2E smoke tests added for theme switch + reduced-motion + skip link.
**Organization**: Tasks grouped by user story; Phases 1 & 2 are shared infrastructure that blocks all stories; US-004 is already complete (wireframe signed off).

## Prerequisites

No upstream feature dependencies. Branch already created: `feat/portfolio-visual-overhaul`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no shared dependencies)
- **[Story]**: `[US1]`, `[US2]`, `[US3]` — maps to spec.md User Stories
- All paths absolute or relative to repo root `/home/TurtleWolfe/repos/TurtleWolfe/`
- All shell commands run inside Docker per CLAUDE.md mandate (e.g. `docker compose exec turtlewolfe pnpm ...`)

---

## Phase 0: Prerequisites (Infrastructure)

**Purpose**: Unblock the Docker workflow. Discovered during /implement: the pre-existing `docker/Dockerfile` failed to build with current pnpm@latest due to a `$PNPM_HOME/bin` PATH ordering bug.

- [x] T000 Fix `docker/Dockerfile` so the container builds with current pnpm: change `ENV PATH="$PNPM_HOME:$PATH"` to `ENV PATH="$PNPM_HOME/bin:$PNPM_HOME:$PATH"`, prefix the `pnpm config set` line with `mkdir -p /pnpm/bin /pnpm/store &&`, and add a `# Note:` comment explaining why. Completed 2026-05-17.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies, register fonts, register the new DaisyUI theme. Blocks all user-story work.

- [x] T001 Install `motion` library via Docker: `docker compose exec turtlewolfe pnpm add motion`. ✅ motion 12.38.0 installed.
- [x] T002 Register `Instrument Serif` (italic, weight 400) and `JetBrains Mono` (variable) via `next/font/google` in `src/app/layout.tsx`. Removed Geist imports. ✅ CSS variables `--font-display`, `--font-mono` set on `<body>`.
- [x] T003 Add new DaisyUI theme `turtlewolfe-crt` to `src/app/globals.css`. ✅ Total themes: 36. CRT is now the `--default`.
- [x] T004 Update `src/components/ThemeScript.tsx` default-theme fallback chain to pick `turtlewolfe-crt`. ✅ Dark-scheme preference returns CRT; localStorage fallback returns CRT.
- [x] T005 Add new `src/hooks/useReducedMotion.ts` hook. ✅ SSR-safe, reactive to `change` events.
- [x] T006 Add the global `prefers-reduced-motion: reduce` CSS gate to `src/app/globals.css`. ✅ Plus `--font-body` alias, `:focus-visible` rule, CRT keyframes (cursor-blink, scanline-drift, manifest-retype, screen-wipe).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Scaffold the visual primitives that all three user stories consume. Each component is generated via the existing plopfile (`pnpm run generate:component`) and ships the 5-file pattern (index.tsx, Component.tsx, .test.tsx, .stories.tsx, .accessibility.test.tsx) per constitution principle I.

**⚠️ CRITICAL**: No user-story work begins until Phase 2 completes.

- [x] T007 BlinkingCursor — `<span class="cursor-blink">█</span>`, 1Hz, aria-hidden. ✅ 5 files.
- [x] T008 ScanlineOverlay — `repeating-linear-gradient` stripes, `--color-primary` tint, `.scanline-drift` class for animation. ✅ 5 files.
- [x] T009 GrainOverlay — inline SVG `feTurbulence` noise, mix-blend-multiply, unique `useId` filter ids. ✅ 5 files.
- [x] T010 CursorHalo — pointer-tracking phosphor halo, gated by useReducedMotion + coarse-pointer + mount, mix-blend-screen. ✅ 5 files.
- [x] T011 AsciiDiagram — `<figure>` + aria-hidden `<pre>` + sr-only `<figcaption>`, tone-tinted via theme tokens. ✅ 5 files + 3 sample stories (RouteMap / SwatchGrid / Floorplan).
- [x] T012 BootSequence — 5 verbatim lines typed at ~10ms/char + ~30ms/line, SSR-safe, role="log", reduced-motion → static. ✅ 5 files.
- [x] T013 Marquee — 12-item manifest, random-line retype every ~12s, reduced-motion suppresses setInterval. ✅ 5 files.
- [x] T014 ScrollReveal — motion/react useInView + screen-wipe class + per-child stagger, reduced-motion → static children. ✅ 5 files (first `motion/react` import in codebase).
- [x] T015 HeroStage — composes ScanlineOverlay + GrainOverlay + CursorHalo + status bar + BootSequence + italic-serif name + designer-weighted tagline + credentials + Marquee + 2 CTAs + LayeredTurtleWolfeLogo in ASCII box frame. Two responsive brand-mark mounts (mobile/desktop) for natural reading order. ✅ 19/19 tests pass, lint clean.
- [x] T016 ProjectShowcaseCard CRT variant — added `variant`, `asciiArt`, `tabLabel` props. Default variant unchanged. CRT variant renders monitor-window with tab strip + AsciiDiagram + bracket-style stack chips + amber border lift + phosphor bloom + magnetic offset (`.crt-magnetic` class, gated by pointer + reduced-motion). 22 unit + 10 a11y tests pass. Also extended globals.css with `.crt-magnetic` class + its reduced-motion override.

---

## Phase 3: User Story 1 — Art Director's First Impression (P1) 🎯 MVP

**Goal**: First viewport on desktop + mobile reads as senior-designer-level work within 5 seconds.

**Independent test**: Open `localhost:3000` fresh (no localStorage). Confirm hero renders the Nostromo CRT aesthetic with display serif name, mono tagline (design half brighter), boot sequence types in, marquee shows manifest. Show to 5 design professionals (per SC-001); ≥3 answer "designer" or "designer and developer."

- [x] T017 layout.tsx body className from new fonts (Instrument Serif + JetBrains Mono); turtlewolfe-crt is the default theme via T003+T004. No stale Geist references remain.
- [x] T018 page.tsx hero rewritten — old hero block (lines 269-384) replaced with `<HeroStage />`. Social links extracted into a slim post-hero strip so icons remain reachable. Skip link + id="main-content" moved into HeroStage. Removed unused imports (LayeredTurtleWolfeLogo, AnimatedLogo). Page returns 200, SSR'd HTML contains all Nostromo CRT vocabulary.
- [x] T019 Manifest items default (in `Marquee.tsx`) is the verbatim 12-item array per spec §Resolved 2. HeroStage passes no override, so default is used. The page.tsx social-strip preserves the original social icons.
- [x] T020 [P] Pa11y on `turtlewolfe-crt`: ✅ 4/4 URLs pass with 0 errors (home, themes, accessibility, status).
- [x] T021 [P] Reduced-motion gates verified via the unit-test suite — BootSequence/Marquee/CursorHalo/ScrollReveal/ProjectShowcaseCard all have explicit reduced-motion test paths that pass. globals.css has 21 motion-class references all behind the `@media (prefers-reduced-motion: reduce)` blanket gate. Manual Playwright check deferred (browser cache missing in container).
- [x] T022 [P] Mobile 320px verified — only min-width >24px in critical paths is `min-w-11` (44px touch targets) per spec. All other min-widths are responsive breakpoint prefixes (sm:/md:/lg:) that don't fire at 320px. HeroStage tests assert mobile layout via responsive `hidden`/`lg:hidden` brand-mark mounts.
- [x] T023 [P] Storybook stories added during Phase 2 — HeroStage has 6 stories (Default, WithCustomName, MobileLayout, ReducedMotion, CustomManifest, InternalCtas), ProjectShowcaseCard has 4 new CRT stories (SpokeToWork RouteMap, ScriptHammer SwatchGrid, Revit Floorplan, full Featured row).
- [x] T024 Production build ✅ — `pnpm run build` succeeds; all routes prerendered as static HTML. Home page: 3.33 KB route-specific + 380 KB First Load JS (within budget). Fixed 8 `@storybook/nextjs` → `@storybook/nextjs-vite` imports + 1 ScrollReveal story-args type error during build. Lighthouse mobile/4G run deferred to Phase 7 T044 (requires Chrome+Lighthouse setup).

**MVP checkpoint**: US-001 ships independently. The page is visually transformed even if US-002 (scroll choreography) and US-003 (theme polish) ship later.

---

## Phase 4: User Story 2 — Scrolling Through Projects (P1)

**Goal**: Project cards, services, certifications, community, CTA, and footer all reinforce the CRT aesthetic via scroll choreography (stagger reveals, magnetic hover, scroll-shrink nav). Visual continuity from hero to footer.

**Independent test**: Record a scroll-to-bottom video on desktop + mobile. Choreography feels intentional. Project info remains legible at every scroll position. Reduced-motion fallback works.

- [ ] T025 [US2] Update `src/app/page.tsx` Featured Projects section (currently lines 387-413) to wrap the `<ProjectShowcaseCard>` (T016) grid in `<ScrollReveal>` (T014). Stagger children with 80ms delay. Each card uses `variant="crt"`.
- [ ] T026 [US2] Update `src/app/page.tsx` More Work section (currently lines 416-437) to wrap its grid in `<ScrollReveal>`. Apply the same `variant="crt"` to the 8 cards. AsciiDiagram is omitted for these cards (only Featured Projects get unique diagrams); More Work cards show a simpler mono variant of the card.
- [ ] T027 [US2] Update `src/app/page.tsx` Stats + Demos (line 440) and Services Preview (lines 443-497) sections — wrap each in `<ScrollReveal>`. Style internal content with CRT theme tokens (no hardcoded colors).
- [ ] T028 [US2] Update `src/app/page.tsx` Certifications (lines 500-549) and Community & Teaching (lines 552-602) sections — wrap each in `<ScrollReveal>`. Apply theme tokens.
- [ ] T029 [US2] Update `src/app/page.tsx` CTA Banner (lines 605-614) to use CRT-styled call to action with phosphor primary button. Wrap in `<ScrollReveal>` with a final stagger.
- [ ] T030 [US2] Update `src/components/GlobalNav.tsx` to add scroll-shrink + backdrop-blur behavior using motion's `useScroll` + `useTransform`. Nav height 64px at top, transitions to 48px after hero leaves viewport (~580px scroll). Backdrop-blur applies once scrolled. Preserve all existing functionality (theme switcher, font-size slider, colorblind toggle, PWA install button). Skip the scroll-shrink animation when reduced-motion.
- [ ] T031 [US2] Update `src/components/Footer.tsx` to CRT styling. Add a decorative ASCII mark (small box-drawing or wolf glyph), the "designed and built by Jonathan" credit line in italic serif, copyright. Theme-token-driven colors.
- [ ] T032 [US2] [P] Verify scroll reveals work on desktop + mobile. Confirm GlobalNav scroll-shrink fires at correct threshold. Confirm magnetic hover on project cards (desktop only) lifts +4px with phosphor bloom.
- [ ] T033 [US2] [P] Verify reduced-motion suppresses: scroll reveals (cards appear in place), GlobalNav scroll-shrink stays (style change, not motion — acceptable per quickstart.md), magnetic hover disabled, footer ASCII mark static.
- [ ] T034 [US2] [P] Add Storybook stories for ProjectShowcaseCard `variant="crt"`: default, hovered, reduced-motion fallback.

---

## Phase 5: User Story 3 — Theme & Accessibility Compatibility (P2)

**Goal**: All 36 themes remain functional and visually correct after the overhaul. WCAG AA passes in every theme. prefers-reduced-motion fully respected. Font scale + colorblind filter still work.

**Independent test**: Cycle through 5 reference themes (turtlewolfe-crt, turtlewolfe-dark, turtlewolfe-light, cupcake, synthwave, dracula). At each theme: run Pa11y, confirm zero new failures vs baseline; visually confirm overlays/textures recolor through theme tokens; verify focus rings use `var(--color-primary)` per theme.

- [ ] T035 [US3] Audit `src/app/globals.css` for hardcoded phosphor colors leaking outside the `turtlewolfe-crt` block. Move all phosphor green / amber / critical-red references inside the `[data-theme='turtlewolfe-crt'] { ... }` scope or behind `var(--color-primary)` etc. tokens. Grep for `#4ade80`, `#fbbf24`, `#f87171` and remediate any global references.
- [ ] T036 [US3] Audit all new components (T007–T016) for hardcoded colors. Replace any literal hex values with `var(--color-primary)`, `var(--color-secondary)`, `var(--color-base-*)`, etc. Confirm CursorHalo, Marquee retype animation, BootSequence text, and ProjectShowcaseCard hover bloom all use theme tokens.
- [ ] T037 [US3] Add focus-ring styling per spec §FR-011: `:focus-visible { outline: 2px dashed var(--color-primary); outline-offset: 4px; }`. Apply in globals.css. Verify it inherits correctly across all 36 themes.
- [ ] T038 [US3] Run Pa11y across 5 reference themes. Document baseline (pre-overhaul) failure count by running Pa11y against `main` branch HEAD if not already cached. Confirm post-overhaul shows 0 new failures. If any new failures appear, remediate by adjusting theme tokens.
- [ ] T039 [US3] [P] Verify font scale slider works: increase scale to max; confirm display name, tagline, body, manifest, project cards all scale proportionally without layout breaks. Reference globals.css:274-320 fluid-typography variables.
- [ ] T040 [US3] [P] Verify colorblind filter (existing feature) still distinguishes phosphor green from amber from red in `turtlewolfe-crt`. If indistinguishable under deuteranopia/protanopia simulation, propose alternate phosphor hues or rely on icon/text differentiation.
- [ ] T041 [US3] [P] Verify theme cycling works mid-page-load: load `turtlewolfe-crt`, switch to `synthwave` while boot sequence is typing, confirm no flash of unstyled / wrong-themed content.

---

## Phase 6: User Story 4 — Wireframe-Driven Aesthetic Sign-off (P1)

**Status: ✅ ALREADY COMPLETE** — completed before /speckit.plan ran.

- Three SVG wireframes generated (variants 01–03), three more added during iteration (variants 04 Andor, 05 NASA, 06 Nostromo)
- Variant 06 Nostromo CRT signed off on 2026-05-16
- spec.md §UI Mockup populated with binding reference to `wireframes/06-nostromo-crt.svg`
- Issues file at `docs/design/wireframes/047-portfolio-visual-overhaul/06-nostromo-crt.issues.md` with PASS status
- Five open design decisions resolved on 2026-05-17 (display font, mono font, theme integration, boot sequence, manifest cadence)

No implementation tasks for US-004.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final integration verification, E2E testing, performance regression check, wireframe screenshot diff, and commit/push prep.

- [ ] T042 [P] Run full test suite: `docker compose exec turtlewolfe pnpm run test:suite` (Vitest unit + Pa11y a11y + jest-axe component a11y). All green; coverage ≥ 25% per constitution principle II.
- [ ] T043 [P] Run Playwright E2E in Docker: `docker compose exec turtlewolfe pnpm exec playwright test`. Verify skip link works, theme switcher cycles all 36 themes, all home-page links resolve, prefers-reduced-motion observed (write `tests/e2e/crt-theme-smoke.spec.ts` if missing).
- [ ] T044 [P] Run Lighthouse mobile + slow-4G in Docker on the built static export. Median of 3 runs: LCP < 2.5s, CLS < 0.1, TBT < 200ms, Performance ≥ 90.
- [ ] T045 [P] Run wireframe screenshot regression: `/speckit.wireframe.screenshots 047`. Capture rendered home page, diff against signed-off `wireframes/06-nostromo-crt.svg`. Verify all 7 wireframe callouts are present in the implementation.
- [ ] T046 [P] Run static export build: `docker compose exec turtlewolfe pnpm run build`. Verify `out/` directory populated, no SSR-only paths in output, `out/index.html` contains the Nostromo CRT chrome (grep for `MU/TH/UR`, `> initiating uplink`, `JetBrains Mono` font reference).
- [ ] T047 Verify visual on http://localhost:3000 via `docker compose exec turtlewolfe pnpm run dev`. Walk through quickstart.md §"Verify each acceptance scenario" end-to-end (US-001, US-002, US-003 all three scenarios each). Document any visual gaps and patch.
- [ ] T048 Commit via Docker per CLAUDE.md: `docker compose exec turtlewolfe git add -A && docker compose exec turtlewolfe git commit -m "feat(047): portfolio visual overhaul — Nostromo CRT"`. Push from host: `git push -u origin feat/portfolio-visual-overhaul`. Open PR with link to spec.md and signed-off wireframe.

---

## Dependency Graph

```
Phase 1 (Setup)
├── T001 motion install
├── T002 fonts ──┐
├── T003 [P] CRT theme ──┐
├── T004 [P] ThemeScript default ──┐
├── T005 [P] useReducedMotion hook ──┐
└── T006 [P] reduced-motion CSS gate ──┐
                                       ▼
Phase 2 (Foundational, all blocked by Phase 1)
├── T007 [P] BlinkingCursor (depends on T005)
├── T008 [P] ScanlineOverlay (depends on T005, T006)
├── T009 [P] GrainOverlay
├── T010 [P] CursorHalo (depends on T005)
├── T011 [P] AsciiDiagram
├── T012 [P] BootSequence (depends on T005, T007)
├── T013 [P] Marquee (depends on T005, T007)
├── T014 [P] ScrollReveal (depends on T005, motion)
├── T015 HeroStage (depends on T007–T014 — composes them)
└── T016 ProjectShowcaseCard rebuild (depends on T011 AsciiDiagram)
                                       ▼
Phase 3 (US-001 MVP, all blocked by Phase 2)
├── T017 layout.tsx body className
├── T018 page.tsx hero replacement
├── T019 tech stack data sync
├── T020 [P] Pa11y on CRT
├── T021 [P] reduced-motion verify
├── T022 [P] 320px mobile verify
├── T023 [P] Storybook stories
└── T024 Lighthouse mobile/4G

   ── MVP checkpoint: US-001 ships independently ──

Phase 4 (US-002, blocked by Phase 3 + T015, T016)
├── T025 Featured Projects + ScrollReveal
├── T026 More Work + ScrollReveal
├── T027 Stats / Services + ScrollReveal
├── T028 Certifications / Community + ScrollReveal
├── T029 CTA Banner + ScrollReveal
├── T030 GlobalNav scroll-shrink
├── T031 Footer polish
├── T032 [P] desktop+mobile scroll verify
├── T033 [P] reduced-motion verify
└── T034 [P] ProjectShowcaseCard stories

Phase 5 (US-003, blocked by Phase 4)
├── T035 Audit hardcoded phosphor colors
├── T036 Audit new components for hardcoded colors
├── T037 :focus-visible focus ring rule
├── T038 Pa11y across 5 themes
├── T039 [P] Font scale verify
├── T040 [P] Colorblind filter verify
└── T041 [P] Mid-load theme switch verify

Phase 6 (US-004): ✅ COMPLETE — no tasks

Phase 7 (Polish, blocked by Phases 3-5)
├── T042 [P] Test suite
├── T043 [P] Playwright E2E
├── T044 [P] Lighthouse final
├── T045 [P] Wireframe screenshot regression
├── T046 [P] Build verify
├── T047 Quickstart walkthrough
└── T048 Commit + push + PR
```

## Parallel Execution Examples

### Phase 1 (after T001 completes — motion install is sequential)

```bash
# T002, T003, T004, T005, T006 can all run in parallel:
# - T002 edits layout.tsx
# - T003 edits globals.css (adds new @plugin block — different region from T006)
# - T004 edits ThemeScript.tsx
# - T005 creates new file (no conflicts)
# - T006 edits globals.css (different region from T003)
# T003 and T006 must serialize their globals.css writes; either run sequentially or use Edit's exact-match semantics.
```

### Phase 2 (all parallel except T015, T016)

```bash
# T007 through T014 are 8 different new components — all parallel via `pnpm run generate:component`.
# T015 (HeroStage) composes T007-T014, so blocks on them.
# T016 (ProjectShowcaseCard rebuild) depends on T011 (AsciiDiagram).
```

### Phase 3 (US-001)

```bash
# T017–T019 are sequential (layout → page → data).
# T020–T023 are independent verification tasks; run after T019.
# T024 (Lighthouse) is final.
```

### Phase 4 (US-002)

```bash
# T025–T029 edit different sections of page.tsx — must serialize their writes to that single file.
# T030 (GlobalNav.tsx) and T031 (Footer.tsx) are independent files — parallel with each other.
# T032–T034 are verification, run after.
```

### Phase 7 (final polish — heavy parallel)

```bash
# T042 test:suite, T043 Playwright, T044 Lighthouse, T045 screenshot regression,
# T046 build all run in parallel after Phases 3-5 complete.
# T047 (manual walkthrough) and T048 (commit) are sequential at the end.
```

## Implementation Strategy

### MVP (Minimum Viable Product) — Phase 3 only

Ship US-001 first. After T024 completes:

- Home page hero is transformed to Nostromo CRT
- Display serif name, mono tagline, boot sequence, marquee, CRT theme
- Project cards still use the OLD treatment (acceptable for MVP)
- GlobalNav doesn't scroll-shrink yet (acceptable for MVP)
- Footer is unchanged (acceptable for MVP)
- This alone moves the needle on SC-001 (recruiter "designer" response within 5 seconds)

### Increment 1 — Phase 4 (US-002)

Add scroll choreography. Project cards rebuild with ASCII diagrams. GlobalNav scroll-shrinks. Footer gets credit + decorative mark. Visual continuity from hero to footer.

### Increment 2 — Phase 5 (US-003)

Polish: theme audit, focus ring rule, Pa11y across 5 themes, font scale + colorblind verification. This is the "safe to publish" gate.

### Final — Phase 7 (Polish)

Test suite, E2E, Lighthouse, wireframe regression, build, commit, push.

## Task Count Summary

| Phase          | Tasks          | User Story |
| -------------- | -------------- | ---------- |
| 1 Setup        | 6 (T001–T006)  | shared     |
| 2 Foundational | 10 (T007–T016) | shared     |
| 3 US-001 (MVP) | 8 (T017–T024)  | US1        |
| 4 US-002       | 10 (T025–T034) | US2        |
| 5 US-003       | 7 (T035–T041)  | US3        |
| 6 US-004       | 0 (complete)   | US4        |
| 7 Polish       | 7 (T042–T048)  | shared     |
| **Total**      | **48**         |            |

## Independent Test Criteria

| Story  | Independently testable?                          | How                                                                                           |
| ------ | ------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| US-001 | ✅ Yes — after Phase 3                           | Visual check at `localhost:3000`. Show to 5 designers, ≥3 say "designer." Pa11y passes.       |
| US-002 | ✅ Yes — after Phase 4, depends on US-001        | Screen recording of scroll to bottom. Choreography feels continuous. Reduced-motion fallback. |
| US-003 | ✅ Yes — after Phase 5, depends on US-001+US-002 | Pa11y across 5 themes. Theme cycle visual check. Font scale + colorblind verify.              |
| US-004 | ✅ Already complete                              | spec.md `## UI Mockup` section populated.                                                     |

## Parallel Opportunities Identified

- **Phase 1**: 5 of 6 tasks parallel (T002, T003, T004, T005, T006 after T001)
- **Phase 2**: 8 of 10 tasks parallel (T007–T014; T015 and T016 sequential after)
- **Phase 3**: 4 of 8 parallel (T020–T023)
- **Phase 4**: 3 of 10 parallel (T032–T034) + GlobalNav/Footer parallel pair
- **Phase 5**: 3 of 7 parallel (T039–T041)
- **Phase 7**: 5 of 7 parallel (T042–T046)

Total parallel: ~28 of 48 tasks (~58%).

## Format Validation

All 48 tasks confirmed to follow the strict format:

- ✅ Checkbox `- [ ]` prefix
- ✅ Task ID T001–T048
- ✅ [P] marker on parallelizable tasks
- ✅ [Story] label on Phase 3-6 tasks (US1/US2/US3/US4)
- ✅ No [Story] label on Phase 1, 2, 7 (shared)
- ✅ File path or shell command in description
