import { Request, Response } from "express";
import { ExitRepository } from "../../repositories/ExitRepository";
import { DeleteExitService } from "../../services/exit/delete-exit-service";
import { InfosToken } from "../../interfaces/InfosToken";

class DeleteExitController {
  public async execute(req: Request, res: Response) {
    const { id } = req.params;
    const infosToken = req.infosToken as InfosToken;

    const exitRepository = new ExitRepository();

    const deleteExitService = new DeleteExitService(exitRepository);

    const exit = await deleteExitService.execute(Number(id), infosToken);

    if (exit.isFailure()) {
      return res.status(exit.value.statusCode).json({
        message: exit.value.message,
        type: exit.value.type,
        statusCode: exit.value.statusCode,
      });
    }

    return res.status(200).json({
      message: "Saída deletada",
      type: "OK",
      statusCode: 200,
      exit: exit.value,
    });
  }
}

export { DeleteExitController };
