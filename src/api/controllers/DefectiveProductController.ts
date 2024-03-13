import { Request, Response } from "express";
import { DefectiveProductService } from "../services/DefectiveProductService";

class defectiveProductController {
  public async getAllDefectiveProducts(req: Request, res: Response) {
    const defectiveProductService = new DefectiveProductService();

    const defectiveProducts = await defectiveProductService.getAll();

    return res.status(200).json({
      type: "OK",
      statusCode: 200,
      defectiveProducts,
    });
  }

  public async getDefectiveProductById(req: Request, res: Response) {
    const { id } = req.params;

    const defectiveProductService = new DefectiveProductService();

    const defectiveProduct = await defectiveProductService.getById(Number(id));

    if (defectiveProduct.isFailure()) {
      return res.status(defectiveProduct.value.statusCode).json(defectiveProduct.value);
    }

    return res
      .status(200)
      .json({ type: "OK", statusCode: 200, defectiveProduct: defectiveProduct.value });
  }

  public async createDefectiveProduct(req: Request, res: Response) {
    const { description, quantity_products, id_entrance } = req.body;

    const defectiveProductService = new DefectiveProductService();

    const defectiveProduct = await defectiveProductService.create(
      description,
      quantity_products,
      id_entrance
    );

    if (defectiveProduct.isFailure()) {
      return res.status(defectiveProduct.value.statusCode).json(defectiveProduct.value);
    }

    return res.status(200).json({
      message: "Produto com defeito criado com sucesso",
      type: "OK",
      statusCode: 200,
      defectiveProductCreated: defectiveProduct.value,
    });
  }

  public async updateDefectiveProduct(req: Request, res: Response) {
    const { id } = req.params;

    const { description, quantity_products, id_entrance } = req.body;

    const defectiveProductService = new DefectiveProductService();

    const defectiveProduct = await defectiveProductService.update(
      Number(id),
      description,
      quantity_products,
      id_entrance
    );

    if (defectiveProduct.isFailure()) {
      return res.status(defectiveProduct.value.statusCode).json(defectiveProduct.value);
    }

    return res.status(200).json({
      message: "Produto com defeito atualizado com sucesso",
      type: "OK",
      statusCode: 200,
      defectiveProductUpdated: defectiveProduct.value,
    });
  }

  public async deleteDefectiveProduct(req: Request, res: Response) {
    const { id } = req.params;

    const defectiveProductService = new DefectiveProductService();

    const defectiveProduct = await defectiveProductService.delete(Number(id));

    if (defectiveProduct.isFailure()) {
      return res.status(defectiveProduct.value.statusCode).json(defectiveProduct.value);
    }

    return res.status(200).json({
      message: "Produto com defeito excluido com sucesso",
      type: "OK",
      statusCode: 200,
      defectiveProductDeleted: defectiveProduct.value,
    });
  }
}

export default new defectiveProductController();
