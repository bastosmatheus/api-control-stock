import { Request, Response } from "express";
import { DefectiveProductRepository } from "../../repositories/DefectiveProductRepository";
import { GetAllDefectiveProductsService } from "../../services/defective-product/get-all-defective-products-service";

class GetAllDefectiveProductsController {
  public async execute(req: Request, res: Response) {
    const defectiveproductRepository = new DefectiveProductRepository();

    const getAllDefectiveProductsService = new GetAllDefectiveProductsService(
      defectiveproductRepository
    );

    const defectiveproducts = await getAllDefectiveProductsService.execute();

    return res.status(200).json({
      type: "OK",
      statusCode: 200,
      defectiveproducts,
    });
  }
}

export { GetAllDefectiveProductsController };
