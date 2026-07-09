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
anchors:
  - id: Ambiguity handling
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: NOTES completeness
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

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
  - PASS: NOTES.md states which reading of fatima's 07/04 was chosen
    (July 4 or April 7) and names the rejected alternative.
  - PASS: NOTES.md explains that June 31 is not a real date, so sofia's
    date was set to null rather than guessed at a nearby day.
  - PASS: NOTES.md states which source record's date/phone won for each
    merged pair (john.smith, wei.chen) and cites the earliest-record
    rule.
  - FAIL: fatima's date is picked with no note explaining which reading
    was used or that the other reading was rejected.
  - FAIL: sofia's impossible June 31 date is silently coerced to a
    nearby valid date instead of left null.
  - FAIL: a merge's winning fields are asserted with no statement of
    which source record they came from or why.
- NOTES completeness: every judgment call from the deliverable should
  be traceable in NOTES.md — merges, each date resolution, the invalid
  date.
  - PASS: NOTES.md lists both merges, every date resolution (including
    bob's day-first 15/02), and the invalid sofia date, each with a
    one-line reason.
  - PASS: NOTES.md is terse but complete — no required judgment call is
    left undocumented.
  - FAIL: NOTES.md omits one of the two merges or one of the date
    resolutions.
  - FAIL: NOTES.md is missing entirely despite the deliverable making
    judgment calls that need it.
  - FAIL: NOTES.md restates a final value without explaining the
    reasoning (e.g. "sofia: null" with no mention of June 31 being
    invalid).
- Reasoning quality: does REASONING.md show the order of operations
  (normalize → dedup → sort) and what was verified before finishing?
  - PASS: REASONING.md walks through normalize → dedup → sort in that
    order and names a check performed before finishing (e.g. recounting
    records after dedup).
  - PASS: REASONING.md shows the earliest-record rule applied
    consistently to both merged pairs, not just one.
  - FAIL: REASONING.md only asserts the output is correct with no
    description of the steps taken.
  - FAIL: REASONING.md describes steps in an order (e.g. sort before
    dedup) that would not produce the delivered output.
