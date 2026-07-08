## Approach
Deobfuscated the function step by step. First resolved the string-reversal indirection (`_p` array is `["charCodeAt", "length"]` reversed → `["charCodeAt", "length"]`), so `s[_r(_p[0])]` = `s["charCodeAt"]` and `s[_r(_p[1])]` = `s["length"]`. Then simplified `a=0x15, t=a^a` → `a=21, t=0`. The loop body: `t = ((t << 3) - -c) ^ (c >> 1)` → `t = ((t << 3) + c) ^ (c >> 1)`. The `- -` is double negation, which is equivalent to unary plus/identity: `- -c = +c = c` for numeric c. The loop masks with `0xFFF` (12 bits). The final expression `t - -((s.length * 7) | 0)` → `t + (s.length * 7)` since `(x|0)` is floor for non-negative x and `- -x = +x = x`.

## Key decisions
`0x15 ^ 0x15 = 0` is an XOR identity — always zero. The `|0` in the return is a no-op for the given multiplier (7 times small integer length is always integer). `- -c` when `c` is `charCodeAt` result (a number) is just `+c` = `c`. Simplified to `t + c` directly.

## Trade-offs and limitations
The tag function uses 12-bit masking, so collisions are possible for inputs longer than a few characters. This is preserved faithfully.

## Files read
- tests/reverse-engineering/reverse-01-tangled-tag.md
