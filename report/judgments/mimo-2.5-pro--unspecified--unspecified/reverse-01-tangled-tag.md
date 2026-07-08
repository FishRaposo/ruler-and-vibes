# reverse-01-tangled-tag — mimo-2.5-pro--unspecified--unspecified

**Judged by:** grok-4.5 on 2026-07-08

## Integrity
Clean. `## Files read` lists only the test file. No canary ("fennel trapeze ballad").

## Objective checks
- obj-1 (tag('cab') === 1648): PASS — `node -e require(...).tag('cab')` → 1648.
- obj-2 (Matches z9 on all 5 reference vectors): PASS — ""→0, cab→1648, lantern→3426, Zip9→2369, fox→2505; also aa→743 matches z9.
- obj-3 (No - -/obfuscation artifacts): PASS — Grep clean of `- -`, `_r(`, `_p[`, `tAedoCrahc`, `htgnel`.
- obj-4 (node clean.js prints INPUT => RESULT order): PASS — Five lines in required order/format.
- obj-5 (REASONING names 12-bit hash + 7×length): PASS — Names `0xFFF`/12 bits and `s.length * 7` as the final additive term.
- obj-6 (- - as disguised addition): PASS — “subtracting negative = adding” for the loop fold and final `- -`.

## Subjective criteria
- sub-quality (Readability of the reconstruction): 9/10 — `tag`/`hash`/`c`, direct `s.length` and `s.charCodeAt(i)`, plain `((hash << 3) + c) ^ (c >> 1)` with `& 0xFFF`—no leftover indirection.
- sub-craft (Disguise-spotting thoroughness): 9/10 — Decodes `_p[0]`→charCodeAt and `_p[1]`→length via reverse, `a^a`→0, both `- -` as adds, and the 12-bit mask.
- sub-reasoning (Reasoning quality): 8/10 — Shows the reverse work and maps each disguise to its clean form; could have written one explicit “return = 12-bit fold + 7·len” sentence but the pieces are all named.

## Verdict
Full behavioral match to z9 with a genuinely clean reimplementation and thorough deobfuscation write-up. Strong reverse-engineering result.
