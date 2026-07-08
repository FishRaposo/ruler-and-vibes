# Causal Reasoning — GreenTile Garden DAG

## (a) Confounding variable and marginal independence

**S (Season)** confounds the observed association between R (Rain) and K (Sprinkler). Both R and K are effects of S, so any observed correlation between R and K can arise from their shared dependence on S rather than a direct causal link.

R and K are **not** marginally independent. Both are influenced by S, and since S creates a common cause (fork at S), R and K are associated in the marginal distribution. This is confirmed numerically: P(R=1)·P(K=1) = 0.45 × 0.40 = 0.18, but P(R=1, K=1) = 0.11 (see verify.js), so the joint does not factor.

## (b) Independence conditional on S

R and K **are** independent once you condition on S. The only path connecting R and K is R ← S → K, a fork (common cause) path through S. Conditioning on S blocks this path. Since there is no other path between R and K (no direct edge, no collider path), R and K are d-separated given S.

## (c) Minimal adjustment set for causal effect of R on W

The minimal set is **{K}** (Sprinkler). The non-causal (backdoor) path from R to W is:

R ← S → K → W

Adjusting for K blocks this path. After blocking, the only remaining path from R to W is the direct causal path R → W, identifying the causal effect.

(Note: S is also a valid adjustment set, but K is minimal — it blocks the backdoor path at one node closer to W.)

## (d) Collider role of W on R → W ← K

On the path R → W ← K, W is a **collider** (two arrowheads meet at W). A collider blocks the path by default — R and K are independent via this path when W is not conditioned on. However, **conditioning on W opens the collider path**, inducing an association between R and K. This is the "explaining away" effect: if you know the path is wet, learning it rained makes it less likely the sprinkler was on, and vice versa.
