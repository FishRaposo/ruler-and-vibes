// GreenTile Garden DAG — verify.js
// Computes P(R=1), P(K=1), P(R=1,K=1), P(R=1)*P(K=1)

const P_S1 = 0.5;
const P_S0 = 0.5;

const P_R1_given_S1 = 0.8;
const P_R1_given_S0 = 0.1;

const P_K1_given_S1 = 0.1;
const P_K1_given_S0 = 0.7;

// P(R=1) = P(R=1|S=1)*P(S=1) + P(R=1|S=0)*P(S=0)
const P_R1 = P_R1_given_S1 * P_S1 + P_R1_given_S0 * P_S0;

// P(K=1) = P(K=1|S=1)*P(S=1) + P(K=1|S=0)*P(S=0)
const P_K1 = P_K1_given_S1 * P_S1 + P_K1_given_S0 * P_S0;

// P(R=1, K=1) = sum over S of P(R=1|S)*P(K=1|S)*P(S)
const P_R1K1 = P_R1_given_S1 * P_K1_given_S1 * P_S1
             + P_R1_given_S0 * P_K1_given_S0 * P_S0;

const P_product = P_R1 * P_K1;

console.log(`P(R=1) = ${P_R1}`);
console.log(`P(K=1) = ${P_K1}`);
console.log(`P(R=1, K=1) = ${P_R1K1}`);
console.log(`P(R=1) * P(K=1) = ${P_product}`);
