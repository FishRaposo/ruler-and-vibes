---
id: edit-03-tracked-changelog
category: copyediting
title: "Correct and emit a tracked changelog"
deliverables:
  - corrected.txt
  - changelog.json
---

## Task

You are copyediting the passage below and must produce both the
corrected text and a **structured changelog** that faithfully records
every correction you make — no more, no less.

**PASSAGE (to be copyedited):**

> The committee finaly reached a decission on the new parking policy
> after months of debate. Residents on the east side has long
> complained that visitor spaces fill up before noon, while the west
> side rarely sees more more than a handful of cars at any given time.
>
> Under the new rules, each unit will recieve two dedicated visitor
> passes per month, and the board excepted a proposal to add four
> additional spaces near the community garden. The building manager
> said the change should of been made years ago, but past boards kept
> delaying it over cost concerns.
>
> Residents will be notified by mail this week, and the new passes go
> into effect on the first of next month.

## Deliverables

- `corrected.txt` — the fully copyedited passage.
- `changelog.json` — a JSON array where each element is an object
  `{"before": <original substring>, "after": <corrected substring>,
  "reason": <short tag>}`, one entry per correction made, and nothing
  more.

## Constraints

- `changelog.json` must be valid JSON: an array whose every element
  has exactly the keys `before`, `after`, and `reason`, all strings.
- The number of entries in `changelog.json` must equal the number of
  corrections actually made in `corrected.txt` — every change you make
  must be reported, and every entry you report must correspond to a
  real change.
- Do not report an entry for anything you left unchanged, and do not
  make a change without reporting it.
