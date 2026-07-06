---
id: edit-03b-cargobike-lending-changelog
category: copyediting
title: "Copyedit a bulletin and emit a tracked changelog"
deliverables:
  - corrected.txt
  - changelog.json
---

## Task

You are copyediting the bulletin below and must produce both the
corrected text and a **structured changelog** that faithfully records
every correction you make — no more, no less.

**PASSAGE (to be copyedited):**

> The coordinators finaly settled on a booking scheme for the cargo
> bikes after a long stretch of trial runs. Members near the Marridge
> depot has repeatedly noted that the two trailer bikes are claimed
> within minutes of the slots openning, while the folding bikes sit idle
> most most mornings.
>
> Under the new scheme, each household may reserve three rides per week,
> and the committee excepted a suggestion to keep one bike aside for
> last-minute errands. The workshop lead said the split should of
> happened a year ago, but earlier coordinators kept a seperate waitlist
> going over upkeep worries.
>
> Members will be told by email on Friday, and the fresh booking limits
> take effect from the start of the following week.

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
