import { Request, Response } from "express";
import { DevolutionRepository } from "../../repositories/DevolutionRepository";
import { DeleteDevolutionService } from "../../services/devolution/delete-devolution-service";
import { InfosToken } from "../../interfaces/InfosToken";

class DeleteDevolutionController {
  public async execute(req: Request, res: Response) {
    const { id } = req.params;
    const infosToken = req.infosToken as InfosToken;

    const devolutionRepository = new DevolutionRepository();

    const deleteDevolutionService = new DeleteDevolutionService(devolutionRepository);

    const devolution = await deleteDevolutionService.execute(Number(id), infosToken);

    if (devolution.isFailure()) {
      return res.status(devolution.value.statusCode).json({
        message: devolution.value.message,
        type: devolution.value.type,
        statusCode: devolution.value.statusCode,
      });
    }

    return res.status(200).json({
      message: "Relatório de devolução deletado",
      type: "OK",
      statusCode: 200,
      devolution: devolution.value,
    });
  }
}

export { DeleteDevolutionController };
