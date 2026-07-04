---
id: pat-04-quill-nested-literal
category: formal-patterns
title: Validate the Quill nested literal a regex cannot accept
deliverables:
  - quill.js
---

## Task

The fictional "Quill literal" language cannot be recognized by any
finite regular expression, because it allows arbitrarily deep nesting.
Recognize this and implement a **stateful** validator (e.g. a small
recursive-descent or explicit-stack recognizer) — a single regex
cannot correctly accept this language (it will fail on nesting depth,
and on the escaped-close case described below).

Grammar of a valid whole-string Quill literal (a **GROUP**):

- A group is the character `<`, then a **body**, then the character
  `>`.
- A body is zero or more **units**.
- A unit is one of:
  (a) any single character other than `<`, `>`, or backslash;
  (b) an **escape**: a backslash followed by exactly one of `<`, `>`,
      or backslash (the backslash "consumes" that one following
      character, which then counts as a plain unit, not a
      structural token);
  (c) a **nested group** (the same grammar, recursively, to
      arbitrary depth).
- Groups must be properly balanced and nested. The entire input
  string must be consumed by exactly one top-level group — no leading
  or trailing characters outside it.

Because backslash-escaping is the central discriminator in this test,
**every corpus and vector string below is given with an explicit
character-by-character gloss** (as a code comment) so there is no
ambiguity about which literal characters are intended.

## Deliverables

- `quill.js` — exports `validate(s)` returning `true` or `false`, via
  `module.exports = { validate }`. When run with `node quill.js`, it
  must first print exactly one line per embedded corpus string, in
  the exact order listed, in the format `<input> MATCH` or
  `<input> REJECT`; then it must print exactly one line per embedded
  labeled vector item, in the exact order listed, in the format
  `<input> ACCEPT` or `<input> REJECT`.

Embedded corpus (24 strings) — validate each and print one line per
entry, in this order. Each string is given as a JavaScript string
literal, with a gloss comment spelling out every character (writing
`\<`, `\>`, `\\` etc. to name literal backslash-then-character pairs
where relevant):

```js
const CORPUS = [
  // --- must be classified MATCH ---
  "<>",                     // chars: < >                      (empty group)
  "<<>>",                   // chars: < < > >                  (nested empty group)
  "<a<b<c>d>e>",            // chars: < a < b < c > d > e >    (3 levels deep)
  "<one<two>three<four>>",  // chars: < o n e < t w o > t h r e e < f o u r > >  (two sibling nested groups)
  "<\\<\\>\\\\>",           // chars: < \< \> \\ >             (body is: escaped-<, escaped->, escaped-backslash)
  "<a>",                    // chars: < a >
  "<abc>",                  // chars: < a b c >
  "<a<b>c>",                // chars: < a < b > c >            (one nested group among plain chars)
  "< >",                    // chars: < (space) >
  "<<><>>",                 // chars: < < > < > >              (two empty child groups as siblings)
  "<hello world>",          // chars: < h e l l o (space) w o r l d >
  // --- must be classified REJECT ---
  "<a<b>",                  // chars: < a < b >                (inner group closes; outer group never closes)
  "<a<b<c>>",               // chars: < a < b < c > >          (three opens, only two closes)
  "<a>extra",               // chars: < a > e x t r a          (trailing text after a complete group)
  "pre<a>",                 // chars: p r e < a >               (leading text before the group)
  "<a\\b>",                 // chars: < a \b >                 (backslash escapes 'b', not an escapable char)
  "<>>",                    // chars: < > >                    (extra close after a complete group)
  "",                       // chars: (empty string, no group at all)
  "<a\\>",                  // chars: < a \>                   (backslash escapes the '>', so the group is never actually closed)
  "abc",                    // chars: a b c                    (no group markers at all)
  "<",                      // chars: <                        (single unterminated open)
  "<a>>",                   // chars: < a > >                  (closed group then a stray extra '>')
  "<<a>",                   // chars: < < a >                  (inner group closes; outer stays open)
  "a<b>",                   // chars: a < b >                  (leading char before an otherwise valid group)
];
```

Embedded labeled vector (8 items) — after the corpus, validate each of
these and print one line per entry, in this order:

```js
const VECTOR = [
  ["<>", true],        // chars: < >                     -> ACCEPT
  ["<a<b>c>", true],   // chars: < a < b > c >           -> ACCEPT
  ["<\\<>", true],     // chars: < \< >  (escaped '<' as a plain unit, then close) -> ACCEPT
  ["<a\\b>", false],   // chars: < a \b >  ('b' is not an escapable char) -> REJECT
  ["<a<b>", false],    // chars: < a < b >  (unclosed outer group) -> REJECT
  ["<a\\\\>", true],   // chars: < a \\ >  (escaped backslash, then close) -> ACCEPT
  ["<a\\>", false],    // chars: < a \>  (backslash escapes '>', group unterminated) -> REJECT
  ["<<a>>", true],     // chars: < < a > >  -> ACCEPT
];
```

## Constraints

- Plain JavaScript, no dependencies, single file.
- `validate` must never throw, must handle arbitrary nesting depth
  (do not hardcode a maximum), and must never rely on a single
  top-level regular expression as the sole matching mechanism.
- The file must end with `module.exports = { validate }`; the judge's
  harness requires it.
