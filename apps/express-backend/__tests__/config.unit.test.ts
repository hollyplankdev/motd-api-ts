import * as OpenAPIValidator from "express-openapi-validator";
import fs from "fs/promises";
import { describe, expect, it } from "vitest";
import { API_SPEC_PATH } from "../src/config/apiValidator.config";
import { HTTP_PORT } from "../src/config/http.config";

describe("API Validator Config", () => {
  describe("the API spec", () => {
    it("should resolve to a real file", async () => {
      await expect(fs.access(API_SPEC_PATH, fs.constants.R_OK)).resolves.not.toThrow();
    });
    it("can be parsed", () => {
      expect(() => OpenAPIValidator.middleware({ apiSpec: API_SPEC_PATH })).not.toThrow();
      expect(OpenAPIValidator.middleware({ apiSpec: API_SPEC_PATH })).toBeTruthy();
    });
  });
});

describe("HTTP Server Config", () => {
  describe("the server port", () => {
    it("is a number", () => {
      expect(HTTP_PORT).toBeTypeOf("number");
    });
  });
});
