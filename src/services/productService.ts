import type { Product } from '../types/product';
import apiClient from '../utils/apiClient';
import productsData from '../data/products.json';

export interface ProductService {
  fetchProducts(): Promise<Product[]>;
}

export const localProductService: ProductService = {
  async fetchProducts() {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return (productsData as { products: Product[] }).products;
  },
};

export const apiProductService: ProductService = {
  async fetchProducts() {
    const data = await apiClient.get<never, { products: Product[] }>('/products.json');
    return data.products;
  },
};

export default localProductService;

export const fetchProducts = () => localProductService.fetchProducts();
