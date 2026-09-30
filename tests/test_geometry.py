import os
import tempfile
import unittest

from helpers import ROOT, good, merge

from geometry import export, layout
from geometry.mesh import MeshBuilder
from partsbin import cli, load


def by_name(boxes):
    return {b["name"]: b for b in boxes}


class Mesh(unittest.TestCase):
    def test_solid_box_is_closed(self):
        m = MeshBuilder()
        m.set_group("g", "gpu")
        m.add_solid_box(0, 0, 0, 1, 2, 3)
        self.assertEqual(m.triangle_count, 12)


class Layout(unittest.TestCase):
    def test_boxes_use_the_checker_numbers(self):
        b = by_name(layout.layout(good()["parts"]))
        self.assertEqual(b["gpu"]["w"], 313)                 # GPU length along x from the rear panel
        self.assertEqual(b["gpu_envelope"]["w"], 360)        # case max_gpu_len_mm
        self.assertEqual(b["cooler"]["d"], 155)
        self.assertEqual(b["cooler_envelope"]["d"], 170)
        self.assertEqual(b["psu_envelope"]["w"], 200)
        self.assertTrue(all(x["verified"] for x in b.values()))

    def test_todo_sizes_are_drawn_unverified(self):
        p = merge(good(), {"parts": {"gpu": {"dimensions_mm": {"l": "TODO"}}}})["parts"]
        g = by_name(layout.layout(p))["gpu"]
        self.assertFalse(g["verified"])
        self.assertEqual(g["material"], "unverified")

    def test_layout_never_carries_a_verdict(self):
        for box in layout.layout(good()["parts"]):
            self.assertNotIn("verdict", box)


class Export(unittest.TestCase):
    def test_seeded_build_exports_within_budget(self):
        build = load.load_json(ROOT / "builds" / "workbench-llm" / "build.json")
        parts = {c: p for c, p in load.resolve_build(build, load.load_parts(ROOT)).items() if p}
        mesh = export.build_mesh(layout.layout(parts))
        self.assertTrue(export.within_budget(mesh))
        with tempfile.TemporaryDirectory() as tmp:
            obj, mtl = export.export_obj(mesh, os.path.join(tmp, "build.obj"))
            text = open(obj).read()
            self.assertIn("usemtl unverified", text)            # owned case etc. are still TODO
            self.assertLess(os.path.getsize(obj), 3_000_000)
            self.assertLessEqual(open(mtl).read().count("newmtl"), 8)


if __name__ == "__main__":
    unittest.main()
