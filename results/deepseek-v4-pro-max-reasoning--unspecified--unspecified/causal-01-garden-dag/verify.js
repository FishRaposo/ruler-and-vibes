// Encode CPTs and compute P(R=1), P(K=1), joint P(R=1 and K=1), product P(R=1)*P(K=1)

function compute() {
  const pS1 = 0.5;
  const pS0 = 0.5;

  const pR1gS1 = 0.8;
  const pR1gS0 = 0.1;
  const pK1gS1 = 0.1;
  const pK1gS0 = 0.7;

  // P(R=1) = P(R=1|S=1)P(S=1) + P(R=1|S=0)P(S=0)
  const pR1 = pR1gS1 * pS1 + pR1gS0 * pS0;

  // P(K=1) = P(K=1|S=1)P(S=1) + P(K=1|S=0)P(S=0)
  const pK1 = pK1gS1 * pS1 + pK1gS0 * pS0;

  // P(R=1 and K=1) = P(R=1 and K=1 | S=1)P(S=1) + P(R=1 and K=1 | S=0)P(S=0)
  // R and K independent given S: P(R,K|S) = P(R|S)*P(K|S)
  const pJoint = pR1gS1 * pK1gS1 * pS1 + pR1gS0 * pK1gS0 * pS0;

  const pProduct = pR1 * pK1;

  console.log('P(R=1) = ' + pR1);
  console.log('P(K=1) = ' + pK1);
  console.log('P(R=1 and K=1) = ' + pJoint);
  console.log('P(R=1)*P(K=1) = ' + pProduct);
}

compute();
