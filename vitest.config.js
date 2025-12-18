import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    // Helps if you have a separate folder for tests
    include: ['test/**/*.{test,spec}.js'], 
  },
});