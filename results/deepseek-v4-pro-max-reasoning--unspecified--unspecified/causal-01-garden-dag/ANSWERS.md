### (a)
Season (S) confounds the observed association between Rain (R) and Sprinkler-use (K). There are two paths connecting R and K: R ← S → K (a fork through S) and R → W ← K (a collider at W). With nothing held fixed, both paths are open. Since S influences both R and K, the marginal association between R and K is confounded by S. R and K are NOT marginally independent — the fork through S induces a spurious correlation.

### (b)
Yes, R and K are independent once conditioned on Season (S). Conditioning on S blocks the fork path R ← S → K — S is the common cause, and holding it fixed removes the spurious association between its effects. This is d-separation by blocking the common cause.

### (c)
The minimal adjustment set to identify the causal effect of R on W is {S}. The non-causal path is R ← S → K → W (a backdoor path from R to W through the confounder S and the mediator K). Adjusting for S blocks this backdoor path. Note that K is on the causal pathway from S to W but not from R to W, so we don't need to adjust for K for the R→W effect — but the backdoor R ← S → K → W is blocked by S alone.

### (d)
W is a collider on the path R → W ← K. Two arrows collide at W (R → W and K → W). When we do NOT condition on W, R and K are not associated through this collider path. When we DO condition on W, the collider is activated — conditioning on a collider opens the path and induces a spurious association between R and K. This is the "collider bias" or "Berkson's paradox": two independent causes become associated when you condition on their common effect.
