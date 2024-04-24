import { Router } from "express";
import { AuthToken } from "../middlewares/AuthToken";
import { GetAllDefectiveProductsController } from "../controllers/defective-product/get-all-defective-products-controller";
import { GetDefectiveProductByIdController } from "../controllers/defective-product/get-defective-product-by-id-controller";
import { CreateDefectiveProductController } from "../controllers/defective-product/create-defective-product-controller";
import { UpdateDefectiveProductController } from "../controllers/defective-product/update-defective-product-controller";
import { DeleteDefectiveProductController } from "../controllers/defective-product/delete-defective-product-controller";

class DefectiveProductRouter {
  public readonly router = Router();

  public routes() {
    this.router.get("/defectiveproducts", new GetAllDefectiveProductsController().execute);
    this.router.get("/defectiveproducts/:id", new GetDefectiveProductByIdController().execute);
    this.router.post(
      "/defectiveproducts",
      new AuthToken().verifyToken,
      new CreateDefectiveProductController().execute
    );
    this.router.put(
      "/defectiveproducts/:id",
      new AuthToken().verifyToken,
      new UpdateDefectiveProductController().execute
    );
    this.router.delete(
      "/defectiveproducts/:id",
      new AuthToken().verifyToken,
      new DeleteDefectiveProductController().execute
    );

    return this.router;
  }
}

export default new DefectiveProductRouter().routes();
