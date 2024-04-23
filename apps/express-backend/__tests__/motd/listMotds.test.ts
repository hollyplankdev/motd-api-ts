import { faker } from "@faker-js/faker";
import { MessageOfTheDay } from "@motd-ts/models";
import mongoose from "mongoose";
import supertest from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createMotd, fetchMotd, listMotds } from "../../src/services/motd.services";
import TestApp from "../utils/testApp";

describe("listMotds", () => {
  let testApp: TestApp;
  beforeEach(async () => {
    testApp = new TestApp();
    await testApp.setup();
  });
  afterEach(async () => {
    await testApp.teardown();
  });

  //
  //  Tests
  //

  it("excludes pageKey when no results", async () => {
    const { pageKey } = await listMotds({ pageSize: 8 });
    expect(pageKey).toBeFalsy();
  });

  it("returns empty array when no results", async () => {
    const { items } = await listMotds({ pageSize: 8 });
    expect(items).toBeTruthy();
    expect(items).toHaveLength(0);
  });

  it("doesn't skip MOTDs", async () => {
    // Create a bunch of dummy MOTDs
    const allMotds = await Promise.all(
      faker.helpers
        .multiple(faker.hacker.phrase, { count: 32 })
        .map(async (phrase) => createMotd(phrase)),
    );

    // Paginate through the EVERYTHING, and collect results.
    const motdsFoundFromListing: MessageOfTheDay[] = [];
    let lastId: string | undefined;
    do {
      // eslint-disable-next-line no-await-in-loop
      const results = await listMotds({ pageSize: 8, previousLastId: lastId });

      results.items.forEach((item) => motdsFoundFromListing.push(item));
      lastId = results.lastId;
    } while (lastId);

    expect(motdsFoundFromListing).toHaveLength(allMotds.length);
    expect(motdsFoundFromListing).toEqual(expect.arrayContaining(allMotds));
  });

  it("returns results in descending order", async () => {
    // Create a bunch of dummy MOTDs
    await Promise.all(
      faker.helpers
        .multiple(faker.hacker.phrase, { count: 256 })
        .map(async (phrase) => createMotd(phrase)),
    );

    // Paginate through the EVERYTHING, and collect results.
    const motdsFoundFromListing: MessageOfTheDay[] = [];
    let lastId: string | undefined;
    do {
      // eslint-disable-next-line no-await-in-loop
      const results = await listMotds({ pageSize: 8, previousLastId: lastId });

      results.items.forEach((item) => motdsFoundFromListing.push(item));
      lastId = results.lastId;
    } while (lastId);

    // Ensure in correct order
    for (let i = 0; i < motdsFoundFromListing.length - 1; i += 1) {
      const thisMotd = motdsFoundFromListing[i];
      const nextMotd = motdsFoundFromListing[i + 1];
      expect(thisMotd.createdAt.valueOf()).toBeGreaterThanOrEqual(nextMotd.createdAt.valueOf());
    }
  });

  it("doesn't exceed pageSize");
});

describe("GET `/history`", () => {
  let testApp: TestApp;
  beforeEach(async () => {
    testApp = new TestApp();
    await testApp.setup();
  });
  afterEach(async () => {
    await testApp.teardown();
  });

  //
  //  Tests
  //

  it("200 when no MOTDs");
  it("200 when MOTDs exist");
  it("200 when MOTDs exist and using lastPageKey");
  it("400 when no malformed lastPageKey used");
});
