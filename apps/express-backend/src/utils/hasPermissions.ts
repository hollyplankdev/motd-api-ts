import { Request } from "express";
import parseJwt from "./parseJwt";
import getJwtFromRequest from "./getJwtFromRequest";

/**
 * Does the JWT in the given request have all of the given permissions? This does NOT verify the
 * signature of the JWT.
 */
export default function hasPermissions(req: Request, requiredPermissions: string[]): boolean {
  // Try to get the JWT from the request. If there isn't any, EXIT EARLY.
  const jwt = parseJwt(getJwtFromRequest(req));
  if (!jwt) return false;
  if (!jwt.permissions) return false;

  // Check to see if all of our required permissions are included in the JWT's permissions.
  return requiredPermissions.every((permission) => jwt.permissions?.includes(permission));
}
