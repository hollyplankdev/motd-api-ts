import { faker } from "@faker-js/faker";
import mongoose from "mongoose";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createMotd, fetchMotd } from "../../src/services/motd.services";
import TestApp from "../utils/testApp";

describe("fetchMotd", () => {
  let testApp: TestApp;
  beforeAll(async () => {
    testApp = new TestApp();
    await testApp.setup();
  });
  afterAll(async () => {
    await testApp.teardown();
  });

  //
  //  Tests
  //

  it("cant use empty ID", async () => {
    const motd = await fetchMotd("");
    expect(motd).toBeFalsy();
  });

  it("cant use invalid ID", async () => {
    const motd = await fetchMotd("GARBAGE");
    expect(motd).toBeFalsy();
  });

  it("cant use valid ID of non-existing motd", async () => {
    const motd = await fetchMotd(new mongoose.Types.ObjectId());
    expect(motd).toBeFalsy();
  });

  it("can use valid IDs of existing motds", async () => {
    for (let x = 0; x < 100; x += 1) {
      // eslint-disable-next-line no-await-in-loop
      const newMotd = await createMotd(faker.company.catchPhrase());
      // eslint-disable-next-line no-await-in-loop
      const foundMotd = await fetchMotd(newMotd?._id);
      expect(foundMotd).toBeTruthy();
      expect(foundMotd?._id).toEqual(newMotd?._id);
      expect(foundMotd?.message).toEqual(newMotd?.message);
      expect(foundMotd?.createdAt).toEqual(newMotd?.createdAt);
      expect(foundMotd?.updatedAt).toEqual(newMotd?.updatedAt);
    }
  });
});
