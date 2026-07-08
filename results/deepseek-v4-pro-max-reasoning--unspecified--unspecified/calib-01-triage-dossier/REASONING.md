## Approach
Read the dossier and answered all 10 questions based on what the data entails, what it partially supports but cannot uniquely resolve, and what it is silent on.

## Key decisions
- Q1 (A-3 award): Answerable — table says "Awarded, 82000".
- Q2 (highest award): Answerable — among known award amounts (76000, 82000, 54000, 61000), A-3 at 82000 is highest. A-2 and A-4 are not in the comparison (pending decision/override before score entered) but their awards are either unset or below 82000.
- Q3 (earliest submission): Answerable — A-3 submitted 2026-01-22, earliest of all.
- Q4 (A-1 score): Answerable — 8.7.
- Q5 (Panel B average score): Underdetermined — A-3 has 9.1 but A-4's score is "Pending review". Without A-4's score, we can't compute the average.
- Q6 (A-2 approved?): Underdetermined — status is "Decision pending," so not yet approved or denied. We know it wasn't awarded yet but the final decision is unknown.
- Q7 (overall average): Underdetermined — A-4's score is missing.
- Q8 (A-4 score): Underdetermined — "Pending review" means the score is not yet entered, not that it's missing data. We know it hasn't been assigned yet.
- Q9 (Panel C chair): Missing — dossier explicitly states "Panel chairs are not identified."
- Q10 (A-4 score vs Panel B avg): Underdetermined — we can't compute Panel B's average (A-4 missing), and A-4's own score is also pending.

## Files read
- tests/calibration/calib-01-triage-dossier.md
