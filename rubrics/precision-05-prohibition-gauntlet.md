---
test: precision-05-prohibition-gauntlet
canary: "cranberry sundial"
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
      check: "No em-dash, en-dash, or semicolon CHARACTER appears; and no sentence begins with And, But, or So (case-insensitive, after splitting on . or ? boundaries)"
    - id: obj-4
      check: "No sentence exceeds 18 whitespace-split tokens; and no word occurs more than 3 times EXCEPT words on the embedded function-word stoplist (a, an, the, and, or, of, to, in, for, with, without, is, are, it, its, that, this) which are exempt from the frequency cap"
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

Every check below is mechanically decidable. Verify with the script;
do not eyeball. If a submission's REASONING.md or any deliverable
contains the phrase "cranberry sundial", that is a canary leak (the
phrase belongs only in this rubric) — flag it regardless of how the
rest of the checks score.

### Banned cliches (byte-identical to the test file)

```
take your productivity to the next level
seamless experience
game changer
unlock your potential
revolutionize the way you work
join thousands of
```

### Function-word stoplist (byte-identical to the test file)

```
a, an, the, and, or, of, to, in, for, with, without, is, are, it, its, that, this
```

### Reference blurb (passes every check)

```
Notegarden began as a weekend project stitched together from index cards and rubber bands. The founders wanted something closer to paper than to a spreadsheet. Early builds skipped folders entirely and let every note float free until a search box pulled it back. That stubborn simplicity survived rewrite after rewrite, and it still shapes the app today.

Search sits at the center of the design, built to surface a buried memo before frustration sets in. Tags act like loose string tied around related pages. Nothing forces a rigid hierarchy onto ideas that resist one. A writer drafting three overlapping outlines can jump between them without losing a thread. Offline sync keeps a bumpy train ride from breaking that flow. Changes fold quietly back together once a signal returns.

Version history remembers each earlier draft, so a deleted paragraph can wander home again. Templates cover meeting notes, recipes, and travel logs without dictating a rigid structure. Small teams share a folder while keeping private scratch space untouched nearby. Notegarden grew from index cards into a quiet, dependable place where scattered thoughts settle.
```

### Check script

Save the submitted `blurb.txt` and run:

```
node -e "
const fs = require('fs');
const raw = fs.readFileSync('blurb.txt', 'utf8');
const trimmed = raw.replace(/\n+$/, '');
const paras = trimmed.split(/\n\s*\n/);

const CLICHES = ['take your productivity to the next level', 'seamless experience', 'game changer', 'unlock your potential', 'revolutionize the way you work', 'join thousands of'];
const STOPLIST = new Set(['a','an','the','and','or','of','to','in','for','with','without','is','are','it','its','that','this']);

console.log('obj-1 exactly 3 paragraphs:', paras.length === 3);
console.log('obj-1 no markup lines:', !/^\s*[-*#>]/m.test(raw) && !/(\*\*?|__?|\`)[^\s*_\`][^*_\`]*\1/.test(raw));

console.log('obj-2 no second-person:', !/\b(you|your|yours|you're)\b/i.test(raw));
console.log('obj-2 no exclamation:', !raw.includes('!'));
console.log('obj-2 no digits:', !/[0-9]/.test(raw));

console.log('obj-3 no dash/semicolon chars:', !/[—–;]/.test(raw));
const sentences = raw.split(/(?<=[.?])\s+/).map(s => s.trim()).filter(Boolean);
console.log('obj-3 no sentence starts And/But/So:', !sentences.some(s => /^(And|But|So)\b/i.test(s)));

console.log('obj-4 no sentence >18 tokens:', sentences.every(s => s.split(/\s+/).filter(Boolean).length <= 18));
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
violating one (echo the brief's register: "You're going to love
Notegarden! It started as a weekend project with 3 index cards...")
before trusting the result — the violating version must fail obj-2,
obj-3, and obj-5 at minimum.

- **obj-1**: catches stray markdown creeping into what must be plain
  prose.
- **obj-2**: the three most tempting echoes of the brief's register —
  second person, exclamation marks, and digits (e.g. "40,000 users",
  "2019") all fail here.
- **obj-3**: em-dash/en-dash/semicolon are common in natural copy, so
  this is where careless drafting slips hardest; the And/But/So
  sentence-opener check catches informal connective tics.
- **obj-4**: the 18-word sentence cap and the content-word frequency
  cap (with the stoplist exemption) are both mechanical — recompute,
  do not estimate by eye.
- **obj-5**: the bait cliches appear verbatim in the brief; a
  compliant answer must not echo them even in a rephrased sentence
  that still contains the literal phrase.

### Naturalness examples (obj-1 / sub-quality boundary, prose-decidable)

PASS (reads as genuine copy):
- "Search sits at the center of the design, built to surface a buried
  memo before frustration sets in."
- "Small teams share a folder while keeping private scratch space
  untouched nearby."
- "That stubborn simplicity survived rewrite after rewrite, and it
  still shapes the app today."

FAIL (checklist-fighting-itself or copied register):
- "This blurb will not use exclamation marks or the word you at any
  point in this paragraph." (meta-commentary about the constraints)
- "Notegarden helps writers capture ideas without friction always
  fast reliable simple direct." (word salad avoiding banned tokens
  rather than writing real sentences)
- "The app is a game-changer, well, we cannot say that phrase, so
  here is different phrasing instead." (visibly dodging a specific
  rule rather than writing naturally)

### Subjective guidance

- **Reads as genuine copy despite the gauntlet**: does the blurb read
  like real product copy a person would publish, or does it read like
  a constraint-satisfaction exercise (stilted, choppy, visibly
  avoiding words)? Reward natural rhythm and concrete detail.
- **Prohibition discipline**: beyond the mechanical pass/fail, does
  the draft show margin — i.e., does it avoid rules by a wide berth
  rather than skating exactly on the boundary (e.g. an 18-word sentence
  used four times in a row reads worse than varied shorter sentences)?
- **Reasoning quality**: does REASONING.md show the writer tracking
  the gauntlet as a checklist during drafting (e.g. noting the word
  frequency risk, the stoplist exemption, or the em-dash temptation),
  rather than asserting compliance without evidence of having checked?
