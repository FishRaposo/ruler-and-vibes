## Approach
Audited the HTML for accessibility defects in three categories: image alt text, form control labels, and programmatic associations. Applied WCAG criteria to each finding. Fixed all defects in fixed.html using the minimum changes needed.

## Key decisions
The logo conveys meaningful information (org identity) → needs descriptive alt text. The chart is informational → replaced generic "image" alt with a description. The divider is purely decorative → changed to `alt=""` so screen readers skip it. The email field used a `<span>` as a pseudo-label → replaced with a proper `<label>` element with matching `for`/`id`. The name field had a mismatched `for` → corrected to match. The submit button had no text → added `aria-label="Subscribe to newsletter"` and `aria-hidden="true"` on the decorative SVG.

## Trade-offs and limitations
The chart description "Bar chart showing volunteer membership growth over five periods" is an inference from the SVG data (5 bars of increasing height). The actual chart content may represent something else — I chose the most reasonable interpretation visible from the bar heights and context.

## Files read
- tests/accessibility/a11y-01-thornbury-signup.md
