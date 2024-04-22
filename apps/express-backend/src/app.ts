import express from "express";
import * as http from "http";
import { AddressInfo } from "net";
import createOpenApiValidatorMiddleware from "./middleware/openApiValidator.middleware.js";
import transmissionRouter from "./routes/motd.routes.js";

/** Arguments required for the application to run */
export interface RunAppArguments {
  /** The port to use for the HTTP server backing this app. */
  httpPort?: number;

  /** Where on disk to find the OpenAPI spec. */
  apiSpecPath: string;
}

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

  app.use(express.json());
  app.use(createOpenApiValidatorMiddleware(args.apiSpecPath));

  //
  //  Routes
  //

  app.use(transmissionRouter);

  // Handle any errors from express and wrap them as JSON
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err, req, res, next) => {
    // Report a catch-all for any errors.
    res.status(err.status || 500).json({
      message: err.message,
      errors: err.errors,
    });
  });

  //
  //  EXECUTE
  //

  // Start listening on the HTTP server. If there's an error, REJECT!
  // (we promisify this so that in the future we can easily wait for
  // the server to start before doing some other action.)
  const usedPort = await new Promise<number>((resolve, reject) => {
    httpServer.listen(args.httpPort, () => resolve((httpServer.address() as AddressInfo).port));
    httpServer.on("error", (err) => reject(err));
  });

  console.log(`Server running on port ${usedPort}`);
  return { app, httpServer };
}

export default runApp;
