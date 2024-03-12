import { Request, Response } from "express";
import { EntranceService } from "../services/EntranceService";

class EntranceController {
  public async getAllEntrances(req: Request, res: Response) {
    const entranceService = new EntranceService();

    const entrances = await entranceService.getAll();

    return res.status(200).json({ type: "OK", statusCode: 200, entrances });
  }

  public async getEntranceById(req: Request, res: Response) {
    const { id } = req.params;

    const entranceService = new EntranceService();

    const entrance = await entranceService.getById(Number(id));

    if (entrance.isFailure()) {
      return res.status(entrance.value.statusCode).json(entrance.value);
    }

    return res.status(200).json({ type: "OK", statusCode: 200, entrance: entrance.value });
  }

  public async createEntrance(req: Request, res: Response) {
    const { supplier, quantity_products, price_total, id_product } = req.body;

    const entranceService = new EntranceService();

    const entrance = await entranceService.create(
      supplier,
      quantity_products,
      price_total,
      id_product
    );

    if (entrance.isFailure()) {
      return res.status(entrance.value.statusCode).json(entrance.value);
    }

    return res.status(200).json({
      message: "Entrada criada com sucesso",
      type: "OK",
      statusCode: 200,
      entranceCreated: entrance.value,
    });
  }

  public async updateEntrance(req: Request, res: Response) {
    const { id } = req.params;

    const { supplier, quantity_products, price_total, id_product } = req.body;

    const entranceService = new EntranceService();

    const entrance = await entranceService.update(
      Number(id),
      supplier,
      quantity_products,
      price_total,
      id_product
    );

    if (entrance.isFailure()) {
      return res.status(entrance.value.statusCode).json(entrance.value);
    }

    return res.status(200).json({
      message: "Entrada atualizada com sucesso",
      type: "OK",
      statusCode: 200,
      entranceUpdated: entrance.value,
    });
  }

  public async deleteEntrance(req: Request, res: Response) {
    const { id } = req.params;

    const entranceService = new EntranceService();

    const entrance = await entranceService.delete(Number(id));

    if (entrance.isFailure()) {
      return res.status(entrance.value.statusCode).json(entrance.value);
    }

    return res.status(200).json({
      message: "Entrada excluida com sucesso",
      type: "OK",
      statusCode: 200,
      entranceDeleted: entrance.value,
    });
  }
}

export default new EntranceController();
