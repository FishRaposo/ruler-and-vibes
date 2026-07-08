## Approach
Tracked belief states after each event. Nora and Piet start with shared knowledge. The key is that Nora never observes the key move and never learns about it, so her belief remains at its last observed state (BLUE_BOX). Piet directly observed and performed the relocation, so his belief matches reality.

## Belief state trace

Event 1: Nora places key in BLUE_BOX. Both see this. Reality=BLUE_BOX. Nora=BLUE_BOX. Piet=BLUE_BOX.

Event 2: Nora leaves. Her mental model is frozen at the state she last observed. She cannot update because she has no sensory access.

Event 3: Piet moves key to GREEN_BASKET. Reality updates to GREEN_BASKET. Piet's belief updates to GREEN_BASKET (he performed the action). Nora's belief does not change — she is unaware.

Event 4: Nora returns but does not inspect either container. No observation occurs, so no belief update triggers. Nora still believes key is in BLUE_BOX.

Question 5 (Piet-thinks-Nora-looks): Piet knows Nora was absent during the move and that she hasn't inspected either container upon returning. Piet understands Nora's belief is outdated, so he predicts she will look in BLUE_BOX (where she left it).

## Files read
- tests/theory-of-mind/tom-01-sally-anne.md
