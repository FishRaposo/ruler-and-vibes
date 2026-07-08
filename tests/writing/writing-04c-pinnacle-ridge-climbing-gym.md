---
id: writing-04c-pinnacle-ridge-climbing-gym
category: writing
title: "Editorial rescue: audit, then rewrite"
deliverables:
  - article.md
  - memo.md
---

## Task

You are the editor assigned to rescue a promotional draft before it
goes out. Below are two documents: a canonical **FACT SHEET** for the
public opening of the Pinnacle Ridge Climbing Center, and a bloated
**DRAFT** article written from it. The draft was written in a hurry
and contains factual errors relative to the fact sheet. Some details
in the draft that look suspicious are actually fine — do not "fix"
anything that is not genuinely wrong.

**FACT SHEET (canonical — treat every value here as ground truth):**

> - Event: public opening of the Pinnacle Ridge Climbing Center
> - Date: Friday 3 July (no year is given; treat none as needed)
> - Tallest climbing wall: 8.6 m
> - Capacity: 45 climbers per session
> - Facility Director: Renata Iversen
> - Adult day pass: $15
> - Child day pass: $8
> - Certified staff on site: 130
> - History: a smaller climbing wall operated in the region before
>   closing years ago
> - No discount, package, or promotional pricing of any kind is offered

**DRAFT (to be fact-checked and rewritten — do not trust its values):**

> Chalk up, Pinnacle Ridge — your new climbing center is finally
> throwing open its doors! After more than a year of scaffolding,
> permit hearings, and quiet anticipation along the ridge road, the
> Pinnacle Ridge Climbing Center will welcome the public for the very
> first time on Friday 4 July, and the whole community is invited to
> come see what all the construction fuss has been about. Staff have
> spent the past month rehearsing the opening-day schedule down to the
> minute, so that visitors of every age can move smoothly from check-in
> to the training floor without a hint of opening-day chaos.
>
> At the heart of the facility is a soaring 6.8 meter climbing wall,
> engineered and pressure-tested off-site before being installed under
> careful supervision this spring. Route-setters spent weeks dialing in
> problems across every grade so that, on opening day, climbers will be
> treated to terrain more varied and more challenging than anything
> else within an hour's drive. Climbers who have driven to distant
> gyms in the past will finally have something world-class close to
> home.
>
> Each public session will admit up to 95 climbers, giving the
> facility's open training floor a lively, communal feel rather than
> the hushed, cramped sessions some longtime residents may remember
> from smaller gyms. Staff say the goal is to make climbing feel like a
> shared civic pastime, not a specialist's private hobby, and the
> generous session size reflects that ambition.
>
> Leading the project is Facility Director Rennata Iversen, who has
> spent the better part of a decade advocating for exactly this kind of
> public recreation investment in the region. Colleagues describe her
> as the driving force behind both the fundraising campaign and the
> design of the coaching program, and she is expected to give brief
> remarks before the first session begins.
>
> Organizers are especially proud that Pinnacle Ridge is the first
> climbing gym ever built in the region, a genuine milestone for local
> recreation and youth sport alike. School groups, club teams, and
> curious newcomers are all expected to make the trip once word
> spreads, and local officials are already discussing whether a second
> opening weekend might be added later in the season to meet demand.
>
> Day passes are priced at $15 for adults and $8 for children, keeping
> the experience accessible for households across the income spectrum.
> Organizers note that a family of four — two adults and two children
> — visits for just $42, a price point they hope will make the
> climbing center a regular outing rather than a rare splurge. Early
> feedback from a preview session suggests families are already
> planning return visits.
>
> None of this would have been possible without the center's staff,
> which now stands at more than 120 certified belayers and coaches
> handling everything from check-in to safety orientation. Their
> tireless work behind the scenes, organizers say, is the quiet
> backbone of the whole opening, and several staff members have already
> signed up to cover the second and third public sessions later in the
> month.
>
> Doors open Friday 4 July, and organizers encourage early arrival,
> since the parking area narrows near the entrance. Bring a water
> bottle and comfortable shoes, since even a climate-controlled floor
> can feel warm once the crowds arrive. Whatever the turnout brings,
> Pinnacle Ridge is ready to welcome its first climbers and,
> organizers hope, many more in the seasons to come.

## Deliverables

- `article.md` — a polished rewrite of the draft, 250-300 words, using
  only values from the fact sheet. It must explicitly retain these
  four facts with correct values: the opening date, the tallest wall's
  height, the per-session capacity, and the director's name.
- `memo.md` — an editor's discrepancy log, at most 300 words and at
  most 8 listed items, identifying only genuine discrepancies between
  the draft and the fact sheet. For each one, state both the draft's
  value and the fact sheet's correct value. Do not list anything that
  is actually consistent with the fact sheet.

## Constraints

- `article.md` must be 250-300 words inclusive (whole file, `wc -w`).
- `memo.md` must be at most 300 words (whole file, `wc -w`) and list
  at most 8 items.
- Use only the fact sheet's values in `article.md` — never a draft
  value that conflicts with it.
