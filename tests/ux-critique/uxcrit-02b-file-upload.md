---
id: uxcrit-02b-file-upload
category: ux-critique
title: "Critique a broken file-upload interaction with misleading feedback"
deliverables:
  - critique.md
---

## Task

Flow description (fictional cloud storage app **Cumulus**):

1. User opens a folder containing 47 photos.
2. User clicks "Upload files" and selects 12 photos (totaling 180 MB)
   from the system file picker.
3. After confirming the selection, an upload progress bar appears and
   fills from 0% to 100% over approximately 4 seconds.
4. The progress bar says "Upload complete." The file list still shows
   the old 47 items.
5. After 3 seconds, a toast appears: "3 of 12 files failed (quota
   exceeded)." No list of which files failed, and the toast dismisses
   automatically after 4 seconds.
6. User opens another folder and clicks "Upload files" again — the
   system file picker has reset to the home directory rather than the
   last-used folder.
7. User re-selects the same 12 files. The upload progress bar fills
   again, but this time the same 3 files fail silently — the toast
   from step 5 doesn't reappear because the app suppresses duplicate
   toasts within the same session.

Write `critique.md`:

## Problems
(&#8805;3 distinct UX problems)

## Severity
(label each problem P0/P1/P2)

## Fixes
(one concrete fix per problem)

## Deliverables

- `critique.md`

## Constraints

- 120–350 words.
- Must call out: misleading "upload complete" before partial-failure
  notification, missing per-file failure detail after toast dismiss,
  and file-picker state reset losing user context (three themes).
