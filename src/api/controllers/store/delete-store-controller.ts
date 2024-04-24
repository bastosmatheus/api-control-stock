import { Request, Response } from "express";
import { InfosToken } from "../../interfaces/InfosToken";
import { StoreRepository } from "../../repositories/StoreRepository";
import { DeleteStoreService } from "../../services/store/delete-store-service";

class DeleteStoreController {
  public async execute(req: Request, res: Response) {
    const { id } = req.params;
    const infosToken = req.infosToken as InfosToken;

    const storeRepository = new StoreRepository();

    const deleteStoreService = new DeleteStoreService(storeRepository);

    const store = await deleteStoreService.execute(Number(id), infosToken);

    if (store.isFailure()) {
      return res.status(store.value.statusCode).json({
        type: store.value.type,
        statusCode: store.value.statusCode,
        message: store.value.message,
      });
    }

    return res.status(200).json({
      message: "Loja deletada",
      type: "OK",
      statusCode: 200,
      store: store.value,
    });
  }
}

export { DeleteStoreController };
