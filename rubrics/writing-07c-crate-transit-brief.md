---
test: writing-07c-crate-transit-brief
canary: "turnpike causeway"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "brief.md contains three clearly labeled sections corresponding to Corroborated, Conflicting, and Single-sourced (or equivalent unambiguous headings), each populated with at least one item"
    - id: obj-2
      check: "The affected-objects conflict is placed in the Conflicting section with all three source values represented (140 / 125 / ~125, i.e. 'about a hundred twenty-five') and is NOT stated anywhere as a single settled number"
    - id: obj-3
      check: "The structural-loss/bracing-flags contradiction is surfaced as a conflict, not reported as 'no structural loss' — the brief flags that Registrar reports none while the Preparation Crew logs two bracing flags"
    - id: obj-4
      check: "The desiccant-supplier-swap claim is identified as single-sourced (attributed to the Preparation Crew memo only), not presented as corroborated fact"
    - id: obj-5
      check: "brief.md whole-file word count is at most 400, verified with wc -w, and every factual claim in the brief is attributed to at least one of the three named memos (Registrar, Risk & Insurance, Preparation Crew)"
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
---

## Judge guidance

Parallel form of `writing-07-corroboration-brief` (same construct, fresh
surface).

If the phrase "turnpike causeway" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Frozen classification key (author-verified against the three memo
texts):

**Triple-corroborated** (stated independently in all three memos):
- 3 of the 9 crate groups on this leg (Groups B, E, and H) show
  humidity-related condition issues. Registrar: "3 of the 9 crate
  groups... (Groups B, E, and H)"; Risk & Insurance: "3 of the 9
  groups on this leg" / "Affected scope remains 3 of the 9 crate
  groups on this leg only"; Preparation Crew: "3-of-9 crate groups
  (B, E, and H)."

**Conflicting** (each memo gives a different value or position):
- Affected objects: Registrar ~140 ("approximately 140"), Risk &
  Insurance 125 ("a figure of 125... treat 125 as the working
  number"), Preparation Crew ~125 ("about a hundred twenty-five
  objects"). None of these three values is authoritative; the brief
  must not silently pick one and present it as settled.
- Structural loss vs. bracing flags: Registrar states "No structural
  loss (total breakage) has been reported" (through the
  condition-report log); Preparation Crew logs "two crates" with
  "loosened corner bracing" (no breakage in either case). These are
  not flatly contradictory if read carefully (the Crew's flags are
  explicitly non-breakage), but Registrar's "no structural loss"
  framing and the Crew's bracing flags are still a genuine cross-team
  conflict/gap that must be flagged as such — a brief that simply
  states "no structural loss reported" and drops the Crew's two
  bracing flags has failed to surface the conflict. Risk & Insurance
  explicitly disclaims visibility into this data.

**Single-sourced** (appears in exactly one memo):
- Desiccant-packet supplier swap mid-shipment without a
  materials-change request — Preparation Crew only. Neither Registrar
  nor Risk & Insurance mentions a supplier change anywhere.
- Shipment-route scope (limited to crates that transited the regional
  consolidation warehouse; direct-to-venue crates unaffected) —
  Registrar only. Neither Risk & Insurance nor Preparation Crew
  mentions shipment routing.

Example phrasings (apply the same standard to equivalent wordings):

- **obj-2 (objects conflict)** — PASS: "Affected objects: reported
  variously as ~140 (Registrar), 125 (Risk & Insurance), and 'about a
  hundred twenty-five' (Preparation Crew) — not yet reconciled." PASS:
  "Estimates of affected objects diverge across the three memos (140 /
  125 / ~125); the discrepancy is unresolved and flagged, not
  averaged." FAIL (settled as fact): "Approximately 125 objects are
  affected." FAIL (drops two of the three values): "Registrar
  estimates 140 objects affected" with no mention of Risk &
  Insurance's or Preparation Crew's figures anywhere in the brief.
- **obj-3 (structural-loss conflict)** — PASS: "Registrar reports no
  structural loss through the condition-report log; the Preparation
  Crew has flagged two crates with loosened bracing (no breakage) not
  yet reflected in that log — this gap needs closing before any
  external claim is filed." PASS: "Two bracing flags from the
  Preparation Crew sit outside Registrar's 'no structural loss'
  condition-report count; the brief surfaces the discrepancy rather
  than asserting either as settled." FAIL: "No structural loss has
  been reported." (states Registrar's claim as the brief's own
  settled fact, omitting the Preparation Crew's bracing flags) FAIL:
  omits the bracing flags entirely from every section of the brief.
- **obj-4 (desiccant-supplier single-sourced)** — PASS:
  "Single-sourced (Preparation Crew only): a mid-shipment
  desiccant-supplier swap for the crating material, reported without
  a formal materials-change request." PASS: "The desiccant-supplier
  swap appears only in the Preparation Crew memo; the brief lists it
  under single-source items, not corroborated findings." FAIL: "The
  desiccant supplier was swapped mid-shipment" listed in the
  Corroborated section. FAIL: omits the desiccant-supplier detail
  from the brief entirely (it must appear, correctly classified, not
  just correctly excluded from Corroborated).

- **Reconciliation accuracy and source-attribution discipline**:
  reward a brief that gets every item into the right bucket per the
  key above, attributes every claim to a named memo, and never
  collapses a conflict into a false single answer. Penalize any
  invented "resolution" of a conflict the source memos do not
  actually resolve.
- **Brief structure and scannability under the length cap**: reward
  a brief that a busy reader could scan in seconds — three sections
  clearly separated, one line or short bullet per item, no filler —
  not a wall of undifferentiated prose.
- **Reasoning quality**: does the model's process show it read all
  three memos before classifying anything, explicitly cross-checked
  the structural-loss claim against the Preparation Crew's bracing
  flags rather than trusting Registrar's confident framing, and
  correctly separated the two single-sourced items from the
  triple-corroborated crate-group fact?
