# Product Catalog

A responsive product catalog built with React and TypeScript. Browse 194 products with real-time search, multi-filter, sorting, infinite scroll, and saved filter presets.

**Live demo:** https://priyanshujoshi99.github.io/product-catalog/

---

## Features

- **Search** — full-text search across product titles and descriptions
- **Filtering** — filter by category, price range, minimum rating, and stock status
- **Sorting** — sort by price (low/high) or rating
- **Infinite scroll** — loads 12 products at a time via IntersectionObserver
- **Saved filters** — save and reapply filter configurations, persisted to localStorage
- **Mobile support** — slide-in filter panel with hamburger toggle at ≤860px
- **Skeleton loaders** — placeholder cards while products load

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript 5 |
| Build tool | Vite 8 |
| Styling | CSS Modules + CSS variables |
| HTTP client | Axios |
| Unit tests | Vitest |
| CI/CD | GitHub Actions → GitHub Pages |

---

## Getting Started

**Prerequisites:** Node.js 20+

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173/product-catalog/)
npm run dev
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit tests (Vitest) |

---

## Project Structure

```
src/
├── components/       # UI components (FilterPanel, ProductCard, ProductGrid, SortBar)
├── hooks/            # Custom hooks (useProducts, useFilters, usePagination, useSavedFilters)
├── services/         # Data fetching (local JSON + optional remote API)
├── utils/            # Pure functions for filtering and sorting (with unit tests)
├── types/            # TypeScript interfaces
└── data/             # products.json (194 demo products)
```

---

## Testing

Unit tests cover the filtering and sorting utilities:

```bash
npm run test
```

---

## Deployment

Pushing to `main` automatically builds and deploys to GitHub Pages via `.github/workflows/deploy.yml`.

The app is served from the `/product-catalog/` base path, configured in `vite.config.ts`.
