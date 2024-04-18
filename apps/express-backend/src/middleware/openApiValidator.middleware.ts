import * as OpenAPIValidator from "express-openapi-validator";

/**
 * @param apiSpecPath Where the OpenAPI yaml specification is on disk.
 * @returns An OpenAPIValidator middleware instance.
 */
export default function create(apiSpecPath: string) {
  return OpenAPIValidator.middleware({
    apiSpec: apiSpecPath,
    validateRequests: {
      removeAdditional: "all",
    },
    validateResponses: true,
  });
}
