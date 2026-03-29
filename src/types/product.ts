export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  images: string[];
  thumbnail: string;
  availabilityStatus: string;
}

export interface FilterState {
  search: string;
  category: string;
  priceMin: number | '';
  priceMax: number | '';
  minRating: number;
  stockStatus: 'all' | 'inStock' | 'outOfStock';
  sortBy: 'price-asc' | 'price-desc' | 'rating-desc' | '';
}

export interface SavedFilter {
  id: string;
  name: string;
  filters: FilterState;
  createdAt: number;
}

export interface AppError {
  message: string;
  status?: number;
  code?: string;
}
