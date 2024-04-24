import { Request, Response } from "express";
import { DefectiveProductRepository } from "../../repositories/DefectiveProductRepository";
import { DeleteDefectiveProductService } from "../../services/defective-product/delete-defective-product-service";
import { InfosToken } from "../../interfaces/InfosToken";

class DeleteDefectiveProductController {
  public async execute(req: Request, res: Response) {
    const { id } = req.params;
    const infosToken = req.infosToken as InfosToken;

    const defectiveproductRepository = new DefectiveProductRepository();

    const deleteDefectiveProductService = new DeleteDefectiveProductService(
      defectiveproductRepository
    );

    const defectiveproduct = await deleteDefectiveProductService.execute(Number(id), infosToken);

    if (defectiveproduct.isFailure()) {
      return res.status(defectiveproduct.value.statusCode).json({
        message: defectiveproduct.value.message,
        type: defectiveproduct.value.type,
        statusCode: defectiveproduct.value.statusCode,
      });
    }

    return res.status(200).json({
      message: "Relatório de produto com defeito deletado",
      type: "OK",
      statusCode: 200,
      defectiveproduct: defectiveproduct.value,
    });
  }
}

export { DeleteDefectiveProductController };
