import { Request, Response } from "express";
import { InfosToken } from "../../interfaces/InfosToken";
import { ExitRepository } from "../../repositories/ExitRepository";
import { UpdateExitService } from "../../services/exit/update-exit-service";

class UpdateExitController {
  public async execute(req: Request, res: Response) {
    const { description, quantity_products, price_total, id_product } = req.body;
    const { id } = req.params;
    const infosToken = req.infosToken as InfosToken;

    const exitRepository = new ExitRepository();

    const updateExitService = new UpdateExitService(exitRepository);

    const exit = await updateExitService.execute(
      Number(id),
      description,
      quantity_products,
      price_total,
      id_product,
      infosToken
    );

    if (exit.isFailure()) {
      return res.status(exit.value.statusCode).json({
        message: exit.value.message,
        type: exit.value.type,
        statusCode: exit.value.statusCode,
      });
    }

    return res.status(200).json({
      message: "Saída atualizada",
      type: "OK",
      statusCode: 200,
      exit: exit.value,
    });
  }
}

export { UpdateExitController };
