"""Load parts and builds from disk."""

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def load_json(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def load_parts(root=ROOT):
    """All part records keyed by id. Duplicate ids are an error."""
    parts = {}
    for p in sorted((Path(root) / "data" / "parts").glob("*/*.json")):
        rec = load_json(p)
        if rec.get("id") in parts:
            raise ValueError(f"duplicate part id {rec.get('id')} in {p}")
        parts[rec["id"]] = rec
    return parts


def resolve_build(build, parts):
    """Map each category in the build to its part record (None when the id is unknown)."""
    return {cat: parts.get(pid) for cat, pid in build.get("parts", {}).items()}
