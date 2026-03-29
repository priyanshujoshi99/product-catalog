import type { Product } from '../types/product';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';

interface Props {
  products: Product[];
  loading: boolean;
  onClearFilters: () => void;
}

const SKELETON_COUNT = 12;

export default function ProductGrid({ products, loading, onClearFilters }: Props) {
  if (loading) {
    return (
      <div className="product-grid">
        {Array.from({ length: SKELETON_COUNT }, (_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state__icon" aria-hidden="true">🔍</div>
        <h3 className="empty-state__title">No products found</h3>
        <p className="empty-state__msg">Try adjusting your filters to see more results.</p>
        <button className="btn-clear" onClick={onClearFilters}>Clear Filters</button>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
