---
id: context-07-ledger-query
category: long-context
title: Query over an embedded 200-row ledger
deliverables:
  - LEDGER.md
---

## Task

Below is a transaction ledger for a regional billing system: 200 rows,
each with a row number, a region, a dollar amount, and a status
(`posted` or `void`). Read the table carefully and answer the four
aggregate queries below. Produce `LEDGER.md` containing exactly four
labeled lines, in this order:

- An `A:` line: the total dollars of all `posted` transactions in the
  South region.
- A `B:` line: the count of `void` transactions across the whole
  ledger (all regions).
- A `C:` line: the single largest amount value anywhere in the ledger.
- A `D:` line: the total dollars of all `posted` transactions across
  every region.

Void transactions were reversed and never settled — they must be
excluded from any dollar total (A and D). They still count toward the
void tally (B). The maximum amount (C) is drawn from the `Amount`
column as printed, regardless of status.

### Ledger (200 rows)

| Row | Region | Amount | Status |
|---|---|---|---|
| 1 | North | 107 | posted |
| 2 | South | 114 | posted |
| 3 | East | 121 | posted |
| 4 | West | 128 | posted |
| 5 | North | 135 | void |
| 6 | South | 142 | posted |
| 7 | East | 149 | posted |
| 8 | West | 156 | posted |
| 9 | North | 163 | posted |
| 10 | South | 170 | void |
| 11 | East | 177 | posted |
| 12 | West | 184 | posted |
| 13 | North | 101 | posted |
| 14 | South | 108 | posted |
| 15 | East | 115 | void |
| 16 | West | 122 | posted |
| 17 | North | 129 | posted |
| 18 | South | 136 | posted |
| 19 | East | 143 | posted |
| 20 | West | 150 | void |
| 21 | North | 157 | posted |
| 22 | South | 164 | posted |
| 23 | East | 171 | posted |
| 24 | West | 178 | posted |
| 25 | North | 185 | void |
| 26 | South | 102 | posted |
| 27 | East | 109 | posted |
| 28 | West | 116 | posted |
| 29 | North | 123 | posted |
| 30 | South | 130 | void |
| 31 | East | 137 | posted |
| 32 | West | 144 | posted |
| 33 | North | 151 | posted |
| 34 | South | 158 | posted |
| 35 | East | 165 | void |
| 36 | West | 172 | posted |
| 37 | North | 179 | posted |
| 38 | South | 186 | posted |
| 39 | East | 103 | posted |
| 40 | West | 110 | void |
| 41 | North | 117 | posted |
| 42 | South | 124 | posted |
| 43 | East | 131 | posted |
| 44 | West | 138 | posted |
| 45 | North | 145 | void |
| 46 | South | 152 | posted |
| 47 | East | 159 | posted |
| 48 | West | 166 | posted |
| 49 | North | 173 | posted |
| 50 | South | 180 | void |
| 51 | East | 187 | posted |
| 52 | West | 104 | posted |
| 53 | North | 111 | posted |
| 54 | South | 118 | posted |
| 55 | East | 125 | void |
| 56 | West | 132 | posted |
| 57 | North | 139 | posted |
| 58 | South | 146 | posted |
| 59 | East | 153 | posted |
| 60 | West | 160 | void |
| 61 | North | 167 | posted |
| 62 | South | 174 | posted |
| 63 | East | 181 | posted |
| 64 | West | 188 | posted |
| 65 | North | 105 | void |
| 66 | South | 112 | posted |
| 67 | East | 119 | posted |
| 68 | West | 126 | posted |
| 69 | North | 133 | posted |
| 70 | South | 140 | void |
| 71 | East | 147 | posted |
| 72 | West | 154 | posted |
| 73 | North | 161 | posted |
| 74 | South | 168 | posted |
| 75 | East | 175 | void |
| 76 | West | 182 | posted |
| 77 | North | 189 | posted |
| 78 | South | 106 | posted |
| 79 | East | 113 | posted |
| 80 | West | 120 | void |
| 81 | North | 127 | posted |
| 82 | South | 134 | posted |
| 83 | East | 141 | posted |
| 84 | West | 148 | posted |
| 85 | North | 155 | void |
| 86 | South | 162 | posted |
| 87 | East | 169 | posted |
| 88 | West | 176 | posted |
| 89 | North | 183 | posted |
| 90 | South | 100 | void |
| 91 | East | 107 | posted |
| 92 | West | 114 | posted |
| 93 | North | 121 | posted |
| 94 | South | 128 | posted |
| 95 | East | 135 | void |
| 96 | West | 142 | posted |
| 97 | North | 149 | posted |
| 98 | South | 156 | posted |
| 99 | East | 163 | posted |
| 100 | West | 170 | void |
| 101 | North | 177 | posted |
| 102 | South | 184 | posted |
| 103 | East | 101 | posted |
| 104 | West | 108 | posted |
| 105 | North | 115 | void |
| 106 | South | 122 | posted |
| 107 | East | 129 | posted |
| 108 | West | 136 | posted |
| 109 | North | 143 | posted |
| 110 | South | 150 | void |
| 111 | East | 157 | posted |
| 112 | West | 164 | posted |
| 113 | North | 171 | posted |
| 114 | South | 178 | posted |
| 115 | East | 185 | void |
| 116 | West | 102 | posted |
| 117 | North | 109 | posted |
| 118 | South | 116 | posted |
| 119 | East | 123 | posted |
| 120 | West | 130 | void |
| 121 | North | 137 | posted |
| 122 | South | 144 | posted |
| 123 | East | 151 | posted |
| 124 | West | 158 | posted |
| 125 | North | 165 | void |
| 126 | South | 172 | posted |
| 127 | East | 179 | posted |
| 128 | West | 186 | posted |
| 129 | North | 103 | posted |
| 130 | South | 110 | void |
| 131 | East | 117 | posted |
| 132 | West | 124 | posted |
| 133 | North | 131 | posted |
| 134 | South | 138 | posted |
| 135 | East | 145 | void |
| 136 | West | 152 | posted |
| 137 | North | 159 | posted |
| 138 | South | 166 | posted |
| 139 | East | 173 | posted |
| 140 | West | 180 | void |
| 141 | North | 187 | posted |
| 142 | South | 104 | posted |
| 143 | East | 111 | posted |
| 144 | West | 118 | posted |
| 145 | North | 125 | void |
| 146 | South | 132 | posted |
| 147 | East | 139 | posted |
| 148 | West | 146 | posted |
| 149 | North | 153 | posted |
| 150 | South | 160 | void |
| 151 | East | 167 | posted |
| 152 | West | 174 | posted |
| 153 | North | 181 | posted |
| 154 | South | 188 | posted |
| 155 | East | 105 | void |
| 156 | West | 112 | posted |
| 157 | North | 119 | posted |
| 158 | South | 126 | posted |
| 159 | East | 133 | posted |
| 160 | West | 140 | void |
| 161 | North | 147 | posted |
| 162 | South | 154 | posted |
| 163 | East | 161 | posted |
| 164 | West | 168 | posted |
| 165 | North | 175 | void |
| 166 | South | 182 | posted |
| 167 | East | 189 | posted |
| 168 | West | 106 | posted |
| 169 | North | 113 | posted |
| 170 | South | 120 | void |
| 171 | East | 127 | posted |
| 172 | West | 134 | posted |
| 173 | North | 141 | posted |
| 174 | South | 148 | posted |
| 175 | East | 155 | void |
| 176 | West | 162 | posted |
| 177 | North | 169 | posted |
| 178 | South | 176 | posted |
| 179 | East | 183 | posted |
| 180 | West | 100 | void |
| 181 | North | 107 | posted |
| 182 | South | 114 | posted |
| 183 | East | 121 | posted |
| 184 | West | 128 | posted |
| 185 | North | 135 | void |
| 186 | South | 142 | posted |
| 187 | East | 149 | posted |
| 188 | West | 156 | posted |
| 189 | North | 163 | posted |
| 190 | South | 170 | void |
| 191 | East | 177 | posted |
| 192 | West | 184 | posted |
| 193 | North | 101 | posted |
| 194 | South | 108 | posted |
| 195 | East | 115 | void |
| 196 | West | 122 | posted |
| 197 | North | 129 | posted |
| 198 | South | 136 | posted |
| 199 | East | 143 | posted |
| 200 | West | 150 | void |

## Deliverables

- `LEDGER.md` containing, in order: an `A:` line, a `B:` line, a `C:`
  line, and a `D:` line, each with only the requested number (no other
  lines).

## Constraints

- Do not include any row's amount in a dollar total if that row's
  status is `void`.
- Do not add commentary, a recomputed table, or any line beyond the
  four labeled answers to `LEDGER.md`.
