import { Request } from "express";

/** Given a Request from Express, get the encoded JWT string from it's headers. */
export default function getJwtFromRequest(req: Request): string | undefined {
  try {
    const headerValue: string | undefined = req.headers.authorization;
    if (!headerValue) throw new Error("No Authorization header found");
    if (!headerValue.includes("Bearer ")) throw new Error("Authorization header malformed");

    return headerValue.split("Bearer ")[1];
  } catch (e) {
    // TODO - should we throw in the future?
    return undefined;
  }
}
