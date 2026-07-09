---
test: context-06-depth-sweep
canary: "wallaby grotto"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "PROBE.md contains exactly 10 lines matching '^D([1-9]|10):' for D1..D10 in strictly increasing order with no other non-blank content — judge parses with node"
    - id: obj-2
      check: "At least 9 of the 10 answers match the answer key verbatim after whitespace trimming (case-sensitive) — judge counts matches with node"
    - id: obj-3
      check: "Both middle-depth answers (D5 and D6, the ~50% needles) match the key exactly — dedicated lost-in-middle gate, ANDed separately from the 9/10 count"
    - id: obj-4
      check: "The two distractor-adjacent answers (D3 and D8) equal the correct needle value and NOT the numerically-close decoy seeded on a different day — judge confirms each equals the keyed value and differs from the recorded decoy"
    - id: obj-5
      check: "Each answer line after the 'Dn:' prefix is a single value token with no extra prose, explanation, or second candidate — judge checks each line with node (splits on ':' and rejects lines whose value field contains additional sentence text or a second number)"
  subjective:
    - id: sub-quality
      name: "Positional recall fidelity"
      weight: 0.4
    - id: sub-craft
      name: "Answer format discipline"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Positional recall fidelity
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Answer format discipline
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "wallaby grotto" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Answer key (verified against the shipped logbook; word offsets are
approximate depth markers, not part of the expected answer)

| # | Value | Depth (word offset / ~6,290 total) | Notes |
|---|---|---|---|
| D1 | WP-114C | ~1.2% (near start) | Day 1 departure waypoint |
| D2 | 318 ration packs | ~2.8% (near start) | Day 1 provisions count |
| D3 | 156 liters | ~27.2% (~25%) | Day 5 generator fuel reading; decoy "158 liters" is a Day 6 re-check of the same generator, explicitly framed as gauge noise, not a refuel |
| D4 | Petra Lindqvist | ~38.9% (~25%) | comms officer, distinct from radio operator Bassim Farhan |
| D5 | TR-88214-B | ~54.5% (~50%, lost-in-middle) | Day 9 recovered-equipment serial |
| D6 | the 9th of Aurelmonth | ~53.5% (~50%, lost-in-middle) | Day 9 date, expedition's in-story calendar |
| D7 | 52-J07-S | ~82.7% (~75%) | Day 12 three-quarter-point waypoint |
| D8 | 41.6 km | ~84.3% (~75%) | Day 12 measured distance from the Day 3 ridge; decoy "41.2 km" is a Day 13 distance from a *different* reference point (an old survey cairn), explicitly noted as measuring something else |
| D9 | GEN-4471X | ~95.6% (near end) | Day 15 generator asset tag logged out of service |
| D10 | 27 core samples | ~98.1% (near end) | Day 15 final sample tally |

Every needle value appears exactly once in the shipped logbook, except
the two decoy pairs: D3 has one additional near-value ("158 liters",
Day 6) and D8 has one additional near-value ("41.2 km", Day 13), both
explicitly narrated as measuring something distinct from the queried
value (gauge noise on a different day; a different point-to-point
distance), so a careful reader can distinguish them from the correct
answer using the surrounding text.

### Objective check notes

- **obj-1**: parse `PROBE.md` with node: exactly 10 lines matching
  `/^D(10|[1-9]):\s*/`, D1 through D10 strictly in order, nothing else
  in the file.
- **obj-2**: trim whitespace, compare case-sensitively against the key
  above; 9 or 10 matches passes.
- **obj-3**: D5 and D6 must BOTH be correct — this is the dedicated
  lost-in-middle gate. A submission that gets 9/10 overall but misses
  either D5 or D6 fails this check even though it might pass obj-2.
- **obj-4**: D3 must equal "156 liters" (not "158 liters"); D8 must
  equal "41.6 km" (not "41.2 km"). Getting the decoy value instead of
  the keyed value on either indicates the model grabbed the wrong
  day's nearby figure.
- **obj-5**: for each line, split on the first `:` and confirm the
  value field contains no additional sentence-like content (no verb
  phrases, no second number that isn't part of the same token, e.g. a
  parenthetical alternative). A line like "D3: 156 liters (or maybe
  158)" fails this check even if 156 is mentioned.

### Subjective guidance

- **Positional recall fidelity**: does the submission get the
  lost-in-middle needles (D5, D6) right along with the start/end ones,
  or does accuracy visibly sag in the middle of the document — the
  specific failure mode this test isolates?
- **Answer format discipline**: are all 10 answers formatted
  consistently as bare values (with quoting only where the value
  itself contains a space, per the task's instruction), without
  inconsistent decoration (e.g., adding units to some numeric answers
  but not others)?
- **Reasoning quality**: does `REASONING.md` show evidence of a
  systematic full read (e.g., referencing which day each needle came
  from) rather than a keyword-search-only approach that might miss
  context distinguishing a decoy from the correct value?
