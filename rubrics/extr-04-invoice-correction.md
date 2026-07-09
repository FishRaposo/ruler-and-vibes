---
test: extr-04-invoice-correction
canary: "daffodil orchid"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "reconciled.json parses with node; line_items is an array of EXACTLY 4 objects (the credited DX-4 line removed), and the BX-9 line shows qty === 30 with extended === 450.00; the top-level object's keys are exactly {invoice_number, line_items, discount, subtotal, tax, total}"
    - id: obj-2
      check: "subtotal === 622.00 (sum of the four surviving corrected lines: 54.00+100.00+450.00+18.00), recomputed independently by the judge from the embedded line data"
    - id: obj-3
      check: "discount === 25.00 applied to reach discounted base 597.00, and tax === 47.76 (8% of 597.00) — order of operations (discount BEFORE tax) verified by the judge"
    - id: obj-4
      check: "total === 644.76 (numeric), and the removed line's SKU 'DX-4' appears nowhere in reconciled.json (string search over the raw file)"
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
anchors:
  - id: Cross-document reconciliation accuracy
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Override ordering & schema authority
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "daffodil orchid" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Verify mechanically. Answer key:

  ```json
  {
    "invoice_number": "INV-5521",
    "line_items": [
      { "sku": "AX-1", "description": "Widget Bracket", "qty": 6, "unit_price": 9.00, "extended": 54.00 },
      { "sku": "AX-2", "description": "Widget Panel", "qty": 4, "unit_price": 25.00, "extended": 100.00 },
      { "sku": "BX-9", "description": "Conveyor Roller", "qty": 30, "unit_price": 15.00, "extended": 450.00 },
      { "sku": "CX-7", "description": "Mounting Clip", "qty": 12, "unit_price": 1.50, "extended": 18.00 }
    ],
    "discount": 25.00,
    "subtotal": 622.00,
    "tax": 47.76,
    "total": 644.76
  }
  ```

  `node -e` script:

  ```js
  const fs = require('fs');
  const raw = fs.readFileSync('reconciled.json', 'utf8');
  const r = JSON.parse(raw);
  const topKeys = ['invoice_number','line_items','discount','subtotal','tax','total'].sort();
  const bx9 = (r.line_items||[]).find(l => l.sku === 'BX-9');
  console.log('obj-1', Array.isArray(r.line_items) && r.line_items.length === 4 &&
    JSON.stringify(Object.keys(r).sort()) === JSON.stringify(topKeys) &&
    !!bx9 && bx9.qty === 30 && bx9.extended === 450.00);
  const recomputedSubtotal = Math.round(r.line_items.reduce((a,l)=>a+l.qty*l.unit_price,0)*100)/100;
  console.log('obj-2', r.subtotal === 622.00 && recomputedSubtotal === 622.00);
  const base = Math.round((recomputedSubtotal - r.discount)*100)/100;
  const tax = Math.round(base*0.08*100)/100;
  console.log('obj-3', r.discount === 25.00 && base === 597.00 && r.tax === 47.76 && tax === 47.76);
  const total = Math.round((base+tax)*100)/100;
  console.log('obj-4', r.total === 644.76 && total === 644.76 && !raw.includes('DX-4'));
  ```

  All lines must read `true`. Ground truth: surviving lines AX-1
  54.00, AX-2 100.00, BX-9 (30×15.00) 450.00, CX-7 18.00 sum to
  subtotal 622.00; minus the 25.00 discount = 597.00 discounted base;
  ×8% tax = 47.76; total 644.76. The removed DX-4 line (120.00) must
  not appear anywhere in the file (string search over the raw text,
  not just the parsed object, in case it survives in a comment-like
  field).

  Two traps to check a submission did NOT fall into:
  - **Transcribing the printed total.** The invoice's own printed
    total (using the OLD BX-9 qty of 3 and DX-4 still present) is
    363.96 — nowhere near 644.76. Landing on 363.96 means the
    correction email was ignored entirely.
  - **Taxing before discounting.** Applying 8% tax to 622.00 first and
    then subtracting the 25.00 discount gives 622.00×1.08−25.00 =
    646.76 — close to but distinct from the correct 644.76. Landing on
    646.76 means the order of operations in point 3 of the email
    (discount before tax) was inverted.
- Cross-document reconciliation accuracy: were all three overrides
  (quantity correction, line removal, discount) correctly located in
  the email and applied to the right lines?
  - PASS examples: BX-9's qty is corrected to 30 (not left at the
    printed 3), with `extended` recomputed to 450.00; DX-4 is fully
    absent from `line_items` (not zeroed out, not kept with qty 0);
    the $25.00 discount is applied as a single flat subtraction to the
    subtotal.
  - FAIL examples: BX-9's qty left at 3, or "corrected" to the wrong
    figure (e.g. 3.0 or 300, a misplaced decimal); DX-4 kept in
    `line_items` with `qty: 0` or `extended: 0.00` instead of removed;
    the discount misread as a percentage (25% instead of a flat
    $25.00) or subtracted from `tax` instead of `subtotal`.
- Override ordering & schema authority: was the order of operations
  (corrections → subtotal → discount → tax → total) followed exactly,
  and does the output schema carry the override's authority cleanly
  (no stray original-invoice figures, no leftover reference to DX-4)?
  - PASS examples: `tax` computed as 8% of `(subtotal - discount)`,
    i.e. 0.08×597.00 = 47.76; no trace of DX-4 or "Servo Motor"
    anywhere in the raw file, not even in a comment-like description
    field; `invoice_number` carried over exactly as `"INV-5521"` with
    no stray original subtotal/tax/total values duplicated elsewhere.
  - FAIL examples: `tax` computed on the pre-discount subtotal
    (622.00×0.08 = 49.76) with the discount subtracted afterward;
    `reconciled.json` includes a residual field or comment mentioning
    DX-4 or "Servo Motor" as removed; extra keys added (e.g.
    `"notes"`, `"original_total"`) beyond the six schema keys.
- Reasoning quality: does REASONING.md walk the override sequence —
  the BX-9 quantity fix, the DX-4 removal, and the discount-before-tax
  ordering — showing the arithmetic tying back to 644.76, rather than
  asserting the final total with no derivation?
  - PASS examples: "BX-9: 30 × 15.00 = 450.00 (not 3 × 15.00 = 45.00);
    DX-4 removed entirely; subtotal 54.00+100.00+450.00+18.00 =
    622.00; minus the 25.00 discount = 597.00; ×8% tax = 47.76; total
    644.76."; an explicit note that the discount is applied before tax
    per the email's third instruction.
  - FAIL examples: REASONING.md states "the total is 644.76" with no
    supporting arithmetic; the corrections are described narratively
    but the subtotal/discount/tax arithmetic is never shown; the
    derivation asserts a number without tying it back to the surviving
    line items.
