import { Router } from "express";
import { AuthToken } from "../middlewares/AuthToken";
import { CreateProductController } from "../controllers/product/create-product-controller";
import { UpdateProductController } from "../controllers/product/update-product-controller";
import { DeleteProductController } from "../controllers/product/delete-product-controller";
import { GetAllProductsController } from "../controllers/product/get-all-products-controller";
import { GetProductByIdController } from "../controllers/product/get-product-by-id-controller";

class ProductRouter {
  public readonly router = Router();

  public routes() {
    this.router.get("/products", new GetAllProductsController().execute);
    this.router.get("/products/:id", new GetProductByIdController().execute);
    this.router.post(
      "/products",
      new AuthToken().verifyToken,
      new CreateProductController().execute
    );
    this.router.put(
      "/products/:id",
      new AuthToken().verifyToken,
      new UpdateProductController().execute
    );
    this.router.delete(
      "/products/:id",
      new AuthToken().verifyToken,
      new DeleteProductController().execute
    );

    return this.router;
  }
}

export default new ProductRouter().routes();
