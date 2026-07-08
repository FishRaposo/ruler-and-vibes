---
test: game-03b-harvester-yield
canary: "milkcap chough"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "BALANCE.md contains a yield table whose four values match the reference (Brackhaul 7.79, Dustmaw 7.5, Palerift 7.37, Corehound 10.67) within +/-0.1; judge recomputes ore_per_scoop x purity / cycle_time for each ship"
    - id: obj-2
      check: "Corehound is explicitly identified as the overpowered/outlier ship (not Palerift)"
    - id: obj-3
      check: "The proposed patch targets Corehound and only Corehound, changes at most two of its stats, every changed stat differs from its original value by at most 20% relative, and the judge-recomputed post-patch Corehound yield lies in [6.9, 8.0] (judge recomputes from the patched stat values; any patch satisfying all constraints passes, not only the sample below)"
    - id: obj-4
      check: "BALANCE.md is at most 500 words (whole file, wc -w)"
    - id: obj-5
      check: "BALANCE.md states the post-patch yield as an explicit number and that number matches the judge's recomputation from the patched stats within +/-0.1"
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

If the phrase "milkcap chough" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Recompute every value independently using the reference values below;
do not trust the runner's stated numbers.

### Answer key

Yield = ore_per_scoop x purity / cycle_time:

- Brackhaul: 22 x 0.85 / 2.4 = **7.79**
- Dustmaw: 9 x 0.75 / 0.9 = **7.50**
- Palerift: 34 x 0.65 / 3.0 = **7.37**
- Corehound: 8 x 0.80 / 0.6 = **10.67**

Yield per 100 upkeep: Corehound 10.67/115*100 = **9.28**, Dustmaw
**6.82**, Palerift **6.14**, Brackhaul **5.57**. Corehound leads on both
raw and upkeep-normalized yield, confirming it (not the flashy 34-scoop
Palerift) is the outlier that needs the patch. Palerift's big raw scoop
is a red herring: its slow 3.0 s cycle and 0.65 purity make it the
*lowest*-yield ship in the fleet (7.37).

Corehound's original stats: ore_per_scoop 8, cycle 0.6s, purity 0.80,
upkeep 115.

**Single-stat infeasibility** (informational — do not require the
runner to state this, just use it to sanity-check any single-stat
patch you're handed): within the 20% cap, no single-stat nerf reaches
the [6.9, 8.0] band — ore 8->6.4 gives 8.53, cycle 0.6->0.72 gives
8.89, purity 0.80->0.64 gives 8.53, all strictly above 8.0. A
correct submission must therefore patch two stats. If a submission
patches only one stat and still claims to land in-band, recompute
independently — a real single-stat solution does not exist within the
cap, so such a claim is a computation error and obj-3/obj-5 should
fail.

**Boundary case**: patching Corehound's ore AND purity both to their
-20% cap (ore 8->6.4, purity 0.80->0.64, cycle unchanged) gives
6.4 x 0.64 / 0.6 = **6.83**, which is BELOW the band. This shows not
every two-stat patch works — verify the specific numbers submitted,
don't assume "two stats changed" is sufficient.

**Sample feasible patches** (for calibration only — any patch meeting
the stated constraints passes, not only these):
- cycle 0.6 -> 0.72 (+20.0%), ore 8 -> 6.8 (-15.0%): yield =
  6.8 x 0.80 / 0.72 = **7.56** (in band)
- cycle 0.6 -> 0.72 (+20.0%), purity 0.80 -> 0.70 (-12.5%): yield =
  8 x 0.70 / 0.72 = **7.78** (in band)

### Per-check guidance

- **obj-1**: all four yield values must match within +/-0.1; a table
  with only some ships, or values off by more than the tolerance,
  fails.
- **obj-2**: accept any clear statement that Corehound is the outlier;
  a submission that names Palerift (the salience trap, due to its high
  raw ore-per-scoop) instead fails this check even if other checks
  pass.
- **obj-3**: verify mechanically — (a) only Corehound's stats changed;
  (b) at most two stats differ from the original table; (c) each
  changed stat's relative delta is <= 20% in absolute value; (d)
  recomputed yield from the stated patched stats lands in [6.9, 8.0].
  Any patch satisfying all four passes; do not require it to match the
  sample patches above.
- **obj-4**: run `wc -w BALANCE.md` on the whole file.
- **obj-5**: the number stated in BALANCE.md as the post-patch yield
  must match your own recomputation within +/-0.1; a stated number
  that doesn't match the runner's own patched stats is a failure even
  if the actual recomputed yield happens to land in-band.

### Subjective guidance

- **Balance analysis quality**: correct yield computation shown as
  working (not just a final table), a real comparison beyond raw
  ore-per-scoop (upkeep-normalization or equivalent) that surfaces why
  Palerift is a red herring, and clear identification of Corehound as
  the outlier.
- **Patch design craft**: is the patch minimal and well-motivated (why
  these two stats and not others), does it stay comfortably away from
  both band edges or does the runner show awareness of how close it
  is to the boundary, and is the patched stat table presented clearly?
- **Reasoning quality**: does REASONING.md explain why effective yield
  (not raw ore-per-scoop) was chosen as the metric, and explicitly note
  why Palerift is not the actual problem despite looking dangerous on
  paper?
