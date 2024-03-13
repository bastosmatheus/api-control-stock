import { Router } from "express";
import ExitController from "../controllers/ExitController";

class ExitRouter {
  public readonly router = Router();

  public routes() {
    this.router.get("/entrances", ExitController.getAllExits);
    this.router.get("/entrances/:id", ExitController.getExitById);
    this.router.post("/entrances", ExitController.createExit);
    this.router.get("/entrances/:id", ExitController.updateExit);
    this.router.get("/entrances/:id", ExitController.deleteExit);

    return this.router;
  }
}

export default new ExitRouter().routes();
