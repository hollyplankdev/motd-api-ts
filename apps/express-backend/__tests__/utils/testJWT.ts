/** Thank you to https://carterbancroft.com/mocking-json-web-tokens-and-auth0/ for the reference! */
import { faker } from "@faker-js/faker";
import jwt from "jsonwebtoken";
import { generateKeyPairSync, createPublicKey, createPrivateKey, JsonWebKey } from "crypto";

export default class TestJWT {
  /** The passphrase to use when generating RSA keys. */
  readonly rsaPassphrase = "testPassphrase";

  /** The domain that auth0 is using, for this app. */
  private auth0Domain: string;

  /** The private key to use when fudging "real" JWTs. */
  private fudgedPrivateKey: string;

  /** The public key to use when fudging "real" JWTs. */
  private fudgedPublicKey: JsonWebKey;

  /** A fake JWT to re-use. */
  private cachedFakeJWT: string;

  /**
   * A cache of fudged JWTs to re-use that are considered "real". Key is the audience of the JWT,
   * value is the encoded JWT itself.
   */
  private cachedJWTs: Map<string, string> = new Map<string, string>();

  //
  //  Init
  //

  constructor(auth0Domain: string) {
    this.auth0Domain = auth0Domain;

    const fudgedKeys = this.generateRSAKey();
    this.fudgedPrivateKey = fudgedKeys.privateKey;
    this.fudgedPublicKey = createPublicKey(fudgedKeys.publicKey).export({ format: "jwk" });
  }

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

  public real(audience: string) {
    // If we don't have a "real" (fudged) JWT yet for this audience... GENERATE ONE.
    if (!this.cachedJWTs.has(audience)) {
      const payload = { nickname: faker.person.firstName() };
      this.cachedJWTs.set(
        audience,
        jwt.sign(
          payload,
          { key: this.fudgedPrivateKey, passphrase: this.rsaPassphrase },
          {
            header: { kid: "0", alg: "RS256" },
            algorithm: "RS256",
            expiresIn: "1d",
            issuer: `https://${this.auth0Domain}/`,
            audience,
          },
        ),
      );
    }

    return this.cachedJWTs.get(audience);
  }

  //
  //  Private
  //

  private generateRSAKey() {
    return generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
        cipher: "aes-256-cbc",
        passphrase: this.rsaPassphrase,
      },
    });
  }
}
