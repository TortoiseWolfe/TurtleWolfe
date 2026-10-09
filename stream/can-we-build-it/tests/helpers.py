import copy
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))
FIX = ROOT / "tests" / "fixtures"


def good():
    return json.loads((FIX / "good_build.json").read_text())


def merge(base, patch):
    """Deep-merge patch into a copy of base; lists and scalars replace."""
    out = copy.deepcopy(base)
    for k, v in patch.items():
        out[k] = merge(out[k], v) if isinstance(v, dict) and isinstance(out.get(k), dict) else copy.deepcopy(v)
    return out
