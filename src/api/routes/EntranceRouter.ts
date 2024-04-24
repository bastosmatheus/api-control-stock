import { Router } from "express";
import { AuthToken } from "../middlewares/AuthToken";
import { CreateEntranceController } from "../controllers/entrance/create-entrance-controller";
import { UpdateEntranceController } from "../controllers/entrance/update-entrance-controller";
import { DeleteEntranceController } from "../controllers/entrance/delete-entrance-controller";
import { GetAllEntrancesController } from "../controllers/entrance/get-all-entrances-controller";
import { GetEntranceByIdController } from "../controllers/entrance/get-entrance-by-id-controller";

class EntranceRouter {
  public readonly router = Router();

  public routes() {
    this.router.get("/entrances", new GetAllEntrancesController().execute);
    this.router.get("/entrances/:id", new GetEntranceByIdController().execute);
    this.router.post(
      "/entrances",
      new AuthToken().verifyToken,
      new CreateEntranceController().execute
    );
    this.router.put(
      "/entrances/:id",
      new AuthToken().verifyToken,
      new UpdateEntranceController().execute
    );
    this.router.delete(
      "/entrances/:id",
      new AuthToken().verifyToken,
      new DeleteEntranceController().execute
    );

    return this.router;
  }
}

export default new EntranceRouter().routes();
