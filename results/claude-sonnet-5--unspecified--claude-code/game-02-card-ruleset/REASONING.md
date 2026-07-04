## Approach

I designed "Siege of Suits," a two-player trick-style game built
entirely from a standard 52-card deck (no jokers, nothing added),
centered on a simultaneous-reveal mechanic: both players play a card
face-down each round, then flip together. This avoids any need for
extra components (no trump suit call, no bidding tokens) while still
creating a real decision every round — which card to commit, given
imperfect information about the opponent's hand. I layered in a
"tie feeds a shared pot" rule to add push-your-luck tension and a
"Spoils Suit" (revealed at setup) to give scoring some variance
between games. I then wrote a full worked example (3 clashes) to
confirm the rules as written are sufficient to actually play the game
without any ambiguity, and trimmed prose repeatedly to fit the
800-word cap.

## Key decisions

- **Simultaneous face-down reveal instead of open trick-taking:** a
  standard trick-taking game where the second player sees the first
  player's card before responding often reduces to a fairly mechanical
  "always play just-high-enough" strategy. Blind simultaneous
  commitment keeps both players guessing and makes the choice of
  which card to risk each round a genuine bluffing/probability
  decision, which better satisfies "meaningful decisions, not pure
  luck" than a fully open-information trick game would.
- **Loser-leads-next rule:** I needed some rule to determine who plays
  first each clash (since there's no trick-winner-leads convention
  possible under blind reveal). I chose "loser leads next" so that
  losing a clash has a partial consolation (tempo/choice of timing),
  which keeps the game from being purely "whoever has better cards
  wins everything" — it creates a rubber-band dynamic.
- **Tie-pot with a 4-tie safety valve:** ties needed a resolution
  since equal ranks are common in a 52-card deck (13 ranks x 2 copies
  each across suits... actually 4 copies each, one per suit). Rather
  than a coin flip (adds randomness) or discard (wastes cards oddly),
  I made ties accumulate into a pot that the next clash winner sweeps
  — this raises the stakes of subsequent clashes and rewards patience.
  I added an explicit cap (split evenly after 4 consecutive ties) and
  an explicit hands-empty-mid-chain case, specifically because an
  open-ended tie chain could otherwise stall or leave an edge case
  the rules didn't cover, which the constraints explicitly forbid.
- **Doubled Spoils Suit for scoring, not for winning clashes:** I kept
  clash resolution suit-blind (rank only) to keep the moment-to-moment
  decision simple (compare one number), while still giving the game a
  scoring twist and a reason to sometimes fight harder for a
  seemingly weak card if it's in the Spoils Suit.
- **Word budget:** the first draft (~1440 words) was thorough but
  almost double the 800-word cap; I rewrote it tighter, cutting
  repeated restatements and combining setup steps, down to 782 words,
  while deliberately keeping the two rules most likely to create
  "uncovered situations" (the tie safety valve and the hands-empty
  edge case) rather than cutting those for length.

## Trade-offs and limitations

- The game has no bluffing "tells" beyond hand-strength intuition and
  the visible, shrinking Draw Pile — there's no communication or
  betting layer, so the decision space, while real, is narrower than a
  full card-and-bidding game like Skat or Euchre. This was an
  intentional scope choice to fit 800 words and a 10-20 minute match
  using only a bare deck.
- Match length (10-20 minutes) is an estimate based on 26 total
  clashes in the base case (52 cards / 2 per clash) plus occasional
  tie-chain overhead; I did not playtest this personally, so actual
  timing could run faster or slower depending on how much players
  deliberate per clash.
- The early-win-at-21 rule requires a player to mentally verify "the
  opponent cannot catch up" using remaining-card math, which is a bit
  fiddly to do by hand mid-game; players who don't want to compute
  this can simply ignore early wins and always play to full deck
  exhaustion, since the rules also fully specify that terminal
  condition.
- I did not add a formal rule for what happens if the deck cannot be
  shuffled fairly or if players want a shortened variant — out of
  scope for the deliverable, which asks for one complete ruleset.

## Files read

tests/game-design/game-02-card-ruleset.md
