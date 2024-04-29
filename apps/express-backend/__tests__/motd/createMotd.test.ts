import { faker } from "@faker-js/faker";
import { MessageOfTheDay } from "@motd-ts/models";
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
    await testApp.setup({ defaultAudience: "/motd" });
  });
  afterAll(async () => {
    await testApp.teardown();
  });

  //
  //  Tests
  //

  it("200 when given real data", async () => {
    const message = faker.hacker.phrase();
    const token = testApp.jwt({ is: "valid", permissions: ["motd:create"] });
    const response = await testApp.api.createMotd({ token }).send({ message }).expect(200);

    const motd = response.body as MessageOfTheDay;
    expect(motd).toBeTruthy();
    expect(motd._id).toBeTruthy();
    expect(motd.message).toEqual(message);
    expect(motd.createdAt).toBeTruthy();
    expect(motd.updatedAt).toBeTruthy();

    const foundMotd = await fetchMotd(motd._id);
    expect(foundMotd).toBeTruthy();
  });

  it("401 when no auth token", async () => {
    const message = faker.hacker.phrase();
    const token = undefined;
    await testApp.api.createMotd({ token }).send({ message }).expect(401);
  });

  it("401 when unsigned auth token", async () => {
    const message = faker.hacker.phrase();
    const token = testApp.jwt({ is: "unsigned", permissions: ["motd:create"] });
    await testApp.api.createMotd({ token }).send({ message }).expect(401);
  });

  it("401 when badly signed auth token", async () => {
    const message = faker.hacker.phrase();
    const token = testApp.jwt({ is: "badlySigned", permissions: ["motd:create"] });
    await testApp.api.createMotd({ token }).send({ message }).expect(401);
  });

  it("401 when missing permissions", async () => {
    const message = faker.hacker.phrase();
    const token = testApp.jwt({ is: "valid", permissions: ["motd:somethingElse"] });
    await testApp.api.createMotd({ token }).send({ message }).expect(401);
  });

  it("415 when given no data", async () => {
    const token = testApp.jwt({ is: "valid", permissions: ["motd:create"] });
    await testApp.api.createMotd({ token }).expect(415);
  });

  it("400 when given empty message", async () => {
    const message = "";
    const token = testApp.jwt({ is: "valid", permissions: ["motd:create"] });
    const response = await testApp.api.createMotd({ token }).send({ message }).expect(400);
    expect((response.body as MessageOfTheDay)._id).toBeFalsy();
  });
});
