import { faker } from "@faker-js/faker";
import { MessageOfTheDay } from "@motd-ts/models";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import TestApp from "../utils/testApp";

describe("List MOTDs via GET `/history`", () => {
  let testApp: TestApp;
  beforeEach(async () => {
    testApp = new TestApp();
    await testApp.setup({ defaultAudience: "/motd" });
  });
  afterEach(async () => {
    await testApp.teardown();
  });

  //
  //  Tests
  //

  it("200 when no MOTDs", async () => {
    const response = await testApp.api.listMotdHistory({}).expect(200);
    expect(response.body.lastId).toBeFalsy();
    expect(response.body.items).toHaveLength(0);
  });

  it("200 when MOTDs exist", async () => {
    // Create a token to use below
    const token = testApp.jwt({ is: "valid", permissions: ["motd:create"] });

    // Create a bunch of dummy MOTDs
    const allMotds = await Promise.all(
      faker.helpers.multiple(faker.hacker.phrase, { count: 128 }).map(async (phrase) => {
        // For each phrase, create a new MOTD using the phrase as a message.
        const createResponse = await testApp.api
          .createMotd({ token })
          .send({ message: phrase })
          .expect(200);
        return createResponse.body as MessageOfTheDay;
      }),
    );

    const response = await testApp.api.listMotdHistory({}).expect(200);
    expect(response.body.lastId).toBeTruthy();
    expect(response.body.items.length).toBeGreaterThan(0);
    expect(allMotds).toEqual(expect.arrayContaining(response.body.items));
  });

  it("200 when MOTDs exist and using previousLastId", async () => {
    // Create a token to use below
    const token = testApp.jwt({ is: "valid", permissions: ["motd:create"] });

    // Create a bunch of dummy MOTDs
    const allMotds = await Promise.all(
      faker.helpers.multiple(faker.hacker.phrase, { count: 128 }).map(async (phrase) => {
        // For each phrase, create a new MOTD using the phrase as a message.
        const createResponse = await testApp.api
          .createMotd({ token })
          .send({ message: phrase })
          .expect(200);
        return createResponse.body as MessageOfTheDay;
      }),
    );

    // Paginate through the EVERYTHING, and collect results.
    const motdsFoundFromListing: MessageOfTheDay[] = [];
    let lastId: string | undefined;
    do {
      // eslint-disable-next-line no-await-in-loop
      const response = await testApp.api.listMotdHistory({ previousLastId: lastId });

      response.body.items.forEach((item) => motdsFoundFromListing.push(item));
      lastId = response.body.lastId;
    } while (lastId);

    expect(motdsFoundFromListing).toHaveLength(allMotds.length);
    expect(allMotds).toEqual(expect.arrayContaining(motdsFoundFromListing));
  });

  it("400 when malformed previousLastId used", async () => {
    await testApp.api.listMotdHistory({ previousLastId: "BADID" }).expect(400);
  });

  it("400 when non-number used for pageSize", async () => {
    await testApp.api.listMotdHistory({ pageSize: "thisIsWrong" }).expect(400);
  });
});
