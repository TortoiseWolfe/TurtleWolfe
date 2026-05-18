# Quickstart: Portfolio Visual Overhaul

**Feature:** 047
**Phase:** 1
**Audience:** developer running the implemented build locally for verification

## Prerequisites

- Docker + Docker Compose installed
- Repo cloned at `/home/TurtleWolfe/repos/TurtleWolfe`
- `.env` populated (no Supabase secrets required for portfolio mode)
- Currently on branch `feat/portfolio-visual-overhaul`

## Bring up the dev server

```bash
docker compose up
# in another shell:
docker compose exec turtlewolfe pnpm run dev
```

Then open http://localhost:3000.

## Verify each acceptance scenario

### US-001 — Art Director's First Impression

**Desktop (1440 width):**

1. Open http://localhost:3000 in a fresh incognito window (no localStorage)
2. Confirm the page loads in `turtlewolfe-crt` theme by default (near-black phosphor deck)
3. Confirm the boot sequence (`> initiating uplink...` ... `> done.`) types in over ~700ms
4. Confirm the hero name "Jonathan Pohlner" renders in italic Instrument Serif at ~84px
5. Confirm the tagline "GRAPHIC DESIGNER :: FULL-STACK DEVELOPER" renders in JetBrains Mono caps with the design half visibly brighter (phosphor green) than the developer half (dimmer phosphor / amber)
6. Confirm the manifest block (`> MANIFEST.LOAD()` + `[✓] REACT [✓] NEXT ...`) is fully rendered
7. Wait ~12 seconds; confirm a random manifest line re-types in place

**Mobile (375 width):**

1. DevTools → device emulation → iPhone 13 (or 375×812)
2. Repeat steps above; confirm all elements stack vertically, no horizontal scroll, all touch targets ≥ 44px
3. Confirm boot sequence + manifest retype both fire on mobile

**Reduced-motion:**

1. DevTools → Rendering → Emulate CSS media feature `prefers-reduced-motion: reduce`
2. Reload page
3. Confirm boot sequence renders the 5 lines all at once (no typing)
4. Confirm block cursor `█` does not blink
5. Confirm manifest does NOT re-type lines (no flicker)
6. Confirm scanlines are present but do not drift
7. Confirm scroll-triggered card reveals are static (no clip-path wipe animation)

### US-002 — Scrolling Through Projects

**Desktop:**

1. From the hero, scroll down at a natural reading pace
2. Confirm GlobalNav shrinks (height ~64px → ~48px) and gains a backdrop-blur once the hero leaves the viewport
3. Confirm the "Featured Projects" section enters the viewport; each card reveals with a left-to-right "screen wipe" (clip-path animation) staggered by ~80ms
4. Hover each card; confirm:
   - The card lifts by ~4px (motion-driven magnetic offset)
   - The phosphor border intensifies (from ~30% opacity to 100%)
   - A faint phosphor bloom appears around the card
   - The ASCII diagram inside the card remains legible
5. Continue scrolling through More Work, Stats+Demos, Services, Certifications, Community, CTA — each section reveals with similar stagger
6. Confirm the Footer reads `designed and built by Jonathan` in JetBrains Mono caps with a decorative ASCII mark

**Mobile:**

1. Repeat scroll on mobile emulation
2. Confirm hover effects DO NOT fire (coarse pointer)
3. Confirm magnetic offset is disabled
4. Confirm cursor halo is not present on mobile

**Reduced-motion:**

1. With the media-query emulator set
2. Confirm cards appear in place (no screen-wipe) as you scroll
3. Confirm GlobalNav still shrinks (this is a style change, not a motion choreography — acceptable to keep)

### US-003 — Theme & Accessibility Compatibility

**Theme cycle (5 themes):**

1. Click the theme switcher in GlobalNav
2. Select each in sequence: `turtlewolfe-crt` (default), `turtlewolfe-dark`, `turtlewolfe-light`, `cupcake`, `synthwave`, `dracula`
3. At each theme: confirm the home page recolors entirely (no element retains the previous theme's color)
4. Confirm the boot sequence + manifest + ASCII diagrams remain legible in every theme (text colors come from theme tokens, not hardcoded)
5. Switch back to `turtlewolfe-crt`

**Font scale:**

1. Open the existing font-scale slider in GlobalNav
2. Increase scale to maximum
3. Confirm all text scales proportionally (display name, tagline, body, manifest, project cards) without layout breaks

**Colorblind filter:**

1. Toggle the existing colorblind filter
2. Confirm all critical information (project titles, CTAs) remains identifiable

## Run the full test suite

```bash
docker compose exec turtlewolfe pnpm run test:suite
# Vitest (unit) + Pa11y (a11y) + jest-axe (component a11y) — all green
```

## Run E2E

```bash
docker compose exec turtlewolfe pnpm exec playwright test
# Should cover: skip link works, theme switcher cycles, all home-page links resolve, prefers-reduced-motion observed
```

## Lighthouse mobile + slow-4G

```bash
docker compose exec turtlewolfe pnpm run build
docker compose exec turtlewolfe pnpm run start
# In another shell or via Chrome DevTools:
#   Lighthouse → mobile preset → slow-4G throttling → Analyze page load
# Take median of 3 runs.
# Targets:
#   - LCP < 2.5s
#   - CLS < 0.1
#   - TBT < 200ms
#   - Performance ≥ 90
```

## Wireframe regression check

```bash
# Once the build is up at localhost:3000:
/speckit.wireframe.screenshots 047
# Capture the rendered home page, diff against the signed-off wireframe.
# Diff should show: all callouts in wireframe present in implementation.
```

## Production build verification

```bash
docker compose exec turtlewolfe pnpm run build
# Confirms static export succeeds, out/ directory populated, no SSR-only paths.
# Verify out/index.html contains the Nostromo CRT chrome.
```

## Commit

```bash
docker compose exec turtlewolfe git add -A
docker compose exec turtlewolfe git commit -m "feat(047): portfolio visual overhaul — Nostromo CRT"
git push  # from host (operator only)
```
