import { Request, Response } from "express";
import { InfosToken } from "../../interfaces/InfosToken";
import { ExitRepository } from "../../repositories/ExitRepository";
import { CreateExitService } from "../../services/exit/create-exit-service";

class CreateExitController {
  public async execute(req: Request, res: Response) {
    const { description, quantity_products, price_total, id_product } = req.body;
    const infosToken = req.infosToken as InfosToken;

    const exitRepository = new ExitRepository();

    const createExitService = new CreateExitService(exitRepository);

    const exit = await createExitService.execute(
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

    return res.status(201).json({
      message: "Saída criada",
      type: "Created",
      statusCode: 201,
      exit: exit.value,
    });
  }
}

export { CreateExitController };
