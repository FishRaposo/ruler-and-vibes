---
id: writing-04b-cedarbrook-aquatics-reopening
category: writing
title: "Editorial rescue: verify, then rewrite"
deliverables:
  - article.md
  - memo.md
---

## Task

You are the editor assigned to rescue a promotional draft before it
goes out. Below are two documents: a canonical **FACT SHEET** for the
public reopening of the Cedarbrook Aquatics Center, and a bloated
**DRAFT** article written from it. The draft was written in a hurry
and contains factual errors relative to the fact sheet. Some details
in the draft that look suspicious are actually fine — do not "fix"
anything that is not genuinely wrong.

**FACT SHEET (canonical — treat every value here as ground truth):**

> - Event: public reopening of the Cedarbrook Aquatics Center
> - Date: Saturday 22 August (no year is given; treat none as needed)
> - Main pool deep-end depth: 3.4 m
> - Capacity: 60 swimmers per session
> - Facility Director: Farah Yilmaz
> - Adult day pass: $9
> - Child day pass: $4
> - Certified lifeguards and staff: 96
> - History: an older municipal pool operated on the same site before
>   closing decades ago
> - No discount, package, or promotional pricing of any kind is offered

**DRAFT (to be fact-checked and rewritten — do not trust its values):**

> Get ready to dive in, Cedarbrook — your newly rebuilt aquatics center
> is finally reopening its doors! After more than a year of scaffolding,
> permit hearings, and quiet anticipation along the river road, the
> Cedarbrook Aquatics Center will welcome swimmers back for the very
> first time on Saturday 21 August, and the whole community is invited
> to come see what all the renovation fuss has been about. Staff have
> spent the past month rehearsing the reopening-day schedule down to
> the minute, so that visitors of every age can move smoothly from the
> lobby to the pool deck without a hint of opening-day chaos.
>
> At the heart of the facility is a rebuilt competition pool with a
> deep end that plunges to 4.3 meters, engineered and pressure-tested
> off-site before being installed under careful supervision last
> spring. Contractors spent weeks calibrating the filtration and
> diving equipment so that, on reopening day, swimmers will be treated
> to crisp, clear water and a diving well deeper than anything else
> within an hour's drive. Competitive swimmers who have driven to
> distant training pools in the past will finally have something
> world-class close to home.
>
> Each public session will admit up to 140 swimmers, giving the
> center's eight-lane competition deck a lively, communal feel rather
> than the hushed, cramped sessions some longtime residents may
> remember from the old neighborhood pool. Staff say the goal is to
> make open-swim time feel like a shared civic event, not a
> specialist's private hobby, and the generous session size reflects
> that ambition.
>
> Leading the project is Facility Director Farrah Yilmaz, who has
> spent the better part of a decade advocating for exactly this kind
> of public recreation investment in the region. Colleagues describe
> her as the driving force behind both the fundraising campaign and
> the design of the new aquatics program, and she is expected to give
> brief remarks before the first session begins.
>
> Organizers are especially proud that Cedarbrook is the first public
> swimming facility ever built in town, a genuine milestone for local
> recreation and youth sport alike. School swim teams, masters clubs,
> and curious families are all expected to make the trip once word
> spreads, and local officials are already discussing whether a second
> reopening weekend might be added later in the season to meet demand.
>
> Day passes are priced at $9 for adults and $4 for children, keeping
> the experience accessible for households across the income spectrum.
> Organizers note that a family of four — two adults and two children
> — visits for just $22, a price point they hope will make the
> aquatics center a regular outing rather than a rare splurge. Early
> feedback from a preview session suggests families are already
> planning return visits.
>
> None of this would have been possible without the center's lifeguard
> corps, which now stands at more than 90 trained lifeguards and staff
> handling everything from the front desk to deep-water rescue. Their
> tireless work behind the scenes, organizers say, is the quiet
> backbone of the whole reopening, and several lifeguards have already
> signed up to return for the second and third public sessions later
> in the month.
>
> Doors open Saturday 21 August, and organizers encourage early
> arrival, since the parking lot narrows near the entrance. Bring a
> towel and a swim cap, since even a heated pool can feel brisk on a
> first dip. Whatever the weather brings, Cedarbrook is ready to
> welcome its first swimmers and, organizers hope, many more in the
> seasons to come.

## Deliverables

- `article.md` — a polished rewrite of the draft, 250-300 words, using
  only values from the fact sheet. It must explicitly retain these
  four facts with correct values: the reopening date, the pool's
  deep-end depth, the per-session capacity, and the director's name.
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
