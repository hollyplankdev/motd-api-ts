import * as http from "http";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import runApp from "../../src/app";
import { API_SPEC_PATH } from "../../src/config/apiValidator.config";
import TestApi from "./testApi";
import TestJWT from "./testJWT";
import { AUTH0_DOMAIN } from "../../src/config/auth0.config";

/**
 * A utility class to help with testing our backend app. This wraps a bunch of things that sets up a
 * valid runtime environment for the backend to operate while being tested.
 */
export default class TestApp {
  /** The HTTP server instance backing our app */
  public server: http.Server;

  /** The database emulated in memory for quick DB tests. */
  public mongod?: MongoMemoryServer;

  /** QOL object that uses supertest to call actual endpoints. */
  public api: TestApi;

  /** QOL object that allows for generating invalid JWTs, and fudging valid JWTs. */
  public jwt: TestJWT;

  /** Spin up the backend app and configure the environment for testing. */
  public async setup() {
    // Create the in-memory test DB
    this.mongod = await MongoMemoryServer.create();

    // Start the backend
    const startAppResults = await runApp({
      mongoDbUrl: this.mongod.getUri(),
      apiSpecPath: API_SPEC_PATH,
      auth0Domain: AUTH0_DOMAIN,
    });
    this.server = startAppResults.httpServer;

    this.api = new TestApi();
    this.api.setup(this.server);

    this.jwt = new TestJWT(AUTH0_DOMAIN);
    this.jwt.setup();
  }

  /** Shutdown the backend app and un-configure the environment. */
  public async teardown() {
    this.jwt.teardown();

    // Stop the backend
    await new Promise<void>((resolve, reject) => {
      this.server.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    // Stop the in-memory test DB
    if (this.mongod) await this.mongod.stop();
    await mongoose.disconnect();
  }
}
