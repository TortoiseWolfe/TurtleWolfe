"""Place a build's parts as boxes, in millimetres, from the same numbers the checker reads.

Axes: x runs from the case's rear panel toward the front, y from the motherboard tray toward the
side panel, z up from the case floor. Parts whose size is still TODO get a stand-in size and the
"unverified" material. The layout draws the checker's numbers; it never decides a verdict."""

from partsbin.schema import TODO

SLOT_PITCH_MM = 20.32          # ATX expansion-slot pitch (0.8 in)
BOARD_MM = {"ATX": (305, 244), "mATX": (244, 244), "ITX": (170, 170)}   # (tall, deep)
STANDOFF_MM = 6.35
# Stand-ins used only when a size is TODO; always drawn as "unverified".
STAND_IN = {"case": (450, 210, 470), "psu": (160, 150, 86), "gpu": (300, 130, 60),
            "cooler_h": 150, "board": "ATX"}
FIRST_SLOT_DROP_MM = 115       # board top edge to the first expansion slot, approximate (drawing only)


def _num(v):
    return v if isinstance(v, (int, float)) and not isinstance(v, bool) else None


def _dims(part, fallback):
    d = (part or {}).get("dimensions_mm", TODO)
    vals = [_num(d.get(k)) if isinstance(d, dict) else None for k in ("l", "w", "h")]
    if all(v is not None for v in vals):
        return tuple(vals), True
    return fallback, False


def _box(name, material, x, y, z, w, d, h, verified):
    fallback = "unverified_shell" if name == "case" else "unverified"
    return {"name": name, "material": material if verified else fallback,
            "x": x, "y": y, "z": z, "w": w, "d": d, "h": h, "verified": verified}


def layout(parts):
    """parts: category -> record. Returns a list of boxes (dicts)."""
    boxes = []
    case = parts.get("case") or {}
    (cl, cw, ch), case_ok = _dims(case, STAND_IN["case"])
    boxes.append(_box("case", "case", 0, 0, 0, cl, cw, ch, case_ok))

    mb = parts.get("motherboard") or {}
    ff = mb.get("form_factor")
    board_ok = ff in BOARD_MM
    tall, deep = BOARD_MM[ff if board_ok else STAND_IN["board"]]
    board_top = ch - 20
    boxes.append(_box("motherboard", "motherboard", 0, STANDOFF_MM, board_top - tall, deep, 2, tall, board_ok))

    psu = parts.get("psu") or {}
    (pl, pw, ph), psu_ok = _dims(psu, STAND_IN["psu"])
    boxes.append(_box("psu", "psu", 0, 0, 0, pl, pw, ph, psu_ok))
    room_psu = _num(case.get("max_psu_len_mm"))
    if room_psu:
        boxes.append(_box("psu_envelope", "envelope", 0, 0, 0, room_psu, pw, ph, True))

    cooler = parts.get("cooler") or {}
    cooler_h = _num(cooler.get("height_mm"))
    socket_x, socket_z = deep * 0.55, board_top - 90        # drawing position only
    boxes.append(_box("cooler", "cpu_cooler", socket_x - 60, STANDOFF_MM + 2, socket_z - 60, 120,
                      cooler_h or STAND_IN["cooler_h"], 120, cooler_h is not None))
    room_cooler = _num(case.get("max_cooler_h_mm"))
    if room_cooler:
        boxes.append(_box("cooler_envelope", "envelope", socket_x - 60, STANDOFF_MM + 2, socket_z - 60,
                          120, room_cooler, 120, True))

    gpu = parts.get("gpu") or {}
    (gl, gw, gh), gpu_ok = _dims(gpu, STAND_IN["gpu"])
    slots = mb.get("pcie_x16_slots")
    idx = slots[0]["slot_index"] if isinstance(slots, list) and slots else 0
    slot_z = board_top - FIRST_SLOT_DROP_MM - idx * SLOT_PITCH_MM
    boxes.append(_box("gpu", "gpu", 0, STANDOFF_MM + 2, slot_z - gh, gl, gw, gh, gpu_ok))
    room_gpu = _num(case.get("max_gpu_len_mm"))
    if room_gpu:
        boxes.append(_box("gpu_envelope", "envelope", 0, STANDOFF_MM + 2, slot_z - gh, room_gpu, gw, gh, True))
    return boxes
