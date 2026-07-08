---
test: extr-03c-repair-work-orders
canary: "gigantic monumental"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "workorders.json parses with node as an array of EXACTLY 4 objects (the duplicated id appears once), each with exactly keys {id, labor_hours, bay, warranty}; the set of ids equals {WO-410, WO-411, WO-412, WO-413}"
    - id: obj-2
      check: "Keyed by id, each labor_hours equals the embedded value {WO-410:3.5, WO-411:0.75, WO-412:1.25, WO-413:6} — the 45-minute line normalized to 0.75 — verified numerically"
    - id: obj-3
      check: "Exactly one record has bay === null (WO-411, the blank-bay work order) and no bay is invented for it"
    - id: obj-4
      check: "Exactly one record has warranty === true (WO-412, the manufacturer-warranty note) and every other record has warranty === false (typeof==='boolean', never string, never omitted)"
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

Parallel form of `extr-03-manifest-records` (same construct, fresh surface).

If the phrase "gigantic monumental" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Verify mechanically. Answer key (order-independent — key by `id`):

  ```json
  [
    { "id": "WO-410", "labor_hours": 3.5, "bay": "BAY-2", "warranty": false },
    { "id": "WO-411", "labor_hours": 0.75, "bay": null, "warranty": false },
    { "id": "WO-412", "labor_hours": 1.25, "bay": "BAY-5", "warranty": true },
    { "id": "WO-413", "labor_hours": 6, "bay": "BAY-1", "warranty": false }
  ]
  ```

  `node -e` script:

  ```js
  const fs = require('fs');
  const m = JSON.parse(fs.readFileSync('workorders.json', 'utf8'));
  const recKeys = ['id','labor_hours','bay','warranty'].sort();
  console.log('obj-1', Array.isArray(m) && m.length === 4 &&
    m.every(r => JSON.stringify(Object.keys(r).sort()) === JSON.stringify(recKeys)) &&
    JSON.stringify(m.map(r=>r.id).sort()) === JSON.stringify(['WO-410','WO-411','WO-412','WO-413']));
  const byId = Object.fromEntries(m.map(r => [r.id, r]));
  const expH = {"WO-410":3.5,"WO-411":0.75,"WO-412":1.25,"WO-413":6};
  console.log('obj-2', Object.keys(expH).every(id => byId[id].labor_hours === expH[id]));
  const nullBay = m.filter(r => r.bay === null);
  console.log('obj-3', nullBay.length === 1 && nullBay[0].id === 'WO-411');
  const warrantyTrue = m.filter(r => r.warranty === true);
  console.log('obj-4', warrantyTrue.length === 1 && warrantyTrue[0].id === 'WO-412' &&
    m.every(r => typeof r.warranty === 'boolean'));
  ```

  All lines must read `true`. This script keys by `id`, not array
  position — output order is a soft preference, not a scored gate.
  The WO-411 line prints labor as `45 min`, which must be normalized
  to `0.75` hours. The final line is a verbatim reprint of the WO-410
  line marked "duplicate printout - ignore, same ticket rescanned" — it
  must NOT produce a second WO-410 record (obj-1 fails on length if it
  does). WO-412's note is the only one mentioning manufacturer-warranty
  coverage ("covered under manufacturer warranty"); no other note
  contains "warranty" in any form (negated or otherwise), so the
  warranty inference has exactly one correct `true`.

- Multi-record extraction fidelity (`sub-quality`): are all four
  distinct work orders captured correctly with no field bleed between
  records?
  - PASS examples: WO-410's bay (`"BAY-2"`) and WO-413's bay
    (`"BAY-1"`) are not swapped; WO-412's note-derived `warranty` does
    not leak onto WO-413; each record's `labor_hours` matches only its
    own line.
  - FAIL examples: WO-411's blank bay is silently filled with
    `"BAY-2"` copied from the adjacent record; WO-412 and WO-413 are
    merged into a single object; a fifth phantom record appears with no
    source line.

- Type coercion, dedup & inference discipline (`sub-craft`): is the
  minutes-to-hours conversion correct, is the duplicate printout
  dropped rather than kept or merged incorrectly, is `warranty` a real
  boolean (not `"true"` or omitted), and is the blank bay left `null`
  rather than guessed?
  - PASS examples: `labor_hours` for WO-411 is the number `0.75`;
    `workorders.json` contains exactly one `WO-410` object; `warranty`
    values are the JSON literals `true`/`false`, never quoted strings.
  - FAIL examples: WO-411's labor left as `45` (minutes, unconverted)
    or as the string `"45 min"`; two `WO-410` entries appear (one
    tagged as a "reprint"); `warranty` rendered as `"true"`,
    `"yes"`, or omitted from the WO-412 object entirely.

- Reasoning quality (`sub-reasoning`): does REASONING.md name the
  specific duplicate id that was dropped and describe the
  minutes-to-hours conversion performed, rather than asserting the
  final array with no account of these two judgment calls?
  - PASS examples: "WO-410's second line is a duplicate printout of the
    first WO-410 scan, so I dropped it and kept one record."; "WO-411
    is logged as 45 min, which I converted to 0.75 hours."
  - FAIL examples: REASONING.md lists the four records with no mention
    of the reprint or the unit conversion; a generic "I parsed the log
    carefully" with no specifics; the conversion is asserted as a bare
    number with no statement of which line it came from.
