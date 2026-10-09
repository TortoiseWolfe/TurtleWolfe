# CLAUDE.md: can-we-build-it

The data and tooling behind the "Can we actually build it?" stream: a parts bin, a
deterministic compatibility checker, and a boxes-and-clearances virtual build render.

## Rules that are not negotiable
- **Docker-first.** Never pip/npm install on the host. `docker compose run --rm test`, `docker compose run --rm check …`.
- **Stdlib-only Python** in `src/partsbin` and `src/geometry`. Blender (`--profile blender`) is only for rendering.
- **Every number has a source.** Each part record carries `source_urls` + `last_verified`. An unsourced value is the string `"TODO"` plus an entry in `todo[]`, and **a TODO can only ever produce NOT VERIFIABLE, never PASS.** Never guess a spec.
- **No prices, anywhere.** Amazon Associates forbids showing Amazon prices not served by Amazon. The schema has no price field; a test enforces it. `asin` is allowed.
- **AI claims are recorded before the checker runs.** `builds/<slug>/claims/*.json` carries `recorded_at`; `claims.py` rejects a claims file recorded after the verdict.
- **`planted_fault` never ships.** `publish` strips it; a test enforces it.
- **The layout draws the checker's numbers; it never decides a verdict.**
- No SketchUp Make: it's licensed non-commercial and this is a monetised stream.

## Layout
- `schema/`: JSON Schemas (documentation + editor validation). Python mirrors the required sets; a drift test keeps them equal.
- `data/parts/<category>/<id>.json`: one part per file.
- `builds/<slug>/build.json`: parts, requirements and the episode's planted fault. `quantities` (RAM only) says how many of a part the build holds, e.g. `{"ram": 2}` for two kits; the part file stays one kit.
- `src/partsbin/`: `load`, `schema`, `compat` (rules), `claims`, `cli`.
- `published/<slug>/`: what turtlewolfe.com reads. It is generated; don't hand-edit.
- `episodes/`: run sheets.

Verdict vocabulary is copied from ada-stair-generator's `stair_audit.py`: PASS / FAIL / NOT VERIFIABLE / N/A.
