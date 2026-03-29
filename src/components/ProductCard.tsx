import { memo } from 'react';
import type { Product } from '../types/product';

interface Props {
  product: Product;
}

const ProductCard = memo(function ProductCard({ product }: Props) {
  const discounted = product.discountPercentage > 0;
  const discountedPrice = product.price * (1 - product.discountPercentage / 100);
  const inStock = product.stock > 0;

  return (
    <article className="product-card">
      <div className="product-card__img-wrap">
        <img
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
          className="product-card__img"
        />
      </div>
      <div className="product-card__body">
        <span className="product-card__category">{product.category.toUpperCase()}</span>
        <h3 className="product-card__title">{product.title}</h3>
        <p className="product-card__desc">{product.description}</p>
        <div className="product-card__bottom">
          <div className="product-card__price-col">
            <span className="product-card__price">
              ${discounted ? discountedPrice.toFixed(2) : product.price.toFixed(2)}
            </span>
            {discounted && (
              <span className="product-card__price-original">${product.price.toFixed(2)}</span>
            )}
          </div>
          <div className="product-card__rating">
            <span className="product-card__star" aria-hidden="true">⭐</span>
            <span>{product.rating.toFixed(2)}</span>
          </div>
        </div>
        <p className={`product-card__stock ${inStock ? 'in-stock' : 'out-of-stock'}`}>
          {inStock ? `In Stock: ${product.stock}` : 'Out of Stock'}
        </p>
      </div>
    </article>
  );
});

export default ProductCard;
