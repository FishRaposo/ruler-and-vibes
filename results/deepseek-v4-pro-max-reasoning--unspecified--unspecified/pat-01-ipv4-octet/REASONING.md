## Approach
Split on dots, checked exactly 4 parts, then validated each part: digits-only, no leading zero unless the digit is "0" itself, numeric range 0-255. Used string-level checks: `part.length > 1 && part[0] === '0'` catches leading zeros, `parseInt` with range check catches numeric bounds. The `split('.')` approach handles the "nothing else" requirement because any surrounding whitespace or trailing dots result in a part that fails validation (empty string check, non-digit check, or wrong count).

## Key decisions
Used `parseInt` rather than `Number` to allow "0" but reject "00" (parseInt("00") = 0 but the leading-zero check catches it first). The empty-string check `part === ''` catches double-dots and trailing dots.

## Trade-offs and limitations
`parseInt` on very large numbers before the range check could be slightly wasteful, but the leading-zero check and digit-only regex run first, so the parseInt only executes on valid-looking parts.

## Files read
- tests/formal-patterns/pat-01-ipv4-octet.md
