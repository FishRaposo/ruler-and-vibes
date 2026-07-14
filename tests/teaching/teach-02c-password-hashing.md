---
id: teach-02c-password-hashing
category: teaching
title: "Explain how websites store passwords so a non-technical colleague isn't scared"
deliverables:
  - explainer.md
  - REASONING.md
---

## Task

A non-technical colleague asks: "Every site I use has my password.
Can the people who run the website see it? What stops a hacker from
stealing the whole list?"

Write `explainer.md` that bridges the gap between "they encrypt it" and
a technically honest explanation. You may use one analogy (one-way
shredder, fingerprint instead of photo, locked recipe that can be tested
but not read, …) but must connect each analog step back to the real
mechanism at least once.

**Required audience profile** (adapt to this, not a generic reader):
- Uses computers daily, comfortable with apps and files
- Has never run a terminal command and doesn't know what a "hash" is
- Wants to understand, not just hear "don't worry about it"

`REASONING.md` must name the analogy you chose and at least one
alternative you rejected and why.

## Deliverables

- `explainer.md` — the explanation for the colleague
- `REASONING.md` — as required for every test by the run protocol

## Constraints

- 200–500 words in `explainer.md` (whole file, `wc -w`).
- No words the colleague would need to look up without in-line definition.
- Must state at least one place the analogy deliberately simplifies
  or lies (at the end, labelled clearly).
