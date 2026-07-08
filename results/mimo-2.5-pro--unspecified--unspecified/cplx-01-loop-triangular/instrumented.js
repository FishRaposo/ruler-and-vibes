function stepCost(n) {
  let steps = 0;
  for (let i = 1; i <= n; i++) {
    for (let j = i; j <= n; j++) {
      steps++;
    }
  }
  return steps;
}

module.exports = { stepCost };

const pinned = [1, 5, 10, 50, 100];
for (const n of pinned) {
  console.log(`n=${n} steps=${stepCost(n)}`);
}
