import apiClient from '../utils/apiClient';
import type { Product } from '../types/product';

export async function fetchProducts(): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  const data = await apiClient.get<never, { products: Product[] }>('/products.json');
  return data.products;
}
