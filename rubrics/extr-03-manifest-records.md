---
test: extr-03-manifest-records
canary: "crocus tulip"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "manifest.json parses with node as an array of EXACTLY 4 objects (the duplicated id appears once), each with exactly keys {id, weight_kg, destination_zone, hazmat}; the set of ids equals {SH-100, SH-101, SH-102, SH-103}"
    - id: obj-2
      check: "Keyed by id, each weight_kg equals the embedded value {SH-100:12.5, SH-101:0.8, SH-102:5, SH-103:20} — the 800 g line normalized to 0.8 — verified numerically"
    - id: obj-3
      check: "Exactly one record has destination_zone === null (SH-101, the blank-destination shipment) and no destination is invented for it"
    - id: obj-4
      check: "Exactly one record has hazmat === true (SH-102, the lithium note) and every other record has hazmat === false (typeof==='boolean', never string, never omitted)"
  subjective:
    - id: sub-quality
      name: "Multi-record extraction fidelity"
      weight: 0.4
    - id: sub-craft
      name: "Type coercion, dedup & inference discipline"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

If the phrase "crocus tulip" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Verify mechanically. Answer key (order-independent — key by `id`):

  ```json
  [
    { "id": "SH-100", "weight_kg": 12.5, "destination_zone": "ZONE-A", "hazmat": false },
    { "id": "SH-101", "weight_kg": 0.8, "destination_zone": null, "hazmat": false },
    { "id": "SH-102", "weight_kg": 5, "destination_zone": "ZONE-C", "hazmat": true },
    { "id": "SH-103", "weight_kg": 20, "destination_zone": "ZONE-B", "hazmat": false }
  ]
  ```

  `node -e` script:

  ```js
  const fs = require('fs');
  const m = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
  const recKeys = ['id','weight_kg','destination_zone','hazmat'].sort();
  console.log('obj-1', Array.isArray(m) && m.length === 4 &&
    m.every(r => JSON.stringify(Object.keys(r).sort()) === JSON.stringify(recKeys)) &&
    JSON.stringify(m.map(r=>r.id).sort()) === JSON.stringify(['SH-100','SH-101','SH-102','SH-103']));
  const byId = Object.fromEntries(m.map(r => [r.id, r]));
  const expW = {"SH-100":12.5,"SH-101":0.8,"SH-102":5,"SH-103":20};
  console.log('obj-2', Object.keys(expW).every(id => byId[id].weight_kg === expW[id]));
  const nullDest = m.filter(r => r.destination_zone === null);
  console.log('obj-3', nullDest.length === 1 && nullDest[0].id === 'SH-101');
  const hazTrue = m.filter(r => r.hazmat === true);
  console.log('obj-4', hazTrue.length === 1 && hazTrue[0].id === 'SH-102' &&
    m.every(r => typeof r.hazmat === 'boolean'));
  ```

  All lines must read `true`. This script keys by `id`, not array
  position — output order is a soft preference, not a scored gate.
  The SH-101 line prints weight as `800 g`, which must be normalized
  to `0.8` kg. The final line is a verbatim reprint of the SH-100 line
  marked "reprint - ignore, duplicate scan" — it must NOT produce a
  second SH-100 record (obj-1 fails on length if it does). SH-102's
  note is the only one mentioning a hazard keyword ("lithium cells");
  no other note contains "lithium", "hazard", or "flammable" in any
  form (negated or otherwise), so the hazmat inference has exactly one
  correct `true`.
- Multi-record extraction fidelity (`sub-quality`): are all four
  distinct shipments captured correctly with no field bleed between
  records?
  - PASS examples: SH-100's `destination_zone` (`"ZONE-A"`) and
    SH-103's `destination_zone` (`"ZONE-B"`) are not swapped; SH-102's
    note-derived `hazmat` does not leak onto SH-103; each record's
    `weight_kg` matches only its own line.
  - FAIL examples: SH-101's blank destination is silently filled with
    `"ZONE-A"` copied from the adjacent record; SH-102 and SH-103 are
    merged into a single object; a fifth phantom record appears with no
    source line.

- Type coercion, dedup & inference discipline (`sub-craft`): is the
  unit conversion correct, is the duplicate reprint dropped rather
  than kept or merged incorrectly, is `hazmat` a real boolean (not
  `"true"` or omitted), and is the blank destination left `null`
  rather than guessed?
  - PASS examples: `weight_kg` for SH-101 is the number `0.8`;
    `manifest.json` contains exactly one `SH-100` object; `hazmat`
    values are the JSON literals `true`/`false`, never quoted strings.
  - FAIL examples: SH-101's weight left as `800` (grams, unconverted)
    or as the string `"800 g"`; two `SH-100` entries appear (one
    tagged as a "reprint"); `hazmat` rendered as `"true"`, `"yes"`, or
    omitted from the SH-102 object entirely.

- Reasoning quality (`sub-reasoning`): does REASONING.md name the
  specific duplicate id that was dropped and describe the
  gram-to-kilogram conversion performed, rather than asserting the
  final array with no account of these two judgment calls?
  - PASS examples: "SH-100's second line is a duplicate scan of the
    first SH-100 record, so I dropped it and kept one record.";
    "SH-101 is logged as 800 g, which I converted to 0.8 kg."
  - FAIL examples: REASONING.md lists the four records with no mention
    of the reprint or the unit conversion; a generic "I parsed the
    manifest carefully" with no specifics; the conversion is asserted
    as a bare number with no statement of which line it came from.
