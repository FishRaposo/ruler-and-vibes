---
test: extr-04c-signage-order-correction
canary: "murmur rustle"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "reconciled.json parses with node; line_items is an array of EXACTLY 4 objects (the credited PS-5 line removed), and the PS-3 line shows qty === 40 with extended === 880.00; the top-level object's keys are exactly {invoice_number, line_items, discount, subtotal, tax, total}"
    - id: obj-2
      check: "subtotal === 1280.00 (sum of the four surviving corrected lines: 210.00+120.00+880.00+70.00), recomputed independently by the judge from the embedded line data"
    - id: obj-3
      check: "discount === 28.00 applied to reach discounted base 1252.00, and tax === 112.68 (9% of 1252.00) — order of operations (discount BEFORE tax) verified by the judge"
    - id: obj-4
      check: "total === 1364.68 (numeric), and the removed line's SKU 'PS-5' appears nowhere in reconciled.json (string search over the raw file)"
  subjective:
    - id: sub-quality
      name: "Cross-document reconciliation accuracy"
      weight: 0.4
    - id: sub-craft
      name: "Override ordering & schema authority"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `extr-04-invoice-correction` (same construct, fresh
surface).

If the phrase "murmur rustle" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Verify mechanically. Answer key:

  ```json
  {
    "invoice_number": "INV-8834",
    "line_items": [
      { "sku": "PS-1", "description": "Vinyl Banner", "qty": 5, "unit_price": 42.00, "extended": 210.00 },
      { "sku": "PS-2", "description": "Yard Sign", "qty": 8, "unit_price": 15.00, "extended": 120.00 },
      { "sku": "PS-3", "description": "Foam Board Poster", "qty": 40, "unit_price": 22.00, "extended": 880.00 },
      { "sku": "PS-4", "description": "Business Card Box", "qty": 20, "unit_price": 3.50, "extended": 70.00 }
    ],
    "discount": 28.00,
    "subtotal": 1280.00,
    "tax": 112.68,
    "total": 1364.68
  }
  ```

  `node -e` script:

  ```js
  const fs = require('fs');
  const raw = fs.readFileSync('reconciled.json', 'utf8');
  const r = JSON.parse(raw);
  const topKeys = ['invoice_number','line_items','discount','subtotal','tax','total'].sort();
  const ps3 = (r.line_items||[]).find(l => l.sku === 'PS-3');
  console.log('obj-1', Array.isArray(r.line_items) && r.line_items.length === 4 &&
    JSON.stringify(Object.keys(r).sort()) === JSON.stringify(topKeys) &&
    !!ps3 && ps3.qty === 40 && ps3.extended === 880.00);
  const recomputedSubtotal = Math.round(r.line_items.reduce((a,l)=>a+l.qty*l.unit_price,0)*100)/100;
  console.log('obj-2', r.subtotal === 1280.00 && recomputedSubtotal === 1280.00);
  const base = Math.round((recomputedSubtotal - r.discount)*100)/100;
  const tax = Math.round(base*0.09*100)/100;
  console.log('obj-3', r.discount === 28.00 && base === 1252.00 && r.tax === 112.68 && tax === 112.68);
  const total = Math.round((base+tax)*100)/100;
  console.log('obj-4', r.total === 1364.68 && total === 1364.68 && !raw.includes('PS-5'));
  ```

  All lines must read `true`. Ground truth: surviving lines PS-1
  210.00, PS-2 120.00, PS-3 (40×22.00) 880.00, PS-4 70.00 sum to
  subtotal 1280.00; minus the 28.00 discount = 1252.00 discounted
  base; ×9% tax = 112.68; total 1364.68. The removed PS-5 line
  (95.00) must not appear anywhere in the file (string search over
  the raw text, not just the parsed object, in case it survives in a
  comment-like field).

  Two traps to check a submission did NOT fall into:
  - **Transcribing the printed total.** The invoice's own printed
    total (using the OLD PS-3 qty of 4 and PS-5 still present) is
    635.47 — nowhere near 1364.68. Landing on 635.47 means the
    correction email was ignored entirely.
  - **Taxing before discounting.** Applying 9% tax to 1280.00 first
    and then subtracting the 28.00 discount gives
    1280.00×1.09−28.00 = 1367.20 — close to but distinct from the
    correct 1364.68. Landing on 1367.20 means the order of
    operations in point 3 of the email (discount before tax) was
    inverted.
- Cross-document reconciliation accuracy: were all three overrides
  (quantity correction, line removal, discount) correctly located in
  the email and applied to the right lines?
  - PASS examples: PS-3's qty is corrected to 40 (not left at the
    printed 4), with `extended` recomputed to 880.00; PS-5 is fully
    absent from `line_items` (not zeroed out, not kept with qty 0);
    the $28.00 discount is applied as a single flat subtraction to the
    subtotal.
  - FAIL examples: PS-3's qty left at 4, or "corrected" to the wrong
    figure (e.g. 14 or 400, a transposition); PS-5 kept in
    `line_items` with `qty: 0` or `extended: 0.00` instead of removed;
    the discount misread as a percentage (28% instead of a flat
    $28.00) or subtracted from `tax` instead of `subtotal`.
- Override ordering & schema authority: was the order of operations
  (corrections → subtotal → discount → tax → total) followed exactly,
  and does the output schema carry the override's authority cleanly
  (no stray original-invoice figures, no leftover reference to PS-5)?
  - PASS examples: `tax` computed as 9% of `(subtotal - discount)`,
    i.e. 0.09×1252.00 = 112.68; no trace of PS-5 or "Retractable
    Banner Stand" anywhere in the raw file, not even in a comment-like
    description field; `invoice_number` carried over exactly as
    `"INV-8834"` with no stray original subtotal/tax/total values
    duplicated elsewhere.
  - FAIL examples: `tax` computed on the pre-discount subtotal
    (1280.00×0.09 = 115.20) with the discount subtracted afterward;
    `reconciled.json` includes a residual field or comment mentioning
    PS-5 or "Retractable Banner Stand" as removed; extra keys added
    (e.g. `"notes"`, `"original_total"`) beyond the six schema keys.
- Reasoning quality: does REASONING.md walk the override sequence —
  the PS-3 quantity fix, the PS-5 removal, and the discount-before-tax
  ordering — showing the arithmetic tying back to 1364.68, rather than
  asserting the final total with no derivation?
  - PASS examples: "PS-3: 40 × 22.00 = 880.00 (not 4 × 22.00 = 88.00);
    PS-5 removed entirely; subtotal 210.00+120.00+880.00+70.00 =
    1280.00; minus the 28.00 discount = 1252.00; ×9% tax = 112.68;
    total 1364.68."; an explicit note that the discount is applied
    before tax per the email's third instruction.
  - FAIL examples: REASONING.md states "the total is 1364.68" with no
    supporting arithmetic; the corrections are described narratively
    but the subtotal/discount/tax arithmetic is never shown; the
    derivation asserts a number without tying it back to the surviving
    line items.
