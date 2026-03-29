import { use } from 'react';
import { fetchProducts } from '../services/productService';
import type { Product } from '../types/product';

const productsPromise = fetchProducts();

export function useProducts(): Product[] {
  return use(productsPromise);
}
