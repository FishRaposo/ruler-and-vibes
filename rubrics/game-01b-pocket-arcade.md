---
test: game-01b-pocket-arcade
canary: "parasol loosestrife"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Single file, no external resources or libraries"
    - id: obj-2
      check: "Running tally (score) is visible during play"
    - id: obj-3
      check: "A losing condition is reachable in normal play"
    - id: obj-4
      check: "A fresh attempt starts without refreshing the page"
    - id: obj-5
      check: "Controls are spelled out on screen"
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
anchors:
  - id: Fun & game feel
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Polish
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `game-01-microgame` (same construct, fresh surface).

If the phrase "parasol loosestrife" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

- Open `toy.html` from `file://` and play it for at least two minutes.
  Reach the losing condition, start a fresh attempt, play again.

- obj-1 — Single file, no external resources or libraries. Everything
  ships inside the one `toy.html`: CSS and JS inline, no network fetch.
  - PASS: one file with inline `<style>` and `<script>`; nothing loaded
    over the network.
  - PASS: a small asset embedded as a `data:` URI (self-contained, no
    external host).
  - FAIL: a `<script src="https://…">` or `<link href="https://…">`
    pulling a CDN library, framework, or font.
  - FAIL: references a sibling file (`game.js`, `style.css`, an image
    path) that the single deliverable does not include.

- obj-2 — Running tally (score) is visible during play. A numeric score,
  count, streak, or equivalent is shown on screen and updates as you
  play, not only on the game-over screen.
  - PASS: a "Score: N" (or hits/points/streak) readout that visibly
    increments during a run.
  - PASS: the tally is rendered on a canvas HUD and changes while playing.
  - FAIL: the score appears only after the losing condition, never during
    play.
  - FAIL: no tally of any kind is displayed at any point.

- obj-3 — A losing condition is reachable in normal play. Ordinary play
  can actually end the attempt — running out of lives/time, a fatal
  collision, a missed target, etc. — not merely a theoretical one.
  - PASS: three misses (or a timeout, or a hit) ends the attempt and a
    game-over state is shown.
  - PASS: a timer or health bar that empties and stops the run.
  - FAIL: the toy loops forever with no way to lose; you can only quit by
    closing the tab.
  - FAIL: a losing branch exists in code but is unreachable under the
    stated controls (e.g. lives never decrement).

- obj-4 — A fresh attempt starts without refreshing the page. After the
  losing condition, the player can begin again through in-page UI (a
  button or key), and state (score, lives, timer) resets — without a
  browser reload.
  - PASS: a "Play again" button or key that resets state and resumes in
    the same page load.
  - PASS: reaching game over auto-restarts a clean attempt in-page after
    a short pause.
  - FAIL: the only way to replay is refreshing the page or calling
    `location.reload()`.
  - FAIL: a restart control exists but leaves the old score/lives intact,
    so no genuinely fresh attempt begins.

- obj-5 — Controls are spelled out on screen. The player learns the
  controls from the page itself (before or during play), not from
  external docs or guesswork.
  - PASS: an on-screen line such as "Click the matching swatch" or
    "Arrow keys to move, Space to jump".
  - PASS: a brief instructions panel or overlay shown before the first
    attempt.
  - FAIL: no control hints anywhere on the page; the player must guess
    which keys or clicks do anything.
  - FAIL: controls are described only in a comment in the source or in
    REASONING.md, never on the rendered page.

- Fun & game feel: does difficulty ramp? Tight toys earn replay through
  short escalating beats — speeding up, tightening tolerances, stacking
  pressure — rather than a flat, unchanging loop. Responsiveness of the
  controls matters more than the graphics.

- Polish: readable state changes (start / lose / fresh attempt), no
  console errors, nothing half-wired or dead on the page.

- Reasoning quality: did REASONING.md justify the genre choice against
  the one-minute-to-enjoy constraint, and name a design risk it steered
  around (a runaway difficulty curve, an unloseable loop, an unreadable
  HUD)?
