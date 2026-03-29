import { describe, it, expect } from 'vitest';
import { applySort } from './sortUtils';
import type { Product } from '../types/product';

const makeProduct = (id: number, price: number, rating: number): Product => ({
  id,
  title: `Product ${id}`,
  description: '',
  category: 'test',
  price,
  discountPercentage: 0,
  rating,
  stock: 10,
  tags: [],
  brand: '',
  sku: `SKU-${id}`,
  images: [],
  thumbnail: '',
  availabilityStatus: 'In Stock',
});

const products: Product[] = [
  makeProduct(1, 49.99, 3.2),
  makeProduct(2, 149.99, 4.8),
  makeProduct(3, 99.99, 4.1),
];

describe('applySort', () => {
  it('returns products sorted by price ascending', () => {
    const result = applySort(products, 'price-asc');
    expect(result.map((p) => p.price)).toEqual([49.99, 99.99, 149.99]);
  });

  it('returns products sorted by price descending', () => {
    const result = applySort(products, 'price-desc');
    expect(result.map((p) => p.price)).toEqual([149.99, 99.99, 49.99]);
  });

  it('returns products sorted by rating descending', () => {
    const result = applySort(products, 'rating-desc');
    expect(result.map((p) => p.rating)).toEqual([4.8, 4.1, 3.2]);
  });

  it('returns products in original order when sortBy is empty string', () => {
    const result = applySort(products, '');
    expect(result.map((p) => p.id)).toEqual([1, 2, 3]);
  });

  it('does not mutate the original array', () => {
    const original = [...products];
    applySort(products, 'price-asc');
    expect(products.map((p) => p.id)).toEqual(original.map((p) => p.id));
  });

  it('handles an empty array', () => {
    expect(applySort([], 'price-asc')).toEqual([]);
  });

  it('handles a single-element array', () => {
    const single = [makeProduct(1, 50, 4.0)];
    expect(applySort(single, 'price-desc')).toHaveLength(1);
  });
});
