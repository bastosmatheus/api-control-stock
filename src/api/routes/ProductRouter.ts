import { Router } from "express";
import ProductController from "../controllers/ProductController";

class ProductRouter {
  public readonly router = Router();

  public routes() {
    this.router.get("/products", ProductController.getAllProducts);
    this.router.get("/products/:id", ProductController.getProductById);
    this.router.post("/products", ProductController.createProduct);
    this.router.put("/products/:id", ProductController.updateProduct);
    this.router.delete("/products/:id", ProductController.deleteProduct);

    return this.router;
  }
}

export default new ProductRouter().routes();
