import { memo } from 'react';
import type { Product } from '../../../types/product';
import styles from './ProductCard.module.css';

interface Props {
  product: Product;
}

const ProductCard = memo(function ProductCard({ product }: Props) {
  const discounted = product.discountPercentage > 0;
  const discountedPrice = product.price * (1 - product.discountPercentage / 100);
  const inStock = product.stock > 0;

  return (
    <article
      className={styles.productCard}
      data-testid="product-card"
      data-product-id={product.id}
      data-price={product.price}
      data-rating={product.rating}
    >
      <div className={styles.imgWrap}>
        <img src={product.thumbnail} alt={product.title} loading="lazy" className={styles.img} />
      </div>
      <div className={styles.body}>
        <span className={styles.category}>{product.category.toUpperCase()}</span>
        <h3 className={styles.title}>{product.title}</h3>
        <p className={styles.desc}>{product.description}</p>
        <div className={styles.bottom}>
          <div className={styles.priceCol}>
            <span className={styles.price}>
              ${discounted ? discountedPrice.toFixed(2) : product.price.toFixed(2)}
            </span>
            {discounted && (
              <span className={styles.priceOriginal}>${product.price.toFixed(2)}</span>
            )}
          </div>
          <div className={styles.rating}>
            <span className={styles.star} aria-hidden="true">
              ⭐
            </span>
            <span>{product.rating.toFixed(2)}</span>
          </div>
        </div>
        <p className={`${styles.stock} ${inStock ? styles.inStock : styles.outOfStock}`}>
          {inStock ? `In Stock: ${product.stock}` : 'Out of Stock'}
        </p>
      </div>
    </article>
  );
});

export default ProductCard;
