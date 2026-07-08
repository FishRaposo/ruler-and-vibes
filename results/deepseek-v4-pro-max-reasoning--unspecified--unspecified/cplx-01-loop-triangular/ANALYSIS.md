The exact closed-form step count is `n(n+1)/2`. For each i from 1 to n, the inner loop runs (n - i + 1) times. Summing over i: Σ(n - i + 1) from i=1 to n = n + (n-1) + ... + 1 = n(n+1)/2.

The asymptotic class is Θ(n²).

Derivation: the inner loop runs from j=i to n (inclusive), so for a given i it executes n-i+1 times. Summing this arithmetic series over i=1..n gives the triangular numbers formula.
