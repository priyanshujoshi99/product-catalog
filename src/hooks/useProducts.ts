import { useState, useEffect } from 'react';
import { fetchProducts } from '../services/productService';
import type { Product, AppError } from '../types/product';

interface UseProductsResult {
  data: Product[];
  loading: boolean;
  error: AppError | null;
}

export function useProducts(): UseProductsResult {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AppError | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchProducts()
      .then((products) => {
        if (!cancelled) setData(products);
      })
      .catch((err: AppError) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  return { data, loading, error };
}
