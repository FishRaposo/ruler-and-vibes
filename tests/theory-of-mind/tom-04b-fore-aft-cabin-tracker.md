---
id: tom-04b-fore-aft-cabin-tracker
category: theory-of-mind
title: Fore-and-aft cabin instrument epistemic tracker
deliverables:
  - beliefs.md
  - REASONING.md
---

## Task

Read the short narrative below. Then fill in a fixed belief table in
`beliefs.md`, applying the operative definition of KNOWS given below,
and trace each crew member's cabin-gated observation window in
`REASONING.md`.

### Operative definition

A crew member **KNOWS** an item's location only if both of the
following hold: (a) the crew member's current belief about that item's
location is correct, and (b) that belief is justified by the crew
member having directly observed the item's current position, with no
possibility that the item was moved again afterward without the crew
member seeing it. If either condition fails — the belief is wrong, or
the belief happens to be right but the crew member cannot rule out an
unobserved later move — the crew member merely **BELIEVES** the
location rather than KNOWS it.

### Narrative

Ezra, Vika, and Doran are three crew members working across two
adjoining cabins below deck on a survey vessel, FORE_CABIN and
AFT_CABIN. FORE_CABIN contains two storage containers, a FOOTLOCKER and
a DUFFEL. AFT_CABIN contains two storage containers, a COFFER and a
RUCKSACK. Two instruments are in play: a SEXTANT and a BAROMETER. A
crew member can only see an event if they are physically present in
the cabin where it happens at the moment it happens; a closed
watertight hatch between the cabins blocks all sight and sound.

0. At the start, the SEXTANT is in the FOOTLOCKER (in FORE_CABIN) and
   the BAROMETER is in the RUCKSACK (in AFT_CABIN). All three of Ezra,
   Vika, and Doran have been briefed on both of these starting
   positions, regardless of which cabin each currently occupies. At
   this moment, Ezra and Vika are physically in FORE_CABIN, and Doran
   is physically in AFT_CABIN.
1. While only Ezra and Vika are present in FORE_CABIN (Doran is in
   AFT_CABIN and cannot see into FORE_CABIN), Vika takes the SEXTANT
   out of the FOOTLOCKER and puts it in the DUFFEL. Ezra directly
   watches this happen.
2. Ezra then walks from FORE_CABIN into AFT_CABIN, closing the hatch
   behind him. From this point on, Ezra is physically present in
   AFT_CABIN, not FORE_CABIN.
3. While only Doran and Ezra are present in AFT_CABIN (Vika is still in
   FORE_CABIN and cannot see into AFT_CABIN), Doran takes the BAROMETER
   out of the RUCKSACK and puts it in the COFFER. Ezra directly watches
   this happen, since he is now in AFT_CABIN.
4. Meanwhile, back in FORE_CABIN, with only Vika present (Ezra has
   already left for AFT_CABIN, and Doran has never been in FORE_CABIN
   during this whole sequence), Vika takes the SEXTANT out of the
   DUFFEL and puts it back in the FOOTLOCKER. No one besides Vika
   witnesses this second move.

The scene ends at this point, with Ezra and Doran together in
AFT_CABIN and Vika alone in FORE_CABIN.

### Table to fill in

Produce exactly the following thirteen rows in `beliefs.md`. Location
answers must be drawn strictly from the token set `{FOOTLOCKER, DUFFEL,
COFFER, RUCKSACK}`. Knowledge answers must be drawn strictly from the
token set `{YES, NO}`.

**First-order beliefs — SEXTANT location**
1. **Reality (SEXTANT)**
2. **Ezra's belief (SEXTANT)**
3. **Vika's belief (SEXTANT)**
4. **Doran's belief (SEXTANT)**

**First-order beliefs — BAROMETER location**
5. **Reality (BAROMETER)**
6. **Ezra's belief (BAROMETER)**
7. **Vika's belief (BAROMETER)**
8. **Doran's belief (BAROMETER)**

**Knowledge-vs-belief (apply the operative definition above)**
9. **Does Ezra KNOW where the SEXTANT is?**
10. **Does Doran KNOW where the SEXTANT is?**

**Nested (second-order) beliefs**
11. **Vika-thinks-Ezra(SEXTANT)** — Where does Vika believe Ezra
    currently believes the SEXTANT is?
12. **Ezra-thinks-Vika(BAROMETER)** — Where does Ezra believe Vika
    currently believes the BAROMETER is?
13. **Doran-thinks-Vika(SEXTANT)** — Where does Doran believe Vika
    currently believes the SEXTANT is?

## Deliverables

- `beliefs.md`: exactly thirteen labeled rows as listed above. Each
  location answer must be exactly one verbatim token from
  `{FOOTLOCKER, DUFFEL, COFFER, RUCKSACK}` and nothing else; each
  knowledge answer must be exactly `YES` or `NO` and nothing else. No
  parentheticals, hedges, or explanatory clauses in the answer column
  itself.
- `REASONING.md`: for each crew member, state which cabin they occupied
  during each numbered event and what they could and could not see,
  then show how that determines each of the thirteen answers, including
  applying the operative KNOWS/BELIEVES definition explicitly to rows 9
  and 10. At most 500 words (whole file, `wc -w`).

## Constraints

- Every location answer must be exactly one token from `{FOOTLOCKER,
  DUFFEL, COFFER, RUCKSACK}`; every knowledge answer must be exactly
  `YES` or `NO` — no other wording, no combined answers, no qualifiers.
- A correct belief is not automatically knowledge — apply the operative
  definition literally, including its clause about ruling out an
  unobserved later move.
- A crew member's belief is gated strictly by physical cabin presence
  at the moment of each event; being briefed on the starting positions
  at time 0 counts as information, but nothing that happens afterward
  transfers to a crew member who is not physically present for it.
- `REASONING.md` must be at most 500 words.
