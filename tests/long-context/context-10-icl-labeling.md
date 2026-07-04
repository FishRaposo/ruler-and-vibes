---
id: context-10-icl-labeling
category: long-context
title: Induce-and-apply a labeling scheme from many examples
deliverables:
  - LABELS.md
---

## Task

Below are 60 labeled training examples of fictional shipment codes. Each
code has the form `XX-NNN-REGION-L`, where `XX` is a two-letter prefix,
`NNN` is a numeric field, `REGION` is one of five region names, and `L`
is a single trailing letter. Each example is paired with a label from a
closed set of four tiers: `Tier-1`, `Tier-2`, `Tier-3`, or `Tier-4`.

The rule that determines each code's tier is NOT stated anywhere — you
must induce it from the 60 labeled examples. The rule is deterministic:
every one of the 60 examples is consistent with a single fixed rule,
and that same rule determines the tier of any new code.

Produce `LABELS.md` containing, in this order:

1. A `## Rule` section stating, in your own words, the rule you
   induced from the training examples.
2. A `## Labels` section with exactly 15 lines, `T1:` through `T15:`,
   each giving your predicted tier for the corresponding test code
   below, formatted exactly `Tn: Tier-k`.

### Training Examples (60, labeled)

1. TF-100-NORTH-C -> Tier-2
2. WW-283-CENTRAL-C -> Tier-4
3. GN-152-CENTRAL-A -> Tier-1
4. ZW-243-SOUTH-B -> Tier-3
5. VN-114-SOUTH-D -> Tier-2
6. ZW-166-NORTH-D -> Tier-2
7. YN-152-CENTRAL-C -> Tier-2
8. FF-101-NORTH-C -> Tier-4
9. NN-113-SOUTH-B -> Tier-3
10. SW-165-NORTH-B -> Tier-3
11. WW-205-WEST-A -> Tier-3
12. QF-139-WEST-B -> Tier-3
13. DW-283-CENTRAL-A -> Tier-3
14. JF-139-WEST-D -> Tier-4
15. RN-270-WEST-B -> Tier-1
16. PW-205-WEST-C -> Tier-4
17. QF-256-EAST-A -> Tier-1
18. TF-179-SOUTH-A -> Tier-3
19. BF-100-NORTH-A -> Tier-1
20. DW-126-EAST-A -> Tier-1
21. BF-178-SOUTH-C -> Tier-2
22. FF-218-CENTRAL-D -> Tier-2
23. CN-192-EAST-D -> Tier-2
24. TF-257-EAST-C -> Tier-4
25. GN-113-SOUTH-D -> Tier-4
26. DW-204-WEST-C -> Tier-2
27. FF-140-WEST-B -> Tier-1
28. MF-179-SOUTH-C -> Tier-4
29. GN-230-NORTH-C -> Tier-2
30. YN-231-NORTH-A -> Tier-3
31. HW-127-EAST-C -> Tier-4
32. PW-244-SOUTH-B -> Tier-1
33. PW-127-EAST-A -> Tier-3
34. KN-192-EAST-B -> Tier-1
35. MF-218-CENTRAL-B -> Tier-1
36. HW-166-NORTH-B -> Tier-1
37. NN-230-NORTH-A -> Tier-1
38. LW-165-NORTH-D -> Tier-4
39. HW-244-SOUTH-D -> Tier-2
40. XF-140-WEST-D -> Tier-2
41. JF-178-SOUTH-A -> Tier-1
42. RN-231-NORTH-C -> Tier-4
43. QF-217-CENTRAL-D -> Tier-4
44. RN-153-CENTRAL-A -> Tier-3
45. CN-114-SOUTH-B -> Tier-1
46. LW-204-WEST-A -> Tier-1
47. BF-257-EAST-A -> Tier-3
48. MF-101-NORTH-A -> Tier-3
49. XF-217-CENTRAL-B -> Tier-3
50. VN-191-EAST-B -> Tier-3
51. KN-153-CENTRAL-C -> Tier-4
52. KN-270-WEST-D -> Tier-2
53. NN-191-EAST-D -> Tier-4
54. SW-243-SOUTH-D -> Tier-4
55. SW-282-CENTRAL-A -> Tier-1
56. WW-126-EAST-C -> Tier-2
57. CN-269-WEST-B -> Tier-3
58. JF-256-EAST-C -> Tier-2
59. VN-269-WEST-D -> Tier-4
60. LW-282-CENTRAL-C -> Tier-2

### Test Codes (15, unlabeled — classify each one)

- T1: KX-42-NORTH-B
- T2: QN-58-SOUTH-D
- T3: RT-77-EAST-A
- T4: ZV-91-WEST-C
- T5: HB-24-NORTH-A
- T6: LM-66-CENTRAL-D
- T7: PW-15-SOUTH-B
- T8: JD-83-EAST-D
- T9: FN-36-WEST-B
- T10: VC-48-NORTH-C
- T11: GT-63-CENTRAL-A
- T12: SK-97-SOUTH-D
- T13: YB-12-EAST-A
- T14: MW-74-WEST-D
- T15: ER-29-NORTH-B

## Deliverables

- `LABELS.md` containing, in order: a `## Rule` section describing the
  induced rule in your own words, and a `## Labels` section with
  exactly 15 lines `T1:` through `T15:`, each `Tn: Tier-k`.

## Constraints

- The region name (NORTH/SOUTH/EAST/WEST/CENTRAL) and the two-letter
  prefix do not affect the tier — do not build your rule around them.
- Do not include any test code's label anywhere except in the
  `## Labels` section's 15 lines.
