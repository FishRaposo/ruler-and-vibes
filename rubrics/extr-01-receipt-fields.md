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
- Transcription fidelity: does every field map cleanly from the
  printed text with no transcription slips (case, spelling, item
  order)?
- Schema conformance & null discipline: exact key set, correct types
  (numbers as numbers, not strings), and — the crux of this test — is
  `null` used for the illegible field instead of a guess, a partial
  string, or an empty string?
- Reasoning quality: does REASONING.md state explicitly, in plain
  terms, why `loyalty_number` is `null` (the card is smudged / three
  characters are asterisked and unrecoverable), rather than silently
  omitting an explanation or hand-waving past it?
