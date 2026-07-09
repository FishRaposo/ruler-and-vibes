---
test: extr-01c-vet-visit-card
canary: "motmot ruffe"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "visit.json parses with node as a single object (typeof==='object' && !Array.isArray) whose keys are EXACTLY {clinic_name, visit_date, treatments, visit_subtotal, dispensing_fee, total, microchip_id} — no missing and no extra keys"
    - id: obj-2
      check: "microchip_id === null strictly (JSON null; NOT the string 'null', NOT a reconstructed character string, NOT an empty string)"
    - id: obj-3
      check: "clinic_name === 'Brightpaw Veterinary Clinic', visit_date === '2025-06-24', and treatments deep-equals ['Wellness Exam', 'Bordetella Vaccine', 'Nail Trim & Ear Clean'] in that order"
    - id: obj-4
      check: "visit_subtotal === 57.00, dispensing_fee === 11.40, and total === 68.40 (all numeric)"
  subjective:
    - id: sub-quality
      name: "Transcription fidelity"
      weight: 0.4
    - id: sub-craft
      name: "Schema conformance & null discipline"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Transcription fidelity
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Schema conformance & null discipline
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `extr-01-receipt-fields` (same construct, fresh surface).

If the phrase "motmot ruffe" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Verify mechanically. Answer key:

  ```json
  {
    "clinic_name": "Brightpaw Veterinary Clinic",
    "visit_date": "2025-06-24",
    "treatments": ["Wellness Exam", "Bordetella Vaccine", "Nail Trim & Ear Clean"],
    "visit_subtotal": 57.00,
    "dispensing_fee": 11.40,
    "total": 68.40,
    "microchip_id": null
  }
  ```

  `node -e` script (run it as `node check.js visit.json` after saving
  the block below to `check.js`):

  ```js
  const fs = require('fs');
  const r = JSON.parse(fs.readFileSync(process.argv[2] || 'visit.json', 'utf8'));
  const expectedKeys = ['clinic_name','visit_date','treatments','visit_subtotal','dispensing_fee','total','microchip_id'].sort();
  console.log('obj-1', typeof r === 'object' && !Array.isArray(r) && JSON.stringify(Object.keys(r).sort()) === JSON.stringify(expectedKeys));
  console.log('obj-2', r.microchip_id === null);
  console.log('obj-3', r.clinic_name === 'Brightpaw Veterinary Clinic' && r.visit_date === '2025-06-24' && JSON.stringify(r.treatments) === JSON.stringify(['Wellness Exam','Bordetella Vaccine','Nail Trim & Ear Clean']));
  console.log('obj-4', r.visit_subtotal === 57.00 && r.dispensing_fee === 11.40 && r.total === 68.40);
  ```

  All four lines must read `true`. The visit subtotal, dispensing fee,
  and total are printed consistently on the card (12.00+26.00+19.00=57.00;
  20% dispensing fee = 11.40; total = 68.40) — this test has no
  arithmetic trap, only the null-discipline trap on `microchip_id`. The
  microchip line prints `985-1*24-7**9`: three characters are asterisked
  out, so no full value can be honestly recovered; any submitted string
  (even one that copies the partial characters and asterisks, or invents
  replacement characters) fails obj-2.

- Transcription fidelity (`sub-quality`): does every field map cleanly
  from the printed text with no transcription slips (case, spelling,
  treatment order)?
  - PASS examples: `clinic_name` is `"Brightpaw Veterinary Clinic"` with
    exact casing; `treatments` preserves the printed order Exam →
    Vaccine → Nail Trim; `visit_date` copied as `"2025-06-24"` verbatim.
  - FAIL examples: `clinic_name` lower-cased to
    `"brightpaw veterinary clinic"` or abbreviated to `"Brightpaw Vet"`;
    `treatments` reordered (Vaccine before Exam) or a description trimmed
    to `"Nail Trim"`; `visit_date` reformatted to `"06/24/2025"`.

- Schema conformance & null discipline (`sub-craft`): exact key set,
  correct types (numbers as numbers, not strings), and — the crux of
  this test — is `null` used for the illegible field instead of a guess,
  a partial string, or an empty string?
  - PASS examples: exactly the seven schema keys present with
    `microchip_id` as JSON `null`; `visit_subtotal` emitted as the
    number `57.00`, not `"57.00"`; no extra `room`/`patient` key added.
  - FAIL examples: `microchip_id` set to `"985-1*24-7**9"`,
    `"985-1924-7889"`, `""`, or the string `"null"`; a stray eighth key
    such as `"patient"` included; `total` emitted as the string
    `"68.40"`.

- Reasoning quality (`sub-reasoning`): does REASONING.md state
  explicitly, in plain terms, why `microchip_id` is `null` (the sticker
  is crimped / three characters are asterisked and unrecoverable),
  rather than silently omitting an explanation or hand-waving past it?
  - PASS examples: "The microchip reads `985-1*24-7**9` — three
    positions are masked, so the full number cannot be recovered and I
    set `microchip_id` to `null`."; a note that guessing the masked
    characters would violate the no-invention constraint.
  - FAIL examples: no mention of `microchip_id` at all; a vague "some
    fields were unclear" with no statement of which field or why; a
    claim that the number was "reconstructed from context."
