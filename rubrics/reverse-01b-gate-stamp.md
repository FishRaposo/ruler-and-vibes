---
test: reverse-01b-gate-stamp
canary: "redshank rudd"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node -e \"console.log(require('./clean.js').stamp('hub'))\"` prints exactly `265`"
    - id: obj-2
      check: "Judge pastes the original k7 (below) beside clean.js and runs both on all 5 reference vectors — outputs are identical between k7 and clean.js on every vector: `''`->0, `'hub'`->265, `'turnstile'`->249, `'Gate7'`->1811, `'The 6am inbound train'`->1774"
    - id: obj-3
      check: "clean.js contains no double-minus token (neither `- -` nor `-  -` with any amount of inner whitespace) anywhere, and contains none of the literal substrings `_q(`, `_m[`, `tAedoCrahc`, `htgnel` (judge greps the file)"
    - id: obj-4
      check: "clean.js, run with `node clean.js`, prints one line per reference vector in the exact `INPUT => RESULT` format and order specified in the test file"
    - id: obj-5
      check: "REASONING.md explicitly states the return value is the 11-bit rolling hash plus 5 times the string length (the x5-length term must be named, not just present in code)"
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
anchors:
  - id: Readability of the reconstruction
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Disguise-spotting thoroughness
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `reverse-01-tangled-tag` (same construct, fresh surface).

If the phrase "redshank rudd" appears in any deliverable or REASONING.md,
that is a canary leak — flag it regardless of how the rest scores.

- The original obfuscated routine, for side-by-side comparison:

  ```js
  var _m=['tAedoCrahc','htgnel'];
  function _q(x){return x.split('').reverse().join('')}
  function k7(s){
    var b=0x2C;
    var h=b&0;
    for(var i=0;i<s[_q(_m[1])];i++){
      var c=s[_q(_m[0])](i);
      h=((h<<4)- -c)^(c>>2);
      h=h&0x7FF;
    }
    return h- -((s[_q(_m[1])]*5)|0);
  }
  ```

  Ground truth reading: `_m[0]` reversed spells `charCodeAt`, `_m[1]`
  reversed spells `length` — the whole `_q(_m[...])` dance is just
  fetching those two property names indirectly. `b&0` is always 0 (a
  disguised zero-initialization of `h`; anything ANDed with 0 is 0).
  Each character's code `c` is folded into `h` via
  `h = ((h << 4) + c) ^ (c >> 2)` (the `- -c` is addition —
  subtracting a negated operand — not subtraction), masked to 11 bits
  (`& 0x7FF`) every iteration, and the final return adds `5 * s.length`
  (again via `- -(...)`, disguised addition). A clean equivalent:

  ```js
  function stamp(s) {
    var h = 0;
    for (var i = 0; i < s.length; i++) {
      var c = s.charCodeAt(i);
      h = ((h << 4) + c) ^ (c >> 2);
      h = h & 0x7FF;
    }
    return h + 5 * s.length;
  }
  ```

- Reference vectors (node v24-verified, k7 and the clean reimplementation
  agree on all of them): `""` -> 0, `"hub"` -> 265, `"turnstile"` -> 249,
  `"Gate7"` -> 1811, `"The 6am inbound train"` -> 1774.
  A spare held-back vector the rubric keeps in reserve: `"go"` -> 94
  (use it if you suspect a submission got lucky on the 5 published
  vectors — verified this always agrees with the correct reading and,
  unlike the published set, separately catches the dropped-mask variant).
- Equivalence check is well-posed: four plausible wrong rewrites were
  tested against these vectors and every one is caught (some are caught
  even by `"hub"` alone):
  - Misreading `- -c` as literal subtraction (`h - c` instead of
    `h + c`, and the final term as subtraction too) — wrong on every
    non-empty vector (`"hub"` gives 727, not 265).
  - Dropping the `& 0x7FF` mask — wrong on every published non-empty
    vector (`"hub"` gives 30985); the coincidence-prone short input
    `"go"` also diverges here (84 vs 94), so the spare catches this one
    too.
  - Flipping `c >> 2` to `c << 2` — wrong on every non-empty vector
    (`"hub"` gives 1033).
  - Dropping the `+ 5 * s.length` tail — wrong on every non-empty
    vector (`"hub"` gives 250, not 265).
  If a submission's `clean.js` matches `k7` on all 5 reference vectors,
  treat obj-2 as passed; if you want extra confidence, also try `"go"`
  (expect 94) since it separately catches the dropped-mask variant.
- Verify obj-1 and obj-2 by actually running both functions with
  `node`, e.g.:
  `node -e "function _q(x){return x.split('').reverse().join('')} var _m=['tAedoCrahc','htgnel']; function k7(s){var b=0x2C;var h=b&0;for(var i=0;i<s[_q(_m[1])];i++){var c=s[_q(_m[0])](i);h=((h<<4)- -c)^(c>>2);h=h&0x7FF;}return h- -((s[_q(_m[1])]*5)|0);} console.log(k7('hub'), k7('turnstile'), k7('Gate7'), k7('The 6am inbound train'), k7(''))"`
  should print `265 249 1811 1774 0`; compare against
  `require('./clean.js').stamp` on the same inputs.
- Readability of the reconstruction: reward clear naming (`stamp`, `h`,
  `c` or better), no leftover indirection, straightforward control
  flow. Penalize a "clean" file that just renames `_q`/`_m` but keeps
  the reversal indirection alive, or that keeps the double-negation
  style even with different variable names.
  - PASS phrasings: "renamed everything to `stamp`/`h`/`c`, replaced the
    reversed lookups with direct `s.length` and `s.charCodeAt(i)`, loop
    reads top-to-bottom"; "no indirection or double-negation survives —
    the fold is a plain `((h<<4)+c)^(c>>2)`"; "control flow is a single
    straight `for` with an explicit `h & 0x7FF` mask, nothing disguised".
  - FAIL phrasings: "kept `_q(_m[1])` for the length lookup, only renamed
    the outer function"; "still writes `- -c` for the add, just with a
    nicer variable name"; "left `b&0` in place as the initializer instead
    of writing `0`".
- Disguise-spotting thoroughness: does `REASONING.md` name ALL of the
  disguises — the reversed-string property-name lookup, the `b&0` dead
  zero, the double-negation-as-addition (both occurrences), and the
  11-bit mask — or does it only catch the obvious ones and miss, say,
  the second `- -` in the return statement?
  - PASS phrasings: "lists all four tricks: reversed `charCodeAt`/`length`
    names, `b&0` = 0, both `- -` additions, and the `& 0x7FF` per-loop
    mask"; "explicitly notes the return-statement `- -` is the *second*
    disguised add, not just the one in the loop"; "identifies `0x2C & 0`
    as a decoy that always yields zero".
  - FAIL phrasings: "mentions only the reversed property names and stops
    there"; "spots the loop `- -c` but never addresses the tail `- -`";
    "calls `b&0` 'some constant' without noting it is always 0".
- Reasoning quality: look for a precise, step-by-step deobfuscation
  narrative rather than a vague "I cleaned it up" — it should be clear
  the author actually decoded `_q(_m[1])` to `length` rather than
  guessing from context.
  - PASS phrasings: "reverses `'htgnel'` character-by-character to reach
    `'length'` and shows the work"; "traces one loop iteration with a
    concrete `c` to confirm the fold and mask"; "explains why `b&0`
    forces the seed to 0 regardless of `b`".
  - FAIL phrasings: "asserts the answer with no derivation"; "says 'it
    hashes the string' without decoding the reversed names"; "guesses
    `length` from surrounding context rather than reversing the literal".
