# causal-01-garden-dag — deepseek-v4-pro-max-reasoning--unspecified--unspecified

**Judged by:** grok-4.5 on 2026-07-08

## Integrity
Clean. Manifest lists only the test file. No canary ("opal onyx").

## Objective checks
- obj-1 ((a) S confounder; R,K NOT marginally independent): PASS — states S confounds and “NOT marginally independent”.
- obj-2 ((b) independent given S; fork R←S→K blocked): PASS — conditions on S blocks the fork.
- obj-3 ((c) adjust {S}; backdoor R←S→K→W): PASS — minimal set {S}, path named.
- obj-4 ((d) W collider; conditioning opens R–K association): PASS — collider bias / Berkson stated.
- obj-5 (`node verify.js` 0.45, 0.40, 0.075, 0.18): PASS — ran; float print 0.399…/0.07500… equal those values; product 0.18.

## Subjective criteria
- sub-quality (Structural causal reasoning): 10/10 — all four verdicts correct with mechanisms (fork vs collider open/close; backdoor set {S} only).
- sub-craft (Path justifications + verify.js): 9/10 — paths written as R←S→K and R→W←K; verify.js uses law of total probability with labeled CPT constants (float noise only in print).
- sub-reasoning (Reasoning quality): 7/10 — REASONING focuses on CPT arithmetic and conditional independence for the joint; does not restate the fork-vs-collider conditioning asymmetry that ANSWERS.md handles well.

## Verdict
Strong causal answers and correct numerical verification of marginal dependence (0.075 ≠ 0.18); REASONING is more computation-focused than structural.
