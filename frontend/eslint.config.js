import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

// Craftlane ESLint flat configuration.
// ESLint 9 flat config. TypeScript rules come from typescript-eslint.
// React refresh and hooks rules keep the Vite HMR experience safe.
export default tseslint.config(
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2022,
      },
    },
  },
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // React Refresh (Fast Refresh) rule.
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      // Strict React hooks rules.
      ...reactHooks.configs.recommended.rules,
      // TypeScript strictness additions (type-safe rules only).
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'warn',
    },
  },
  {
    // Test files: relax some rules that are intentionally verbose in tests.
    files: ['**/*.{test,spec}.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
  {
    // Ignore built output and dependencies.
    ignores: ['dist/**', 'node_modules/**', 'coverage/**', 'package-lock.json'],
  }
);
