# Wireframe Review: 06-nostromo-crt.svg

**Wireframe:** `features/enhancements/047-portfolio-visual-overhaul/wireframes/06-nostromo-crt.svg`
**Feature:** 047 — Portfolio Visual Overhaul
**Reviewed:** 2026-05-16
**Reviewer:** Jonathan Pohlner (operator)
**Status:** PASS

## Decision

**SIGNED OFF as the binding visual direction for feature 047.**

This wireframe (variant 06, Nostromo CRT) is chosen over variants 01 (Editorial Brutalism), 02 (Cinematic Dark + Aurora), 03 (Retro-Futurist Print), 04 (Andor Terminal), and 05 (NASA Mission Graphic). All five non-chosen variants remain in the `wireframes/` folder for reference; they will not drive implementation.

## What the implementation must honor

The implementation phase (`/speckit.plan` → `/speckit.tasks` → `/speckit.implement`) must produce a home page whose first viewport and project cards visually correspond to this wireframe's vocabulary:

### Palette (consumed via theme tokens, not hardcoded)

- Phosphor green primary: `#4ade80` (warm phosphor, not lime)
- Amber accent: `#fbbf24` (warnings, secondary CTAs, checkmarks)
- Critical red: `#f87171` (rare, errors only)
- Near-black deck: `#050907`
- Slight lift surfaces: `#0a1410`, `#0e1f17`
- Chunky bezel layers (CRT surround): `#3a3128`, `#2b231b`, `#1a1612`

These map to the existing DaisyUI theme system. New CSS variables (`--phosphor`, `--phosphor-amber`, `--phosphor-critical`, `--phosphor-deck`) sit alongside theme tokens and recolor when the user switches themes — the Nostromo green palette becomes the default for the new `turtlewolfe-crt` theme, but every other theme remains valid.

### Typography

- **Display (name "Jonathan Pohlner"):** a thin / italic-leaning serif (humanizing contrast to the mono around it — the wireframe used `serif italic`; the implementation should pin a specific face such as `Instrument Serif` italic, `Editorial New`, or `Fraunces` italic). 70-80px desktop, 36-40px mobile.
- **Mono everywhere else:** `JetBrains Mono` variable (pinned in spec §Resolved 2) for the status bar, manifest, CTAs, project card labels, ASCII diagrams, AND body copy.
- **No sans-serif body face.** The page is intentionally mono-heavy — that _is_ the aesthetic. `--font-body` is aliased to `--font-mono` in CSS; FR-002 was updated to allow this (display + mono only, no third face).

### Background & atmosphere

- Near-black `#050907` deck with a radial vignette to `#000` at corners (CRT screen-curvature hint)
- Subtle scanline pattern (3-4px stripe, opacity ~0.05, phosphor green tint)
- Faint phosphor bloom on text (CSS `text-shadow` with low blur, phosphor green at low opacity)
- NO racing stripes, NO aurora gradients, NO three-band geometric divisions
- Optional lived-in element: a single faint smudge / off-register text spot to read "real CRT" rather than "stock template"

### Hero composition

- Top status bar: `MU/TH/UR 6000 :: PORT 3000 :: ` plus live timestamp
- Display name (the only serif element on the page) large, slightly italic
- Tagline in mono caps: `GRAPHIC DESIGNER  ::  FULL-STACK DEVELOPER` — design half in brighter phosphor, developer half in dimmer phosphor
- Manifest block (replacing tech-stack badges):
  ```
  > MANIFEST.LOAD()
  > [✓] REACT     [✓] NEXT      [✓] TS
  > [✓] NODE      [✓] THREE.JS  [✓] C#
  > ... etc
  ```
- Two CTAs as terminal commands: `> ./contact.sh` (filled phosphor) and `> ./resume.pdf` (outlined dashed amber)
- Blinking block cursor `█` somewhere prominent
- "PRESS ANY KEY ▮" prompt at the bottom of the hero region

### Project cards

Each project card renders as a "monitor window" with:

- A header strip like a window title bar
- ASCII line-drawing diagram of the actual project:
  - **SpokeToWork** — ASCII route map with `●` nodes, `─ │ ┌ ┐ └ ┘ ├ ┤` edges, `◆` destination
  - **ScriptHammer** — ASCII swatch grid using `▓ ▒ ░` density blocks
  - **Revit Plugins** — ASCII floorplan with box-drawing characters, labeled rooms
- Project title in serif italic (matches display name)
- Stack tags in mono
- Hover: amber border lift + faint phosphor bloom intensifies; no glass, no shimmer

### Motion choreography

The wireframe is static, but the spec promises maximal-intensity motion. Specifically for the Nostromo direction:

- Hero "boot sequence": status bar types in character-by-character on page load (use motion library, ~600ms total)
- Block cursor `█` blinks at 1Hz
- Scanline pattern drifts slowly downward (very slow, ~30s per cycle) — halts on `prefers-reduced-motion`
- Phosphor bloom on hover intensifies via CSS transition (no JS)
- Cards reveal on scroll with a subtle "screen wipe" (clip-path animation from left)
- Marquee replaced by the manifest block which "refreshes" — one line scrolls/replaces every ~4 seconds
- All motion respects `prefers-reduced-motion: reduce`

### Brand mark

The existing `LayeredTurtleWolfeLogo` (silver gear + bronze script-tags + printing mallet) stays as the brand mark, but rendered inside an ASCII box frame on the page:

```
┌─────────────┐
│  ╔═══════╗  │
│  ║ [LOGO] ║ │
│  ╚═══════╝  │
└─────────────┘
```

The silver + bronze metallic gradients of the existing SVG read fine against the near-black phosphor deck — no recolor needed.

### Accessibility constraints (non-negotiable)

- WCAG AA contrast: phosphor green `#4ade80` on near-black `#050907` is ~12.5:1 (passes AAA). Amber `#fbbf24` on `#050907` is ~13:1. Red `#f87171` on `#050907` is ~6.8:1 (passes AA).
- Focus rings: `var(--color-primary)` at 2px dashed stroke with 4px offset on `:focus-visible`. In `turtlewolfe-crt` this resolves to phosphor green; in any other theme (cupcake, dracula, etc.) it resolves to that theme's primary color. Contrast verified per theme against `--color-base-100` to meet AA. Pinned in spec §FR-011.
- `prefers-reduced-motion: reduce` kills: cursor blink, scanline drift, boot sequence, manifest refresh, card reveal. Static composition remains coherent.
- Mono fonts at body size must hit 16px minimum (mono is heavier visually, so 14px reads as 12px — bump it).
- ASCII art in project cards must have `aria-label` describing the project (the visual is decorative; the description is the accessible content).
- All 35 existing DaisyUI themes remain selectable. The Nostromo palette ships as a new theme `turtlewolfe-crt`; switching to e.g. `cupcake` reverts to a light-themed home page with the same content but without the phosphor treatment. The implementation must NOT hard-code the phosphor green outside the new theme's scope.

## What was rejected from other variants (and why not picked)

- **V01 Editorial Brutalism** — reads as designer, but doesn't carry the "developer" half well. The hand-drawn ink scribbles felt too analog for a developer portfolio.
- **V02 Cinematic Dark + Aurora** — the touched-up version was close but the aurora bloom (even after revision) still reads as "stock template tries hard."
- **V03 Retro-Futurist Print** — the cyan+magenta riso misregister was a strong move but reads more "design school" than "shipping engineer."
- **V04 Andor Terminal** — closest second. Muted ochre/oxblood is gorgeous but a portfolio that looks like a confidential dossier raises trust friction.
- **V05 NASA Mission Graphic** — Saul Bass corner block + telemetry strip is elegant, but reads as nostalgia rather than working terminal. Risks looking like a Wes Anderson pastiche.

V06 Nostromo wins because it commits hardest to a single coherent fiction (you are looking at a working terminal on a 1979 spaceship), the green-on-black is legible and high-contrast, the ASCII project diagrams give every card a unique visual identity, and the mono-heavy treatment lets the one serif (the name) carry enormous weight.

## Open design decisions — RESOLVED 2026-05-17

The wireframe itself has no patch/regenerate issues. The five open design decisions that the implementation phase needed to resolve have been answered:

1. **Display serif:** **Instrument Serif italic** (Google Fonts, ~12KB). The only serif element on the page. Used for "Jonathan Pohlner" hero name and project card titles.
2. **Mono:** **JetBrains Mono** (Google Fonts, ~30KB variable). Used for status bar, manifest, CTAs, project card labels, ASCII diagrams, all body copy.
3. **Theme integration:** Ship `turtlewolfe-crt` as a new DaisyUI custom theme alongside the existing `turtlewolfe-dark` and `turtlewolfe-light`. Set `turtlewolfe-crt` as the default in portfolio mode. All three custom themes plus 32 stock DaisyUI themes remain selectable (35 total preserved).
4. **Boot sequence:** Short & playful, ~700ms total, 5 lines:
   ```
   > initiating uplink...
   > authenticated.
   > rendering portfolio...
   > done.
   >
   ```
   Types in once on page load (every visit, no localStorage skip — keep it simple for portfolio mode). Halts on `prefers-reduced-motion: reduce`.
5. **Manifest refresh cadence:** The whole MANIFEST.LOAD() output is one block. Every ~12s, the block cursor moves to a random line within the manifest and re-types that line in place. Feels alive but not distracting. Halts on `prefers-reduced-motion: reduce`.

## Classification

Per `features/CLAUDE.md`:

- All issues above are open design decisions, not patch/regenerate items.
- Wireframe status: **PASS** — no patches or regenerations required.
- Downstream commands (`/speckit.plan`, `/speckit.tasks`, `/speckit.implement`) are unblocked.

## Sign-off

**Status:** PASS
**Signed off by:** Jonathan Pohlner
**Date:** 2026-05-16
