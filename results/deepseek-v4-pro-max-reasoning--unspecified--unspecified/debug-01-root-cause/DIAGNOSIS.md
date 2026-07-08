### Bug 1: discount applied to full total instead of portion above 200

- **Symptom**: orders above $200 get 10% off the entire total, not just the portion above $200.
- **Root cause**: `total = total * 0.9;` applies 10% discount to the whole subtotal. The spec says "10% off ONLY the portion of the subtotal above 200."
- **Minimal fix**: save `preDiscount` before discounting, compute `total = preDiscount - (preDiscount - 200) * 0.1` when `preDiscount > 200`. Changed to `total = total - (total - 200) * 0.1` after saving pre-discount subtotal.

### Bug 2: shipping uses post-discount total instead of pre-discount

- **Symptom**: the shipping check `if (total > 100)` runs after the discount, so a $300 order discounted to $270 wrongly gets free shipping (it's above 100) — but really the shipping threshold should apply to the pre-discount subtotal. Conversely, a $90 order with no discount correctly gets charged $12 shipping, but the check should use pre-discount subtotal.
- **Root cause**: `if (total > 100)` uses `total` after discount may have been applied, but the spec says shipping is free "when the PRE-DISCOUNT subtotal is 100 or more." Also uses `>` instead of `>=`.
- **Minimal fix**: use saved `preDiscount` variable and change `>` to `>=`.

### Bug 3: gift wrap loop off-by-one, iterates past array bounds

- **Symptom**: the loop `for (var j = 0; j <= order.items.length; j++)` accesses `order.items[order.items.length]` which is undefined, causing the wrap check to silently fail (or crash) depending on the JS engine and input.
- **Root cause**: the loop condition is `j <= order.items.length` instead of `j < order.items.length`.
- **Minimal fix**: changed `<=` to `<`.
