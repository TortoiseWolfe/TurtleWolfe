import json
import unittest

from helpers import FIX, good, merge

from partsbin import compat


def verdicts(b):
    return {r["id"]: r["verdict"] for r in compat.run(b["parts"], b["requirements"])}


class GoodBuild(unittest.TestCase):
    def test_every_rule_passes(self):
        v = verdicts(good())
        self.assertEqual(len(v), len(compat.RULES))
        self.assertEqual({k for k, x in v.items() if x != compat.PASS}, set())
        self.assertEqual(compat.overall(compat.run(good()["parts"], good()["requirements"])), compat.PASS)


class PlantedFaults(unittest.TestCase):
    def test_each_plant_fails_exactly_its_rule(self):
        plants = json.loads((FIX / "planted_faults.json").read_text())
        self.assertEqual({p["rule"] for p in plants}, set(compat.RULE_NAMES), "one plant per rule")
        for p in plants:
            with self.subTest(rule=p["rule"]):
                v = verdicts(merge(good(), p["patch"]))
                self.assertEqual([k for k, x in v.items() if x == compat.FAIL], [p["rule"]])
                self.assertTrue(all(x in (compat.PASS, compat.NA) for k, x in v.items() if k != p["rule"]))


class Boundaries(unittest.TestCase):
    def test_gpu_length_equal_passes_one_over_fails(self):
        self.assertEqual(verdicts(merge(good(), {"parts": {"gpu": {"dimensions_mm": {"l": 360}}}}))["gpu_length"], compat.PASS)
        self.assertEqual(verdicts(merge(good(), {"parts": {"gpu": {"dimensions_mm": {"l": 361}}}}))["gpu_length"], compat.FAIL)

    def test_headroom_exactly_equal_passes(self):
        # (190 + 350 + 100) × 1.25 = 800
        b = merge(good(), {"requirements": {"psu_headroom_factor": 1.25}, "parts": {"psu": {"psu_w": 800}}})
        self.assertEqual(verdicts(b)["psu_headroom"], compat.PASS)
        b = merge(b, {"parts": {"psu": {"psu_w": 799}}})
        self.assertEqual(verdicts(b)["psu_headroom"], compat.FAIL)

    def test_uses_max_turbo_not_base_power(self):
        row = [r for r in compat.run(good()["parts"], good()["requirements"]) if r["id"] == "psu_headroom"][0]
        self.assertIn("190 W CPU max turbo", row["note"])

    def test_pcie_generation_mismatch_passes_with_note(self):
        b = merge(good(), {"parts": {"gpu": {"pcie_gen": 5}}})
        row = [r for r in compat.run(b["parts"], b["requirements"]) if r["id"] == "pcie"][0]
        self.assertEqual(row["verdict"], compat.PASS)
        self.assertIn("Gen5", row["note"])

    def test_display_reservation_only_without_igpu(self):
        # 20 GB card: 20480 MiB exactly meets the 20 GB need only if nothing is reserved.
        b = merge(good(), {"parts": {"gpu": {"vram_gb": 20}}})
        self.assertEqual(verdicts(b)["usable_vram"], compat.FAIL)
        b = merge(b, {"parts": {"cpu": {"igpu": True}}, "requirements": {"display_on_gpu": False}})
        self.assertEqual(verdicts(b)["usable_vram"], compat.PASS)

    def test_twelve_volt_adapter_route(self):
        b = merge(good(), {"parts": {"gpu": {"power_inputs": {"12v_2x6": 1, "alt_pcie_8pin_adapter": 4}},
                                     "psu": {"connectors": {"pcie_8pin": 4, "12v_2x6": 0}}}})
        self.assertEqual(verdicts(b)["gpu_power_inputs"], compat.PASS)
        b = merge(b, {"parts": {"psu": {"connectors": {"pcie_8pin": 3, "12v_2x6": 0}}}})
        self.assertEqual(verdicts(b)["gpu_power_inputs"], compat.FAIL)


class Quantities(unittest.TestCase):
    def ram_row(self, patch):
        b = merge(good(), patch)
        return [r for r in compat.run(b["parts"], b["requirements"]) if r["id"] == "ram_slots"][0]

    def test_two_kits_count_every_module(self):
        row = self.ram_row({"parts": {"ram": {"modules": 2, "module_gb": 16, "quantity": 2}}})
        self.assertEqual(row["verdict"], compat.PASS)
        self.assertEqual(row["measured"], "4 × 16 GB = 64 GB")
        self.assertEqual(row["note"], "2 kits × 2 modules")

    def test_kits_past_the_slot_count_fail(self):
        row = self.ram_row({"parts": {"ram": {"modules": 2, "module_gb": 16, "quantity": 3}}})   # 6 modules, 4 slots
        self.assertEqual(row["verdict"], compat.FAIL)

    def test_no_quantity_means_one_kit(self):
        row = self.ram_row({})
        self.assertEqual(row["measured"], "2 × 32 GB = 64 GB")
        self.assertEqual(row["note"], "")


class NotVerifiable(unittest.TestCase):
    def test_todo_value_never_passes(self):
        b = merge(good(), {"parts": {"gpu": {"dimensions_mm": {"l": "TODO"}}}})
        rows = compat.run(b["parts"], b["requirements"])
        row = [r for r in rows if r["id"] == "gpu_length"][0]
        self.assertEqual(row["verdict"], compat.NOT_VERIFIABLE)
        self.assertIn("gpu.dimensions_mm.l is TODO", row["note"])
        self.assertEqual(compat.overall(rows), compat.NOT_VERIFIABLE)

    def test_missing_part_is_not_verifiable(self):
        b = good()
        del b["parts"]["cooler"]
        v = verdicts(b)
        self.assertEqual(v["cooler_height"], compat.NOT_VERIFIABLE)
        self.assertEqual(v["socket"], compat.NOT_VERIFIABLE)

    def test_fail_outranks_not_verifiable(self):
        b = merge(good(), {"parts": {"gpu": {"vram_gb": 8, "dimensions_mm": {"l": "TODO"}}}})
        self.assertEqual(compat.overall(compat.run(b["parts"], b["requirements"])), compat.FAIL)


if __name__ == "__main__":
    unittest.main()
