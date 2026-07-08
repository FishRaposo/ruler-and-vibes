---
test: extr-01b-dispatch-slip
canary: "jacana pollan"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "dispatch.json parses with node as a single object (typeof==='object' && !Array.isArray) whose keys are EXACTLY {carrier_name, dispatch_date, parcels, declared_weight, surcharge, total, tracking_code} — no missing and no extra keys"
    - id: obj-2
      check: "tracking_code === null strictly (JSON null; NOT the string 'null', NOT a reconstructed character string, NOT an empty string)"
    - id: obj-3
      check: "carrier_name === 'Fernbrook Freight Depot', dispatch_date === '2025-03-19', and parcels deep-equals ['Padded Book Mailer x12', 'Wardrobe Carton', 'Bubble Wrap Roll 50m'] in that order"
    - id: obj-4
      check: "declared_weight === 67.00, surcharge === 10.05, and total === 77.05 (all numeric)"
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

Parallel form of `extr-01-receipt-fields` (same construct, fresh surface).

If the phrase "jacana pollan" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Verify mechanically. Answer key:

  ```json
  {
    "carrier_name": "Fernbrook Freight Depot",
    "dispatch_date": "2025-03-19",
    "parcels": ["Padded Book Mailer x12", "Wardrobe Carton", "Bubble Wrap Roll 50m"],
    "declared_weight": 67.00,
    "surcharge": 10.05,
    "total": 77.05,
    "tracking_code": null
  }
  ```

  `node -e` script (run it as `node check.js dispatch.json` after
  saving the block below to `check.js`):

  ```js
  const fs = require('fs');
  const r = JSON.parse(fs.readFileSync(process.argv[2] || 'dispatch.json', 'utf8'));
  const expectedKeys = ['carrier_name','dispatch_date','parcels','declared_weight','surcharge','total','tracking_code'].sort();
  console.log('obj-1', typeof r === 'object' && !Array.isArray(r) && JSON.stringify(Object.keys(r).sort()) === JSON.stringify(expectedKeys));
  console.log('obj-2', r.tracking_code === null);
  console.log('obj-3', r.carrier_name === 'Fernbrook Freight Depot' && r.dispatch_date === '2025-03-19' && JSON.stringify(r.parcels) === JSON.stringify(['Padded Book Mailer x12','Wardrobe Carton','Bubble Wrap Roll 50m']));
  console.log('obj-4', r.declared_weight === 67.00 && r.surcharge === 10.05 && r.total === 77.05);
  ```

  All four lines must read `true`. The declared weight, surcharge, and
  total are printed consistently on the slip (22.00+31.00+14.00=67.00;
  15% surcharge = 10.05; total = 77.05) — this test has no arithmetic
  trap, only the null-discipline trap on `tracking_code`. The handling
  line prints `HC-73*-*1*6`: three characters are asterisked out, so no
  full value can be honestly recovered; any submitted string (even one
  that copies the partial characters and asterisks, or invents
  replacement characters) fails obj-2.

- Transcription fidelity (`sub-quality`): does every field map cleanly
  from the printed text with no transcription slips (case, spelling,
  parcel order)?
  - PASS examples: `carrier_name` is `"Fernbrook Freight Depot"` with
    exact casing; `parcels` preserves the printed order Mailer →
    Carton → Wrap; `dispatch_date` copied as `"2025-03-19"` verbatim.
  - FAIL examples: `carrier_name` lower-cased to
    `"fernbrook freight depot"` or abbreviated to `"Fernbrook Freight"`;
    `parcels` reordered (Carton before Mailer) or a description trimmed
    to `"Wardrobe"`; `dispatch_date` reformatted to `"03/19/2025"`.

- Schema conformance & null discipline (`sub-craft`): exact key set,
  correct types (numbers as numbers, not strings), and — the crux of
  this test — is `null` used for the illegible field instead of a guess,
  a partial string, or an empty string?
  - PASS examples: exactly the seven schema keys present with
    `tracking_code` as JSON `null`; `declared_weight` emitted as the
    number `67.00`, not `"67.00"`; no extra `dock`/`bay` key added.
  - FAIL examples: `tracking_code` set to `"HC-73*-*1*6"`, `"HC-731-816"`,
    `""`, or the string `"null"`; a stray eighth key such as `"dock"`
    included; `total` emitted as the string `"77.05"`.

- Reasoning quality (`sub-reasoning`): does REASONING.md state
  explicitly, in plain terms, why `tracking_code` is `null` (the label
  is scuffed / three characters are asterisked and unrecoverable),
  rather than silently omitting an explanation or hand-waving past it?
  - PASS examples: "The handling code reads `HC-73*-*1*6` — three
    positions are masked, so the full code cannot be recovered and I set
    `tracking_code` to `null`."; a note that guessing the masked
    characters would violate the no-invention constraint.
  - FAIL examples: no mention of `tracking_code` at all; a vague
    "some fields were unclear" with no statement of which field or why;
    a claim that the code was "reconstructed from context."
