# Briefing for the AI: CWBI 003

You will make two claims about a dataset you cannot see. They are recorded before anyone counts
anything, and then a script counts. Nothing here tells you either answer. This file is the whole
prompt; it is committed unchanged and its SHA-256 is read out on stream.

## The data

A JSON list of 13,877 building footprints from the "wide" atlas of downtown Chattanooga and its
surroundings, from OpenStreetMap, baked in July 2026. Each entry is
`{id, lonLat, heightM, rule, baked, tags}`. `lonLat` is the footprint's corners as a flat list
`lon, lat, lon, lat, ...`. `tags` is OpenStreetMap's key=value tags for that building. Every
entry has a `building` tag.

## What "untyped" means

A building is untyped when its `building` tag is `yes`, or is a value this table does not list:

- residential: house, detached, terrace, residential, apartments, dormitory, hotel
- commercial: retail, commercial, office
- industrial: industrial, warehouse, greenhouse
- ancillary: garage, shed, hut, parking, roof, pavilion
- civic: church, school, university, government, public, hospital, civic, grandstand

10,743 of the 13,877 buildings are untyped.

## Claim A: how many could already be typed from the data

Of the 10,743 untyped buildings, how many carry at least one of these other tags: `name`,
`amenity`, `shop`, `tourism`, `office`, `craft`, `leisure`, `healthcare`? Count a building once
however many of them it carries. Answer with one whole number.

## Claim B: where the untyped buildings are thickest

The area is cut into 250 m grid cells. A building belongs to the cell that holds the average of its
footprint's corners. Name the three cells you believe hold the most untyped buildings, as labels like
`r05c05`. Only cells inside the grid below count.

250 m grid. A cell is rNNcNN. Row 0 starts at latitude 35.08 and rows count southward;
col 0 starts at longitude -85.35 and cols count eastward.
Rows (centre latitude):
  r01 35.0766   r02 35.0744   r03 35.0721   r04 35.0699   r05 35.0676   r06 35.0654
  r07 35.0631   r08 35.0609   r09 35.0586   r10 35.0564   r11 35.0541   r12 35.0519
  r13 35.0496   r14 35.0474   r15 35.0452   r16 35.0429   r17 35.0407   r18 35.0384
  r19 35.0362   r20 35.0339   r21 35.0317   r22 35.0294   r23 35.0272   r24 35.0249
  r25 35.0227   r26 35.0204   r27 35.0182   r28 35.0159   r29 35.0137   r30 35.0114
  r31 35.0092   r32 35.0069
Cols (centre longitude):
  c01 -85.3459   c02 -85.3431   c03 -85.3404   c04 -85.3376   c05 -85.3349   c06 -85.3322
  c07 -85.3294   c08 -85.3267   c09 -85.3239   c10 -85.3212   c11 -85.3184   c12 -85.3157
  c13 -85.3129   c14 -85.3102   c15 -85.3074   c16 -85.3047   c17 -85.3019   c18 -85.2992
  c19 -85.2965   c20 -85.2937   c21 -85.2910   c22 -85.2882   c23 -85.2855   c24 -85.2827
  c25 -85.2800   c26 -85.2772   c27 -85.2745   c28 -85.2717   c29 -85.2690   c30 -85.2662
  c31 -85.2635   c32 -85.2608   c33 -85.2580   c34 -85.2553

## How to answer

Reply with this JSON and nothing else. Do not run code and do not look anything up. The quote is
one sentence on why you think so.

```json
{"claims": [
  {"claim_id": "typable_from_tags", "claimed": 0, "quote": ""},
  {"claim_id": "top3_cells", "claimed": ["rNNcNN", "rNNcNN", "rNNcNN"], "quote": ""}
]}
```
