import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';
import hooksPlugin from 'eslint-plugin-react-hooks';
import unusedImports from 'eslint-plugin-unused-imports';
import tseslint from 'typescript-eslint';

const config = [
  {
    files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
  },
  {
    ignores: [
      // Dependencies
      'node_modules/**/*',
      '**/.pnpm-store/',

      // Build outputs
      '.next/**/*',
      'public/assets/js/pdf.worker.min.js',
      '**/out/',
      '**/dist/',
      '**/build/',

      // Package manager
      '**/pnpm-lock.yaml',
      '**/.pnpm-debug.log',

      // Cache & Generated
      '**/.eslintcache',
      '**/next-env.d.ts',

      // Config files
      '*.config.{js,ts,mjs}', // process all config files at once
      '**/tsconfig.json',

      // Environment
      '**/.env*',

      // IDE & System
      '**/.idea/',
      '**/.DS_Store',
    ],
  },
  {
    name: 'eslint/recommended',
    rules: js.configs.recommended.rules,
  },
  ...tseslint.configs.recommended,
  {
    name: 'react/jsx-runtime',
    plugins: {
      react: reactPlugin,
    },
    rules: reactPlugin.configs['jsx-runtime'].rules,
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    name: 'react-hooks/recommended',
    plugins: {
      'react-hooks': hooksPlugin,
    },
    rules: {
      ...hooksPlugin.configs.recommended.rules,
      'react-hooks/exhaustive-deps': 'off',
    },
  },
  {
    name: 'next/core-web-vitals',
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },
  {
    name: 'prettier/config',
    ...eslintConfigPrettier,
  },
  {
    name: 'project-custom',
    rules: {
      semi: ['error', 'always'],
      '@typescript-eslint/no-unused-vars': 1,
    },
  },
  importPlugin.flatConfigs.recommended,
  {
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
      ],
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-empty-object-type': 'off',
      'import/no-duplicates': 'error',
      'import/no-unresolved': 'off',
      'import/named': 'off',
      'import/default': 'error',
      'import/namespace': 'error',
      'import/no-cycle': 'error',
      'import/no-named-as-default': 'off',
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
