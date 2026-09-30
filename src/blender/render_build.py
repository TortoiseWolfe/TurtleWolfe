"""Render a virtual build's OBJ to PNG (and optionally GLB) in headless Blender.

blender -b --factory-startup --python-exit-code 1 -P src/blender/render_build.py -- in.obj out.png [out.glb]
"""

import math
import sys

import bpy
from mathutils import Vector

sys.path.insert(0, "/app/src")
from geometry.export import MATERIALS  # noqa: E402  (one colour table for exporter and render)

argv = sys.argv[sys.argv.index("--") + 1:]
obj_path, png_path = argv[0], argv[1]
glb_path = argv[2] if len(argv) > 2 else None

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.wm.obj_import(filepath=obj_path)

for mat in bpy.data.materials:            # colour and alpha straight from the exporter's table
    bsdf = mat.node_tree.nodes.get("Principled BSDF") if mat.use_nodes else None
    key = mat.name.split(".")[0]
    if bsdf and key in MATERIALS:
        r, g, b, a = MATERIALS[key]
        bsdf.inputs["Base Color"].default_value = (r, g, b, 1)
        for link in list(bsdf.inputs["Alpha"].links):   # the OBJ importer may wire "d" in
            mat.node_tree.links.remove(link)
        bsdf.inputs["Alpha"].default_value = a

objs = [o for o in bpy.context.scene.objects if o.type == "MESH"]
pts = [o.matrix_world @ Vector(c) for o in objs for c in o.bound_box]
lo = Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)))
hi = Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
centre, size = (lo + hi) / 2, max((hi - lo).length, 0.1)

cam = bpy.data.objects.new("cam", bpy.data.cameras.new("cam"))
bpy.context.scene.collection.objects.link(cam)
cam.location = centre + Vector((size * 1.1, -size * 1.3, size * 0.8))
cam.rotation_euler = (centre - cam.location).to_track_quat("-Z", "Y").to_euler()
bpy.context.scene.camera = cam
sun = bpy.data.objects.new("sun", bpy.data.lights.new("sun", "SUN"))
sun.data.energy = 2.0
fill = bpy.data.objects.new("fill", bpy.data.lights.new("fill", "AREA"))
fill.data.energy = 40.0
fill.data.size = size
fill.location = centre + Vector((-size, -size, size))
fill.rotation_euler = (centre - fill.location).to_track_quat("-Z", "Y").to_euler()
bpy.context.scene.collection.objects.link(fill)
sun.rotation_euler = (math.radians(50), 0, math.radians(30))
bpy.context.scene.collection.objects.link(sun)

world = bpy.data.worlds.new("w")
world.use_nodes = True
world.node_tree.nodes["Background"].inputs[0].default_value = (0.07, 0.08, 0.09, 1)
bpy.context.scene.world = world

s = bpy.context.scene
s.render.engine = "CYCLES"
s.cycles.device = "CPU"
s.cycles.samples = 40
s.render.resolution_x, s.render.resolution_y = 1400, 900
s.render.filepath = png_path
s.view_settings.view_transform = "Standard"   # AgX desaturates the amber "unverified" colour to cream
bpy.ops.render.render(write_still=True)
if glb_path:
    bpy.ops.export_scene.gltf(filepath=glb_path, export_format="GLB")
print(f"rendered {png_path}")
