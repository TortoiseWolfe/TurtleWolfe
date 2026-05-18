# Data Model: Portfolio Visual Overhaul

**Feature:** 047
**Phase:** 1
**Status:** N/A — visual feature only, no persistent data

## Scope

This feature has **no database entities, no API contracts, no persistent state**. It is a visual / behavioral overhaul of the existing home page. All data is already in place as inline TypeScript arrays in `src/app/page.tsx` (lines 55–264) and is preserved unchanged.

## Existing structures preserved (for reference only)

### Project (inline TypeScript, no DB)

Used by `ProjectShowcaseCard`. The overhaul does not modify the shape; it only changes the rendering treatment.

```ts
type Project = {
  title: string;
  description: string;
  image?: {
    src: string; // public/portfolio/... path
    alt: string;
  };
  stack: readonly string[];
  href: string; // internal route or external URL
  hasDetailPage?: boolean;
};
```

Two arrays consume this shape:

- `FEATURED_PROJECTS` (3 entries: SpokeToWork, ScriptHammer, Revit Plugins) — case-study cards with `hasDetailPage: true`
- `OTHER_PROJECTS` (8 entries: Interactive Resume, House that Code Built, OpenClaw/Twitch, Mercor AI, DevCamper API, FreeCodeCamp, GrimGlow, Spec Kit Wireframe Extension) — outbound links

### Template stat / demo (existing, untouched)

Used by `TemplateStats`. Defined in `src/components/molecular/TemplateStats/`. Shape preserved.

### Service / Certification / Community (inline, untouched)

The Services Preview, Certifications, and Community & Teaching sections use inline literal arrays in `page.tsx`. Shapes unchanged.

## New client-side state (transient, not persistent)

These are component-local React state, not data model:

- `BootSequence`: `currentLine` (number, 0–4), `currentChar` (number) — driving the typewriter effect; cleared after typing completes.
- `Marquee` (manifest retype): `retypingLineIndex` (number | null) — set every ~12s by `setInterval`, cleared after CSS animation finishes.
- `GlobalNav` (scroll shrink): derived from `useScroll` from `motion` — no explicit state.
- `useReducedMotion` hook: `boolean` — derived from `matchMedia`, updated on `change` event.
- Theme selection: existing `localStorage.theme` mechanism, unchanged. Default now `turtlewolfe-crt` instead of `turtlewolfe-dark` (one-line change in `ThemeScript.tsx`).

## Persistence

No new persistence. The only persisted value touched is `localStorage.theme` (existing key), and only its default fallback changes from `turtlewolfe-dark` to `turtlewolfe-crt`.

## Migrations

No database migrations. No Supabase changes. No SQL.
