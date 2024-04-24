import { Request, Response } from "express";
import { EntranceRepository } from "../../repositories/EntranceRepository";
import { GetAllEntrancesService } from "../../services/entrance/get-all-entrances-service";

class GetAllEntrancesController {
  public async execute(req: Request, res: Response) {
    const entranceRepository = new EntranceRepository();

    const getAllEntrancesService = new GetAllEntrancesService(entranceRepository);

    const entrances = await getAllEntrancesService.execute();

    return res.status(200).json({
      type: "OK",
      statusCode: 200,
      entrances,
    });
  }
}

export { GetAllEntrancesController };
