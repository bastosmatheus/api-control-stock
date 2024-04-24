import { Request, Response } from "express";
import { InfosToken } from "../../interfaces/InfosToken";
import { DevolutionRepository } from "../../repositories/DevolutionRepository";
import { CreateDevolutionService } from "../../services/devolution/create-devolution-service";

class CreateDevolutionController {
  public async execute(req: Request, res: Response) {
    const { description, quantity_products, id_entrance } = req.body;
    const infosToken = req.infosToken as InfosToken;

    const devolutionRepository = new DevolutionRepository();

    const createDevolutionService = new CreateDevolutionService(devolutionRepository);

    const devolution = await createDevolutionService.execute(
      description,
      quantity_products,
      id_entrance,
      infosToken
    );

    if (devolution.isFailure()) {
      return res.status(devolution.value.statusCode).json({
        message: devolution.value.message,
        type: devolution.value.type,
        statusCode: devolution.value.statusCode,
      });
    }

    return res.status(201).json({
      message: "Relatório de devolução criado",
      type: "Created",
      statusCode: 201,
      devolution: devolution.value,
    });
  }
}

export { CreateDevolutionController };
