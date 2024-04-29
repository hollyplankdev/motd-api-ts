import axios, { AxiosRequestConfig } from "axios";

/**
 * The possible types of HTTP request methods. See:
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
 */
export type RequestMethod =
  | "GET"
  | "HEAD"
  | "POST"
  | "PUT"
  | "DELETE"
  | "CONNECT"
  | "OPTIONS"
  | "TRACE"
  | "PATCH";

/** Options for making an HTTP request. */
export interface RequestOptions {
  /**
   * The data to include / serialize in the request body, if any. Automatically stringifies this
   * into JSON.
   */
  data?: any;

  /**
   * The auth token to use for this request. Gets placed in the "Authorization" header and used like
   * a JWT.
   */
  authToken?: string;

  /**
   * Should this throw an error when the response code is not 200?
   *
   * @default false
   * @todo Make this TRUE by default.
   */
  throwWhenNotOk?: boolean;

  /** Parameters to be serialized into the query-string of the request. */
  queryParams?: { [key: string]: undefined | string | number };
}

/** A wrapper function to that makes HTTP requests. */
export default async function makeRequest(
  method: RequestMethod,
  url: string,
  options: RequestOptions = {},
) {
  // Get our options, making sure to assign defaults along the way.
  const { data, authToken, throwWhenNotOk, queryParams } = { throwWhenNotOk: false, ...options };
  const headers: AxiosRequestConfig["headers"] = {};

  // If we should use auth, store our token in our request headers
  if (authToken) {
    if (authToken) headers.Authorization = `Bearer ${authToken}`;
  }

  // ACTUALLY MAKE the HTTP request
  const response = await axios(url, { method, data, headers, params: queryParams });

  // If we should throw when this is not 200, DO IT.
  if (throwWhenNotOk && response.status !== 200) {
    throw new Error(`makeRequest Error: ${response.status} - ${response.statusText}`);
  }

  return response;
}
