---
id: apidoc-02b-locker-claim-endpoint
category: api-documentation
title: Document a parcel-locker claim endpoint's status-code contract
deliverables:
  - ENDPOINT.md
  - example.json
---

## Task

Your team operates a network of self-service parcel lockers at the
Harlow Cross courier depot. Operations has handed you the verified
behavior spec below for an endpoint that has shipped but was never
documented. Write the reference page from this spec — there is no source
code to read, only the contract below. Read it carefully; several of its
rules interact.

### Endpoint

`POST /lockers/claim`

Request body: `{ lockerId: string, courierId: string, releaseMinutes?: integer }`

- `lockerId` and `courierId` are both required and must be strings. A
  missing or non-string `lockerId` or `courierId` is a malformed
  request.
- `releaseMinutes` is optional. When omitted, it defaults to `30`. When
  present, it must be an integer in the inclusive range `5..480`.

### Locker registry (current state for this spec)

- `L1` — vacant.
- `L2` — currently reserved by courier `C-anchor`, with
  `releaseMinutes: 30`.
- `L3` — dispatched.
- Any other `lockerId` is unknown to the system.

### Behavior rules

1. If `lockerId` or `courierId` is missing or not a string: respond
   `400` with `{ "error": "missing_field" }`.
2. Else if `releaseMinutes` is present but not an integer in `5..480`:
   respond `422` with `{ "error": "release_out_of_range" }`.
3. Else if `lockerId` is not in the registry: respond `404` with
   `{ "error": "locker_not_found" }`.
4. Else if the locker is `dispatched`: respond `409` with
   `{ "error": "locker_unavailable" }`.
5. Else if the locker is currently `reserved`:
   - If the existing reservation's `courierId` matches the request's
     `courierId`, this is treated as the SAME courier re-confirming
     their own reservation: respond `200` with the existing
     reservation's
     `{ lockerId, courierId, releaseMinutes, state: "reserved" }`
     (releaseMinutes unchanged from the existing reservation — this call
     does not extend or alter it).
   - If the existing reservation's `courierId` differs, respond `409`
     with `{ "error": "locker_unavailable" }`.
6. Else (the locker is `vacant`): create a new reservation using the
   request's `releaseMinutes` (or the default `30` if omitted) and
   respond `201` with
   `{ lockerId, courierId, releaseMinutes, state: "reserved" }`.

Rules are evaluated in the order listed — e.g. an out-of-range
`releaseMinutes` is caught by rule 2 before the locker registry is even
consulted.

## Deliverables

- `ENDPOINT.md` — a reference page for `POST /lockers/claim` covering
  the request body (required vs optional fields, the `releaseMinutes`
  default and valid range), and every distinct response: the two
  success responses and all error responses, each tied to the exact
  condition that triggers it.
- `example.json` — a JSON array where each entry is
  `{ "request": {...}, "expectedStatus": <number>, "expectedBody": {...} }`,
  covering at least the following nine request scenarios (using the
  locker registry above): a plain successful claim of `L1`; a claim of
  `L1` with a custom valid `releaseMinutes`; an attempt on dispatched
  locker `L3`; a request missing `courierId`; a request for unknown
  locker `L7`; a request with `releaseMinutes: 4`; a request with
  `releaseMinutes: 481`; a re-request for reserved locker `L2` by its
  existing courier `C-anchor`; and a re-request for reserved locker `L2`
  by a different courier.

## Constraints

- `example.json` must be valid JSON (parseable with
  `JSON.parse(fs.readFileSync('example.json', 'utf8'))`), a top-level
  array, and every entry must have `request`, `expectedStatus`, and
  `expectedBody` keys.
- No server, code, or HTTP client is required or expected — this is a
  pure documentation and data-authoring task.
