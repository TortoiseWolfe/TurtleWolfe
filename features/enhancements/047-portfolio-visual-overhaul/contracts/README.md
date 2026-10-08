# Contracts: Portfolio Visual Overhaul

**Feature:** 047
**Phase:** 1
**Status:** N/A — no API contracts

## Scope

This feature is a client-side visual overhaul of the home page. It has:

- No server-side API routes (the project is static-export to GitHub Pages; API routes are forbidden per constitution)
- No Supabase Edge Functions
- No webhook contracts
- No GraphQL schema
- No OpenAPI spec
- No RPC contracts

The only "contract" is the visual contract documented in [`spec.md`](../spec.md) §UI Mockup and the signed-off SVG at [`wireframes/06-nostromo-crt.svg`](../wireframes/06-nostromo-crt.svg), with the binding visual review at [`docs/design/wireframes/047-portfolio-visual-overhaul/06-nostromo-crt.issues.md`](../../../../docs/design/wireframes/047-portfolio-visual-overhaul/06-nostromo-crt.issues.md).

The implementation is verified against that visual contract via:

- Manual visual review on dev server
- Pa11y accessibility audit (zero new failures relative to baseline)
- Playwright E2E (skip link works, theme switcher cycles, links resolve)
- `/speckit.wireframe.screenshots 047` (regression screenshot vs signed-off wireframe)
- Lighthouse mobile/slow-4G (LCP < 2.5s, CLS < 0.1, TBT < 200ms)
