---
test: extr-02-invoice-nested
canary: "peony aster"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "invoice.json parses with node; line_items is an array of EXACTLY 4 objects, each with exactly keys {description, qty, unit_price, extended}"
    - id: obj-2
      check: "Each extended equals qty*unit_price recomputed from the embedded key: 30.00, 50.00, 90.00, 10.50 respectively (order matching the printed line order)"
    - id: obj-3
      check: "subtotal === 180.50 (the CORRECT sum, NOT the wrong printed value 185.00), tax === 18.05 (10% of 180.50), total === 198.55 — all recomputed independently by the judge"
    - id: obj-4
      check: "vendor.tax_id === null strictly (JSON null), not the literal string '(see attached)' and not an invented tax ID"
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

If the phrase "peony aster" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Verify mechanically. Answer key:

  ```json
  {
    "vendor": { "name": "Kestrel Office Supply", "tax_id": null },
    "invoice_number": "INV-8842",
    "line_items": [
      { "description": "Copy Paper, A4, 10-ream case", "qty": 10, "unit_price": 3.00, "extended": 30.00 },
      { "description": "Toner Cartridge, Black HY", "qty": 4, "unit_price": 12.50, "extended": 50.00 },
      { "description": "Standing Desk Riser", "qty": 2, "unit_price": 45.00, "extended": 90.00 },
      { "description": "USB-C Cable 2m", "qty": 6, "unit_price": 1.75, "extended": 10.50 }
    ],
    "subtotal": 180.50,
    "tax": 18.05,
    "total": 198.55
  }
  ```

  `node -e` script:

  ```js
  const fs = require('fs');
  const inv = JSON.parse(fs.readFileSync('invoice.json', 'utf8'));
  const liKeys = ['description','qty','unit_price','extended'].sort();
  console.log('obj-1', Array.isArray(inv.line_items) && inv.line_items.length === 4 &&
    inv.line_items.every(li => JSON.stringify(Object.keys(li).sort()) === JSON.stringify(liKeys)));
  const ext = inv.line_items.map(li => Math.round(li.qty*li.unit_price*100)/100);
  console.log('obj-2', JSON.stringify(ext) === JSON.stringify([30.00,50.00,90.00,10.50]));
  const subtotal = Math.round(ext.reduce((a,b)=>a+b,0)*100)/100;
  const tax = Math.round(subtotal*0.10*100)/100;
  const total = Math.round((subtotal+tax)*100)/100;
  console.log('obj-3', inv.subtotal===180.50 && inv.tax===18.05 && inv.total===198.55 &&
    subtotal===180.50 && tax===18.05 && total===198.55);
  console.log('obj-4', inv.vendor.tax_id === null);
  ```

  All lines must read `true`. The invoice PRINTS `SUBTOTAL 185.00` /
  `TAX 18.50` / `TOTAL 203.50`, but the four line quantities and unit
  prices (10×3.00, 4×12.50, 2×45.00, 6×1.75 = 30.00+50.00+90.00+10.50)
  sum to the CORRECT subtotal of 180.50, not 185.00 — the printed
  subtotal is a plausible but wrong transposition. A model that copies
  the printed 185.00/18.50/203.50 instead of recomputing fails obj-3
  (185.00×1.10 = 203.50 ≠ 198.55). Recompute every `extended` value and
  all three totals independently; do not trust the submission's own
  arithmetic or the invoice's printed figures.
- Extraction & correction accuracy: were the per-line figures
  transcribed correctly AND was the wrong printed subtotal caught and
  overridden with the correct recomputation, rather than propagated?
  - PASS examples: `subtotal` is `180.50`, `tax` is `18.05`, `total` is
    `198.55`, diverging from the printed `185.00`/`18.50`/`203.50`;
    every `qty`/`unit_price` matches the printed line exactly (10/3.00,
    4/12.50, 2/45.00, 6/1.75); a derivation that visibly sums the four
    `extended` values to `180.50` instead of trusting the printed
    `SUBTOTAL` line.
  - FAIL examples: `subtotal` copied as `185.00` with `tax`/`total`
    following from it; the Toner Cartridge row transcribed as `qty: 4,
    unit_price: 15.50` (a digit slip) instead of `12.50`; `subtotal`
    correctly recomputed as `180.50` but `tax` computed at some rate
    other than 10% (or `total` not equal to `subtotal + tax`).
- Nested-schema discipline: exact key sets at both the line-item level
  and the top level; numbers as numbers; `tax_id` as strict `null`
  rather than the literal placeholder text or an invented ID.
  - PASS examples: every line item carries exactly `{description, qty,
    unit_price, extended}` with no added `sku` or `notes` key; `vendor`
    is exactly `{name, tax_id}` with `tax_id` as JSON `null`; all
    numeric fields (`qty`, `unit_price`, `extended`, `subtotal`, `tax`,
    `total`) emitted as JSON numbers, never quoted strings.
  - FAIL examples: `vendor.tax_id` set to the string `"(see attached)"`
    or an invented value like `"47-2093841"`; a line item with a stray
    extra key (e.g. a `line_total` alongside `extended`) or missing
    `extended` entirely; `subtotal` emitted as the string `"180.50"`
    instead of the number `180.50`.
- Reasoning quality: does REASONING.md explicitly flag that the
  printed subtotal disagreed with the line-item arithmetic and state
  the corrected value, rather than silently substituting a different
  number with no explanation?
  - PASS examples: "The printed subtotal of 185.00 doesn't match the
    sum of the four extended values (180.50); I used 180.50 and derived
    tax/total from it."; an explicit note that the tax ID line only
    says "(see attached)" with no attachment actually provided, so
    `null` is used instead of inventing an ID; a walk through each
    line's `extended` value before summing, tying the arithmetic to
    `180.50 → 18.05 → 198.55`.
  - FAIL examples: no mention anywhere of the printed-vs-recomputed
    subtotal discrepancy — the final numbers are just asserted; a vague
    "some figures looked inconsistent" that never names the subtotal or
    states the corrected value; a claim that the tax ID "was found on
    the invoice" despite none being present.
