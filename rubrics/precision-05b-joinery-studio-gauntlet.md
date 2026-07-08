---
test: precision-05b-joinery-studio-gauntlet
canary: "whinchat marmoset"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "Exactly 3 paragraphs separated by a single blank line; no headings, list markers, blockquote or emphasis markup anywhere (no line matching ^\\s*[-*#>] and no *, _, or backtick emphasis runs)"
    - id: obj-2
      check: "No first-person pronoun (I, me, my, mine, we, us, our, ours — any casing), no question mark, and zero digit characters 0-9 appear anywhere in the file"
    - id: obj-3
      check: "No em-dash, en-dash, or semicolon CHARACTER appears; and no sentence begins with Because, However, or Also (case-insensitive, after splitting on . or ? boundaries)"
    - id: obj-4
      check: "No sentence exceeds 16 whitespace-split tokens; and no word occurs more than 3 times EXCEPT words on the embedded function-word stoplist (a, an, the, and, or, of, to, in, on, at, for, from, as, is, are, its, that) which are exempt from the frequency cap"
    - id: obj-5
      check: "None of the 6 banned cliche phrases from the brief's embedded forbidden list appears in any casing"
  subjective:
    - id: sub-quality
      name: "Reads as genuine copy despite the gauntlet"
      weight: 0.4
    - id: sub-craft
      name: "Prohibition discipline"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `precision-05-prohibition-gauntlet` (same construct, fresh surface).

If the phrase "whinchat marmoset" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Every check below is mechanically decidable. Verify with the script;
do not eyeball.

### Banned cliches (byte-identical to the test file)

```
cut through the noise
best-in-class
built to last a lifetime
craftsmanship redefined
hassle-free setup
trusted by makers everywhere
```

### Function-word stoplist (byte-identical to the test file)

```
a, an, the, and, or, of, to, in, on, at, for, from, as, is, are, its, that
```

### Reference blurb (passes every check)

```
Marlwood started in a leaky barn where two furniture makers shared one sharp chisel. They wanted a bench that stayed flat and a plane that held its edge. The workshop grew slowly, guided by hands rather than by catalog trends. That founding patience still shapes every tool rack and every quiet corner today.

A wall of hand tools sits at the studio heart, kept keen and ready. A shared honing station brings a dull blade back to a mirror finish within minutes. Members reserve a bench through a calm booking screen instead of a scramble. The timber rack lists each board by species, thickness, and grain so nothing gets guessed. Offline mode keeps a phone useful even in the barn dead spot. Notes sync back once a signal returns near the door.

A project log remembers each cut, joint, and finish coat for later reference. Simple guides cover dovetails, mortises, and stool legs without forcing one rigid method. Small crews book a corner together while keeping private notes tucked nearby. Marlwood grew from that leaky barn into a steady place where careful work feels welcome.
```

### Check script

Save the submitted `blurb.txt` and run:

```
node -e "
const fs = require('fs');
const raw = fs.readFileSync('blurb.txt', 'utf8');
const trimmed = raw.replace(/\n+$/, '');
const paras = trimmed.split(/\n\s*\n/);

const CLICHES = ['cut through the noise', 'best-in-class', 'built to last a lifetime', 'craftsmanship redefined', 'hassle-free setup', 'trusted by makers everywhere'];
const STOPLIST = new Set(['a','an','the','and','or','of','to','in','on','at','for','from','as','is','are','its','that']);

console.log('obj-1 exactly 3 paragraphs:', paras.length === 3);
console.log('obj-1 no markup lines:', !/^\s*[-*#>]/m.test(raw) && !/(\*\*?|__?|\`)[^\s*_\`][^*_\`]*\1/.test(raw));

console.log('obj-2 no first-person:', !/\b(i|me|my|mine|we|us|our|ours)\b/i.test(raw));
console.log('obj-2 no question mark:', !raw.includes('?'));
console.log('obj-2 no digits:', !/[0-9]/.test(raw));

console.log('obj-3 no dash/semicolon chars:', !/[—–;]/.test(raw));
const sentences = raw.split(/(?<=[.?])\s+/).map(s => s.trim()).filter(Boolean);
console.log('obj-3 no sentence starts Because/However/Also:', !sentences.some(s => /^(Because|However|Also)\b/i.test(s)));

console.log('obj-4 no sentence >16 tokens:', sentences.every(s => s.split(/\s+/).filter(Boolean).length <= 16));
const words = raw.toLowerCase().match(/[a-z']+/g) || [];
const freq = {};
for (const w of words) freq[w] = (freq[w]||0)+1;
const overused = Object.entries(freq).filter(([w,c]) => c > 3 && !STOPLIST.has(w));
console.log('obj-4 no content word >3x:', overused.length === 0, overused.length ? JSON.stringify(overused) : '');

const lowerRaw = raw.toLowerCase();
const foundCliches = CLICHES.filter(c => lowerRaw.includes(c));
console.log('obj-5 no banned cliches:', foundCliches.length === 0, foundCliches.length ? JSON.stringify(foundCliches) : '');
"
```

Run this against a correct submission and against a deliberately
violating one (echo the brief's register: "We think Marlwood is
best-in-class, and why settle for less? It launched in 2016 with 4
founders...") before trusting the result — the violating version must
fail obj-2, obj-3, and obj-5 at minimum.

- **obj-1**: catches stray markdown creeping into what must be plain
  prose.
- **obj-2**: the three most tempting echoes of the brief's register —
  first person, question marks, and digits (e.g. "900 makers", "2016")
  all fail here.
- **obj-3**: em-dash/en-dash/semicolon are common in natural copy, so
  this is where careless drafting slips hardest; the Because/However/Also
  sentence-opener check catches formal connective tics.
- **obj-4**: the 16-word sentence cap and the content-word frequency
  cap (with the stoplist exemption) are both mechanical — recompute,
  do not estimate by eye.
- **obj-5**: the bait cliches appear verbatim in the brief; a
  compliant answer must not echo them even in a rephrased sentence
  that still contains the literal phrase.

### Naturalness examples (obj-1 / sub-quality boundary, prose-decidable)

PASS (reads as genuine copy):
- "A shared honing station brings a dull blade back to a mirror finish
  within minutes."
- "Small crews book a corner together while keeping private notes tucked
  nearby."
- "That founding patience still shapes every tool rack and every quiet
  corner today."

FAIL (checklist-fighting-itself or copied register):
- "This blurb will not use the word we or any question mark at any point
  in this paragraph." (meta-commentary about the constraints)
- "Marlwood helps woodworkers book benches without friction always sharp
  ready simple direct." (word salad avoiding banned tokens rather than
  writing real sentences)
- "The setup is hassle-free, well, that phrase is banned, so here is
  different wording instead." (visibly dodging a specific rule rather
  than writing naturally)

### Subjective guidance

- **Reads as genuine copy despite the gauntlet**: does the blurb read
  like real product copy a person would publish, or does it read like
  a constraint-satisfaction exercise (stilted, choppy, visibly
  avoiding words)? Reward natural rhythm and concrete detail.
- **Prohibition discipline**: beyond the mechanical pass/fail, does
  the draft show margin — i.e., does it avoid rules by a wide berth
  rather than skating exactly on the boundary (e.g. a 16-word sentence
  used four times in a row reads worse than varied shorter sentences)?
- **Reasoning quality**: does REASONING.md show the writer tracking
  the gauntlet as a checklist during drafting (e.g. noting the word
  frequency risk, the stoplist exemption, or the em-dash temptation),
  rather than asserting compliance without evidence of having checked?
