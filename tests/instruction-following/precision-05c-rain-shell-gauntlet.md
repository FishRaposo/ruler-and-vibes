---
id: precision-05c-rain-shell-gauntlet
category: instruction-following
title: Rain shell copy under a prohibition gauntlet
deliverables:
  - blurb.txt
---

## Task

Write `blurb.txt`: a 3-paragraph product blurb for **Skarra**, a
fictional weatherproof rain shell, based on the brief below. Obey every
rule in the prohibition gauntlet that follows the brief — it must read as
real, natural copy while holding every prohibition at once. The brief
below is background only; do not copy its register.

### Brief (background only — written carelessly, do not imitate its style)

```
You are going to love Skarra! We built it in 2018 with 4 friends who
hated getting soaked, and now over 25,000 hikers trust it. Skarra gives
you a jacket that is honestly best in class, and it will take it to the
next level on every trail. Key things to mention: seams taped by hand so
no water sneaks in, pit vents that dump heat on steep climbs, a storm
hood that cinches around the face, quiet fabric that never rustles when
you move, and the whole thing packs into its own chest pocket. It is
woven from reclaimed bottles, so it is tough and kinder to the planet.
```

### The prohibition gauntlet

Every rule below applies to the ENTIRE file, all three paragraphs:

1. No third-person plural pronoun, any casing: "they", "them",
   "their", "theirs".
2. No exclamation mark anywhere.
3. No digit characters (0-9) anywhere — spell out any quantity as
   words.
4. No sentence exceeds 17 whitespace-split tokens.
5. No em-dash (—), en-dash (–), or semicolon (;) character anywhere.
6. No sentence begins with "Plus", "Also", or "Then" (any casing).
7. None of these 6 banned cliche phrases may appear, any casing:
   - "best in class"
   - "take it to the next level"
   - "built to last a lifetime"
   - "adventure awaits"
   - "push your limits"
   - "gear up for greatness"
8. No word appears more than 3 times in the whole file, EXCEPT the
   function words on this stoplist, which are exempt from the cap:
   a, an, the, and, or, of, to, in, on, for, from, with, into, is,
   are, it, its, as, at.

## Deliverables

- `blurb.txt` — exactly 3 paragraphs separated by a single blank line.
  No headings, list markers, blockquote markers, or emphasis markup
  (no `*`, `_`, or backtick runs) anywhere in the file.

## Constraints

- All 8 gauntlet rules apply simultaneously across the whole file, not
  per-paragraph.
- The blurb must still read as genuine product copy, not a checklist
  fighting itself.
