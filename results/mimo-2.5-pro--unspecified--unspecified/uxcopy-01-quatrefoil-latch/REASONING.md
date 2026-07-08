# REASONING.md — uxcopy-01-quatrefoil-latch

## Approach

I wrote imperative button labels (1-3 words) and concise toast messages (complete sentences under 60 characters) for each action. Destructive actions get a separate undo field.

## Key decisions

- All button labels start with an imperative verb and are 1-3 words.
- All toasts are complete sentences ending in one period, under 60 characters.
- Checked for banned words: none of click, button, successfully, please, here appear.
- Destructive actions (removeTeammate, deleteDraft) have undo: "Undo"; others have undo: null.

## Trade-offs and limitations

- Kept toasts minimal to stay well under 60 characters.

## Files read

- tests/ux-copy/uxcopy-01-quatrefoil-latch.md
