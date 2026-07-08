# pat-01-ipv4-octet — mimo-2.5-pro--unspecified--unspecified

**Judged by:** grok-4.5 on 2026-07-08

## Integrity
Clean. Manifest lists only `tests/formal-patterns/pat-01-ipv4-octet.md`. No canary "badger mongoose".

## Objective checks
- obj-1 (`node validator.js` 25 lines MATCH/REJECT): PASS — 25 lines, correct order and format
- obj-2 (10 MUST-MATCH): PASS — all 10 return true via require().validate
- obj-3 (15 MUST-REJECT incl. range/leading-zero): PASS — all 15 false including 256, 01, 00
- obj-4 (whitespace/shape traps): PASS — trailing space, leading space, trailing dot, 3/5 octets, empty, junk, negative all reject
- obj-5 (export, single file, no throw): PASS — `module.exports = { validate }`, no deps, no throw on corpus

## Subjective criteria
- sub-quality (Specification fidelity): 10/10 — enforces both 0–255 via parseInt and leading-zero via `seg.length > 1 && seg[0] === '0'`; bare `0` accepted
- sub-craft (Validator clarity): 9/10 — transparent split-and-check loop; character-by-character digit scan instead of opaque regex
- sub-reasoning (Reasoning quality): 9/10 — correctly notes parseInt would accept "1a" and why iterative range check beats a pure regex

## Verdict
Flawless corpus pass with a clear split-and-check validator that handles range and leading zeros as distinct rules. Reasoning names the parseInt trailing-junk trap specifically.
