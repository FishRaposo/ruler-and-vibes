function paginate(items, page, perPage = 20) {
  if (!Array.isArray(items)) {
    throw new TypeError('items must be an array');
  }
  if (!Number.isInteger(page) || page < 1) {
    throw new RangeError('page must be a positive integer');
  }
  if (!Number.isInteger(perPage) || perPage < 1) {
    throw new RangeError('perPage must be a positive integer');
  }
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
  const start = (page - 1) * perPage;
  const pageItems = items.slice(start, start + perPage);
  const hasNext = page < totalPages;
  return {
    items: pageItems,
    page,
    perPage,
    totalItems,
    totalPages,
    hasNext,
  };
}

console.log(JSON.stringify(paginate([1,2,3,4,5], 1, 2)));
console.log(JSON.stringify(paginate([1,2,3,4,5], 3, 2)));
console.log(JSON.stringify(paginate([1,2,3,4,5], 9, 2)));
console.log(JSON.stringify(paginate([], 1)));
console.log(JSON.stringify(paginate([1,2,3,4,5], 1)));

module.exports = { paginate };
