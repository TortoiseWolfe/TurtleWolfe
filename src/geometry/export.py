"""Boxes → OBJ + MTL. At most 8 materials; envelopes and the case are translucent."""

import os

from .mesh import MeshBuilder

MATERIALS = {   # name: (r, g, b, alpha)
    "case": (0.55, 0.58, 0.60, 0.12), "motherboard": (0.10, 0.35, 0.20, 1.0),
    "cpu_cooler": (0.70, 0.70, 0.72, 1.0), "gpu": (0.15, 0.15, 0.17, 1.0),
    "psu": (0.25, 0.25, 0.28, 1.0),
    "envelope": (0.85, 0.30, 0.20, 0.18),
    "unverified": (0.95, 0.66, 0.20, 0.85),          # amber: a size nobody has measured yet
    "unverified_shell": (0.95, 0.66, 0.20, 0.08),    # the case, when its size is a stand-in
}
BUDGET = {"triangles": 24_000, "materials": 8}


def build_mesh(boxes):
    mesh = MeshBuilder()
    for b in boxes:
        mesh.set_group(b["name"], b["material"])
        mesh.add_solid_box(b["x"], b["y"], b["z"], b["w"], b["d"], b["h"])
    return mesh


def within_budget(mesh):
    used = set(mesh.group_material.values())
    return mesh.triangle_count <= BUDGET["triangles"] and len(used) <= BUDGET["materials"] and used <= set(MATERIALS)


def export_obj(mesh, path):
    """Millimetres in, metres out (glTF/Blender convention); OBJ is Y-up, so y and z swap."""
    mtl_path = os.path.splitext(path)[0] + ".mtl"
    with open(mtl_path, "w", encoding="utf-8") as f:
        for name in sorted(set(mesh.group_material.values())):
            r, g, b, a = MATERIALS[name]
            f.write(f"newmtl {name}\nKd {r:.3f} {g:.3f} {b:.3f}\nKa 0.1 0.1 0.1\nKs 0.05 0.05 0.05\nNs 10\nd {a:.2f}\n\n")
    with open(path, "w", encoding="utf-8") as f:
        f.write("# can-we-build-it virtual build (boxes and clearances; not to scale in detail)\n")
        f.write(f"mtllib {os.path.basename(mtl_path)}\n")
        for x, y, z in mesh.vertices:
            f.write(f"v {x / 1000:.5f} {z / 1000:.5f} {-y / 1000:.5f}\n")
        for group, faces in mesh.groups.items():
            if faces:
                f.write(f"g {group}\nusemtl {mesh.group_material[group]}\n")
                f.writelines(f"f {a} {b} {c}\n" for a, b, c in (mesh.faces[i] for i in faces))
    return path, mtl_path
