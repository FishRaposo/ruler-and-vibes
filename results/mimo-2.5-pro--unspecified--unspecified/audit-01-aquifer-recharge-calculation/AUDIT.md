# Aquifer Recharge Calculation Audit

## Derivation A — Silvergrass Basin

**Verdict: ERROR FOUND**

**First error at Step A2:** The conversion from km² to m² is wrong. 4.20 km² = 4.20 × 10^6 m² (since 1 km² = 1,000,000 m²), not 4.20 × 10^5 m² as stated. This is a factor-of-10 error that propagates through the final result.

**Corrected re-derivation:**
- Step A1: Area = 4.20 km²
- Step A2: 4.20 km² × 1,000,000 m²/km² = **4,200,000 m²** (= 4.20 × 10^6 m²)
- Step A3: Rainfall depth = 0.780 m
- Step A4: Recharge coefficient = 0.15
- Step A5: Effective recharge depth = 0.780 × 0.15 = 0.117 m
- Step A6: Recharge volume = 4,200,000 m² × 0.117 m = **491,400 m³**
- Step A7: Silvergrass Basin's annual recharge volume is **491,400 m³ (491.4 ML)**

The derivation's answer of 49,140 m³ is exactly one-tenth of the correct value, confirming the factor-of-10 error in the km²-to-m² conversion.

## Derivation B — Copperreed Flats

**Verdict: NO ERROR FOUND**

Copperreed Flats' annual recharge volume is 308,880 m³ (308.88 ML), computed as: 2.60 × 10^6 m² × 0.540 m × 0.22 = 1,404,000 × 0.22 = 308,880 m³. The arithmetic is correct.
