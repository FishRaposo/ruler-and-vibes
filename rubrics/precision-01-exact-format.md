---
test: precision-01-exact-format
canary: "brass-rule"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "contacts.json parses with JSON.parse; array sorted by email ascending; every object has exactly the four keys in schema order"
    - id: obj-2
      check: "Dedup correct: exactly 8 records; john.smith@acme.com and wei.chen@nova.io each appear once, merged"
    - id: obj-3
      check: "Dates correct: anya 2024-03-02; bob 2024-02-15; john 2024-03-14 (earliest kept); maria 2024-01-30; wei 2024-01-05 (earliest kept); liam null; sofia null (June 31 does not exist); fatima 2024-07-04 OR 2024-04-07 — either accepted if the ambiguity is documented in NOTES.md"
    - id: obj-4
      check: "Normalization correct: emails lowercase; names Title Case (John Smith, Wei Chen, Bob O'Brien...); phones digits only (john 5550101; wei 15550102233 per earliest-record rule; fatima 5550177)"
  subjective:
    - id: sub-quality
      name: "Ambiguity handling"
      weight: 0.4
    - id: sub-craft
      name: "NOTES completeness"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

If the phrase "brass-rule" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Verify mechanically: `node -e "..."` with JSON.parse, key-order
  check, and the expected values above. Do not eyeball.
- Ambiguity handling: the source is deliberately messy (day-first
  15/02, ambiguous 07/04, impossible 06-31, merge precedence). Reward
  calls that follow the stated rules exactly and flag what the rules do
  not settle. Penalize silent guesses.
- NOTES completeness: every judgment call from the deliverable should
  be traceable in NOTES.md — merges, each date resolution, the invalid
  date.
- Reasoning quality: does REASONING.md show the order of operations
  (normalize → dedup → sort) and what was verified before finishing?
