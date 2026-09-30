import json
import unittest

from helpers import ROOT

from partsbin import load, schema


class Schema(unittest.TestCase):
    def test_committed_json_schemas_match_python(self):
        for name in schema.SCHEMAS:
            with self.subTest(name=name):
                committed = (ROOT / "schema" / f"{name}.schema.json").read_text()
                self.assertEqual(committed, schema.render(name),
                                 "schema drifted: run `docker compose run --rm check schema --write`")

    def test_every_part_record_is_valid(self):
        files = sorted((ROOT / "data" / "parts").glob("*/*.json"))
        self.assertTrue(files, "no part records")
        for f in files:
            with self.subTest(file=f.name):
                rec = json.loads(f.read_text())
                self.assertEqual(schema.validate_part(rec), [])
                self.assertEqual(f.parent.name, rec["category"])
                self.assertEqual(f.stem, rec["id"])

    def test_part_ids_are_unique(self):
        load.load_parts(ROOT)

    def test_no_price_field_anywhere(self):
        for f in list((ROOT / "data").rglob("*.json")) + list((ROOT / "builds").rglob("*.json")):
            with self.subTest(file=str(f.relative_to(ROOT))):
                text = f.read_text()
                self.assertNotRegex(json.dumps(_keys(json.loads(text))), r'"[^"]*(price|msrp|cost)[^"]*"')

    def test_todo_parity_is_enforced(self):
        rec = {"id": "x", "category": "ram", "manufacturer": "m", "model": "m", "status": "owned",
               "confidence": "confirmed", "dimensions_mm": "TODO", "source_urls": [], "last_verified": "2026-09-30",
               "todo": [], "ram_type": "TODO", "modules": "TODO", "module_gb": "TODO", "speed_mts": "TODO"}
        self.assertTrue(any("must match todo[]" in p for p in schema.validate_part(rec)))

    def test_price_field_is_refused(self):
        rec = {"id": "x", "category": "ram", "price_usd": 1}
        self.assertTrue(any("unknown" in p or "price" in p for p in schema.validate_part(rec)))


def _keys(obj):
    if isinstance(obj, dict):
        return [k for k in obj] + [x for v in obj.values() for x in _keys(v)]
    if isinstance(obj, list):
        return [x for v in obj for x in _keys(v)]
    return []


if __name__ == "__main__":
    unittest.main()
