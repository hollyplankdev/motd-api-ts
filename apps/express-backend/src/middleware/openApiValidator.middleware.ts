import * as OpenAPIValidator from "express-openapi-validator";
import mongoose from "mongoose";

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

    /**
     * Tell OpenAPIValidator that the custom "mongo-objectid" format is a real thing that it can
     * handle
     */
    serDes: [
      {
        format: "mongo-objectid",
        deserialize: (s: string) => mongoose.Types.ObjectId.createFromHexString(s),
        serialize: (o: mongoose.Types.ObjectId) => o.toHexString(),
      },
    ],
  });
}
