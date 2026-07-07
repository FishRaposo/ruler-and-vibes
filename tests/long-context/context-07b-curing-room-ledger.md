---
id: context-07b-curing-room-ledger
category: long-context
title: Query over an embedded 200-row curing ledger
deliverables:
  - CURING.md
---

## Task

Below is a curing-room ledger for an artisan salumeria: 200 batches,
each with a batch number, a curing chamber, a cured weight in grams, and
a status (`cured` or `spoiled`). Read the table carefully and answer the
four aggregate queries below. Produce `CURING.md` containing exactly
four labeled lines, in this order:

- An `A:` line: the total grams of all `cured` batches in the Camino
  chamber.
- A `B:` line: the count of `spoiled` batches across the whole ledger
  (all chambers).
- A `C:` line: the single largest grams value anywhere in the ledger.
- A `D:` line: the total grams of all `cured` batches across every
  chamber.

Spoiled batches were discarded and never sold — they must be excluded
from any weight total (A and D). They still count toward the spoiled
tally (B). The maximum grams value (C) is drawn from the `Grams` column
as printed, regardless of status.

### Ledger (200 batches)

| Batch | Chamber | Grams | Status |
|---|---|---|---|
| 1 | Cortile | 413 | cured |
| 2 | Grotta | 426 | cured |
| 3 | Camino | 439 | cured |
| 4 | Fienile | 452 | spoiled |
| 5 | Cortile | 465 | cured |
| 6 | Grotta | 478 | cured |
| 7 | Camino | 401 | cured |
| 8 | Fienile | 414 | cured |
| 9 | Cortile | 427 | spoiled |
| 10 | Grotta | 440 | cured |
| 11 | Camino | 453 | cured |
| 12 | Fienile | 466 | cured |
| 13 | Cortile | 479 | spoiled |
| 14 | Grotta | 402 | cured |
| 15 | Camino | 415 | cured |
| 16 | Fienile | 428 | cured |
| 17 | Cortile | 441 | cured |
| 18 | Grotta | 454 | spoiled |
| 19 | Camino | 467 | cured |
| 20 | Fienile | 480 | cured |
| 21 | Cortile | 403 | cured |
| 22 | Grotta | 416 | spoiled |
| 23 | Camino | 429 | cured |
| 24 | Fienile | 442 | cured |
| 25 | Cortile | 455 | cured |
| 26 | Grotta | 468 | cured |
| 27 | Camino | 481 | spoiled |
| 28 | Fienile | 404 | cured |
| 29 | Cortile | 417 | cured |
| 30 | Grotta | 430 | cured |
| 31 | Camino | 443 | spoiled |
| 32 | Fienile | 456 | cured |
| 33 | Cortile | 469 | cured |
| 34 | Grotta | 482 | cured |
| 35 | Camino | 405 | cured |
| 36 | Fienile | 418 | spoiled |
| 37 | Cortile | 431 | cured |
| 38 | Grotta | 444 | cured |
| 39 | Camino | 457 | cured |
| 40 | Fienile | 470 | spoiled |
| 41 | Cortile | 483 | cured |
| 42 | Grotta | 406 | cured |
| 43 | Camino | 419 | cured |
| 44 | Fienile | 432 | cured |
| 45 | Cortile | 445 | spoiled |
| 46 | Grotta | 458 | cured |
| 47 | Camino | 471 | cured |
| 48 | Fienile | 484 | cured |
| 49 | Cortile | 407 | spoiled |
| 50 | Grotta | 420 | cured |
| 51 | Camino | 433 | cured |
| 52 | Fienile | 446 | cured |
| 53 | Cortile | 459 | cured |
| 54 | Grotta | 472 | spoiled |
| 55 | Camino | 485 | cured |
| 56 | Fienile | 408 | cured |
| 57 | Cortile | 421 | cured |
| 58 | Grotta | 434 | spoiled |
| 59 | Camino | 447 | cured |
| 60 | Fienile | 460 | cured |
| 61 | Cortile | 473 | cured |
| 62 | Grotta | 486 | cured |
| 63 | Camino | 409 | spoiled |
| 64 | Fienile | 422 | cured |
| 65 | Cortile | 435 | cured |
| 66 | Grotta | 448 | cured |
| 67 | Camino | 461 | spoiled |
| 68 | Fienile | 474 | cured |
| 69 | Cortile | 487 | cured |
| 70 | Grotta | 410 | cured |
| 71 | Camino | 423 | cured |
| 72 | Fienile | 436 | spoiled |
| 73 | Cortile | 449 | cured |
| 74 | Grotta | 462 | cured |
| 75 | Camino | 475 | cured |
| 76 | Fienile | 488 | spoiled |
| 77 | Cortile | 411 | cured |
| 78 | Grotta | 424 | cured |
| 79 | Camino | 437 | cured |
| 80 | Fienile | 450 | cured |
| 81 | Cortile | 463 | spoiled |
| 82 | Grotta | 476 | cured |
| 83 | Camino | 489 | cured |
| 84 | Fienile | 412 | cured |
| 85 | Cortile | 425 | spoiled |
| 86 | Grotta | 438 | cured |
| 87 | Camino | 451 | cured |
| 88 | Fienile | 464 | cured |
| 89 | Cortile | 477 | cured |
| 90 | Grotta | 400 | spoiled |
| 91 | Camino | 413 | cured |
| 92 | Fienile | 426 | cured |
| 93 | Cortile | 439 | cured |
| 94 | Grotta | 452 | spoiled |
| 95 | Camino | 465 | cured |
| 96 | Fienile | 478 | cured |
| 97 | Cortile | 401 | cured |
| 98 | Grotta | 414 | cured |
| 99 | Camino | 427 | spoiled |
| 100 | Fienile | 440 | cured |
| 101 | Cortile | 453 | cured |
| 102 | Grotta | 466 | cured |
| 103 | Camino | 479 | spoiled |
| 104 | Fienile | 402 | cured |
| 105 | Cortile | 415 | cured |
| 106 | Grotta | 428 | cured |
| 107 | Camino | 441 | cured |
| 108 | Fienile | 454 | spoiled |
| 109 | Cortile | 467 | cured |
| 110 | Grotta | 480 | cured |
| 111 | Camino | 403 | cured |
| 112 | Fienile | 416 | spoiled |
| 113 | Cortile | 429 | cured |
| 114 | Grotta | 442 | cured |
| 115 | Camino | 455 | cured |
| 116 | Fienile | 468 | cured |
| 117 | Cortile | 481 | spoiled |
| 118 | Grotta | 404 | cured |
| 119 | Camino | 417 | cured |
| 120 | Fienile | 430 | cured |
| 121 | Cortile | 443 | spoiled |
| 122 | Grotta | 456 | cured |
| 123 | Camino | 469 | cured |
| 124 | Fienile | 482 | cured |
| 125 | Cortile | 405 | cured |
| 126 | Grotta | 418 | spoiled |
| 127 | Camino | 431 | cured |
| 128 | Fienile | 444 | cured |
| 129 | Cortile | 457 | cured |
| 130 | Grotta | 470 | spoiled |
| 131 | Camino | 483 | cured |
| 132 | Fienile | 406 | cured |
| 133 | Cortile | 419 | cured |
| 134 | Grotta | 432 | cured |
| 135 | Camino | 445 | spoiled |
| 136 | Fienile | 458 | cured |
| 137 | Cortile | 471 | cured |
| 138 | Grotta | 484 | cured |
| 139 | Camino | 407 | spoiled |
| 140 | Fienile | 420 | cured |
| 141 | Cortile | 433 | cured |
| 142 | Grotta | 446 | cured |
| 143 | Camino | 459 | cured |
| 144 | Fienile | 472 | spoiled |
| 145 | Cortile | 485 | cured |
| 146 | Grotta | 408 | cured |
| 147 | Camino | 421 | cured |
| 148 | Fienile | 434 | spoiled |
| 149 | Cortile | 447 | cured |
| 150 | Grotta | 460 | cured |
| 151 | Camino | 473 | cured |
| 152 | Fienile | 486 | cured |
| 153 | Cortile | 409 | spoiled |
| 154 | Grotta | 422 | cured |
| 155 | Camino | 435 | cured |
| 156 | Fienile | 448 | cured |
| 157 | Cortile | 461 | spoiled |
| 158 | Grotta | 474 | cured |
| 159 | Camino | 487 | cured |
| 160 | Fienile | 410 | cured |
| 161 | Cortile | 423 | cured |
| 162 | Grotta | 436 | spoiled |
| 163 | Camino | 449 | cured |
| 164 | Fienile | 462 | cured |
| 165 | Cortile | 475 | cured |
| 166 | Grotta | 488 | spoiled |
| 167 | Camino | 411 | cured |
| 168 | Fienile | 424 | cured |
| 169 | Cortile | 437 | cured |
| 170 | Grotta | 450 | cured |
| 171 | Camino | 463 | spoiled |
| 172 | Fienile | 476 | cured |
| 173 | Cortile | 489 | cured |
| 174 | Grotta | 412 | cured |
| 175 | Camino | 425 | spoiled |
| 176 | Fienile | 438 | cured |
| 177 | Cortile | 451 | cured |
| 178 | Grotta | 464 | cured |
| 179 | Camino | 477 | cured |
| 180 | Fienile | 400 | spoiled |
| 181 | Cortile | 413 | cured |
| 182 | Grotta | 426 | cured |
| 183 | Camino | 439 | cured |
| 184 | Fienile | 452 | spoiled |
| 185 | Cortile | 465 | cured |
| 186 | Grotta | 478 | cured |
| 187 | Camino | 401 | cured |
| 188 | Fienile | 414 | cured |
| 189 | Cortile | 427 | spoiled |
| 190 | Grotta | 440 | cured |
| 191 | Camino | 453 | cured |
| 192 | Fienile | 466 | cured |
| 193 | Cortile | 479 | spoiled |
| 194 | Grotta | 402 | cured |
| 195 | Camino | 415 | cured |
| 196 | Fienile | 428 | cured |
| 197 | Cortile | 441 | cured |
| 198 | Grotta | 454 | spoiled |
| 199 | Camino | 467 | cured |
| 200 | Fienile | 480 | cured |

## Deliverables

- `CURING.md` containing, in order: an `A:` line, a `B:` line, a `C:`
  line, and a `D:` line, each with only the requested number (no other
  lines).

## Constraints

- Do not include any batch's grams in a weight total if that batch's
  status is `spoiled`.
- Do not add commentary, a recomputed table, or any line beyond the four
  labeled answers to `CURING.md`.
