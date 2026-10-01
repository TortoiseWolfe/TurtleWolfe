"""Deterministic compatibility rules. Each rule is a plain function (parts, req) -> row.

Rows: {id, rule, required, measured, verdict, citation, note}. Verdict vocabulary follows
ada-stair-generator's stair_audit.py. A TODO or a missing part can only yield NOT VERIFIABLE."""

from .schema import TODO

PASS, FAIL, NOT_VERIFIABLE, NA = "PASS", "FAIL", "NOT VERIFIABLE", "N/A"


class _Missing(Exception):
    """Raised inside a rule when an input is TODO or absent."""


def _get(parts, cat, path):
    part = parts.get(cat)
    if part is None:
        raise _Missing(f"no {cat} in build")
    val = part
    for key in path.split("."):
        if not isinstance(val, dict) or key not in val:
            raise _Missing(f"{cat}.{path} missing")
        val = val[key]
    if val == TODO:
        raise _Missing(f"{cat}.{path} is TODO")
    return val


def _row(rule_id, rule, required, measured, ok, citation="", note=""):
    return {"id": rule_id, "rule": rule, "required": required, "measured": measured,
            "verdict": PASS if ok else FAIL, "citation": citation, "note": note}


def _nv(rule_id, rule, why):
    return {"id": rule_id, "rule": rule, "required": "", "measured": "", "verdict": NOT_VERIFIABLE,
            "citation": "", "note": why}


def socket(p, r):
    cpu, mb, cool = _get(p, "cpu", "socket"), _get(p, "motherboard", "socket"), _get(p, "cooler", "sockets")
    return _row("socket", "CPU, board and cooler share a socket", cpu, f"board {mb}; cooler {', '.join(cool)}",
                cpu == mb and cpu in cool)


def ram_type(p, r):
    ram, mb, cpu = _get(p, "ram", "ram_type"), _get(p, "motherboard", "ram_type"), _get(p, "cpu", "ram_types")
    return _row("ram_type", "Memory type matches board and CPU", ram, f"board {mb}; CPU {', '.join(cpu)}",
                ram == mb and ram in cpu)


def ram_slots(p, r):
    kit_modules, each = _get(p, "ram", "modules"), _get(p, "ram", "module_gb")
    kits = p["ram"].get("quantity", 1)          # set from build["quantities"] by load.resolve_build
    modules = kit_modules * kits
    slots, mb_max, cpu_max = _get(p, "motherboard", "dimm_slots"), _get(p, "motherboard", "max_ram_gb"), _get(p, "cpu", "max_ram_gb")
    limit = min(mb_max, cpu_max)
    return _row("ram_slots", "Modules fit the slots and the capacity limit",
                f"≤{slots} modules, ≤{limit} GB", f"{modules} × {each} GB = {modules * each} GB",
                modules <= slots and modules * each <= limit,
                note=f"{kits} kits × {kit_modules} modules" if kits > 1 else "")


def mb_form_factor(p, r):
    ff, allowed = _get(p, "motherboard", "form_factor"), _get(p, "case", "mb_form_factors")
    return _row("mb_form_factor", "Board form factor fits the case", ", ".join(allowed), ff, ff in allowed)


def psu_vendor_rule(p, r):
    need, have = _get(p, "gpu", "required_system_power_w"), _get(p, "psu", "psu_w")
    return _row("psu_vendor_rule", "PSU meets the GPU maker's system-power figure", f"≥{need} W", f"{have} W",
                have >= need, citation="GPU manufacturer spec")


def psu_headroom(p, r):
    cpu, gpu = _get(p, "cpu", "max_turbo_power_w"), _get(p, "gpu", "tgp_w")
    base, factor = r.get("platform_baseline_w", TODO), r.get("psu_headroom_factor", TODO)
    if TODO in (base, factor):
        raise _Missing("requirements.platform_baseline_w or psu_headroom_factor is TODO")
    have = _get(p, "psu", "psu_w")
    need = round((cpu + gpu + base) * factor)
    return _row("psu_headroom", "PSU covers peak draw with headroom", f"≥{need} W",
                f"{have} W", have >= need,
                note=f"({cpu} W CPU max turbo + {gpu} W GPU + {base} W platform) × {factor}")


def gpu_power_inputs(p, r):
    need, conns = _get(p, "gpu", "power_inputs"), _get(p, "psu", "connectors")
    have_hpwr, have_8 = conns.get("12v_2x6", 0), conns.get("pcie_8pin", 0)
    if need.get("12v_2x6"):
        if have_hpwr >= need["12v_2x6"]:
            return _row("gpu_power_inputs", "PSU has the GPU's power connectors", "12V-2x6", f"{have_hpwr} × 12V-2x6", True)
        alt = need.get("alt_pcie_8pin_adapter")
        ok = bool(alt) and have_8 >= alt
        return _row("gpu_power_inputs", "PSU has the GPU's power connectors",
                    f"12V-2x6, or {alt} × 8-pin via adapter" if alt else "12V-2x6",
                    f"{have_hpwr} × 12V-2x6, {have_8} × 8-pin", ok,
                    note="adapter route" if ok else "")
    n8 = need.get("pcie_8pin", 0)
    return _row("gpu_power_inputs", "PSU has the GPU's power connectors", f"{n8} × 8-pin",
                f"{have_8} × 8-pin", have_8 >= n8)


def gpu_length(p, r):
    length, room = _get(p, "gpu", "dimensions_mm.l"), _get(p, "case", "max_gpu_len_mm")
    note = (p.get("case") or {}).get("max_gpu_len_note", "")
    return _row("gpu_length", "GPU length fits the case", f"≤{room} mm", f"{length} mm", length <= room, note=note)


def gpu_slot_width(p, r):
    width, slots = _get(p, "gpu", "slot_width"), _get(p, "case", "expansion_slots")
    x16 = _get(p, "motherboard", "pcie_x16_slots")
    if not x16:
        return {"id": "gpu_slot_width", "rule": "GPU thickness fits below its slot", "required": "",
                "measured": "", "verdict": NA, "citation": "", "note": "no x16 slot; the pcie rule reports it"}
    free = slots - x16[0]["slot_index"]
    return _row("gpu_slot_width", "GPU thickness fits below its slot", f"≤{free} slots", f"{width} slots", width <= free)


def cooler_height(p, r):
    h, room = _get(p, "cooler", "height_mm"), _get(p, "case", "max_cooler_h_mm")
    return _row("cooler_height", "CPU cooler clears the side panel", f"≤{room} mm", f"{h} mm", h <= room)


def psu_fit(p, r):
    ff, allowed = _get(p, "psu", "form_factor"), _get(p, "case", "psu_form_factors")
    length, room = _get(p, "psu", "dimensions_mm.l"), _get(p, "case", "max_psu_len_mm")
    return _row("psu_fit", "PSU form factor and length fit the case", f"{', '.join(allowed)}, ≤{room} mm",
                f"{ff}, {length} mm", ff in allowed and length <= room)


def pcie(p, r):
    x16 = _get(p, "motherboard", "pcie_x16_slots")
    gpu_gen = _get(p, "gpu", "pcie_gen")
    if not x16:
        return _row("pcie", "Board has an x16 slot for the GPU", "x16 slot", "none", False)
    slot_gen = x16[0]["gen"]
    note = f"card is Gen{gpu_gen}, slot is Gen{slot_gen}: works, at Gen{min(gpu_gen, slot_gen)} speed" if gpu_gen != slot_gen else ""
    return _row("pcie", "Board has an x16 slot for the GPU", "x16 slot", f"Gen{slot_gen} x{x16[0]['electrical_lanes']}", True, note=note)


def usable_vram(p, r):
    vram = _get(p, "gpu", "vram_gb")
    need = r.get("min_usable_vram_gb", TODO)
    reserve = r.get("display_reservation_mib", TODO)
    if TODO in (need, reserve):
        raise _Missing("requirements.min_usable_vram_gb or display_reservation_mib is TODO")
    igpu = _get(p, "cpu", "igpu")
    drives_display = True if not igpu else r.get("display_on_gpu", True)
    usable = vram * 1024 - (reserve if drives_display else 0)
    note = "CPU has no integrated graphics, so this card also drives the display" if not igpu else ""
    return _row("usable_vram", "VRAM left for models after the display", f"≥{need * 1024} MiB",
                f"{usable} MiB of {vram * 1024}", usable >= need * 1024, note=note)


RULES = (socket, ram_type, ram_slots, mb_form_factor, psu_vendor_rule, psu_headroom, gpu_power_inputs,
         gpu_length, gpu_slot_width, cooler_height, psu_fit, pcie, usable_vram)
RULE_NAMES = {f.__name__: f for f in RULES}
TITLES = {
    "socket": "CPU, board and cooler share a socket", "ram_type": "Memory type matches board and CPU",
    "ram_slots": "Modules fit the slots and the capacity limit", "mb_form_factor": "Board form factor fits the case",
    "psu_vendor_rule": "PSU meets the GPU maker's system-power figure", "psu_headroom": "PSU covers peak draw with headroom",
    "gpu_power_inputs": "PSU has the GPU's power connectors", "gpu_length": "GPU length fits the case",
    "gpu_slot_width": "GPU thickness fits below its slot", "cooler_height": "CPU cooler clears the side panel",
    "psu_fit": "PSU form factor and length fit the case", "pcie": "Board has an x16 slot for the GPU",
    "usable_vram": "VRAM left for models after the display",
}


def run(parts, requirements):
    rows = []
    for rule in RULES:
        try:
            rows.append(rule(parts, requirements))
        except _Missing as e:
            rows.append(_nv(rule.__name__, TITLES[rule.__name__], str(e)))
    return rows


def overall(rows):
    verdicts = {r["verdict"] for r in rows}
    if FAIL in verdicts:
        return FAIL
    if NOT_VERIFIABLE in verdicts:
        return NOT_VERIFIABLE
    return PASS
