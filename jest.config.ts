import type { Config } from 'jest';
import { defaults } from 'jest-config';

const config: Config = {
  // Use TypeScript preset for Jest
  preset: 'ts-jest',

  // Test environment
  testEnvironment: 'node',

  // Root directory
  rootDir: './',

  // Test match patterns
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],

  // File extensions
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts'],

  // Transform TypeScript files
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },

  // Module name mappings
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },

  // Collect coverage
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/main.ts',
    '!src/**/index.ts',
  ],

  // Coverage directory
  coverageDirectory: 'coverage',

  // Coverage reporters
  coverageReporters: ['text', 'lcov', 'html'],

  // Setup files
  setupFiles: [],
  setupFilesAfterEnv: [],

  // Clear mocks
  clearMocks: true,

  // Reset modules
  resetModules: true,

  // Test timeout
  testTimeout: 10000,

  // Verbose output
  verbose: true,

  // Detect open handles
  detectOpenHandles: true,

  // Force exit
  forceExit: true,
};

export default config;
