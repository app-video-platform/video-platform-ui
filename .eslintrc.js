/* eslint-env node */
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    // Essential Formatting
    indent: ['error', 2],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'max-len': ['error', { code: 150 }],

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
};
