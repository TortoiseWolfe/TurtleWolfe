"""The parts-bin schema. These Python sets are the source of truth; schema/*.json is generated
from them (`python3 -m partsbin schema`) and a test fails if the committed files drift."""

import json
import re

TODO = "TODO"
CATEGORIES = ("cpu", "gpu", "motherboard", "ram", "psu", "case", "cooler")
STATUSES = ("owned", "candidate")
CONFIDENCE = ("confirmed", "inferred")

COMMON_REQUIRED = ("id", "category", "manufacturer", "model", "status", "confidence",
                   "dimensions_mm", "source_urls", "last_verified", "todo")
COMMON_OPTIONAL = ("sku", "weight_kg", "asin", "notes")

CATEGORY_REQUIRED = {
    "cpu": ("socket", "ram_types", "max_ram_gb", "base_power_w", "max_turbo_power_w", "igpu", "pcie_gen"),
    "gpu": ("vram_gb", "tgp_w", "required_system_power_w", "slot_width", "power_inputs", "pcie_gen"),
    "motherboard": ("socket", "form_factor", "ram_type", "dimm_slots", "max_ram_gb", "pcie_x16_slots"),
    "ram": ("ram_type", "modules", "module_gb", "speed_mts"),
    "psu": ("psu_w", "form_factor", "atx_version", "connectors"),
    "case": ("mb_form_factors", "max_gpu_len_mm", "max_cooler_h_mm", "psu_form_factors",
             "max_psu_len_mm", "expansion_slots"),
    "cooler": ("height_mm", "sockets", "tdp_rating_w"),
}
CATEGORY_OPTIONAL = {"case": ("max_gpu_len_note", "mount_points")}

# A field whose name could carry a price is refused outright (Amazon Associates rule).
PRICE_FIELD = re.compile(r"price|msrp|cost", re.I)

BUILD_REQUIRED = ("slug", "title", "parts", "requirements")
# A build may hold more than one of the same part record; only RAM kits are counted so far
# (the ram_slots rule). The count lives in the build, never in the part file.
QUANTITY_CATEGORIES = ("ram",)
REQUIREMENTS_REQUIRED = ("min_usable_vram_gb", "display_reservation_mib", "psu_headroom_factor",
                         "platform_baseline_w")
CLAIMS_REQUIRED = ("model", "recorded_at", "prompt_sha256", "claims")
CLAIM_REQUIRED = ("rule_id", "claimed_verdict", "quote")


def validate_part(part):
    """Return a list of problems; empty means the record is well-formed."""
    problems = []
    cat = part.get("category")
    if cat not in CATEGORIES:
        return [f"unknown category {cat!r}"]
    for f in COMMON_REQUIRED + CATEGORY_REQUIRED[cat]:
        if f not in part:
            problems.append(f"missing {f}")
    allowed = set(COMMON_REQUIRED + COMMON_OPTIONAL + CATEGORY_REQUIRED[cat] + CATEGORY_OPTIONAL.get(cat, ()))
    for f in part:
        if f not in allowed:
            problems.append(f"unexpected field {f}")
        if PRICE_FIELD.search(f):
            problems.append(f"price-like field {f} is not allowed")
    if part.get("status") not in STATUSES:
        problems.append(f"status must be one of {STATUSES}")
    if part.get("confidence") not in CONFIDENCE:
        problems.append(f"confidence must be one of {CONFIDENCE}")
    todos = set(todo_fields(part))
    listed = set(part.get("todo", []))
    if todos != listed:
        problems.append(f"TODO values {sorted(todos)} must match todo[] {sorted(listed)}")
    if not part.get("source_urls") and len(todos) < len(CATEGORY_REQUIRED[cat]):
        problems.append("sourced values need at least one source_url")
    return problems


def todo_fields(obj, prefix=""):
    """Dotted paths of every value that is the literal string TODO."""
    out = []
    if isinstance(obj, dict):
        for k, v in obj.items():
            if k == "todo":
                continue
            out += todo_fields(v, f"{prefix}{k}.")
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            out += todo_fields(v, f"{prefix}{i}.")
    elif obj == TODO:
        out.append(prefix.rstrip("."))
    return out


def _any(desc):
    return {"description": desc}


def part_json_schema():
    """Generated JSON Schema for part records (documentation and editor validation)."""
    branches = []
    for cat in CATEGORIES:
        fields = COMMON_REQUIRED + COMMON_OPTIONAL + CATEGORY_REQUIRED[cat] + CATEGORY_OPTIONAL.get(cat, ())
        branches.append({
            "if": {"properties": {"category": {"const": cat}}},
            "then": {
                "required": list(COMMON_REQUIRED + CATEGORY_REQUIRED[cat]),
                "propertyNames": {"enum": list(fields)},
            },
        })
    return {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "part.schema.json",
        "title": "Parts-bin record",
        "description": 'Any unsourced value is the string "TODO" and is listed in todo[]. No price fields.',
        "type": "object",
        "properties": {
            "category": {"enum": list(CATEGORIES)},
            "status": {"enum": list(STATUSES)},
            "confidence": {"enum": list(CONFIDENCE)},
            "source_urls": {"type": "array", "items": {"type": "string"}},
            "todo": {"type": "array", "items": {"type": "string"}},
            "dimensions_mm": _any("{l, w, h} in millimetres, or TODO"),
        },
        "required": ["category"],
        "allOf": branches,
    }


def build_json_schema():
    return {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "build.schema.json",
        "title": "Build",
        "type": "object",
        "required": list(BUILD_REQUIRED),
        "properties": {
            "parts": {"type": "object", "propertyNames": {"enum": list(CATEGORIES)}},
            "quantities": {"type": "object", "propertyNames": {"enum": list(QUANTITY_CATEGORIES)},
                           "additionalProperties": {"type": "integer", "minimum": 1},
                           "description": "How many of a part the build holds, e.g. {\"ram\": 2} for two kits"},
            "requirements": {"type": "object", "required": list(REQUIREMENTS_REQUIRED)},
            "planted_fault": _any("{rule_id, description}; stripped from published/"),
        },
    }


def claims_json_schema():
    return {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "claims.schema.json",
        "title": "AI claims, recorded before the checker runs",
        "type": "object",
        "required": list(CLAIMS_REQUIRED),
        "properties": {
            "claims": {"type": "array", "items": {
                "type": "object", "required": list(CLAIM_REQUIRED),
                "properties": {"claimed_verdict": {"enum": ["PASS", "FAIL"]}}}},
        },
    }


SCHEMAS = {"part": part_json_schema, "build": build_json_schema, "claims": claims_json_schema}


def render(name):
    return json.dumps(SCHEMAS[name](), indent=2) + "\n"
