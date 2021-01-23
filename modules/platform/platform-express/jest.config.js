const jestBase = require('../../../jest.base.config');

module.exports = {
  ...jestBase,
  "collectCoverageFrom": [
    "<rootDir>/src/**/*.ts",
    "!<rootDir>/src/tests/**/*"
  ],
  collectCoverage: true,
  "coverageReporters": ["json", "lcov", "text", "clover"],
  "coverageThreshold": {
    "global": {
      "branches": 60,
      "functions": 60,
      "lines": 70,
      "statements": 70
    }
  }
};