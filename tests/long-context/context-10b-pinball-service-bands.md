---
id: context-10b-pinball-service-bands
category: long-context
title: Induce-and-apply a service-band scheme from many examples
deliverables:
  - BANDS.md
---

## Task

Below are 60 labeled training examples of fictional pinball-machine
service tags. Each tag has the form `XX-NNN-VENUE-L`, where `XX` is a
two-letter maker prefix, `NNN` is a numeric service-index field, `VENUE`
is one of five venue-type names, and `L` is a single trailing condition
letter. Each example is paired with a label from a closed set of four
service bands: `Band-1`, `Band-2`, `Band-3`, or `Band-4`.

The rule that determines each tag's service band is NOT stated anywhere
— you must induce it from the 60 labeled examples. The rule is
deterministic: every one of the 60 examples is consistent with a single
fixed rule, and that same rule determines the band of any new tag.

Produce `BANDS.md` containing, in this order:

1. A `## Rule` section stating, in your own words, the rule you
   induced from the training examples.
2. A `## Bands` section with exactly 15 lines, `T1:` through `T15:`,
   each giving your predicted band for the corresponding test tag
   below, formatted exactly `Tn: Band-k`.

### Training Examples (60, labeled)

1. DK-357-FOYER-C -> Band-4
2. NS-302-FOYER-D -> Band-3
3. RV-498-DINER-D -> Band-3
4. WM-488-PIER-B -> Band-1
5. CV-451-TAVERN-D -> Band-4
6. VK-448-FOYER-A -> Band-1
7. RV-399-DINER-B -> Band-2
8. ST-442-ARCADE-A -> Band-1
9. DK-338-FOYER-A -> Band-1
10. PQ-463-PIER-C -> Band-4
11. XG-495-DINER-A -> Band-2
12. GM-387-PIER-B -> Band-2
13. VK-327-FOYER-C -> Band-4
14. NS-467-FOYER-B -> Band-2
15. XG-466-DINER-A -> Band-1
16. RV-415-DINER-D -> Band-4
17. ST-365-ARCADE-C -> Band-4
18. XG-408-DINER-C -> Band-3
19. DK-379-FOYER-A -> Band-2
20. CV-452-TAVERN-D -> Band-3
21. MB-356-TAVERN-C -> Band-3
22. HP-322-DINER-C -> Band-3
23. MB-330-TAVERN-A -> Band-1
24. XG-313-DINER-C -> Band-4
25. HP-373-DINER-C -> Band-4
26. CV-493-TAVERN-B -> Band-2
27. RV-492-DINER-B -> Band-1
28. HP-343-DINER-A -> Band-2
29. BX-455-ARCADE-C -> Band-4
30. VK-301-FOYER-A -> Band-2
31. TW-388-TAVERN-D -> Band-3
32. PQ-450-PIER-C -> Band-3
33. PQ-368-PIER-A -> Band-1
34. BX-377-ARCADE-A -> Band-2
35. LZ-320-ARCADE-D -> Band-3
36. WM-325-PIER-B -> Band-2
37. MB-465-TAVERN-C -> Band-4
38. NS-413-FOYER-D -> Band-4
39. WM-414-PIER-D -> Band-3
40. DK-362-FOYER-C -> Band-3
41. GM-482-PIER-D -> Band-3
42. CV-422-TAVERN-B -> Band-1
43. BX-460-ARCADE-A -> Band-1
44. NS-308-FOYER-B -> Band-1
45. LZ-449-ARCADE-B -> Band-2
46. VK-348-FOYER-C -> Band-3
47. LZ-445-ARCADE-D -> Band-4
48. HP-390-DINER-A -> Band-1
49. TW-386-TAVERN-B -> Band-1
50. GM-333-PIER-D -> Band-4
51. TW-489-TAVERN-D -> Band-4
52. PQ-419-PIER-A -> Band-2
53. GM-318-PIER-B -> Band-1
54. ST-332-ARCADE-C -> Band-3
55. TW-393-TAVERN-B -> Band-2
56. MB-409-TAVERN-A -> Band-2
57. WM-363-PIER-D -> Band-4
58. LZ-430-ARCADE-B -> Band-1
59. BX-434-ARCADE-C -> Band-3
60. ST-497-ARCADE-A -> Band-2

### Test Tags (15, unlabeled — classify each one)

- T1: AJ-38-ARCADE-B
- T2: BQ-57-TAVERN-A
- T3: CY-64-FOYER-C
- T4: DR-79-PIER-D
- T5: EK-28-DINER-A
- T6: FL-71-ARCADE-B
- T7: GH-46-TAVERN-D
- T8: IM-95-FOYER-C
- T9: JN-33-PIER-A
- T10: KO-50-DINER-B
- T11: LP-88-ARCADE-C
- T12: MQ-61-TAVERN-D
- T13: NR-52-FOYER-A
- T14: OT-16-PIER-D
- T15: PU-85-DINER-B

## Deliverables

- `BANDS.md` containing, in order: a `## Rule` section describing the
  induced rule in your own words, and a `## Bands` section with
  exactly 15 lines `T1:` through `T15:`, each `Tn: Band-k`.

## Constraints

- The venue name (ARCADE/TAVERN/FOYER/PIER/DINER) and the two-letter
  maker prefix do not affect the band — do not build your rule around
  them.
- Do not include any test tag's label anywhere except in the
  `## Bands` section's 15 lines.
