function orderTotal(order) {
  var total = 0;
  var preDiscount = 0;
  for (var i = 0; i < order.items.length; i++) {
    var it = order.items[i];
    preDiscount += it.price * (it.qty || 1);
  }
  total = preDiscount;
  if (total > 200) {
    total = total - (total - 200) * 0.1;
  }
  if (preDiscount >= 100) {
    total += 0;
  } else {
    total += 12;
  }
  for (var j = 0; j < order.items.length; j++) {
    if (order.items[j].wrap) total += 3;
  }
  return Math.round(total * 100) / 100;
}

function test(name, order, expected) {
  var result = orderTotal(order);
  var ok = Math.abs(result - expected) < 0.001;
  console.log((ok ? 'PASS' : 'FAIL') + ' - ' + name + ': got ' + result + ' expected ' + expected);
}

test('case 1: single item $50', {items:[{price:50,qty:1}]}, 62);
test('case 2: $120 pre-discount free ship', {items:[{price:120,qty:1}]}, 120);
test('case 3: $300 pre-discount 10% above 200', {items:[{price:150,qty:2}]}, 290);
test('case 4: $200 pre, $100+20*5, gift wrap', {items:[{price:100,qty:1},{price:20,qty:5,wrap:true}]}, 203);
test('case 5: $100 pre-discount free ship border', {items:[{price:100,qty:1}]}, 100);

module.exports = { orderTotal };
