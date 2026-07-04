## Approach

I read the source paragraph and extracted the four load-bearing facts
the task requires to survive every rewrite: (a) cause = payment-system
integration problems, (b) old date = March 3, (c) new date = April 14,
(d) pre-order customers get 15% off. I then wrote three independent
versions targeting distinct audiences and registers, checking each one
against the fact list and against its own constraint (word count for
the summary, tone for the other two) before finalizing.

## Key decisions

- **Formal (investor update):** Used complete sentences, no
  contractions, a measured and slightly hedged tone ("recognize the
  inconvenience," "remain committed"), and led with the reason before
  the date change, since investors typically want cause-and-effect
  framing and reassurance of process rigor. Avoided the original's
  padding ("due to the fact that," "of a technical nature") while
  keeping the same level of formality.
- **Friendly (customer newsletter):** Used contractions, direct
  address ("you'll get"), an apologetic-but-upbeat tone, and framed the
  discount as a "thank-you" rather than "compensation" — matching how
  consumer newsletters usually soften a delay announcement without
  sounding legalistic.
- **Summary (25 words max):** Compressed to a single semicolon-joined
  sentence covering all four facts as tersely as possible: cause, both
  dates, and the discount. Verified word count by counting tokens
  directly; came in at 16 words, comfortably under the 25-word cap.
- Kept all facts numerically identical across versions (March 3,
  April 14, 15%) rather than rewording dates or the percentage, to
  avoid any risk of the "no new facts invented" constraint being read
  as also forbidding rounding or paraphrase drift.

## Trade-offs and limitations

- The formal version is fairly short for a real investor update (which
  in practice might include risk-mitigation detail or forward
  guidance); I kept it tight because the task only asks for a rewrite
  of the given paragraph's content, not an expanded investor memo.
- The friendly version leans casual; a different newsletter voice
  (more brand-specific, e.g. very playful or very minimal) is
  possible, but I picked a generally warm, plain-English customer-facing
  tone as a safe default since no specific brand voice was given.
- The one-sentence summary sacrifices nuance and warmth for density —
  it reads as a terse status line rather than a customer-friendly
  message, which is acceptable since the task defines it as an
  internal-style "summary," not a third audience-facing message.

## Files read

tests/writing/writing-02-registers.md
