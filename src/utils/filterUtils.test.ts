import { describe, it, expect } from 'vitest';
import { applyFilters, getUniqueCategories } from './filterUtils';
import type { Product, FilterState } from '../types/product';

const baseFilter: FilterState = {
  search: '',
  category: '',
  priceMin: '',
  priceMax: '',
  minRating: 0,
  stockStatus: 'all',
  sortBy: '',
};

const products: Product[] = [
  {
    id: 1,
    title: 'Wireless Headphones',
    description: 'Great sound quality',
    category: 'electronics',
    price: 99.99,
    discountPercentage: 10,
    rating: 4.5,
    stock: 20,
    tags: [],
    brand: 'SoundCo',
    sku: 'WH-001',
    images: [],
    thumbnail: '',
    availabilityStatus: 'In Stock',
  },
  {
    id: 2,
    title: 'Running Shoes',
    description: 'Comfortable for long runs',
    category: 'footwear',
    price: 59.99,
    discountPercentage: 0,
    rating: 3.8,
    stock: 0,
    tags: [],
    brand: 'RunFast',
    sku: 'RS-002',
    images: [],
    thumbnail: '',
    availabilityStatus: 'Out of Stock',
  },
  {
    id: 3,
    title: 'Coffee Maker',
    description: 'Brews perfect coffee for every morning',
    category: 'kitchen',
    price: 149.99,
    discountPercentage: 5,
    rating: 4.8,
    stock: 5,
    tags: [],
    brand: 'BrewMaster',
    sku: 'CM-003',
    images: [],
    thumbnail: '',
    availabilityStatus: 'In Stock',
  },
];

describe('applyFilters', () => {
  it('returns all products when no filters are active', () => {
    expect(applyFilters(products, baseFilter)).toHaveLength(3);
  });

  describe('search filter', () => {
    it('filters by title (case-insensitive)', () => {
      const result = applyFilters(products, { ...baseFilter, search: 'headphones' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it('filters by description', () => {
      const result = applyFilters(products, { ...baseFilter, search: 'perfect coffee' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(3);
    });

    it('returns empty array when no match', () => {
      const result = applyFilters(products, { ...baseFilter, search: 'nonexistent' });
      expect(result).toHaveLength(0);
    });

    it('matches multiple products when search term is broad', () => {
      const result = applyFilters(products, { ...baseFilter, search: 'for' });
      expect(result).toHaveLength(2);
    });
  });

  describe('category filter', () => {
    it('filters by exact category', () => {
      const result = applyFilters(products, { ...baseFilter, category: 'electronics' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it('returns all products when category is empty string', () => {
      const result = applyFilters(products, { ...baseFilter, category: '' });
      expect(result).toHaveLength(3);
    });
  });

  describe('price filter', () => {
    it('filters by minimum price', () => {
      const result = applyFilters(products, { ...baseFilter, priceMin: 100 });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(3);
    });

    it('filters by maximum price', () => {
      const result = applyFilters(products, { ...baseFilter, priceMax: 60 });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2);
    });

    it('filters by price range', () => {
      const result = applyFilters(products, { ...baseFilter, priceMin: 60, priceMax: 100 });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it('includes products at exact priceMin boundary', () => {
      const result = applyFilters(products, { ...baseFilter, priceMin: 59.99 });
      expect(result).toHaveLength(3);
    });

    it('includes products at exact priceMax boundary', () => {
      const result = applyFilters(products, { ...baseFilter, priceMax: 99.99 });
      expect(result).toHaveLength(2);
    });

    it('ignores price bounds when set to empty string', () => {
      const result = applyFilters(products, { ...baseFilter, priceMin: '', priceMax: '' });
      expect(result).toHaveLength(3);
    });
  });

  describe('rating filter', () => {
    it('filters by minimum rating', () => {
      const result = applyFilters(products, { ...baseFilter, minRating: 4.5 });
      expect(result).toHaveLength(2);
    });

    it('returns all products when minRating is 0', () => {
      const result = applyFilters(products, { ...baseFilter, minRating: 0 });
      expect(result).toHaveLength(3);
    });

    it('returns no products when minRating exceeds all ratings', () => {
      const result = applyFilters(products, { ...baseFilter, minRating: 5 });
      expect(result).toHaveLength(0);
    });
  });

  describe('stock status filter', () => {
    it('returns only in-stock products', () => {
      const result = applyFilters(products, { ...baseFilter, stockStatus: 'inStock' });
      expect(result).toHaveLength(2);
      expect(result.every((p) => p.stock > 0)).toBe(true);
    });

    it('returns only out-of-stock products', () => {
      const result = applyFilters(products, { ...baseFilter, stockStatus: 'outOfStock' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2);
    });

    it('returns all products when stockStatus is "all"', () => {
      const result = applyFilters(products, { ...baseFilter, stockStatus: 'all' });
      expect(result).toHaveLength(3);
    });
  });

  describe('combined filters', () => {
    it('applies multiple filters simultaneously', () => {
      const result = applyFilters(products, {
        ...baseFilter,
        category: 'electronics',
        minRating: 4,
        stockStatus: 'inStock',
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it('returns empty array when combined filters match nothing', () => {
      const result = applyFilters(products, {
        ...baseFilter,
        category: 'electronics',
        stockStatus: 'outOfStock',
      });
      expect(result).toHaveLength(0);
    });
  });
});

describe('getUniqueCategories', () => {
  it('returns sorted unique categories', () => {
    const result = getUniqueCategories(products);
    expect(result).toEqual(['electronics', 'footwear', 'kitchen']);
  });

  it('deduplicates categories', () => {
    const dupes: Product[] = [
      { ...products[0], category: 'electronics' },
      { ...products[1], category: 'electronics' },
    ];
    expect(getUniqueCategories(dupes)).toEqual(['electronics']);
  });

  it('returns empty array for empty product list', () => {
    expect(getUniqueCategories([])).toEqual([]);
  });
});
