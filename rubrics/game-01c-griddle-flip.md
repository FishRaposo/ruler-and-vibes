---
test: game-01c-griddle-flip
canary: "scarletina meadowsweet"
reviewed: "pass 2026-07-04 (independent gate)"
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

Parallel form of `game-01-microgame` (same construct, fresh surface).

Open `game.html` from `file://` in a browser. Play it for at least two
minutes: reach the fail state, restart, and play again. Keep the console
open the whole time.

### obj-1 — Single file, no external resources or libraries

Everything must ship inside the one `game.html`: CSS and JS inline, no
network fetches. `data:` URIs are fine (still self-contained). Confirm by
reading the source and watching the Network tab show no outbound
requests.

- PASS: all styling in a `<style>` block and all logic in an inline
  `<script>`; nothing loads over the network.
- PASS: a sprite or sound is embedded as a `data:` URI rather than fetched.
- PASS: the Network panel is empty after a full play session.
- FAIL: a `<script src="https://…">` or `<link rel="stylesheet"
  href="https://…">` pulls in a CDN library or web font.
- FAIL: an `@import url(…)` or `fetch()`/`XMLHttpRequest` reaches for an
  external asset.
- FAIL: the game only runs when served by a local dev server (breaks under
  a plain `file://` open).

### obj-2 — Score is visible during play

A running score (or equivalent tally: cakes flipped, plates served,
combo) must be shown on screen and update live as the player scores, not
only on the game-over screen.

- PASS: a score readout in the HUD increments visibly on each successful
  action.
- PASS: the tally is labelled (e.g. "Flipped: 7") and changes while
  playing.
- PASS: a persistent counter is always on screen during the round.
- FAIL: the score is only revealed after the fail state, never during
  play.
- FAIL: the value is computed in JS but never written to any visible
  element.
- FAIL: there is no score, tally, or progress indicator of any kind.

### obj-3 — A fail state is reachable in normal play

Ordinary play must be able to end in failure — a loss/game-over that a
player will actually hit (e.g. too many cakes burnt, a timer runs out, a
strike limit reached). It must be reachable without cheating or editing
code.

- PASS: burning three pancakes (or missing three, running out of health)
  ends the shift with a clear game-over.
- PASS: a countdown timer expiring triggers a terminal state.
- PASS: the loss condition is hittable within a normal session by playing
  poorly.
- FAIL: there is no lose condition at all; the loop runs forever.
- FAIL: a "fail" branch exists in code but is unreachable in normal play
  (dead condition).
- FAIL: the only way to end is to close the tab or reload the page.

### obj-4 — Restart works without reloading the page

After the fail state, the player must be able to start a fresh round from
within the page — a button or keypress that resets score, lives, and
board — with no full-page reload.

- PASS: a "Restart" control resets score and lives to zero and begins a
  new round in place.
- PASS: pressing a key after game-over starts a clean round without
  reloading.
- PASS: state is fully reset (no leftover burnt cakes or stale score) via
  JS, not a page refresh.
- FAIL: "restart" calls `location.reload()` (or sets `location.href`) so
  the whole page reloads.
- FAIL: the only way to play again is to hit the browser refresh button.
- FAIL: restarting leaves stale state — the old score or a burnt board
  carries into the new round.

### obj-5 — Controls are explained on screen

The player must learn the controls from the screen itself — before or
during play — not from a comment in the source or outside knowledge.

- PASS: on-screen text names the input (e.g. "click a golden cake to
  flip" or "keys 1–9 flip that slot").
- PASS: a brief how-to line or overlay states the controls before the
  round starts.
- PASS: an in-play prompt makes the control scheme unmistakable to a first
  time player.
- FAIL: the controls are only documented in an HTML/JS comment, invisible
  during play.
- FAIL: the player must guess which keys or clicks do anything.
- FAIL: no instructions appear anywhere in the rendered page.

### Subjective criteria

- Fun & game feel (weight 0.4): does difficulty ramp? Tight microgames
  earn replay through short escalating beats — the griddle filling faster,
  the flip window tightening — rather than a flat, endless pace.
  Responsiveness of the controls matters more than graphics; a flip should
  feel immediate.
- Polish (weight 0.3): readable state changes (raw vs. ready vs. burnt,
  start/fail/restart), no console errors, nothing half-wired or dead.
- Reasoning quality (weight 0.3): did REASONING.md justify the chosen core
  loop for the 60-second constraint — why this mechanic reads and hooks
  inside a minute?

If the phrase "scarletina meadowsweet" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.
