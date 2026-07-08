---
test: edit-01-style-card
canary: "fuchsia begonia"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "corrected.txt contains 'onboarding lead', 'onboarding for the', and 'onboarding checklist' (all three rule-1 instances), and 'on-boarding' returns zero matches file-wide (rule 1, paragraphs 1-2)"
    - id: obj-2
      check: "corrected.txt contains 'email templates' and 'email template library', and 'e-mail' returns zero matches file-wide (rule 2, two instances: paragraphs 1 and 2)"
    - id: obj-3
      check: "corrected.txt contains 'eight departments' and 'three volunteers', and neither '8 departments' nor '3 volunteers' appears (rule 3, two instances: paragraphs 1 and 2)"
    - id: obj-4
      check: "corrected.txt contains the exact reference string 'by email, chat, or phone' — the serial comma inserted before the final item (rule 4, paragraph 2)"
    - id: obj-5
      check: "The control sentence 'Seven new hires joined the roster, and each one received a laptop, a badge, and a mentor.' appears in corrected.txt byte-for-byte identical to the source (no over-correction of an already-compliant sentence)"
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

If the phrase "fuchsia begonia" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Frozen required-edit list (author-computed and verified against the
seeded passage; 7 edits total across the 4 rules):

1. **Rule 1 (onboarding, one word):** paragraph 1, "client
   on-boarding lead" -> "client onboarding lead"
2. **Rule 1:** paragraph 1, "on-boarding for the finance group" ->
   "onboarding for the finance group"
3. **Rule 1:** paragraph 2, "new on-boarding checklist" -> "new
   onboarding checklist"
4. **Rule 2 (email, not e-mail):** paragraph 1, "new e-mail
   templates" -> "new email templates"
5. **Rule 2:** paragraph 2, "e-mail template library" -> "email
   template library"
6. **Rule 3 (spell out numbers under 10):** paragraph 1, "8
   departments" -> "eight departments"
7. **Rule 3:** paragraph 2, "3 volunteers" -> "three volunteers"
8. **Rule 4 (serial comma):** paragraph 2, "by email, chat or phone"
   -> "by email, chat, or phone"

Already-compliant material that must be left untouched: "Seven new
hires joined the roster, and each one received a laptop, a badge, and
a mentor." already spells out the number and already carries the
serial comma. Any change to this sentence is an over-correction.

Example phrasings for the prose-located comparison checks (apply the
same standard to equivalent wordings):

- **obj-1 (onboarding, one word)** — PASS: "the client
  onboarding lead," "onboarding for the finance group," "new
  onboarding checklist" all present; zero remaining hyphenated
  instances anywhere in the file. FAIL: "client on-boarding lead"
  still present unchanged; or a model that fixes two of the three
  instances but leaves one hyphenated (e.g. "on-boarding checklist"
  lingers) — the zero-match sweep catches this even if a single
  instance looks fixed in isolation.
- **obj-2 (email, not e-mail)** — PASS: "the new email templates,"
  "the email template library." FAIL: "e-mail templates" unchanged;
  or corrected to "e-mail" in one spot while the other is fixed (the
  file-wide zero-match check catches partial fixes).
- **obj-3 (spell out numbers under 10)** — PASS: "covers eight
  departments," "asked for three volunteers." FAIL: "8 departments"
  or "3 volunteers" still present in digit form; or "eight
  departments" fixed while "3 volunteers" is missed.
- **obj-4 (serial comma)** — PASS: "by email, chat, or phone" exactly.
  FAIL: "by email, chat or phone" left without the comma; or a comma
  inserted in the wrong place, e.g. "by email chat, or phone."
- **obj-5 (restraint on the control sentence)** — PASS: "Seven new
  hires joined the roster, and each one received a laptop, a badge,
  and a mentor." reproduced exactly. FAIL: "Seven" changed to "7"
  (there is no rule against already-spelled-out numbers, so this is
  an invented edit); or the serial comma stripped to "a laptop, a
  badge and a mentor" (removing a comma the rule requires, on a
  sentence that already complied).

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
