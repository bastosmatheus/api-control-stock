import { Router } from "express";
import DefectiveProductController from "../controllers/DefectiveProductController";

class DefectiveProductRouter {
  public readonly router = Router();

  public routes() {
    this.router.get("/defectiveproducts", DefectiveProductController.getAllDefectiveProducts);
    this.router.get("/defectiveproducts/:id", DefectiveProductController.getDefectiveProductById);
    this.router.post("/defectiveproducts", DefectiveProductController.createDefectiveProduct);
    this.router.put("/defectiveproducts/:id", DefectiveProductController.updateDefectiveProduct);
    this.router.delete("/defectiveproducts/:id", DefectiveProductController.deleteDefectiveProduct);

    return this.router;
  }
}

export default new DefectiveProductRouter().routes();
