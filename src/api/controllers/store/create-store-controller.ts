import { Request, Response } from "express";
import { StoreRepository } from "../../repositories/StoreRepository";
import { CreateStoreService } from "../../services/store/create-store-service";

class CreateStoreController {
  public async execute(req: Request, res: Response) {
    const { name_store, email, password } = req.body;

    const storeRepository = new StoreRepository();

    const createStoreService = new CreateStoreService(storeRepository);

    const store = await createStoreService.execute(name_store, email, password);

    if (store.isFailure()) {
      return res.status(store.value.statusCode).json({
        message: store.value.message,
        type: store.value.type,
        statusCode: store.value.statusCode,
      });
    }

    return res.status(201).json({
      message: "Loja criada",
      type: "Created",
      statusCode: 201,
      store: store.value,
    });
  }
}

export { CreateStoreController };
