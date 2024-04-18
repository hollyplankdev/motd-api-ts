import { Router } from "express";
import controller from "../controllers/index.controllers.js";

const indexRouter: Router = Router();

indexRouter.get("/", controller.read);

export default indexRouter;
