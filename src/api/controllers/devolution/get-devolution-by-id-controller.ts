import { Request, Response } from "express";
import { DevolutionRepository } from "../../repositories/DevolutionRepository";
import { GetDevolutionByIdService } from "../../services/devolution/get-devolution-by-id-service";

class GetDevolutionByIdController {
  public async execute(req: Request, res: Response) {
    const { id } = req.params;

    const devolutionRepository = new DevolutionRepository();

    const getDevolutionByIdService = new GetDevolutionByIdService(devolutionRepository);

    const devolution = await getDevolutionByIdService.execute(Number(id));

    if (devolution.isFailure()) {
      return res.status(devolution.value.statusCode).json({
        message: devolution.value.message,
        type: devolution.value.type,
        statusCode: devolution.value.statusCode,
      });
    }

    return res.status(200).json({
      type: "OK",
      statusCode: 200,
      devolution: devolution.value,
    });
  }
}

export { GetDevolutionByIdController };
