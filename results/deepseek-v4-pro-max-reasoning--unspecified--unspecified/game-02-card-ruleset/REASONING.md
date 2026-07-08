## Approach
Designed a two-player card game that uses only a standard 52-card deck, emphasizing meaningful decisions over luck. Modeled it as a territory-control game where players build sequences to claim zones.

## Key decisions
Players draft cards from a shared market row and play them into personal tableau columns. The core tension is between taking a card for its face value vs. its suit (to build flush bonuses). Decided on a 10-zone layout to ensure the 10-20 minute constraint. The three-action turn structure (draw, play, or challenge) forces tradeoffs each turn.

## Trade-offs and limitations
The game relies on partial information (opponent's hand) which adds bluffing but may be hard for very casual players. Tiebreaking uses suit ranks (spades > hearts > diamonds > clubs) which is a convention players must learn.

## Files read
- tests/game-design/game-02-card-ruleset.md
