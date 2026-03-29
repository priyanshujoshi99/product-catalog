import { useState } from 'react';
import { useProducts } from './hooks/useProducts';
import { useFilters } from './hooks/useFilters';
import { useSavedFilters } from './hooks/useSavedFilters';
import { usePagination } from './hooks/usePagination';
import { getUniqueCategories } from './utils/filterUtils';
import FilterPanel from './components/FilterPanel';
import SortBar from './components/SortBar';
import ProductGrid from './components/ProductGrid';
import styles from './App.module.css';

export default function App() {
  const { data: products, loading, error } = useProducts();
  const { filters, filteredProducts, setAllFilters, updateFilter, clearFilters } = useFilters(products);
  const { savedFilters, saveFilter, deleteFilter } = useSavedFilters();
  const { visibleItems, hasMore, loadMore } = usePagination(filteredProducts);
  const [searchInput, setSearchInput] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const categories = getUniqueCategories(products);

  function handleSearch() {
    updateFilter('search', searchInput);
  }

  function handleSearchKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSearch();
  }

  function handleClearAll() {
    setSearchInput('');
    clearFilters();
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.layout} data-testid="app-layout">
          <FilterPanel
            currentFilters={filters}
            categories={categories}
            onApply={(panelFilters) => setAllFilters({ ...panelFilters, search: filters.search, sortBy: filters.sortBy })}
            onClear={handleClearAll}
            savedFilters={savedFilters}
            onSaveFilter={(name, panelFilters) => saveFilter(name, { ...panelFilters, search: filters.search, sortBy: filters.sortBy })}
            onDeleteSavedFilter={deleteFilter}
            onApplySavedFilter={(f) => { setSearchInput(f.search); setAllFilters(f); }}
            mobileOpen={mobileFiltersOpen}
            onMobileClose={() => setMobileFiltersOpen(false)}
          />

          <div className={styles.mainCol}>
            <div className={styles.searchCard}>
              <button
                className={styles.hamburgerBtn}
                onClick={() => setMobileFiltersOpen(true)}
                aria-label="Open filters"
                data-testid="hamburger-btn"
              >
                <span /><span /><span />
              </button>
              <input
                className={styles.searchInput}
                type="text"
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleSearchKey}
                aria-label="Search products"
                data-testid="search-input"
              />
              <button className={styles.searchBtn} onClick={handleSearch} data-testid="search-btn">
                <span className={styles.searchBtnDot} aria-hidden="true" />
                Search
              </button>
            </div>

            {error ? (
              <div className={styles.errorState} role="alert" data-testid="error-state">
                <p>Failed to load products: {error.message}</p>
              </div>
            ) : (
              <div className={styles.productsCard} data-testid="products-card">
                <SortBar
                  sortBy={filters.sortBy}
                  onSortChange={(val) => updateFilter('sortBy', val)}
                  filteredCount={visibleItems.length}
                  totalCount={filteredProducts.length}
                />
                <ProductGrid
                  products={visibleItems}
                  loading={loading}
                  hasMore={hasMore}
                  onLoadMore={loadMore}
                  onClearFilters={handleClearAll}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
