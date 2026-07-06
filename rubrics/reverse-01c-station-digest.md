---
test: reverse-01c-station-digest
canary: "greenshank dace"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node -e \"console.log(require('./clean.js').tag('cirrus'))\"` prints exactly `21809`"
    - id: obj-2
      check: "Judge pastes the original q7 (below) beside clean.js and runs both on all 5 reference vectors — outputs are identical between q7 and clean.js on every vector: `''`->0, `'dew'`->843, `'cirrus'`->21809, `'Fog7'`->19526, `'The damp grey morning'`->10645"
    - id: obj-3
      check: "clean.js contains no double-minus token (neither `- -` nor `-  -` with any amount of inner whitespace) anywhere, and contains none of the literal substrings `_u(`, `_q[`, `tAedoCrahc`, `htgnel` (judge greps the file)"
    - id: obj-4
      check: "clean.js, run with `node clean.js`, prints one line per reference vector in the exact `INPUT => RESULT` format and order specified in the test file"
    - id: obj-5
      check: "REASONING.md explicitly states the return value is the 15-bit rolling hash plus 11 times the string length (the x11-length term must be named, not just present in code)"
    - id: obj-6
      check: "REASONING.md correctly identifies the `- -` construct as disguised addition (subtracting a negated value is the same as adding it; any clearly-worded equivalent statement is accepted)"
  subjective:
    - id: sub-quality
      name: "Readability of the reconstruction"
      weight: 0.4
    - id: sub-craft
      name: "Disguise-spotting thoroughness"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `reverse-01-tangled-tag` (same construct, fresh surface).

If the phrase "greenshank dace" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

- The original obfuscated routine, for side-by-side comparison:

  ```js
  var _q=['tAedoCrahc','htgnel'];
  function _u(x){return x.split('').reverse().join('')}
  function q7(s){
    var b=0x2C;
    var h=b^b;
    for(var i=0;i<s[_u(_q[1])];i++){
      var c=s[_u(_q[0])](i);
      h=((h<<4)- -c)^(c>>2);
      h=h&0x7FFF;
    }
    return h- -((s[_u(_q[1])]*11)|0);
  }
  ```

  Ground truth reading: `_q[0]` reversed spells `charCodeAt`, `_q[1]`
  reversed spells `length` — the whole `_u(_q[...])` dance is just
  fetching those two property names indirectly. `b^b` is always 0 (a
  disguised zero-initialization of `h`). Each character's code `c` is
  folded into `h` via `h = ((h << 4) + c) ^ (c >> 2)` (the `- -c` is
  addition — subtracting a negated operand — not subtraction), masked to
  15 bits (`& 0x7FFF`) every iteration, and the final return adds
  `11 * s.length` (again via `- -(...)`, disguised addition). A clean
  equivalent:

  ```js
  function tag(s) {
    var h = 0;
    for (var i = 0; i < s.length; i++) {
      var c = s.charCodeAt(i);
      h = ((h << 4) + c) ^ (c >> 2);
      h = h & 0x7FFF;
    }
    return h + 11 * s.length;
  }
  ```

- Reference vectors (node v24.16.0-verified, q7 and the clean
  reimplementation agree on all of them): `""` -> 0, `"dew"` -> 843,
  `"cirrus"` -> 21809, `"Fog7"` -> 19526, `"The damp grey morning"` ->
  10645. A spare held-back vector the rubric keeps in reserve:
  `"zz"` -> 1722 (use it if you suspect a submission got lucky on the 5
  published vectors — verified this always agrees with the correct
  reading; note it happens to coincide with the dropped-mask misreading,
  so it is not the vector to lean on for that specific variant — the
  published vectors already catch that one).
- Equivalence check is well-posed: four plausible wrong rewrites were
  tested against these vectors and every one is caught on every published
  non-empty vector (several are caught even by `"dew"` alone):
  - Misreading `- -c` as literal subtraction (`h - c` instead of
    `h + c`, and the final term as subtraction too) — wrong on every
    non-empty vector (`"cirrus"` gives 10927, not 21809).
  - Dropping the `& 0x7FFF` mask — wrong on every non-empty published
    vector (`"cirrus"` gives 135025969, not 21809); the reserved `"zz"`
    happens to still match at 1722 by coincidence for that short input,
    which is why it is a spare rather than a discriminator here.
  - Flipping `c >> 2` to `c << 2` — wrong on every non-empty vector
    (`"cirrus"` gives 32145).
  - Dropping the `+ 11 * s.length` tail — wrong on every non-empty vector
    (`"cirrus"` gives 21743, not 21809).
  If a submission's `clean.js` matches `q7` on all 5 reference vectors,
  treat obj-2 as passed; if you want extra confidence, also try `"zz"`
  (expect 1722).
- Verify obj-1 and obj-2 by actually running both functions with `node`,
  e.g.:
  `node -e "function _u(x){return x.split('').reverse().join('')} var _q=['tAedoCrahc','htgnel']; function q7(s){var b=0x2C;var h=b^b;for(var i=0;i<s[_u(_q[1])];i++){var c=s[_u(_q[0])](i);h=((h<<4)- -c)^(c>>2);h=h&0x7FFF;}return h- -((s[_u(_q[1])]*11)|0);} console.log(q7('dew'), q7('cirrus'), q7('Fog7'), q7('The damp grey morning'), q7(''))"`
  should print `843 21809 19526 10645 0`; compare against
  `require('./clean.js').tag` on the same inputs.
- Readability of the reconstruction: reward clear naming (`tag`, `h`, `c`
  or better), no leftover indirection, straightforward control flow.
  Penalize a "clean" file that just renames `_u`/`_q` but keeps the
  reversal indirection alive, or that keeps the double-negation style
  even with different variable names.
- Disguise-spotting thoroughness: does `REASONING.md` name ALL of the
  disguises — the reversed-string property-name lookup, the `b^b` dead
  zero, the double-negation-as-addition (both occurrences), and the
  15-bit mask — or does it only catch the obvious ones and miss, say, the
  second `- -` in the return statement?
- Reasoning quality: look for a precise, step-by-step deobfuscation
  narrative rather than a vague "I cleaned it up" — it should be clear
  the author actually decoded `_u(_q[1])` to `length` rather than
  guessing from context.
- PASS/FAIL exemplars for the two prose-decidable checks (obj-5 names the
  x11-length tail and 15-bit hash; obj-6 names `- -` as addition). Accept
  any clearly-worded equivalent; these are illustrative, not verbatim
  requirements.
  - obj-5 PASS: "the result is the 15-bit rolling hash plus eleven times
    the length" / "returns the masked hash, then adds 11 * s.length" /
    "final value = rolling digest (& 0x7FFF) + 11·(number of characters)".
  - obj-5 FAIL: "returns a hash of the string" (tail unnamed) / "adds a
    multiple of the length" (multiplier 11 not stated) / silence on the
    trailing `+ 11 * s.length` term entirely.
  - obj-6 PASS: "`- -c` subtracts a negated value, which is just adding
    `c`" / "the double minus is disguised addition" / "`h - -c` equals
    `h + c`, so it is an add, not a subtract".
  - obj-6 FAIL: "the code subtracts the character code" (read literally
    as subtraction) / "there is a minus operation on `c`" (no equivalence
    to addition drawn) / no mention of the `- -` construct at all.
