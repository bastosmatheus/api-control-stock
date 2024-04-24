import { Request, Response } from "express";
import { InfosToken } from "../../interfaces/InfosToken";
import { DefectiveProductRepository } from "../../repositories/DefectiveProductRepository";
import { CreateDefectiveProductService } from "../../services/defective-product/create-defective-product-service";

class CreateDefectiveProductController {
  public async execute(req: Request, res: Response) {
    const { description, quantity_products, id_entrance } = req.body;
    const infosToken = req.infosToken as InfosToken;

    const defectiveproductRepository = new DefectiveProductRepository();

    const createDefectiveProductService = new CreateDefectiveProductService(
      defectiveproductRepository
    );

    const defectiveproduct = await createDefectiveProductService.execute(
      description,
      quantity_products,
      id_entrance,
      infosToken
    );

    if (defectiveproduct.isFailure()) {
      return res.status(defectiveproduct.value.statusCode).json({
        message: defectiveproduct.value.message,
        type: defectiveproduct.value.type,
        statusCode: defectiveproduct.value.statusCode,
      });
    }

    return res.status(201).json({
      message: "Relatório de produto defeituoso criado",
      type: "Created",
      statusCode: 201,
      defectiveproduct: defectiveproduct.value,
    });
  }
}

export { CreateDefectiveProductController };
