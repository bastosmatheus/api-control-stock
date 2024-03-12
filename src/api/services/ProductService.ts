import { z } from "zod";
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
    const products = await this.productRepository.getAll();

    return products;
  }

  public async getById(id: number): Promise<Either<UnprocessableEntity | NotFoundError, Product>> {
    const productSchema = z.object({
      id: z
        .number({
          required_error: "O ID é obrigatório",
          invalid_type_error: "O ID deve ser um número",
        })
        .min(1, { message: "O ID não pode ser menor que 1" }),
    });

    const productValidation = productSchema.safeParse({ id });

    if (productValidation.success === false) {
      const productError = productValidation.error.errors[0];

      return failure(new UnprocessableEntity(productError.message));
    }

    const product = await this.productRepository.getById(id);

    if (product === EProductResponse.ProductNotFound) {
      return failure(new NotFoundError("Nenhum produto foi encontrado com o ID: " + id));
    }

    return success(product);
  }

  public async create(
    name_product: string,
    price_product: number
  ): Promise<Either<UnprocessableEntity | ConflictError, Product>> {
    const productSchema = z.object({
      name_product: z
        .string({
          required_error: "Informe o nome do produto",
          invalid_type_error: "O nome do produto deve ser uma string",
        })
        .min(2, { message: "O nome do produto deve ter pelo menos 2 caracteres" }),
      price_product: z
        .number({
          required_error: "Informe o preço do produto",
          invalid_type_error: "O preço do produto deve ser um número",
        })
        .min(0.05, { message: "O preço do produto deve ser maior que 0.05" }),
    });

    const productValidation = productSchema.safeParse({ name_product, price_product });

    if (!productValidation.success) {
      const productError = productValidation.error.errors[0];

      return failure(new UnprocessableEntity(productError.message));
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
    const productSchema = z.object({
      id: z
        .number({
          required_error: "O ID é obrigatório",
          invalid_type_error: "O ID deve ser um número",
        })
        .min(1, { message: "O ID não pode ser menor que 1" }),
      name_product: z
        .string({
          required_error: "Informe o nome do produto",
          invalid_type_error: "O nome do produto deve ser uma string",
        })
        .min(2, { message: "O nome do produto deve ter pelo menos 2 caracteres" }),
      price_product: z
        .number({
          required_error: "Informe o preço do produto",
          invalid_type_error: "O preço do produto deve ser um número",
        })
        .min(0.05, { message: "O preço do produto deve ser maior que 0.05" }),
    });

    const productValidation = productSchema.safeParse({ id, name_product, price_product });

    if (!productValidation.success) {
      const productError = productValidation.error.issues[0];

      return failure(new UnprocessableEntity(productError.message));
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

  public async delete(id: number): Promise<Either<UnprocessableEntity | NotFoundError, Product>> {
    const productSchema = z.object({
      id: z
        .number({
          required_error: "O ID é obrigatório",
          invalid_type_error: "O ID deve ser um número",
        })
        .min(1, { message: "O ID não pode ser menor que 1" }),
    });

    const productValidation = productSchema.safeParse({ id });

    if (productValidation.success === false) {
      const productError = productValidation.error.errors[0];

      return failure(new UnprocessableEntity(productError.message));
    }

    const product = await this.productRepository.delete(id);

    if (product === EProductResponse.ProductNotFound) {
      return failure(new ConflictError("Nenhum produto foi encontrado com o ID: " + id));
    }

    return success(product);
  }
}

export { ProductService };
