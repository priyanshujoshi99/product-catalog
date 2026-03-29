import { useState } from 'react';

const PAGE_SIZE = 12;

export function usePagination<T>(items: T[]) {
  const [page, setPage] = useState(1);
  const [prevItems, setPrevItems] = useState(items);

  // Reset to first page during render when items change (filter/sort).
  if (prevItems !== items) {
    setPrevItems(items);
    setPage(1);
  }

  const visibleItems = items.slice(0, page * PAGE_SIZE);
  const hasMore = visibleItems.length < items.length;

  function loadMore() {
    if (hasMore) setPage((p) => p + 1);
  }

  return { visibleItems, hasMore, loadMore };
}
