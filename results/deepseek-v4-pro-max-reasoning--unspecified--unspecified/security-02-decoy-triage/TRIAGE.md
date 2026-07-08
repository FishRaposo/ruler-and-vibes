| Label | Verdict | Detail |
|-------|---------|--------|
| A | VULNERABLE | Prototype pollution — `mergeRecipeSettings` copies all enumerable properties from user-controlled JSON onto `target`, including `__proto__`. Fix: `if (!Object.prototype.hasOwnProperty.call(target, key)) target[key] = {};` → replace with `if (!Object.hasOwn(target, key)) target[key] = {};` (check own properties only). |
| B | SAFE | The column name is resolved through a frozen allowlist (`SORT_COLUMNS`) via `hasOwnProperty`, and the value inserted into SQL is always one of the three hardcoded column names. No user-controlled string enters the query. |
| C | VULNERABLE | ReDoS — the regex `/^(([a-zA-Z]+)+)+$/` has nested quantifiers that cause catastrophic backtracking on long non-matching inputs. Fix: replace with `/^[a-zA-Z]+$/`. |
| D | SAFE | Uses `execFile` (not `exec`) with `recipeId` passed as a separate argument array element, so no shell interpolation occurs. The `String()` cast prevents prototype-pollution tricks on the argument. |
| E | VULNERABLE | XSS — `innerHTML` assignment with unsanitized user-controlled `description` allows arbitrary script injection. Fix: `container.textContent = description;` |
| F | SAFE | Uses `textContent` which sets plain text — no HTML parsing occurs, so even malicious markup in `title` is rendered as literal text, not executed. |
| G | VULNERABLE | Command injection — `exec` (not `execFile`) concatenates `hostname` into a shell command string. An attacker controlling `hostname` can inject shell metacharacters. Fix: use `execFile('ping', ['-c', '1', hostname], cb)` |
| H | SAFE | A static, hardcoded array of strings. `Math.random()` is not seeded by any user input. The function reads from a fixed set and returns a value — no injection surface, no data flow from user input. |
