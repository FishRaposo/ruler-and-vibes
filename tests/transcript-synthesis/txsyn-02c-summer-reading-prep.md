---
id: txsyn-02c-summer-reading-prep
category: transcript-synthesis
title: Library prep commitments versus musings
deliverables:
  - commitments.json
  - RATIONALE.md
---

## Task

Below is a transcript of an async prep thread for a public library branch.
Five people post updates: four staff members and one branch coordinator.
Some lines are firm, first-person commitments to a specific, owned
deliverable. Others are idle musings or hedged hypotheticals that only
sound like commitments.

Produce `commitments.json` listing ONLY the firm commitments — excluding
every musing, no matter how it's phrased — plus `RATIONALE.md` explaining
your inclusion/exclusion calls.

A line counts as a firm commitment only if it is unhedged first-person
future language ("I will...", "I'll...") attached to a concrete,
identifiable deliverable, with an explicit or clearly implied deadline.
A line is a musing, and must be EXCLUDED, if it contains any of these
hedge words or phrases: **"maybe", "might", "someday", "eventually",
"probably", "we'll see"** (case-insensitive) — even if it is otherwise
phrased like a commitment.

The five participants: Odette Lindqvist, Soraya Petrova, Devon Ashworth,
Naledi Brooks (staff), and Bridget Callahan (branch coordinator, who only
asks questions and status-checks — Bridget makes zero commitments in this
transcript).

### Async Prep Thread — #summer-reading-prep, Monday

1. Bridget: Morning all — quick async check-in since a few of us are
   covering the desk today. Post updates in-thread whenever you get a sec.
2. Odette: Morning. Main thing from me: I will have the summer reading
   program schedule finalized by Friday. That's the big blocker for
   everyone else this week.
3. Bridget: Great to hear. Any risk to that Friday date?
4. Odette: Not that I can see right now, the last venue conflict got
   resolved yesterday.
5. Odette: Separate thought, not urgent at all — I'm thinking I'll
   probably get to redoing the picture-book display shelves at some
   point, we'll see, no promises on timing there.
6. Bridget: No worries, the shelves aren't blocking anyone this week.
7. Soraya: Picking up from Odette — once the program schedule's locked,
   I'll send the volunteer shift assignments by EOD the same day, I've
   already got most of the roster drafted.
8. Soraya: Totally separate tangent, just spitballing here: we could
   maybe start a teen volunteer badge program someday if we ever have a
   quiet month, not pushing for it now or anything.
9. Bridget: Noted, no action needed on that one for now.
10. Devon: Update from me — the mic setup for the kickoff keeps coming up
    in feedback as a nice-to-have fix. It might be nice to upgrade the
    whole PA system eventually, but that's not where my head's at this
    week.
11. Bridget: Understood, what IS where your head's at this week, Devon?
12. Devon: Mostly just routine equipment checks, and reviewing Odette's
    room-booking plan when it lands.
13. Devon: Oh, and yeah — almost forgot to mention it, the projector in
    the community room has been flickering — I'll fix the projector
    today, no question, it's been annoying everyone during the
    after-school programs.
14. Bridget: Appreciate you flagging that, it's been a pain.
15. Naledi: Checking in late — once Odette's schedule is locked, I'll
    post the summer reading flyers and social graphics the same day so
    families see them in time.
16. Bridget: Sounds good. Anyone blocked on anything from me?
17. Naledi: Nothing from my side, just wanted to flag the flyer
    dependency on Odette's schedule landing first.
18. Bridget: Perfect, thanks everyone — same time next week.

## Schema for `commitments.json`

A single JSON object with EXACTLY these keys:

- `commitments` — array of objects, each with EXACTLY
  `{owner, deliverable, due}`, one per firm commitment found. `owner` is
  the speaker's first name; `deliverable` is a short description of what
  they committed to; `due` is the stated or clearly implied deadline.

## Deliverables

- `commitments.json` — the object described above.
- `RATIONALE.md` (at most 300 words, whole file, `wc -w`) — explain which
  lines you included and excluded, and why.

## Constraints

- `commitments.json` must parse with `JSON.parse`. No trailing commas, no
  comments, no extra keys.
- Include a line only if it is unhedged first-person future language tied
  to a concrete deliverable with a deadline. Exclude anything containing
  "maybe", "might", "someday", "eventually", "probably", or "we'll see",
  regardless of how confident the rest of the sentence sounds.
- Do not include any commitment from Bridget — she does not commit to
  anything in this transcript.
- `RATIONALE.md` must be at most 300 words (whole file, `wc -w`).
