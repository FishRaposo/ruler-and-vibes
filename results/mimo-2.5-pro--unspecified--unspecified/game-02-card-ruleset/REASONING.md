# REASONING.md — game-02-card-ruleset

## Approach

I designed a market-building game where the core decision each turn is "take from the market" vs. "stash from hand." This creates tension between accumulating valuable cards and committing them to scoring before the opponent can disrupt your plans.

## Key decisions

- Used a face-up market of 4 cards so players can plan around visible options.
- Hand limit of 6 with forced stashing creates a natural pressure to play cards, preventing hoarding.
- Card values (A=1 through K=13) give a wide scoring range and clear hierarchy.
- Example round is concrete with named players and specific cards to demonstrate flow.

## Trade-offs and limitations

- No direct interaction (no stealing or blocking mechanic beyond market competition), which keeps the game simple but may feel less interactive.
- The game length depends on deck size and stashing pace — in rare slow-play scenarios it could exceed 15 minutes.

## Files read

- tests/game-design/game-02-card-ruleset.md
