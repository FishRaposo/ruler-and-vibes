# Wrenmarket Stalls — Solution

## Solution Table

| Stall | Vendor | Good     | Banner  |
|-------|--------|----------|---------|
| 1     | Dima   | Maps     | Green   |
| 2     | Ansa   | Candles  | Violet  |
| 3     | Ezel   | Rope     | Amber   |
| 4     | Brix   | Honey    | Blue    |
| 5     | Corvel | Lanterns | Crimson |

## Bonus Answer

**Ezel** (rope seller, stall 3) sits strictly between the candle seller (Ansa, stall 2) and the honey seller (Brix, stall 4).

## Deduction Chain

1. **Clue 1:** Map seller is at stall 1.
2. **Clue 3 + Clue 2:** Ezel sells rope. Ansa is immediately left of the rope seller, so Ansa ≠ Ezel. If rope were at stall 1, Ansa would need stall 0 (impossible). So rope ≠ stall 1.
3. **Clue 2 + Clue 3:** Ansa is immediately left of Ezel (rope seller). The only valid positions: Ansa=2, Ezel=3; Ansa=3, Ezel=4; or Ansa=4, Ezel=5.
4. **Clue 5:** Crimson banner at stall 5.
5. **Clue 10:** Corvel's banner is crimson → Corvel is at stall 5.
6. **Clue 7:** Amber has violet immediately to its left and blue immediately to its right. This requires a three-consecutive pattern: violet, amber, blue. Possible positions: (1,2,3), (2,3,4), or (3,4,5).
7. **Clue 4:** Honey seller flies blue banner. So blue ≠ stall 5 (that's crimson). This eliminates (3,4,5).
8. If (1,2,3): stall 1=violet, stall 2=amber, stall 3=blue. But stall 1 has maps (clue 1), and clue 6 says Dima's banner is green. No room for green. Eliminated.
9. Therefore: (2,3,4) = violet, amber, blue. Stall 2=violet, stall 3=amber, stall 4=blue.
10. **Clue 6:** Dima's banner is green → Dima must be stall 1 (the only stall without a banner assigned yet).
11. **Clue 11:** Dima (stall 1) is left of Ansa → Ansa is at stall 2, 3, 4, or 5. From step 3, Ansa is at 2, 3, or 4. Stall 4 has blue banner; Ansa is at stall 2 (violet banner).
12. **From step 3:** Ansa=2 → Ezel (rope) = stall 3.
13. Remaining vendor: Brix → stall 4.
14. **Clue 8:** Brix (stall 4) is to the right of violet-banner stall (stall 2). ✓
15. **Clue 4:** Honey seller flies blue (stall 4) → Brix sells honey.
16. **Clue 9:** Lantern seller is adjacent to honey seller (stall 4). Adjacent stalls: 3 and 5. Stall 3 sells rope → lanterns at stall 5 (Corvel).
17. Remaining good: candles → stall 2 (Ansa).
