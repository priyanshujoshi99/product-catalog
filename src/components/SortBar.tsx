import type { FilterState } from '../types/product';
import styles from './SortBar.module.css';

interface Props {
  sortBy: FilterState['sortBy'];
  onSortChange: (sortBy: FilterState['sortBy']) => void;
  filteredCount: number;
  totalCount: number;
}

const SORT_OPTIONS: { value: FilterState['sortBy']; label: string }[] = [
  { value: '', label: 'Sort By' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Rating: High to Low' },
];

export default function SortBar({ sortBy, onSortChange, filteredCount, totalCount }: Props) {
  return (
    <div className={styles.sortBar} data-testid="sort-bar">
      <p className={styles.sortBarCount} role="status" data-testid="product-count">
        Showing <strong>{filteredCount}</strong> of <strong>{totalCount}</strong> Products
      </p>
      <select
        className={styles.sortBarSelect}
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as FilterState['sortBy'])}
        aria-label="Sort products"
        data-testid="sort-select"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
