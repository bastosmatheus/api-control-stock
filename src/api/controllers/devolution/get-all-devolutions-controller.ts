import { Request, Response } from "express";
import { DevolutionRepository } from "../../repositories/DevolutionRepository";
import { GetAllDevolutionsService } from "../../services/devolution/get-all-devolutions-service";

class GetAllDevolutionsController {
  public async execute(req: Request, res: Response) {
    const devolutionRepository = new DevolutionRepository();

    const getAllDevolutionsService = new GetAllDevolutionsService(devolutionRepository);

    const devolutions = await getAllDevolutionsService.execute();

    return res.status(200).json({
      type: "OK",
      statusCode: 200,
      devolutions,
    });
  }
}

export { GetAllDevolutionsController };
