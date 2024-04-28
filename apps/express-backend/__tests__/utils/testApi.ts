/**
 * Thank you so so much to vegaByte @
 * https://github.com/ladjs/supertest/issues/398#issuecomment-607463304 for this structure idea!
 */

import supertest, { Test } from "supertest";
import { App } from "supertest/types";

type RequestOptions = { token?: string };

export default class TestApi {
  private app: App;

  //
  //  Init
  //

  public setup(app: App) {
    this.app = app;
  }

  //
  //  Public Functions
  //

  public getLatestMotd(options?: RequestOptions) {
    return this.request("GET", "/", options);
  }

  public createMotd(options?: RequestOptions) {
    return this.request("POST", "/", options);
  }

  public getMotd(id: string, options?: RequestOptions) {
    return this.request("GET", `/${id}`, options);
  }

  public updateMotd(id: string, options?: RequestOptions) {
    return this.request("PATCH", `/${id}`, options);
  }

  public deleteMotd(id: string, options?: RequestOptions) {
    return this.request("DELETE", `/${id}`, options);
  }

  public listMotdHistory(
    params: { previousLastId?: string; pageSize?: string },
    options?: RequestOptions,
  ) {
    return this.request("GET", "/history", options).query(params);
  }

  //
  //  Private Functions
  //

  /**
   * Create a supertest request configured for our application
   *
   * @param method The type of HTTP request to make.
   * @param options Optional settings
   * @returns A supertest request, unsent
   */
  private request(method: string, endpoint: string, options?: RequestOptions): Test {
    const req: Test = supertest(this.app)[method](endpoint);
    if (options?.token) req.set("Authorization: Bearer", options.token);
    return req;
  }
}
