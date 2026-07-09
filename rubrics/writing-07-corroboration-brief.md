---
test: writing-07-corroboration-brief
canary: "hollow dialpost"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "brief.md contains three clearly labeled sections corresponding to Corroborated, Conflicting, and Single-sourced (or equivalent unambiguous headings), each populated with at least one item"
    - id: obj-2
      check: "The affected-units conflict is placed in the Conflicting section with all three source values represented (4,000 / 4,200 / ~4,000, i.e. 'about four thousand') and is NOT stated anywhere as a single settled number"
    - id: obj-3
      check: "The injuries/complaints contradiction is surfaced as a conflict, not reported as 'no injuries' — the brief flags that Operations reports none while Field logs two complaints"
    - id: obj-4
      check: "The supplier-substitution claim is identified as single-sourced (attributed to the Field memo only), not presented as corroborated fact"
    - id: obj-5
      check: "brief.md whole-file word count is at most 400, verified with wc -w, and every factual claim in the brief is attributed to at least one of the three named memos (Operations, Finance, Field)"
  subjective:
    - id: sub-quality
      name: "Reconciliation accuracy and source-attribution discipline"
      weight: 0.4
    - id: sub-craft
      name: "Brief structure and scannability under the length cap"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Reconciliation accuracy and source-attribution discipline
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Brief structure and scannability under the length cap
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "hollow dialpost" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Frozen classification key (author-verified against the three memo
texts):

**Triple-corroborated** (stated independently in all three memos):
- 2 of the 5 June batch codes (C and D) are affected. Operations:
  "2 of the 5 batch codes... (batches C and D)"; Finance: "2 of the 5
  codes from June" / "Recall covers 2 of the 5 June batch codes
  only"; Field: "2-of-5 batch codes (C and D)."

**Conflicting** (each memo gives a different value or position):
- Affected units: Operations ~4,200 ("approximately 4,200"), Finance
  4,000 ("a figure of 4,000... treat 4,000 as the working number"),
  Field ~4,000 ("about four thousand units"). None of these three
  values is authoritative; the brief must not silently pick one and
  present it as settled.
- Injuries/complaints: Operations states "No customer injuries have
  been reported" (through the returns hotline); Field logs "two minor
  complaints" (describing a loose seal, no injury in either case).
  These are not flatly contradictory if read carefully (Field's
  complaints are explicitly non-injury), but Operations' "no
  injuries" framing and Field's complaint log are still a genuine
  cross-team conflict/gap that must be flagged as such — a brief that
  simply states "no injuries reported" and drops Field's two
  complaints has failed to surface the conflict. Finance explicitly
  disclaims visibility into this data.

**Single-sourced** (appears in exactly one memo):
- Supplier substitution mid-run without a change order — Field only.
  Neither Operations nor Finance mentions a supplier change anywhere.
- Recall region scope (North and Central only; South unaffected) —
  Operations only. Neither Finance nor Field mentions distribution
  regions.

Example phrasings (apply the same standard to equivalent wordings):

- **obj-2 (units conflict)** — PASS: "Affected units: reported
  variously as ~4,200 (Operations), 4,000 (Finance), and 'about four
  thousand' (Field) — not yet reconciled." PASS: "Estimates of affected
  units diverge across the three memos (4,200 / 4,000 / ~4,000); the
  discrepancy is unresolved and flagged, not averaged." FAIL (settled as fact):
  "Approximately 4,000 units are affected." FAIL (drops two of the
  three values): "Operations estimates 4,200 units affected" with no
  mention of Finance's or Field's figures anywhere in the brief.
- **obj-3 (injuries conflict)** — PASS: "Operations reports no
  injuries via the hotline; Field has logged two minor complaints
  (no injury) not yet reflected in that count — this gap needs
  closing before any public statement." PASS: "Two field complaints
  sit outside Operations' 'no injuries' hotline count; the brief surfaces
  the discrepancy rather than asserting either as settled." FAIL: "No customer injuries
  have been reported." (states Operations' claim as the brief's own
  settled fact, omitting Field's complaints) FAIL: omits the
  complaints entirely from every section of the brief.
- **obj-4 (supplier single-sourced)** — PASS: "Single-sourced (Field
  only): a mid-run supplier substitution for the seal component,
  reported without a formal change order." PASS: "The seal-supplier
  swap appears only in the Field memo; the brief lists it under
  single-source items, not corroborated findings." FAIL: "The supplier was
  switched mid-run" listed in the Corroborated section. FAIL: omits
  the supplier detail from the brief entirely (it must appear,
  correctly classified, not just correctly excluded from
  Corroborated).

- **Reconciliation accuracy and source-attribution discipline**:
  reward a brief that gets every item into the right bucket per the
  key above, attributes every claim to a named memo, and never
  collapses a conflict into a false single answer. Penalize any
  invented "resolution" of a conflict the source memos do not
  actually resolve.
- **Brief structure and scannability under the length cap**: reward
  a brief that a busy reader could scan in seconds — three sections
  clearly separated, one line or short bullet per item, no filler.
- **Reasoning quality**: does the model's process show it read all
  three memos before classifying anything, explicitly cross-checked
  the injuries claim against Field's complaint log rather than
  trusting Operations' confident framing, and correctly separated the
  two single-sourced items from the triple-corroborated batch-code
  fact?
