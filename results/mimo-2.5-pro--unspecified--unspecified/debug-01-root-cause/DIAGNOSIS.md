# Diagnosis

## Bug 1: Volume discount applies to entire subtotal, not just the portion above 200

**Symptom:** For subtotals above $200, the 10% discount is applied to the entire amount instead of only the excess.

**Root cause:** `total = total * 0.9` discounts 10% of the full subtotal. The intended behavior is 10% off only the portion above 200.

**Fix:** Changed to `total = total - (total - 200) * 0.1`, which subtracts 10% of only the amount exceeding $200. This is the minimal arithmetic change that corrects the discount.

## Bug 2: Shipping uses post-discount total instead of pre-discount subtotal

**Symptom:** The free-shipping threshold check (`if (total > 100)`) uses the post-discount value. An order with pre-discount subtotal of $210 (gets discounted to $209) still passes, but an order of $110 that somehow got discounted below $100 would incorrectly be charged shipping.

**Root cause:** The variable `total` is mutated by the discount step before the shipping check runs.

**Fix:** Added `var subtotal = total;` before the discount, then changed the shipping condition to `if (subtotal >= 100)`. This captures the pre-discount value with minimal structural change. Also changed `>` to `>=` since the spec says "100 or more."

## Bug 3: Off-by-one in wrap loop causes out-of-bounds access

**Symptom:** The loop `for (var j = 0; j <= order.items.length; j++)` iterates one past the last index, causing `order.items[j]` to be `undefined` and throwing a TypeError when accessing `.wrap`.

**Root cause:** `j <= order.items.length` should be `j < order.items.length`. Arrays are zero-indexed, so the last valid index is `length - 1`.

**Fix:** Changed `<=` to `<`. This is a single-character fix that eliminates the out-of-bounds access.
