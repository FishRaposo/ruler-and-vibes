---
id: research-03c-mesh-booster-throughput
category: research-synthesis
title: Grading uneven evidence on a Wi-Fi booster's throughput claim
deliverables:
  - evidence-brief.md
---

## Task

Below are six sources addressing whether a fictional Wi-Fi signal booster,
the "Talbrook Range Extender," improves home network throughput, followed
by four claims that are commonly circulated about the product. The
sources vary widely in rigor — pay attention to sample size, independence,
and whether any finding has since been withdrawn or corrected.

Produce `evidence-brief.md` (at most 600 words, whole file) containing:

1. An evidence table grading all six sources, with columns covering at
   least source type, sample size (or N/A), and key finding.
2. A "Bottom line" section containing a line labeled exactly `Best
   supported estimate:` followed by your conclusion, plus a confidence
   statement.
3. A "Claims no source supports" section, drawn from the four commonly
   circulated claims below.

### Sources

#### S1 — Manufacturer marketing page (Talbrook Wireless)

Talbrook Wireless is proud to introduce the Talbrook Range Extender, our
flagship Wi-Fi signal booster for home networks. In our own product
trials, the Talbrook Range Extender triples your download speeds in a
single afternoon of setup — see the difference for yourself the moment
you plug it in. Households across the country have made the Talbrook
Range Extender part of their home office setup, tucking it into a
hallway outlet for a noticeable boost. We're so confident in the results
that we back every unit with our satisfaction guarantee. Try it in your
own home and see why so many households have made the switch this year.

#### S2 — Hobbyist testimonial blog post

I've been running the Talbrook Range Extender in my apartment this spring
and I have to say, I'm pretty happy with how much faster video calls
load compared to last year's setup. I plug it into the hallway outlet
between my router and my home office and just eyeball the difference
against the days before I installed it. Unrelated side note, I also
finally drove my grandmother to her pacemaker replacement surgery this
month — glad that appointment is finally behind us. Anyway, back to the
extender: I'd recommend giving it a try if you're curious, though I'm
just one renter and not running anything like a real controlled
experiment here.

#### S3 — Pilot study, n=10, published in a regional networking-hobbyist bulletin

This pilot study examined the effect of the Talbrook Range Extender on
home Wi-Fi throughput under controlled lab conditions, using a sample of
10 households split between extender and non-extender groups. Households
with the extender showed a +170% increase in measured throughput
compared to the control group over a one-week observation window.
Throughput was measured using an automated bandwidth-logging script
recording download speed every ten minutes. Given the small sample size,
we regard this as a preliminary finding meriting larger-scale replication
before any strong conclusions are drawn about the extender's
effectiveness across broader home network conditions.

#### S4 — Controlled multi-site trial, n=300

This study evaluated the Talbrook Range Extender's effect on home Wi-Fi
throughput using a randomized, blinded, multi-site design across 300
households. Households with the extender showed a throughput increase of
+9% relative to the control group (95% confidence interval: +3% to
+15%), a modest but statistically significant effect. This result is
notably smaller than figures reported in earlier, less rigorous testing,
and we believe the larger sample size, blinded measurement protocol, and
multi-site design make this the most reliable estimate of the extender's
true effect available to date.

#### S5 — Published correction notice

This notice formally corrects "Pilot Study of the Talbrook Range Extender
on Home Wi-Fi Throughput Under Controlled Conditions," previously
published by the same regional networking-hobbyist bulletin's authors. A
post-publication audit discovered that the study's bandwidth-logging
script double-counted retransmitted packets throughout the observation
period, systematically overstating measured throughput. Accordingly, the
study's reported +170% throughput increase is withdrawn and should not
be relied upon. The original authors have been notified of this
correction and support its publication. Readers seeking a reliable
estimate of the extender's effect on home Wi-Fi throughput should
consult more recent, properly logged research instead.

#### S6 — Trade-magazine overview

The Talbrook Range Extender has generated considerable buzz among home
networking enthusiasts and electronics retailers alike over the past
year. Early claims of dramatic throughput improvement, some suggesting
the extender could nearly triple home Wi-Fi speeds, have not held up
well once more rigorous, larger-scale controlled testing entered the
picture. Retailers report steady interest from customers regardless, and
the extender remains a popular seasonal seller. As with many
home-networking products, the gap between marketing claims and what
controlled research ultimately supports appears to be substantial in
this case, though the product does appear to have some genuine, if
modest, effect according to the more careful studies available.

### Commonly circulated claims

1. The Talbrook Range Extender triples your home Wi-Fi speeds.
2. The Talbrook Range Extender has been shown to increase throughput by a
   modest, single-digit-to-low-double-digit percentage in controlled
   testing.
3. The original clinical-sounding throughput claim was later formally
   withdrawn due to a measurement error.
4. The Talbrook Range Extender's radio emissions are safe for use around
   pacemakers and other implanted medical devices.

## Deliverables

- `evidence-brief.md` (at most 600 words, whole file): the evidence
  table, the "Bottom line" section with its labeled `Best supported
  estimate:` line, and the "Claims no source supports" section.

## Constraints

- The evidence table must have exactly 6 rows, one per source.
- The `Best supported estimate:` line and the "Claims no source
  supports" section are both mandatory, exact-labeled sections.
- `evidence-brief.md` total word count (whole file, `wc -w`) is at most
  600.
