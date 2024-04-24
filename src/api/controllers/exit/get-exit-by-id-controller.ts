import { Request, Response } from "express";
import { ExitRepository } from "../../repositories/ExitRepository";
import { GetExitByIdService } from "../../services/exit/get-exit-by-id-service";

class GetExitByIdController {
  public async execute(req: Request, res: Response) {
    const { id } = req.params;

    const exitRepository = new ExitRepository();

    const getExitByIdService = new GetExitByIdService(exitRepository);

    const exit = await getExitByIdService.execute(Number(id));

    if (exit.isFailure()) {
      return res.status(exit.value.statusCode).json({
        message: exit.value.message,
        type: exit.value.type,
        statusCode: exit.value.statusCode,
      });
    }

    return res.status(200).json({
      type: "OK",
      statusCode: 200,
      exit: exit.value,
    });
  }
}

export { GetExitByIdController };
