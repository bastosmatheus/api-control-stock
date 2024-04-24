import { Request, Response } from "express";
import { EntranceRepository } from "../../repositories/EntranceRepository";
import { DeleteEntranceService } from "../../services/entrance/delete-entrance-service";
import { InfosToken } from "../../interfaces/InfosToken";

class DeleteEntranceController {
  public async execute(req: Request, res: Response) {
    const { id } = req.params;
    const infosToken = req.infosToken as InfosToken;

    const entranceRepository = new EntranceRepository();

    const deleteEntranceService = new DeleteEntranceService(entranceRepository);

    const entrance = await deleteEntranceService.execute(Number(id), infosToken);

    if (entrance.isFailure()) {
      return res.status(entrance.value.statusCode).json({
        message: entrance.value.message,
        type: entrance.value.type,
        statusCode: entrance.value.statusCode,
      });
    }

    return res.status(200).json({
      message: "Entrada deletada",
      type: "OK",
      statusCode: 200,
      entrance: entrance.value,
    });
  }
}

export { DeleteEntranceController };
