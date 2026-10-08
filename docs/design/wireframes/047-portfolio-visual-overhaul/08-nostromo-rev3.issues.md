# Wireframe Review: 08-nostromo-rev3.svg

**Wireframe:** `features/enhancements/047-portfolio-visual-overhaul/wireframes/08-nostromo-rev3.svg`
**Feature:** 047 — Portfolio Visual Overhaul
**Reviewed:** 2026-05-19
**Reviewer:** Jonathan Pohlner (operator)
**Status:** PASS — supersedes 06-nostromo-crt.issues.md

## Decision

**SIGNED OFF as the new binding visual direction for feature 047.**

V08 builds on V06 by layering 6 editorial moves (V07 → vertical edge marker, project monitor in right column, red WARN label, off-axis name, italic-serif tagline, diagonal section divider) and 6 atmospheric layers (phosphor halation glow, single aurora bloom, glass treatment on monitor + CTAs, depth orbs, strong CRT vignette, glowing rule lines).

The previous V06 sign-off (2026-05-16) was attempted in code but rendered too flat — the user reaction was "fucking hideous". V08 is the revised direction: same Nostromo phosphor vocabulary, but with photographic depth and editorial composition that V06's flat-terminal implementation lacked.

## What implementation must honor

### 1. Atmospheric stack (background layers, in order)

1. Phosphor deck gradient `#040806 → #070d0a → #0b1612`
2. Single off-center aurora bloom upper-left: cyan `#22d3ee` at 0.32 opacity fading to transparent (40% green tint at the midpoint)
3. Subtle purple lower-right bloom: `#a855f7` at 0.18 opacity
4. Horizontal scanline pattern: phosphor green `#4ade80` at 0.08 opacity, 1px stripe / 4px period
5. Grain noise overlay (`feTurbulence baseFrequency=0.65`)
6. Strong CRT curvature vignette: corners darken from 50% radius (transparent) to 85% (45% black) to 100% (85% black)

### 2. Phosphor halation on text (CSS filter)

- Standard body text: `filter: blur(3px)` text-shadow ghost layer behind the visible text
- Display name "Jonathan Pohlner": `filter: blur(6px)` cyan `#22d3ee` ghost at 30% opacity underneath, normal green `#4ade80` on top with `filter: blur(3px)` halation
- WARN label + REC indicator + key accent elements get the halation treatment too

### 3. Off-axis hero composition

- Display name "Jonathan Pohlner" pushed ~200-380px right of left column origin (crosses the column gutter, breaks into right column space)
- Italic Instrument Serif at 84px desktop / 36px mobile
- Glowing rule line under the name (cyan `#22d3ee` 2.5px primary + amber `#fbbf24` 1px secondary, both with halation)

### 4. Tagline — italic serif designer / mono developer split

- "Graphic Designer" in italic Instrument Serif at 42px (was mono caps in V06)
- ":: FULL-STACK DEVELOPER" in mono caps amber `#fbbf24` at 14px, 0.8 opacity, tracking-widest
- Credentials line below in mono green `#4ade80` at 12px, 0.65 opacity

### 5. Right-column project monitor (replaces standalone brand mark)

- Outer bezel: dark warm frame `#1a1612` 12px padding with outer phosphor halation bloom
- Inner screen: 400×222px on desktop / 316×140px on mobile
- Top label strip: amber `#fbbf24` at 0.9 opacity, `CH.01 · SPOKETO.WORK · MAP_VIEW.PNG`, glass top-edge highlight
- Screen content: mini SpokeToWork map (grid pattern, route polyline with phosphor halation, glowing route nodes including red `JOB` destination at top-right)
- Internal aurora bloom + scanlines + curvature vignette (the screen itself feels like a real CRT)
- Shimmer band drifting across (decorative; animates in implementation via CSS keyframe)
- Bottom status strip: `▸ ROUTE 14.2KM · 47MIN · ENCRYPTED` + `SIG: -67dB`
- Tag: `CASE_STUDY/01`

### 6. Brand mark — small, corner-anchored, with halo

- Bottom-left of the left column at ~110×110px (was 200-256px in V06)
- Outer cyan halation bloom + soft amber inner glow
- Existing `LayeredTurtleWolfeLogo` (silver gear + bronze script-tags + printing mallet) at center
- Caption: `turtlewolfe` in italic serif + `v15.20.247 · uplink stable` mono subtitle

### 7. Glass CTAs

- Primary `> ./contact.sh`: filled phosphor green button with outer halation bloom (3px glow ring) + top-edge glass highlight (`linear-gradient white→transparent` at 0-14px height)
- Secondary `> ./resume.pdf`: dashed amber outline + frosted interior (subtle `linear-gradient green→cyan` at 0.06-0.02 opacity) + top-edge glass highlight + amber text with halation glow

### 8. Chromatic accent — red WARN + REC

- Magenta-dashed border box: `! WARN: AVAILABLE Q3 2026` in red `#f87171` mono with halation glow
- Pulsing red REC indicator (filled circle + outer halo ring) next to status bar
- These are the ONLY non-green/non-amber elements on the page — single chromatic break breaks the green monotone

### 9. Vertical edge marker

- Right edge of inner deck, rotated -90°
- Text: `№ 047  /  2026.05  /  CRT.HERO.REV3` in mono at 14px, 6px letter-spacing
- 35% opacity phosphor green
- Decorative tick marks every 40px down the edge

### 10. Section divider

- Diagonal phosphor stripe at the bottom of the hero (`polygon` from 0,670 to 1240,665 to 1240,675 to 0,680)
- Two layers: blurred halation (filter glow) + sharp top
- Mono caption pointing down: `━━ SECTION_01 · FEATURED_WORK ━━━━━━━ ↓`

### 11. Depth orbs

- 9 small circles distributed across the deck at 1.2-2.5px radius
- Three opacity layers: brightest (0.5-0.65) for "front", mid (0.3-0.45), dimmest (0.15-0.30)
- Mix of white, cyan, purple, green
- Suggests parallax depth without animation

### Accessibility constraints (carry-over from V06)

- WCAG AA contrast verified: phosphor green on near-black `#4ade80` / `#050907` = ~12.5:1; amber `#fbbf24` on `#050907` = ~13:1; red `#f87171` on `#050907` = ~6.8:1
- `prefers-reduced-motion: reduce` suppresses: shimmer drift, scanline drift, cursor blink, manifest retype, boot-sequence typing, magnetic hover. Static composition remains coherent with all halation glow visible (it's a static effect, not motion).
- Focus rings: dashed `var(--color-primary)` 2px stroke, 4px offset, on `:focus-visible`
- All ASCII/glyph chars (`█ █ ◆ ▸ ✓` etc.) are decorative — `aria-hidden` on the parents

### Implementation notes

- The phosphor halation in CSS is `text-shadow: 0 0 12px var(--color-primary)` for body text and `text-shadow: 0 0 24px var(--color-primary), 0 0 6px var(--color-primary)` for the display name
- Aurora bloom is a single fixed-position `radial-gradient` overlay div, not three rotated rectangles
- Glass top-edge highlight is `linear-gradient(180deg, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.14) 6%, rgba(255,255,255,0.03) 100%)`
- Depth orbs animate via CSS keyframes drifting 4-8px over 12-30s; suppressed by reduced-motion
- The project monitor uses the existing `ProjectShowcaseCard` component composed with a new `CrtMonitor` wrapper

## Carry-overs from V06 still binding

- Display serif: Instrument Serif italic
- Mono: JetBrains Mono variable
- Theme integration: `turtlewolfe-crt` is the 36th DaisyUI theme, set as portfolio-mode default
- Boot sequence: 5 lines, ~700ms, page-load only
- Manifest: 12 items, random-line retype every ~12s

## Sign-off

**Status:** PASS — supersedes 06-nostromo-crt.issues.md as the binding visual direction
**Signed off by:** Jonathan Pohlner
**Date:** 2026-05-19
