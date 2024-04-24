import { Router } from "express";
import { AuthToken } from "../middlewares/AuthToken";
import { CreateDevolutionController } from "../controllers/devolution/create-devolution-controller";
import { UpdateDevolutionController } from "../controllers/devolution/update-devolution-controller";
import { DeleteDevolutionController } from "../controllers/devolution/delete-devolution-controller";
import { GetAllDevolutionsController } from "../controllers/devolution/get-all-devolutions-controller";
import { GetDevolutionByIdController } from "../controllers/devolution/get-devolution-by-id-controller";

class DevolutionRouter {
  public readonly router = Router();

  public routes() {
    this.router.get("/devolutions", new GetAllDevolutionsController().execute);
    this.router.get("/devolutions/:id", new GetDevolutionByIdController().execute);
    this.router.post(
      "/devolutions",
      new AuthToken().verifyToken,
      new CreateDevolutionController().execute
    );
    this.router.put(
      "/devolutions/:id",
      new AuthToken().verifyToken,
      new UpdateDevolutionController().execute
    );
    this.router.delete(
      "/devolutions/:id",
      new AuthToken().verifyToken,
      new DeleteDevolutionController().execute
    );

    return this.router;
  }
}

export default new DevolutionRouter().routes();
