import { Router } from "express";
import * as controller from "../controllers/motd.controllers.js";

const indexRouter: Router = Router();

indexRouter.get("/", controller.readLatest);
indexRouter.post("/", controller.create);
indexRouter.get("/:id", controller.read);
indexRouter.patch("/:id", controller.update);
indexRouter.delete("/:id", controller.remove);

export default indexRouter;
