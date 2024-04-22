import * as http from "http";
import supertest from "supertest";
import { afterAll, beforeAll, describe, it, expect } from "vitest";
import runApp from "../src/app";
import { API_SPEC_PATH } from "../src/config/apiValidator.config";
import { MONGODB_URL } from "../src/config/mongoDb.config";

describe("`/` Endpoint", async () => {
  // Start the app
  let server: http.Server;

  // Launch a server with a random port before these tests
  beforeAll(async () => {
    const results = await runApp({ mongoDbUrl: MONGODB_URL, apiSpecPath: API_SPEC_PATH });
    server = results.httpServer;
  });

  // Close our launched server after these tests
  afterAll(
    async () =>
      new Promise<void>((resolve, reject) => {
        server.close((err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      }),
  );

  //
  //  Tests
  //

  it("responds with Hello World", async () => {
    const response = await supertest(server).get("/").expect(200);
    expect(response.text).toBe("Hello World!");
  });
});
