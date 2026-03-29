import { useState } from 'react';
import type { FilterState, SavedFilter } from '../types/product';

const STORAGE_KEY = 'product-catalog-saved-filters';

function load(): SavedFilter[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedFilter[]) : [];
  } catch {
    return [];
  }
}

function persist(filters: SavedFilter[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
}

export function useSavedFilters() {
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>(load);

  function saveFilter(name: string, filters: FilterState) {
    const entry: SavedFilter = {
      id: crypto.randomUUID(),
      name,
      filters,
      createdAt: Date.now(),
    };
    const updated = [...savedFilters, entry];
    persist(updated);
    setSavedFilters(updated);
  }

  function deleteFilter(id: string) {
    const updated = savedFilters.filter((f) => f.id !== id);
    persist(updated);
    setSavedFilters(updated);
  }

  return { savedFilters, saveFilter, deleteFilter };
}
