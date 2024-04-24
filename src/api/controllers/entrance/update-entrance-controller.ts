import { Request, Response } from "express";
import { InfosToken } from "../../interfaces/InfosToken";
import { EntranceRepository } from "../../repositories/EntranceRepository";
import { UpdateEntranceService } from "../../services/entrance/update-entrance-service";

class UpdateEntranceController {
  public async execute(req: Request, res: Response) {
    const { supplier, quantity_products, price_total, id_product } = req.body;
    const { id } = req.params;
    const infosToken = req.infosToken as InfosToken;

    const entranceRepository = new EntranceRepository();

    const updateEntranceService = new UpdateEntranceService(entranceRepository);

    const entrance = await updateEntranceService.execute(
      Number(id),
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

    return res.status(200).json({
      message: "Entrada atualizada",
      type: "OK",
      statusCode: 200,
      entrance: entrance.value,
    });
  }
}

export { UpdateEntranceController };
