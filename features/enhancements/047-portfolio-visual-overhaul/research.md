# Research: Portfolio Visual Overhaul

**Feature:** 047 — Portfolio Visual Overhaul
**Phase:** 0 (research)
**Date:** 2026-05-17

## R1. Motion library selection

**Decision:** Install `motion` v11+ (the renamed framer-motion package).

**Rationale:**

- Ships ~30KB gz with tree-shaking; the components we use (`useScroll`, `useTransform`, `useInView`, `motion.div` with `whileInView` + `whileHover`) are the smallest viable subset.
- React 19 compatible (the renamed `motion` package targets React 19 first-class; `framer-motion@^11` is the same lib pre-rename).
- Lazy-loadable: hero and project cards are above-the-fold but the motion library can defer until after first paint via dynamic `import()` in the components that need it.
- No SSR hydration foot-guns for the scroll/hover hooks we plan to use.

**Alternatives considered:**

- **GSAP** — Powerful but ~70KB gz minimum, license complexity for paid plugins, overkill for our scope.
- **Native CSS only** — Possible for boot sequence (CSS `@keyframes typing` trick) but cumbersome for scroll-triggered card reveals at scale; ends up writing IntersectionObserver glue by hand.
- **Lottie** — Wrong tool; we're not rendering After Effects exports.
- **Auto-animate** — Too narrow for our needs (only handles list reorders).

**Implementation note:** Install via Docker: `docker compose exec turtlewolfe pnpm add motion` per CLAUDE.md Docker-first mandate.

---

## R2. Boot-sequence typewriter implementation

**Decision:** `useEffect`-driven character-append in the `BootSequence` component (no library). Two `useState` values: `currentLine` (index 0-4) and `currentChar` (index into the active line's text). A `setInterval` ticks every **~10ms** appending one character; when the line completes, advance `currentLine` after a **~30ms** pause; when all 5 lines are typed, clear the interval. Total elapsed: **~700ms typical, ~1.2s worst case** for ~110 characters of text. (Original 30ms/char + 60ms inter-line math gave ~3.5s, which contradicted the spec's "~700ms total" target; tightened to 10ms/30ms to honor the spec.)

**Rationale:**

- Pure CSS `width: 0 → width: 100%` typing tricks require a fixed text width (font-monospace makes this tractable but still brittle on mobile where text reflows).
- `useEffect` approach is ~25 lines of code, no dependency, SSR-safe (the component renders the fully-typed text on server, then JS replays the typing on hydration — the user sees the final state if JS is disabled, types the animation if JS is enabled).
- `prefers-reduced-motion: reduce` short-circuits the effect: render all 5 lines fully on mount, skip the interval.

**Alternatives considered:**

- **typed.js library** — ~5KB, but a dependency for one component is bad ratio.
- **CSS-only** — Doesn't survive responsive reflow.

**SSR strategy:** Component renders the final state by default. A `useEffect` checks `prefers-reduced-motion`; if false, it resets the rendered text to empty and starts typing. Users without JS see the final text. Users with JS see typing once on first hydration only (no re-trigger on subsequent renders).

---

## R3. Manifest refresh ("re-type random line every 12s")

**Decision:** The `Marquee` component renders the manifest as a list of `<li>` elements (each is one `[✓] PACKAGE` line). A `useEffect` with `setInterval` picks a random index every 12s and triggers a CSS class swap (`.retyping`) on that line. The CSS class drives a 600ms `width: 0 → width: 100%` keyframe to simulate the cursor re-typing the line.

**Rationale:**

- Constant-content re-type (the same characters appear before and after) means no React re-render is needed for the text itself — only a CSS class toggle.
- Cleanup: `clearInterval` in the effect's cleanup.
- Hydration-safe: the random pick happens client-side only (`useEffect`). The first paint shows the manifest fully rendered, no animation in flight.

**Alternatives considered:**

- Re-typing via JS character-append (like R2): expensive at scale + adds GC pressure with `setInterval` running every 30ms vs every 12s.
- No motion at all: lose the "alive terminal" signal that's load-bearing for the aesthetic.

**`prefers-reduced-motion`:** the `useEffect` early-returns if reduced motion is set. The CSS `.retyping` class also has a `@media (prefers-reduced-motion: reduce) { animation: none }` rule (defense in depth).

---

## R4. DaisyUI custom theme registration

**Decision:** Add a third custom `@plugin "daisyui/theme"` block to `src/app/globals.css` for `turtlewolfe-crt`, modeled on the existing `turtlewolfe-dark` block (globals.css:54-93). Register it in the `@plugin "daisyui"` themes array. New total: **36 themes** (3 custom + 32 stock + 1 new = 36; the original 35 are preserved). Set as the page-level default by updating `ThemeScript.tsx` to pick `turtlewolfe-crt` when no localStorage value exists.

**Color tokens (OKLCH, computed from hex via DaisyUI's converter):**

- `--color-base-100`: oklch(8.5% 0.02 150) ≈ `#050907` (near-black phosphor deck)
- `--color-base-200`: oklch(11% 0.025 150) ≈ `#0a1410` (slight lift)
- `--color-base-300`: oklch(14% 0.03 150) ≈ `#0e1f17` (card surface)
- `--color-base-content`: oklch(85% 0.18 145) ≈ `#4ade80` (phosphor green)
- `--color-primary`: oklch(85% 0.18 145) ≈ `#4ade80`
- `--color-primary-content`: oklch(8.5% 0.02 150) ≈ `#050907`
- `--color-secondary`: oklch(82% 0.18 80) ≈ `#fbbf24` (amber)
- `--color-secondary-content`: oklch(15% 0.05 80) ≈ `#1a1612`
- `--color-accent`: oklch(82% 0.18 80) ≈ `#fbbf24`
- `--color-neutral`: oklch(20% 0.03 30) ≈ `#1a1612`
- `--color-info`: oklch(85% 0.18 145) ≈ `#4ade80`
- `--color-success`: oklch(85% 0.18 145) ≈ `#4ade80`
- `--color-warning`: oklch(82% 0.18 80) ≈ `#fbbf24`
- `--color-error`: oklch(72% 0.18 25) ≈ `#f87171`

**Rationale:** The 35-theme cap is not a hard DaisyUI limit; the `@plugin "daisyui"` `themes` array can list arbitrary many. The constitution + spec require all 35 existing themes to remain selectable; adding a 36th is fine.

**Alternatives considered:**

- Replace `turtlewolfe-dark`: explicitly rejected in the issues file.
- Presentation-only (no theme): rejected — fails FR-010 ("all themes recolor consistently").

---

## R5. Boot sequence vs. LCP

**Decision:** The boot sequence renders ABOVE the hero name in the DOM, but the LCP element is the hero name itself (84px italic serif). The boot sequence's typed text is ~14px JetBrains Mono — its visual area is small relative to the name. Therefore the boot sequence does not delay LCP.

**Measurement plan:** Run Lighthouse mobile + slow-4G on the implemented build with and without the boot sequence. If LCP regresses by more than 100ms, push the boot sequence below the name (visually re-stack) or skip on initial render and play in via `requestIdleCallback`.

**Static fallback (JS disabled):** Boot lines render as static text. Hero name renders normally. LCP is identical.

---

## R6. `prefers-reduced-motion` cascade

**Decision:** Defense-in-depth — two independent gates:

1. **CSS gate** — A single block in `globals.css`:
   ```css
   @media (prefers-reduced-motion: reduce) {
     *,
     *::before,
     *::after {
       animation-duration: 0.01ms !important;
       animation-iteration-count: 1 !important;
       transition-duration: 0.01ms !important;
       scroll-behavior: auto !important;
     }
     .scanline-drift,
     .cursor-blink,
     .manifest-retype,
     .boot-typing {
       animation: none !important;
     }
   }
   ```
2. **JS gate** — A new `useReducedMotion` hook (`src/hooks/useReducedMotion.ts`) that reads `window.matchMedia('(prefers-reduced-motion: reduce)').matches` and listens for `change` events. Components that drive JS-based motion (BootSequence, Marquee retype, CursorHalo, scroll parallax in HeroStage) early-return if the hook returns `true`.

**Rationale:** CSS gate handles all keyframes and transitions universally. JS gate prevents starting JS-driven loops at all (saves cycles, doesn't just cap their visual effect). Both together ensure no motion sneaks through.

**Hook contract (`useReducedMotion`):**

- Returns `boolean`.
- SSR-safe: returns `false` on server (no `window`), updates client-side via `useEffect`.
- Reactive: re-renders when user toggles OS-level setting mid-session.

---

## R7. ASCII diagram accessibility

**Decision:** The `AsciiDiagram` component renders a `<pre aria-hidden="true">` containing the ASCII art, paired with a visually-hidden `<span class="sr-only">` containing a prose description of the diagram.

**Example (SpokeToWork route map):**

```tsx
<figure className="ascii-diagram">
  <pre aria-hidden="true">{`
    ●───┐
        ├───●───┐
    ●───┘       │
                ◆
  `}</pre>
  <span className="sr-only">
    Route diagram for SpokeToWork: four origin nodes connect to one destination
    node.
  </span>
</figure>
```

**Rationale:** Box-drawing characters and dot glyphs are non-text content to screen readers (they read each character individually if announced). `aria-hidden` on the `<pre>` removes them from the accessibility tree. The `<span>` provides the semantic equivalent. The `<figure>` element groups them for assistive-tech consumption.

**Alternatives considered:**

- `aria-label` on the `<pre>` directly: works but the prose description belongs in the DOM for SEO and as text users can copy/select.
- SVG rendering of the diagram: heavier, less authentic to the CRT aesthetic.

---

## R8. next/font configuration

**Decision:** Replace the existing `Geist Sans` + `Geist Mono` registration in `src/app/layout.tsx:25-56` with:

```tsx
import { Instrument_Serif, JetBrains_Mono } from 'next/font/google';

const instrumentSerif = Instrument_Serif({
  variable: '--font-display',
  weight: '400',
  style: 'italic',
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Georgia', 'serif'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
  fallback: [
    'SF Mono',
    'Menlo',
    'Monaco',
    'Consolas',
    'Courier New',
    'monospace',
  ],
});
```

The single body font is the mono — `JetBrains_Mono` carries body and `--font-body` aliases to `--font-mono` for clarity:

```css
:root {
  --font-body: var(--font-mono);
}
```

**Rationale:**

- Instrument Serif only ships an italic at weight 400 (it's an italic-only display face by design). One file, ~12KB.
- JetBrains Mono variable font: one file covers weights 100-800, ~30KB.
- Both via Google Fonts (CDN-cached, GDPR-OK when used via next/font which self-hosts the woff2 files at build time — no third-party request at runtime).
- Fallback stack ensures readable text during font load.

**Alternatives considered:**

- Self-hosting downloaded woff2 files: same outcome, more maintenance. `next/font` already self-hosts.

---

## R9. CRT theme as portfolio-mode default

**Decision:** The "portfolio mode" flag is already implicit in the codebase — `useAuth()` returns a safe default when Supabase is absent, and the home page renders without auth. Update `ThemeScript.tsx` (currently at `src/components/ThemeScript.tsx:1-89`) to change the default-theme fallback chain:

**Before:**

```
localStorage.theme → prefers-color-scheme → 'turtlewolfe-dark'
```

**After:**

```
localStorage.theme → 'turtlewolfe-crt'
```

(We drop the `prefers-color-scheme` step because the CRT theme is dark by definition. Users who explicitly want a light theme select it via the existing theme switcher; their choice persists in localStorage.)

**Rationale:** The simplest possible change. No new "portfolio mode" boolean. The CRT theme is the default; users can switch any time via the existing theme switcher and the choice is remembered.

**Edge case:** Users who previously selected a theme (e.g. `synthwave`) continue to see `synthwave`. The default only fires on first visit / cleared storage.

---

## R10. Performance budget verification

**Decision:** Set explicit budgets per spec SC-002/003/004:

- **LCP < 2.5s** on simulated mobile 4G (Lighthouse mobile preset)
- **CLS < 0.1**
- **TBT < 200ms**
- **Lighthouse Performance ≥ 90**

**Estimated impact of changes:**
| Change | LCP impact | CLS impact | TBT impact | Notes |
|---|---|---|---|---|
| Replace Geist (~14KB) with Instrument Serif (~12KB) + JetBrains Mono (~30KB) | +0ms (parallel) | +0 (size-adjust + font-display:swap) | +0ms | Net +28KB fonts, but both load in parallel during initial paint. |
| Add `motion` library (~30KB gz, lazy) | +0ms | +0 | +5–15ms hydration | Lazy-loaded via dynamic import in HeroStage; not in critical path. |
| 9 new components (~5KB each gz) | +0ms | +0 | +5–10ms | All compose into the home page bundle; tree-shaking removes unused. |
| Boot sequence (typewriter) | +0ms | +0 | +10ms (interval setup) | Boot text is small; LCP is the hero name below it. |
| Manifest retype (12s interval) | 0ms | +0 | <1ms ongoing | Interval is idle most of the time. |
| Scanline drift (CSS animation) | 0ms | 0 | 0ms | GPU-composited, no JS. |
| ASCII diagrams (text in `<pre>`) | 0ms | 0 | 0ms | Plain text rendering. |
| **Total estimated** | **+0 to +30ms** | **+0** | **+20 to +35ms** | **All within budget.** |

**Verification gate:** Run Lighthouse mobile/slow-4G three times against the implemented build (`docker compose exec turtlewolfe pnpm run build && pnpm run start` or via the static `out/` directory served by a local static server). Take median. If LCP ≥ 2.5s, defer the boot sequence to `requestIdleCallback`; if TBT ≥ 200ms, code-split the manifest retype interval setup.

**Fallback plan:** If after defer/split the budget is still missed, drop the cursor halo (it's the highest-cost optional motion).

---

## Summary

All 10 research items have a decision and rationale. No `NEEDS CLARIFICATION` markers remain. Ready to proceed to Phase 1 (data-model.md, contracts/, quickstart.md).
