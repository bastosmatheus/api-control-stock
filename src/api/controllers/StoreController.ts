import { Request, Response } from "express";
import { StoreService } from "../services/StoreService";

class StoreController {
  public async getAllStores(req: Request, res: Response) {
    const storeService = new StoreService();

    const stores = await storeService.getAll();

    return res.status(200).json({ type: "OK", statusCode: 200, stores });
  }

  public async getStoreById(req: Request, res: Response) {
    const { id } = req.params;
    const bearerToken = req.headers.authorization;

    const token = bearerToken.split(" ")[1];

    const storeService = new StoreService();

    const store = await storeService.getById(Number(id), token);

    if (store.isFailure()) {
      return res.status(store.value.statusCode).json({
        message: store.value.message,
        type: store.value.type,
        statusCode: store.value.statusCode,
      });
    }

    return res.status(200).json({ type: "OK", statusCode: 200, store: store.value });
  }

  public async createStore(req: Request, res: Response) {
    const { name_store, email, password } = req.body;

    const storeService = new StoreService();

    const store = await storeService.create(name_store, email, password);

    if (store.isFailure()) {
      return res.status(store.value.statusCode).json({
        message: store.value.message,
        type: store.value.type,
        statusCode: store.value.statusCode,
      });
    }

    return res.status(201).json({
      message: "Loja criada com sucesso",
      type: "Created",
      statusCode: 201,
      storeCreated: store.value,
    });
  }

  public async updateStore(req: Request, res: Response) {
    const { name_store, password } = req.body;
    const { id } = req.params;
    const bearerToken = req.headers.authorization;

    const token = bearerToken.split(" ")[1];

    const storeService = new StoreService();

    const store = await storeService.update(Number(id), name_store, password, token);

    if (store.isFailure()) {
      return res.status(store.value.statusCode).json({
        message: store.value.message,
        type: store.value.type,
        statusCode: store.value.statusCode,
      });
    }

    return res.status(200).json({
      message: "Loja atualizada com sucesso",
      type: "OK",
      statusCode: 200,
      storeUpdated: store.value,
    });
  }

  public async deleteStore(req: Request, res: Response) {
    const { id } = req.params;
    const bearerToken = req.headers.authorization;

    const token = bearerToken.split(" ")[1];

    const storeService = new StoreService();

    const store = await storeService.delete(Number(id), token);

    if (store.isFailure()) {
      return res.status(store.value.statusCode).json({
        message: store.value.message,
        type: store.value.type,
        statusCode: store.value.statusCode,
      });
    }

    return res.status(200).json({
      message: "Loja excluída com sucesso",
      type: "OK",
      statusCode: 200,
      storeDeleted: store.value,
    });
  }
}

export default new StoreController();
