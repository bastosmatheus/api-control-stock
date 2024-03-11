import { Product } from "@prisma/client";
import { NotFoundError } from "../errors/NotFoundError";
import { ConflictError } from "../errors/ConflictError";
import { EProductResponse } from "../interfaces/IProduct";
import { ProductRepository } from "../repositories/ProductRepository";
import { UnprocessableEntity } from "../errors/UnprocessableEntity";
import { Either, failure, success } from "../errors/either";

class ProductService {
  public readonly productRepository = new ProductRepository();

  public async getAll() {
    const users = await this.productRepository.getAll();

    return users;
  }

  public async getById(id: number): Promise<Either<NotFoundError, Product>> {
    const user = await this.productRepository.getById(id);

    if (user === EProductResponse.ProductNotFound) {
      return failure(new NotFoundError("Nenhum produto foi encontrado com o ID: " + id));
    }

    return success(user);
  }

  public async create(
    name_product: string,
    price_product: number
  ): Promise<Either<UnprocessableEntity | ConflictError, Product>> {
    if (!name_product || name_product === "") {
      return failure(new UnprocessableEntity("Nome do produto é obrigatório"));
    }

    if (!price_product) {
      return failure(new UnprocessableEntity("Preço do produto é obrigatório"));
    }

    const product = await this.productRepository.create(name_product, price_product);

    if (product === EProductResponse.ProductExists) {
      return failure(new ConflictError("Já existe um produto com esse nome: " + name_product));
    }

    return success(product);
  }

  public async update(
    id: number,
    name_product: string,
    price_product: number
  ): Promise<Either<NotFoundError | ConflictError, Product>> {
    if (!name_product || name_product === "") {
      return failure(new UnprocessableEntity("Nome do produto é obrigatório"));
    }

    if (!price_product) {
      return failure(new UnprocessableEntity("Preço do produto é obrigatório"));
    }

    const product = await this.productRepository.update(id, name_product, price_product);

    if (product === EProductResponse.ProductExists) {
      return failure(new ConflictError("Já existe um produto com esse nome: " + name_product));
    }

    if (product === EProductResponse.ProductNotFound) {
      return failure(new ConflictError("Nenhum produto foi encontrado com o ID: " + id));
    }

    return success(product);
  }

  public async delete(id: number): Promise<Either<NotFoundError, Product>> {
    const product = await this.productRepository.delete(id);

    if (product === EProductResponse.ProductNotFound) {
      return failure(new ConflictError("Nenhum produto foi encontrado com o ID: " + id));
    }

    return success(product);
  }
}

export { ProductService };
