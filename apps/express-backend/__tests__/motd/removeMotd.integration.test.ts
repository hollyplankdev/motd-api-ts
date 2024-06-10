import { faker } from "@faker-js/faker";
import { MessageOfTheDay } from "@motd-ts/models";
import mongoose from "mongoose";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import TestApp from "../utils/testApp";

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
    const createMotdMessage = faker.hacker.phrase();
    const createMotdToken = testApp.jwt({ is: "valid", permissions: ["motd:create"] });
    const createMotdResponse = await testApp.api
      .createMotd({ token: createMotdToken })
      .send({ createMotdMessage })
      .expect(200);
    const motd = createMotdResponse.body as MessageOfTheDay;

    const token = await testApp.jwt({ is: "unsigned", permissions: ["motd:delete"] });
    await testApp.api.deleteMotd(motd?._id!, { token }).expect(401);
  });

  it("401 when badly signed auth token", async () => {
    const createMotdMessage = faker.hacker.phrase();
    const createMotdToken = testApp.jwt({ is: "valid", permissions: ["motd:create"] });
    const createMotdResponse = await testApp.api
      .createMotd({ token: createMotdToken })
      .send({ createMotdMessage })
      .expect(200);
    const motd = createMotdResponse.body as MessageOfTheDay;

    const token = await testApp.jwt({ is: "badlySigned", permissions: ["motd:delete"] });
    await testApp.api.deleteMotd(motd?._id!, { token }).expect(401);
  });

  it("401 when missing permission", async () => {
    const createMotdMessage = faker.hacker.phrase();
    const createMotdToken = testApp.jwt({ is: "valid", permissions: ["motd:create"] });
    const createMotdResponse = await testApp.api
      .createMotd({ token: createMotdToken })
      .send({ createMotdMessage })
      .expect(200);
    const motd = createMotdResponse.body as MessageOfTheDay;

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
    const createMotdMessage = faker.hacker.phrase();
    const createMotdToken = testApp.jwt({ is: "valid", permissions: ["motd:create"] });
    const createMotdResponse = await testApp.api
      .createMotd({ token: createMotdToken })
      .send({ createMotdMessage })
      .expect(200);
    const motd = createMotdResponse.body as MessageOfTheDay;

    const token = testApp.jwt({ is: "valid", permissions: ["motd:delete"] });
    await testApp.api.deleteMotd(motd?._id!, { token }).expect(200);

    await testApp.api.getMotd(motd?._id!).expect(404);
  });
});
