import { useState, useEffect } from 'react';
import type { FilterState, SavedFilter } from '../../types/product';
import { DEFAULT_FILTERS } from '../../hooks/useFilters';
import styles from './FilterPanel.module.css';

type PanelFilters = Omit<FilterState, 'search' | 'sortBy'>;

function toPanelFilters(f: FilterState): PanelFilters {
  return {
    category: f.category,
    priceMin: f.priceMin,
    priceMax: f.priceMax,
    minRating: f.minRating,
    stockStatus: f.stockStatus,
  };
}

interface Props {
  currentFilters: FilterState;
  categories: string[];
  onApply: (filters: PanelFilters) => void;
  onClear: () => void;
  savedFilters: SavedFilter[];
  onSaveFilter: (name: string, filters: PanelFilters) => void;
  onDeleteSavedFilter: (id: string) => void;
  onApplySavedFilter: (filters: FilterState) => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function FilterPanel({
  currentFilters,
  categories,
  onApply,
  onClear,
  savedFilters,
  onSaveFilter,
  onDeleteSavedFilter,
  onApplySavedFilter,
  mobileOpen,
  onMobileClose,
}: Props) {
  const [local, setLocal] = useState<PanelFilters>(toPanelFilters(currentFilters));
  const [filterName, setFilterName] = useState('');

  useEffect(() => {
    setLocal(toPanelFilters(currentFilters));
  }, [currentFilters]);

  function update<K extends keyof PanelFilters>(key: K, value: PanelFilters[K]) {
    setLocal((prev) => ({ ...prev, [key]: value }));
  }

  function handleClear() {
    const empty = toPanelFilters(DEFAULT_FILTERS);
    setLocal(empty);
    onClear();
  }

  return (
    <>
      {mobileOpen && (
        <div className={styles.overlay} onClick={onMobileClose} aria-hidden="true" data-testid="filter-overlay" />
      )}
      <aside className={`${styles.filterCard} ${mobileOpen ? styles.filterCardMobileOpen : ''}`} data-testid="filter-panel">
      <div className={styles.filterCardHeader}>
        <span className={styles.filterCardIcon} aria-hidden="true">🎯</span>
        <h2 className={styles.filterCardTitle}>Filters</h2>
        <button className={styles.closeBtn} onClick={onMobileClose} aria-label="Close filters" data-testid="filter-close-btn">×</button>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.filterLabel} htmlFor="fc-category">Category</label>
        <select
          id="fc-category"
          className={styles.filterSelect}
          value={local.category}
          onChange={(e) => update('category', e.target.value)}
          aria-label="Filter by category"
          data-testid="category-select"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className={styles.filterGroup}>
        <span className={styles.filterLabel}>Price Range</span>
        <div className={styles.filterPriceRow}>
          <input
            className={styles.filterInput}
            type="number"
            min="0"
            placeholder="Min"
            value={local.priceMin}
            onChange={(e) => update('priceMin', e.target.value === '' ? '' : Number(e.target.value))}
            aria-label="Minimum price"
            data-testid="price-min-input"
          />
          <input
            className={styles.filterInput}
            type="number"
            min="0"
            placeholder="Max"
            value={local.priceMax}
            onChange={(e) => update('priceMax', e.target.value === '' ? '' : Number(e.target.value))}
            aria-label="Maximum price"
            data-testid="price-max-input"
          />
        </div>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.filterLabel} htmlFor="fc-rating">Minimum Rating</label>
        <select
          id="fc-rating"
          className={styles.filterSelect}
          value={local.minRating}
          onChange={(e) => update('minRating', Number(e.target.value))}
          aria-label="Minimum rating"
          data-testid="rating-select"
        >
          <option value={0}>Any Rating</option>
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>{r}+ Stars</option>
          ))}
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.filterLabel} htmlFor="fc-stock">Stock Status</label>
        <select
          id="fc-stock"
          className={styles.filterSelect}
          value={local.stockStatus}
          onChange={(e) => update('stockStatus', e.target.value as PanelFilters['stockStatus'])}
          aria-label="Stock status"
          data-testid="stock-select"
        >
          <option value="all">All Products</option>
          <option value="inStock">In Stock</option>
          <option value="outOfStock">Out of Stock</option>
        </select>
      </div>

      <div className={styles.filterActions}>
        <button className={styles.btnApply} onClick={() => onApply(local)} data-testid="apply-filters-btn">Apply Filters</button>
        <button className={styles.btnClearOutline} onClick={handleClear} data-testid="clear-filters-btn">Clear</button>
      </div>

      <div className={styles.filterGroup}>
        <input
          className={styles.filterInput}
          type="text"
          placeholder="Filter name..."
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          aria-label="Name for saved filter"
          data-testid="save-filter-name-input"
        />
        <button
          className={styles.btnSaveFilter}
          onClick={() => {
            if (filterName.trim()) {
              onSaveFilter(filterName.trim(), local);
              setFilterName('');
            }
          }}
          disabled={!filterName.trim()}
          data-testid="save-filter-btn"
        >
          💾 Save Filter
        </button>
      </div>

      <hr className={styles.filterDivider} />

      <div className={styles.savedSection}>
        <h3 className={styles.savedSectionTitle}>
          <span aria-hidden="true">📌</span> Saved Filters
        </h3>
        {savedFilters.length === 0 ? (
          <p className={styles.savedSectionEmpty}>No saved filters yet</p>
        ) : (
          <ul className={styles.savedList}>
            {savedFilters.map((sf) => (
              <li key={sf.id} className={styles.savedItem}>
                <button
                  className={styles.savedItemApply}
                  onClick={() => onApplySavedFilter(sf.filters)}
                  data-testid="saved-filter-apply-btn"
                  aria-label={`Apply ${sf.name}`}
                >
                  {sf.name}
                </button>
                <button
                  className={styles.savedItemDelete}
                  onClick={() => onDeleteSavedFilter(sf.id)}
                  aria-label={`Delete ${sf.name}`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
    </>
  );
}
