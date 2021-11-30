module.exports = {
  preset: "@vue/cli-plugin-unit-jest",

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  testMatch: [
    "**/tests/unit/**/*.spec.(js|jsx|ts|tsx)",
    "**/__tests__/*.spec.(js|jsx|ts|tsx)",
  ],
};
