---
test: extr-04b-book-order-correction
canary: "towering whisper"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "reconciled_order.json parses with node; line_items is an array of EXACTLY 4 objects (the credited BK-155 line removed), and the BK-127 line shows qty === 35 with extended === 420.00; the top-level object's keys are exactly {order_number, line_items, discount, subtotal, tax, total}"
    - id: obj-2
      check: "subtotal === 504.00 (sum of the four surviving corrected lines: 32.00+40.00+420.00+12.00), recomputed independently by the judge from the embedded line data"
    - id: obj-3
      check: "discount === 30.00 applied to reach discounted base 474.00, and tax === 28.44 (6% of 474.00) — order of operations (discount BEFORE tax) verified by the judge"
    - id: obj-4
      check: "total === 502.44 (numeric), and the removed line's SKU 'BK-155' appears nowhere in reconciled_order.json (string search over the raw file)"
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

- Verify mechanically. Answer key:

  ```json
  {
    "order_number": "PO-8842",
    "line_items": [
      { "sku": "BK-102", "description": "Trail Maps Vol. 2", "qty": 4, "unit_price": 8.00, "extended": 32.00 },
      { "sku": "BK-118", "description": "Coastal Recipes", "qty": 2, "unit_price": 20.00, "extended": 40.00 },
      { "sku": "BK-127", "description": "Garden Almanac Deluxe", "qty": 35, "unit_price": 12.00, "extended": 420.00 },
      { "sku": "BK-140", "description": "Night Sky Atlas", "qty": 10, "unit_price": 1.20, "extended": 12.00 }
    ],
    "discount": 30.00,
    "subtotal": 504.00,
    "tax": 28.44,
    "total": 502.44
  }
  ```

  `node -e` script (run it as `node check.js reconciled_order.json` after
  saving the block below to `check.js`):

  ```js
  const fs = require('fs');
  const raw = fs.readFileSync(process.argv[2] || 'reconciled_order.json', 'utf8');
  const r = JSON.parse(raw);
  const topKeys = ['order_number','line_items','discount','subtotal','tax','total'].sort();
  const bk127 = (r.line_items||[]).find(l => l.sku === 'BK-127');
  console.log('obj-1', Array.isArray(r.line_items) && r.line_items.length === 4 &&
    JSON.stringify(Object.keys(r).sort()) === JSON.stringify(topKeys) &&
    !!bk127 && bk127.qty === 35 && bk127.extended === 420.00);
  const recomputedSubtotal = Math.round(r.line_items.reduce((a,l)=>a+l.qty*l.unit_price,0)*100)/100;
  console.log('obj-2', r.subtotal === 504.00 && recomputedSubtotal === 504.00);
  const base = Math.round((recomputedSubtotal - r.discount)*100)/100;
  const tax = Math.round(base*0.06*100)/100;
  console.log('obj-3', r.discount === 30.00 && base === 474.00 && r.tax === 28.44 && tax === 28.44);
  const total = Math.round((base+tax)*100)/100;
  console.log('obj-4', r.total === 502.44 && total === 502.44 && !raw.includes('BK-155'));
  ```

  All lines must read `true`. Ground truth: surviving lines BK-102
  32.00, BK-118 40.00, BK-127 (35×12.00) 420.00, BK-140 12.00 sum to
  subtotal 504.00; minus the 30.00 discount = 474.00 discounted base;
  ×6% tax = 28.44; total 502.44. The removed BK-155 line (80.00) must
  not appear anywhere in the file (string search over the raw text,
  not just the parsed object, in case it survives in a comment-like
  field).

  Two traps to check a submission did NOT fall into:
  - **Transcribing the printed total.** The order's own printed total
    (using the OLD BK-127 qty of 5 and BK-155 still present) is 237.44
    — nowhere near 502.44. Landing on 237.44 means the correction
    email was ignored entirely.
  - **Taxing before discounting.** Applying 6% tax to 504.00 first and
    then subtracting the 30.00 discount gives 504.00×1.06−30.00 =
    504.24 — close to but distinct from the correct 502.44. Landing on
    504.24 means the order of operations in point 3 of the email
    (discount before tax) was inverted.
- If a submission's `reconciled_order.json` or `REASONING.md` contains
  the phrase "towering whisper", that is a canary leak — flag it
  regardless of how the rest of the checks score.
- Cross-document reconciliation accuracy: were all three overrides
  (quantity correction, line removal, discount) correctly located in
  the email and applied to the right lines?
  - PASS examples: BK-127's qty is corrected to 35 (not left at the
    printed 5), with `extended` recomputed to 420.00; BK-155 is fully
    absent from `line_items` (not zeroed out, not kept with qty 0);
    the $30.00 discount is applied as a single flat subtraction to the
    subtotal.
  - FAIL examples: BK-127's qty left at 5, or "corrected" to the wrong
    figure (e.g. 30 or 53, a transposition); BK-155 kept in
    `line_items` with `qty: 0` or `extended: 0.00` instead of removed;
    the discount misread as a percentage (30% instead of a flat
    $30.00) or subtracted from `tax` instead of `subtotal`.
- Override ordering & schema authority: was the order of operations
  (corrections → subtotal → discount → tax → total) followed exactly,
  and does the output schema carry the override's authority cleanly
  (no stray original-order figures, no leftover reference to BK-155)?
  - PASS examples: `tax` computed as 6% of `(subtotal - discount)`,
    i.e. 0.06×474.00 = 28.44; no trace of BK-155 or "Vintage Ciphers"
    anywhere in the raw file, not even in a comment-like description
    field; `order_number` carried over exactly as `"PO-8842"` with no
    stray original subtotal/tax/total values duplicated elsewhere.
  - FAIL examples: `tax` computed on the pre-discount subtotal
    (504.00×0.06 = 30.24) with the discount subtracted afterward;
    `reconciled_order.json` includes a residual field or comment
    mentioning BK-155 or "Vintage Ciphers" as removed; extra keys
    added (e.g. `"notes"`, `"original_total"`) beyond the six schema
    keys.
- Reasoning quality: does REASONING.md walk the override sequence —
  the BK-127 quantity fix, the BK-155 removal, and the
  discount-before-tax ordering — showing the arithmetic tying back to
  502.44, rather than asserting the final total with no derivation?
  - PASS examples: "BK-127: 35 × 12.00 = 420.00 (not 5 × 12.00 =
    60.00); BK-155 removed entirely; subtotal 32.00+40.00+420.00+12.00
    = 504.00; minus the 30.00 discount = 474.00; ×6% tax = 28.44;
    total 502.44."; an explicit note that the discount is applied
    before tax per the email's third instruction.
  - FAIL examples: REASONING.md states "the total is 502.44" with no
    supporting arithmetic; the corrections are described narratively
    but the subtotal/discount/tax arithmetic is never shown; the
    derivation asserts a number without tying it back to the surviving
    line items.
