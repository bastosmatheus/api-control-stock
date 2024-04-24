import { Request, Response } from "express";
import { InfosToken } from "../../interfaces/InfosToken";
import { ProductRepository } from "../../repositories/ProductRepository";
import { UpdateProductService } from "../../services/product/update-product-service";

class UpdateProductController {
  public async execute(req: Request, res: Response) {
    const { name_product, price_product } = req.body;
    const { id } = req.params;
    const infosToken = req.infosToken as InfosToken;

    const productRepository = new ProductRepository();

    const updateProductService = new UpdateProductService(productRepository);

    const product = await updateProductService.execute(
      Number(id),
      name_product,
      price_product,
      infosToken
    );

    if (product.isFailure()) {
      return res.status(product.value.statusCode).json({
        message: product.value.message,
        type: product.value.type,
        statusCode: product.value.statusCode,
      });
    }

    return res.status(200).json({
      message: "Produto atualizado",
      type: "OK",
      statusCode: 200,
      product: product.value,
    });
  }
}

export { UpdateProductController };
