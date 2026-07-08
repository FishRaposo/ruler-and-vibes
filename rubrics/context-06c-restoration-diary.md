---
test: context-06c-restoration-diary
canary: "tarantella aye"
reviewed: "pass 2026-07-04 (independent gate)"
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
---

## Judge guidance

Parallel form of `context-06-depth-sweep` (same construct, fresh surface).

If the phrase "tarantella aye" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Answer key (verified against the shipped diary; word offsets are
approximate depth markers, not part of the expected answer)

| # | Value | Depth (word offset / ~6,580 total) | Notes |
|---|---|---|---|
| D1 | JR-207M | ~1.7% (near start) | Shop Day 1 works order |
| D2 | 246 boiler tubes | ~3.9% (near start) | Shop Day 1 tube delivery count |
| D3 | 173 liters | ~28.4% (~25%) | Shop Day 5 parts-washing rig reservoir reading; decoy "171 liters" is a Day 6 re-check of the same rig, explicitly framed as gauge noise, not a top-off |
| D4 | Sigrun Solveig | ~40.2% (~25%) | documentation officer, distinct from records keeper / photographer Emeric Coleridge |
| D5 | BX-53709-K | ~56.0% (~50%, lost-in-middle) | Shop Day 9 recovered-component stamped serial |
| D6 | the 12th of Foundrturn | ~55.0% (~50%, lost-in-middle) | Shop Day 9 date, shop's in-story calendar |
| D7 | MK-3-C08 | ~83.7% (~75%) | Shop Day 12 three-quarter-point milestone |
| D8 | 38.4 mm | ~85.1% (~75%) | Shop Day 12 boiler-saddle-to-frame-stretcher clearance; decoy "38.9 mm" is a Day 13 clearance at a *different* reference point (running-plate bracket to splasher edge), explicitly noted as measuring something else |
| D9 | COMP-6620Q | ~94.1% (near end) | Shop Day 14 parts-washing rig asset tag logged out of service |
| D10 | 31 castings | ~97.9% (near end) | Shop Day 15 final casting tally |

Every needle value appears exactly once in the shipped diary, except the
two decoy pairs: D3 has one additional near-value ("171 liters", Day 6)
and D8 has one additional near-value ("38.9 mm", Day 13), both explicitly
narrated as measuring something distinct from the queried value (gauge
noise on a different day; a clearance at a different reference point), so
a careful reader can distinguish them from the correct answer using the
surrounding text.

### Objective check notes

- **obj-1**: parse `PROBE.md` with node: exactly 10 lines matching
  `/^D(10|[1-9]):\s*/`, D1 through D10 strictly in order, nothing else in
  the file.
  - PASS: file body is exactly `D1: JR-207M` … `D10: 31 castings`, in
    order, no blank-line-separated extra prose.
  - PASS: `D10:` present as the tenth line and no `D11:` or stray heading
    follows it.
  - PASS: lines carry a single leading `Dn:` token each with only the
    value after the colon.
  - FAIL: file opens with a preamble line like "Here are the answers:"
    before `D1:`.
  - FAIL: a duplicated or out-of-order line (e.g. `D3:` appears before
    `D2:`, or `D5:` appears twice).
  - FAIL: an extra trailing note such as "All answers verified above."
    after `D10:`.
- **obj-2**: trim whitespace, compare case-sensitively against the key
  above; 9 or 10 matches passes.
  - PASS: all ten values equal the key verbatim after trimming.
  - PASS: nine values match and exactly one is wrong (e.g. a mis-copied
    D7 milestone code) — still ≥9/10.
  - PASS: `D2: 246 boiler tubes` matches the keyed value token for token.
  - FAIL: two or more values diverge from the key (e.g. both D5 and D9
    wrong).
  - FAIL: `D1: JR207M` (missing the hyphen) counted as a non-match,
    dropping the tally below 9 when combined with any other miss.
  - FAIL: case-altered value like `D9: comp-6620q` treated as a non-match
    under case-sensitive comparison.
- **obj-3**: D5 and D6 must BOTH be correct — this is the dedicated
  lost-in-middle gate. A submission that gets 9/10 overall but misses
  either D5 or D6 fails this check even though it might pass obj-2.
  - PASS: `D5: BX-53709-K` and `D6: the 12th of Foundrturn` both exactly
    match.
  - PASS: both mid-depth needles correct even though a near-end answer
    (say D9) is wrong.
  - PASS: D6 given as the full keyed phrase "the 12th of Foundrturn"
    rather than a bare "12th".
  - FAIL: D5 correct but D6 given as a real-world month (e.g. "the 12th
    of March"), ignoring the in-story calendar.
  - FAIL: D6 correct but D5 serial mis-transcribed as "BX-53079-K".
  - FAIL: both mid-depth needles blank or hedged while start/end needles
    are correct — the signature lost-in-middle failure.
- **obj-4**: D3 must equal "173 liters" (not "171 liters"); D8 must equal
  "38.4 mm" (not "38.9 mm"). Getting the decoy value instead of the keyed
  value on either indicates the model grabbed the wrong day's nearby
  figure.
  - PASS: `D3: 173 liters` and `D8: 38.4 mm`, each the Day 5 / Day 12
    value.
  - PASS: D3 correct even though the Day 6 "171 liters" re-check appears
    nearby in the diary.
  - PASS: D8 correct and clearly not the Day 13 "38.9 mm" different-point
    clearance.
  - FAIL: `D3: 171 liters` — grabbed the Day 6 gauge-noise re-check.
  - FAIL: `D8: 38.9 mm` — grabbed the Day 13 clearance at a different
    reference point.
  - FAIL: D3 or D8 given as a range or pair (e.g. "173/171 liters")
    rather than the single correct value.
- **obj-5**: for each line, split on the first `:` and confirm the value
  field contains no additional sentence-like content (no verb phrases, no
  second number that isn't part of the same token, e.g. a parenthetical
  alternative). A line like "D3: 173 liters (or maybe 171)" fails this
  check even if 173 is mentioned.
  - PASS: `D8: 38.4 mm` — bare value token, unit included exactly as
    keyed.
  - PASS: `D4: Sigrun Solveig` — a two-word name is a single value token,
    no trailing clause.
  - PASS: `D1: JR-207M` — no explanation such as "(the works order)".
  - FAIL: `D5: BX-53709-K (found in the smokebox on Day 9)` — trailing
    explanatory clause.
  - FAIL: `D3: 173 liters, though the Day 6 re-check read 171` — second
    number plus sentence text.
  - FAIL: `D7: the milestone was MK-3-C08` — verb phrase in the value
    field.

### Subjective guidance

- **Positional recall fidelity**: does the submission get the
  lost-in-middle needles (D5, D6) right along with the start/end ones, or
  does accuracy visibly sag in the middle of the document — the specific
  failure mode this test isolates?
- **Answer format discipline**: are all 10 answers formatted consistently
  as bare values (with quoting only where the value itself contains a
  space, per the task's instruction), without inconsistent decoration
  (e.g., adding units to some numeric answers but not others)?
- **Reasoning quality**: does `REASONING.md` show evidence of a
  systematic full read (e.g., referencing which shop day each needle came
  from) rather than a keyword-search-only approach that might miss
  context distinguishing a decoy from the correct value?
