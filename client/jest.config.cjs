/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest/presets/js-with-ts", // ✅ this preset includes JSX support
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.[jt]sx?$": ["ts-jest", { tsconfig: "./tsconfig.app.json" }], // ✅ JSX lives here
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.cjs"],
};
