import { Router } from "express";
import EntranceController from "../controllers/EntranceController";

class EntranceRouter {
  public readonly router = Router();

  public routes() {
    this.router.get("/entrances", EntranceController.getAllEntrances);
    this.router.get("/entrances/:id", EntranceController.getEntranceById);
    this.router.post("/entrances", EntranceController.createEntrance);
    this.router.get("/entrances/:id", EntranceController.updateEntrance);
    this.router.get("/entrances/:id", EntranceController.deleteEntrance);

    return this.router;
  }
}

export default new EntranceRouter().routes();
