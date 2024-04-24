import { Request, Response } from "express";
import { StoreRepository } from "../../repositories/StoreRepository";
import { GetStoreByIdService } from "../../services/store/get-store-by-id-service";

class GetStoreByIdController {
  public async execute(req: Request, res: Response) {
    const { id } = req.params;

    const storeRepository = new StoreRepository();

    const getStoreByIdService = new GetStoreByIdService(storeRepository);

    const store = await getStoreByIdService.execute(Number(id));

    if (store.isFailure()) {
      return res.status(store.value.statusCode).json({
        message: store.value.message,
        type: store.value.type,
        statusCode: store.value.statusCode,
      });
    }

    return res.status(200).json({ type: "OK", statusCode: 200, store: store.value });
  }
}

export { GetStoreByIdController };
