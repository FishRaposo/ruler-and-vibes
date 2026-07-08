---
id: writing-08b-transit-newsletter-copyedit
category: writing
title: "Style-sheet copyedit for a transit newsletter with protected exceptions"
deliverables:
  - edited.md
  - changelog.md
---

## Task

You are copyediting a rider-newsletter passage against your transit agency's
**HOUSE STYLE SHEET**. Apply every rule that genuinely applies. Some things
in the passage look like violations but are actually protected and must be
left exactly as written — do not "fix" anything that is not genuinely wrong
under the sheet.

**HOUSE STYLE SHEET:**

> 1. Spell out whole numbers under 10 in body text (e.g. "eight," not "8").
> 2. Use the serial (Oxford) comma in lists of three or more items.
> 3. Write "nonprofit," never "non-profit."
> 4. No exclamation points.
> 5. Use "#" rather than the word "number" before a numeral (e.g.
>    "Route #12," not "Route number 12").
> 6. Write "rideshare," never "ride-share."
> 7. Write "check-in," never "checkin."
> 8. Em dashes take no surrounding spaces (never " — " with a space on
>    each side).

**PASSAGE (to be copyedited):**

> TransitLink is rolling out PathPass, a single fare card that finally
> replaces the fumbling for paper transfers and loose change riders have
> carried for years! Tap once at a bus door, a train turnstile, or a
> rideshare pickup, and PathPass applies the cheapest fare automatically.
> For 8 years, our riders have asked for exactly this, and starting this
> month every station in the network accepts it.
>
> The checkin kiosks recognize PathPass in under a second, and reload
> machines are now live at every Route number 20 platform. Since launch,
> fare disputes, refund delays and missed transfers have all dropped, and
> settlements with our non-profit fare-assistance partners across the
> region now clear automatically.
>
> None of this would have shipped on schedule without help from the
> Non-Profit Bike Alliance, the regional group that lent us its spare
> kiosks during testing and stayed on the project for 7 months while
> every station got weatherproofed. Day-to-day delivery was handled by
> our internal Corridor 4 Team.
>
> As one rider put it in a message to our team: "I park my bike at the
> ride-share rack next to the Route number 15 stop every morning, and
> PathPass is the first thing that's made my whole commute make sense.
> It shaved almost half my travel time, and I've told every neighbor I
> know to get one."
>
> Four more rideshare drop-off points open before spring, and each one
> trims another few minutes off a rider's morning — proof that small
> fixes add up fast. We built PathPass because riders asked for it, and
> we'll keep building because you keep telling us what's missing.

## Deliverables

- `edited.md` — the fully copyedited passage, applying every rule that
  genuinely applies and leaving every protected element exactly as
  written.
- `changelog.md` — a change log listing each change made, with each
  entry citing the specific style-sheet rule number it enforces. Do
  not include an entry for anything left unchanged.

## Constraints

- `edited.md` must apply every genuine style-sheet violation in the
  passage and must not alter: the direct quotation in paragraph 4
  (preserve it verbatim, including "ride-share" and "Route number 15"
  exactly as written), the partner name "Non-Profit Bike Alliance"
  (hyphen and capitalization kept), and "Corridor 4 Team" (the numeral
  stays; it is a proper-noun label, not body-text prose).
- `changelog.md` must be at most 250 words (whole file, `wc -w`) and
  must cite a rule number for every entry.
