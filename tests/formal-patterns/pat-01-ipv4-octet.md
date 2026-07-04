---
id: pat-01-ipv4-octet
category: formal-patterns
title: Accept exactly canonical IPv4, reject the near-misses
deliverables:
  - validator.js
---

## Task

The fictional "Larkfield" network uses node addresses that look like
IPv4 dotted-quad addresses but follow a strict canonical grammar.
Implement a validator that accepts a string if and only if it is a
canonical **Larkfield node address**:

- Exactly four segments separated by single `.` characters — nothing
  more, nothing less.
- Each segment is a decimal integer in the range `0`-`255` inclusive.
- No segment may have a leading zero, **except** the single digit `0`
  itself (so `0` is valid, `00`, `01`, `04` are not).
- The string must contain nothing else: no surrounding whitespace, no
  trailing dot, no stray characters of any kind. The entire string
  must be consumed by the four segments and their three separating
  dots.

Do not accept segments above `255` (e.g. `256`, `999`), and do not
accept leading-zero segments. A plain regex like `\d{1,3}(\.\d{1,3}){3}`
is NOT sufficient on its own because it cannot express the numeric
range `0`-`255` or reject leading zeros — reason carefully about how
you enforce both constraints.

## Deliverables

- `validator.js` — exports `validate(addr)` returning `true` or
  `false`, via `module.exports = { validate }`. When run with
  `node validator.js`, it must print exactly one line per embedded
  corpus string below, in the exact order listed, in the exact format
  `<input> MATCH` or `<input> REJECT`.

Embedded corpus — validate each and print one line per entry, in this
order:

```js
const CORPUS = [
  // must be classified MATCH
  "0.0.0.0",
  "255.255.255.255",
  "1.2.3.4",
  "192.168.0.1",
  "8.8.8.8",
  "10.0.0.255",
  "127.0.0.1",
  "172.16.254.1",
  "100.64.0.0",
  "203.0.113.9",
  // must be classified REJECT
  "256.0.0.1",
  "1.2.3.256",
  "1.2.3.400",
  "999.999.999.999",
  "01.2.3.4",
  "1.2.3.04",
  "00.0.0.0",
  "192.168.0.1 ",
  " 1.2.3.4",
  "1.2.3.4.",
  "1.2.3",
  "1.2.3.4.5",
  "1..3.4",
  "1.2.3.4a",
  "1.2.3.-1",
];
```

## Constraints

- Plain JavaScript, no dependencies, single file.
- The file must end with `module.exports = { validate }`; the judge's
  harness requires it.
