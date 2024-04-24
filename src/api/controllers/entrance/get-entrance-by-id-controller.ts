import { Request, Response } from "express";
import { EntranceRepository } from "../../repositories/EntranceRepository";
import { GetEntranceByIdService } from "../../services/entrance/get-entrance-by-id-service";

class GetEntranceByIdController {
  public async execute(req: Request, res: Response) {
    const { id } = req.params;

    const entranceRepository = new EntranceRepository();

    const getEntranceByIdService = new GetEntranceByIdService(entranceRepository);

    const entrance = await getEntranceByIdService.execute(Number(id));

    if (entrance.isFailure()) {
      return res.status(entrance.value.statusCode).json({
        message: entrance.value.message,
        type: entrance.value.type,
        statusCode: entrance.value.statusCode,
      });
    }

    return res.status(200).json({
      type: "OK",
      statusCode: 200,
      entrance: entrance.value,
    });
  }
}

export { GetEntranceByIdController };
