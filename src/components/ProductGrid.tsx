import { useEffect, useRef } from 'react';
import type { Product } from '../types/product';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';
import styles from './ProductGrid.module.css';

interface Props {
  products: Product[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onClearFilters: () => void;
}

const SKELETON_COUNT = 12;

export default function ProductGrid({ products, loading, hasMore, onLoadMore, onClearFilters }: Props) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) onLoadMore();
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [onLoadMore]);

  if (loading) {
    return (
      <div className={styles.productGrid}>
        {Array.from({ length: SKELETON_COUNT }, (_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyStateIcon} aria-hidden="true">🔍</div>
        <h3 className={styles.emptyStateTitle}>No products found</h3>
        <p className={styles.emptyStateMsg}>Try adjusting your filters to see more results.</p>
        <button className={styles.btnClear} onClick={onClearFilters}>Clear Filters</button>
      </div>
    );
  }

  return (
    <>
      <div className={styles.productGrid}>
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {hasMore && <div ref={sentinelRef} className={styles.scrollSentinel} aria-hidden="true" />}
      {!hasMore && products.length > 0 && (
        <p className={styles.scrollEndMsg}>All {products.length} products shown</p>
      )}
    </>
  );
}
