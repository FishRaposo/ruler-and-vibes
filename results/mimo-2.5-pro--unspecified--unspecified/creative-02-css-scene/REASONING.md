# REASONING.md — creative-02-css-scene

## Approach

I built the scene using CSS gradients for sky and ocean, clip-path for the cliff shape, positioned divs for the lighthouse structure, and CSS animations for the light beam sweep, twinkling stars, and drifting waves.

## Key decisions

- Used a sweeping light beam animation (rotate transform) as the primary animation, with secondary star twinkle and wave drift animations.
- Created the lighthouse with stacked divs: base (white with red stripes), top cap, lantern room with glow.
- Used clip-path for the cliff to create an irregular rock silhouette.

## Trade-offs and limitations

- Pure CSS limits the realism compared to canvas or SVG, but meets the constraints.
- The scene is viewport-sized and may not scale well to very small screens.

## Files read

- tests/creative-visual/creative-02-css-scene.md
