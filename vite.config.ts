import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  base: '/product-catalog/',
  plugins: [react()],
  test: {
    environment: 'node',
    globals: true,
  },
});
