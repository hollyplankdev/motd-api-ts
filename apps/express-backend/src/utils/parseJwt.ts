import jsonwebtoken from "jsonwebtoken";

export type ParsedJwtPayload = jsonwebtoken.JwtPayload & { permissions?: string[] };

/**
 * Parses the contents of an encoded JWT string. This does NOT verify the JWT's signature, so make
 * sure that this is only used on a trusted JWT (after a JWT middleware, for example).
 *
 * This always assumes that the JWT's payload is JSON.
 */
export default function parseJwt(jwtString: string | undefined): ParsedJwtPayload | undefined {
  try {
    if (!jwtString) throw new Error("No JWT string provided");

    const jwt = jsonwebtoken.decode(jwtString, { complete: true, json: true });
    if (!jwt) throw new Error("Failed to decode JWT string");

    return jwt.payload as jsonwebtoken.JwtPayload;
  } catch (e) {
    // TODO - should we ever throw, here?
    return undefined;
  }
}
