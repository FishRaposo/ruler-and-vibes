---
test: context-06b-film-shoot-diary
canary: "bourree bushbaby"
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
      check: "Each answer line after the 'Dn:' prefix is a single value token with no extra prose, explanation, or second candidate — judge checks each line with node (splits on ':' and rejects lines whose value field contains additional sentence text or a second standalone number)"
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

If the phrase "bourree bushbaby" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### Answer key (verified against the shipped diary; word offsets are
approximate depth markers, not part of the expected answer)

| # | Value | Depth (word offset / ~6,460 total) | Notes |
|---|---|---|---|
| D1 | SL-207A | ~1.3% (near start) | Day 1 opening-slate code |
| D2 | 246 wardrobe pieces | ~3.0% (near start) | Day 1 wardrobe baseline count |
| D3 | 84 amp-hours | ~27.5% (~25%) | Day 5 battery-cart charge reading; decoy "85 amp-hours" is a Day 6 re-check of the same cart, explicitly framed as meter drift, not a recharge |
| D4 | Solveig Hartmann | ~39.3% (~25%) | first assistant director, distinct from second AD Corwin Ellery |
| D5 | LN-53109-C | ~55.1% (~50%, lost-in-middle) | Day 9 recovered-lens serial |
| D6 | the 14th of Hearthfall | ~53.8% (~50%, lost-in-middle) | Day 9 date, production's in-story calendar |
| D7 | 63-K12-N | ~82.5% (~75%) | Day 12 three-quarter-point company-move checkpoint |
| D8 | 37.9 km | ~84.0% (~75%) | Day 12 measured distance from the Day 3 kitchen garden; decoy "37.5 km" is a Day 13 distance from a *different* reference point (an old estate gatehouse), explicitly noted as measuring something else |
| D9 | CAM-6802Y | ~92.2% (near end) | Day 14 A-camera body asset tag logged out of active service |
| D10 | 34 completed setups | ~98.2% (near end) | Day 15 final setup tally |

Every needle value appears exactly once in the shipped diary, except the
two decoy pairs: D3 has one additional near-value ("85 amp-hours", Day 6)
and D8 has one additional near-value ("37.5 km", Day 13), both explicitly
narrated as measuring something distinct from the queried value (meter
drift on a different day; a different point-to-point distance), so a
careful reader can distinguish them from the correct answer using the
surrounding text.

### Objective check notes

- **obj-1**: parse `PROBE.md` with node: exactly 10 lines matching
  `/^D(10|[1-9]):\s*/`, D1 through D10 strictly in order, nothing else in
  the file.
  - PASS: "D1: SL-207A" … "D10: 34 completed setups" as ten lines, in
    order, and no trailing prose or preamble; ten lines with only blank
    lines otherwise between them; the labels ascend D1→D10 with none
    skipped or repeated.
  - FAIL: an 11th commentary line such as "All answers verified against
    the diary."; the block opening "D2:" before "D1:" (out of order); a
    duplicated "D5:" line or a missing "D7:" line.
- **obj-2**: trim whitespace, compare case-sensitively against the key
  above; 9 or 10 matches passes.
  - PASS: all ten values equal to the key; exactly one value wrong (e.g.
    D9 mis-transcribed) with the other nine exact; correct values with
    only leading/trailing whitespace differences.
  - FAIL: two or more values diverging from the key (e.g. both D5 and D10
    wrong); "camera 6802Y" for D9 instead of "CAM-6802Y"; lowercased
    "sl-207a" for D1 under case-sensitive comparison.
- **obj-3**: D5 and D6 must BOTH be correct — this is the dedicated
  lost-in-middle gate. A submission that gets 9/10 overall but misses
  either D5 or D6 fails this check even though it might pass obj-2.
  - PASS: D5 = "LN-53109-C" and D6 = "the 14th of Hearthfall"; both middle
    needles exact even if one near-end value is the single allowed miss;
    D6 given as "the 14th of Hearthfall" verbatim from the calendar line.
  - FAIL: D5 = "LN-53109-B" (wrong suffix on the middle needle); D6 = "the
    13th of Hearthfall" (off-by-one on the in-story date); D6 answered
    with a real-world month, showing the middle calendar line was skimmed.
- **obj-4**: D3 must equal "84 amp-hours" (not "85 amp-hours"); D8 must
  equal "37.9 km" (not "37.5 km"). Getting the decoy value instead of the
  keyed value on either indicates the model grabbed the wrong day's nearby
  figure.
  - PASS: D3 = "84 amp-hours" and D8 = "37.9 km"; both keyed values with
    the Day 5 / Day 12 provenance respected; correct even when the diary's
    Day 6 and Day 13 near-values are present in the text.
  - FAIL: D3 = "85 amp-hours" (the Day 6 meter-drift re-check); D8 = "37.5
    km" (the Day 13 gatehouse distance); D8 = "37.5 km" grabbed because it
    was the last km figure encountered on a keyword scan.
- **obj-5**: for each line, split on the first `:` and confirm the value
  field contains no additional sentence-like content (no verb phrases, no
  second standalone number that isn't part of the same token, e.g. a
  parenthetical alternative). A multi-word value that is itself the answer
  (e.g. "246 wardrobe pieces", "34 completed setups", "the 14th of
  Hearthfall") is fine; a hyphenated code with internal digits
  (e.g. "63-K12-N") is one token and is fine. A line like "D3: 84
  amp-hours (or maybe 85)" fails this check even if 84 is mentioned.
  - PASS: "D8: 37.9 km"; "D1: SL-207A"; "D7: 63-K12-N" (internal digits are
    part of one code token).
  - FAIL: "D8: 37.9 km (or possibly 37.5)" (parenthetical second
    candidate); "D3: 84 amp-hours — this was the Day 5 reading" (trailing
    explanation); "D6: the 14th of Hearthfall, though the 13th is also
    plausible" (hedged second candidate).

### Subjective guidance

- **Positional recall fidelity**: does the submission get the
  lost-in-middle needles (D5, D6) right along with the start/end ones, or
  does accuracy visibly sag in the middle of the document — the specific
  failure mode this test isolates?
- **Answer format discipline**: are all 10 answers formatted consistently
  as bare values (with quoting only where the value itself contains a
  space, per the task's instruction), without inconsistent decoration
  (e.g., adding units to some numeric answers but not others)?
- **Reasoning quality**: does `REASONING.md` show evidence of a systematic
  full read (e.g., referencing which shooting day each needle came from)
  rather than a keyword-search-only approach that might miss context
  distinguishing a decoy from the correct value?
