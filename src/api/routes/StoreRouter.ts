import { Router } from "express";
import StoreController from "../controllers/StoreController";

class StoreRouter {
  public readonly router = Router();

  public routes() {
    this.router.get("/stores", StoreController.getAllStores);
    this.router.get("/stores/:id", StoreController.getStoreById);
    this.router.post("/stores", StoreController.createStore);
    this.router.put("/stores/:id", StoreController.updateStore);
    this.router.delete("/stores/:id", StoreController.deleteStore);

    return this.router;
  }
}

export default new StoreRouter().routes();
