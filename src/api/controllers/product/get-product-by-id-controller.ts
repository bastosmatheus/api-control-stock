import { Request, Response } from "express";
import { ProductRepository } from "../../repositories/ProductRepository";
import { GetProductByIdService } from "../../services/product/get-product-by-id-service";

class GetProductByIdController {
  public async execute(req: Request, res: Response) {
    const { id } = req.params;

    const productRepository = new ProductRepository();

    const getProductByIdService = new GetProductByIdService(productRepository);

    const product = await getProductByIdService.execute(Number(id));

    if (product.isFailure()) {
      return res.status(product.value.statusCode).json({
        message: product.value.message,
        type: product.value.type,
        statusCode: product.value.statusCode,
      });
    }

    return res.status(200).json({ type: "OK", statusCode: 200, product: product.value });
  }
}

export { GetProductByIdController };
