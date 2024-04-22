import { faker } from "@faker-js/faker";
import mongoose from "mongoose";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { createMotd, fetchLatestMotd, fetchMotd, updateMotd } from "../src/services/motd.services";
import TestApp from "./utils/testApp";

describe("Message of the Day", () => {
  describe("Service", () => {
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

    describe("creates", () => {
      test("new MOTD", async () => {
        const message = "An example message!";
        const motd = await createMotd(message);

        expect(motd).toBeTruthy();
        expect(motd?.message).toEqual(message);
        expect(motd?._id).toBeTypeOf("string");
        expect(motd?.createdAt).toBeTruthy();
        expect(motd?.updatedAt).toBeTruthy();
      });

      test("empty string MOTD", async () => {
        const motd = await createMotd("");
        expect(motd).toBeFalsy();
      });
    });

    describe("get specific", () => {
      test("empty ID", async () => {
        const motd = await fetchMotd("");
        expect(motd).toBeFalsy();
      });

      test("invalid ID", async () => {
        const motd = await fetchMotd("GARBAGE");
        expect(motd).toBeFalsy();
      });

      test("valid ID of non-existing motd", async () => {
        const motd = await fetchMotd(new mongoose.Types.ObjectId());
        expect(motd).toBeFalsy();
      });

      test("many valid motds", async () => {
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

    describe("get latest", async () => {
      test("valid latest", async () => {
        const newMotd = await createMotd(faker.company.catchPhrase());
        const latestMotd = await fetchLatestMotd();

        expect(latestMotd).toBeTruthy();
        expect(latestMotd?._id).toEqual(newMotd?._id);
        expect(latestMotd?.message).toEqual(newMotd?.message);
        expect(latestMotd?.createdAt).toEqual(newMotd?.createdAt);
        expect(latestMotd?.updatedAt).toEqual(newMotd?.updatedAt);
      });

      test("out of date", async () => {
        const newMotd = await createMotd(faker.company.catchPhrase());
        await createMotd(faker.company.catchPhrase());
        const latestMotd = await fetchLatestMotd();

        expect(latestMotd).toBeTruthy();
        expect(latestMotd?._id).not.toEqual(newMotd?._id);
        expect(latestMotd?.message).not.toEqual(newMotd?.message);
        expect(latestMotd?.createdAt).not.toEqual(newMotd?.createdAt);
        expect(latestMotd?.updatedAt).not.toEqual(newMotd?.updatedAt);
      });
    });

    describe("update", () => {
      test("empty ID w/ empty message", async () => {
        const motd = await updateMotd("", "");
        expect(motd).toBeFalsy();
      });

      test("empty ID w/ valid message", async () => {
        const motd = await updateMotd("", faker.company.catchPhrase());
        expect(motd).toBeFalsy();
      });

      test("invalid ID w/ empty message", async () => {
        const motd = await updateMotd("BADID", "");
        expect(motd).toBeFalsy();
      });

      test("invalid ID w/ valid message", async () => {
        const motd = await updateMotd("BADID", faker.company.catchPhrase());
        expect(motd).toBeFalsy();
      });

      test("valid ID w/ empty message", async () => {
        const motd = await createMotd(faker.company.catchPhrase());
        const updatedMotd = await updateMotd(motd?._id, "");
        const foundMotd = await fetchMotd(motd?._id);

        expect(motd).toBeTruthy();
        expect(updatedMotd).toBeFalsy();
        expect(foundMotd).toBeTruthy();
        expect(motd?.message).toEqual(foundMotd?.message);
        expect(motd?.updatedAt).toEqual(foundMotd?.updatedAt);
      });

      test("valid ID w/ valid message multiple times", async () => {
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
  });
});
