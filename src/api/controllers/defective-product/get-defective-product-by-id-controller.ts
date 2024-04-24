import { Request, Response } from "express";
import { DefectiveProductRepository } from "../../repositories/DefectiveProductRepository";
import { GetDefectiveProductByIdService } from "../../services/defective-product/get-defective-product-by-id-service";

class GetDefectiveProductByIdController {
  public async execute(req: Request, res: Response) {
    const { id } = req.params;

    const defectiveproductRepository = new DefectiveProductRepository();

    const getDefectiveProductByIdService = new GetDefectiveProductByIdService(
      defectiveproductRepository
    );

    const defectiveproduct = await getDefectiveProductByIdService.execute(Number(id));

    if (defectiveproduct.isFailure()) {
      return res.status(defectiveproduct.value.statusCode).json({
        message: defectiveproduct.value.message,
        type: defectiveproduct.value.type,
        statusCode: defectiveproduct.value.statusCode,
      });
    }

    return res.status(200).json({
      type: "OK",
      statusCode: 200,
      defectiveproduct: defectiveproduct.value,
    });
  }
}

export { GetDefectiveProductByIdController };
