# Implementation Plan: Portfolio Visual Overhaul

**Branch**: `feat/portfolio-visual-overhaul`
**Date**: 2026-05-17
**Spec**: [spec.md](spec.md)
**Wireframe (signed off)**: [wireframes/06-nostromo-crt.svg](wireframes/06-nostromo-crt.svg)
**Issues file**: [docs/design/wireframes/047-portfolio-visual-overhaul/06-nostromo-crt.issues.md](../../../docs/design/wireframes/047-portfolio-visual-overhaul/06-nostromo-crt.issues.md)

## Summary

Transform the `turtlewolfe.com` home page from a clean developer portfolio into a Nostromo-CRT-themed showcase that sells Jonathan Pohlner as a senior graphic designer + full-stack developer. The aesthetic — phosphor green on near-black with CRT bezel, JetBrains Mono everywhere except a single italic Instrument Serif for the name, ASCII line-drawing project diagrams, and a maximal-but-respectful motion choreography (boot sequence on load, blinking cursor, scanline drift, manifest refresh, scroll-triggered card "screen wipes") — is the binding visual specification from the signed-off wireframe.

Scope: home page (`src/app/page.tsx`) + shared chrome (`GlobalNav.tsx`, `Footer.tsx`) + new visual primitives (`HeroStage`, `ScrollReveal`, `Marquee`, `GrainOverlay`, `ScanlineOverlay`, `BootSequence`, `BlinkingCursor`, `AsciiDiagram`, `CursorHalo`). Inner pages inherit theme tokens passively but are NOT rebuilt. Ships as a new DaisyUI custom theme `turtlewolfe-crt` set as the portfolio-mode default; all 35 existing themes remain selectable.

## Technical Context

**Language/Version**: TypeScript strict mode, ES2022 target, React 19, Next.js 15 (App Router, static export)
**Primary Dependencies**:

- **New**: `motion` (formerly framer-motion) for scroll triggers / parallax / stagger choreography
- **New (fonts)**: `Instrument Serif` italic + `JetBrains Mono` variable, both via `next/font/google` with `display: swap`
- **Existing**: Tailwind CSS 4, DaisyUI (35 themes), the existing 5-file component generator (plopfile.js), the existing brand SVGs (`turtlewolfe-logo.svg`, `printing-mallet.svg`, `script-tags.svg`), the existing `LayeredTurtleWolfeLogo` and `AnimatedLogo` components, the existing `ThemeScript` for theme cross-tab sync
- **Removed**: `Geist Sans` and `Geist Mono` (replaced by JetBrains Mono + Instrument Serif)

**Storage**: N/A (portfolio mode; Supabase disabled)
**Testing**: Vitest (unit), Playwright (E2E, local-only), Pa11y (a11y in CI), Storybook (component documentation), jest-axe (component a11y tests)
**Target Platform**: Static export to GitHub Pages (`turtlewolfe.com` via custom-domain CNAME). Modern browsers (Chrome/Edge/Firefox/Safari latest 2 versions). Mobile-first 320px+.
**Project Type**: Single-project static SPA (Next.js App Router static export). No backend changes.
**Performance Goals**: LCP < 2.5s on simulated mobile 4G; CLS < 0.1; TBT < 200ms; Lighthouse Performance ≥ 90.
**Constraints**:

- WCAG AA contrast in every theme, in every state (already at AAA in the chosen Nostromo palette: phosphor green on near-black ~12.5:1; amber on near-black ~13:1; red on near-black ~6.8:1).
- `prefers-reduced-motion: reduce` must suppress: boot sequence, cursor blink, scanline drift, manifest refresh, scroll-wipe reveal, parallax, magnetic hover, cursor halo. Static composition must remain coherent.
- Touch targets ≥ 44px (mobile-first).
- Static-export-safe: no server API routes, no SSR-only image transforms.
- Docker-first: all installs and tests run inside the container per CLAUDE.md mandate.
- 5-file component pattern enforced via CI/CD.

**Scale/Scope**:

- 1 page rebuilt (home page, ~617 lines today)
- 2 shared chrome components touched (GlobalNav, Footer)
- ~9 new components scaffolded (each = 5 files = ~45 new files)
- 1 new DaisyUI theme registered
- 2 new fonts loaded
- ~25-40 KB JS added (motion library, lazy-loaded)
- ~50 KB fonts added (2 woff2 subsets)

## Constitution Check

Validated against `/home/TurtleWolfe/repos/TurtleWolfe/features/constitution.md`:

| Principle                                                | Status   | Notes                                                                                                                                                                                                       |
| -------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| I. Component Structure Compliance (5-file pattern)       | **PASS** | All ~9 new components will be scaffolded via `pnpm run generate:component`. CI/CD validates structure.                                                                                                      |
| II. Test-First Development (Vitest + Pa11y + Playwright) | **PASS** | Each new component ships `.test.tsx` + `.accessibility.test.tsx` + `.stories.tsx`. Visual regression handled by `/speckit.wireframe.screenshots 047` post-implement.                                        |
| III. PRP / SpecKit Methodology                           | **PASS** | This feature is mid-flow: spec → clarify → wireframe → review → **plan** (now) → checklist → tasks → analyze → implement. Wireframe sign-off is recorded in spec.md.                                        |
| IV. Docker-First Development                             | **PASS** | All commands (`docker compose exec turtlewolfe pnpm add motion`, `pnpm test`, `pnpm run dev`, `pnpm exec playwright test`, git commits) run inside the container. No host pnpm/npm installs.                |
| V. Progressive Enhancement                               | **PASS** | Static composition is fully functional with motion suppressed; motion library lazy-loaded; cursor halo and magnetic hover disabled on coarse pointers and reduced-motion; PWA / offline behavior untouched. |
| VI. Privacy & Compliance First                           | **PASS** | No new data collection, no new third-party services, no new tracking. Portfolio mode has no Supabase, no analytics gating changes.                                                                          |

**Static export constraint**: Confirmed. No server API routes added. All new state is client-only React + CSS. Boot-sequence timing and manifest refresh are local `useState`/`useEffect` only.

**Gate result**: **PASS** — proceed to Phase 0 research.

## Project Structure

### Documentation (this feature)

```
features/enhancements/047-portfolio-visual-overhaul/
├── spec.md              # ✅ written (with signed-off UI Mockup section)
├── plan.md              # ✅ this file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (N/A — no data entities; will be a stub)
├── quickstart.md        # Phase 1 output (how to dev/test locally)
├── contracts/           # Phase 1 output (N/A — no API contracts; will be a stub)
├── checklists/
│   └── requirements.md  # ✅ written (16/16 quality items pass)
├── wireframes/
│   ├── 01-editorial-brutalism.svg     # rejected reference
│   ├── 02-cinematic-aurora.svg        # rejected reference
│   ├── 03-retro-futurist-print.svg    # rejected reference
│   ├── 04-andor-terminal.svg          # rejected reference
│   ├── 05-nasa-mission-graphic.svg    # rejected reference
│   └── 06-nostromo-crt.svg            # ✅ SIGNED OFF
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

This is **Option 1: Single project (Next.js App Router static export)**. No backend, no separate frontend/backend split, no mobile native code.

```
src/
├── app/
│   ├── page.tsx                       # ✏️  REBUILT — Nostromo CRT hero + cards
│   ├── layout.tsx                     # ✏️  TOUCH — register Instrument Serif + JetBrains Mono via next/font, remove Geist
│   ├── globals.css                    # ✏️  TOUCH — add CRT theme tokens, scanline keyframes, prefers-reduced-motion gate
│   └── (other pages)/                 #     UNTOUCHED (inner pages inherit theme tokens passively)
├── components/
│   ├── GlobalNav.tsx                  # ✏️  TOUCH — scroll-shrink + backdrop blur using motion
│   ├── Footer.tsx                     # ✏️  TOUCH — CRT-styled, "designed and built by Jonathan" credit
│   ├── ThemeScript.tsx                # ✏️  TOUCH — add `turtlewolfe-crt` to theme list, set as portfolio default
│   ├── atomic/
│   │   ├── BlinkingCursor/            # ✨ NEW — 5-file
│   │   ├── ScanlineOverlay/           # ✨ NEW — 5-file
│   │   ├── GrainOverlay/              # ✨ NEW — 5-file (general-purpose subtle grain)
│   │   ├── CursorHalo/                # ✨ NEW — 5-file (phosphor glow, fine-pointer only)
│   │   ├── AsciiDiagram/              # ✨ NEW — 5-file (renders route/swatch/floorplan ASCII art with aria-label)
│   │   ├── SpinningLogo/              #     UNTOUCHED (existing)
│   │   ├── AnimatedLogo/              #     UNTOUCHED (existing) — may not be used in CRT hero (the boot sequence replaces the letter-pop)
│   │   └── LayeredTurtleWolfeLogo/    #     UNTOUCHED (existing) — rendered inside ASCII box frame on hero
│   ├── molecular/
│   │   ├── BootSequence/              # ✨ NEW — 5-file (types in 5 lines on load, ~700ms)
│   │   ├── Marquee/                   # ✨ NEW — 5-file (manifest refresh: re-types random line every ~12s)
│   │   ├── ScrollReveal/              # ✨ NEW — 5-file (screen-wipe clip-path on viewport enter)
│   │   ├── ProjectShowcaseCard/       # ✏️  REBUILT — variant prop for CRT (ASCII diagram + phosphor border + hover bloom)
│   │   └── CTABanner/                 #     UNTOUCHED (existing)
│   ├── organisms/
│   │   └── HeroStage/                 # ✨ NEW — 5-file (composes status bar + name + tagline + manifest + CTAs + bezel)
│   └── (subatomic, templates, etc.)/  #     UNTOUCHED
├── lib/
│   └── (no new files)
├── hooks/
│   ├── useReducedMotion.ts            # ✨ NEW (small) — reads matchMedia, returns boolean, SSR-safe
│   └── (existing)                     #     UNTOUCHED
└── types/
    └── (no new files)

tests/
├── unit/                              # +1 file per new component (vitest)
├── e2e/
│   └── crt-theme-smoke.spec.ts        # ✨ NEW — verify skip link, theme switch CRT↔dark, all home-page links resolve, prefers-reduced-motion observed
└── (other paths)/                     #     UNTOUCHED

docker/                                #     UNTOUCHED
public/                                #     UNTOUCHED (brand SVGs reused)
```

**Structure Decision**: Single-project Next.js App Router static export. New components scaffolded via the existing plopfile (`pnpm run generate:component`) into `src/components/{atomic,molecular,organisms}/`. The home page (`src/app/page.tsx`) is rewritten to compose the new components rather than holding the visual treatment inline. Inner pages (`/about`, `/projects/*`, `/services`, `/contact`, `/blog`, `/themes`) inherit the new `turtlewolfe-crt` theme tokens passively but are not rebuilt — they will show inconsistency vs. the home page until a future pass, which is acceptable per spec scope.

## Phase 0: Outline & Research

Output: [`research.md`](research.md)

Tasks (all to be answered in research.md):

1. **Motion library selection** — Confirm `motion` v11+ (the new package name for framer-motion) over alternatives (GSAP, native CSS, Lottie). Document bundle-size impact and lazy-load strategy.
2. **Boot-sequence typewriter implementation** — Pure CSS keyframe approach vs. `useEffect`-driven character append. Document the chosen approach, why, and how it respects `prefers-reduced-motion`.
3. **Manifest refresh ("re-type random line every 12s") implementation** — `setInterval` + `useState` + crossfade vs. SSR-safe approach. Document hydration safety.
4. **DaisyUI custom theme registration for `turtlewolfe-crt`** — How does DaisyUI 5 handle additional `@plugin "daisyui/theme"` blocks in globals.css; confirm 36-theme limit not hit; document the theme's color tokens.
5. **Static-export safety check for the boot sequence** — Confirm the typewriter does not block LCP (the boot sits ABOVE the name; LCP is the name itself). Document the timing.
6. **`prefers-reduced-motion` cascade strategy** — Single `@media` block + JS detection via `useReducedMotion` hook; how to compose so that BOTH disable motion (defense in depth).
7. **ASCII diagram accessibility** — `aria-label` content and structure; should the ASCII chars be `aria-hidden="true"` with a sibling visually-hidden description? Document the chosen pattern.
8. **next/font configuration for Instrument Serif italic + JetBrains Mono variable** — Subset, weight ranges, fallback stack. Document the loading strategy.
9. **CRT theme as portfolio-mode default** — How is "portfolio mode" detected? It's currently a static flag (no Supabase). Document where the default-theme decision happens (ThemeScript.tsx) and how it falls back if localStorage already has a different theme.
10. **Performance budget verification** — Calculate expected LCP/CLS/TBT impact of: 2 new fonts, motion lib (lazy), 9 new components. Document the budget plan.

## Phase 1: Design & Contracts

Outputs:

- [`data-model.md`](data-model.md) — stub (no data entities)
- [`contracts/`](contracts/) — stub (no API contracts)
- [`quickstart.md`](quickstart.md) — how to bring up the redesigned site locally and verify each acceptance scenario

### Entities (data-model.md)

No persistent data. The only "model" is the project showcase data, which already exists as inline `FEATURED_PROJECTS` and `OTHER_PROJECTS` arrays in `src/app/page.tsx`. The overhaul preserves the shape of these arrays unchanged. `data-model.md` will document the existing shape for reference only:

- **Project**: `{ title, description, image: { src, alt }, stack: readonly string[], href: string, hasDetailPage?: boolean }`

### Contracts (contracts/)

No API contracts. This is a purely client-side static page. `contracts/` will contain a single `README.md` stating "N/A — static page, no APIs."

### Quickstart (quickstart.md)

Step-by-step verification of every acceptance scenario from spec.md US-001 through US-003 (US-004 is already complete — wireframe signed off):

- Spin up dev: `docker compose exec turtlewolfe pnpm run dev` → http://localhost:3000
- US-001 verification: visual check of first viewport on desktop + mobile + reduced-motion
- US-002 verification: scroll-to-bottom recording on desktop + mobile + reduced-motion
- US-003 verification: cycle through 5 themes + Pa11y + font scale + colorblind filter
- E2E run: `docker compose exec turtlewolfe pnpm exec playwright test`
- Lighthouse mobile/4G run with budget checks

### Agent context update

This repo's `.specify/scripts/bash/update-agent-context.sh` does not exist (verified). The Claude-facing context (`CLAUDE.md` files) is already up-to-date and does not need modification for this feature — the existing repo CLAUDE.md and features/CLAUDE.md already cover Docker-first, 5-file pattern, SpecKit workflow, static-export constraint. No agent-context update required.

## Re-evaluate Constitution Check post-design

Status: **PASS** (no design choices in Phase 1 violate the constitution).

## Complexity Tracking

No constitutional violations to justify. Table is empty.

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| (none)    | (none)     | (none)                               |

## Stop point

This `/speckit.plan` run ends here. Next commands in order:

1. `/speckit.checklist 047` — generate `checklists/implementation.md` covering 5-file pattern checks, font loading, motion lib install, theme registration, a11y, Lighthouse, E2E.
2. `/speckit.tasks 047` — generate `tasks.md` with dependency-ordered implementation tasks.
3. `/speckit.analyze 047` — cross-artifact consistency check across spec.md, plan.md, tasks.md.
4. `/speckit.implement 047` — execute the implementation plan.
