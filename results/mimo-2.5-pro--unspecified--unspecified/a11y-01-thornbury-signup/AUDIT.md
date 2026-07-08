# Accessibility Audit — Thornbury Community Garden Signup

1. **Logo image missing alt text**
   - **Element:** `<img class="logo">` (first image in the card, the Thornbury logo)
   - **What:** The image has no `alt` attribute at all. Screen readers will announce the file name or raw source, which is meaningless.
   - **WCAG:** 1.1.1 Non-text Content (Level A)
   - **Risk:** A screen reader user has no idea what this image represents. It's the site logo and conveys the group's identity.

2. **Chart image has non-descriptive alt text**
   - **Element:** `<img class="chart" alt="image">` (the bar chart showing growth data)
   - **What:** The alt text is just "image", a generic placeholder that conveys no information about the chart's content (five ascending green bars suggesting growth).
   - **WCAG:** 1.1.1 Non-text Content (Level A)
   - **Risk:** A screen reader user hears "image" and learns nothing about the data the chart communicates.

3. **Decorative divider has informative alt text**
   - **Element:** `<img class="divider" alt="green leafy divider line">` (the horizontal rule between the chart and the form)
   - **What:** This image is purely decorative — it separates sections visually. It should have an empty `alt=""` so screen readers skip it entirely. Giving it descriptive alt text ("green leafy divider line") forces screen reader users to hear irrelevant content.
   - **WCAG:** 1.1.1 Non-text Content (Level A)
   - **Risk:** Unnecessary announcement clutters the screen reader experience and wastes user time.

4. **Email field label is not programmatically associated**
   - **Element:** `<span class="caption">Email address</span>` followed by `<input type="email" id="email-input">`
   - **What:** The visual label "Email address" is a `<span>`, not a `<label>`. There is no `for` attribute and no programmatic association. The `<span>` is not linked to the input in any way that assistive technology can detect.
   - **WCAG:** 1.3.1 Info and Relationships (Level A), 4.1.2 Name, Role, Value (Level A)
   - **Risk:** Screen reader users tabbing into the email field will not hear "Email address" announced. They won't know what the field is for.

5. **Name field label has mismatched `for`/`id`**
   - **Element:** `<label for="full-name-field">Your name</label>` paired with `<input type="text" id="name-input">`
   - **What:** The label's `for="full-name-field"` does not match the input's `id="name-input"`. The association is broken.
   - **WCAG:** 1.3.1 Info and Relationships (Level A), 4.1.2 Name, Role, Value (Level A)
   - **Risk:** Screen reader users will not hear "Your name" when they focus the name input. The field is effectively unlabeled.

6. **Submit button has no accessible name**
   - **Element:** `<button class="submit-btn" type="submit">` containing only an SVG arrow icon
   - **What:** The button contains only a decorative SVG arrow with no text, no `aria-label`, and no `title`. Screen readers will announce it as "button" with no indication of its purpose.
   - **WCAG:** 4.1.2 Name, Role, Value (Level A), 2.4.4 Link Purpose (Level A)
   - **Risk:** A screen reader user cannot determine what this button does. Submitting the form requires knowing which button to activate.
