import { Request, Response } from "express";
import { DevolutionService } from "../services/DevolutionService";

class DevolutionController {
  public async getAllDevolutions(req: Request, res: Response) {
    const devolutionService = new DevolutionService();

    const devolutions = await devolutionService.getAll();

    return res.status(200).json({
      type: "OK",
      statusCode: 200,
      devolutions,
    });
  }

  public async getDevolutionById(req: Request, res: Response) {
    const { id } = req.params;

    const devolutionService = new DevolutionService();

    const devolution = await devolutionService.getById(Number(id));

    if (devolution.isFailure()) {
      return res.status(devolution.value.statusCode).json(devolution.value);
    }

    return res.status(200).json({ type: "OK", statusCode: 200, devolution: devolution.value });
  }

  public async createDevolution(req: Request, res: Response) {
    const { description, quantity_products, id_entrance } = req.body;

    const devolutionService = new DevolutionService();

    const devolution = await devolutionService.create(description, quantity_products, id_entrance);

    if (devolution.isFailure()) {
      return res.status(devolution.value.statusCode).json(devolution.value);
    }

    return res.status(200).json({
      message: "Devolução criada com sucesso",
      type: "OK",
      statusCode: 200,
      devolutionCreated: devolution.value,
    });
  }

  public async updateDevolution(req: Request, res: Response) {
    const { id } = req.params;

    const { description, quantity_products, id_entrance } = req.body;

    const devolutionService = new DevolutionService();

    const devolution = await devolutionService.update(
      Number(id),
      description,
      quantity_products,
      id_entrance
    );

    if (devolution.isFailure()) {
      return res.status(devolution.value.statusCode).json(devolution.value);
    }

    return res.status(200).json({
      message: "Devolução atualizada com sucesso",
      type: "OK",
      statusCode: 200,
      devolutionUpdated: devolution.value,
    });
  }

  public async deleteDevolution(req: Request, res: Response) {
    const { id } = req.params;

    const devolutionService = new DevolutionService();

    const devolution = await devolutionService.delete(Number(id));

    if (devolution.isFailure()) {
      return res.status(devolution.value.statusCode).json(devolution.value);
    }

    return res.status(200).json({
      message: "Devolução excluida com sucesso",
      type: "OK",
      statusCode: 200,
      devolutionDeleted: devolution.value,
    });
  }
}

export default new DevolutionController();
