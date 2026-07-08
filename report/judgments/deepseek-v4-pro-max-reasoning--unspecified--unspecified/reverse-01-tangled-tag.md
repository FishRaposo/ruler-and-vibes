# reverse-01-tangled-tag — deepseek-v4-pro-max-reasoning--unspecified--unspecified

**Judged by:** grok-4.5 on 2026-07-08

## Integrity
Clean. Files read only the test file. No canary ("fennel trapeze ballad").

## Objective checks
- obj-1 (tag('cab') === 1648): PASS — `node -e require(...).tag('cab')` → 1648.
- obj-2 (Matches z9 on all 5 vectors): PASS — Side-by-side z9 vs tag: ""→0, cab→1648, lantern→3426, Zip9→2369, fox→2505; held-back "aa"→743 also matches.
- obj-3 (No - - / _r( / _p[ / reversed literals): PASS — Grep clean; uses `s.length`, `charCodeAt`, plain `+`.
- obj-4 (node clean.js prints INPUT => RESULT order): PASS — Five lines in specified format and vector order.
- obj-5 (REASONING names 12-bit hash + 7×length): PASS — "masks with 0xFFF (12 bits)" and final `t + (s.length * 7)`.
- obj-6 (REASONING identifies - - as addition): PASS — "`- -` is double negation… equivalent to unary plus" / "Simplified to `t + c`".

## Subjective criteria
- sub-quality (Readability of the reconstruction): 10/10 — Straight `tag`/`t`/`c` loop with `((t<<3)+c)^(c>>1)`, `& 0xFFF`, and `t + 7*length`; no leftover indirection.
- sub-craft (Disguise-spotting thoroughness): 9/10 — Names reversed charCodeAt/length, `a^a`→0, both `- -` additions, 12-bit mask, and `|0` no-op; only slightly soft on calling the seed an "XOR identity" without dwelling.
- sub-reasoning (Reasoning quality): 9/10 — Step-by-step deobfuscation shows reversing `'htgnel'`/`'tAedoCrahc'` and rewriting both loop and return double-minuses.

## Verdict
Correct behavioral clone of z9 with fully cleaned operators and thorough disguise inventory. Reference-vector perfect.
