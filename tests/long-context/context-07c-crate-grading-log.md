---
id: context-07c-crate-grading-log
category: long-context
title: Query over an embedded 200-row crate grading log
deliverables:
  - CRATES.md
---

## Task

Below is a grading log for the Bramblefold packhouse: 200 crates, each
with a crate number, an orchard block, a weight in pounds, and a grade
(`packed` or `culled`). Read the table carefully and answer the four
aggregate queries below. Produce `CRATES.md` containing exactly four
labeled lines, in this order:

- An `A:` line: the total pounds of all `packed` crates from the
  Duskfield block.
- A `B:` line: the count of `culled` crates across the whole log (all
  blocks).
- A `C:` line: the single largest weight value anywhere in the log.
- A `D:` line: the total pounds of all `packed` crates across every
  block.

Culled crates were rejected at inspection and pulled off the line before
shipping — they must be excluded from any weight total (A and D). They
still count toward the culled tally (B). The largest weight (C) is drawn
from the `Weight` column as printed, regardless of grade.

### Grading log (200 rows)

| Crate | Block | Weight | Grade |
|---|---|---|---|
| 1 | Oxleaze | 229 | packed |
| 2 | Duskfield | 248 | packed |
| 3 | Harrowdene | 267 | packed |
| 4 | Pippinbrook | 286 | packed |
| 5 | Oxleaze | 305 | packed |
| 6 | Duskfield | 324 | packed |
| 7 | Harrowdene | 343 | packed |
| 8 | Pippinbrook | 212 | packed |
| 9 | Oxleaze | 231 | packed |
| 10 | Duskfield | 250 | packed |
| 11 | Harrowdene | 269 | packed |
| 12 | Pippinbrook | 288 | packed |
| 13 | Oxleaze | 307 | packed |
| 14 | Duskfield | 326 | packed |
| 15 | Harrowdene | 345 | packed |
| 16 | Pippinbrook | 214 | packed |
| 17 | Oxleaze | 233 | packed |
| 18 | Duskfield | 252 | packed |
| 19 | Harrowdene | 271 | packed |
| 20 | Pippinbrook | 290 | packed |
| 21 | Oxleaze | 309 | culled |
| 22 | Duskfield | 328 | culled |
| 23 | Harrowdene | 347 | culled |
| 24 | Pippinbrook | 216 | culled |
| 25 | Oxleaze | 235 | packed |
| 26 | Duskfield | 254 | packed |
| 27 | Harrowdene | 273 | packed |
| 28 | Pippinbrook | 292 | packed |
| 29 | Oxleaze | 311 | packed |
| 30 | Duskfield | 330 | packed |
| 31 | Harrowdene | 349 | packed |
| 32 | Pippinbrook | 218 | packed |
| 33 | Oxleaze | 237 | packed |
| 34 | Duskfield | 256 | packed |
| 35 | Harrowdene | 275 | packed |
| 36 | Pippinbrook | 294 | packed |
| 37 | Oxleaze | 313 | packed |
| 38 | Duskfield | 332 | packed |
| 39 | Harrowdene | 351 | packed |
| 40 | Pippinbrook | 220 | packed |
| 41 | Oxleaze | 239 | packed |
| 42 | Duskfield | 258 | packed |
| 43 | Harrowdene | 277 | packed |
| 44 | Pippinbrook | 296 | packed |
| 45 | Oxleaze | 315 | culled |
| 46 | Duskfield | 334 | culled |
| 47 | Harrowdene | 353 | culled |
| 48 | Pippinbrook | 222 | culled |
| 49 | Oxleaze | 241 | packed |
| 50 | Duskfield | 260 | packed |
| 51 | Harrowdene | 279 | packed |
| 52 | Pippinbrook | 298 | packed |
| 53 | Oxleaze | 317 | packed |
| 54 | Duskfield | 336 | packed |
| 55 | Harrowdene | 355 | packed |
| 56 | Pippinbrook | 224 | packed |
| 57 | Oxleaze | 243 | packed |
| 58 | Duskfield | 262 | packed |
| 59 | Harrowdene | 281 | packed |
| 60 | Pippinbrook | 300 | packed |
| 61 | Oxleaze | 319 | packed |
| 62 | Duskfield | 338 | packed |
| 63 | Harrowdene | 357 | packed |
| 64 | Pippinbrook | 226 | packed |
| 65 | Oxleaze | 245 | packed |
| 66 | Duskfield | 264 | packed |
| 67 | Harrowdene | 283 | packed |
| 68 | Pippinbrook | 302 | packed |
| 69 | Oxleaze | 321 | culled |
| 70 | Duskfield | 340 | culled |
| 71 | Harrowdene | 359 | culled |
| 72 | Pippinbrook | 228 | culled |
| 73 | Oxleaze | 247 | packed |
| 74 | Duskfield | 266 | packed |
| 75 | Harrowdene | 285 | packed |
| 76 | Pippinbrook | 304 | packed |
| 77 | Oxleaze | 323 | packed |
| 78 | Duskfield | 342 | packed |
| 79 | Harrowdene | 211 | packed |
| 80 | Pippinbrook | 230 | packed |
| 81 | Oxleaze | 249 | packed |
| 82 | Duskfield | 268 | packed |
| 83 | Harrowdene | 287 | packed |
| 84 | Pippinbrook | 306 | packed |
| 85 | Oxleaze | 325 | packed |
| 86 | Duskfield | 344 | packed |
| 87 | Harrowdene | 213 | packed |
| 88 | Pippinbrook | 232 | packed |
| 89 | Oxleaze | 251 | packed |
| 90 | Duskfield | 270 | packed |
| 91 | Harrowdene | 289 | packed |
| 92 | Pippinbrook | 308 | packed |
| 93 | Oxleaze | 327 | culled |
| 94 | Duskfield | 346 | culled |
| 95 | Harrowdene | 215 | culled |
| 96 | Pippinbrook | 234 | culled |
| 97 | Oxleaze | 253 | packed |
| 98 | Duskfield | 272 | packed |
| 99 | Harrowdene | 291 | packed |
| 100 | Pippinbrook | 310 | packed |
| 101 | Oxleaze | 329 | packed |
| 102 | Duskfield | 348 | packed |
| 103 | Harrowdene | 217 | packed |
| 104 | Pippinbrook | 236 | packed |
| 105 | Oxleaze | 255 | packed |
| 106 | Duskfield | 274 | packed |
| 107 | Harrowdene | 293 | packed |
| 108 | Pippinbrook | 312 | packed |
| 109 | Oxleaze | 331 | packed |
| 110 | Duskfield | 350 | packed |
| 111 | Harrowdene | 219 | packed |
| 112 | Pippinbrook | 238 | packed |
| 113 | Oxleaze | 257 | packed |
| 114 | Duskfield | 276 | packed |
| 115 | Harrowdene | 295 | packed |
| 116 | Pippinbrook | 314 | packed |
| 117 | Oxleaze | 333 | culled |
| 118 | Duskfield | 352 | culled |
| 119 | Harrowdene | 221 | culled |
| 120 | Pippinbrook | 240 | culled |
| 121 | Oxleaze | 259 | packed |
| 122 | Duskfield | 278 | packed |
| 123 | Harrowdene | 297 | packed |
| 124 | Pippinbrook | 316 | packed |
| 125 | Oxleaze | 335 | packed |
| 126 | Duskfield | 354 | packed |
| 127 | Harrowdene | 223 | packed |
| 128 | Pippinbrook | 242 | packed |
| 129 | Oxleaze | 261 | packed |
| 130 | Duskfield | 280 | packed |
| 131 | Harrowdene | 299 | packed |
| 132 | Pippinbrook | 318 | packed |
| 133 | Oxleaze | 337 | packed |
| 134 | Duskfield | 356 | packed |
| 135 | Harrowdene | 225 | packed |
| 136 | Pippinbrook | 244 | packed |
| 137 | Oxleaze | 263 | packed |
| 138 | Duskfield | 282 | packed |
| 139 | Harrowdene | 301 | packed |
| 140 | Pippinbrook | 320 | packed |
| 141 | Oxleaze | 339 | culled |
| 142 | Duskfield | 358 | culled |
| 143 | Harrowdene | 227 | culled |
| 144 | Pippinbrook | 246 | culled |
| 145 | Oxleaze | 265 | packed |
| 146 | Duskfield | 284 | packed |
| 147 | Harrowdene | 303 | packed |
| 148 | Pippinbrook | 322 | packed |
| 149 | Oxleaze | 341 | packed |
| 150 | Duskfield | 210 | packed |
| 151 | Harrowdene | 229 | packed |
| 152 | Pippinbrook | 248 | packed |
| 153 | Oxleaze | 267 | packed |
| 154 | Duskfield | 286 | packed |
| 155 | Harrowdene | 305 | packed |
| 156 | Pippinbrook | 324 | packed |
| 157 | Oxleaze | 343 | packed |
| 158 | Duskfield | 212 | packed |
| 159 | Harrowdene | 231 | packed |
| 160 | Pippinbrook | 250 | packed |
| 161 | Oxleaze | 269 | packed |
| 162 | Duskfield | 288 | packed |
| 163 | Harrowdene | 307 | packed |
| 164 | Pippinbrook | 326 | packed |
| 165 | Oxleaze | 345 | culled |
| 166 | Duskfield | 214 | culled |
| 167 | Harrowdene | 233 | culled |
| 168 | Pippinbrook | 252 | culled |
| 169 | Oxleaze | 271 | packed |
| 170 | Duskfield | 290 | packed |
| 171 | Harrowdene | 309 | packed |
| 172 | Pippinbrook | 328 | packed |
| 173 | Oxleaze | 347 | packed |
| 174 | Duskfield | 216 | packed |
| 175 | Harrowdene | 235 | packed |
| 176 | Pippinbrook | 254 | packed |
| 177 | Oxleaze | 273 | packed |
| 178 | Duskfield | 292 | packed |
| 179 | Harrowdene | 311 | packed |
| 180 | Pippinbrook | 330 | packed |
| 181 | Oxleaze | 349 | packed |
| 182 | Duskfield | 218 | packed |
| 183 | Harrowdene | 237 | packed |
| 184 | Pippinbrook | 256 | packed |
| 185 | Oxleaze | 275 | packed |
| 186 | Duskfield | 294 | packed |
| 187 | Harrowdene | 313 | packed |
| 188 | Pippinbrook | 332 | packed |
| 189 | Oxleaze | 351 | culled |
| 190 | Duskfield | 220 | culled |
| 191 | Harrowdene | 239 | culled |
| 192 | Pippinbrook | 258 | culled |
| 193 | Oxleaze | 277 | packed |
| 194 | Duskfield | 296 | packed |
| 195 | Harrowdene | 315 | packed |
| 196 | Pippinbrook | 334 | packed |
| 197 | Oxleaze | 353 | packed |
| 198 | Duskfield | 222 | packed |
| 199 | Harrowdene | 241 | packed |
| 200 | Pippinbrook | 260 | packed |

## Deliverables

- `CRATES.md` containing, in order: an `A:` line, a `B:` line, a `C:`
  line, and a `D:` line, each with only the requested number (no other
  lines).

## Constraints

- Do not include any crate's weight in a weight total if that crate's
  grade is `culled`.
- Do not add commentary, a recomputed table, or any line beyond the four
  labeled answers to `CRATES.md`.
