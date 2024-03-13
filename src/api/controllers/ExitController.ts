import { Request, Response } from "express";
import { ExitService } from "../services/ExitService";

class ExitController {
  public async getAllExits(req: Request, res: Response) {
    const exitService = new ExitService();

    const exits = await exitService.getAll();

    return res.status(200).json({
      type: "OK",
      statusCode: 200,
      exits,
    });
  }

  public async getExitById(req: Request, res: Response) {
    const { id } = req.params;

    const exitService = new ExitService();

    const exit = await exitService.getById(Number(id));

    if (exit.isFailure()) {
      return res.status(exit.value.statusCode).json(exit.value);
    }

    return res.status(200).json({ type: "OK", statusCode: 200, exit: exit.value });
  }

  public async createExit(req: Request, res: Response) {
    const { description, quantity_products, id_product } = req.body;

    const exitService = new ExitService();

    const exit = await exitService.create(description, quantity_products, id_product);

    if (exit.isFailure()) {
      return res.status(exit.value.statusCode).json(exit.value);
    }

    return res.status(200).json({
      message: "Saída criada com sucesso",
      type: "OK",
      statusCode: 200,
      exitCreated: exit.value,
    });
  }

  public async updateExit(req: Request, res: Response) {
    const { id } = req.params;

    const { description, quantity_products, id_product } = req.body;

    const exitService = new ExitService();

    const exit = await exitService.update(Number(id), description, quantity_products, id_product);

    if (exit.isFailure()) {
      return res.status(exit.value.statusCode).json(exit.value);
    }

    return res.status(200).json({
      message: "Saída atualizada com sucesso",
      type: "OK",
      statusCode: 200,
      exitUpdated: exit.value,
    });
  }

  public async deleteExit(req: Request, res: Response) {
    const { id } = req.params;

    const exitService = new ExitService();

    const exit = await exitService.delete(Number(id));

    if (exit.isFailure()) {
      return res.status(exit.value.statusCode).json(exit.value);
    }

    return res.status(200).json({
      message: "Saída excluida com sucesso",
      type: "OK",
      statusCode: 200,
      exitDeleted: exit.value,
    });
  }
}

export default new ExitController();
