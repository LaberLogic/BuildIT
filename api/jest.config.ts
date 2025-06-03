import { pathsToModuleNameMapper } from "ts-jest";

import { compilerOptions } from "./tsconfig.json";

const config = {
  preset: "ts-jest/presets/default-esm",
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { useESM: true }],
  },
  extensionsToTreatAsEsm: [".ts"],
  transformIgnorePatterns: ["/node_modules/(?!shared)/"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, {
    prefix: "<rootDir>/",
  }),
  coveragePathIgnorePatterns: ["/node_modules/", "/generated/prisma/"],
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  collectCoverage: true,
  coverageDirectory: "coverage",
};

export default config;
