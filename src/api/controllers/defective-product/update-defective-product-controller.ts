import { Request, Response } from "express";
import { InfosToken } from "../../interfaces/InfosToken";
import { DefectiveProductRepository } from "../../repositories/DefectiveProductRepository";
import { UpdateDefectiveProductService } from "../../services/defective-product/update-defective-product-service";

class UpdateDefectiveProductController {
  public async execute(req: Request, res: Response) {
    const { description, quantity_products, id_entrance } = req.body;
    const { id } = req.params;
    const infosToken = req.infosToken as InfosToken;

    const defectiveproductRepository = new DefectiveProductRepository();

    const updateDefectiveProductService = new UpdateDefectiveProductService(
      defectiveproductRepository
    );

    const defectiveproduct = await updateDefectiveProductService.execute(
      Number(id),
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

    return res.status(200).json({
      message: "Relatório de produto com defeito atualizado",
      type: "OK",
      statusCode: 200,
      defectiveproduct: defectiveproduct.value,
    });
  }
}

export { UpdateDefectiveProductController };
