## Approach
Read the source code of `paginate` line by line and documented every parameter, return field, error condition, and boundary behavior directly from what the code does — not from conventional pagination assumptions.

## Key decisions
Documented that `totalPages` has a floor of 1 (even for empty arrays), that out-of-range pages return empty arrays without throwing, and that `perPage` defaults to 20 via a parameter default (so `undefined` triggers the default but `0` or negative values throw). The `hasNext` field is `page < totalPages`, not `pageItems.length > 0`.

## Trade-offs and limitations
The reference doc covers the full contract as implemented. One subtlety: `items.slice(start, start + perPage)` when `start` exceeds the array length returns an empty array rather than throwing — this is standard JavaScript slice behavior but worth calling out as a boundary case.

## Files read
- tests/api-documentation/apidoc-01-paginate-reference.md
