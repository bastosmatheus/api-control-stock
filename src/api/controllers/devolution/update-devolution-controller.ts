import { Request, Response } from "express";
import { InfosToken } from "../../interfaces/InfosToken";
import { DevolutionRepository } from "../../repositories/DevolutionRepository";
import { UpdateDevolutionService } from "../../services/devolution/update-devolution-service";

class UpdateDevolutionController {
  public async execute(req: Request, res: Response) {
    const { description, quantity_products, id_entrance } = req.body;
    const { id } = req.params;
    const infosToken = req.infosToken as InfosToken;

    const devolutionRepository = new DevolutionRepository();

    const updateDevolutionService = new UpdateDevolutionService(devolutionRepository);

    const devolution = await updateDevolutionService.execute(
      Number(id),
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

    return res.status(200).json({
      message: "Relatório de devolução atualizado",
      type: "OK",
      statusCode: 200,
      devolution: devolution.value,
    });
  }
}

export { UpdateDevolutionController };
