---
test: game-03c-spellspire-turret
canary: "webcap dipper"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "BALANCE.md contains an effective-output table whose four values match the reference (Emberpike 11.7, Frostcoil 12.6, Stormlance 12.0, Voidspar 19.8) within +/-0.1; judge recomputes potency x attunement / cooldown for each turret"
    - id: obj-2
      check: "Voidspar is explicitly identified as the overpowered/outlier turret (not Stormlance)"
    - id: obj-3
      check: "The proposed patch targets Voidspar and only Voidspar, changes at most two of its stats, every changed stat differs from its original value by at most 20% relative, and the judge-recomputed post-patch Voidspar output lies in [11.5, 13.5] (judge recomputes from the patched stat values; any patch satisfying all constraints passes, not only the sample below)"
    - id: obj-4
      check: "BALANCE.md is at most 500 words (whole file, wc -w)"
    - id: obj-5
      check: "BALANCE.md states the post-patch output as an explicit number and that number matches the judge's recomputation from the patched stats within +/-0.1"
  subjective:
    - id: sub-quality
      name: "Balance analysis quality"
      weight: 0.4
    - id: sub-craft
      name: "Patch design craft"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `game-03-balance-patch` (same construct, fresh surface).

If the phrase "webcap dipper" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

Recompute every value independently using the reference values below;
do not trust the runner's stated numbers.

### Answer key

output = potency x attunement / cooldown:

- Emberpike: 26 x 0.90 / 2.0 = **11.7**
- Frostcoil: 14 x 0.72 / 0.8 = **12.6**
- Stormlance: 52 x 0.60 / 2.6 = **12.0**
- Voidspar: 11 x 0.90 / 0.5 = **19.8**

Output per 100 essence: Voidspar 19.8/100*100 = **19.80**, Frostcoil
**13.26**, Stormlance **10.0**, Emberpike **9.0**. Voidspar leads on both
raw and cost-normalized output, confirming it (not the flashy 52-potency
Stormlance) is the outlier that needs the patch.

Voidspar's original stats: potency 11, cooldown 0.5s, attunement 0.90,
essence 100.

**Single-stat infeasibility** (informational — do not require the
runner to state this, just use it to sanity-check any single-stat
patch you're handed): within the 20% cap, no single-stat nerf reaches
the [11.5, 13.5] band — potency 11->8.8 gives 15.84, cooldown 0.5->0.6
gives 16.5, attunement 0.90->0.72 gives 15.84, all strictly above 13.5.
A correct submission must therefore patch two stats. If a submission
patches only one stat and still claims to land in-band, recompute
independently — a real single-stat solution does not exist within the
cap, so such a claim is a computation error and obj-3/obj-5 should
fail.

**Boundary case**: patching Voidspar's potency to its -20% cap
(11->8.8) AND cooldown up only +10% (0.5->0.55), attunement unchanged,
gives 8.8 x 0.90 / 0.55 = **14.4**, which is ABOVE the band. This shows
not every two-stat patch works — verify the specific numbers submitted,
don't assume "two stats changed" is sufficient.

**Sample feasible patches** (for calibration only — any patch meeting
the stated constraints passes, not only these):
- potency 11 -> 9 (-18.2%), cooldown 0.5 -> 0.6 (+20.0%): output =
  9 x 0.90 / 0.6 = **13.5** (in band)
- cooldown 0.5 -> 0.6 (+20.0%), attunement 0.90 -> 0.72 (-20%): output =
  11 x 0.72 / 0.6 = **13.2** (in band)

### Per-check guidance

- **obj-1**: all four output values must match within +/-0.1; a table
  with only some turrets, or values off by more than the tolerance,
  fails.
- **obj-2**: accept any clear statement that Voidspar is the outlier;
  a submission that names Stormlance (the salience trap, due to its high
  raw potency) instead fails this check even if other checks pass.
- **obj-3**: verify mechanically — (a) only Voidspar's stats changed;
  (b) at most two stats differ from the original table; (c) each
  changed stat's relative delta is <= 20% in absolute value; (d)
  recomputed output from the stated patched stats lands in [11.5, 13.5].
  Any patch satisfying all four passes; do not require it to match the
  sample patches above.
- **obj-4**: run `wc -w BALANCE.md` on the whole file.
- **obj-5**: the number stated in BALANCE.md as the post-patch output
  must match your own recomputation within +/-0.1; a stated number
  that doesn't match the runner's own patched stats is a failure even
  if the actual recomputed output happens to land in-band.

### Subjective guidance

- **Balance analysis quality**: correct output computation shown as
  working (not just a final table), a real comparison beyond raw
  potency (essence-normalization or equivalent) that surfaces why
  Stormlance is a red herring, and clear identification of Voidspar as
  the outlier.
- **Patch design craft**: is the patch minimal and well-motivated (why
  these two stats and not others), does it stay comfortably away from
  both band edges or does the runner show awareness of how close it
  is to the boundary, and is the patched stat table presented clearly?
- **Reasoning quality**: does REASONING.md explain why effective output
  (not raw potency) was chosen as the metric, and explicitly note why
  Stormlance is not the actual problem despite looking dangerous on
  paper?
