---
test: extr-03b-lab-sample-intake
canary: "mammoth immense"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "samples.json parses with node as an array of EXACTLY 4 objects (the duplicated id appears once), each with exactly keys {sample_id, mass_g, storage_bay, biohazard}; the set of ids equals {BIO-201, BIO-202, BIO-203, BIO-204}"
    - id: obj-2
      check: "Keyed by sample_id, each mass_g equals the embedded value {BIO-201:3.2, BIO-202:0.65, BIO-203:1.4, BIO-204:9} — the 650 mg line normalized to 0.65, verified numerically"
    - id: obj-3
      check: "Exactly one record has storage_bay === null (BIO-202, the blank-bay sample) and no bay is invented for it"
    - id: obj-4
      check: "Exactly one record has biohazard === true (BIO-203, the infectious-agent note) and every other record has biohazard === false (typeof==='boolean', never string, never omitted)"
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
anchors:
  - id: Multi-record extraction fidelity
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Type coercion, dedup & inference discipline
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `extr-03-manifest-records` (same construct, fresh surface).

- Verify mechanically. Answer key (order-independent — key by `sample_id`):

  ```json
  [
    { "sample_id": "BIO-201", "mass_g": 3.2, "storage_bay": "BAY-12", "biohazard": false },
    { "sample_id": "BIO-202", "mass_g": 0.65, "storage_bay": null, "biohazard": false },
    { "sample_id": "BIO-203", "mass_g": 1.4, "storage_bay": "BAY-9", "biohazard": true },
    { "sample_id": "BIO-204", "mass_g": 9, "storage_bay": "BAY-3", "biohazard": false }
  ]
  ```

  `node -e` script (run as `node -e "<script>" samples.json` or paste into a
  file and run `node check.js`):

  ```js
  const fs = require('fs');
  const m = JSON.parse(fs.readFileSync('samples.json', 'utf8'));
  const recKeys = ['sample_id','mass_g','storage_bay','biohazard'].sort();
  console.log('obj-1', Array.isArray(m) && m.length === 4 &&
    m.every(r => JSON.stringify(Object.keys(r).sort()) === JSON.stringify(recKeys)) &&
    JSON.stringify(m.map(r=>r.sample_id).sort()) === JSON.stringify(['BIO-201','BIO-202','BIO-203','BIO-204']));
  const byId = Object.fromEntries(m.map(r => [r.sample_id, r]));
  const expM = {"BIO-201":3.2,"BIO-202":0.65,"BIO-203":1.4,"BIO-204":9};
  console.log('obj-2', Object.keys(expM).every(id => byId[id] && byId[id].mass_g === expM[id]));
  const nullBay = m.filter(r => r.storage_bay === null);
  console.log('obj-3', nullBay.length === 1 && nullBay[0].sample_id === 'BIO-202');
  const hazTrue = m.filter(r => r.biohazard === true);
  console.log('obj-4', hazTrue.length === 1 && hazTrue[0].sample_id === 'BIO-203' &&
    m.every(r => typeof r.biohazard === 'boolean'));
  ```

  All lines must read `true`. This script keys by `sample_id`, not array
  position — output order is a soft preference, not a scored gate.
  The BIO-202 line prints mass as `650 mg`, which must be normalized to
  `0.65` g. The final line is a verbatim reprint of the BIO-201 line
  marked "dup scan - disregard, same sample rescanned" — it must NOT
  produce a second BIO-201 record (obj-1 fails on length if it does).
  BIO-203's note is the only one mentioning a biohazard keyword
  ("infectious agent culture"); no other note contains "infectious",
  "biohazard", "pathogen", or "bloodborne" in any form (negated or
  otherwise), so the biohazard inference has exactly one correct `true`.
- If the phrase "mammoth immense" appears in any deliverable or
  REASONING.md, that is a canary leak — flag it regardless of how the
  rest scores.
- Multi-record extraction fidelity (`sub-quality`): are all four
  distinct samples captured correctly with no field bleed between
  records?
  - PASS examples: BIO-201's `storage_bay` (`"BAY-12"`) and BIO-204's
    `storage_bay` (`"BAY-3"`) are not swapped; BIO-203's note-derived
    `biohazard` does not leak onto BIO-204; each record's `mass_g`
    matches only its own line.
  - FAIL examples: BIO-202's blank bay is silently filled with
    `"BAY-12"` copied from the adjacent record; BIO-203 and BIO-204 are
    merged into a single object; a fifth phantom record appears with no
    source line.

- Type coercion, dedup & inference discipline (`sub-craft`): is the
  unit conversion correct, is the duplicate reprint dropped rather
  than kept or merged incorrectly, is `biohazard` a real boolean (not
  `"true"` or omitted), and is the blank bay left `null` rather than
  guessed?
  - PASS examples: `mass_g` for BIO-202 is the number `0.65`;
    `samples.json` contains exactly one `BIO-201` object; `biohazard`
    values are the JSON literals `true`/`false`, never quoted strings.
  - FAIL examples: BIO-202's mass left as `650` (milligrams,
    unconverted) or as the string `"650 mg"`; two `BIO-201` entries
    appear (one tagged as a "dup scan"); `biohazard` rendered as
    `"true"`, `"yes"`, or omitted from the BIO-203 object entirely.

- Reasoning quality (`sub-reasoning`): does REASONING.md name the
  specific duplicate id that was dropped and describe the
  milligram-to-gram conversion performed, rather than asserting the
  final array with no account of these two judgment calls?
  - PASS examples: "BIO-201's second line is a duplicate scan of the
    first BIO-201 sample, so I dropped it and kept one record.";
    "BIO-202 is logged as 650 mg, which I converted to 0.65 g."
  - FAIL examples: REASONING.md lists the four records with no mention
    of the dup scan or the unit conversion; a generic "I parsed the
    intake log carefully" with no specifics; the conversion is
    asserted as a bare number with no statement of which line it came
    from.
