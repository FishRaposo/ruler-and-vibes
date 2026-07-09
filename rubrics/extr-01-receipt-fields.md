---
test: extr-01-receipt-fields
canary: "zinnia dahlia"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "receipt.json parses with node as a single object (typeof==='object' && !Array.isArray) whose keys are EXACTLY {store_name, purchase_date, items, subtotal, tax, total, loyalty_number} — no missing and no extra keys"
    - id: obj-2
      check: "loyalty_number === null strictly (JSON null; NOT the string 'null', NOT a reconstructed digit string, NOT an empty string)"
    - id: obj-3
      check: "store_name === 'Northgate Pantry', purchase_date === '2024-11-08', and items deep-equals ['Oat Milk 1L', 'Sourdough Loaf', 'Roasted Almonds 200g'] in that order"
    - id: obj-4
      check: "subtotal === 43.00, tax === 4.30, and total === 47.30 (all numeric)"
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

If the phrase "zinnia dahlia" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Verify mechanically. Answer key:

  ```json
  {
    "store_name": "Northgate Pantry",
    "purchase_date": "2024-11-08",
    "items": ["Oat Milk 1L", "Sourdough Loaf", "Roasted Almonds 200g"],
    "subtotal": 43.00,
    "tax": 4.30,
    "total": 47.30,
    "loyalty_number": null
  }
  ```

  `node -e` script:

  ```js
  const fs = require('fs');
  const r = JSON.parse(fs.readFileSync('receipt.json', 'utf8'));
  const expectedKeys = ['store_name','purchase_date','items','subtotal','tax','total','loyalty_number'].sort();
  console.log('obj-1', typeof r === 'object' && !Array.isArray(r) && JSON.stringify(Object.keys(r).sort()) === JSON.stringify(expectedKeys));
  console.log('obj-2', r.loyalty_number === null);
  console.log('obj-3', r.store_name === 'Northgate Pantry' && r.purchase_date === '2024-11-08' && JSON.stringify(r.items) === JSON.stringify(['Oat Milk 1L','Sourdough Loaf','Roasted Almonds 200g']));
  console.log('obj-4', r.subtotal === 43.00 && r.tax === 4.30 && r.total === 47.30);
  ```

  All four lines must read `true`. The subtotal, tax, and total are
  printed consistently on the receipt (10.00+18.00+15.00=43.00; 10% tax
  = 4.30; total = 47.30) — this test has no arithmetic trap, only the
  null-discipline trap on `loyalty_number`. The loyalty line prints
  `4471-**8-2*9`: three characters are asterisked out, so no full
  value can be honestly recovered; any submitted string (even one that
  copies the partial digits and asterisks, or invents replacement
  digits) fails obj-2.

- Transcription fidelity (`sub-quality`): does every field map cleanly
  from the printed text with no transcription slips (case, spelling,
  item order)?
  - PASS examples: `store_name` is `"Northgate Pantry"` with exact
    casing; `items` preserves the printed order Oat Milk → Sourdough →
    Almonds; `purchase_date` copied as `"2024-11-08"` verbatim.
  - FAIL examples: `store_name` lower-cased to `"northgate pantry"` or
    abbreviated to `"Northgate"`; `items` reordered (Sourdough before
    Oat Milk) or a description trimmed to `"Almonds"`; `purchase_date`
    reformatted to `"11/08/2024"`.

- Schema conformance & null discipline (`sub-craft`): exact key set,
  correct types (numbers as numbers, not strings), and — the crux of
  this test — is `null` used for the illegible field instead of a
  guess, a partial string, or an empty string?
  - PASS examples: exactly the seven schema keys present with
    `loyalty_number` as JSON `null`; `subtotal` emitted as the number
    `43.00`, not `"43.00"`; no extra `bay`/`register` key added.
  - FAIL examples: `loyalty_number` set to `"4471-**8-2*9"`,
    `"4471-018-289"`, `""`, or the string `"null"`; a stray eighth key
    such as `"bay"` included; `total` emitted as the string `"47.30"`.

- Reasoning quality (`sub-reasoning`): does REASONING.md state
  explicitly, in plain terms, why `loyalty_number` is `null` (the card
  is smudged / three characters are asterisked and unrecoverable),
  rather than silently omitting an explanation or hand-waving past it?
  - PASS examples: "The loyalty line reads `4471-**8-2*9` — three
    positions are masked, so the full number cannot be recovered and I
    set `loyalty_number` to `null`."; a note that guessing the masked
    digits would violate the no-invention constraint.
  - FAIL examples: no mention of `loyalty_number` at all; a vague
    "some fields were unclear" with no statement of which field or why;
    a claim that the number was "reconstructed from context."
