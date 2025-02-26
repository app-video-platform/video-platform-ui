import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import tsParser from '@typescript-eslint/parser'; // Import the parser directly

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    // env: {
    //   node: true,
    //   jest: true,
    // },
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      parser: tsParser, // explicitly specify the parser
      globals: {
        jest: 'readonly',
        node: 'readonly',
      },
      parserOptions: {
        ecmaVersion: 2020, // or 'latest'
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      // Essential Formatting
      indent: ['error', 2],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      'linebreak-style': ['error', 'unix'],

      // Prevent Bugs
      'no-unused-vars': ['warn'],
      'no-console': ['warn'],
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],

      // React Rules
      'react/jsx-filename-extension': ['warn', { extensions: ['.tsx'] }],

      // TypeScript Rules
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn'],

      // Optional Best Practices
      'prefer-const': 'warn',
      'arrow-body-style': ['warn', 'as-needed'],
      'object-curly-spacing': ['error', 'always'],
    },
  },
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
