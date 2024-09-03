import { Router } from "express";
import { AuthToken } from "../middlewares/AuthToken";
import { DeleteStoreController } from "../controllers/store/delete-store-controller";
import { CreateStoreController } from "../controllers/store/create-store-controller";
import { LoginStoreController } from "../controllers/store/login-store-controller";
import { GetAllStoresController } from "../controllers/store/get-all-stores-controller";
import { UpdateStoreController } from "../controllers/store/update-store-controller";
import { GetStoreByIdController } from "../controllers/store/get-store-by-id-controller";

class StoreRouter {
  public readonly router = Router();

  public routes() {
    this.router.get("/stores", new GetAllStoresController().execute);
    this.router.get("/stores/:id", new GetStoreByIdController().execute);
    this.router.post("/stores", new CreateStoreController().execute);
    this.router.post("/stores/login", new LoginStoreController().execute);
    this.router.put(
      "/stores/:id",
      new AuthToken().verifyToken,
      new UpdateStoreController().execute
    );
    this.router.delete(
      "/stores/:id",
      new AuthToken().verifyToken,
      new DeleteStoreController().execute
    );

    return this.router;
  }
}

export default new StoreRouter().routes();
