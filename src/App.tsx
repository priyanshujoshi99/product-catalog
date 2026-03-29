import { Suspense } from 'react';
import ErrorBoundary from './components/shared/ErrorBoundary';
import ProductCatalog from './screens/ProductCatalog';
import styles from './App.module.css';

export default function App() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <ErrorBoundary
          fallback={
            <div className={styles.errorState} role="alert" data-testid="error-state">
              <p>Failed to load products.</p>
            </div>
          }
        >
          <Suspense fallback={
            <div className={styles.loadingCard} data-testid="product-grid-loading">
              Loading products...
            </div>
          }>
            <ProductCatalog />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}
