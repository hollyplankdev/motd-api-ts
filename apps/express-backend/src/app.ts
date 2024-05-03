import cors from "cors";
import express from "express";
import * as http from "http";
import { connect as mongooseConnect } from "mongoose";
import { AddressInfo } from "net";
import { JwtMiddlewareConfig } from "./middleware/jwt.middleware.js";
import createOpenApiValidatorMiddleware, {
  OpenApiValidatorMiddlewareConfig,
} from "./middleware/openApiValidator.middleware.js";
import createTransmissionRouter from "./routes/motd.routes.js";
import { populateDefaultMotds } from "./services/motd.services.js";

/** Arguments required for the application to run */
export type RunAppArguments = {
  /** The port to use for the HTTP server backing this app. */
  httpPort?: number;

  /** The URL to use when connecting to the database. */
  mongoDbUrl: string;

  /** The domain that auth0 is using, for this app. */
  auth0Domain: JwtMiddlewareConfig["auth0Domain"];

  /** Should we populate the database with default values? */
  populateDb?: boolean;
} & OpenApiValidatorMiddlewareConfig;

/** Constructs and begins running the application. */
async function runApp(
  args: RunAppArguments,
): Promise<{ app: express.Express; httpServer: http.Server }> {
  //
  //  Server
  //

  // Construct the express app with an HTTP server explicitly
  const app = express();
  const httpServer = http.createServer(app);

  //
  //  Middleware
  //

  app.use(cors());
  app.use(express.json());
  app.use(createOpenApiValidatorMiddleware(args));

  //
  //  Routes
  //

  app.use(createTransmissionRouter({ audience: "/motd", auth0Domain: args.auth0Domain }));

  // Handle any errors from express and wrap them as JSON
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err, req, res, next) => {
    if (err.status) {
      // If we have a specific error status, just report that and wipe anything else to comply with
      // the API spec.
      res.status(err.status).send();
    } else {
      // Report a catch-all for any errors.
      res.status(500).json({
        message: err.message,
        errors: err.errors,
      });
    }
  });

  //
  //  EXECUTE
  //

  // Connect to the database
  const dbConnection = await mongooseConnect(args.mongoDbUrl);
  console.log(`DB connected on port ${dbConnection.connection.port}...`);

  // If we should populate the database with default values... do so!
  if (args.populateDb) {
    await populateDefaultMotds();
  }

  // Start listening on the HTTP server. If there's an error, REJECT!
  // (we promisify this so that in the future we can easily wait for
  // the server to start before doing some other action.)
  const usedPort = await new Promise<number>((resolve, reject) => {
    httpServer.listen(args.httpPort, () => resolve((httpServer.address() as AddressInfo).port));
    httpServer.on("error", (err) => reject(err));
  });

  console.log(`...Server running on port ${usedPort}!`);
  return { app, httpServer };
}

export default runApp;
