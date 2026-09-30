"""Triangle mesh accumulator.

Copied from ada-stair-generator src/export/export_building.py (MeshBuilder), trimmed to what this
repo uses, plus add_solid_box(): the original add_box() draws walls only (open top and bottom,
for buildings); a PC part needs all six faces."""


class MeshBuilder:
    def __init__(self):
        self.vertices = []
        self.faces = []      # (v1, v2, v3), 1-based for OBJ
        self.groups = {}     # group -> [face index]
        self.group_material = {}
        self.current_group = "default"

    def set_group(self, name, material):
        self.current_group = name
        self.groups.setdefault(name, [])
        self.group_material[name] = material

    def add_vertex(self, x, y, z):
        self.vertices.append((x, y, z))
        return len(self.vertices)

    def add_quad(self, p1, p2, p3, p4):
        """Two triangles; points counter-clockwise seen from outside."""
        i1, i2, i3, i4 = (self.add_vertex(*p) for p in (p1, p2, p3, p4))
        for f in ((i1, i2, i3), (i1, i3, i4)):
            self.faces.append(f)
            self.groups[self.current_group].append(len(self.faces) - 1)

    def add_solid_box(self, x, y, z, w, d, h):
        """Closed axis-aligned box from (x, y, z) with size (w, d, h): 12 triangles."""
        X, Y, Z = x + w, y + d, z + h
        self.add_quad((x, y, z), (X, y, z), (X, y, Z), (x, y, Z))      # y-min
        self.add_quad((X, Y, z), (x, Y, z), (x, Y, Z), (X, Y, Z))      # y-max
        self.add_quad((x, Y, z), (x, y, z), (x, y, Z), (x, Y, Z))      # x-min
        self.add_quad((X, y, z), (X, Y, z), (X, Y, Z), (X, y, Z))      # x-max
        self.add_quad((x, y, Z), (X, y, Z), (X, Y, Z), (x, Y, Z))      # top
        self.add_quad((x, Y, z), (X, Y, z), (X, y, z), (x, y, z))      # bottom

    @property
    def triangle_count(self):
        return len(self.faces)
