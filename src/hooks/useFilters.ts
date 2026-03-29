import { useState, useMemo } from 'react';
import type { Product, FilterState } from '../types/product';
import { applyFilters } from '../utils/filterUtils';
import { applySort } from '../utils/sortUtils';

export const DEFAULT_FILTERS: FilterState = {
  search: '',
  category: '',
  priceMin: '',
  priceMax: '',
  minRating: 0,
  stockStatus: 'all',
  sortBy: '',
};

export function useFilters(products: Product[]) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const filteredProducts = useMemo(() => {
    const filtered = applyFilters(products, filters);
    return applySort(filtered, filters.sortBy);
  }, [products, filters]);

  function setAllFilters(newFilters: FilterState) {
    setFilters(newFilters);
  }

  function updateFilter<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function clearFilters() {
    setFilters(DEFAULT_FILTERS);
  }

  return { filters, filteredProducts, setAllFilters, updateFilter, clearFilters };
}
