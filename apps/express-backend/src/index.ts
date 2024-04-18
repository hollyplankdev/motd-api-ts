import runApp from "./app";
import { API_SPEC_PATH } from "./config/apiValidator.config.js";
import { HTTP_PORT } from "./config/http.config.js";

// Actually run the application
runApp({
  httpPort: HTTP_PORT,
  apiSpecPath: API_SPEC_PATH,
});
