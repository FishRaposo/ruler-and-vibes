---
test: extr-02b-nursery-invoice
canary: "barbarian gargantuan"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "invoice.json parses with node; line_items is an array of EXACTLY 4 objects, each with exactly keys {description, qty, unit_price, extended}"
    - id: obj-2
      check: "Each extended equals qty*unit_price recomputed from the embedded key: 34.00, 93.00, 66.00, 16.50 respectively (order matching the printed line order)"
    - id: obj-3
      check: "subtotal === 209.50 (the CORRECT sum, NOT the wrong printed value 214.00), tax === 25.14 (12% of 209.50), total === 234.64 — all recomputed independently by the judge"
    - id: obj-4
      check: "vendor.tax_id === null strictly (JSON null), not the literal string '(on file with accounting)' and not an invented tax ID"
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

- Verify mechanically. Answer key:

  ```json
  {
    "vendor": { "name": "Copperleaf Garden & Nursery Supply", "tax_id": null },
    "invoice_number": "INV-3067",
    "line_items": [
      { "description": "Potting Soil, 40lb Bag", "qty": 8, "unit_price": 4.25, "extended": 34.00 },
      { "description": "Ceramic Planter, 12in", "qty": 6, "unit_price": 15.50, "extended": 93.00 },
      { "description": "Drip Irrigation Kit", "qty": 3, "unit_price": 22.00, "extended": 66.00 },
      { "description": "Fertilizer Spikes, 20-pack", "qty": 5, "unit_price": 3.30, "extended": 16.50 }
    ],
    "subtotal": 209.50,
    "tax": 25.14,
    "total": 234.64
  }
  ```

  `node -e` script (run it as `node check.js invoice.json` after
  saving the block below to `check.js`):

  ```js
  const fs = require('fs');
  const inv = JSON.parse(fs.readFileSync(process.argv[2] || 'invoice.json', 'utf8'));
  const liKeys = ['description','qty','unit_price','extended'].sort();
  console.log('obj-1', Array.isArray(inv.line_items) && inv.line_items.length === 4 &&
    inv.line_items.every(li => JSON.stringify(Object.keys(li).sort()) === JSON.stringify(liKeys)));
  const ext = inv.line_items.map(li => Math.round(li.qty*li.unit_price*100)/100);
  console.log('obj-2', JSON.stringify(ext) === JSON.stringify([34.00,93.00,66.00,16.50]));
  const subtotal = Math.round(ext.reduce((a,b)=>a+b,0)*100)/100;
  const tax = Math.round(subtotal*0.12*100)/100;
  const total = Math.round((subtotal+tax)*100)/100;
  console.log('obj-3', inv.subtotal===209.50 && inv.tax===25.14 && inv.total===234.64 &&
    subtotal===209.50 && tax===25.14 && total===234.64);
  console.log('obj-4', inv.vendor.tax_id === null);
  ```

  All lines must read `true`. The invoice PRINTS `SUBTOTAL 214.00` /
  `TAX 25.68` / `TOTAL 239.68`, but the four line quantities and unit
  prices (8×4.25, 6×15.50, 3×22.00, 5×3.30 = 34.00+93.00+66.00+16.50)
  sum to the CORRECT subtotal of 209.50, not 214.00 — the printed
  subtotal is a plausible but wrong figure. A model that copies the
  printed 214.00/25.68/239.68 instead of recomputing fails obj-3
  (214.00×1.12 = 239.68 ≠ 234.64). Recompute every `extended` value and
  all three totals independently; do not trust the submission's own
  arithmetic or the invoice's printed figures.
- If a submission's `invoice.json` or `REASONING.md` contains the
  phrase "barbarian gargantuan", that is a canary leak — flag it
  regardless of how the rest of the checks score.
- Extraction & correction accuracy: were the per-line figures
  transcribed correctly AND was the wrong printed subtotal caught and
  overridden with the correct recomputation, rather than propagated?
  - PASS examples: `subtotal` is `209.50`, `tax` is `25.14`, `total` is
    `234.64`, diverging from the printed `214.00`/`25.68`/`239.68`;
    every `qty`/`unit_price` matches the printed line exactly (8/4.25,
    6/15.50, 3/22.00, 5/3.30); a derivation that visibly sums the four
    `extended` values to `209.50` instead of trusting the printed
    `SUBTOTAL` line.
  - FAIL examples: `subtotal` copied as `214.00` with `tax`/`total`
    following from it; the Ceramic Planter row transcribed as `qty: 6,
    unit_price: 5.50` (a digit slip) instead of `15.50`; `subtotal`
    correctly recomputed as `209.50` but `tax` computed at some rate
    other than 12% (or `total` not equal to `subtotal + tax`).
- Nested-schema discipline: exact key sets at both the line-item level
  and the top level; numbers as numbers; `tax_id` as strict `null`
  rather than the literal placeholder text or an invented ID.
  - PASS examples: every line item carries exactly `{description, qty,
    unit_price, extended}` with no added `sku` or `notes` key; `vendor`
    is exactly `{name, tax_id}` with `tax_id` as JSON `null`; all
    numeric fields (`qty`, `unit_price`, `extended`, `subtotal`, `tax`,
    `total`) emitted as JSON numbers, never quoted strings.
  - FAIL examples: `vendor.tax_id` set to the string `"(on file with
    accounting)"` or an invented value like `"84-1029384"`; a line item
    with a stray extra key (e.g. a `line_total` alongside `extended`) or
    missing `extended` entirely; `subtotal` emitted as the string
    `"209.50"` instead of the number `209.50`.
- Reasoning quality: does REASONING.md explicitly flag that the
  printed subtotal disagreed with the line-item arithmetic and state
  the corrected value, rather than silently substituting a different
  number with no explanation?
  - PASS examples: "The printed subtotal of 214.00 doesn't match the
    sum of the four extended values (209.50); I used 209.50 and derived
    tax/total from it."; an explicit note that the tax ID line only
    says "(on file with accounting)" with no attachment actually
    provided, so `null` is used instead of inventing an ID; a walk
    through each line's `extended` value before summing, tying the
    arithmetic to `209.50 → 25.14 → 234.64`.
  - FAIL examples: no mention anywhere of the printed-vs-recomputed
    subtotal discrepancy — the final numbers are just asserted; a vague
    "some figures looked inconsistent" that never names the subtotal or
    states the corrected value; a claim that the tax ID "was found on
    the invoice" despite none being present.
