---
id: edit-03c-letterpress-booking
category: copyediting
title: "Copyedit a studio notice and emit a tracked changelog"
deliverables:
  - corrected.txt
  - changelog.json
---

## Task

You are copyediting the notice below and must produce both the corrected
text and a **structured changelog** that faithfully records every
correction you make — no more, no less.

**NOTICE (to be copyedited):**

> The Marlowe Street letterpress cooperative has decided to overhaul its
> equipment-booking system after a busy printing season. Members who
> share the flatbed proof press has repeatedly found it double-booked on
> weekends, and a recurring jam on the the platen press went unreported
> for weeks because no one knew who to tell.
>
> Under the revised policy, each member may reserve the studio's principle
> press for up to three hours per visit, and the stewards accepted a plan
> to keep two seperate sign-up sheets, one for hand-set type and one for
> photopolymer. The workshop coordinator admitted the overhaul could of
> happened sooner, but earlier volunteers kept postponing it whenever a
> maintainance backlog occured.
>
> Members will be emailed the new booking link on Friday, and the
> reservation system opens for the summer term the following Monday.

## Deliverables

- `corrected.txt` — the fully copyedited notice.
- `changelog.json` — a JSON array where each element is an object
  `{"before": <original substring>, "after": <corrected substring>,
  "reason": <short tag>}`, one entry per correction made, and nothing
  more.

## Constraints

- `changelog.json` must be valid JSON: an array whose every element has
  exactly the keys `before`, `after`, and `reason`, all strings.
- The number of entries in `changelog.json` must equal the number of
  corrections actually made in `corrected.txt` — every change you make
  must be reported, and every entry you report must correspond to a real
  change.
- Do not report an entry for anything you left unchanged, and do not make
  a change without reporting it.
