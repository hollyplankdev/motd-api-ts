import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createMotd } from "../src/services/motd.services";
import TestApp from "./utils/testApp";

describe("Message of the Day", () => {
  const testApp = new TestApp();
  beforeEach(async () => testApp.setup());
  afterEach(async () => testApp.teardown());

  describe("Service", () => {
    it("creates new MOTD", async () => {
      const message = "An example message!";
      const motd = await createMotd(message);
      expect(motd).toBeTruthy();
      expect(motd.message).toEqual(message);
      expect(motd._id).toBeTypeOf("string");
      expect(motd.createdAt).toBeTruthy();
      expect(motd.updatedAt).toBeTruthy();
    });
  });
});
