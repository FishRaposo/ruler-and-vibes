---
test: apidoc-02-reserve-endpoint
canary: "clove mace"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "example.json is valid JSON (judge runs `node -e \"JSON.parse(require('fs').readFileSync('example.json','utf8'))\"` without error) and every entry has request/expectedStatus/expectedBody fields"
    - id: obj-2
      check: "ENDPOINT.md distinguishes 400 from 422 correctly: a MISSING or non-string seatId/holderId yields 400, while a present holdSeconds outside 1..900 yields 422"
    - id: obj-3
      check: "ENDPOINT.md documents the idempotent re-hold: re-reserving a held seat with the SAME holderId returns 200 with the existing hold, and a DIFFERENT holder returns 409"
    - id: obj-4
      check: "At least one example.json entry exercises the idempotent-200 case and at least one exercises the 422 out-of-range case, and BOTH carry the correct expectedStatus per the pinned mapping"
    - id: obj-5
      check: "ENDPOINT.md lists all six distinct status codes the spec defines (200, 201, 400, 404, 409, 422), each tied to its triggering condition"
  subjective:
    - id: sub-quality
      name: "Contract accuracy across status codes"
      weight: 0.4
    - id: sub-craft
      name: "Endpoint-doc structure & example fidelity"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Contract accuracy across status codes
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Endpoint-doc structure & example fidelity
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "clove mace" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Author ran a reference handler over nine cases; pinned
  request -> (status, body) mapping:
  - `{seatId:'A1',holderId:'H-9'}` => `201`
    `{seatId:'A1',holderId:'H-9',holdSeconds:120,state:'held'}`
  - `{seatId:'A1',holderId:'H-9',holdSeconds:300}` => `201`
    `{...holdSeconds:300}`
  - `{seatId:'A3',holderId:'H-9'}` (sold) => `409`
    `{error:'seat_taken'}`
  - `{seatId:'A1'}` (missing holderId) => `400`
    `{error:'missing_field'}`
  - `{seatId:'Z9',holderId:'H-9'}` (unknown) => `404`
    `{error:'seat_not_found'}`
  - `{seatId:'A1',holderId:'H-9',holdSeconds:0}` => `422`
    `{error:'hold_out_of_range'}`
  - `{seatId:'A1',holderId:'H-9',holdSeconds:901}` => `422`
    `{error:'hold_out_of_range'}`
  - `{seatId:'A2',holderId:'H-owner'}` (held, SAME holder) => `200`
    `{seatId:'A2',holderId:'H-owner',holdSeconds:120,state:'held'}`
    (TRAP: idempotent 200, not 409, and holdSeconds unchanged at 120)
  - `{seatId:'A2',holderId:'H-9'}` (held, DIFFERENT holder) => `409`
    `{error:'seat_taken'}`
  - Seat registry: A1=free, A2=held-by-H-owner (holdSeconds 120),
    A3=sold. `holdSeconds` range 1..900 inclusive, default 120.
- Verify obj-1 with the exact node one-liner in the check text; also
  confirm the parsed value is an array and scan every element for the
  three required keys.
- obj-2 is a prose-located binary check. PASS phrasings: "422 for an
  out-of-range holdSeconds", "400 only for missing or wrong-type
  fields", "out-of-range hold values are 422, not 400". FAIL phrasings:
  "an out-of-range holdSeconds returns 400", "all invalid input returns
  400", silence on 422 entirely.
- obj-3 is a prose-located binary check. PASS phrasings: "same holder
  re-reserving returns 200 idempotently", "a different holder gets
  409", "re-holding your own seat is a 200 no-op". FAIL phrasings: "a
  held seat always returns 409", "re-reserving returns 201 again",
  silence on the same-holder case.
- obj-4: read example.json's entries for the A2/H-owner case and the
  holdSeconds:0 or holdSeconds:901 case; confirm expectedStatus is 200
  and 422 respectively (either out-of-range value satisfies the 422
  requirement). A submission that has the case but marks it 409 or 400
  fails this check even if ENDPOINT.md's prose is correct elsewhere.
- obj-5: scan for explicit coverage of 200, 201, 400, 404, 409, 422 —
  a table is the natural form but any structure that ties all six to
  distinct trigger conditions passes.
- Contract accuracy across status codes: does the doc get the
  rule-evaluation ORDER right where it matters (e.g. that an
  out-of-range holdSeconds is caught before the seat registry is even
  consulted, so it's 422 regardless of whether the seat exists)? Does
  it avoid conflating "missing field" (400) with "invalid value
  present" (422)?
- Endpoint-doc structure & example fidelity: is the request/response
  contract easy to scan (e.g. a status-code table), and does
  example.json's full set of entries actually match the pinned mapping
  above wherever the judge spot-checks it, not just the two entries
  required by obj-4?
- Reasoning quality: does REASONING.md explain how the model resolved
  the interaction between the validation rules and the seat registry
  (e.g. explicitly noting the same-holder-vs-different-holder split,
  or the order-of-checks trap) rather than restating the task?
