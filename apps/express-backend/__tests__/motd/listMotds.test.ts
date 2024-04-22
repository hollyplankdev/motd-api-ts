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
  it("returns results in descending order");
  it("doesn't skip MOTDs");
});
