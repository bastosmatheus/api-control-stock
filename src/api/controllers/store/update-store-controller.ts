import { Request, Response } from "express";
import { InfosToken } from "../../interfaces/InfosToken";
import { StoreRepository } from "../../repositories/StoreRepository";
import { UpdateStoreService } from "../../services/store/update-store-service";

class UpdateStoreController {
  public async execute(req: Request, res: Response) {
    const { name_store } = req.body;
    const { id } = req.params;
    const infosToken = req.infosToken as InfosToken;

    const storeRepository = new StoreRepository();

    const updateStoreService = new UpdateStoreService(storeRepository);

    const store = await updateStoreService.execute(Number(id), name_store, infosToken);

    if (store.isFailure()) {
      return res.status(store.value.statusCode).json({
        message: store.value.message,
        type: store.value.type,
        statusCode: store.value.statusCode,
      });
    }

    return res.status(200).json({
      message: "Loja atualizada",
      type: "OK",
      statusCode: 200,
      store: store.value,
    });
  }
}

export { UpdateStoreController };
