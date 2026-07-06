---
id: txsyn-01b-broadcast-reversal
category: transcript-synthesis
title: Harvest Fair broadcast decisions and action items
deliverables:
  - decisions.json
  - SUMMARY.md
---

## Task

Below is a transcript of a planning meeting among four people at a
community radio station. Over the course of the meeting the group makes a
decision, then later reverses part of that decision after new information
surfaces. Some action items assigned earlier in the meeting are cancelled
by the reversal; others survive it.

Produce `decisions.json` capturing the **final** state of the world after
the meeting ends — not a chronological log of everything said — plus
`SUMMARY.md`, a short human-readable summary.

### Programming meeting — Aldergate Community Radio, Wednesday planning call

The following is a lightly cleaned transcript of an ad hoc programming
call. Four people attended: Tamsin Braithwaite (station manager), Ojo
Adeyemi (sound engineer), Petronella Whitlock (producer, safety-adjacent),
and Farhat Sundberg (programming lead). Lines are numbered sequentially
for reference.

1. Tamsin: Thanks for jumping on, this should be quick. We need to lock
   down what we're putting on air for the Harvest Fair on Saturday.
2. Farhat: Agreed. Top of the list is the live outdoor broadcast — where
   are we?
3. Ojo: The outdoor rig is ready on my end. Mixer, mics, and the mobile
   transmitter are all packed and tested.
4. Tamsin: Great. Given that, I think we should run the live outdoor
   broadcast from the riverside meadow this fair. Any objections?
5. Farhat: None from programming. Listeners have asked for a live fair
   broadcast for two years running, I'd love to finally deliver it.
6. Tamsin: Okay, decision made: we run the live outdoor broadcast from the
   riverside meadow this fair.
7. Farhat: Tamsin, can you draft the outdoor site plan? We'll need a
   document covering the stage-layout plan and cable routing before
   Saturday.
8. Tamsin: Sure, I'll own the site and stage-layout plan myself. Noted.
9. Ojo: I can also update the run-of-show board to reflect the live
   broadcast moving to "this fair's headline slot" once we confirm.
10. Tamsin: Perfect, do that, Ojo.
11. Farhat: One more thing while we're all here — Petronella, how's the
    pre-recorded interview series coming along? That's the "Voices of
    Aldergate" segment we cut in the studio.
12. Petronella: Voices of Aldergate is basically done, just needs a final
    review. Should be easy to air alongside the live broadcast.
13. Tamsin: Good, we'll slot that in too.
14. Petronella: Actually, hold on — before we lock this in, I want to flag
    something on the site-safety side for the outdoor broadcast itself.
15. Petronella: The riverside meadow's temporary power feed runs across
    the low-lying strip, and that strip floods after heavy rain. I checked
    this morning and the site permit still hasn't been cleared after this
    week's storms.
16. Tamsin: How risky is that, concretely?
17. Petronella: If we set up on the meadow as-is, there's a real chance a
    cable run sits in standing water with the public walking past. I can't
    sign off on that yet.
18. Ojo: I can confirm the power run crosses that flood-prone ground,
    Petronella's right to flag it.
19. Tamsin: That's not a risk I want to take two days before the fair.
20. Farhat: Agreed, that changes things. I don't think we can run the live
    outdoor broadcast this fair if the site isn't safe.
21. Tamsin: Okay, let's reverse course on the outdoor broadcast. We defer
    the live outdoor broadcast to next year's fair, once Petronella's had
    time to get the site properly assessed and permitted.
22. Farhat: Right, so to be clear for the record: we are NOT running the
    live outdoor broadcast this fair. It's deferred to next year. We air
    only the Voices of Aldergate segment this fair, since that one's cut in
    the studio and has nothing to do with the meadow.
23. Tamsin: Exactly. Interview segment only, this fair. The live broadcast
    waits.
24. Tamsin: And given that, scratch the site and stage-layout plan for now
    — no point drawing up a cable-routing document for a broadcast we're
    not running yet. I'll pick that back up once the outdoor broadcast is
    actually happening.
25. Farhat: Makes sense.
26. Petronella: Since the interview segment is the one actually airing now,
    I can hand it off — Tamsin, do you want to take it from "final review"
    to finalized and broadcast-ready?
27. Tamsin: Yes, I'll take the Voices of Aldergate segment myself and have
    it finalized and broadcast-ready by fair day.
28. Tamsin: Thanks. Ojo, the run-of-show board update — repurpose that:
    instead of marking the live broadcast as this fair's slot, move the
    live outdoor broadcast to next year on the board and mark the interview
    segment as this fair's slot.
29. Ojo: Got it, I'll update the run-of-show board to move the live outdoor
    broadcast to next year and show the interview segment as airing now.
30. Tamsin: One more thing — Petronella, can you give the venue-and-
    volunteer coordinator a heads up that the live outdoor broadcast isn't
    happening this fair, so they're not caught off guard setting up the
    meadow?
31. Petronella: Sure, I'll notify the venue-and-volunteer coordinator that
    the live outdoor broadcast is off for this fair.
32. Farhat: Great. So to summarize where we landed: the live outdoor
    broadcast is deferred to next year pending a site assessment, and the
    interview segment is the only thing airing this fair.
33. Tamsin: That's right. Thanks, everyone — talk Saturday.

## Schema for `decisions.json`

A single JSON object with EXACTLY these keys:

- `final_decision` — string describing the decision as it stands at the
  END of the meeting (not any earlier, superseded decision).
- `action_items` — array of objects, each with EXACTLY `{owner, task}`,
  listing only action items that are still open when the meeting ends.

## Deliverables

- `decisions.json` — the object described above.
- `SUMMARY.md` (at most 250 words, whole file, `wc -w`) — a short prose
  summary of the final decision and the open action items.

## Constraints

- `decisions.json` must parse with `JSON.parse`. No trailing commas, no
  comments, no extra keys.
- `final_decision` must reflect the reversal — the decision as it stood
  BEFORE Petronella raised the site-safety concern is not the final
  decision.
- `action_items` must include only action items still open at the end of
  the call. An action item assigned earlier in the meeting and later
  explicitly retracted must not appear.
- Every `owner` value must be one of the four speaker names used in the
  transcript, spelled exactly as a first name appears in the speaker list
  above.
- `SUMMARY.md` must be at most 250 words (whole file, `wc -w`).
