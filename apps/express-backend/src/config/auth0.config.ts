/* eslint-disable import/prefer-default-export */
import * as dotenv from "dotenv";

//
//  Defaults
//

const DEFAULT_AUTH0_DOMAIN = "dev-wduhl326w2kbi0k3.us.auth0.com";

//
//  Values
//

dotenv.config();

/** The domain string representing the auth0 tenant to use with auth in this application. */
export const AUTH0_DOMAIN: string = process.env.AUTH0_DOMAIN || DEFAULT_AUTH0_DOMAIN;
