"""Golden test for episode 1's build as seeded: the only hard verdict is the VRAM FAIL, and every
other row is NOT VERIFIABLE because of an owned part nobody has recorded yet, or a policy number."""

import json
import re
import shutil
import tempfile
import unittest
from pathlib import Path

from helpers import ROOT

from partsbin import cli, compat, load


class WorkbenchBuild(unittest.TestCase):
    def setUp(self):
        self.build = load.load_json(ROOT / "builds" / "workbench-llm" / "build.json")
        self.rows, self.verdict, self.unknown = cli.evaluate(self.build, load.load_parts(ROOT))

    def test_every_part_id_resolves(self):
        self.assertEqual(self.unknown, [])

    def test_used_3090_misses_the_vram_bar_by_the_display_share(self):
        row = [r for r in self.rows if r["id"] == "usable_vram"][0]
        self.assertEqual(row["verdict"], compat.FAIL)
        self.assertIn("23389 MiB", row["measured"])
        self.assertEqual(self.verdict, compat.FAIL)

    def test_unknowns_come_only_from_owned_stubs_or_policy(self):
        owned = {c for c, pid in self.build["parts"].items() if pid.startswith("owned-")}
        for r in self.rows:
            if r["verdict"] != compat.NOT_VERIFIABLE:
                continue
            with self.subTest(rule=r["id"]):
                cat = re.match(r"(\w+)\.", r["note"]).group(1)
                self.assertTrue(cat in owned or cat == "requirements", r["note"])


class Publish(unittest.TestCase):
    def test_publish_strips_the_planted_fault(self):
        with tempfile.TemporaryDirectory() as tmp:
            for d in ("data", "builds"):
                shutil.copytree(ROOT / d, Path(tmp) / d)
            bp = Path(tmp) / "builds" / "workbench-llm" / "build.json"
            b = json.loads(bp.read_text())
            b["planted_fault"] = {"rule_id": "gpu_length", "description": "secret"}
            bp.write_text(json.dumps(b))
            self.assertEqual(cli.main(["--root", tmp, "publish", "workbench-llm"]), 0)
            out = (Path(tmp) / "published" / "workbench-llm" / "build.json").read_text()
            self.assertNotIn("planted_fault", out)
            self.assertNotIn("secret", out)
            self.assertIn('"verdict"', (Path(tmp) / "published" / "workbench-llm" / "verdict.json").read_text())


if __name__ == "__main__":
    unittest.main()
