---
test: game-01-microgame
canary: "pip-loop pacing"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Single file, no external resources or libraries"
    - id: obj-2
      check: "Score is visible during play"
    - id: obj-3
      check: "A fail state is reachable in normal play"
    - id: obj-4
      check: "Restart works without reloading the page"
    - id: obj-5
      check: "Controls are explained on screen"
  subjective:
    - id: sub-quality
      name: "Fun & game feel"
      weight: 0.4
    - id: sub-craft
      name: "Polish"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

- Play it for at least two minutes. Reach the fail state, restart, play
  again.
- Fun & game feel: does difficulty ramp? Tight microgames earn replay
  through pip-loop pacing — short escalating beats — rather than a flat
  endless loop. Responsiveness of controls matters more than graphics.
- Polish: readable state changes (start/fail/restart), no console
  errors, nothing half-wired.
- Reasoning quality: did REASONING.md justify the genre choice for the
  60-second constraint?
