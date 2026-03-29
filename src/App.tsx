import { useState } from 'react';
import { useProducts } from './hooks/useProducts';
import { useFilters } from './hooks/useFilters';
import { useSavedFilters } from './hooks/useSavedFilters';
import { getUniqueCategories } from './utils/filterUtils';
import FilterPanel from './components/FilterPanel';
import SortBar from './components/SortBar';
import ProductGrid from './components/ProductGrid';

export default function App() {
  const { data: products, loading, error } = useProducts();
  const { filters, filteredProducts, setAllFilters, updateFilter, clearFilters } = useFilters(products);
  const { savedFilters, saveFilter, deleteFilter } = useSavedFilters();
  const [searchInput, setSearchInput] = useState('');

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
    <div className="page">
      <div className="container">
        <div className="layout">
          <FilterPanel
            currentFilters={filters}
            categories={categories}
            onApply={(panelFilters) => setAllFilters({ ...panelFilters, search: filters.search, sortBy: filters.sortBy })}
            onClear={handleClearAll}
            savedFilters={savedFilters}
            onSaveFilter={(name, panelFilters) => saveFilter(name, { ...panelFilters, search: filters.search, sortBy: filters.sortBy })}
            onDeleteSavedFilter={deleteFilter}
            onApplySavedFilter={(f) => { setSearchInput(f.search); setAllFilters(f); }}
          />

          <div className="main-col">
            <div className="search-card">
              <input
                className="search-input"
                type="text"
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleSearchKey}
                aria-label="Search products"
              />
              <button className="search-btn" onClick={handleSearch}>
                <span className="search-btn__dot" aria-hidden="true" />
                Search
              </button>
            </div>

            {error ? (
              <div className="error-state" role="alert">
                <p>Failed to load products: {error.message}</p>
              </div>
            ) : (
              <div className="products-card">
                <SortBar
                  sortBy={filters.sortBy}
                  onSortChange={(val) => updateFilter('sortBy', val)}
                  filteredCount={filteredProducts.length}
                  totalCount={products.length}
                />
                <ProductGrid
                  products={filteredProducts}
                  loading={loading}
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
