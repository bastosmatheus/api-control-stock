import { Router } from "express";
import DefectiveProductController from "../controllers/DefectiveProductController";

class DefectiveProductRouter {
  public readonly router = Router();

  public routes() {
    this.router.get("/devolutions", DefectiveProductController.getAllDefectiveProducts);
    this.router.get("/devolutions/:id", DefectiveProductController.getDefectiveProductById);
    this.router.post("/devolutions", DefectiveProductController.createDefectiveProduct);
    this.router.get("/devolutions/:id", DefectiveProductController.updateDefectiveProduct);
    this.router.get("/devolutions/:id", DefectiveProductController.deleteDefectiveProduct);

    return this.router;
  }
}

export default new DefectiveProductRouter().routes();
