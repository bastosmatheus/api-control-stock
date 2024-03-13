import { Router } from "express";
import DevolutionController from "../controllers/DevolutionController";

class DevolutionRouter {
  public readonly router = Router();

  public routes() {
    this.router.get("/devolutions", DevolutionController.getAllDevolutions);
    this.router.get("/devolutions/:id", DevolutionController.getDevolutionById);
    this.router.post("/devolutions", DevolutionController.createDevolution);
    this.router.get("/devolutions/:id", DevolutionController.updateDevolution);
    this.router.get("/devolutions/:id", DevolutionController.deleteDevolution);

    return this.router;
  }
}

export default new DevolutionRouter().routes();
