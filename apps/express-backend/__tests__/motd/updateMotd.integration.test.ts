import { faker } from "@faker-js/faker";
import { MessageOfTheDay } from "@motd-ts/models";
import mongoose from "mongoose";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import TestApp from "../utils/testApp";

describe("Update MOTD via PATCH `/:motdId`", () => {
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

  it("415 when invalid ID used and missing message", async () => {
    const token = testApp.jwt({ is: "valid", permissions: ["motd:update"] });
    const response = await testApp.api.updateMotd("BADID", { token }).expect(415);

    const foundMotd: MessageOfTheDay = response.body;
    expect(foundMotd._id).toBeFalsy();
  });

  it("415 when non-existing ObjectId used and missing message", async () => {
    const token = testApp.jwt({ is: "valid", permissions: ["motd:update"] });
    const response = await testApp.api
      .updateMotd(new mongoose.Types.ObjectId().toString(), {
        token,
      })
      .expect(415);

    const foundMotd: MessageOfTheDay = response.body;
    expect(foundMotd._id).toBeFalsy();
  });

  it("400 when invalid ID used", async () => {
    const message = faker.hacker.phrase();
    const token = testApp.jwt({ is: "valid", permissions: ["motd:update"] });
    const response = await testApp.api.updateMotd("BADID", { token }).send({ message }).expect(400);

    const foundMotd: MessageOfTheDay = response.body;
    expect(foundMotd._id).toBeFalsy();
  });

  it("404 when non-existing ObjectId used", async () => {
    const message = faker.hacker.phrase();
    const token = testApp.jwt({ is: "valid", permissions: ["motd:update"] });
    const response = await testApp.api
      .updateMotd(new mongoose.Types.ObjectId().toString(), { token })
      .send({ message })
      .expect(404);

    const foundMotd: MessageOfTheDay = response.body;
    expect(foundMotd._id).toBeFalsy();
  });

  it("401 when unsigned token", async () => {
    const message = faker.hacker.phrase();
    const createMotdToken = testApp.jwt({ is: "valid", permissions: ["motd:create"] });
    const createMotdResponse = await testApp.api
      .createMotd({ token: createMotdToken })
      .send({ message })
      .expect(200);
    const motd = createMotdResponse.body as MessageOfTheDay;

    const newMessage = faker.company.catchPhrase();
    const token = await testApp.jwt({ is: "unsigned", permissions: ["motd:update"] });
    await testApp.api.updateMotd(motd?._id!, { token }).send({ message: newMessage }).expect(401);
  });

  it("401 when badly signed token", async () => {
    const message = faker.hacker.phrase();
    const createMotdToken = testApp.jwt({ is: "valid", permissions: ["motd:create"] });
    const createMotdResponse = await testApp.api
      .createMotd({ token: createMotdToken })
      .send({ message })
      .expect(200);
    const motd = createMotdResponse.body as MessageOfTheDay;

    const newMessage = faker.company.catchPhrase();
    const token = await testApp.jwt({ is: "badlySigned", permissions: ["motd:update"] });
    await testApp.api.updateMotd(motd?._id!, { token }).send({ message: newMessage }).expect(401);
  });

  it("401 when missing permission", async () => {
    const message = faker.hacker.phrase();
    const createMotdToken = testApp.jwt({ is: "valid", permissions: ["motd:create"] });
    const createMotdResponse = await testApp.api
      .createMotd({ token: createMotdToken })
      .send({ message })
      .expect(200);
    const motd = createMotdResponse.body as MessageOfTheDay;

    const newMessage = faker.company.catchPhrase();
    const token = await testApp.jwt({ is: "valid", permissions: ["someOther:permission"] });
    await testApp.api.updateMotd(motd?._id!, { token }).send({ message: newMessage }).expect(401);
  });

  it("200 when MOTD exists", async () => {
    const message = faker.hacker.phrase();
    const createMotdToken = testApp.jwt({ is: "valid", permissions: ["motd:create"] });
    const createMotdResponse = await testApp.api
      .createMotd({ token: createMotdToken })
      .send({ message })
      .expect(200);
    const motd = createMotdResponse.body as MessageOfTheDay;

    const newMessage = faker.company.catchPhrase();
    const token = testApp.jwt({ is: "valid", permissions: ["motd:update"] });
    const response = await testApp.api
      .updateMotd(motd?._id!, { token })
      .send({ message: newMessage })
      .expect(200);

    const transformedMotd = response.body as MessageOfTheDay;
    expect(transformedMotd._id).toEqual(motd?._id);
    expect(transformedMotd.message).toEqual(newMessage);
    expect(motd?.message).not.toEqual(transformedMotd.message);

    const getResponse = await testApp.api.getMotd(motd?._id!).expect(200);
    const foundMotd: MessageOfTheDay = getResponse.body as MessageOfTheDay;
    expect(foundMotd).toBeTruthy();
    expect(foundMotd?.message).toEqual(newMessage);
  });
});
