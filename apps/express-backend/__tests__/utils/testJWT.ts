import { faker } from "@faker-js/faker";
import jwt from "jsonwebtoken";

export default class TestJWT {
  /** A fake JWT to re-use. */
  private cachedFakeJWT: string;

  //
  //  Public
  //

  /**
   * Generates a fake JWT for testing purposes. The JWT is signed with it's own secret, but should
   * NOT be valid to our API - meaning it can be used to ensure that endpoints don't accept just ANY
   * JWT.
   */
  public fake(): string {
    // If we don't have a fake JWT yet... GENERATE ONE.
    if (!this.cachedFakeJWT) {
      this.cachedFakeJWT = jwt.sign({ someMessage: faker.hacker.phrase() }, "secretOOOOO", {
        audience: faker.hacker.noun(),
      });
    }
    return this.cachedFakeJWT;
  }

  public real() {
    throw new Error("TODO - implement JWT mocking");
    return this.cachedFakeJWT;
  }
}
