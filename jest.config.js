/* eslint-env node */
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',

  // Simulates browser environment for React components
  testEnvironment: 'jsdom',

  // Runs setup scripts after Jest environment setup
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],

  // Defines transformations for your source files
  transform: {
    '^.+\\.(ts|tsx|mjs|js|jsx)$': 'ts-jest', // Transforms TypeScript and ESM modules
    '^.+\\.(js|jsx)$': 'babel-jest', // Also explicitly uses Babel for JS/JSX files
  },

  // Tells Jest explicitly which node_modules need transformation
  transformIgnorePatterns: [
    '/node_modules/(?!(axios|@uppy|nanoid|preact|exifr|p-queue|p-timeout|companion-client|p-retry|retry|is-network-error)/)',
  ],

  // File extensions Jest recognizes during module resolution
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'mjs'],

  // Allows importing CSS/SCSS files into Jest tests
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
    '\\.(png|jpe?g|gif|svg)$': '<rootDir>/src/utils/file.mock.js',
  },

  // Treat `.ts` and `.tsx` explicitly as ES Modules
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
};
