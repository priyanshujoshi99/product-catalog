import type { Product, FilterState } from '../types/product';

export function applyFilters(products: Product[], filters: FilterState): Product[] {
  return products.filter((p) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!p.title.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) {
        return false;
      }
    }

    if (filters.category && p.category !== filters.category) {
      return false;
    }

    if (filters.priceMin !== '' && p.price < filters.priceMin) {
      return false;
    }

    if (filters.priceMax !== '' && p.price > filters.priceMax) {
      return false;
    }

    if (filters.minRating > 0 && p.rating < filters.minRating) {
      return false;
    }

    if (filters.stockStatus === 'inStock' && p.stock === 0) {
      return false;
    }
    if (filters.stockStatus === 'outOfStock' && p.stock > 0) {
      return false;
    }

    return true;
  });
}

export function getUniqueCategories(products: Product[]): string[] {
  return Array.from(new Set(products.map((p) => p.category))).sort();
}
