# CLAUDE.md

ScriptHammer-fork PWA (Next.js 15 / React 19 / Tailwind 4 / DaisyUI / Supabase) that is also the planning-factory template with 27-terminal assembly-line orchestration.

Workspace conventions live in `/home/TurtleWolfe/repos/CLAUDE.md` (Docker-first, 5-file component pattern, SpecKit workflow, testing stack, deployment/code-quality). This file only records what is specific to this repo.

## Environment facts

- Docker service name: `turtlewolfe`; dev port `3000`. Run everything via `docker compose exec turtlewolfe …`.
- **Portfolio Mode**: Supabase is currently disabled. `useAuth()` returns a safe default when used outside `AuthProvider`, so no auth secrets are required for CI/CD.
- **basePath TODO**: once the Squarespace → GitHub Pages redirect is configured, restore `/TurtleWolfe/` as basePath in `public/manifest.json` (icon paths, start_url, scope, shortcuts, screenshots, share_target); `next.config.ts` auto-detects it.
- GitHub Actions deployment secrets: see `README.md`.

## Safety & permissions

- **Docker-first**: never run `npm/pnpm/yarn install` or `sudo` on the host — it creates Docker-owned `node_modules`/`.next` the host user cannot delete. Use `docker compose exec turtlewolfe …`; fix permission errors with `docker compose down && docker compose up`, never `sudo`.
- **Commit only, never push.** In the multi-terminal workflow only the Operator has SSH push access. Commit from inside the container (`docker compose exec turtlewolfe git commit …`) so hooks run; push from the host.
- **Supabase migrations are one monolithic file**: `supabase/migrations/20251006_complete_monolithic_setup.sql`. Never create separate/numbered migration files. All statements idempotent (`IF NOT EXISTS`) inside the `BEGIN;…COMMIT;` block. Execute via the Supabase Management API using `SUPABASE_ACCESS_TOKEN` — never tell the user to run SQL manually, never install local db clients (pg/psql), never attempt direct DB connections from Docker (DNS issues).

## Gotchas (specific fixes)

- Supabase Cloud free tier auto-pauses after 7 days (slow 10–30s cold start) → `docker compose exec turtlewolfe pnpm run prime`.
- Leaflet CSS: import only in map components, never in `globals.css`, or Tailwind stops loading.
- E2E (Playwright) tests are local-only, not in CI.
- Mobile-first touch targets: `min-h-11 min-w-11` (44px).

## Planning Factory (27-terminal workflow)

Assembly-line of Claude Code terminals in a tmux session:

```
STRATEGY:   CTO → ProductOwner → BusinessAnalyst
DESIGN:     Architect → UXDesigner → UIDesigner
WIREFRAMES: Planner → Generators 1-3 → PreviewHost → WireframeQA → Validator → Inspector
CODE:       Developer → Toolsmith → Security
TEST:       TestEngineer → QALead → Auditor
DOCS:       Author → TechWriter
RELEASE:    DevOps → DockerCaptain → ReleaseManager → Coordinator
```

- Role-specific context: `.claude/roles/` (operator, council, design, wireframe-pipeline, implementation, support, release, stw-liaison).
- Feature specs: `features/` (with `IMPLEMENTATION_ORDER.md` dependency graph); SVG wireframes: `docs/design/wireframes/`; run `/refresh-inventories` after spec changes.
