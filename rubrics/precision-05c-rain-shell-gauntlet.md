---
test: precision-05c-rain-shell-gauntlet
canary: "oriel colobus"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "Exactly 3 paragraphs separated by a single blank line; no headings, list markers, blockquote or emphasis markup anywhere (no line matching ^\\s*[-*#>] and no *, _, or backtick emphasis runs)"
    - id: obj-2
      check: "No second-person pronoun (you, your, yours, you're — any casing), no exclamation mark, and zero digit characters 0-9 appear anywhere in the file"
    - id: obj-3
      check: "No em-dash, en-dash, or semicolon CHARACTER appears; and no sentence begins with Plus, Also, or Then (case-insensitive, after splitting on . or ? boundaries)"
    - id: obj-4
      check: "No sentence exceeds 17 whitespace-split tokens; and no word occurs more than 3 times EXCEPT words on the embedded function-word stoplist (a, an, the, and, or, of, to, in, on, for, from, with, into, is, are, it, its, as, at) which are exempt from the frequency cap"
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

Every check below is mechanically decidable. Verify with the script;
do not eyeball. If the phrase "oriel colobus" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### Banned cliches (byte-identical to the test file)

```
best in class
take it to the next level
built to last a lifetime
adventure awaits
push your limits
gear up for greatness
```

### Function-word stoplist (byte-identical to the test file)

```
a, an, the, and, or, of, to, in, on, for, from, with, into, is, are, it, its, as, at
```

### Reference blurb (passes every check)

```
Skarra began on a ridge where a cheap shell soaked through within the first hour. The founders wanted a jacket that treated rain as ordinary weather rather than an emergency. Every seam is taped by hand, so water finds no quiet gap to sneak inside. That stubborn focus on dry shoulders still guides the design today.

The fabric stays soft and refuses to rustle when an arm swings past a shrub. Pit vents open along each side, letting steam escape during a steep push uphill. A storm hood cinches close around the face without stealing any part of the view. The whole thing folds into its own chest pocket, small enough to vanish inside a daypack. Cold fingers can work the pulls even while a squall keeps hammering the shell.

Woven from reclaimed bottles, the outer layer shrugs off grit that would fray a lesser weave. Nothing here chases fashion, and nothing feels flimsy against a hard gust off the water. Skarra earns its keep on long, grey walks where turning back is never really an option.
```

### Check script

Save the submitted `blurb.txt` and run:

```
node -e "
const fs = require('fs');
const raw = fs.readFileSync('blurb.txt', 'utf8');
const trimmed = raw.replace(/\n+$/, '');
const paras = trimmed.split(/\n\s*\n/);

const CLICHES = ['best in class', 'take it to the next level', 'built to last a lifetime', 'adventure awaits', 'push your limits', 'gear up for greatness'];
const STOPLIST = new Set(['a','an','the','and','or','of','to','in','on','for','from','with','into','is','are','it','its','as','at']);

console.log('obj-1 exactly 3 paragraphs:', paras.length === 3);
console.log('obj-1 no markup lines:', !/^\s*[-*#>]/m.test(raw) && !/(\*\*?|__?|\`)[^\s*_\`][^*_\`]*\1/.test(raw));

console.log('obj-2 no second-person:', !/\b(you|your|yours|you're)\b/i.test(raw));
console.log('obj-2 no exclamation:', !raw.includes('!'));
console.log('obj-2 no digits:', !/[0-9]/.test(raw));

console.log('obj-3 no dash/semicolon chars:', !/[—–;]/.test(raw));
const sentences = raw.split(/(?<=[.?])\s+/).map(s => s.trim()).filter(Boolean);
console.log('obj-3 no sentence starts Plus/Also/Then:', !sentences.some(s => /^(Plus|Also|Then)\b/i.test(s)));

console.log('obj-4 no sentence >17 tokens:', sentences.every(s => s.split(/\s+/).filter(Boolean).length <= 17));
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
violating one (echo the brief's register: "You are going to love Skarra!
We built it in 2018 with 4 friends...") before trusting the result — the
violating version must fail obj-2, obj-3, and obj-5 at minimum.

- **obj-1**: catches stray markdown creeping into what must be plain
  prose.
- **obj-2**: the three most tempting echoes of the brief's register —
  second person, exclamation marks, and digits (e.g. "25,000 hikers",
  "2018") all fail here.
- **obj-3**: em-dash/en-dash/semicolon are common in natural copy, so
  this is where careless drafting slips hardest; the Plus/Also/Then
  sentence-opener check catches informal connective tics.
- **obj-4**: the 17-word sentence cap and the content-word frequency
  cap (with the stoplist exemption) are both mechanical — recompute,
  do not estimate by eye.
- **obj-5**: the bait cliches appear verbatim in the brief; a
  compliant answer must not echo them even in a rephrased sentence
  that still contains the literal phrase.

### Naturalness examples (obj-1 / sub-quality boundary, prose-decidable)

PASS (reads as genuine copy):
- "Pit vents open along each side, letting steam escape during a steep
  push uphill."
- "Every seam is taped by hand, so water finds no quiet gap to sneak
  inside."
- "Skarra earns its keep on long, grey walks where turning back is
  never really an option."

FAIL (checklist-fighting-itself or copied register):
- "This blurb will not use exclamation marks or the word you at any
  point in these three paragraphs." (meta-commentary about the
  constraints)
- "Skarra keeps rain out fast dry warm quiet light tough reliable
  simple." (word salad avoiding banned tokens rather than writing real
  sentences)
- "The shell is best in class, well, that phrase is off limits, so
  imagine a stronger word instead." (visibly dodging a specific rule
  rather than writing naturally)

### Subjective guidance

- **Reads as genuine copy despite the gauntlet**: does the blurb read
  like real product copy a person would publish, or does it read like
  a constraint-satisfaction exercise (stilted, choppy, visibly
  avoiding words)? Reward natural rhythm and concrete detail.
- **Prohibition discipline**: beyond the mechanical pass/fail, does
  the draft show margin — i.e., does it avoid rules by a wide berth
  rather than skating exactly on the boundary (e.g. a seventeen-word
  sentence used four times in a row reads worse than varied shorter
  sentences)?
- **Reasoning quality**: does REASONING.md show the writer tracking
  the gauntlet as a checklist during drafting (e.g. noting the word
  frequency risk, the stoplist exemption, or the em-dash temptation),
  rather than asserting compliance without evidence of having checked?
