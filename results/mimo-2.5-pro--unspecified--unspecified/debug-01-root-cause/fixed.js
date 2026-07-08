function orderTotal(order) {
  var total = 0;
  for (var i = 0; i < order.items.length; i++) {
    var it = order.items[i];
    total += it.price * (it.qty || 1);
  }
  var subtotal = total;
  if (total > 200) {
    total = total - (total - 200) * 0.1;
  }
  if (subtotal >= 100) {
    total += 0;
  } else {
    total += 12;
  }
  for (var j = 0; j < order.items.length; j++) {
    if (order.items[j].wrap) total += 3;
  }
  return Math.round(total * 100) / 100;
}

module.exports = { orderTotal };

var tests = [
  { input: {items:[{price:50,qty:1}]}, expected: 62, name: 'single item under 100' },
  { input: {items:[{price:120,qty:1}]}, expected: 120, name: 'single item 100-200' },
  { input: {items:[{price:150,qty:2}]}, expected: 275, name: 'over 200 with discount' },
  { input: {items:[{price:100,qty:1},{price:20,qty:5,wrap:true}]}, expected: 225, name: 'wrap + free shipping' },
  { input: {items:[{price:100,qty:1}]}, expected: 100, name: 'exactly 100 threshold' },
];

for (var t = 0; t < tests.length; t++) {
  var result = orderTotal(tests[t].input);
  var pass = result === tests[t].expected;
  console.log((pass ? 'PASS' : 'FAIL') + ' ' + tests[t].name + ': got ' + result + ' expected ' + tests[t].expected);
}
