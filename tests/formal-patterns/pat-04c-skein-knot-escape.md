---
id: pat-04c-skein-knot-escape
category: formal-patterns
title: Validate the Skein knot escape a regex cannot accept
deliverables:
  - knot.js
---

## Task

The fictional "Skein knot" language cannot be recognized by any finite
regular expression, because it allows arbitrarily deep nesting.
Recognize this and implement a **stateful** validator (e.g. a small
recursive-descent or explicit-stack recognizer) — a single regex cannot
correctly accept this language (it will fail on nesting depth, and on
the escaped-close case described below).

Grammar of a valid whole-string Skein knot (a **KNOT**):

- A knot is the character `[`, then a **body**, then the character `]`.
- A body is zero or more **units**.
- A unit is one of:
  (a) any single character other than `[`, `]`, or tilde (`~`);
  (b) an **escape**: a tilde (`~`) followed by exactly one of `[`, `]`,
      or `~` (the tilde "consumes" that one following character, which
      then counts as a plain unit, not a structural token);
  (c) a **nested knot** (the same grammar, recursively, to arbitrary
      depth).
- Knots must be properly balanced and nested. The entire input string
  must be consumed by exactly one top-level knot — no leading or
  trailing characters outside it.

Because tilde-escaping is the central discriminator in this test,
**every corpus and vector string below is given with an explicit
character-by-character gloss** (as a code comment) so there is no
ambiguity about which literal characters are intended.

## Deliverables

- `knot.js` — exports `validate(s)` returning `true` or `false`, via
  `module.exports = { validate }`. When run with `node knot.js`, it
  must first print exactly one line per embedded corpus string, in the
  exact order listed, in the format `<input> MATCH` or `<input> REJECT`;
  then it must print exactly one line per embedded labeled vector item,
  in the exact order listed, in the format `<input> ACCEPT` or
  `<input> REJECT`.

Embedded corpus (24 strings) — validate each and print one line per
entry, in this order. Each string is given as a JavaScript string
literal, with a gloss comment spelling out every character (writing
`~[`, `~]`, `~~` etc. to name literal tilde-then-character pairs where
relevant):

```js
const CORPUS = [
  // --- must be classified MATCH ---
  "[]",                     // chars: [ ]                      (empty knot)
  "[[]]",                   // chars: [ [ ] ]                  (nested empty knot)
  "[a[b[c]d]e]",            // chars: [ a [ b [ c ] d ] e ]    (3 levels deep)
  "[one[two]three[four]]",  // chars: [ o n e [ t w o ] t h r e e [ f o u r ] ]  (two sibling nested knots)
  "[~[~]~~]",               // chars: [ ~[ ~] ~~ ]             (body is: escaped-[, escaped-], escaped-tilde)
  "[a]",                    // chars: [ a ]
  "[abc]",                  // chars: [ a b c ]
  "[a[b]c]",                // chars: [ a [ b ] c ]            (one nested knot among plain chars)
  "[ ]",                    // chars: [ (space) ]
  "[[][]]",                 // chars: [ [ ] [ ] ]              (two empty child knots as siblings)
  "[hello world]",          // chars: [ h e l l o (space) w o r l d ]
  // --- must be classified REJECT ---
  "[a[b]",                  // chars: [ a [ b ]                (inner knot closes; outer knot never closes)
  "[a[b[c]]",               // chars: [ a [ b [ c ] ]          (three opens, only two closes)
  "[a]extra",               // chars: [ a ] e x t r a          (trailing text after a complete knot)
  "pre[a]",                 // chars: p r e [ a ]               (leading text before the knot)
  "[a~b]",                  // chars: [ a ~b ]                 (tilde escapes 'b', not an escapable char)
  "[]]",                    // chars: [ ] ]                    (extra close after a complete knot)
  "",                       // chars: (empty string, no knot at all)
  "[a~]",                   // chars: [ a ~]                   (tilde escapes the ']', so the knot is never actually closed)
  "abc",                    // chars: a b c                    (no knot markers at all)
  "[",                      // chars: [                        (single unterminated open)
  "[a]]",                   // chars: [ a ] ]                  (closed knot then a stray extra ']')
  "[[a]",                   // chars: [ [ a ]                  (inner knot closes; outer stays open)
  "a[b]",                   // chars: a [ b ]                  (leading char before an otherwise valid knot)
];
```

Embedded labeled vector (8 items) — after the corpus, validate each of
these and print one line per entry, in this order:

```js
const VECTOR = [
  ["[]", true],        // chars: [ ]                     -> ACCEPT
  ["[a[b]c]", true],   // chars: [ a [ b ] c ]           -> ACCEPT
  ["[~[]", true],      // chars: [ ~[ ]  (escaped '[' as a plain unit, then close) -> ACCEPT
  ["[a~b]", false],    // chars: [ a ~b ]  ('b' is not an escapable char) -> REJECT
  ["[a[b]", false],    // chars: [ a [ b ]  (unclosed outer knot) -> REJECT
  ["[a~~]", true],     // chars: [ a ~~ ]  (escaped tilde, then close) -> ACCEPT
  ["[a~]", false],     // chars: [ a ~]  (tilde escapes ']', knot unterminated) -> REJECT
  ["[[a]]", true],     // chars: [ [ a ] ]  -> ACCEPT
];
```

## Constraints

- Plain JavaScript, no dependencies, single file.
- `validate` must never throw, must handle arbitrary nesting depth (do
  not hardcode a maximum), and must never rely on a single top-level
  regular expression as the sole matching mechanism.
- The file must end with `module.exports = { validate }`; the judge's
  harness requires it.
