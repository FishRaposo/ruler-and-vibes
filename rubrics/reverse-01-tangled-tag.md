---
test: reverse-01-tangled-tag
canary: "fennel trapeze ballad"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node -e \"console.log(require('./clean.js').tag('cab'))\"` prints exactly `1648`"
    - id: obj-2
      check: "Judge pastes the original z9 (below) beside clean.js and runs both on all 5 reference vectors — outputs are identical between z9 and clean.js on every vector: `''`->0, `'cab'`->1648, `'lantern'`->3426, `'Zip9'`->2369, `'The quick brown fox'`->2505"
    - id: obj-3
      check: "clean.js contains no double-minus token (neither `- -` nor `-  -` with any amount of inner whitespace) anywhere, and contains none of the literal substrings `_r(`, `_p[`, `tAedoCrahc`, `htgnel` (judge greps the file)"
    - id: obj-4
      check: "clean.js, run with `node clean.js`, prints one line per reference vector in the exact `INPUT => RESULT` format and order specified in the test file"
    - id: obj-5
      check: "REASONING.md explicitly states the return value is the 12-bit rolling hash plus 7 times the string length (the x7-length term must be named, not just present in code)"
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

If the phrase "fennel trapeze ballad" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- The original obfuscated routine, for side-by-side comparison:

  ```js
  var _p=['tAedoCrahc','htgnel'];
  function _r(x){return x.split('').reverse().join('')}
  function z9(s){
    var a=0x15;
    var t=a^a;
    for(var i=0;i<s[_r(_p[1])];i++){
      var c=s[_r(_p[0])](i);
      t=((t<<3)- -c)^(c>>1);
      t=t&0xFFF;
    }
    return t- -((s[_r(_p[1])]*7)|0);
  }
  ```

  Ground truth reading: `_p[0]` reversed spells `charCodeAt`, `_p[1]`
  reversed spells `length` — the whole `_r(_p[...])` dance is just
  fetching those two property names indirectly. `a^a` is always 0 (a
  disguised zero-initialization of `t`). Each character's code `c` is
  folded into `t` via `t = ((t << 3) + c) ^ (c >> 1)` (the `- -c` is
  addition — subtracting a negated operand — not subtraction), masked
  to 12 bits (`& 0xFFF`) every iteration, and the final return adds
  `7 * s.length` (again via `- -(...)`, disguised addition). A clean
  equivalent:

  ```js
  function tag(s) {
    var t = 0;
    for (var i = 0; i < s.length; i++) {
      var c = s.charCodeAt(i);
      t = ((t << 3) + c) ^ (c >> 1);
      t = t & 0xFFF;
    }
    return t + 7 * s.length;
  }
  ```

- Reference vectors (node v24.16.0-verified, z9 and the clean
  reimplementation agree on all of them): `""` -> 0, `"cab"` -> 1648,
  `"lantern"` -> 3426, `"Zip9"` -> 2369, `"The quick brown fox"` -> 2505.
  A spare held-back vector the rubric keeps in reserve: `"aa"` -> 743
  (use it if you suspect a submission got lucky on the 5 published
  vectors — verified this always agrees with the correct reading).
- Equivalence check is well-posed: four plausible wrong rewrites were
  tested against these vectors and every one is caught (some are
  caught even by `"cab"` alone):
  - Misreading `- -c` as literal subtraction (`t - c` instead of
    `t + c`, and the final term as subtraction too) — wrong on every
    non-empty vector (`"cab"` gives 1554, not 1648).
  - Dropping the `& 0xFFF` mask — wrong on every non-empty vector
    except the coincidental single case of `"aa"` (which still matches
    at 743 by chance for that specific short input; every published
    vector still diverges, e.g. `"cab"` gives 5744).
  - Flipping `c >> 1` to `c << 1` — wrong on every non-empty vector
    (`"cab"` gives 2707).
  - Dropping the `+ 7 * s.length` tail — wrong on every non-empty
    vector (`"cab"` gives 1627, not 1648).
  If a submission's `clean.js` matches `z9` on all 5 reference vectors,
  treat obj-2 as passed; if you want extra confidence, also try `"aa"`
  (expect 743) since it separately catches the dropped-mask variant.
- Verify obj-1 and obj-2 by actually running both functions with
  `node`, e.g.:
  `node -e "function _r(x){return x.split('').reverse().join('')} var _p=['tAedoCrahc','htgnel']; function z9(s){var a=0x15;var t=a^a;for(var i=0;i<s[_r(_p[1])];i++){var c=s[_r(_p[0])](i);t=((t<<3)- -c)^(c>>1);t=t&0xFFF;}return t- -((s[_r(_p[1])]*7)|0);} console.log(z9('cab'), z9('lantern'), z9('Zip9'), z9('The quick brown fox'), z9(''))"`
  should print `1648 3426 2369 2505 0`; compare against
  `require('./clean.js').tag` on the same inputs.
- Readability of the reconstruction: reward clear naming (`tag`, `t`,
  `c` or better), no leftover indirection, straightforward control
  flow. Penalize a "clean" file that just renames `_r`/`_p` but keeps
  the reversal indirection alive, or that keeps the double-negation
  style even with different variable names.
  - PASS phrasings: "renamed everything to `tag`/`t`/`c`, replaced the
    reversed lookups with direct `s.length` and `s.charCodeAt(i)`, loop
    reads top-to-bottom"; "no indirection or double-negation survives —
    the fold is a plain `((t<<3)+c)^(c>>1)`"; "control flow is a single
    straight `for` with an explicit `t & 0xFFF` mask, nothing disguised".
  - FAIL phrasings: "kept `_r(_p[1])` for the length lookup, only renamed
    the outer function"; "still writes `- -c` for the add, just with a
    nicer variable name"; "left `a^a` in place as the initializer instead
    of writing `0`".
- Disguise-spotting thoroughness: does `REASONING.md` name ALL of the
  disguises — the reversed-string property-name lookup, the `a^a`
  dead zero, the double-negation-as-addition (both occurrences), and
  the 12-bit mask — or does it only catch the obvious ones and miss,
  say, the second `- -` in the return statement?
  - PASS phrasings: "lists all four tricks: reversed `charCodeAt`/`length`
    names, `a^a` = 0, both `- -` additions, and the `& 0xFFF` per-loop
    mask"; "explicitly notes the return-statement `- -` is the *second*
    disguised add, not just the one in the loop"; "identifies `a^a` as a
    decoy that always yields zero regardless of `a`".
  - FAIL phrasings: "mentions only the reversed property names and stops
    there"; "spots the loop `- -c` but never addresses the tail `- -`";
    "calls `a^a` 'some constant' without noting it is always 0".
- Reasoning quality: look for a precise, step-by-step deobfuscation
  narrative rather than a vague "I cleaned it up" — it should be clear
  the author actually decoded `_r(_p[1])` to `length` rather than
  guessing from context.
  - PASS phrasings: "reverses `'htgnel'` character-by-character to reach
    `'length'` and shows the work"; "traces one loop iteration with a
    concrete `c` to confirm the fold and mask"; "explains why `a^a`
    forces the seed to 0 regardless of `a`".
  - FAIL phrasings: "asserts the answer with no derivation"; "says 'it
    hashes the string' without decoding the reversed names"; "guesses
    `length` from surrounding context rather than reversing the literal".
- PASS/FAIL exemplars for the two prose-decidable checks (obj-5 names the
  x7-length tail and 12-bit hash; obj-6 names `- -` as addition). Accept
  any clearly-worded equivalent; these are illustrative, not verbatim
  requirements.
  - obj-5 PASS: "the result is the 12-bit rolling hash plus seven times
    the length" / "returns the masked hash, then adds 7 * s.length" /
    "final value = rolling digest (& 0xFFF) + 7·(number of characters)".
  - obj-5 FAIL: "returns a hash of the string" (tail unnamed) / "adds a
    multiple of the length" (multiplier 7 not stated) / silence on the
    trailing `+ 7 * s.length` term entirely.
  - obj-6 PASS: "`- -c` subtracts a negated value, which is just adding
    `c`" / "the double minus is disguised addition" / "`t - -c` equals
    `t + c`, so it is an add, not a subtract".
  - obj-6 FAIL: "the code subtracts the character code" (read literally
    as subtraction) / "there is a minus operation on `c`" (no equivalence
    to addition drawn) / no mention of the `- -` construct at all.
