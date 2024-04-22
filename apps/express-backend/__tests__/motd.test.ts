import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createMotd } from "../src/services/motd.services";
import TestApp from "./utils/testApp";

describe("Message of the Day", () => {
  describe("Service", () => {
    let testApp: TestApp;
    beforeEach(async () => {
      testApp = new TestApp();
      await testApp.setup();
    });
    afterEach(async () => {
      await testApp.teardown();
    });

    it("creates new MOTD", async () => {
      const message = "An example message!";
      const motd = await createMotd(message);

      expect(motd).toBeTruthy();
      expect(motd?.message).toEqual(message);
      expect(motd?._id).toBeTypeOf("string");
      expect(motd?.createdAt).toBeTruthy();
      expect(motd?.updatedAt).toBeTruthy();
    });

    it("fails to create empty string MOTD", async () => {
      const motd = await createMotd("");

      expect(motd).toBeFalsy();
    });
  });
});
