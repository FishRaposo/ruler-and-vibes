---
id: context-10c-typebar-warehouse-grades
category: long-context
title: Induce-and-apply a handling-grade scheme from many examples
deliverables:
  - LABELS.md
---

## Task

Below are 60 labeled training examples of fictional part codes from a
restored-typewriter parts warehouse. Each code has the form
`AA-NNN-STATION-L`, where `AA` is a two-letter prefix, `NNN` is a numeric
field, `STATION` is one of five workbench names, and `L` is a single
trailing letter. Each example is paired with a handling grade from a closed
set of four: `Grade-I`, `Grade-II`, `Grade-III`, or `Grade-IV`.

The rule that determines each code's handling grade is NOT stated anywhere —
you must induce it from the 60 labeled examples. The rule is deterministic:
every one of the 60 examples is consistent with a single fixed rule, and
that same rule determines the grade of any new code.

Produce `LABELS.md` containing, in this order:

1. A `## Rule` section stating, in your own words, the rule you induced
   from the training examples.
2. A `## Labels` section with exactly 15 lines, `T1:` through `T15:`, each
   giving your predicted handling grade for the corresponding test code
   below, formatted exactly `Tn: Grade-k`.

### Training Examples (60, labeled)

1. CR-411-ROLLBENCH-C -> Grade-II
2. LV-306-BELLBENCH-B -> Grade-III
3. LV-398-INKBENCH-B -> Grade-III
4. BX-457-FRAMEBENCH-D -> Grade-II
5. VC-375-ROLLBENCH-B -> Grade-I
6. PL-326-ROLLBENCH-C -> Grade-IV
7. HN-399-INKBENCH-A -> Grade-I
8. YT-361-INKBENCH-C -> Grade-II
9. VC-399-FRAMEBENCH-A -> Grade-I
10. ES-305-BELLBENCH-C -> Grade-II
11. RB-398-KEYBENCH-A -> Grade-III
12. RB-463-KEYBENCH-B -> Grade-I
13. GR-463-KEYBENCH-B -> Grade-I
14. YT-480-FRAMEBENCH-C -> Grade-IV
15. NR-326-INKBENCH-A -> Grade-III
16. DK-353-ROLLBENCH-C -> Grade-II
17. ZM-456-INKBENCH-B -> Grade-III
18. FT-317-FRAMEBENCH-C -> Grade-II
19. PL-399-ROLLBENCH-B -> Grade-I
20. ES-388-FRAMEBENCH-A -> Grade-III
21. HN-317-BELLBENCH-C -> Grade-II
22. YT-349-KEYBENCH-D -> Grade-II
23. ZM-312-BELLBENCH-C -> Grade-IV
24. LV-344-KEYBENCH-C -> Grade-IV
25. WD-318-INKBENCH-D -> Grade-IV
26. NR-462-FRAMEBENCH-A -> Grade-III
27. RB-321-KEYBENCH-D -> Grade-II
28. VC-388-INKBENCH-A -> Grade-III
29. WD-327-BELLBENCH-B -> Grade-I
30. GR-495-BELLBENCH-A -> Grade-I
31. VC-462-KEYBENCH-D -> Grade-IV
32. TL-410-BELLBENCH-D -> Grade-IV
33. GR-481-BELLBENCH-B -> Grade-I
34. DK-495-KEYBENCH-D -> Grade-II
35. ZM-349-ROLLBENCH-D -> Grade-II
36. WD-312-BELLBENCH-D -> Grade-IV
37. ZM-306-FRAMEBENCH-C -> Grade-IV
38. RB-399-INKBENCH-C -> Grade-II
39. ZM-428-KEYBENCH-B -> Grade-III
40. SB-344-KEYBENCH-D -> Grade-IV
41. GR-349-INKBENCH-D -> Grade-II
42. PL-389-FRAMEBENCH-A -> Grade-I
43. WD-428-BELLBENCH-A -> Grade-III
44. ZM-326-ROLLBENCH-D -> Grade-IV
45. TL-463-BELLBENCH-A -> Grade-I
46. BX-312-INKBENCH-B -> Grade-III
47. ES-456-INKBENCH-D -> Grade-IV
48. LV-375-INKBENCH-B -> Grade-I
49. TL-411-INKBENCH-B -> Grade-I
50. VC-312-KEYBENCH-A -> Grade-III
51. MG-361-FRAMEBENCH-D -> Grade-II
52. QN-353-INKBENCH-B -> Grade-I
53. ES-353-FRAMEBENCH-A -> Grade-I
54. SB-410-ROLLBENCH-B -> Grade-III
55. BX-410-ROLLBENCH-B -> Grade-III
56. HN-327-ROLLBENCH-D -> Grade-II
57. SB-462-ROLLBENCH-C -> Grade-IV
58. LV-344-ROLLBENCH-D -> Grade-IV
59. FT-388-BELLBENCH-C -> Grade-IV
60. KP-352-FRAMEBENCH-B -> Grade-III

### Test Codes (15, unlabeled — classify each one)

- T1: AH-30-ROLLBENCH-A
- T2: BI-56-INKBENCH-D
- T3: CJ-71-FRAMEBENCH-A
- T4: EL-85-KEYBENCH-C
- T5: FM-40-BELLBENCH-B
- T6: HO-68-INKBENCH-C
- T7: IP-19-ROLLBENCH-B
- T8: JQ-51-FRAMEBENCH-D
- T9: KR-46-KEYBENCH-A
- T10: LS-54-BELLBENCH-C
- T11: MT-33-ROLLBENCH-A
- T12: NU-87-INKBENCH-C
- T13: OV-20-FRAMEBENCH-B
- T14: QX-62-KEYBENCH-D
- T15: RY-39-BELLBENCH-B

## Deliverables

- `LABELS.md` containing, in order: a `## Rule` section describing the
  induced rule in your own words, and a `## Labels` section with exactly 15
  lines `T1:` through `T15:`, each `Tn: Grade-k`.

## Constraints

- The workbench-station name (ROLLBENCH/INKBENCH/FRAMEBENCH/KEYBENCH/
  BELLBENCH) and the two-letter prefix do not affect the handling grade —
  do not build your rule around them.
- Do not include any test code's grade anywhere except in the `## Labels`
  section's 15 lines.
