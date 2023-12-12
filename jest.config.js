module.exports = {
  testMatch: [
    "**/__tests__/**/*.spec.[jt]s?(x)",
    "**/?(*.)+(spec|test).[tj]s?(x)",
  ],
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
};
