import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createMotd } from "../../src/services/motd.services";
import TestApp from "../utils/testApp";

describe("createMotd", () => {
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

  it("creates new MOTD", async () => {
    const message = "An example message!";
    const motd = await createMotd(message);

    expect(motd).toBeTruthy();
    expect(motd?.message).toEqual(message);
    expect(motd?._id).toBeTypeOf("string");
    expect(motd?.createdAt).toBeTruthy();
    expect(motd?.updatedAt).toBeTruthy();
  });

  it("can't create empty string MOTD", async () => {
    const motd = await createMotd("");
    expect(motd).toBeFalsy();
  });
});
