import type { SavedFilter, FilterState } from '../../types/product';

interface Props {
  savedFilters: SavedFilter[];
  onApply: (filters: FilterState) => void;
  onDelete: (id: string) => void;
  onSaveClick: () => void;
}

export default function Sidebar({ savedFilters, onApply, onDelete, onSaveClick }: Props) {
  return (
    <nav className="sidebar" aria-label="Saved filters">
      <div className="sidebar__brand">
        <span className="sidebar__logo">PC</span>
        <span className="sidebar__name">Product Catalog</span>
      </div>

      <button className="sidebar__save-btn" onClick={onSaveClick}>
        + Save Current Filters
      </button>

      {savedFilters.length > 0 && (
        <div className="sidebar__saved-list">
          <h3 className="sidebar__section-title">Saved Filters</h3>
          <ul className="sidebar__list">
            {savedFilters.map((sf) => (
              <li key={sf.id} className="sidebar__item">
                <button className="sidebar__item-apply" onClick={() => onApply(sf.filters)}>
                  {sf.name}
                </button>
                <button
                  className="sidebar__item-delete"
                  onClick={() => onDelete(sf.id)}
                  aria-label={`Delete saved filter: ${sf.name}`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
