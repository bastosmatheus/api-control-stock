import { Request, Response } from "express";
import { InfosToken } from "../../interfaces/InfosToken";
import { ProductRepository } from "../../repositories/ProductRepository";
import { DeleteProductService } from "../../services/product/delete-product-service";

class DeleteProductController {
  public async execute(req: Request, res: Response) {
    const { id } = req.params;
    const infosToken = req.infosToken as InfosToken;

    const productRepository = new ProductRepository();

    const deleteProductService = new DeleteProductService(productRepository);

    const product = await deleteProductService.execute(Number(id), infosToken);

    if (product.isFailure()) {
      return res.status(product.value.statusCode).json({
        message: product.value.message,
        type: product.value.type,
        statusCode: product.value.statusCode,
      });
    }

    return res.status(200).json({
      message: "Produto deletado",
      type: "OK",
      statusCode: 200,
      product: product.value,
    });
  }
}

export { DeleteProductController };
