import { memo } from 'react';

const ProductSkeleton = memo(function ProductSkeleton() {
  return (
    <div className="product-skeleton">
      <div className="skeleton skeleton-img" />
      <div className="skeleton-body">
        <div className="skeleton skeleton-badge" />
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-desc" />
        <div className="skeleton skeleton-desc short" />
        <div className="skeleton skeleton-price" />
      </div>
    </div>
  );
});

export default ProductSkeleton;
