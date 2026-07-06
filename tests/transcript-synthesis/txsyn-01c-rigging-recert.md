---
id: txsyn-01c-rigging-recert
category: transcript-synthesis
title: Season production decisions and action items
deliverables:
  - decisions.json
  - SUMMARY.md
---

## Task

Below is a transcript of a production-planning call among four members of
a theater company. Over the course of the meeting the group makes a
decision, then later reverses part of that decision after new information
surfaces. Some action items assigned earlier in the meeting are cancelled
by the reversal; others survive it.

Produce `decisions.json` capturing the **final** state of the world after
the meeting ends — not a chronological log of everything said — plus
`SUMMARY.md`, a short human-readable summary.

### Season Planning — Meridian Playhouse, Monday production call

The following is a lightly cleaned transcript of an ad hoc season-planning
call. Four people attended: Naomi Halloway (artistic director), Esteban
Ferreira (technical director), Colette Beaulieu (stage manager,
safety-adjacent), and Idris Kwan (front-of-house and programming
manager). Lines are numbered sequentially for reference.

1. Naomi: Thanks for making time, this should be quick. We need to lock
   down what we're programming this season before the patron letter goes
   out Friday.
2. Idris: Agreed. Top of the list is the mainstage show, Nightfall
   Overture — where are we?
3. Esteban: Nightfall is built on my end. The set and the flying pieces
   are assembled and the lighting plot is finalized on the mainstage.
4. Naomi: Great. Given that, I think we should stage Nightfall Overture
   this season. Any objections?
5. Idris: None from programming. Nightfall has been requested by three of
   our biggest subscriber circles, I'd love to get it on the calendar.
6. Naomi: Okay, decision made: we stage Nightfall Overture this season.
7. Idris: Naomi, can you finalize the subscriber rollout letter? We'll
   need a note covering the phased subscriber announcement before Friday.
8. Naomi: Sure, I'll own the rollout letter myself. Noted.
9. Esteban: I can also update the season board to reflect Nightfall moving
   to "staging this season" once we confirm.
10. Naomi: Perfect, do that, Esteban.
11. Idris: One more thing while we're all here — Colette, how's the studio
    recital coming along? That's the small opt-in evening for our
    workshop members.
12. Colette: Studio recital is basically done, just needs a final tech
    run. Should be easy to put up alongside Nightfall.
13. Naomi: Good, we'll bundle that in too.
14. Colette: Actually, hold on — before we lock this in, I want to flag
    something on the rigging side for Nightfall itself.
15. Colette: The fly-system counterweight rigging that carries the large
    flying set pieces hasn't been re-certified under a full production
    load. I only tested it with a lighter mock rig.
16. Naomi: How risky is that, concretely?
17. Colette: If we fly the full set as-is, there's a real chance the rig
    fails under load and drops a piece on crew during a scene change. I
    can't rule that out yet.
18. Esteban: I can confirm the fly system carries the load-bearing set
    directly, Colette's right to flag it.
19. Naomi: That's not a risk I want to take two days before the letter.
20. Idris: Agreed, that changes things. I don't think we can stage
    Nightfall itself this season if the rigging isn't safe.
21. Naomi: Okay, let's reverse course on Nightfall. We defer Nightfall
    Overture to next season, once Colette's had time to re-certify the
    rigging under a full production load.
22. Idris: Right, so to be clear for the record: we are NOT staging
    Nightfall Overture this season. It's deferred to next season. We put
    up only the studio recital this season, since that one's unrelated to
    the rigging risk.
23. Naomi: Exactly. Studio recital only, this season. Nightfall waits.
24. Naomi: And given that, scratch the rollout letter for now — no point
    writing a phased subscriber announcement for a show we're not staging
    yet. I'll pick that back up once Nightfall is actually going up.
25. Idris: Makes sense.
26. Colette: Since the studio recital is the one actually going up now, I
    can hand it off — Naomi, do you want to take it from "final tech run"
    to actually staged and ready to open?
27. Naomi: Yes, I'll take the studio recital myself and have it fully
    staged and performance-ready by opening night.
28. Naomi: Thanks. Esteban, the season-board update — repurpose that:
    instead of marking Nightfall as staging, move Nightfall to next season
    on the board and mark the studio recital as this season's show.
29. Esteban: Got it, I'll update the season board to move Nightfall to
    next season and show the studio recital as going up now.
30. Naomi: One more thing — Colette, can you give the box office a heads
    up that Nightfall itself isn't going up this season, so they're not
    caught off guard by patron questions?
31. Colette: Sure, I'll notify the box office that Nightfall is deferred
    to next season.
32. Idris: Great. So to summarize where we landed: Nightfall is deferred
    to next season pending the rigging re-certification, and the studio
    recital is the only thing going up this season.
33. Naomi: That's right. Thanks, everyone — talk Friday.

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
  BEFORE Colette raised the rigging concern is not the final decision.
- `action_items` must include only action items still open at the end of
  the call. An action item assigned earlier in the meeting and later
  explicitly retracted must not appear.
- Every `owner` value must be one of the four speaker names used in the
  transcript, spelled exactly as a first name appears in the speaker list
  above.
- `SUMMARY.md` must be at most 250 words (whole file, `wc -w`).
