import { expressjwt } from "express-jwt";
import JwksRsa, { GetVerificationKey } from "jwks-rsa";

export interface JwtMiddlewareConfig {
  /** The domain that auth0 is using, for this app. */
  auth0Domain: string;

  /** The audience required in the JWT for this middleware to pass. */
  audience: string;
}

export default function create(config: JwtMiddlewareConfig): ReturnType<typeof expressjwt> {
  return expressjwt({
    audience: config.audience,
    issuer: `https://${config.auth0Domain}/`,
    algorithms: ["RS256"],

    secret: JwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 10,
      jwksUri: `https://${config.auth0Domain}/.well-known/jwks.json`,
    }) as GetVerificationKey,
  });
}
