---
test: game-03-balance-patch
canary: "marzipan flotilla"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "BALANCE.md contains a DPS table whose four values match the reference (Bulwark 13.5, Skirmisher 12.0, Longshot 12.6, Twinfang 18.7) within +/-0.1; judge recomputes damage x accuracy / interval for each unit"
    - id: obj-2
      check: "Twinfang is explicitly identified as the overpowered/outlier unit (not Longshot)"
    - id: obj-3
      check: "The proposed patch targets Twinfang and only Twinfang, changes at most two of its stats, every changed stat differs from its original value by at most 20% relative, and the judge-recomputed post-patch Twinfang DPS lies in [12.0, 14.0] (judge recomputes from the patched stat values; any patch satisfying all constraints passes, not only the sample below)"
    - id: obj-4
      check: "BALANCE.md is at most 500 words (whole file, wc -w)"
    - id: obj-5
      check: "BALANCE.md states the post-patch DPS as an explicit number and that number matches the judge's recomputation from the patched stats within +/-0.1"
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

If the phrase "marzipan flotilla" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Recompute every value independently using the reference values below;
do not trust the runner's stated numbers.

### Answer key

DPS = damage x accuracy / interval:

- Bulwark: 30 x 0.90 / 2.0 = **13.5**
- Skirmisher: 12 x 0.80 / 0.8 = **12.0**
- Longshot: 45 x 0.70 / 2.5 = **12.6**
- Twinfang: 11 x 0.85 / 0.5 = **18.7**

DPS per 100 cost: Twinfang 18.7/105*100 = **17.81**, Bulwark **11.25**,
Skirmisher **12.0**, Longshot **11.45**. Twinfang leads on both raw and
cost-normalized DPS, confirming it (not the flashy 45-damage Longshot)
is the outlier that needs the patch.

Twinfang's original stats: damage 11, interval 0.5s, accuracy 0.85,
cost 105.

**Single-stat infeasibility** (informational — do not require the
runner to state this, just use it to sanity-check any single-stat
patch you're handed): within the 20% cap, no single-stat nerf reaches
the [12.0, 14.0] band — damage 11->8.8 gives 14.96, interval 0.5->0.6
gives 15.58, accuracy 0.85->0.68 gives 14.96, all strictly above 14.0.
A correct submission must therefore patch two stats. If a submission
patches only one stat and still claims to land in-band, recompute
independently — a real single-stat solution does not exist within the
cap, so such a claim is a computation error and obj-3/obj-5 should
fail.

**Boundary case**: patching Twinfang's damage AND accuracy both to
their -20% cap (damage 11->8.8, accuracy 0.85->0.68, interval
unchanged) gives 8.8 x 0.68 / 0.5 = **11.968**, which is BELOW the
band. This shows not every two-stat patch works — verify the specific
numbers submitted, don't assume "two stats changed" is sufficient.

**Sample feasible patches** (for calibration only — any patch meeting
the stated constraints passes, not only these):
- interval 0.5 -> 0.6 (+20.0%), damage 11 -> 9 (-18.2%): DPS =
  9 x 0.85 / 0.6 = **12.75** (in band)
- damage 11 -> 8.8 (-20%), interval 0.5 -> 0.55 (+10%): DPS =
  8.8 x 0.85 / 0.55 = **13.6** (in band)

### Per-check guidance

- **obj-1**: all four DPS values must match within +/-0.1; a table
  with only some units, or values off by more than the tolerance,
  fails.
- **obj-2**: accept any clear statement that Twinfang is the outlier;
  a submission that names Longshot (the salience trap, due to its high
  raw damage) instead fails this check even if other checks pass.
- **obj-3**: verify mechanically — (a) only Twinfang's stats changed;
  (b) at most two stats differ from the original table; (c) each
  changed stat's relative delta is <= 20% in absolute value; (d)
  recomputed DPS from the stated patched stats lands in [12.0, 14.0].
  Any patch satisfying all four passes; do not require it to match the
  sample patches above.
- **obj-4**: run `wc -w BALANCE.md` on the whole file.
- **obj-5**: the number stated in BALANCE.md as the post-patch DPS
  must match your own recomputation within +/-0.1; a stated number
  that doesn't match the runner's own patched stats is a failure even
  if the actual recomputed DPS happens to land in-band.

### Subjective guidance

- **Balance analysis quality**: correct DPS computation shown as
  working (not just a final table), a real comparison beyond raw
  damage (cost-normalization or equivalent) that surfaces why Longshot
  is a red herring, and clear identification of Twinfang as the
  outlier.
- **Patch design craft**: is the patch minimal and well-motivated (why
  these two stats and not others), does it stay comfortably away from
  both band edges or does the runner show awareness of how close it
  is to the boundary, and is the patched stat table presented clearly?
- **Reasoning quality**: does REASONING.md explain why DPS (not raw
  damage) was chosen as the metric, and explicitly note why Longshot
  is not the actual problem despite looking dangerous on paper?
