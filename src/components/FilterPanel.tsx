import { useState, useEffect } from 'react';
import type { FilterState, SavedFilter } from '../types/product';
import { DEFAULT_FILTERS } from '../hooks/useFilters';

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
    <aside className="filter-card">
      <div className="filter-card__header">
        <span className="filter-card__icon" aria-hidden="true">🎯</span>
        <h2 className="filter-card__title">Filters</h2>
      </div>

      <div className="filter-group">
        <label className="filter-label" htmlFor="fc-category">Category</label>
        <select
          id="fc-category"
          className="filter-select"
          value={local.category}
          onChange={(e) => update('category', e.target.value)}
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <span className="filter-label">Price Range</span>
        <div className="filter-price-row">
          <input
            className="filter-input"
            type="number"
            min="0"
            placeholder="Min"
            value={local.priceMin}
            onChange={(e) => update('priceMin', e.target.value === '' ? '' : Number(e.target.value))}
            aria-label="Minimum price"
          />
          <input
            className="filter-input"
            type="number"
            min="0"
            placeholder="Max"
            value={local.priceMax}
            onChange={(e) => update('priceMax', e.target.value === '' ? '' : Number(e.target.value))}
            aria-label="Maximum price"
          />
        </div>
      </div>

      <div className="filter-group">
        <label className="filter-label" htmlFor="fc-rating">Minimum Rating</label>
        <select
          id="fc-rating"
          className="filter-select"
          value={local.minRating}
          onChange={(e) => update('minRating', Number(e.target.value))}
          aria-label="Minimum rating"
        >
          <option value={0}>Any Rating</option>
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>{r}+ Stars</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label" htmlFor="fc-stock">Stock Status</label>
        <select
          id="fc-stock"
          className="filter-select"
          value={local.stockStatus}
          onChange={(e) => update('stockStatus', e.target.value as PanelFilters['stockStatus'])}
          aria-label="Stock status"
        >
          <option value="all">All Products</option>
          <option value="inStock">In Stock</option>
          <option value="outOfStock">Out of Stock</option>
        </select>
      </div>

      <div className="filter-actions">
        <button className="btn-apply" onClick={() => onApply(local)}>Apply Filters</button>
        <button className="btn-clear-outline" onClick={handleClear}>Clear</button>
      </div>

      <div className="filter-group">
        <input
          className="filter-input"
          type="text"
          placeholder="Filter name..."
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          aria-label="Name for saved filter"
        />
        <button
          className="btn-save-filter"
          onClick={() => {
            if (filterName.trim()) {
              onSaveFilter(filterName.trim(), local);
              setFilterName('');
            }
          }}
          disabled={!filterName.trim()}
        >
          💾 Save Filter
        </button>
      </div>

      <hr className="filter-divider" />

      <div className="saved-section">
        <h3 className="saved-section__title">
          <span aria-hidden="true">📌</span> Saved Filters
        </h3>
        {savedFilters.length === 0 ? (
          <p className="saved-section__empty">No saved filters yet</p>
        ) : (
          <ul className="saved-list">
            {savedFilters.map((sf) => (
              <li key={sf.id} className="saved-item">
                <button className="saved-item__apply" onClick={() => onApplySavedFilter(sf.filters)}>
                  {sf.name}
                </button>
                <button
                  className="saved-item__delete"
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
  );
}
