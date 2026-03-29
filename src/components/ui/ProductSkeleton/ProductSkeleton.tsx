import { memo } from 'react';
import styles from './ProductSkeleton.module.css';

const ProductSkeleton = memo(function ProductSkeleton() {
  return (
    <div className={styles.productSkeleton}>
      <div className={`${styles.skeleton} ${styles.skeletonImg}`} />
      <div className={styles.skeletonBody}>
        <div className={`${styles.skeleton} ${styles.skeletonBadge}`} />
        <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
        <div className={`${styles.skeleton} ${styles.skeletonDesc}`} />
        <div className={`${styles.skeleton} ${styles.skeletonDesc} ${styles.short}`} />
        <div className={`${styles.skeleton} ${styles.skeletonPrice}`} />
      </div>
    </div>
  );
});

export default ProductSkeleton;
