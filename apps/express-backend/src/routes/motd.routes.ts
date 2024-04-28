import { Router } from "express";
import * as controller from "../controllers/motd.controllers.js";
import checkJwt, { JwtMiddlewareConfig } from "../middleware/jwt.middleware.js";

export default function create(args: JwtMiddlewareConfig): Router {
  const router = Router();

  router.get("/", controller.readLatest);
  router.post("/", [checkJwt(args), controller.create]);
  router.get("/history", controller.list);
  router.get("/:id", controller.read);
  router.patch("/:id", checkJwt(args), controller.update);
  router.delete("/:id", checkJwt(args), controller.remove);

  return router;
}
