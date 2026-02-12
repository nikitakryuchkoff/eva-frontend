import js from '@eslint/js';
import tseslintPlugin from '@typescript-eslint/eslint-plugin';
import tseslintParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';

const config = [
  {
    ignores: [
      // Dependencies
      'node_modules/**/*',
      '**/.pnpm-store/',

      // Build outputs
      'public/assets/js/pdf.worker.min.js',
      '**/out/',
      '**/dist/',
      '**/build/',

      // Package manager
      '**/pnpm-lock.yaml',
      '**/.pnpm-debug.log',

      // Cache & Generated
      '**/.eslintcache',

      // Config files
      '*.config.{js,ts,mjs}',
      '**/tsconfig.json',

      // Environment
      '**/.env*',

      // IDE & System
      '**/.idea/',
      '**/.DS_Store',
    ],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tseslintParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      import: importPlugin,
      '@typescript-eslint': tseslintPlugin,
      'react-hooks': reactHooksPlugin,
      'react-refresh': reactRefreshPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslintPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,

      'react-hooks/exhaustive-deps': 'off',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      semi: 'off',
      'no-undef': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-empty-object-type': 'off',
      'no-case-declarations': 'off',
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'next/**',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: 'routes/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: 'types/**',
              group: 'internal',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          'newlines-between': 'always',
        },
      ],
    },
  },
];

export default config;
