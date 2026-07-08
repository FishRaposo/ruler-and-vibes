---
test: extr-02c-rental-invoice-recompute
canary: "colossal titanic"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "invoice.json parses with node; line_items is an array of EXACTLY 4 objects, each with exactly keys {description, qty, unit_price, extended}"
    - id: obj-2
      check: "Each extended equals qty*unit_price recomputed from the embedded key: 111.00, 47.50, 130.00, 81.00 respectively (order matching the printed line order)"
    - id: obj-3
      check: "subtotal === 369.50 (the CORRECT sum, NOT the wrong printed value 349.50), tax === 22.17 (6% of 369.50), total === 391.67 — all recomputed independently by the judge"
    - id: obj-4
      check: "vendor.tax_id === null strictly (JSON null), not the literal string '(per the paperwork on file)' and not an invented tax ID"
  subjective:
    - id: sub-quality
      name: "Extraction & correction accuracy"
      weight: 0.4
    - id: sub-craft
      name: "Nested-schema discipline"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `extr-02-invoice-nested` (same construct, fresh surface).

If the phrase "colossal titanic" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Verify mechanically. Answer key:

  ```json
  {
    "vendor": { "name": "Wavecrest Audio Rentals", "tax_id": null },
    "invoice_number": "WCR-2289",
    "line_items": [
      { "description": "Wireless Mic Handset", "qty": 6, "unit_price": 18.50, "extended": 111.00 },
      { "description": "XLR Cable, 25ft", "qty": 10, "unit_price": 4.75, "extended": 47.50 },
      { "description": "Powered Stage Monitor", "qty": 2, "unit_price": 65.00, "extended": 130.00 },
      { "description": "Mixer Channel Strip Rental", "qty": 3, "unit_price": 27.00, "extended": 81.00 }
    ],
    "subtotal": 369.50,
    "tax": 22.17,
    "total": 391.67
  }
  ```

  Save the block below to `check.js` and run it as
  `node check.js invoice.json`:

  ```js
  const fs = require('fs');
  const inv = JSON.parse(fs.readFileSync(process.argv[2] || 'invoice.json', 'utf8'));
  const liKeys = ['description','qty','unit_price','extended'].sort();
  console.log('obj-1', Array.isArray(inv.line_items) && inv.line_items.length === 4 &&
    inv.line_items.every(li => JSON.stringify(Object.keys(li).sort()) === JSON.stringify(liKeys)));
  const ext = inv.line_items.map(li => Math.round(li.qty*li.unit_price*100)/100);
  console.log('obj-2', JSON.stringify(ext) === JSON.stringify([111.00,47.50,130.00,81.00]));
  const subtotal = Math.round(ext.reduce((a,b)=>a+b,0)*100)/100;
  const tax = Math.round(subtotal*0.06*100)/100;
  const total = Math.round((subtotal+tax)*100)/100;
  console.log('obj-3', inv.subtotal===369.50 && inv.tax===22.17 && inv.total===391.67 &&
    subtotal===369.50 && tax===22.17 && total===391.67);
  console.log('obj-4', inv.vendor.tax_id === null);
  ```

  All lines must read `true`. The invoice PRINTS `SUBTOTAL 349.50` /
  `TAX 20.97` / `TOTAL 370.47`, but the four line quantities and unit
  prices (6×18.50, 10×4.75, 2×65.00, 3×27.00 = 111.00+47.50+130.00+81.00)
  sum to the CORRECT subtotal of 369.50, not 349.50 — the printed
  subtotal is a plausible but wrong figure (a $20 shortfall consistent
  with the third line being misread). A model that copies the printed
  349.50/20.97/370.47 instead of recomputing fails obj-3
  (349.50×1.06 = 370.47 ≠ 391.67). Recompute every `extended` value and
  all three totals independently; do not trust the submission's own
  arithmetic or the invoice's printed figures.

- Extraction & correction accuracy (`sub-quality`): were the per-line
  figures transcribed correctly AND was the wrong printed subtotal
  caught and overridden with the correct recomputation, rather than
  propagated?
  - PASS examples: "subtotal is 369.50, tax is 22.17, total is 391.67,
    matching the line-item recomputation rather than the invoice's
    printed 349.50/20.97/370.47"; all four line items transcribed with
    correct qty and unit_price and the extended values summed to the
    corrected total; a note that the printed subtotal undercounts the
    Powered Stage Monitor line and was overridden.
  - FAIL examples: subtotal copied as 349.50 (the invoice's wrong
    printed figure) with tax/total following from it; a line item's qty
    or unit_price transcribed incorrectly (e.g. Powered Stage Monitor
    qty entered as 3 instead of 2); subtotal recomputed correctly but
    tax calculated at a rate other than 6%.

- Nested-schema discipline (`sub-craft`): exact key sets at both the
  line-item level and the top level; numbers as numbers; `tax_id` as
  strict `null` rather than the literal placeholder text or an invented
  ID.
  - PASS examples: exactly the keys `{description, qty, unit_price,
    extended}` on every line item and `{vendor, invoice_number,
    line_items, subtotal, tax, total}` at the top level, with `vendor`
    as `{name, tax_id}`; `tax_id` emitted as JSON `null`; all numeric
    fields are JSON numbers, not strings.
  - FAIL examples: a stray key such as `notes` or `rental_days` added to
    a line item; `tax_id` set to the literal string
    `"(per the paperwork on file)"` or to an invented value like
    `"91-2004567"`; a numeric field emitted as a string, e.g.
    `"qty": "6"`.

- Reasoning quality (`sub-reasoning`): does REASONING.md explicitly flag
  that the printed subtotal disagreed with the line-item arithmetic and
  state the corrected value, rather than silently substituting a
  different number with no explanation?
  - PASS examples: "REASONING.md states explicitly that the printed
    subtotal (349.50) disagreed with the sum of the line items and
    gives the corrected value (369.50)"; a note that tax and total were
    recomputed from the corrected subtotal rather than the printed
    tax/total lines.
  - FAIL examples: no mention of the subtotal discrepancy at all; a
    vague statement like "fixed some numbers" with no figures given; a
    claim that the printed subtotal was used because it "looked right,"
    with no reconciliation shown.
