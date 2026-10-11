#!/usr/bin/env python3
"""CWBI 003: how many of downtown Chattanooga's buildings have no type, where are they, and
what is the walking order to fix the worst ones? Stdlib only.

MIRRORS the typing rule in ScriptHammer, which is a different language in a different repo:
    ScriptHammer/src/twin/cesium/buildings.ts  ->  TYPE_BUCKETS and typeBucket()
Last checked against buildings.ts as of ScriptHammer commit 92742585 (2026-07-17).
RE-CHECK THIS FILE WHENEVER buildings.ts CHANGES: the table below is a copy, not an import.
tests/test_chatt_registry.py compares it to buildings.ts when ScriptHammer is on disk, and
pins the counts below, so a drift in either direction fails the suite.

Subject data: ScriptHammer/public/twins/chatt/buildings-wide.json, a list of
    {id, lonLat: [lon, lat, lon, lat, ...], heightM, rule, baked, tags}
baked from OpenStreetMap, so (c) OpenStreetMap contributors, ODbL. A copy of the July 2026
snapshot sits beside this script (gzipped, same bytes) so the numbers stay reproducible after
ScriptHammer re-bakes; it is used only when the ScriptHammer file is not on this machine.

    python3 count.py [path-to-buildings-wide.json[.gz]] [--json | --axes]
"""

import argparse
import gzip
import hashlib
import json
import math
import os
import sys
from collections import Counter
from pathlib import Path

HERE = Path(__file__).resolve().parent
SCRIPTHAMMER_JSON = Path.home() / "repos/ScriptHammer/public/twins/chatt/buildings-wide.json"
SNAPSHOT = HERE / "buildings-wide.2026-07.json.gz"
SNAPSHOT_SHA256 = "d1405cf407a547f02b1a39d530a68a0158ef06e5c7e17bf9a2002af920c2fdeb"  # of the JSON bytes

# --- copied from buildings.ts: TYPE_BUCKETS (keep key order and values identical) -------------
TYPE_BUCKETS = {
    "house": "residential",
    "detached": "residential",
    "terrace": "residential",
    "residential": "residential",
    "apartments": "residential",
    "dormitory": "residential",
    "hotel": "residential",
    "retail": "commercial",
    "commercial": "commercial",
    "office": "commercial",
    "industrial": "industrial",
    "warehouse": "industrial",
    "greenhouse": "industrial",
    "garage": "ancillary",
    "shed": "ancillary",
    "hut": "ancillary",
    "parking": "ancillary",
    "roof": "ancillary",
    "pavilion": "ancillary",
    "church": "civic",
    "school": "civic",
    "university": "civic",
    "government": "civic",
    "public": "civic",
    "hospital": "civic",
    "civic": "civic",
    "grandstand": "civic",
}
BUCKET_ORDER = ["residential", "commercial", "ancillary", "civic", "industrial"]


def type_bucket(tags):
    """buildings.ts typeBucket(): no building tag, building=yes, or a value not in the table
    is 'untyped'."""
    b = (tags or {}).get("building")
    if not b or b == "yes":
        return "untyped"
    return TYPE_BUCKETS.get(b, "untyped")


# --- what the file already knows about an untyped building ------------------------------------
USE_TAGS = ("amenity", "shop", "tourism", "office", "craft", "leisure", "healthcare")
ALL_TAGS = ("name",) + USE_TAGS


def carried(tags, keys):
    return [k for k in keys if (tags or {}).get(k)]


# --- grid: fixed corner, so a cell keeps its label even if more buildings are baked -----------
CELL_M = 250
M_PER_DEG_LAT = 2 * math.pi * 6_371_000 / 360
REF_LAT = 35.04
GRID_NORTH = 35.080  # row 0 starts here and rows count southward, like reading a map
GRID_WEST = -85.350  # col 0 starts here and cols count eastward
D_LAT = CELL_M / M_PER_DEG_LAT
D_LON = CELL_M / (M_PER_DEG_LAT * math.cos(math.radians(REF_LAT)))
TOP_N = 10


def centroid(ll):
    pts = list(zip(ll[0::2], ll[1::2]))
    if len(pts) > 1 and pts[0] == pts[-1]:
        pts = pts[:-1]
    return sum(p[0] for p in pts) / len(pts), sum(p[1] for p in pts) / len(pts)


def cell_of(lon, lat):
    return math.floor((GRID_NORTH - lat) / D_LAT), math.floor((lon - GRID_WEST) / D_LON)


def cell_centre(row, col):
    return GRID_NORTH - (row + 0.5) * D_LAT, GRID_WEST + (col + 0.5) * D_LON


def label(row, col):
    return f"r{row:02d}c{col:02d}"


def metres(a, b):
    """Haversine between two (lat, lon) points."""
    p1, p2 = math.radians(a[0]), math.radians(b[0])
    h = math.sin((p2 - p1) / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(math.radians(b[1] - a[1]) / 2) ** 2
    return 2 * 6_371_000 * math.asin(math.sqrt(h))


def nearest_neighbour_walk(cells):
    """cells: dicts with row/col, already ranked. Start at the first, always step to the nearest
    unvisited centre (ties: lower row, then col). Returns (order, legs_m, total_m)."""
    left = list(cells)
    if not left:
        return [], [], 0.0
    order = [left.pop(0)]
    legs = []
    while left:
        here = cell_centre(order[-1]["row"], order[-1]["col"])
        nxt = min(left, key=lambda c: (metres(here, cell_centre(c["row"], c["col"])), c["row"], c["col"]))
        legs.append(metres(here, cell_centre(nxt["row"], nxt["col"])))
        left.remove(nxt)
        order.append(nxt)
    return order, legs, sum(legs)


def load(path):
    path = Path(path)
    raw = gzip.open(path).read() if path.suffix == ".gz" else path.read_bytes()
    return json.loads(raw), hashlib.sha256(raw).hexdigest()


def default_path():
    if os.environ.get("CHATT_BUILDINGS"):
        return Path(os.environ["CHATT_BUILDINGS"])
    return SCRIPTHAMMER_JSON if SCRIPTHAMMER_JSON.exists() else SNAPSHOT


def analyse(buildings):
    total = len(buildings)
    typed = Counter()
    unmapped = Counter()
    building_yes = 0
    by_tag = Counter()
    any_of_eight = use_tag = name_only = 0
    cells = {}
    named = sum(1 for b in buildings if (b.get("tags") or {}).get("name"))

    for b in buildings:
        tags = b.get("tags") or {}
        bucket = type_bucket(tags)
        lon, lat = centroid(b["lonLat"])
        cell = cells.setdefault(cell_of(lon, lat), {"total": 0, "untyped": 0, "typable": 0})
        cell["total"] += 1
        if bucket != "untyped":
            typed[bucket] += 1
            continue
        cell["untyped"] += 1
        raw = tags.get("building")
        if raw and raw != "yes":
            unmapped[raw] += 1
        else:
            building_yes += 1
        have = carried(tags, ALL_TAGS)
        by_tag.update(have)
        if have:
            any_of_eight += 1
            cell["typable"] += 1
            if any(k in USE_TAGS for k in have):
                use_tag += 1
            else:
                name_only += 1

    untyped = total - sum(typed.values())
    ranked = sorted(((rc, c) for rc, c in cells.items() if c["untyped"]), key=lambda x: (-x[1]["untyped"], x[0]))
    top = []
    for rank, ((row, col), c) in enumerate(ranked[:TOP_N], 1):
        lat, lon = cell_centre(row, col)
        top.append({"rank": rank, "label": label(row, col), "row": row, "col": col,
                    "lat": round(lat, 5), "lon": round(lon, 5), "untyped": c["untyped"],
                    "total": c["total"], "untyped_share": round(c["untyped"] / c["total"], 3),
                    "typable_from_tags": c["typable"]})
    order, legs, walk_m = nearest_neighbour_walk(top)
    rows = [r for r, _ in cells]
    cols = [c for _, c in cells]
    return {
        "total": total,
        "named": named,
        "typed": {k: typed.get(k, 0) for k in BUCKET_ORDER},
        "typed_total": sum(typed.values()),
        "untyped": {
            "total": untyped,
            "building_yes": building_yes,
            "unmapped_total": sum(unmapped.values()),
            "unmapped_values": dict(unmapped.most_common()),
        },
        "typable_from_tags": {
            "any_of_eight": any_of_eight,
            "use_tag": use_tag,
            "name_only": name_only,
            "by_tag": {k: by_tag.get(k, 0) for k in ALL_TAGS},
        },
        "grid": {"cell_m": CELL_M, "north": GRID_NORTH, "west": GRID_WEST,
                 "rows": [min(rows), max(rows)], "cols": [min(cols), max(cols)],
                 "cells_with_buildings": len(cells)},
        "top_cells": top,
        "top_cells_hold": {"untyped": sum(c["untyped"] for c in top),
                           "share_of_untyped": round(sum(c["untyped"] for c in top) / untyped, 3) if untyped else 0.0},
        "canvassing_route": {
            "from": order[0]["label"] if order else None,
            "order": [c["label"] for c in order],
            "legs_m": [round(x) for x in legs],
            "total_m": round(walk_m),
            "note": "straight lines between cell centres, one-way, not streets",
        },
    }


def pct(n, d):
    return f"{100 * n / d:.1f}%" if d else "0.0%"


def unmapped_line(values, show=4):
    shown = list(values.items())[:show]
    more = len(values) - len(shown)
    return ", ".join(f"{k} {v}" for k, v in shown) + (f" and {more} more values (see --json)" if more > 0 else "")


def render(rep, source, sha, matches):
    t, u, g = rep["total"], rep["untyped"]["total"], rep["typable_from_tags"]
    out = [f"source   {source}",
           f"sha256   {sha[:16]}...  " + ("= the July 2026 snapshot" if matches else
                                          "DIFFERS from the July 2026 snapshot: numbers will not match the run sheet"),
           "",
           f"TOTAL    {t:>7,}   (named: {rep['named']:,}, {pct(rep['named'], t)})",
           f"TYPED    {rep['typed_total']:>7,}   {pct(rep['typed_total'], t)}"]
    out += [f"  {k:<12} {rep['typed'][k]:>6,}" for k in BUCKET_ORDER]
    un = rep["untyped"]
    out += [f"UNTYPED  {u:>7,}   {pct(u, t)}",
            f"  building=yes {un['building_yes']:>6,}",
            f"  unmapped     {un['unmapped_total']:>6,}   " + unmapped_line(un["unmapped_values"]),
            "",
            "COULD BE TYPED FROM TAGS ALREADY IN THE FILE (untyped buildings carrying a tag)",
            f"  any of the eight tags   {g['any_of_eight']:>6,}   {pct(g['any_of_eight'], u)} of untyped",
            f"    with a use tag        {g['use_tag']:>6,}   (amenity, shop, tourism, office, craft, leisure, healthcare)",
            f"    name only             {g['name_only']:>6,}   (a human has to read the name and guess)",
            "  by tag (a building can carry several, so these overlap):"]
    out += [f"    {k:<10} {g['by_tag'][k]:>6,}" for k in ALL_TAGS]
    out += ["",
            f"TOP {TOP_N} CELLS BY UNTYPED  ({CELL_M} m cells; row 0 = north edge, col 0 = west edge)",
            "  #  cell    centre (lat, lon)       untyped / total   share  tag-typable"]
    out += [f"  {c['rank']:>2} {c['label']}  {c['lat']:.5f}, {c['lon']:.5f}   {c['untyped']:>5,} / {c['total']:<5,}   "
            f"{100 * c['untyped_share']:>4.0f}%   {c['typable_from_tags']:>5,}" for c in rep["top_cells"]]
    hold = rep["top_cells_hold"]
    out.append(f"  the top {len(rep['top_cells'])} cells hold {hold['untyped']:,} of {u:,} untyped "
               f"({100 * hold['share_of_untyped']:.1f}%); {rep['grid']['cells_with_buildings']:,} cells hold buildings")
    r = rep["canvassing_route"]
    out += ["",
            f"CANVASSING ROUTE  nearest-neighbour walk, starting at {r['from']} (the most untyped)",
            "  " + " -> ".join(r["order"]),
            "  legs (m): " + ", ".join(str(x) for x in r["legs_m"]),
            f"  total ~{r['total_m']:,} m ({r['total_m'] / 1000:.1f} km), {r['note']}"]
    return "\n".join(out)


def render_axes(rep):
    g = rep["grid"]
    out = [f"{g['cell_m']} m grid. A cell is rNNcNN. Row 0 starts at latitude {g['north']} and rows count southward;",
           f"col 0 starts at longitude {g['west']} and cols count eastward.",
           "Rows (centre latitude):"]
    rows = [f"r{r:02d} {cell_centre(r, 0)[0]:.4f}" for r in range(g["rows"][0], g["rows"][1] + 1)]
    out += ["  " + "   ".join(rows[i:i + 6]) for i in range(0, len(rows), 6)]
    out.append("Cols (centre longitude):")
    cols = [f"c{c:02d} {cell_centre(0, c)[1]:.4f}" for c in range(g["cols"][0], g["cols"][1] + 1)]
    out += ["  " + "   ".join(cols[i:i + 6]) for i in range(0, len(cols), 6)]
    return "\n".join(out)


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("path", nargs="?", help="buildings-wide.json or .json.gz (default: ScriptHammer's, else the bundled snapshot)")
    mode = ap.add_mutually_exclusive_group()
    mode.add_argument("--json", action="store_true", help="machine-readable output")
    mode.add_argument("--axes", action="store_true",
                      help="print only the grid's row/col axes, no counts (what the AI is shown before it claims)")
    args = ap.parse_args(argv)
    path = Path(args.path) if args.path else default_path()
    buildings, sha = load(path)
    rep = analyse(buildings)
    matches = sha == SNAPSHOT_SHA256
    if args.axes:
        print(render_axes(rep))
    elif args.json:
        print(json.dumps({"source": {"path": str(path), "sha256": sha, "is_july_2026_snapshot": matches}, **rep}, indent=2))
    else:
        print(render(rep, path, sha, matches))
    return 0


if __name__ == "__main__":
    sys.exit(main())
