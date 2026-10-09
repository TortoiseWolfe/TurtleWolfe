"""Golden test for episode 1's build as seeded: the only hard verdict is the VRAM FAIL, and every
NOT VERIFIABLE row is pinned to the exact TODO behind it, which is now only a policy number. The
case, cooler and PSU come from the builder's parts quote (confidence "inferred": their labels are
still unread), so every fit row below is decided against those models. Fill one in or confirm a
label and this test must change with it."""

import json
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

    # rule id -> the first TODO that rule trips over. Every part is recorded now, so the only
    # unknown left is the policy number behind the PSU headroom rule.
    EXPECTED_UNKNOWNS = {
        "psu_headroom": "requirements.platform_baseline_w or psu_headroom_factor is TODO",
    }

    def test_the_only_unknown_left_is_the_policy_number(self):
        unknown = {r["id"]: r["note"] for r in self.rows if r["verdict"] == compat.NOT_VERIFIABLE}
        self.assertEqual(unknown, self.EXPECTED_UNKNOWNS)

    # The owned case, cooler and PSU against the used 3090: all of them fit, so VRAM is the whole story.
    EXPECTED_FITS = {
        "socket": compat.PASS,
        "mb_form_factor": compat.PASS,
        "psu_vendor_rule": compat.PASS,
        "gpu_power_inputs": compat.PASS,
        "gpu_length": compat.PASS,
        "gpu_slot_width": compat.PASS,
        "cooler_height": compat.PASS,
        "psu_fit": compat.PASS,
    }

    def test_the_owned_case_cooler_and_psu_take_the_3090(self):
        got = {r["id"]: r["verdict"] for r in self.rows if r["id"] in self.EXPECTED_FITS}
        self.assertEqual(got, self.EXPECTED_FITS)

    def test_the_tightest_fits_are_measured_against_the_recorded_models(self):
        rows = {r["id"]: r for r in self.rows}
        self.assertIn("313", rows["gpu_length"]["measured"])
        self.assertIn("330", rows["gpu_length"]["required"])
        self.assertIn("148", rows["cooler_height"]["measured"])
        self.assertIn("160", rows["cooler_height"]["required"])

    def test_recorded_parts_are_not_the_reason_for_any_unknown(self):
        for r in self.rows:
            if r["verdict"] == compat.NOT_VERIFIABLE:
                with self.subTest(rule=r["id"]):
                    self.assertFalse(r["note"].startswith(("cpu.", "motherboard.", "ram.", "gpu.")), r["note"])

    def test_two_ram_kits_fill_all_four_slots(self):
        self.assertEqual(self.build["quantities"], {"ram": 2})
        row = [r for r in self.rows if r["id"] == "ram_slots"][0]
        self.assertEqual(row["verdict"], compat.PASS)
        self.assertEqual(row["measured"], "4 × 16 GB = 64 GB")
        self.assertEqual(row["note"], "2 kits × 2 modules")

    def test_memory_type_and_board_slot_are_checked_not_unknown(self):
        verdicts = {r["id"]: r for r in self.rows}
        self.assertEqual(verdicts["ram_type"]["verdict"], compat.PASS)
        self.assertEqual(verdicts["pcie"]["verdict"], compat.PASS)
        self.assertIn("Gen4", verdicts["pcie"]["note"])           # 3090 is Gen4, the CPU slot is Gen5


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
