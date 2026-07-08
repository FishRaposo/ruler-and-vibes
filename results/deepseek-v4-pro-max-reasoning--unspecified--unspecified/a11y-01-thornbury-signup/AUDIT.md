1. **Logo image missing alt text** — The `<img class="logo">` has no `alt` attribute. Violates WCAG 1.1.1 (Non-text Content). Risk: screen reader users get no indication of the organization identity from the logo. The logo conveys meaningful information (it says "Thornbury") and needs descriptive alt text.

2. **Chart image has generic alt text** — The `<img class="chart" alt="image">` uses "image" as alt text, which is not descriptive. The chart is a bar graph showing presumably membership growth or similar data; the alt text should describe what the chart shows. Violates WCAG 1.1.1 (Non-text Content). Risk: screen reader users miss the information the chart conveys.

3. **Divider image marked as informative** — The `<img class="divider" alt="green leafy divider line">` is purely decorative but has descriptive alt text. Decorative images should have `alt=""` so screen readers skip them. Violates WCAG 1.1.1 (Non-text Content). Risk: screen reader users hear "green leafy divider line" which is noise, not content.

4. **Email field lacks a programmatically associated label** — The email input uses `<span class="caption">Email address</span>` which is not a `<label>` and is not associated with the input. The `for` attribute on the label below points to `full-name-field` but the input has `id="name-input"`. Violates WCAG 1.3.1 (Info and Relationships) and 3.3.2 (Labels or Instructions). Risk: screen reader users cannot determine which label belongs to which field.

5. **Name field label mismatched with input** — The `<label for="full-name-field">` points to an id that doesn't exist. The actual input has `id="name-input"`. Violates WCAG 1.3.1 (Info and Relationships) and 4.1.2 (Name, Role, Value). Risk: the programmatic association between label and input is broken, so screen readers cannot announce the label when the input is focused.

6. **Submit button has no accessible name** — The `<button class="submit-btn">` contains only an inline SVG with no text content and no `aria-label` or `title`. Violates WCAG 4.1.2 (Name, Role, Value). Risk: screen reader users hear "button" with no indication of what the button does.
