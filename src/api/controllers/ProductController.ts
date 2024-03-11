import { Request, Response } from "express";
import { ProductService } from "../services/ProductService";

class ProductController {
  public async getAllProducts(req: Request, res: Response) {
    const productService = new ProductService();

    const products = await productService.getAll();

    return res.status(200).json({ type: "OK", statusCode: 200, products });
  }

  public async getProductById(req: Request, res: Response) {
    const { id } = req.params;

    const productService = new ProductService();

    const product = await productService.getById(Number(id));

    if (product.isFailure()) {
      return res.status(product.value.statusCode).json({
        message: product.value.message,
        type: product.value.type,
        statusCode: product.value.statusCode,
      });
    }

    return res.status(200).json({ type: "OK", statusCode: 200, product: product.value });
  }

  public async createProduct(req: Request, res: Response) {
    const { name_product, price_product } = req.body;

    const productService = new ProductService();

    const product = await productService.create(name_product, price_product);

    if (product.isFailure()) {
      return res.status(product.value.statusCode).json(product.value);
    }

    return res.status(200).json({
      message: "Produto criado com sucesso",
      type: "OK",
      statusCode: 200,
      productCreated: product.value,
    });
  }

  public async updateProduct(req: Request, res: Response) {
    const { id } = req.params;

    const { name_product, price_product } = req.body;

    const productService = new ProductService();

    const product = await productService.update(Number(id), name_product, price_product);

    if (product.isFailure()) {
      return res.status(product.value.statusCode).json(product.value);
    }

    return res.status(200).json({
      message: "Produto atualizado com sucesso",
      type: "OK",
      statusCode: 200,
      productUpdated: product.value,
    });
  }

  public async deleteProduct(req: Request, res: Response) {
    const { id } = req.params;

    const productService = new ProductService();

    const product = await productService.delete(Number(id));

    if (product.isFailure()) {
      return res.status(product.value.statusCode).json(product.value);
    }

    return res.status(200).json({
      message: "Produto excluido com sucesso",
      type: "OK",
      statusCode: 200,
      productDeleted: product.value,
    });
  }
}

export default new ProductController();
