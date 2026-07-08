# paginate(items, page, perPage)

Extracts a single page of results from an array.

## Parameters

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `Array` | — | The source array to paginate. |
| `page` | `integer` (≥ 1) | — | The 1-based page number to return. |
| `perPage` | `integer` (≥ 1) | `20` | Number of items per page. |

## Returns

An object with the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `items` | `Array` | The slice of `items` for the requested page. May be empty if `page` exceeds `totalPages`. |
| `page` | `integer` | Echo of the requested page number. |
| `perPage` | `integer` | Echo of the effective per-page value. |
| `totalItems` | `integer` | Length of the original `items` array. |
| `totalPages` | `integer` | Total number of pages, computed as `Math.ceil(totalItems / perPage)`. Minimum value is `1` (even for an empty array). |
| `hasNext` | `boolean` | `true` if `page < totalPages`. |

## Errors

- **`TypeError('items must be an array')`** — thrown when `items` is not an array.
- **`RangeError('page must be a positive integer')`** — thrown when `page` is not an integer or is less than 1.
- **`RangeError('perPage must be a positive integer')`** — thrown when `perPage` is not an integer or is less than 1.

## Boundary behavior

- **Empty array**: `paginate([], 1)` returns `totalPages: 1` (not 0) because `Math.max(1, Math.ceil(0/20))` forces a minimum of 1. `hasNext` is `false`.
- **Page beyond last page**: `paginate([1,2,3,4,5], 9, 2)` returns `items: []` — no error is thrown, the result is simply an empty page.
- **Last page shorter than perPage**: the final page contains only the remaining items; `items.length` may be less than `perPage`.
- **Default perPage**: when `perPage` is omitted it defaults to `20`, so `paginate(arr, 1)` returns up to the first 20 items.
