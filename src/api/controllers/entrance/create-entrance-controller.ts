import { Request, Response } from "express";
import { InfosToken } from "../../interfaces/InfosToken";
import { EntranceRepository } from "../../repositories/EntranceRepository";
import { CreateEntranceService } from "../../services/entrance/create-entrance-service";

class CreateEntranceController {
  public async execute(req: Request, res: Response) {
    const { supplier, quantity_products, price_total, id_product } = req.body;
    const infosToken = req.infosToken as InfosToken;

    const entranceRepository = new EntranceRepository();

    const createEntranceService = new CreateEntranceService(entranceRepository);

    const entrance = await createEntranceService.execute(
      supplier,
      quantity_products,
      price_total,
      id_product,
      infosToken
    );

    if (entrance.isFailure()) {
      return res.status(entrance.value.statusCode).json({
        message: entrance.value.message,
        type: entrance.value.type,
        statusCode: entrance.value.statusCode,
      });
    }

    return res.status(201).json({
      message: "Entrada criada",
      type: "Created",
      statusCode: 201,
      entrance: entrance.value,
    });
  }
}

export { CreateEntranceController };
