---
id: precision-05-prohibition-gauntlet
category: instruction-following
title: Product page copy under a prohibition gauntlet
deliverables:
  - blurb.txt
---

## Task

Write `blurb.txt`: a 3-paragraph product blurb for **Notegarden**, a
fictional note-taking app, based on the brief below. Obey every rule in
the prohibition gauntlet that follows the brief — it must read as real,
natural copy while holding every prohibition at once. The brief below is
background only; do not copy its register.

### Brief (background only — written carelessly, do not imitate its style)

```
You're going to love Notegarden! It's the note app for people who are
tired of folders. We built it in 2019 with 3 co-founders and it now
has over 40,000 users. Notegarden gives you a seamless experience for
capturing ideas, and it helps you take your productivity to the next
level. Key things to mention: fast search across every note, tags
instead of rigid folders, offline sync for spotty connections, version
history so nothing is ever really deleted, and simple templates for
meeting notes, recipes, and travel logs. Small teams can also share a
folder while keeping their own private space.
```

### The prohibition gauntlet

Every rule below applies to the ENTIRE file, all three paragraphs:

1. No second-person pronoun, any casing: "you", "your", "yours",
   "you're".
2. No exclamation mark anywhere.
3. No digit characters (0-9) anywhere — spell out any quantity as
   words.
4. No sentence exceeds 18 whitespace-split tokens.
5. No em-dash (—), en-dash (–), or semicolon (;) character anywhere.
6. No sentence begins with "And", "But", or "So" (any casing).
7. None of these 6 banned cliche phrases may appear, any casing:
   - "take your productivity to the next level"
   - "seamless experience"
   - "game changer"
   - "unlock your potential"
   - "revolutionize the way you work"
   - "join thousands of"
8. No word appears more than 3 times in the whole file, EXCEPT the
   function words on this stoplist, which are exempt from the cap:
   a, an, the, and, or, of, to, in, for, with, without, is, are, it,
   its, that, this.

## Deliverables

- `blurb.txt` — exactly 3 paragraphs separated by a single blank line.
  No headings, list markers, blockquote markers, or emphasis markup
  (no `*`, `_`, or backtick runs) anywhere in the file.

## Constraints

- All 8 gauntlet rules apply simultaneously across the whole file, not
  per-paragraph.
- The blurb must still read as genuine product copy, not a checklist
  fighting itself.
