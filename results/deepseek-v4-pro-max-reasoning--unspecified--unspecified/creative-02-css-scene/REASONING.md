## Approach
Built a pure-CSS animated scene of a lighthouse on a cliff at dusk using HTML/CSS only. The lighthouse sits on a rocky cliff with a rotating light beam animation. Stars twinkle in the dusk sky and gentle waves animate at the base.

## Key decisions
Used CSS `@keyframes` for the beam sweep rotation and star twinkling (opacity pulses). The lighthouse is built from stacked divs with border-radius for the tower taper and gradient fills. The cliff uses clip-path polygon for a jagged silhouette. The dusk sky uses a linear gradient from dark blue to orange at the horizon. Stars are small absolutely-positioned divs with alternating animation delays for the twinkle effect.

## Trade-offs and limitations
The scene is minimal in detail due to the no-JS/no-image constraint. Shapes are rendered with divs/css-shapes which limits organic detail. The lighthouse beam is a simple rotating gradient wedge rather than a realistic volumetric beam — this is a necessary simplification. Gradients approximate dusk lighting but can't fully capture atmospheric scattering.

## Files read
- tests/creative-visual/creative-02-css-scene.md
