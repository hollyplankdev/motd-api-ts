import { faker } from "@faker-js/faker";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createMotd, updateMotd, fetchMotd } from "../../src/services/motd.services";
import TestApp from "../utils/testApp";

describe("updateMotd", () => {
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

  it("can't use empty ID w/ empty message", async () => {
    const motd = await updateMotd("", "");
    expect(motd).toBeFalsy();
  });

  it("can't use empty ID w/ valid message", async () => {
    const motd = await updateMotd("", faker.company.catchPhrase());
    expect(motd).toBeFalsy();
  });

  it("can't use invalid ID w/ empty message", async () => {
    const motd = await updateMotd("BADID", "");
    expect(motd).toBeFalsy();
  });

  it("can't use invalid ID w/ valid message", async () => {
    const motd = await updateMotd("BADID", faker.company.catchPhrase());
    expect(motd).toBeFalsy();
  });

  it("can't use valid ID w/ empty message", async () => {
    const motd = await createMotd(faker.company.catchPhrase());
    const updatedMotd = await updateMotd(motd?._id, "");
    const foundMotd = await fetchMotd(motd?._id);

    expect(motd).toBeTruthy();
    expect(updatedMotd).toBeFalsy();
    expect(foundMotd).toBeTruthy();
    expect(motd?.message).toEqual(foundMotd?.message);
    expect(motd?.updatedAt).toEqual(foundMotd?.updatedAt);
  });

  it("can use valid ID w/ valid message", async () => {
    const motd = await createMotd(faker.company.catchPhrase());

    for (let x = 0; x < 10; x += 1) {
      // eslint-disable-next-line no-await-in-loop
      const updatedMotd = await updateMotd(motd?._id, faker.hacker.phrase());
      // eslint-disable-next-line no-await-in-loop
      const foundMotd = await fetchMotd(motd?._id);

      expect(motd).toBeTruthy();
      expect(updatedMotd).toBeTruthy();
      expect(foundMotd).toBeTruthy();
      expect(motd?._id).toEqual(updatedMotd?._id);
      expect(updatedMotd?._id).toEqual(foundMotd?._id);
      expect(updatedMotd?.message).toEqual(foundMotd?.message);
      expect(motd?.message).not.toEqual(updatedMotd?.message);
      expect(motd?.message).not.toEqual(foundMotd?.message);
      expect(motd?.updatedAt).not.toEqual(foundMotd?.updatedAt);
    }
  });
});
