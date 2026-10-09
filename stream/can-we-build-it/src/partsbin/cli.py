"""python3 -m partsbin {check,schema,publish}"""

import argparse
import json
import shutil
import sys
from datetime import datetime, timezone
from pathlib import Path

from . import claims as claims_mod
from . import compat, load, schema

EXIT = {compat.PASS: 0, compat.FAIL: 1, compat.NOT_VERIFIABLE: 2}


def _now():
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def evaluate(build, parts):
    resolved = load.resolve_build(build, parts)
    unknown = [f"{c}:{pid}" for c, pid in build["parts"].items() if resolved.get(c) is None]
    rows = compat.run({c: p for c, p in resolved.items() if p is not None}, build["requirements"])
    return rows, compat.overall(rows), unknown


def print_table(rows, verdict, out=sys.stdout):
    w = max(len(r["rule"]) for r in rows)
    for r in rows:
        print(f"{r['verdict']:<15} {r['rule']:<{w}}  need {r['required'] or '-'}  have {r['measured'] or '-'}", file=out)
        if r["note"]:
            print(f"{'':<15} {'':<{w}}  {r['note']}", file=out)
    print(f"\nOVERALL: {verdict}", file=out)


def cmd_check(a):
    build = load.load_json(a.build)
    parts = load.load_parts(a.root)
    rows, verdict, unknown = evaluate(build, parts)
    for u in unknown:
        print(f"warning: part id not in the bin: {u}", file=sys.stderr)
    checked_at = _now()
    print_table(rows, verdict)
    result = {"slug": build["slug"], "checked_at": checked_at, "verdict": verdict, "rows": rows}
    if a.claims:
        cl = load.load_json(a.claims)
        problems = claims_mod.validate_claims(cl)
        if problems:
            print("claims file invalid: " + "; ".join(problems), file=sys.stderr)
            return 3
        diff = claims_mod.claim_diff(rows, cl, checked_at)
        result["claims"] = {"model": cl["model"], "recorded_at": cl["recorded_at"], "diff": diff}
        print(f"\nAI ({cl['model']}) said vs checker says:")
        for d in diff:
            mark = {True: "agrees", False: "WRONG", None: "can't tell"}[d["match"]]
            print(f"  {d['rule_id']:<18} said {d['claimed']:<5} checker {d['checker']:<15} {mark}")
    if a.out:
        Path(a.out).write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
    return EXIT[verdict]


def cmd_schema(a):
    for name in schema.SCHEMAS:
        text = schema.render(name)
        if a.write:
            (Path(a.root) / "schema" / f"{name}.schema.json").write_text(text, encoding="utf-8")
        else:
            print(text)
    return 0


def cmd_publish(a):
    root = Path(a.root)
    build = load.load_json(root / "builds" / a.slug / "build.json")
    rows, verdict, _ = evaluate(build, load.load_parts(root))
    public = {k: v for k, v in build.items() if k != "planted_fault"}
    dest = root / "published" / a.slug
    dest.mkdir(parents=True, exist_ok=True)
    (dest / "build.json").write_text(json.dumps(public, indent=2) + "\n", encoding="utf-8")
    (dest / "verdict.json").write_text(json.dumps({"slug": a.slug, "checked_at": _now(), "verdict": verdict,
                                                   "rows": rows}, indent=2) + "\n", encoding="utf-8")
    render = root / "output" / a.slug / "render.png"
    if render.exists():
        shutil.copyfile(render, dest / "render.png")
    print(f"published {dest} ({verdict})")
    return 0


def cmd_export(a):
    from geometry import export, layout
    root = Path(a.root)
    build = load.load_json(root / "builds" / a.slug / "build.json")
    parts = {c: p for c, p in load.resolve_build(build, load.load_parts(root)).items() if p}
    mesh = export.build_mesh(layout.layout(parts))
    if not export.within_budget(mesh):
        print("mesh over budget", file=sys.stderr)
        return 1
    dest = root / "output" / a.slug
    dest.mkdir(parents=True, exist_ok=True)
    obj, _ = export.export_obj(mesh, str(dest / "build.obj"))
    print(f"wrote {obj} ({mesh.triangle_count} triangles)")
    return 0


def main(argv=None):
    ap = argparse.ArgumentParser(prog="partsbin")
    ap.add_argument("--root", default=str(load.ROOT))
    sub = ap.add_subparsers(dest="cmd", required=True)
    c = sub.add_parser("check", help="run the compatibility checker on a build")
    c.add_argument("build")
    c.add_argument("--claims")
    c.add_argument("--out")
    c.set_defaults(fn=cmd_check)
    s = sub.add_parser("schema", help="print or --write the generated JSON Schemas")
    s.add_argument("--write", action="store_true")
    s.set_defaults(fn=cmd_schema)
    p = sub.add_parser("publish", help="write published/<slug>/ without the planted fault")
    p.add_argument("slug")
    p.set_defaults(fn=cmd_publish)
    e = sub.add_parser("export", help="write output/<slug>/build.obj + .mtl for the render")
    e.add_argument("slug")
    e.set_defaults(fn=cmd_export)
    a = ap.parse_args(argv)
    return a.fn(a)
