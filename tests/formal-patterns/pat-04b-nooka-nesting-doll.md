---
id: pat-04b-nooka-nesting-doll
category: formal-patterns
title: Validate the Nooka nesting doll a regex cannot accept
deliverables:
  - nooka.js
---

## Task

The fictional "Nooka doll" language cannot be recognized by any finite
regular expression, because it allows arbitrarily deep nesting.
Recognize this and implement a **stateful** validator (e.g. a small
recursive-descent or explicit-stack recognizer) — a single regex
cannot correctly accept this language (it will fail on nesting depth,
and on the escaped-close case described below).

Grammar of a valid whole-string Nooka doll (a **DOLL**):

- A doll is the character `[`, then a **body**, then the character
  `]`.
- A body is zero or more **units**.
- A unit is one of:
  (a) any single character other than `[`, `]`, or tilde;
  (b) an **escape**: a tilde followed by exactly one of `[`, `]`, or
      tilde (the tilde "consumes" that one following character, which
      then counts as a plain unit, not a structural token);
  (c) a **nested doll** (the same grammar, recursively, to arbitrary
      depth).
- Dolls must be properly balanced and nested. The entire input string
  must be consumed by exactly one top-level doll — no leading or
  trailing characters outside it.

Because tilde-escaping is the central discriminator in this test,
**every corpus and vector string below is given with an explicit
character-by-character gloss** (as a code comment) so there is no
ambiguity about which literal characters are intended.

## Deliverables

- `nooka.js` — exports `validate(s)` returning `true` or `false`, via
  `module.exports = { validate }`. When run with `node nooka.js`, it
  must first print exactly one line per embedded corpus string, in the
  exact order listed, in the format `<input> MATCH` or
  `<input> REJECT`; then it must print exactly one line per embedded
  labeled vector item, in the exact order listed, in the format
  `<input> ACCEPT` or `<input> REJECT`.

Embedded corpus (24 strings) — validate each and print one line per
entry, in this order. Each string is given as a JavaScript string
literal, with a gloss comment spelling out every character (writing
`~[`, `~]`, `~~` etc. to name literal tilde-then-character pairs where
relevant):

```js
const CORPUS = [
  // --- must be classified MATCH ---
  "[]",                     // chars: [ ]                      (empty doll)
  "[[]]",                   // chars: [ [ ] ]                  (nested empty doll)
  "[a[b[c]d]e]",            // chars: [ a [ b [ c ] d ] e ]    (3 levels deep)
  "[reef[kelp]moss[finch]]", // chars: [ r e e f [ k e l p ] m o s s [ f i n c h ] ]  (two sibling nested dolls)
  "[~[~]~~]",               // chars: [ ~[ ~] ~~ ]             (body is: escaped-[, escaped-], escaped-tilde)
  "[q]",                    // chars: [ q ]
  "[wxy]",                  // chars: [ w x y ]
  "[a[b]c]",                // chars: [ a [ b ] c ]            (one nested doll among plain chars)
  "[ ]",                    // chars: [ (space) ]
  "[[][]]",                 // chars: [ [ ] [ ] ]             (two empty child dolls as siblings)
  "[open sky]",             // chars: [ o p e n (space) s k y ]
  // --- must be classified REJECT ---
  "[a[b]",                  // chars: [ a [ b ]               (inner doll closes; outer doll never closes)
  "[a[b[c]]",               // chars: [ a [ b [ c ] ]         (three opens, only two closes)
  "[q]tail",                // chars: [ q ] t a i l           (trailing text after a complete doll)
  "top[q]",                 // chars: t o p [ q ]              (leading text before the doll)
  "[a~b]",                  // chars: [ a ~b ]                (tilde escapes 'b', not an escapable char)
  "[]]",                    // chars: [ ] ]                   (extra close after a complete doll)
  "",                       // chars: (empty string, no doll at all)
  "[a~]",                   // chars: [ a ~]                  (tilde escapes the ']', so the doll is never actually closed)
  "wxy",                    // chars: w x y                   (no doll markers at all)
  "[",                      // chars: [                       (single unterminated open)
  "[q]]",                   // chars: [ q ] ]                 (closed doll then a stray extra ']')
  "[[a]",                   // chars: [ [ a ]                 (inner doll closes; outer stays open)
  "z[q]",                   // chars: z [ q ]                 (leading char before an otherwise valid doll)
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
  ["[a[b]", false],    // chars: [ a [ b ]  (unclosed outer doll) -> REJECT
  ["[a~~]", true],     // chars: [ a ~~ ]  (escaped tilde, then close) -> ACCEPT
  ["[a~]", false],     // chars: [ a ~]  (tilde escapes ']', doll unterminated) -> REJECT
  ["[[a]]", true],     // chars: [ [ a ] ]               -> ACCEPT
];
```

## Constraints

- Plain JavaScript, no dependencies, single file.
- `validate` must never throw, must handle arbitrary nesting depth
  (do not hardcode a maximum), and must never rely on a single
  top-level regular expression as the sole matching mechanism.
- The file must end with `module.exports = { validate }`; the judge's
  harness requires it.
