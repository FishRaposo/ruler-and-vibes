---
test: pat-01-ipv4-octet
canary: "badger mongoose"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "`node validator.js` runs without error and prints exactly 25 lines, one per embedded corpus string in listed order, each exactly '<input> MATCH' or '<input> REJECT'"
    - id: obj-2
      check: "All 10 MUST-MATCH strings are classified MATCH: 0.0.0.0, 255.255.255.255, 1.2.3.4, 192.168.0.1, 8.8.8.8, 10.0.0.255, 127.0.0.1, 172.16.254.1, 100.64.0.0, 203.0.113.9 (judge confirms via require('./validator.js').validate on each)"
    - id: obj-3
      check: "All 15 MUST-REJECT strings are classified REJECT, including the range trap (256.0.0.1, 1.2.3.256, 1.2.3.400, 999.999.999.999) and leading-zero trap (01.2.3.4, 1.2.3.04, 00.0.0.0)"
    - id: obj-4
      check: "The whitespace/shape traps reject: '192.168.0.1 ' (trailing space), ' 1.2.3.4' (leading space), '1.2.3.4.' (trailing dot), '1.2.3' (three octets), '1.2.3.4.5' (five octets), '1..3.4' (empty octet), '1.2.3.4a' (trailing junk), '1.2.3.-1' (negative)"
    - id: obj-5
      check: "validator.js exports validate via module.exports = { validate }, is a single dependency-free file, and validate never throws on any of the 25 corpus inputs"
  subjective:
    - id: sub-quality
      name: "Specification fidelity"
      weight: 0.4
    - id: sub-craft
      name: "Validator clarity"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Codename for this test in judge chatter: badger mongoose.

- Answer key, re-implemented and executed under node this session
  against the full 25-string corpus: all 10 MUST-MATCH returned
  `true`, all 15 MUST-REJECT returned `false` (pat01 ALL PASS,
  total=25). Reference logic: split the string on `.`; require
  exactly 4 parts; each part must match `/^\d+$/`; reject if a part's
  length is greater than 1 and its first character is `'0'`; reject
  if the part's numeric value is outside `0`-`255`.
- Exact run command for the judge:
  `node -e "const {validate}=require('./validator.js'); ['0.0.0.0','255.255.255.255','1.2.3.4','192.168.0.1','8.8.8.8','10.0.0.255','127.0.0.1','172.16.254.1','100.64.0.0','203.0.113.9'].forEach(s=>console.log(s,validate(s)))"`
  must print `true` for all 10; the same pattern with the 15
  MUST-REJECT strings (`256.0.0.1`, `1.2.3.256`, `1.2.3.400`,
  `999.999.999.999`, `01.2.3.4`, `1.2.3.04`, `00.0.0.0`,
  `'192.168.0.1 '`, `' 1.2.3.4'`, `'1.2.3.4.'`, `'1.2.3'`,
  `'1.2.3.4.5'`, `'1..3.4'`, `'1.2.3.4a'`, `'1.2.3.-1'`) must print
  `false` for all 15.
- Discriminator trap, re-confirmed this session: the common naive
  regex `/^\d{1,3}(\.\d{1,3}){3}$/` WRONGLY returns `true` for
  `256.0.0.1`, `999.999.999.999`, and `01.2.3.4` (verified this
  session), while correctly rejecting the leading/trailing-space
  traps. A submission whose validator is exactly this regex (or
  equivalent) will fail obj-3 on those three inputs — this is the
  intended discriminator between "looks like an IP" and "is a
  canonical IPv4 address." `'1.2.3.4 '`-style traps are rejected
  correctly by both naive and correct approaches because the trailing
  `' '` breaks the digit-only match on the last segment — do not
  mistake that for evidence of range/leading-zero handling.
- Specification fidelity: does the validator correctly enforce BOTH
  the numeric range (`0`-`255`, catching `256`+ and `999`) AND the
  leading-zero rule (rejecting `01`, `04`, `00` but accepting bare
  `0`)? A submission that gets one dimension right and the other
  wrong (e.g. correct range but accepts leading zeros, or vice versa)
  should score low here even if it happens to pass most of the listed
  corpus by coincidence — check its handling of untested but
  spec-implied cases, e.g. `009` or `250` vs `260`.
- Validator clarity: reward a straightforward split-and-check
  structure (or an equally clear alternative) with obvious mapping
  from each grammar rule to a check, over a single dense regex or
  nested ternary that obscures which rule is being enforced.
- Reasoning quality: judge from comments/structure in validator.js
  whether the model explains why a pure regex cannot express the
  numeric range and leading-zero constraints, and which mechanism
  (arithmetic comparison, digit-run inspection) it used instead.
