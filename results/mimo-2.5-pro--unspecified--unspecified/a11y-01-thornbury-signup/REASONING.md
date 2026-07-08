# REASONING.md — a11y-01-thornbury-signup

## Approach

I read through the HTML source line by line, checking every image element and form control against WCAG 2.1 Level A requirements for text alternatives (1.1.1), info and relationships (1.3.1), and name/role/value (4.1.2). I distinguished between informational and decorative images, and checked whether each form input had a programmatically-associated label.

## Key decisions

- **Logo image**: Added descriptive alt text identifying it as the Thornbury Community Garden logo, since it conveys organizational identity.
- **Chart image**: Replaced the placeholder "image" alt with a meaningful description of what the chart shows (membership growth over five years).
- **Divider image**: Changed to `alt=""` because it's purely decorative — a visual separator with no informational content. Announcing it to screen readers adds noise.
- **Email field**: Converted the `<span class="caption">` to a `<label for="email-input">` so the association is programmatic.
- **Name field**: Fixed the `for` attribute from `full-name-field` to `name-input` to match the actual input `id`.
- **Submit button**: Added `aria-label="Submit signup form"` since the button only contains a decorative SVG arrow with no text.

## Trade-offs and limitations

- The chart alt text ("Bar chart showing steady membership growth over five years") is a reasonable approximation from the visual data but may not precisely match every data point. A full data table alternative would be more thorough but was not requested.
- I preserved the `<label class="caption">` approach for the email field to keep the visual styling identical, which is slightly unusual but functionally correct.

## Files read

- tests/accessibility/a11y-01-thornbury-signup.md
