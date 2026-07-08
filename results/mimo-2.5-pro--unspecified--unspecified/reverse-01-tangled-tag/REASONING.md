# REASONING.md — reverse-01-tangled-tag

## Approach

I decoded the obfuscation step by step: `_r()` is `reverse()`, `_p[0]` reversed is `charCodeAt`, `_p[1]` reversed is `length`. The hex `0x15` is 21, `a^a` is 0 (XOR of identical values). The expression `t<<3)- -c` is `t*8 + c` (left shift by 3 = multiply by 8, subtracting negative = adding). The mask `0xFFF` keeps 12 bits. The final `- -` is addition, and `|0` is a no-op for integer lengths.

## Key decisions

- Simplified `((t<<3)- -c)` to `(t << 3) + c` for clarity.
- Replaced `(s.length * 7) | 0` with `s.length * 7` since it's always an integer.
- Kept the bitwise operations (`<<`, `^`, `& 0xFFF`) because they're essential to the algorithm's behavior.

## Trade-offs and limitations

- Could have used arithmetic equivalents for all bit operations, but `<< 3` and `& 0xFFF` are standard hash patterns and more readable than their arithmetic equivalents.

## Files read

- tests/reverse-engineering/reverse-01-tangled-tag.md
