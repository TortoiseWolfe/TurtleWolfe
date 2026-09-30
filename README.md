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
