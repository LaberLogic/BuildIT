const config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",

  roots: ["<rootDir>/tests"], // <-- Tell Jest to look for tests here

  testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)"],

  testEnvironment: "node",
};

export default config;
