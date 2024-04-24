import { Request, Response } from "express";
import { StoreRepository } from "../../repositories/StoreRepository";
import { GetAllStoresService } from "../../services/store/get-all-stores-service";

class GetAllStoresController {
  public async execute(req: Request, res: Response) {
    const storeRepository = new StoreRepository();

    const getAllStoresService = new GetAllStoresService(storeRepository);

    const stores = await getAllStoresService.execute();

    return res.status(200).json({
      type: "OK",
      statusCode: 200,
      stores,
    });
  }
}

export { GetAllStoresController };
