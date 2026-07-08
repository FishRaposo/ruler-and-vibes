---
test: edit-01b-recycling-style-card
canary: "trogon zander"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "corrected.txt contains 'nightly backup', 'backup server', and 'new backup schedule' (all three rule-1 instances), and 'back-up' returns zero matches file-wide (rule 1, paragraphs 1-2)"
    - id: obj-2
      check: "corrected.txt contains 'depot coordinator' and 'coordinator rota', and 'co-ordinator' returns zero matches file-wide (rule 2, two instances: paragraphs 1 and 2)"
    - id: obj-3
      check: "corrected.txt contains 'nine neighborhoods' and 'four volunteers', and neither '9 neighborhoods' nor '4 volunteers' appears (rule 3, two instances: paragraphs 1 and 2)"
    - id: obj-4
      check: "corrected.txt contains the exact reference string 'by phone, app, or web form' — the serial comma inserted before the final item (rule 4, paragraph 2)"
    - id: obj-5
      check: "The control sentence 'Six new drop-off stations opened this month, and each one received a signage kit, a scale, and a bin liner.' appears in corrected.txt byte-for-byte identical to the source (no over-correction of an already-compliant sentence)"
  subjective:
    - id: sub-quality
      name: "Correctness and completeness of style-rule application"
      weight: 0.4
    - id: sub-craft
      name: "Editorial restraint and clean, unobtrusive corrections"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `edit-01-style-card` (same construct, fresh surface).

Frozen required-edit list (author-computed and verified against the
seeded passage; 8 edits total across the 4 rules):

1. **Rule 1 (backup, one word):** paragraph 1, "nightly back-up of the
   sorting logs" -> "nightly backup of the sorting logs"
2. **Rule 1:** paragraph 1, "back-up server for the compost data" ->
   "backup server for the compost data"
3. **Rule 1:** paragraph 2, "new back-up schedule" -> "new backup
   schedule"
4. **Rule 2 (coordinator, no hyphen):** paragraph 1, "depot
   co-ordinator" -> "depot coordinator"
5. **Rule 2:** paragraph 2, "co-ordinator rota" -> "coordinator rota"
6. **Rule 3 (spell out numbers under 10):** paragraph 1, "9
   neighborhoods" -> "nine neighborhoods"
7. **Rule 3:** paragraph 2, "4 volunteers" -> "four volunteers"
8. **Rule 4 (serial comma):** paragraph 2, "by phone, app or web form"
   -> "by phone, app, or web form"

Already-compliant material that must be left untouched: "Six new
drop-off stations opened this month, and each one received a signage
kit, a scale, and a bin liner." already spells out the number and
already carries the serial comma. Any change to this sentence is an
over-correction.

Objective checks are mechanically decidable from `corrected.txt`
alone. A standalone Node checker that reproduces all five is:

```
node - "$OUT/corrected.txt" <<'EOF'
const fs = require('fs');
const t = fs.readFileSync(process.argv[2], 'utf8');
const has = (s) => t.includes(s);
const count = (s) => t.split(s).length - 1;
const control = "Six new drop-off stations opened this month, and each one received a signage kit, a scale, and a bin liner.";
const checks = [
  ["obj-1", has("nightly backup") && has("backup server") && has("new backup schedule") && count("back-up") === 0],
  ["obj-2", has("depot coordinator") && has("coordinator rota") && count("co-ordinator") === 0],
  ["obj-3", has("nine neighborhoods") && has("four volunteers") && !has("9 neighborhoods") && !has("4 volunteers")],
  ["obj-4", has("by phone, app, or web form")],
  ["obj-5", has(control)],
];
let pass = 0;
for (const [id, ok] of checks) { console.log((ok ? "PASS " : "FAIL ") + id); if (ok) pass++; }
console.log(pass + "/" + checks.length + " objective checks passed");
process.exit(pass === checks.length ? 0 : 1);
EOF
```

(Substitute the deliverable's path for `$OUT/corrected.txt`.)

Example phrasings for the prose-located comparison checks (apply the
same standard to equivalent wordings):

- **obj-1 (backup, one word)** — PASS: "a nightly backup
  of the sorting logs," "the backup server for the compost data," "the
  new backup schedule" all present; zero remaining hyphenated
  instances anywhere in the file. FAIL: "nightly back-up" still
  present unchanged; or a model that fixes two of the three instances
  but leaves one hyphenated (e.g. "back-up schedule" lingers) — the
  zero-match sweep catches this even if a single instance looks fixed
  in isolation; or "backup" written as two words "back up" (still not
  the licensed single closed form).
- **obj-2 (coordinator, not co-ordinator)** — PASS: "the depot
  coordinator," "the coordinator rota." FAIL: "depot co-ordinator"
  unchanged; or corrected to "coordinator" in one spot while the other
  keeps the hyphen (the file-wide zero-match check catches partial
  fixes); or "coordinater" / any misspelling introduced while
  de-hyphenating.
- **obj-3 (spell out numbers under 10)** — PASS: "covers nine
  neighborhoods," "asked for four volunteers." FAIL: "9 neighborhoods"
  or "4 volunteers" still present in digit form; or "nine
  neighborhoods" fixed while "4 volunteers" is missed.
- **obj-4 (serial comma)** — PASS: "by phone, app, or web form"
  exactly. FAIL: "by phone, app or web form" left without the comma;
  or a comma inserted in the wrong place, e.g. "by phone app, or web
  form."
- **obj-5 (restraint on the control sentence)** — PASS: "Six new
  drop-off stations opened this month, and each one received a signage
  kit, a scale, and a bin liner." reproduced exactly. FAIL: "Six"
  changed to "6" (there is no rule against already-spelled-out
  numbers, so this is an invented edit); or the serial comma stripped
  to "a signage kit, a scale and a bin liner" (removing a comma the
  rule requires, on a sentence that already complied).

If the phrase "trogon zander" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- **Correctness and completeness of style-rule application**: reward
  a copyedit that makes exactly the 8 required edits (across the 5
  checks above), no more and no less. A single missed instance or a
  single edit not licensed by the style card should weigh meaningfully
  against this dimension beyond its share of the objective score.
- **Editorial restraint and clean, unobtrusive corrections**: reward
  a result indistinguishable from a careful human editor who touched
  only what the four rules require — no rewording, no reordering, no
  "fixing" of the already-compliant control sentence, no stylistic
  flourishes layered on top of the mechanical pass.
- **Reasoning quality**: does the model's process show it checked the
  passage against each of the 4 rules individually, identified every
  instance of each violation (not just the first), and explicitly
  recognized which sentences already complied and needed no change?
