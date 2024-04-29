import { faker } from "@faker-js/faker";
import { MessageOfTheDay } from "@motd-ts/models";
import mongoose from "mongoose";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createMotd, fetchMotd, updateMotd } from "../../src/services/motd.services";
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

describe("PATCH `/:motdId`", () => {
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
    const motd = await createMotd(faker.hacker.phrase());
    const newMessage = faker.company.catchPhrase();
    const token = await testApp.jwt({ is: "unsigned", permissions: ["motd:update"] });
    await testApp.api.updateMotd(motd?._id!, { token }).send({ message: newMessage }).expect(401);
  });

  it("401 when badly signed token", async () => {
    const motd = await createMotd(faker.hacker.phrase());
    const newMessage = faker.company.catchPhrase();
    const token = await testApp.jwt({ is: "badlySigned", permissions: ["motd:update"] });
    await testApp.api.updateMotd(motd?._id!, { token }).send({ message: newMessage }).expect(401);
  });

  it("200 when MOTD exists", async () => {
    const motd = await createMotd(faker.hacker.phrase());
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

    const foundMotd = await fetchMotd(motd?._id);
    expect(foundMotd).toBeTruthy();
    expect(foundMotd?.message).toEqual(newMessage);
  });
});
