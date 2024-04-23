import { faker } from "@faker-js/faker";
import { MessageOfTheDay } from "@motd-ts/models";
import supertest from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createMotd, listMotds } from "../../src/services/motd.services";
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
    const { lastId } = await listMotds({ pageSize: 8 });
    expect(lastId).toBeFalsy();
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

  it("doesn't exceed pageSize", async () => {
    // Create a bunch of dummy MOTDs
    await Promise.all(
      faker.helpers
        .multiple(faker.hacker.phrase, { count: 256 })
        .map(async (phrase) => createMotd(phrase)),
    );

    // Try out a bunch of different page sizes
    await Promise.all(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map(async (pageSize) => {
        const results = await listMotds({ pageSize });
        expect(results.items).toHaveLength(pageSize);
      }),
    );
  });

  it("can't use negative pageSize", async () => {
    // Create a bunch of dummy MOTDs
    await Promise.all(
      faker.helpers
        .multiple(faker.hacker.phrase, { count: 16 })
        .map(async (phrase) => createMotd(phrase)),
    );

    const results = await listMotds({ pageSize: -1 });
    expect(results.lastId).toBeFalsy();
    expect(results.items).toHaveLength(0);
  });

  it("can't use NaN pageSize", async () => {
    // Create a bunch of dummy MOTDs
    await Promise.all(
      faker.helpers
        .multiple(faker.hacker.phrase, { count: 16 })
        .map(async (phrase) => createMotd(phrase)),
    );

    const results = await listMotds({ pageSize: NaN });
    expect(results.lastId).toBeFalsy();
    expect(results.items).toHaveLength(0);
  });
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

  it("200 when no MOTDs", async () => {
    const response = await supertest(testApp.server).get("/history");
    expect(response.statusCode).toEqual(200);
    expect(response.body.lastId).toBeFalsy();
    expect(response.body.items).toHaveLength(0);
  });

  it("200 when MOTDs exist", async () => {
    // Create a bunch of dummy MOTDs
    const allMotds = await Promise.all(
      faker.helpers
        .multiple(faker.hacker.phrase, { count: 128 })
        // We stringify then parse to emulate how the object would get flattened
        .map(async (phrase) => JSON.parse(JSON.stringify(await createMotd(phrase)))),
    );

    const response = await supertest(testApp.server).get("/history");
    expect(response.statusCode).toEqual(200);
    expect(response.body.lastId).toBeTruthy();
    expect(response.body.items.length).toBeGreaterThan(0);
    expect(allMotds).toEqual(expect.arrayContaining(response.body.items));
  });

  it("200 when MOTDs exist and using previousLastId", async () => {
    // Create a bunch of dummy MOTDs
    const allMotds = await Promise.all(
      faker.helpers
        .multiple(faker.hacker.phrase, { count: 128 })
        // We stringify then parse to emulate how the object would get flattened
        .map(async (phrase) => JSON.parse(JSON.stringify(await createMotd(phrase)))),
    );

    // Paginate through the EVERYTHING, and collect results.
    const motdsFoundFromListing: MessageOfTheDay[] = [];
    let lastId: string | undefined;
    do {
      let request = supertest(testApp.server).get(`/history`);
      if (lastId) request = request.query({ previousLastId: lastId });

      // eslint-disable-next-line no-await-in-loop
      const response = await request;
      response.body.items.forEach((item) => motdsFoundFromListing.push(item));
      lastId = response.body.lastId;
    } while (lastId);

    expect(motdsFoundFromListing).toHaveLength(allMotds.length);
    expect(allMotds).toEqual(expect.arrayContaining(motdsFoundFromListing));
  });

  it("400 when malformed previousLastId used", async () => {
    const response = await supertest(testApp.server)
      .get("/history")
      .query({ previousLastId: "BADID" });
    expect(response.statusCode).toEqual(400);
  });

  it("400 when non-number used for pageSize", async () => {
    const response = await supertest(testApp.server)
      .get("/history")
      .query({ pageSize: "thisIsWrong" });
    expect(response.statusCode).toEqual(400);
  });
});
