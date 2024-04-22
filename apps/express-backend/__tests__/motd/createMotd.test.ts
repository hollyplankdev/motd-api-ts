import { faker } from "@faker-js/faker";
import { MessageOfTheDay } from "@motd-ts/models";
import supertest from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createMotd, fetchMotd } from "../../src/services/motd.services";
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

describe("POST `/`", () => {
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

  it("200 when given real data", async () => {
    const message = faker.hacker.phrase();
    const response = await supertest(testApp.server).post("/").send({ message });
    expect(response.statusCode).toEqual(200);

    const motd = response.body as MessageOfTheDay;
    expect(motd).toBeTruthy();
    expect(motd._id).toBeTruthy();
    expect(motd.message).toEqual(message);
    expect(motd.createdAt).toBeTruthy();
    expect(motd.updatedAt).toBeTruthy();

    const foundMotd = await fetchMotd(motd._id);
    expect(foundMotd).toBeTruthy();
  });

  it("415 when given no data", async () => {
    const response = await supertest(testApp.server).post("/");
    expect(response.statusCode).toEqual(415);

    const motd = response.body as MessageOfTheDay;
    expect(motd._id).toBeFalsy();
  });

  it("400 when given empty message", async () => {
    const response = await supertest(testApp.server).post("/").send({ message: "" });
    expect(response.statusCode).toEqual(400);

    const motd = response.body as MessageOfTheDay;
    expect(motd._id).toBeFalsy();
  });
});
