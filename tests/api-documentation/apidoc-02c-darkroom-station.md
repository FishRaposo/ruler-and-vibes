---
id: apidoc-02c-darkroom-station
category: api-documentation
title: Document a darkroom-station booking endpoint's status-code contract
deliverables:
  - ENDPOINT.md
  - example.json
---

## Task

You maintain the booking service for a community darkroom where members
reserve enlarger stations. Operations has handed you the verified behavior
spec below for an endpoint that has shipped but was never documented. Write
the reference page from this spec — there is no source code to read, only the
contract below. Read it carefully; several of its rules interact.

### Endpoint

`POST /stations/book`

Request body: `{ stationId: string, memberId: string, minutes?: integer }`

- `stationId` and `memberId` are both required and must be strings. A missing
  or non-string `stationId` or `memberId` is a malformed request.
- `minutes` is optional. When omitted, it defaults to `45`. When present, it
  must be an integer in the inclusive range `15..240`.

### Station registry (current state for this spec)

- `E4` — open.
- `E7` — currently held by member `M-holly`, with `minutes: 45`.
- `E2` — retired (permanently out of service).
- Any other `stationId` is unknown to the system.

### Behavior rules

1. If `stationId` or `memberId` is missing or not a string: respond `400`
   with `{ "error": "missing_field" }`.
2. Else if `minutes` is present but not an integer in `15..240`: respond `422`
   with `{ "error": "minutes_out_of_range" }`.
3. Else if `stationId` is not in the registry: respond `404` with
   `{ "error": "station_not_found" }`.
4. Else if the station is `retired`: respond `409` with
   `{ "error": "station_unavailable" }`.
5. Else if the station is currently `held`:
   - If the existing hold's `memberId` matches the request's `memberId`, this
     is treated as the SAME member re-confirming their own hold: respond `200`
     with the existing hold's `{ stationId, memberId, minutes, state: "reserved" }`
     (minutes unchanged from the existing hold — this call does not extend or
     alter it).
   - If the existing hold's `memberId` differs, respond `409` with
     `{ "error": "station_unavailable" }`.
6. Else (the station is `open`): create a new hold using the request's
   `minutes` (or the default `45` if omitted) and respond `201` with
   `{ stationId, memberId, minutes, state: "reserved" }`.

Rules are evaluated in the order listed — e.g. an out-of-range `minutes` is
caught by rule 2 before the station registry is even consulted.

## Deliverables

- `ENDPOINT.md` — a reference page for `POST /stations/book` covering the
  request body (required vs optional fields, the `minutes` default and valid
  range), and every distinct response: the two success responses and all error
  responses, each tied to the exact condition that triggers it.
- `example.json` — a JSON array where each entry is
  `{ "request": {...}, "expectedStatus": <number>, "expectedBody": {...} }`,
  covering at least the following nine request scenarios (using the station
  registry above): a plain successful booking of `E4`; a booking of `E4` with
  a custom valid `minutes`; an attempt on retired station `E2`; a request
  missing `memberId`; a request for unknown station `Q3`; a request with
  `minutes: 14`; a request with `minutes: 241`; a re-request for held station
  `E7` by its existing holder `M-holly`; and a re-request for held station
  `E7` by a different member.

## Constraints

- `example.json` must be valid JSON (parseable with
  `JSON.parse(fs.readFileSync('example.json', 'utf8'))`), a top-level array,
  and every entry must have `request`, `expectedStatus`, and `expectedBody`
  keys.
- No server, code, or HTTP client is required or expected — this is a pure
  documentation and data-authoring task.
