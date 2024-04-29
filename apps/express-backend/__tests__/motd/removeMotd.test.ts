import { faker } from "@faker-js/faker";
import { MessageOfTheDay } from "@motd-ts/models";
import mongoose from "mongoose";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createMotd, fetchMotd, removeMotd } from "../../src/services/motd.services";
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

describe("DELETE `/:motdId`", () => {
  let testApp: TestApp;
  beforeAll(async () => {
    testApp = new TestApp();
    await testApp.setup({ defaultAudience: "/motd" });
  });
  afterAll(async () => {
    await testApp.teardown();
  });

  //
  //  Tests
  //

  it("401 when unsigned auth token", async () => {
    const motd = await createMotd(faker.hacker.phrase());
    const token = await testApp.jwt({ is: "unsigned", permissions: ["motd:delete"] });
    await testApp.api.deleteMotd(motd?._id!, { token }).expect(401);
  });

  it("401 when badly signed auth token", async () => {
    const motd = await createMotd(faker.hacker.phrase());
    const token = await testApp.jwt({ is: "badlySigned", permissions: ["motd:delete"] });
    await testApp.api.deleteMotd(motd?._id!, { token }).expect(401);
  });

  it("401 when missing permission", async () => {
    const motd = await createMotd(faker.hacker.phrase());
    const token = await testApp.jwt({ is: "valid", permissions: ["youDontHave:permission"] });
    await testApp.api.deleteMotd(motd?._id!, { token }).expect(401);
  });

  it("400 when invalid ID used", async () => {
    const token = testApp.jwt({ is: "valid", permissions: ["motd:delete"] });
    const response = await testApp.api.deleteMotd("BADID", { token }).expect(400);

    const foundMotd: MessageOfTheDay = response.body;
    expect(foundMotd._id).toBeFalsy();
  });

  it("404 when non-existing ObjectId used", async () => {
    const token = testApp.jwt({ is: "valid", permissions: ["motd:delete"] });
    const response = await testApp.api
      .deleteMotd(new mongoose.Types.ObjectId().toString(), { token })
      .expect(404);

    const foundMotd: MessageOfTheDay = response.body;
    expect(foundMotd._id).toBeFalsy();
  });

  it("200 when MOTD exists", async () => {
    const motd = await createMotd(faker.hacker.phrase());
    const token = testApp.jwt({ is: "valid", permissions: ["motd:delete"] });
    await testApp.api.deleteMotd(motd?._id!, { token }).expect(200);

    const foundMotd = await fetchMotd(motd?._id);
    expect(foundMotd).toBeFalsy();
  });
});
