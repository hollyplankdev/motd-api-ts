import { faker } from "@faker-js/faker";
import { MessageOfTheDay } from "@motd-ts/models";
import mongoose from "mongoose";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import TestApp from "../utils/testApp";

describe("GET `/:motdId`", () => {
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

  it("400 when invalid ID used", async () => {
    const response = await testApp.api.getMotd("INVALIDID").expect(400);

    const foundMotd: MessageOfTheDay = response.body;
    expect(foundMotd._id).toBeFalsy();
  });

  it("404 when non-existing ObjectId used", async () => {
    const response = await testApp.api
      .getMotd(new mongoose.Types.ObjectId().toString())
      .expect(404);

    const foundMotd: MessageOfTheDay = response.body;
    expect(foundMotd._id).toBeFalsy();
  });

  it("200 when MOTD exists", async () => {
    const message = faker.hacker.phrase();
    const token = testApp.jwt({ is: "valid", permissions: ["motd:create"] });
    const createResponse = await testApp.api.createMotd({ token }).send({ message }).expect(200);
    const motd = createResponse.body as MessageOfTheDay;

    const getResponse = await testApp.api.getMotd(motd?._id!).expect(200);

    const transformedMotd = JSON.parse(JSON.stringify(motd)) as MessageOfTheDay;
    const foundMotd: MessageOfTheDay = getResponse.body;
    expect(transformedMotd._id).toEqual(foundMotd._id);
    expect(transformedMotd.message).toEqual(foundMotd.message);
    expect(transformedMotd.createdAt).toEqual(foundMotd.createdAt);
    expect(transformedMotd.updatedAt).toEqual(foundMotd.updatedAt);
  });
});
