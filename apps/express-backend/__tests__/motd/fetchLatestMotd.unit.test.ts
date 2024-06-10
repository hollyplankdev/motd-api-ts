import { faker } from "@faker-js/faker";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createMotd, fetchLatestMotd } from "../../src/services/motd.services";
import TestApp from "../utils/testApp";

describe("fetchLatestMotd", () => {
  let testApp: TestApp;
  beforeEach(async () => {
    testApp = new TestApp();
    await testApp.setup();
  });
  afterEach(async () => {
    await testApp.teardown();
  });

  //
  //  Tests
  //

  it("gets last created MOTD", async () => {
    const newMotd = await createMotd(faker.company.catchPhrase());
    const latestMotd = await fetchLatestMotd();

    expect(latestMotd).toBeTruthy();
    expect(latestMotd?._id).toEqual(newMotd?._id);
    expect(latestMotd?.message).toEqual(newMotd?.message);
    expect(latestMotd?.createdAt).toEqual(newMotd?.createdAt);
    expect(latestMotd?.updatedAt).toEqual(newMotd?.updatedAt);
  });

  it("gets 2nd MOTD when two are created", async () => {
    const newMotd = await createMotd(faker.company.catchPhrase());
    await createMotd(faker.company.catchPhrase());
    const latestMotd = await fetchLatestMotd();

    expect(latestMotd).toBeTruthy();
    expect(latestMotd?._id).not.toEqual(newMotd?._id);
    expect(latestMotd?.message).not.toEqual(newMotd?.message);
    expect(latestMotd?.createdAt).not.toEqual(newMotd?.createdAt);
    expect(latestMotd?.updatedAt).not.toEqual(newMotd?.updatedAt);
  });
});
