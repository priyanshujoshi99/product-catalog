import { useState, useEffect } from 'react';

const PAGE_SIZE = 12;

export function usePagination<T>(items: T[]) {
  const [page, setPage] = useState(1);

  // Reset to first page whenever the item list changes (filter/sort)
  useEffect(() => {
    setPage(1);
  }, [items]);

  const visibleItems = items.slice(0, page * PAGE_SIZE);
  const hasMore = visibleItems.length < items.length;

  function loadMore() {
    if (hasMore) setPage((p) => p + 1);
  }

  return { visibleItems, hasMore, loadMore };
}
