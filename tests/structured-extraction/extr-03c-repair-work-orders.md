---
id: extr-03c-repair-work-orders
category: structured-extraction
title: Garbled repair-shop work orders to typed record array
deliverables:
  - workorders.json
---

## Task

Parse the work-order log below into a JSON array matching the schema
EXACTLY. The log is a raw plain-text dump from a repair-shop front
desk terminal; formatting is inconsistent line to line, and one line
is a stray reprint that should not become a second record.

Work-order log (as printed):

```
WORK ORDER WO-410 | labor: 3.5 hrs | bay: BAY-2 | note: routine oil change and filter, customer while-you-wait
--
order wo-411; labor 45 min; bay: ; note: brake pad replacement, front axle only
--
WO-412 -- 1.25hrs -- BAY-5 -- note: engine mount swap, covered under manufacturer warranty
--
WO-413 | 6 HRS | BAY-1 | note: transmission rebuild, full teardown and reseal
--
WORK ORDER WO-410 | labor: 3.5 hrs | bay: BAY-2 | note: routine oil change and filter, customer while-you-wait    (duplicate printout - ignore, same ticket rescanned)
```

## Schema

A JSON array. Each element is an object with EXACTLY these keys:

- `id` — string, e.g. `"WO-410"`.
- `labor_hours` — number, always in hours (convert minutes to hours
  where needed).
- `bay` — string, or `null` if the source line left the bay blank.
  Never invent a bay.
- `warranty` — boolean (`true`/`false`, never a string, never
  omitted): `true` only if the work order's note mentions a
  manufacturer-warranty-covered repair, `false` otherwise.

## Deliverables

- `workorders.json` — the array described above.

## Constraints

- `workorders.json` must parse with `JSON.parse`. No trailing commas,
  no comments, no extra keys.
- The reprinted/duplicate printout line refers to the same work order
  as an earlier line and must NOT produce a second record — each work
  order id appears exactly once in the output.
- Preserving first-appearance order is a nice-to-have, not a
  requirement.
