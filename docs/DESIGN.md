# Product Catalog — Design

## Stack
- **Framework**: React 19 + Vite 8 + TypeScript 5.9
- **HTTP**: Axios
- **Testing**: Vitest 4
- **Styling**: CSS Modules + CSS custom properties (no CSS framework)

---

## Aesthetic Direction

**Editorial Commerce** — purple/indigo accent on a white card surface, warm page background.

| Token | Value |
|---|---|
| Display font | `DM Serif Display` (headings, product titles) |
| UI font | `Outfit` (labels, inputs, body) |
| Primary accent | `#5B5FC7` (indigo-purple) |
| Primary dark | `#4A4EAB` |
| Page bg | `#7B7EC8` (muted purple) |
| Card bg | `#FFFFFF` |
| Text primary | `#1E293B` |
| Text muted | `#64748B` |
| Category color | `#6366F1` |
| Success | `#16A34A` |
| Error / Out-of-stock | `#DC2626` |

Product cards have a subtle lift (`translateY(-3px)`) + shadow increase on hover. Filter transitions use `200ms ease`. Skeleton loaders pulse on initial data load.

---

## Project Structure

```
src/
├── types/
│   └── product.ts              # Product, FilterState, SavedFilter, AppError interfaces
├── data/
│   └── products.json           # Local product dataset (served as static asset by Vite)
├── services/
│   └── productService.ts       # Simulated async fetch (wraps JSON in setTimeout ~600ms)
├── hooks/
│   ├── useProducts.ts          # Async load → { data, loading, error }
│   ├── useFilters.ts           # Filter state + useMemo derived filteredProducts
│   ├── usePagination.ts        # Generic pagination hook (PAGE_SIZE = 12)
│   └── useSavedFilters.ts      # localStorage persistence for named filter sets
├── utils/
│   ├── apiClient.ts            # Axios instance + request/response interceptors + error normalisation
│   ├── filterUtils.ts          # Pure filter functions (unit-testable)
│   ├── filterUtils.test.ts     # 20 Vitest test cases
│   ├── sortUtils.ts            # Pure sort functions (unit-testable)
│   └── sortUtils.test.ts       # 8 Vitest test cases
├── components/
│   ├── shared/
│   │   └── ErrorBoundary/      # Generic React error boundary (used in App.tsx)
│   ├── ui/
│   │   ├── ProductCard/        # Image, category badge, title, price, stars, stock
│   │   └── ProductSkeleton/    # Animated skeleton placeholder card
│   ├── FilterPanel/            # All filter controls + Clear All + mobile drawer
│   ├── ProductGrid/            # Infinite-scroll grid, empty state, skeleton fallback
│   ├── SaveFilterModal/        # Modal dialog to name and save a filter set
│   ├── Sidebar/                # Saved filters list + "Save Current Filters" button (defined, not integrated in main layout)
│   └── SortBar/                # Sort dropdown + "Showing X of Y Products" counter
├── App.tsx
├── App.module.css
├── main.tsx
└── index.css                   # CSS variables, resets, animations
```

---

## Feature Breakdown

### 1. Data Integration
- `src/data/products.json` — local copy served as static asset by Vite
- `apiClient.ts` creates a configured Axios instance; all HTTP calls go through it
- `productService.ts` exposes `fetchProducts(): Promise<Product[]>` which calls `apiClient.get('/products.json')` with a simulated ~600ms delay to mimic real network latency
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
| Global Search | Text input (debounced via searchInput local state); filters by `title` and `description` (case-insensitive) |
| Category | Dropdown; derived from unique `category` values in the dataset |
| Price Range | Two number inputs (`min` / `max`); both optional |
| Minimum Rating | Dropdown (1–5 stars); shows products with `rating >= selected` |
| Stock Status | Three-way toggle: All / In Stock / Out of Stock |
| Clear All | Resets `FilterState` to defaults |

All filtering is done in `filterUtils.ts` as pure functions over the product array.

### 3. State Persistence (Saved Filters)
- `useSavedFilters` reads/writes to `localStorage` key `product-catalog-saved-filters`
- Save flow: user clicks "Save Filters" in the FilterPanel → `SaveFilterModal` prompts for a name → saved to localStorage
- Saved filter entries appear in the FilterPanel sidebar section; clicking one applies all its settings instantly
- Delete button removes individual saved filters
- Saved filters survive browser refresh

### 4. Product Display & Sorting

**ProductCard** shows:
- Product image (lazy-loaded with `loading="lazy"`, 4:3 aspect ratio container)
- Category badge
- Title (DM Serif Display)
- Truncated description (2-line clamp)
- Price (with strikethrough original price if `discountPercentage > 0`)
- Star rating (filled/half/empty SVG stars)
- Stock badge (green = in stock, red = out of stock with count)

**SortBar** options:
- Price: Low to High
- Price: High to Low
- Rating: High to Low

**Counter**: "Showing {filtered} of {total} Products"

### 5. Pagination (Infinite Scroll)
- `usePagination` is a generic hook: `<T>(items: T[]) => { visibleItems, hasMore, loadMore }`
- `PAGE_SIZE = 12` items per page; resets to page 1 whenever the input array changes (filter/sort change)
- `ProductGrid` uses `IntersectionObserver` on a sentinel `div` at the bottom of the list
- When the sentinel enters the viewport, `loadMore()` is called automatically
- "You've seen all products" message shown when `hasMore === false`

### 6. Mobile Layout
- Hamburger button appears at ≤860px breakpoint; hidden on desktop
- FilterPanel renders as a slide-in drawer with an overlay backdrop on mobile
- `mobileOpen` state in App manages open/close; `onMobileClose` callback closes on overlay tap or apply
- ProductGrid switches to 2-column layout at ≤560px, 1-column at ≤380px

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
  id: string;              // crypto.randomUUID()
  name: string;
  filters: FilterState;
  createdAt: number;       // Date.now() timestamp
}

interface AppError {
  message: string;
  status?: number;
  code?: string;
}
```

---

## Performance

- `useMemo` wraps the filter + sort pipeline so it only re-runs when `products` or `filters` changes
- `React.memo` on `ProductCard` and `ProductSkeleton` prevents re-renders when other cards update
- Images use `loading="lazy"` and fixed aspect-ratio containers to avoid layout shift
- `usePagination` slices the visible items array, limiting DOM nodes rendered at once
- `IntersectionObserver` used for scroll-based `loadMore` (no scroll event listeners)

---

## Bonus Items

| Item | Approach |
|---|---|
| Skeleton loaders | 12 `ProductSkeleton` cards shown while `loading === true` |
| Empty state | Message + "Clear Filters" CTA when `filteredProducts.length === 0` |
| Accessibility | `aria-label` on inputs; `role="status"` on counter; keyboard-navigable filters |
| Unit tests | Vitest tests for all functions in `filterUtils.ts` (20 cases) and `sortUtils.ts` (8 cases) |
| API scalability | `productService.ts` is the single swap-point for JSON → REST/GraphQL; `apiClient.ts` config is the single swap-point for base URL and auth |
| Infinite scroll | IntersectionObserver-based via `usePagination` + scroll sentinel in `ProductGrid` |
| Saved filters | Named filter presets persisted to `localStorage`, applied with one click |
