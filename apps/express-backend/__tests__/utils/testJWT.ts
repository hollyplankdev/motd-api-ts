/** Thank you to https://carterbancroft.com/mocking-json-web-tokens-and-auth0/ for the reference! */
import { faker } from "@faker-js/faker";
import { JsonWebKey, createPublicKey, generateKeyPairSync } from "crypto";
import jwt from "jsonwebtoken";
import nock from "nock";

export interface GenerateTestJwtConfig {
  /**
   * What type of JWT should we generate?
   *
   * - "valid": A JWT that while testing is considered valid and should be accepted by the backend.
   * - "unsigned": A JWT that doesn't have a signature, which should get rejected by the backend.
   * - "badlySigned": A JWT that is signed but NOT by our trusted sources, which should get rejected
   *   by the backend.
   */
  is: "valid" | "unsigned" | "badlySigned";

  /** The audience that this JWT is acting on. */
  audience?: string;

  /** The permissions that this JWT has. */
  permissions?: string[];
}

/**
 * A utility class to help with generating fake JWTs at runtime, and fudging JWTs that the backend
 * considers to be real while being tested.
 */
export default class TestJWT {
  /** The passphrase to use when generating RSA keys. */
  readonly rsaPassphrase = "testPassphrase";

  /** OPTIONAL. A default audience value to use, when one is not provided. */
  private defaultAudience?: string;

  /** The URL that auth0 is using, for this app. */
  private auth0Url: string;

  /** The private key to use when fudging "real" JWTs. */
  private fudgedPrivateKey: string;

  /** The public key to use when fudging "real" JWTs. */
  private fudgedPublicKey: JsonWebKey;

  /** The currently running instance of nock, used to fudge JWT requests. */
  private nockInstance: nock.Interceptor;

  //
  //  Init
  //

  constructor(config: { auth0Domain: string; defaultAudience?: string }) {
    this.auth0Url = `https://${config.auth0Domain}`;

    this.defaultAudience = config.defaultAudience;
    const fudgedKeys = this.generateRSAKey();
    this.fudgedPrivateKey = fudgedKeys.privateKey;
    this.fudgedPublicKey = createPublicKey(fudgedKeys.publicKey).export({ format: "jwk" });
  }

  public setup() {
    this.nockInstance = nock(this.auth0Url).persist(true).get("/.well-known/jwks.json");
    this.nockInstance.reply(200, this.fudgeJWTResponse());
  }

  public teardown() {
    nock.removeInterceptor(this.nockInstance);
  }

  //
  //  Public
  //

  /** Create a JWT to use for testing. */
  public create(config: Partial<GenerateTestJwtConfig>): string {
    // Assign defaults to the config so that it's no longer partial
    const fullConfig: GenerateTestJwtConfig = {
      is: "valid",
      audience: this.defaultAudience,
      ...config,
    };

    // Determine how to create the JWT based on the config.
    switch (fullConfig.is) {
      case "valid":
        return this.createRealJwt(fullConfig);
      case "badlySigned":
        return this.createBadlySignedJwt(fullConfig);
      case "unsigned":
        return this.createUnsignedJwt(fullConfig);
      default:
        return "";
    }
  }

  //
  //  Private
  //

  public createRealJwt(config: GenerateTestJwtConfig) {
    const { audience, permissions } = config;
    const payload = { ...TestJWT.randomJwtPayload(), permissions };

    return jwt.sign(
      payload,
      { key: this.fudgedPrivateKey, passphrase: this.rsaPassphrase },
      {
        header: { kid: "0", alg: "RS256" },
        algorithm: "RS256",
        expiresIn: "1d",
        issuer: `${this.auth0Url}/`,
        audience,
      },
    );
  }

  // eslint-disable-next-line class-methods-use-this
  public createBadlySignedJwt(config: GenerateTestJwtConfig): string {
    const { audience, permissions } = config;
    const payload = { ...TestJWT.randomJwtPayload(), permissions };

    return jwt.sign(payload, "secretOOOOO", { audience });
  }

  // eslint-disable-next-line class-methods-use-this
  public createUnsignedJwt(config: GenerateTestJwtConfig): string {
    const { audience, permissions } = config;
    const payload = { ...TestJWT.randomJwtPayload(), permissions };

    return jwt.sign(payload, null, { audience, algorithm: "none" });
  }

  //
  //  Private
  //

  private static randomJwtPayload() {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      nickname: faker.person.fullName(),
    };
  }

  private fudgeJWTResponse() {
    return {
      keys: [
        {
          alg: "RS256",
          kty: "RSA",
          use: "sig",
          n: this.fudgedPublicKey.n,
          e: this.fudgedPublicKey.e,
          kid: "0",
        },
      ],
    };
  }

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
