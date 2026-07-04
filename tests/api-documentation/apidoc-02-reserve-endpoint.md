---
id: apidoc-02-reserve-endpoint
category: api-documentation
title: Document a seat-reservation endpoint's status-code contract
deliverables:
  - ENDPOINT.md
  - example.json
---

## Task

Your team runs a small event-ticketing service. Product has handed you
the verified behavior spec below for an endpoint that has shipped but
never been documented. Write the reference page from this spec — there
is no source code to read, only the contract below. Read it carefully;
several of its rules interact.

### Endpoint

`POST /seats/reserve`

Request body: `{ seatId: string, holderId: string, holdSeconds?: integer }`

- `seatId` and `holderId` are both required and must be strings. A
  missing or non-string `seatId` or `holderId` is a malformed request.
- `holdSeconds` is optional. When omitted, it defaults to `120`. When
  present, it must be an integer in the inclusive range `1..900`.

### Seat registry (current state for this spec)

- `A1` — free.
- `A2` — currently held by holder `H-owner`, with `holdSeconds: 120`.
- `A3` — sold.
- Any other `seatId` is unknown to the system.

### Behavior rules

1. If `seatId` or `holderId` is missing or not a string: respond `400`
   with `{ "error": "missing_field" }`.
2. Else if `holdSeconds` is present but not an integer in `1..900`:
   respond `422` with `{ "error": "hold_out_of_range" }`.
3. Else if `seatId` is not in the registry: respond `404` with
   `{ "error": "seat_not_found" }`.
4. Else if the seat is `sold`: respond `409` with
   `{ "error": "seat_taken" }`.
5. Else if the seat is currently `held`:
   - If the existing hold's `holderId` matches the request's
     `holderId`, this is treated as the SAME holder re-confirming their
     own hold: respond `200` with the existing hold's
     `{ seatId, holderId, holdSeconds, state: "held" }` (holdSeconds
     unchanged from the existing hold — this call does not extend or
     alter it).
   - If the existing hold's `holderId` differs, respond `409` with
     `{ "error": "seat_taken" }`.
6. Else (the seat is `free`): create a new hold using the request's
   `holdSeconds` (or the default `120` if omitted) and respond `201`
   with `{ seatId, holderId, holdSeconds, state: "held" }`.

Rules are evaluated in the order listed — e.g. an out-of-range
`holdSeconds` is caught by rule 2 before the seat registry is even
consulted.

## Deliverables

- `ENDPOINT.md` — a reference page for `POST /seats/reserve` covering
  the request body (required vs optional fields, the `holdSeconds`
  default and valid range), and every distinct response: the two
  success responses and all error responses, each tied to the exact
  condition that triggers it.
- `example.json` — a JSON array where each entry is
  `{ "request": {...}, "expectedStatus": <number>, "expectedBody": {...} }`,
  covering at least the following nine request scenarios (using the
  seat registry above): a plain successful reservation of `A1`; a
  reservation of `A1` with a custom valid `holdSeconds`; an attempt on
  sold seat `A3`; a request missing `holderId`; a request for unknown
  seat `Z9`; a request with `holdSeconds: 0`; a request with
  `holdSeconds: 901`; a re-request for held seat `A2` by its existing
  holder `H-owner`; and a re-request for held seat `A2` by a different
  holder.

## Constraints

- `example.json` must be valid JSON (parseable with
  `JSON.parse(fs.readFileSync('example.json', 'utf8'))`), a top-level
  array, and every entry must have `request`, `expectedStatus`, and
  `expectedBody` keys.
- No server, code, or HTTP client is required or expected — this is a
  pure documentation and data-authoring task.
