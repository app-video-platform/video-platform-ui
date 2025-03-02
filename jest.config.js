/* eslint-env node */
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest"
  },
  transformIgnorePatterns: [
    "/node_modules/(?!axios)"
  ],
  moduleNameMapper: {
    "\\.(css|scss)$": "identity-obj-proxy"
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx']
};
