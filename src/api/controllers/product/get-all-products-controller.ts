import { Request, Response } from "express";
import { ProductRepository } from "../../repositories/ProductRepository";
import { GetAllProductsService } from "../../services/product/get-all-products-service";

class GetAllProductsController {
  public async execute(req: Request, res: Response) {
    const productRepository = new ProductRepository();

    const getAllProductsService = new GetAllProductsService(productRepository);

    const products = await getAllProductsService.execute();

    return res.status(200).json({
      type: "OK",
      statusCode: 200,
      products,
    });
  }
}

export { GetAllProductsController };
