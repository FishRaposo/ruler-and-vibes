---
id: precision-05b-joinery-studio-gauntlet
category: instruction-following
title: Joinery studio copy under a prohibition gauntlet
deliverables:
  - blurb.txt
---

## Task

Write `blurb.txt`: a 3-paragraph product blurb for **Marlwood**, a
fictional membership app for a shared hand-tool woodworking studio, based
on the brief below. Obey every rule in the prohibition gauntlet that
follows the brief — it must read as real, natural copy while holding
every prohibition at once. The brief below is background only; do not
copy its register.

### Brief (background only — written carelessly, do not imitate its style)

```
Marlwood is amazing! Tired of fighting over a messy shared bench? It's the
studio app for woodworkers who want their own sharp tools ready. We opened
it in 2016 with 4 founding members and it now serves over 900 makers.
Marlwood gives you a hassle-free setup for booking a bench, and it will
help revolutionize how the whole crew works together. Key things to
mention: a shared honing station that keeps every blade sharp, a timber
rack cataloguing 52 species by thickness and grain,
offline mode for the barn dead spots, a project log so no cut is ever
lost, and simple guides for dovetails, mortises, and stool legs. Small
crews can also book a corner together while keeping their own private
notes.
```

### The prohibition gauntlet

Every rule below applies to the ENTIRE file, all three paragraphs:

1. No first-person pronoun, any casing: "I", "me", "my", "mine", "we",
   "us", "our", "ours".
2. No question mark anywhere.
3. No digit characters (0-9) anywhere — spell out any quantity as words.
4. No sentence exceeds 16 whitespace-split tokens.
5. No em-dash (—), en-dash (–), or semicolon (;) character anywhere.
6. No sentence begins with "Because", "However", or "Also" (any casing).
7. None of these 6 banned cliche phrases may appear, any casing:
   - "cut through the noise"
   - "best-in-class"
   - "built to last a lifetime"
   - "craftsmanship redefined"
   - "hassle-free setup"
   - "trusted by makers everywhere"
8. No word appears more than 3 times in the whole file, EXCEPT the
   function words on this stoplist, which are exempt from the cap:
   a, an, the, and, or, of, to, in, on, at, for, from, as, is, are, its,
   that.

## Deliverables

- `blurb.txt` — exactly 3 paragraphs separated by a single blank line.
  No headings, list markers, blockquote markers, or emphasis markup
  (no `*`, `_`, or backtick runs) anywhere in the file.

## Constraints

- All 8 gauntlet rules apply simultaneously across the whole file, not
  per-paragraph.
- The blurb must still read as genuine product copy, not a checklist
  fighting itself.
