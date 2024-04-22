import { faker } from "@faker-js/faker";
import { MessageOfTheDay } from "@motd-ts/models";
import mongoose from "mongoose";
import supertest from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createMotd, fetchMotd } from "../../src/services/motd.services";
import TestApp from "../utils/testApp";

describe("fetchMotd", () => {
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

  it("cant use empty ID", async () => {
    const motd = await fetchMotd("");
    expect(motd).toBeFalsy();
  });

  it("cant use invalid ID", async () => {
    const motd = await fetchMotd("GARBAGE");
    expect(motd).toBeFalsy();
  });

  it("cant use valid ID of non-existing motd", async () => {
    const motd = await fetchMotd(new mongoose.Types.ObjectId());
    expect(motd).toBeFalsy();
  });

  it("can use valid IDs of existing motds", async () => {
    for (let x = 0; x < 100; x += 1) {
      // eslint-disable-next-line no-await-in-loop
      const newMotd = await createMotd(faker.company.catchPhrase());
      // eslint-disable-next-line no-await-in-loop
      const foundMotd = await fetchMotd(newMotd?._id);
      expect(foundMotd).toBeTruthy();
      expect(foundMotd?._id).toEqual(newMotd?._id);
      expect(foundMotd?.message).toEqual(newMotd?.message);
      expect(foundMotd?.createdAt).toEqual(newMotd?.createdAt);
      expect(foundMotd?.updatedAt).toEqual(newMotd?.updatedAt);
    }
  });
});

describe("GET `/:motdId`", () => {
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

  it("400 when invalid ID used", async () => {
    const response = await supertest(testApp.server).get(`/BADIDTHINGY`);
    expect(response.statusCode).toEqual(400);

    const foundMotd: MessageOfTheDay = response.body;
    expect(foundMotd._id).toBeFalsy();
  });

  it("404 when non-existing ObjectId used", async () => {
    const response = await supertest(testApp.server).get(`/${new mongoose.Types.ObjectId()}`);
    expect(response.statusCode).toEqual(404);

    const foundMotd: MessageOfTheDay = response.body;
    expect(foundMotd._id).toBeFalsy();
  });

  it("200 when MOTD exists", async () => {
    const motd = await createMotd(faker.hacker.phrase());
    const response = await supertest(testApp.server).get(`/${motd?._id}`);
    expect(response.statusCode).toEqual(200);

    const transformedMotd = JSON.parse(JSON.stringify(motd)) as MessageOfTheDay;
    const foundMotd: MessageOfTheDay = response.body;
    expect(transformedMotd._id).toEqual(foundMotd._id);
    expect(transformedMotd.message).toEqual(foundMotd.message);
    expect(transformedMotd.createdAt).toEqual(foundMotd.createdAt);
    expect(transformedMotd.updatedAt).toEqual(foundMotd.updatedAt);
  });
});
