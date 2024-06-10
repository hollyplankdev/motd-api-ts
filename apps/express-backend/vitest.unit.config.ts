/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globalSetup: "__tests__/globalSetup.ts",
    maxConcurrency: 2,
    include: ["**/*.unit.test.?(c|m)[jt]s?(x)"],
  },
});
