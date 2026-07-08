# paginate(items, page, perPage)

## Parameters

- **`items`** (Array, required) — The array to paginate. Must be an actual Array; throws `TypeError` if not.
- **`page`** (number, required) — The 1-based page number to retrieve. Must be a positive integer (≥ 1); throws `RangeError` otherwise.
- **`perPage`** (number, optional, default `20`) — Number of items per page. Must be a positive integer (≥ 1); throws `RangeError` otherwise.

## Return object

| Field | Type | Description |
|---|---|---|
| `items` | Array | Slice of the input array for the requested page. |
| `page` | number | The requested page number (as passed in). |
| `perPage` | number | The items-per-page value used. |
| `totalItems` | number | Length of the input array. |
| `totalPages` | number | Ceiling of `totalItems / perPage`, with a floor of 1. An empty array still reports `totalPages: 1`. |
| `hasNext` | boolean | `true` if `page < totalPages`, `false` otherwise. |

## Errors thrown

| Condition | Error type |
|---|---|
| `items` is not an Array | `TypeError('items must be an array')` |
| `page` is not a positive integer or < 1 | `RangeError('page must be a positive integer')` |
| `perPage` is not a positive integer or < 1 | `RangeError('perPage must be a positive integer')` |

## Boundary behavior

- **Empty array**: `totalItems` is 0, `totalPages` is 1 (not 0), `items` is an empty array.
- **Page beyond `totalPages`**: `items` returns an empty array slice. `hasNext` is `false`. The function does NOT throw — it returns whatever `slice` produces at an out-of-range start index, which is an empty array.
- **Default `perPage`**: when omitted, `perPage` defaults to 20. The parameter uses a default value, not an `undefined` check — explicitly passing `undefined` still triggers the default of 20, but passing `0` or `-1` throws a `RangeError`.
