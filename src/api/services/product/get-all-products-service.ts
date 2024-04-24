import { Product } from "@prisma/client";
import { ProductRepository } from "../../repositories/ProductRepository";

class GetAllProductsService {
  constructor(private productRepository: ProductRepository) {}

  public async execute(): Promise<Product[]> {
    const products = await this.productRepository.getAll();

    return products;
  }
}

export { GetAllProductsService };
