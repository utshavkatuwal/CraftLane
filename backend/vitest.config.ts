import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['tests/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    setupFiles: ['./tests/setup.ts'],
  },
});
