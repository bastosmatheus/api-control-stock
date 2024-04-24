import { Request, Response } from "express";
import { StoreRepository } from "../../repositories/StoreRepository";
import { LoginStoreService } from "../../services/store/login-store-service";

class LoginStoreController {
  public async execute(req: Request, res: Response) {
    const { email, password } = req.body;

    const storeRepository = new StoreRepository();

    const loginStoreService = new LoginStoreService(storeRepository);

    const store = await loginStoreService.execute(email, password);

    if (store.isFailure()) {
      return res.status(store.value.statusCode).json({
        type: store.value.type,
        statusCode: store.value.statusCode,
        message: store.value.message,
      });
    }

    return res.status(200).json({
      type: "OK",
      statusCode: 200,
      store: store.value,
    });
  }
}

export { LoginStoreController };
