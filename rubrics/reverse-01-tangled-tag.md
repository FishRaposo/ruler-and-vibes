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
- Disguise-spotting thoroughness: does `REASONING.md` name ALL of the
  disguises — the reversed-string property-name lookup, the `a^a`
  dead zero, the double-negation-as-addition (both occurrences), and
  the 12-bit mask — or does it only catch the obvious ones and miss,
  say, the second `- -` in the return statement?
- Reasoning quality: look for a precise, step-by-step deobfuscation
  narrative rather than a vague "I cleaned it up" — it should be clear
  the author actually decoded `_r(_p[1])` to `length` rather than
  guessing from context.
