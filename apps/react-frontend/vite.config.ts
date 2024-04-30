/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    proxy: {
      /**
       * Setup the frontend dev server so that it re-routes backend requests to our backend dev
       * server.
       */
      "/motd": {
        target: "http://localhost:30330",
        rewrite: (path) => path.replace(/^\/motd/, ""),
      },
    },
  },
});
