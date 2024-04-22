import { faker } from "@faker-js/faker";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createMotd, removeMotd, fetchMotd } from "../../src/services/motd.services";
import TestApp from "../utils/testApp";

describe("removeMotd", () => {
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

  it("can't use empty ID", async () => {
    const result = await removeMotd("");
    expect(result).toBeFalsy();
  });

  it("can't use invalid ID", async () => {
    const result = await removeMotd("BADID");
    expect(result).toBeFalsy();
  });

  it("can use valid ID", async () => {
    const motd = await createMotd(faker.hacker.phrase());
    expect(motd).toBeTruthy();

    const result = await removeMotd(motd?._id);
    expect(result).toBeTruthy();

    const afterRemovingResult = await removeMotd(motd?._id);
    expect(afterRemovingResult).toBeFalsy();

    const removedMotd = await fetchMotd(motd?._id);
    expect(removedMotd).toBeFalsy();
  });
});
