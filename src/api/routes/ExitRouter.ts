import { Router } from "express";
import ExitController from "../controllers/ExitController";

class ExitRouter {
  public readonly router = Router();

  public routes() {
    this.router.get("/exits", ExitController.getAllExits);
    this.router.get("/exits/:id", ExitController.getExitById);
    this.router.post("/exits", ExitController.createExit);
    this.router.put("/exits/:id", ExitController.updateExit);
    this.router.delete("/exits/:id", ExitController.deleteExit);

    return this.router;
  }
}

export default new ExitRouter().routes();
