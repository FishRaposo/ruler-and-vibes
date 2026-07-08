# precision-01-exact-format — deepseek-v4-pro-max-reasoning--unspecified--unspecified

**Judged by:** grok-4.5 on 2026-07-08

## Integrity
Clean. No REASONING.md present (expected per judge instructions for this run). No canary "brass-rule" in contacts.json or NOTES.md. Cannot verify Files-read manifest (missing REASONING.md) — scored as missing reasoning, not HARD integrity.

## Objective checks
- obj-1 (JSON.parse; sorted by email; exactly four keys in schema order): PASS — 8 objects, email-sorted, keys email/name/phone/joined in order for every record.
- obj-2 (Dedup correct: exactly 8 records; john and wei each once, merged): PASS — john.smith@acme.com and wei.chen@nova.io appear once each.
- obj-3 (Dates correct per answer key): PASS — anya 2024-03-02, bob 2024-02-15, john 2024-03-14, maria 2024-01-30, wei 2024-01-05, liam null, sofia null, fatima 2024-07-04 with ambiguity noted in NOTES.
- obj-4 (Normalization correct): PASS — lowercase emails; Title Case names including Bob O'Brien / Fatima Al-Sayed; phones 5550101, 15550102233, 5550177.

## Subjective criteria
- sub-quality (Ambiguity handling): 9/10 — Fatima 07/04 documented as M/D/Y → July 4; sofia June 31 → null (not coerced); bob 15/02 inferred D/M/Y from Ireland context; both merges cite earliest joined and preferred phone/date sources.
- sub-craft (NOTES completeness): 9/10 — Merges, every date resolution, invalid June 31, and phone digit stripping all listed with one-line reasons.
- sub-reasoning (Reasoning quality): 0/10 — REASONING.md missing entirely (special instruction).

## Verdict
Near-perfect mechanical normalization and thorough NOTES for judgment calls. Only failure is the absent REASONING.md, which zeros sub-reasoning by protocol.
