# can-we-build-it

Parts bin + compatibility checker + virtual build for the **Can we actually build it?** stream.
An AI proposes a build; its claims are committed first; then a deterministic checker says whether
the parts actually fit, power up and do the job.

```bash
docker compose run --rm test                                   # full suite
docker compose run --rm check check builds/workbench-llm/build.json
docker compose run --rm check check builds/workbench-llm/build.json --claims builds/workbench-llm/claims/<file>.json
```

Exit codes from `check`: 0 PASS, 1 FAIL, 2 NOT VERIFIABLE.

Episode 3's counting tool (stdlib only; the 2026-07 OpenStreetMap snapshot ships beside it):

```bash
docker compose run --rm --entrypoint python3 check builds/003-chatt-registry/count.py          # add --json or --axes
docker compose run --rm -v "$HOME/repos/ScriptHammer:/scripthammer:ro" -e SCRIPTHAMMER_DIR=/scripthammer test   # also checks the rule against buildings.ts
```
