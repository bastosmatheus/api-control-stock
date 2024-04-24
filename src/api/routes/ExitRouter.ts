import { Router } from "express";
import { AuthToken } from "../middlewares/AuthToken";
import { CreateExitController } from "../controllers/exit/create-exit-controller";
import { UpdateExitController } from "../controllers/exit/update-exit-controller";
import { DeleteExitController } from "../controllers/exit/delete-exit-controller";
import { GetAllExitsController } from "../controllers/exit/get-all-exits-controller";
import { GetExitByIdController } from "../controllers/exit/get-exit-by-id-controller";

class ExitRouter {
  public readonly router = Router();

  public routes() {
    this.router.get("/exits", new GetAllExitsController().execute);
    this.router.get("/exits/:id", new GetExitByIdController().execute);
    this.router.post("/exits", new AuthToken().verifyToken, new CreateExitController().execute);
    this.router.put("/exits/:id", new AuthToken().verifyToken, new UpdateExitController().execute);
    this.router.delete(
      "/exits/:id",
      new AuthToken().verifyToken,
      new DeleteExitController().execute
    );

    return this.router;
  }
}

export default new ExitRouter().routes();
