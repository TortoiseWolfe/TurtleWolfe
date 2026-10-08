# Feature Specification: Portfolio Visual Overhaul

**Feature Branch**: `feat/portfolio-visual-overhaul`
**Created**: 2026-05-15
**Status**: Draft
**Input**: User description: Transform `turtlewolfe.com` home page from a clean developer portfolio into a visually striking showcase that sells Jonathan Pohlner as both a senior graphic designer (20+ years) AND full-stack developer (15+ years). Three candidate aesthetics will be wireframed and signed off via the spec-kit wireframe extension before implementation begins.

## User Scenarios & Testing _(mandatory)_

### User Story 1 — Art Director's First Impression (Priority: P1)

An art director or design-conscious recruiter lands on `turtlewolfe.com` from a LinkedIn profile, an Awwwards-style aggregator, or a search result. They have roughly five seconds before deciding whether to scroll further or close the tab. Within the first viewport — before any scroll — the page must communicate, through typography, color, texture, motion, and layout, that the person behind it can do real graphic design at a senior level, not just developer-with-a-theme-switcher work.

**Why this priority**: This is the entire reason for the overhaul. The current site reads as a tasteful developer portfolio but does not "sell the design half" of Jonathan's profile. Every other story in this spec supports this one. If the first viewport doesn't carry design weight, nothing downstream matters.

**Independent Test**: Show five design professionals the live first viewport on a 1440-wide laptop and a 390-wide phone. Without prompting, ask: "What does this person do?" If three or more answer with "designer" or "designer and developer," the story passes. If they answer only "developer," it fails.

**Acceptance Scenarios**:

1. **Given** the visitor lands on the home page on a desktop browser, **When** the first viewport renders, **Then** the visitor sees a distinctive display typeface (not a default system or Inter/Roboto-style sans), a textured atmospheric background (not flat color), and the explicit tagline positioning Jonathan as "Graphic Designer · Full-Stack Developer" with visible visual weight on the design half.
2. **Given** the visitor lands on the home page on a mobile browser, **When** the first viewport renders, **Then** all of the above are present and legible, touch targets are at least 44px, and no element overflows the viewport.
3. **Given** the visitor has `prefers-reduced-motion: reduce` set, **When** the first viewport renders, **Then** all of the above are still present and coherent — motion is suppressed, but the static composition still reads as designed-first.

---

### User Story 2 — Scrolling Through Projects (Priority: P1)

The same visitor scrolls past the hero into the featured projects, more work grid, services, and case studies. The motion choreography, card treatment, and section transitions reinforce the design point of view established in the hero — without dropping into generic stock-template aesthetics, and without sacrificing scan-ability of the actual project information.

**Why this priority**: A great hero followed by stock-feeling cards undoes the first impression in two scrolls. The project showcase is where the visitor evaluates the work; if the chrome around the work looks generic, the work itself reads as smaller.

**Independent Test**: Capture a screen recording of the visitor scrolling from top of page to footer at a natural reading pace on desktop and on mobile. Review on mute. The choreography must feel intentional and continuous — not a series of disconnected effects. Project information (title, description, stack badges) must remain legible at every scroll position.

**Acceptance Scenarios**:

1. **Given** the visitor scrolls into the Featured Projects section, **When** project cards enter the viewport, **Then** they reveal with a staggered scroll-triggered "screen wipe" clip-path entrance and each card carries a hover treatment matching the signed-off aesthetic (amber border lift + phosphor bloom + magnetic offset on fine pointers) without obscuring the project image or title.
2. **Given** the visitor continues scrolling, **When** they pass section boundaries (More Work → Stats+Demos → Services → Certifications → Community → CTA), **Then** each section enters with a coordinated reveal — no section animates in a way that conflicts with adjacent sections.
3. **Given** the visitor reaches the CTA section at the page bottom, **When** they look at the footer, **Then** they see a polished footer with a decorative mark and a "designed and built by Jonathan" credit that closes the visual narrative.
4. **Given** the visitor has `prefers-reduced-motion: reduce`, **When** they scroll, **Then** content appears in place without motion; the static layout still feels intentional, not broken.

---

### User Story 3 — Theme & Accessibility Compatibility (Priority: P2)

A returning visitor (or accessibility tester) switches between several DaisyUI themes via the existing theme switcher (turtlewolfe-dark, turtlewolfe-light, synthwave, cupcake, dracula, etc.). They may also enable colorblind filters or font-scale changes. The overhauled visuals must remain coherent across every theme — textures, overlays, motion accents, and typography must all recolor through the existing theme tokens. WCAG AA contrast must hold in every theme, in every interactive state.

**Why this priority**: The site's existing theming system is a load-bearing feature (36 themes after this feature adds `turtlewolfe-crt`, with ThemeScript cross-tab sync, colorblind filters, font-scale slider). Breaking it to chase a visual direction would be a regression. This story exists as a guardrail on Story 1 and Story 2.

**Independent Test**: Cycle through five most-used themes (turtlewolfe-dark, turtlewolfe-light, cupcake, synthwave, dracula). At each theme, run Pa11y and visually confirm: no contrast failures, no invisible elements, all textured backgrounds recolor appropriately, all motion accents (where present) use theme tokens rather than hardcoded colors.

**Acceptance Scenarios**:

1. **Given** the visitor switches from turtlewolfe-dark to cupcake, **When** the theme applies, **Then** every textured background, overlay, and motion accent recolors through theme tokens — no element retains a previous theme's color.
2. **Given** an accessibility auditor runs Pa11y on each of the five reference themes, **When** the audit completes, **Then** zero new WCAG AA failures are reported relative to the pre-overhaul baseline.
3. **Given** a visitor uses the existing font-scale slider, **When** they increase the scale, **Then** display headings and body text both scale proportionally without breaking layout.
4. **Given** a visitor enables a colorblind filter, **When** the filter applies, **Then** all critical information (project titles, CTAs, contrast-dependent UI affordances) remains identifiable.

---

### User Story 4 — Wireframe-Driven Aesthetic Sign-off (Priority: P1)

Before any implementation work begins, Jonathan reviews three SVG wireframes (one per candidate aesthetic: Editorial Brutalism, Cinematic Dark + Aurora, Retro-Futurist Print) generated by the spec-kit wireframe extension. He chooses one (or a hybrid). That choice is written into this spec under a `## UI Mockup` section, becoming a binding constraint for `/speckit.plan`, `/speckit.tasks`, and `/speckit.implement`.

**Why this priority**: This story is the workflow gate. Without sign-off, planning has no visual constraint and the implement phase has no reference. The wireframe extension is the right tool for this — it was built precisely to make "this doesn't look right" catchable before code is written.

**Independent Test**: After running `/speckit.wireframe.generate 047 --variants=3` and `/speckit.wireframe.review 047`, open the spec file. A `## UI Mockup` section must exist citing the chosen SVG path. The chosen wireframe must be openable in the hot-reload viewer and show desktop + mobile mockups on a 1920×1080 canvas.

**Acceptance Scenarios**:

1. **Given** the wireframe extension has run, **When** Jonathan opens the wireframes folder, **Then** at least three SVGs exist with light-theme convention (desktop 1280×720 at x=40,y=60 and mobile 360×720 at x=1360,y=60) and panel color #e8d4b8. (Six variants shipped: 01 Editorial Brutalism, 02 Cinematic Dark + Aurora, 03 Retro-Futurist Print, 04 Andor Terminal, 05 NASA Mission Graphic, 06 Nostromo CRT.)
2. **Given** Jonathan has reviewed the variants, **When** he selects a winner (or hybrid), **Then** this spec is updated with a `## UI Mockup` section pointing to the chosen SVG path and an issues file at `docs/design/wireframes/047-portfolio-visual-overhaul/<svg>.issues.md` records the PASS sign-off.
3. **Given** the sign-off is complete, **When** `/speckit.plan` runs next, **Then** the plan output references the signed-off aesthetic and does not propose alternatives that contradict it.

**Status:** ✅ COMPLETE — signed off 2026-05-16 on variant 06 (Nostromo CRT).

---

### Edge Cases

- **Touch device with no hover**: cursor halo, magnetic-offset hover, and any other hover-only effects must gracefully no-op on coarse pointers (`@media (pointer: coarse)`). Cards retain their static composition and remain tappable.
- **Visitor with JavaScript disabled**: hero (including the boot-sequence static fallback), project cards, services, and CTA must render with static fallback styling — text legible, links functional, no broken layout from missing motion library.
- **Visitor on a very narrow viewport (320px)**: manifest block, project cards, and tagline must reflow without horizontal scroll; touch targets stay ≥ 44px.
- **Visitor on a very wide ultrawide viewport (3440px+)**: textured backgrounds (scanlines, grain) must tile or scale cleanly; no visible seams; max-width containers prevent text from running edge-to-edge.
- **Slow network (4G or worse)**: motion library bundle must not block the largest-contentful-paint; fonts must use `font-display: swap`; decorative overlays must load after critical content.
- **Theme change mid-animation**: if a visitor switches themes while a scroll-wipe reveal is mid-playback or while the boot sequence is typing, the reveal/typing must complete using the new theme's tokens — no flash of unstyled or wrong-themed content.
- **Returning visitor with prefers-reduced-motion newly enabled**: subsequent visits must respect the new preference without requiring a hard refresh.

---

## Requirements _(mandatory)_

### Functional Requirements

**Visual Identity & First Impression**

- **FR-001**: The home page MUST present, within the first viewport on both desktop and mobile, a tagline explicitly positioning Jonathan Pohlner as "Graphic Designer · Full-Stack Developer" with visible typographic emphasis on the "Graphic Designer" half.
- **FR-002**: The home page MUST use a distinct display typeface for headings (italic-leaning serif, e.g. Instrument Serif) that is not Inter, Roboto, Arial, Helvetica, system-ui, or the existing Geist Sans. The display face MUST be paired with a complementary monospace face that ALSO serves as the body face (i.e. body == mono). Both faces MUST be exposed as CSS custom properties (`--font-display`, `--font-mono`) with `--font-body` aliased to `--font-mono`. Rationale: the chosen Nostromo CRT aesthetic is intentionally mono-heavy — the single italic serif (used only for the name and project card titles) carries enormous visual weight against the otherwise-uniform mono.
- **FR-003**: The home page MUST present a textured atmospheric background in the hero region — not a flat solid color. The signed-off implementation uses (a) a horizontal CRT scanline pattern at ~3-4px stripe, low opacity ~0.05, phosphor-green tint; and (b) a subtle grain/noise overlay via inline SVG `feTurbulence`. Both ship as separate atomic components (`ScanlineOverlay`, `GrainOverlay`).

**Motion Choreography**

- **FR-004**: The hero region MUST present a maximal-intensity motion treatment, specifically combining: (a) a typewriter "boot sequence" that types ~5 lines on page load over ~700ms (see §Resolved 4); (b) a blinking block cursor `█` at 1Hz; (c) the scanline pattern of §FR-003 drifting downward over ~30s/cycle; (d) the manifest re-type behavior of §FR-008. All four motions are gated by `prefers-reduced-motion: reduce` per §FR-009.
- **FR-005**: Featured Projects and More Work grids, plus Stats+Demos, Services, Certifications, Community, and CTA sections, MUST present scroll-triggered "screen wipe" clip-path reveals on viewport enter, with children staggered by ~80ms.
- **FR-006**: Project cards MUST present a hover treatment that distinguishes them from generic developer-portfolio cards: amber border lift + phosphor bloom (CSS box-shadow transition) + magnetic offset (+4px pointer-tracking). Magnetic offset MUST be disabled on coarse pointers (`@media (pointer: coarse)`) and when prefers-reduced-motion is set.
- **FR-007**: The global navigation MUST shrink (e.g. 64px → 48px height) and apply a backdrop blur once the visitor has scrolled past the hero (~580px scroll, or when hero leaves the viewport).
- **FR-008**: The tech-stack badge grid on the hero MUST be replaced by a "manifest block" rendered as a mono `[✓] PACKAGE` list. The block is static at rest; every ~12 seconds (see §Resolved 5), the block cursor moves to a random line and re-types just that line in place via a 600ms CSS keyframe. Content is identical before and after re-type — the re-type is the "alive terminal" signal.
- **FR-009**: When `prefers-reduced-motion: reduce` is set, the page MUST suppress all of the following: the boot-sequence typing (replace with static final state), the block-cursor blink, the scanline drift (scanlines remain visible, static), the manifest line re-type interval, the scroll-wipe clip-path reveals, the magnetic-offset hover, and the cursor halo. Static composition MUST remain visually coherent — no element appears broken or in mid-animation.

**Theme & Accessibility Compatibility**

- **FR-010**: All 35 currently-installed DaisyUI themes (including the two custom `turtlewolfe-dark` and `turtlewolfe-light`) MUST remain selectable and visually correct after the overhaul. A 36th custom theme (`turtlewolfe-crt`) is added by this feature, bringing the total to 36 themes — none of the existing 35 are removed or repurposed. New visual layers MUST consume theme tokens (`--color-primary`, `--color-accent`, `--color-base-*`, etc.) rather than hardcoded colors. Phosphor green / amber / critical-red phosphor colors are scoped to the `turtlewolfe-crt` theme block only — never hardcoded elsewhere.
- **FR-011**: The home page MUST meet WCAG AA contrast in every theme, in every interactive state (default, hover, focus, active, disabled). Focus rings MUST use `var(--color-primary)` at 2px dashed stroke with 4px offset — this resolves to phosphor green in `turtlewolfe-crt`, dark slate in `turtlewolfe-light`, etc. — and the resulting contrast MUST be verified at AA against the active theme's `--color-base-100` for every theme.
- **FR-012**: The existing accessibility features — skip link, font-scale slider, colorblind filter toggle, focus rings — MUST continue to function identically after the overhaul.

**Structural Continuity**

- **FR-013**: The home page MUST retain all existing sections — hero, Featured Projects, More Work, Stats+Demos, Services Preview, Certifications, Community & Teaching, CTA banner — and MUST retain the existing project data and copy. The overhaul is visual, not content-restructuring.
- **FR-014**: Every new component introduced by the overhaul MUST be scaffolded via the existing component generator (`pnpm run generate:component`) and MUST ship the full 5-file pattern: `index.tsx`, `Component.tsx`, `Component.test.tsx`, `Component.stories.tsx`, `Component.accessibility.test.tsx`.
- **FR-015**: The page MUST remain compatible with the existing static-export build target (no server-side API routes, no SSR-only image transforms).

**Workflow Gate**

- **FR-016**: Before any implementation work begins, at least three SVG wireframes (one per candidate aesthetic; additional variants permitted during iteration) MUST be generated under `features/enhancements/047-portfolio-visual-overhaul/wireframes/` using the spec-kit wireframe extension. In practice this feature shipped six variants (Editorial Brutalism, Cinematic Dark + Aurora, Retro-Futurist Print, Andor Terminal, NASA Mission Graphic, Nostromo CRT) before sign-off on variant 06.
- **FR-017**: One wireframe (or a documented hybrid composition) MUST be signed off via `/speckit.wireframe.review 047` and the chosen path MUST be written into this spec under a `## UI Mockup` section.
- **FR-018**: Subsequent commands (`/speckit.plan`, `/speckit.tasks`, `/speckit.implement`) MUST honor the signed-off wireframe as a binding constraint and MUST NOT propose visual treatments that contradict it.

### Key Entities

No persistent data entities. This feature is a visual / behavioral overhaul; all existing project data (the `FEATURED_PROJECTS` and `OTHER_PROJECTS` arrays in `src/app/page.tsx`) is preserved unchanged. See [`data-model.md`](data-model.md) for documentation of the existing TypeScript shapes (provided for traceability, not modified by this feature).

---

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: When five design professionals are shown the live first viewport without context and asked "What does this person do?", at least three answer with "designer" or "designer and developer."
- **SC-002**: Largest Contentful Paint completes in under 2.5 seconds on a simulated mobile 4G connection (Lighthouse mobile preset, slow-4G throttling).
- **SC-003**: Cumulative Layout Shift remains below 0.1 across a full scroll-to-bottom session on mobile and desktop.
- **SC-004**: Total Blocking Time remains below 200 milliseconds on the same mobile 4G run.
- **SC-005**: Pa11y reports zero new WCAG AA failures across the five reference themes (turtlewolfe-dark, turtlewolfe-light, cupcake, synthwave, dracula) compared to the pre-overhaul baseline.
- **SC-006**: Playwright end-to-end smoke tests (skip link, theme switcher, navigation, all home-page links resolve) pass on the post-overhaul build.
- **SC-007**: When `prefers-reduced-motion: reduce` is set in the browser, no motion library animation, no canvas/SVG decorative animation, and no marquee scrolling occurs on the home page. Verified by manual DevTools toggle plus an automated Playwright check.
- **SC-008**: The signed-off wireframe path is present in this spec's `## UI Mockup` section before `/speckit.plan` runs.
- **SC-009**: A regression screenshot diff (`/speckit.wireframe.screenshots 047`) between the implemented home page and the signed-off wireframe shows the implemented page covers all callouts present in the wireframe.
- **SC-010**: Every new component ships with the 5-file pattern, validated by the existing CI/CD component-structure check.

---

## Assumptions

- The `motion` library (formerly `framer-motion`) is acceptable as a new dependency and will be installed via Docker (`docker compose exec turtlewolfe pnpm add motion`). It is lazy-loaded where possible to protect LCP.
- The existing custom-built components — `LayeredTurtleWolfeLogo` (spinning gear with mallet + script-tag layers) and `AnimatedLogo` (letter-pop name draw) — remain on-brand and are kept. `LayeredTurtleWolfeLogo` is re-composed into the new `HeroStage` organism inside an inline ASCII box frame. `AnimatedLogo` (letter-pop) is superseded by the new `BootSequence` typewriter and may not appear in the rebuilt hero; it remains available for other pages.
- Inner pages (about, projects/\*, services, contact, blog, themes) inherit the new typography tokens passively but are NOT rebuilt as part of this feature. They may show inconsistency with the home page until a future pass; that is acceptable.
- The wireframe extension's auto-classification will route this feature to its LIGHT theme convention (frontend feature, desktop + mobile mockups side-by-side). If the classifier disagrees, the operator passes `--theme light` explicitly.
- All testing and verification runs in Docker per the repo's mandatory Docker-first policy.

---

## Out of Scope

- Rebuilding inner pages (about, project detail pages, services, contact, blog, themes, accessibility, status).
- Re-enabling Supabase or auth on the portfolio site (it remains in portfolio mode).
- Changing the PWA manifest, service worker, or offline behavior.
- Changing the SVG wireframe extension itself.
- Adding new project case studies or rewriting existing project descriptions.
- Replacing the existing `SpinningLogo` / `AnimatedLogo` / `LayeredTurtleWolfeLogo` brand marks.
- Migrating to a different framework, build target, or hosting platform.

---

## UI Mockup

**Signed off:** 2026-05-16 by Jonathan Pohlner
**Aesthetic direction:** Nostromo CRT (variant 06)
**Wireframe:** [`wireframes/06-nostromo-crt.svg`](wireframes/06-nostromo-crt.svg)
**Issues file:** [`docs/design/wireframes/047-portfolio-visual-overhaul/06-nostromo-crt.issues.md`](../../../docs/design/wireframes/047-portfolio-visual-overhaul/06-nostromo-crt.issues.md)

This wireframe is the binding visual specification for feature 047. `/speckit.plan`, `/speckit.tasks`, and `/speckit.implement` must honor its aesthetic vocabulary:

- **Background:** near-black phosphor deck `#050907` with radial corner vignette + low-opacity phosphor-green scanline pattern + subtle phosphor bloom on text. NO racing stripes, NO aurora gradients, NO three-band geometric divisions.
- **Palette:** phosphor green `#4ade80` (primary), amber `#fbbf24` (warnings/secondary CTAs), critical red `#f87171` (rare), against near-black `#050907`. Chunky CRT bezel surround in warm dark tones (`#3a3128`, `#2b231b`, `#1a1612`).
- **Typography:** mono-heavy (JetBrains Mono or Space Mono) for everything _except_ the display name "Jonathan Pohlner" which is rendered in a thin / italic-leaning serif (Instrument Serif, Editorial New, or Fraunces) — that one serif element carries enormous visual weight.
- **Hero:** status bar (`MU/TH/UR 6000 :: PORT 3000 :: <timestamp>`), oversized italic-serif name, tagline in mono caps (`GRAPHIC DESIGNER :: FULL-STACK DEVELOPER` with design half brighter), manifest block (`> MANIFEST.LOAD()` followed by `> [✓] REACT  [✓] NEXT  ...`), two CTAs as terminal commands (`> ./contact.sh`, `> ./resume.pdf`), blinking block cursor `█`, "PRESS ANY KEY ▮" prompt.
- **Project cards:** rendered as monitor windows with ASCII line-drawing diagrams of each project — SpokeToWork as a route map, ScriptHammer as a swatch grid, Revit Plugins as a floorplan. ASCII art is decorative; project descriptions provide accessible content.
- **Motion (maximal intensity, all reduced-motion-respecting):** hero boot sequence types in on load (~700ms, see §Resolved 4), block cursor blinks at 1Hz, scanline pattern drifts very slowly (~30s/cycle), manifest block re-types a random line every ~12 seconds (see §Resolved 5), cards reveal on scroll with a "screen wipe" clip-path, phosphor bloom on hover intensifies via CSS transition.
- **Brand mark:** existing `LayeredTurtleWolfeLogo` (silver gear + bronze script-tags + printing mallet) rendered inside an ASCII box frame. No recolor — the silver and bronze metallic gradients read fine against the phosphor deck.
- **Theme integration:** ships as a new DaisyUI theme `turtlewolfe-crt` that becomes the default in portfolio mode. Total themes after this feature: **36** (see §FR-010 and §Resolved 3) — none of the existing 35 are removed or repurposed. Switching to a non-CRT theme renders the same content with that theme's palette (e.g. switching to `dracula` shows a Dracula-themed home page, not a light page). Phosphor colors are scoped to the CRT theme — never hardcoded outside it.
- **Accessibility:** WCAG AA contrast verified (phosphor green on near-black ~12.5:1, amber ~13:1, red ~6.8:1). Focus rings per §FR-011 use `var(--color-primary)` at 2px dashed stroke with 4px offset — resolves to phosphor green in CRT, to the active theme's primary in any other theme. Mono body text at ≥16px. ASCII art carries an accessible description per §R7.

See the `.issues.md` file for the rejected alternatives (variants 01–05).

### Resolved design decisions (binding)

These were the open decisions in the wireframe; they have been resolved and become binding constraints on the implementation:

1. **Display serif:** `Instrument Serif` italic (Google Fonts) — the only serif element on the page. Used for the "Jonathan Pohlner" hero name and project card titles. Loaded via `next/font/google` with `display: swap`. Fallback stack: `Georgia, serif`.
2. **Mono:** `JetBrains Mono` variable (Google Fonts) — used for status bar, manifest block, CTAs, project card labels, ASCII diagrams, and ALL body copy. There is no separate body sans face. The CSS variable `--font-body` is aliased to `--font-mono`. Loaded via `next/font/google`. Fallback stack: `SF Mono, Menlo, Monaco, Consolas, "Courier New", monospace`. The existing `Geist Sans` and `Geist Mono` are removed.
3. **Theme integration:** A new DaisyUI custom theme `turtlewolfe-crt` ships alongside the existing `turtlewolfe-dark`, `turtlewolfe-light`, and the 32 stock DaisyUI themes — bringing the total to **36 themes**, with none removed or repurposed. `turtlewolfe-crt` becomes the default in portfolio mode (set via `ThemeScript.tsx` default fallback). Phosphor green / amber / critical-red CSS variables are scoped to the `turtlewolfe-crt` theme block — never hardcoded outside it.
4. **Boot sequence:** Plays once per page load (no localStorage skip). Five lines, **~700ms total**, typed character-by-character at **~10ms per character + ~30ms inter-line pause** (5 lines × ~22 chars × 10ms + 4 × 30ms = ~1230ms worst case for the longest lines; ~700ms typical):
   ```
   > initiating uplink...
   > authenticated.
   > rendering portfolio...
   > done.
   >
   ```
   Sits above the hero name. Static fallback shows the five lines all at once when `prefers-reduced-motion: reduce` is set.
5. **Manifest refresh cadence:** The MANIFEST.LOAD() output is one block of lines. Every ~12 seconds, the block cursor moves to a randomly-selected line within the manifest and re-types just that line in place via a 600ms CSS `width: 0 → 100%` keyframe. No line content is replaced — the content is identical, the re-type is the "alive terminal" signal. Halts on `prefers-reduced-motion: reduce`.
6. **Background texture:** Horizontal CRT **scanlines** (3-4px stripe, low opacity ~0.05, phosphor-green tint) drift very slowly downward (~30s per cycle, CSS-driven). NOT halftone, NOT microfilm — the wireframe annotation that mentioned "halftone or microfilm" was leftover language from V04 (Andor) and is superseded by this decision. Scanline drift halts on `prefers-reduced-motion: reduce`; scanlines themselves remain visible (static).
7. **Focus ring:** All focusable elements use `var(--color-primary)` at 2px dashed stroke with 4px offset on `:focus-visible`. In `turtlewolfe-crt` this resolves to phosphor green; in other themes it resolves to that theme's primary color. WCAG AA contrast verified per theme against `--color-base-100`.
