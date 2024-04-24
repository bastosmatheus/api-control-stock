import { Request, Response } from "express";
import { ExitRepository } from "../../repositories/ExitRepository";
import { GetAllExitsService } from "../../services/exit/get-all-exits-service";

class GetAllExitsController {
  public async execute(req: Request, res: Response) {
    const exitRepository = new ExitRepository();

    const getAllExitsService = new GetAllExitsService(exitRepository);

    const exits = await getAllExitsService.execute();

    return res.status(200).json({
      type: "OK",
      statusCode: 200,
      exits,
    });
  }
}

export { GetAllExitsController };
