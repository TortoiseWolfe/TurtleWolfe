"""Episode 3's counting tool (builds/003-chatt-registry/count.py).

Two jobs. First, pin every number the run sheet reads out, against the July 2026 snapshot that
ships beside the script, so the sheet and the tool cannot drift apart. Second, when ScriptHammer
is on disk, compare count.py's copy of the typing rule to the TypeScript it mirrors and check the
live file is still the snapshot. Those last tests skip (visibly) when ScriptHammer is not mounted:

    docker compose run --rm -v "$HOME/repos/ScriptHammer:/scripthammer:ro" \
        -e SCRIPTHAMMER_DIR=/scripthammer test
"""

import contextlib
import importlib.util
import io
import json
import os
import re
import tempfile
import unittest
from pathlib import Path

from helpers import ROOT

BUILD = ROOT / "builds" / "003-chatt-registry"
_spec = importlib.util.spec_from_file_location("chatt_count", BUILD / "count.py")
count = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(count)

SCRIPTHAMMER = Path(os.environ.get("SCRIPTHAMMER_DIR", str(Path.home() / "repos" / "ScriptHammer")))
BUILDINGS_TS = SCRIPTHAMMER / "src" / "twin" / "cesium" / "buildings.ts"
LIVE_JSON = SCRIPTHAMMER / "public" / "twins" / "chatt" / "buildings-wide.json"

_REPORT = {}


def report():
    if not _REPORT:
        buildings, sha = count.load(count.SNAPSHOT)
        _REPORT.update(rep=count.analyse(buildings), sha=sha)
    return _REPORT["rep"], _REPORT["sha"]


class SnapshotCounts(unittest.TestCase):
    """The numbers the run sheet reads out. Change one and the sheet's Facts must change with it."""

    def test_snapshot_is_the_pinned_bytes(self):
        self.assertEqual(report()[1], count.SNAPSHOT_SHA256)

    def test_total_and_untyped(self):
        rep, _ = report()
        self.assertEqual(rep["total"], 13877)
        self.assertEqual(rep["untyped"]["total"], 10743)
        self.assertEqual(rep["typed_total"] + rep["untyped"]["total"], rep["total"])

    def test_typed_by_bucket(self):
        self.assertEqual(report()[0]["typed"],
                         {"residential": 2717, "commercial": 160, "ancillary": 127, "civic": 83, "industrial": 47})

    def test_untyped_is_yes_plus_unmapped(self):
        un = report()[0]["untyped"]
        self.assertEqual(un["building_yes"], 10704)
        self.assertEqual(un["unmapped_total"], 39)
        self.assertEqual(un["unmapped_values"]["storage_tank"], 18)
        self.assertEqual(sum(un["unmapped_values"].values()), 39)

    def test_only_400_buildings_carry_a_name(self):
        self.assertEqual(report()[0]["named"], 400)

    def test_typable_from_tags(self):
        g = report()[0]["typable_from_tags"]
        self.assertEqual((g["any_of_eight"], g["use_tag"], g["name_only"]), (323, 226, 97))
        self.assertEqual(g["use_tag"] + g["name_only"], g["any_of_eight"])
        self.assertEqual(g["by_tag"], {"name": 268, "amenity": 150, "shop": 26, "tourism": 39,
                                       "office": 3, "craft": 1, "leisure": 7, "healthcare": 8})

    def test_top_cells(self):
        top = report()[0]["top_cells"]
        self.assertEqual([(c["label"], c["untyped"]) for c in top],
                         [("r20c18", 92), ("r21c17", 81), ("r22c17", 75), ("r17c20", 69), ("r31c13", 68),
                          ("r23c26", 67), ("r23c27", 66), ("r21c28", 65), ("r12c29", 64), ("r16c20", 62)])
        self.assertEqual(sum(c["untyped"] for c in top[:3]), 248)
        self.assertEqual(report()[0]["top_cells_hold"]["untyped"], 709)
        self.assertEqual(report()[0]["top_cells_hold"]["share_of_untyped"], 0.066)
        self.assertEqual([c["typable_from_tags"] for c in top], [0] * 10)

    def test_canvassing_route(self):
        r = report()[0]["canvassing_route"]
        self.assertEqual(r["order"], ["r20c18", "r21c17", "r22c17", "r17c20", "r16c20",
                                      "r23c26", "r23c27", "r21c28", "r12c29", "r31c13"])
        self.assertEqual(r["legs_m"], [354, 250, 1458, 250, 2305, 250, 559, 2264, 6210])
        self.assertAlmostEqual(r["total_m"], 13899, delta=3)


class TypeBucketRule(unittest.TestCase):
    """The cases buildings.test.ts pins for typeBucket(), in Python."""

    def test_untyped_cases(self):
        for tags in ({"building": "yes"}, {}, None, {"building": ""}, {"building": "ship"}, {"building": "wat"},
                     {"building": "storage_tank"}):
            with self.subTest(tags=tags):
                self.assertEqual(count.type_bucket(tags), "untyped")

    def test_one_value_per_bucket(self):
        for value, bucket in (("house", "residential"), ("hotel", "residential"), ("retail", "commercial"),
                              ("office", "commercial"), ("warehouse", "industrial"), ("garage", "ancillary"),
                              ("church", "civic"), ("grandstand", "civic")):
            with self.subTest(value=value):
                self.assertEqual(count.type_bucket({"building": value}), bucket)

    def test_table_only_uses_the_five_buckets(self):
        self.assertEqual(set(count.TYPE_BUCKETS.values()), set(count.BUCKET_ORDER))
        self.assertEqual(len(count.TYPE_BUCKETS), 27)


class GridAndRoute(unittest.TestCase):
    def test_a_cell_centre_lands_in_its_own_cell(self):
        for row, col in ((0, 0), (20, 18), (32, 34)):
            lat, lon = count.cell_centre(row, col)
            self.assertEqual(count.cell_of(lon, lat), (row, col))

    def test_cells_are_about_250_m(self):
        a, b = count.cell_centre(20, 18), count.cell_centre(21, 18)
        c = count.cell_centre(20, 19)
        self.assertAlmostEqual(count.metres(a, b), 250, delta=1)
        self.assertAlmostEqual(count.metres(a, c), 250, delta=1)

    def test_centroid_ignores_the_closing_vertex(self):
        self.assertEqual(count.centroid([0, 0, 2, 0, 2, 2, 0, 2, 0, 0]), (1.0, 1.0))

    def test_walk_starts_at_the_first_and_steps_to_the_nearest(self):
        cells = [{"row": 0, "col": 0}, {"row": 0, "col": 10}, {"row": 0, "col": 1}, {"row": 0, "col": 4}]
        order, legs, total = count.nearest_neighbour_walk(cells)
        self.assertEqual([c["col"] for c in order], [0, 1, 4, 10])
        self.assertEqual(len(legs), 3)
        self.assertAlmostEqual(total, 10 * 250, delta=10)

    def test_walk_of_nothing(self):
        self.assertEqual(count.nearest_neighbour_walk([]), ([], [], 0.0))


class CommandLine(unittest.TestCase):
    def run_main(self, *argv):
        buf = io.StringIO()
        with contextlib.redirect_stdout(buf):
            self.assertEqual(count.main([str(count.SNAPSHOT), *argv]), 0)
        return buf.getvalue()

    def test_text_report_shows_every_section(self):
        out = self.run_main()
        for needle in ("TOTAL", "13,877", "UNTYPED", "10,743", "COULD BE TYPED FROM TAGS", "TOP 10 CELLS",
                       "CANVASSING ROUTE", "= the July 2026 snapshot"):
            self.assertIn(needle, out)

    def test_json_report(self):
        data = json.loads(self.run_main("--json"))
        self.assertEqual(data["total"], 13877)
        self.assertEqual(data["untyped"]["total"], 10743)
        self.assertTrue(data["source"]["is_july_2026_snapshot"])
        self.assertEqual(len(data["top_cells"]), 10)

    def test_axes_show_the_grid_and_no_counts(self):
        out = self.run_main("--axes")
        self.assertIn("r20 ", out)
        self.assertIn("c18 ", out)
        for leaked in ("untyped", "10,743", "13,877", "r20c18", "TOP"):
            self.assertNotIn(leaked, out)

    def test_a_different_file_is_flagged(self):
        with tempfile.TemporaryDirectory() as d:
            p = Path(d) / "b.json"
            p.write_text(json.dumps([{"id": 1, "lonLat": [-85.3, 35.0, -85.3, 35.01, -85.29, 35.01, -85.3, 35.0],
                                      "tags": {"building": "yes", "name": "X", "amenity": "cafe"}}]))
            buf = io.StringIO()
            with contextlib.redirect_stdout(buf):
                count.main([str(p)])
        self.assertIn("DIFFERS from the July 2026 snapshot", buf.getvalue())
        self.assertIn("(named: 1,", buf.getvalue())


class Briefing(unittest.TestCase):
    """briefing.md is the whole prompt the AI sees, so it must stay in step with the tool and must not
    hold either answer."""

    def setUp(self):
        self.text = (BUILD / "briefing.md").read_text()

    def test_it_carries_the_axes_count_py_prints(self):
        buf = io.StringIO()
        with contextlib.redirect_stdout(buf):
            count.main([str(count.SNAPSHOT), "--axes"])
        self.assertIn(buf.getvalue().rstrip("\n"), self.text)

    def test_it_gives_only_the_two_public_numbers(self):
        self.assertIn("13,877", self.text)
        self.assertIn("10,743", self.text)

    def test_it_does_not_leak_the_answers(self):
        rep, _ = report()
        for label in (c["label"] for c in rep["top_cells"]):
            with self.subTest(cell=label):
                self.assertNotIn(label, self.text)
        g = rep["typable_from_tags"]
        # whole numbers only: "323" must not trip on a coordinate such as -85.3239
        for n in (g["any_of_eight"], g["use_tag"], g["name_only"], rep["named"]):
            with self.subTest(number=n):
                self.assertIsNone(re.search(rf"(?<![\d.,-]){n}(?![\d,])", self.text))
        self.assertNotIn("2.9%", self.text)

    def test_its_table_is_the_rule_count_py_applies(self):
        for value, bucket in count.TYPE_BUCKETS.items():
            line = [ln for ln in self.text.splitlines() if ln.startswith(f"- {bucket}:")]
            self.assertEqual(len(line), 1, bucket)
            self.assertIn(value, [v.strip() for v in line[0].split(":", 1)[1].split(",")])


@unittest.skipUnless(BUILDINGS_TS.exists(), f"ScriptHammer not mounted ({BUILDINGS_TS})")
class MirrorsBuildingsTs(unittest.TestCase):
    """count.py copies TYPE_BUCKETS and typeBucket() from buildings.ts. If this fails, buildings.ts
    changed: update the copy in count.py, re-run it, and update the run sheet's Facts."""

    def setUp(self):
        self.src = BUILDINGS_TS.read_text()

    def test_table_is_identical(self):
        m = re.search(r"const TYPE_BUCKETS: Record<string, string> = \{(.*?)\n\};", self.src, re.S)
        self.assertIsNotNone(m, "TYPE_BUCKETS not found in buildings.ts")
        pairs = re.findall(r"^\s*(\w+):\s*'(\w+)',?\s*$", m.group(1), re.M)
        self.assertEqual(len(pairs), len(m.group(1).strip().splitlines()), "a TYPE_BUCKETS line did not parse")
        self.assertEqual(dict(pairs), count.TYPE_BUCKETS)
        self.assertEqual([k for k, _ in pairs], list(count.TYPE_BUCKETS))

    def test_rule_is_still_the_same_three_lines(self):
        m = re.search(r"export function typeBucket\([^)]*\): string \{(.*?)\n\}", self.src, re.S)
        self.assertIsNotNone(m, "typeBucket() not found in buildings.ts")
        body = " ".join(m.group(1).split())
        self.assertEqual(body, "const b = tags?.building; if (!b || b === 'yes') return 'untyped'; "
                               "return TYPE_BUCKETS[b] ?? 'untyped';")


@unittest.skipUnless(LIVE_JSON.exists(), f"ScriptHammer not mounted ({LIVE_JSON})")
class LiveFileIsTheSnapshot(unittest.TestCase):
    def test_not_rebaked(self):
        _, sha = count.load(LIVE_JSON)
        self.assertEqual(sha, count.SNAPSHOT_SHA256,
                         "ScriptHammer re-baked buildings-wide.json: re-run count.py, then update the pinned "
                         "numbers here and the run sheet's Facts (or keep the snapshot and say so on air)")


if __name__ == "__main__":
    unittest.main()
