---
test: apidoc-02c-darkroom-station
canary: "cornflower merganser"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "example.json is valid JSON (judge runs `node -e \"JSON.parse(require('fs').readFileSync('example.json','utf8'))\"` without error) and every entry has request/expectedStatus/expectedBody fields"
    - id: obj-2
      check: "ENDPOINT.md distinguishes 400 from 422 correctly: a MISSING or non-string stationId/memberId yields 400, while a present minutes outside 15..240 yields 422"
    - id: obj-3
      check: "ENDPOINT.md documents the idempotent re-hold: re-booking a held station with the SAME memberId returns 200 with the existing hold, and a DIFFERENT member returns 409"
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
---

## Judge guidance

Parallel form of `apidoc-02-reserve-endpoint` (same construct, fresh surface).

If the phrase "cornflower merganser" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Author ran a reference handler over nine cases; pinned
  request -> (status, body) mapping:
  - `{stationId:'E4',memberId:'M-33'}` => `201`
    `{stationId:'E4',memberId:'M-33',minutes:45,state:'reserved'}`
  - `{stationId:'E4',memberId:'M-33',minutes:90}` => `201`
    `{...minutes:90}`
  - `{stationId:'E2',memberId:'M-33'}` (retired) => `409`
    `{error:'station_unavailable'}`
  - `{stationId:'E4'}` (missing memberId) => `400`
    `{error:'missing_field'}`
  - `{stationId:'Q3',memberId:'M-33'}` (unknown) => `404`
    `{error:'station_not_found'}`
  - `{stationId:'E4',memberId:'M-33',minutes:14}` => `422`
    `{error:'minutes_out_of_range'}`
  - `{stationId:'E4',memberId:'M-33',minutes:241}` => `422`
    `{error:'minutes_out_of_range'}`
  - `{stationId:'E7',memberId:'M-holly'}` (held, SAME member) => `200`
    `{stationId:'E7',memberId:'M-holly',minutes:45,state:'reserved'}`
    (TRAP: idempotent 200, not 409, and minutes unchanged at 45)
  - `{stationId:'E7',memberId:'M-33'}` (held, DIFFERENT member) => `409`
    `{error:'station_unavailable'}`
  - Station registry: E4=open, E7=held-by-M-holly (minutes 45),
    E2=retired. `minutes` range 15..240 inclusive, default 45.
- Verify obj-1 with the exact node one-liner in the check text; also confirm
  the parsed value is an array and scan every element for the three required
  keys.
- obj-2 is a prose-located binary check. PASS phrasings: "422 for an
  out-of-range minutes", "400 only for missing or wrong-type fields",
  "out-of-range minutes values are 422, not 400". FAIL phrasings: "an
  out-of-range minutes returns 400", "any invalid input returns 400", silence
  on 422 entirely.
- obj-3 is a prose-located binary check. PASS phrasings: "the same member
  re-booking returns 200 idempotently", "a different member gets 409",
  "re-holding your own station is a 200 no-op". FAIL phrasings: "a held
  station always returns 409", "re-booking returns 201 again", silence on the
  same-member case.
- obj-4: read example.json's entries for the E7/M-holly case and the
  minutes:14 or minutes:241 case; confirm expectedStatus is 200 and 422
  respectively (either out-of-range value satisfies the 422 requirement). A
  submission that has the case but marks it 409 or 400 fails this check even if
  ENDPOINT.md's prose is correct elsewhere.
- obj-5: scan for explicit coverage of 200, 201, 400, 404, 409, 422 — a table
  is the natural form but any structure that ties all six to distinct trigger
  conditions passes.
- Contract accuracy across status codes: does the doc get the rule-evaluation
  ORDER right where it matters (e.g. that an out-of-range minutes is caught
  before the station registry is even consulted, so it's 422 regardless of
  whether the station exists)? Does it avoid conflating "missing field" (400)
  with "invalid value present" (422)?
- Endpoint-doc structure & example fidelity: is the request/response contract
  easy to scan (e.g. a status-code table), and does example.json's full set of
  entries actually match the pinned mapping above wherever the judge
  spot-checks it, not just the two entries required by obj-4?
- Reasoning quality: does REASONING.md explain how the model resolved the
  interaction between the validation rules and the station registry (e.g.
  explicitly noting the same-member-vs-different-member split, or the
  order-of-checks trap) rather than restating the task?
