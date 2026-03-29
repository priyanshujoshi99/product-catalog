# Product Catalog — Design & Implementation Plan

## Stack
- **Framework**: React + Vite + TypeScript
- **HTTP**: Axios
- **Testing**: Vitest
- **Styling**: Plain CSS with custom properties (no CSS framework)

---

## Aesthetic Direction

**Editorial Commerce** — dark navy sidebar contrasted with a warm off-white main content area.

| Token | Value |
|---|---|
| Display font | `DM Serif Display` (headings, product titles) |
| UI font | `Outfit` (labels, inputs, body) |
| Accent | Amber `#F59E0B` |
| Sidebar bg | `#0F172A` (dark navy) |
| Main bg | `#FAF7F2` (warm off-white) |
| Card bg | `#FFFFFF` |
| Text primary | `#1E293B` |
| Text muted | `#64748B` |

Product cards have a subtle lift + shadow on hover. Filter transitions use `200ms ease`. Skeleton loaders pulse on initial data load.

---

## Project Structure

```
src/
├── types/
│   └── product.ts              # Product, FilterState, SavedFilter interfaces
├── data/
│   └── products.json           # Copied from docs/products.json
├── services/
│   └── productService.ts       # Simulated async fetch (wraps JSON in setTimeout)
├── hooks/
│   ├── useProducts.ts          # Async load → { data, loading, error }
│   ├── useFilters.ts           # Filter state + useMemo derived filteredProducts
│   └── useSavedFilters.ts      # localStorage persistence for named filter sets
├── utils/
│   ├── apiClient.ts            # Axios instance + request/response interceptors + error normalisation
│   ├── filterUtils.ts          # Pure filter functions (unit-testable)
│   └── sortUtils.ts            # Pure sort functions (unit-testable)
├── components/
│   ├── Sidebar.tsx             # Saved filters list + "Save Current Filters" button
│   ├── FilterPanel.tsx         # All filter controls + Clear All
│   ├── ProductGrid.tsx         # Responsive grid, empty state, skeleton fallback
│   ├── ProductCard.tsx         # Image, category badge, title, price, stars, stock
│   ├── ProductSkeleton.tsx     # Animated skeleton placeholder card
│   ├── SortBar.tsx             # Sort dropdown + "Showing X of Y Products" counter
│   └── SaveFilterModal.tsx     # Modal dialog to name and save a filter set
├── App.tsx
├── main.tsx
└── index.css                   # CSS variables, resets, animations
```

---

## Feature Breakdown

### 1. Data Integration
- `src/data/products.json` — local copy of the provided JSON file
- `apiClient.ts` creates a configured Axios instance; all HTTP calls go through it
- `productService.ts` exposes `fetchProducts(): Promise<Product[]>` which calls `apiClient.get('/products.json')` (served as a static asset by Vite), with a simulated 600ms delay to mimic real network latency
- Swapping to a real API later requires changing only `productService.ts` (base URL + endpoint)

### 1a. HTTP Utility — `apiClient.ts`

Responsibilities:
- Creates an `axios` instance with `baseURL` from `import.meta.env.VITE_API_BASE_URL`
- **Request interceptor**: attaches any auth headers if present
- **Response interceptor**: unwraps `response.data` so callers never touch the Axios envelope
- **Error normaliser**: catches `AxiosError` and converts it to a typed `AppError`:

```typescript
interface AppError {
  message: string;      // human-readable
  status?: number;      // HTTP status if available
  code?: string;        // Axios error code (e.g. 'ERR_NETWORK')
}
```

All services call `apiClient` and receive either clean data or a thrown `AppError`. No raw `AxiosError` objects leak into components or hooks.

### 2. Search & Filter System (all client-side)

| Filter | Implementation |
|---|---|
| Global Search | Text input; filters by `title` and `description` (case-insensitive) |
| Category | Dropdown; derived from unique `category` values in the dataset |
| Price Range | Two number inputs (`min` / `max`); both optional |
| Minimum Rating | Dropdown (1–5 stars); shows products with `rating >= selected` |
| Stock Status | Three-way toggle: All / In Stock / Out of Stock |
| Clear All | Resets `FilterState` to defaults |

All filtering is done in `filterUtils.ts` as pure functions over the product array.

### 3. State Persistence (Saved Filters)
- `useSavedFilters` reads/writes to `localStorage` key `product-catalog-saved-filters`
- Save flow: user clicks "Save Filters" → `SaveFilterModal` prompts for a name → saved to localStorage
- Saved filter entries appear in the Sidebar; clicking one applies all its settings instantly
- Saved filters survive browser refresh

### 4. Product Display & Sorting

**ProductCard** shows:
- Product image (lazy-loaded with `loading="lazy"`)
- Category badge
- Title (DM Serif Display)
- Truncated description (2 lines)
- Price (with discounted price if `discountPercentage > 0`)
- Star rating (filled/half/empty SVG stars)
- Stock count badge (green = in stock, red = out of stock)

**SortBar** options:
- Price: Low to High
- Price: High to Low
- Rating: High to Low

**Counter**: "Showing {filtered} of {total} Products"

---

## State Shape

```typescript
interface FilterState {
  search: string;
  category: string;        // '' = all
  priceMin: number | '';
  priceMax: number | '';
  minRating: number;       // 0 = all
  stockStatus: 'all' | 'inStock' | 'outOfStock';
  sortBy: 'price-asc' | 'price-desc' | 'rating-desc' | '';
}

interface SavedFilter {
  id: string;
  name: string;
  filters: FilterState;
  createdAt: number;
}
```

---

## Performance

- `useMemo` wraps the filter + sort pipeline so it only re-runs when `products` or `filters` changes
- `React.memo` on `ProductCard` prevents re-renders when other cards update
- Images use `loading="lazy"` and fixed aspect-ratio containers to avoid layout shift

---

## Bonus Items

| Item | Approach |
|---|---|
| Skeleton loaders | 12 `ProductSkeleton` cards shown while `loading === true` |
| Empty state | Illustrated message + "Clear Filters" CTA when `filteredProducts.length === 0` |
| Accessibility | `aria-label` on all inputs; `role="status"` on counter; keyboard-navigable filters |
| Unit tests | Vitest tests for all functions in `filterUtils.ts`, `sortUtils.ts`, and `apiClient.ts` error normaliser |
| API scalability | `productService.ts` is the single swap-point for JSON → REST/GraphQL; `apiClient.ts` config is the single swap-point for base URL and auth |
