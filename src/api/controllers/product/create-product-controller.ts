import { Request, Response } from "express";
import { ProductRepository } from "../../repositories/ProductRepository";
import { CreateProductService } from "../../services/product/create-product-service";
import { InfosToken } from "../../interfaces/InfosToken";

class CreateProductController {
  public async execute(req: Request, res: Response) {
    const { name_product, price_product, id_store } = req.body;
    const infosToken = req.infosToken as InfosToken;

    const productRepository = new ProductRepository();

    const createProductService = new CreateProductService(productRepository);

    const product = await createProductService.execute(
      name_product,
      price_product,
      id_store,
      infosToken
    );

    if (product.isFailure()) {
      return res.status(product.value.statusCode).json({
        message: product.value.message,
        type: product.value.type,
        statusCode: product.value.statusCode,
      });
    }

    return res.status(201).json({
      message: "Produto criado",
      type: "Created",
      statusCode: 201,
      product: product.value,
    });
  }
}

export { CreateProductController };
