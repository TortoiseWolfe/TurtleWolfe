"""Compare what an AI claimed about a build with what the checker found.

Modelled on stair_audit.prediction_diff() in ada-stair-generator: the claims are written down
first, and a claims file recorded after the verdict is refused."""

from datetime import datetime

from .compat import FAIL, PASS
from .schema import CLAIM_REQUIRED, CLAIMS_REQUIRED


class LateClaims(ValueError):
    """The claims were recorded after the checker ran, so they prove nothing."""


def _ts(s):
    t = datetime.fromisoformat(s.replace("Z", "+00:00"))
    if t.tzinfo is None:
        raise ValueError(f"timestamp {s!r} needs a timezone")
    return t


def validate_claims(claims):
    problems = [f"missing {f}" for f in CLAIMS_REQUIRED if f not in claims]
    for i, c in enumerate(claims.get("claims", [])):
        problems += [f"claims[{i}] missing {f}" for f in CLAIM_REQUIRED if f not in c]
        if c.get("claimed_verdict") not in (PASS, FAIL):
            problems.append(f"claims[{i}].claimed_verdict must be PASS or FAIL")
    return problems


def claim_diff(rows, claims, checked_at):
    """One entry per claim: what the AI said, what the checker says, and whether they match.
    match is None when the checker couldn't decide (NOT VERIFIABLE) or the rule doesn't exist."""
    if _ts(claims["recorded_at"]) > _ts(checked_at):
        raise LateClaims(f"claims recorded {claims['recorded_at']} after the check at {checked_at}")
    by_id = {r["id"]: r for r in rows}
    out = []
    for c in claims["claims"]:
        row = by_id.get(c["rule_id"])
        checker = row["verdict"] if row else "UNKNOWN RULE"
        match = (checker == c["claimed_verdict"]) if checker in (PASS, FAIL) else None
        out.append({"rule_id": c["rule_id"], "claimed": c["claimed_verdict"], "checker": checker,
                    "match": match, "quote": c["quote"]})
    return out
