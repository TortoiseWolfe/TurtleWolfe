import unittest

from helpers import good, merge

from partsbin import compat
from partsbin.claims import LateClaims, claim_diff, validate_claims


def claims(recorded_at="2026-10-01T18:00:00+00:00", items=None):
    return {"model": "claude-opus-5-5", "recorded_at": recorded_at, "prompt_sha256": "0" * 64,
            "claims": items or [{"rule_id": "gpu_length", "claimed_verdict": "PASS", "quote": "It fits."},
                                {"rule_id": "usable_vram", "claimed_verdict": "PASS", "quote": "16 GB is plenty."}]}


class ClaimDiff(unittest.TestCase):
    def setUp(self):
        b = merge(good(), {"parts": {"gpu": {"vram_gb": 16}}})
        self.rows = compat.run(b["parts"], b["requirements"])

    def test_agree_and_disagree(self):
        d = {x["rule_id"]: x for x in claim_diff(self.rows, claims(), "2026-10-01T18:05:00+00:00")}
        self.assertTrue(d["gpu_length"]["match"])
        self.assertFalse(d["usable_vram"]["match"])
        self.assertEqual(d["usable_vram"]["checker"], compat.FAIL)

    def test_claims_recorded_after_the_check_are_refused(self):
        with self.assertRaises(LateClaims):
            claim_diff(self.rows, claims("2026-10-01T18:06:00Z"), "2026-10-01T18:05:00+00:00")

    def test_not_verifiable_is_neither_right_nor_wrong(self):
        b = merge(good(), {"parts": {"gpu": {"dimensions_mm": {"l": "TODO"}}}})
        rows = compat.run(b["parts"], b["requirements"])
        d = claim_diff(rows, claims(), "2026-10-01T18:05:00+00:00")
        self.assertIsNone([x for x in d if x["rule_id"] == "gpu_length"][0]["match"])

    def test_unknown_rule(self):
        d = claim_diff(self.rows, claims(items=[{"rule_id": "rgb", "claimed_verdict": "PASS", "quote": "pretty"}]),
                       "2026-10-01T18:05:00+00:00")
        self.assertEqual(d[0]["checker"], "UNKNOWN RULE")
        self.assertIsNone(d[0]["match"])

    def test_validation(self):
        self.assertEqual(validate_claims(claims()), [])
        bad = claims(items=[{"rule_id": "x", "claimed_verdict": "MAYBE", "quote": ""}])
        self.assertTrue(any("PASS or FAIL" in p for p in validate_claims(bad)))
        with self.assertRaises(ValueError):
            claim_diff(self.rows, claims("2026-10-01T18:00:00"), "2026-10-01T18:05:00+00:00")


if __name__ == "__main__":
    unittest.main()
