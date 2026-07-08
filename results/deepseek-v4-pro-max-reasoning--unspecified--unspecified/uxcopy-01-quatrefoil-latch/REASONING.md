## Approach
Mapped each of the six action keys to a button label and toast following all four constraint groups. Checked every button/toast pair for banned words (click, button, successfully, please, here) — none present. Added undo fields for the two destructive actions. Verified all toasts are complete sentences ending in a period and under 60 characters.

## Key decisions
Used imperative verbs for all buttons: Save, Publish, Invite, Archive, Remove, Delete. Toasts use passive-voice completion ("Draft saved." not "You saved the draft.") to stay concise. The undo affordance is a separate field with exactly "Undo" as the value. Banned-word check: no occurrence of "click", "button", "successfully", "please", or "here" anywhere in any button or toast text.

## Trade-offs and limitations
The toast texts are minimal — this is intentional to stay under 60 characters. A real product might want more contextual toasts (e.g., "Draft 'Q4 Report' saved.") but the task doesn't provide context to support that.

## Files read
- tests/ux-copy/uxcopy-01-quatrefoil-latch.md
