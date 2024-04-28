import * as http from "http";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import runApp from "../../src/app";
import { API_SPEC_PATH } from "../../src/config/apiValidator.config";
import TestApi from "./testApi";
import TestJWT from "./testJWT";

export default class TestApp {
  public server: http.Server;

  public mongod?: MongoMemoryServer;

  public api: TestApi;

  public jwt: TestJWT;

  public async setup() {
    // Create the in-memory test DB
    this.mongod = await MongoMemoryServer.create();

    // Start the backend
    const startAppResults = await runApp({
      mongoDbUrl: this.mongod.getUri(),
      apiSpecPath: API_SPEC_PATH,
    });
    this.server = startAppResults.httpServer;

    this.api = new TestApi();
    this.api.setup(this.server);

    this.jwt = new TestJWT();
  }

  public async teardown() {
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
