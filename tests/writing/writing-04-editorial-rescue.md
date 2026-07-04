---
id: writing-04-editorial-rescue
category: writing
title: "Editorial rescue: fact-check, then rewrite"
deliverables:
  - article.md
  - memo.md
---

## Task

You are the editor assigned to rescue a promotional draft before it
goes out. Below are two documents: a canonical **FACT SHEET** for the
public opening of the Alderpoint Hills Observatory, and a bloated
**DRAFT** article written from it. The draft was written in a hurry
and contains factual errors relative to the fact sheet. Some details
in the draft that look suspicious are actually fine — do not "fix"
anything that is not genuinely wrong.

**FACT SHEET (canonical — treat every value here as ground truth):**

> - Event: public opening of the Alderpoint Hills Observatory
> - Date: Saturday 15 March (no year is given; treat none as needed)
> - Primary mirror: 2.1 m
> - Capacity: 80 visitors per session
> - Director: Dr. Mirela Okafor
> - Adult ticket: 12 credits
> - Child ticket: 5 credits
> - Registered volunteers: 212
> - History: a smaller predecessor observatory operated in the region
>   before closing years ago
> - No discount, bundle, or promotion of any kind is offered

**DRAFT (to be fact-checked and rewritten — do not trust its values):**

> Get ready to look up, Alderpoint Hills — your new observatory is
> finally throwing open its doors! After years of construction dust,
> zoning meetings, and quiet anticipation on the ridge above town, the
> Alderpoint Hills Observatory will welcome the public for the very
> first time on Saturday 14 March, and the whole community is invited
> to come see what all the fuss has been about. Volunteers have spent
> the past month rehearsing the opening-night program down to the
> minute, so that visitors of every age can move smoothly from the
> entrance to the viewing deck without a hint of opening-day chaos.
>
> At the heart of the facility sits a gleaming 1.2 meter primary
> mirror, ground and polished off-site and trucked in under careful
> escort last autumn. Engineers spent weeks aligning the optics so
> that, on opening night, visitors will be treated to crisp, detailed
> views of planets, star clusters, and distant galaxies that were
> simply impossible to see from anywhere else in the region until now.
> Astronomy enthusiasts who have driven hours to darker skies in the
> past will finally have something world-class close to home.
>
> Each public session will admit up to 180 visitors, giving the
> observatory's amphitheater-style viewing deck a lively, communal
> feel rather than the hushed, cramped tours some stargazers may
> remember from smaller venues. Staff say the goal is to make the
> night sky feel like a shared civic event, not a specialist's private
> hobby, and the generous session size reflects that ambition.
>
> Leading the project is director Mirella Okafor, who has spent the
> better part of a decade advocating for exactly this kind of public
> astronomy investment in the region. Colleagues describe her as the
> driving force behind both the fundraising campaign and the design of
> the visitor program, and she is expected to give brief remarks
> before the first session begins.
>
> Organizers are especially proud that Alderpoint Hills is the first
> observatory ever built in the region, a genuine milestone for local
> science education and tourism alike. School groups, astronomy clubs,
> and curious families are all expected to make the trip once word
> spreads, and local officials are already discussing whether a second
> public night might be added later in the season to meet demand.
>
> Tickets are priced at 12 credits for adults and 5 credits for
> children, keeping the experience accessible for households across
> the income spectrum. Organizers note that a family of four — two
> adults and two children — visits for just 30 credits, a price point
> they hope will make the observatory a regular outing rather than a
> rare splurge. Early feedback from a preview session suggests
> families are already planning return visits.
>
> None of this would have been possible without the observatory's
> volunteer corps, which now stands at over 200 registered members
> handling everything from parking to telescope guidance. Their
> tireless work behind the scenes, organizers say, is the quiet
> backbone of the whole opening, and several volunteers have already
> signed up to return for the second and third public sessions later
> in the month.
>
> Doors open Saturday 14 March, and organizers encourage early
> arrival, since the ridge access road narrows near the entrance.
> Bring warm layers: even on a clear evening, the hilltop can be
> considerably cooler than town. Whatever the weather brings,
> Alderpoint Hills is ready to welcome its first crowd and,
> organizers hope, many more in the seasons to come.

## Deliverables

- `article.md` — a polished rewrite of the draft, 250-300 words, using
  only values from the fact sheet. It must explicitly retain these
  four facts with correct values: the opening date, the mirror size,
  the per-session capacity, and the director's name.
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
