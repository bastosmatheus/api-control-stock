import { z } from "zod";
import { Product } from "@prisma/client";
import { InfosToken } from "../../interfaces/InfosToken";
import { ConflictError } from "../../errors/ConflictError";
import { BadRequestError } from "../../errors/BadRequestError";
import { EProductResponse } from "../../interfaces/IProduct";
import { UnauthorizedError } from "../../errors/UnauthorizedError";
import { ProductRepository } from "../../repositories/ProductRepository";
import { Either, failure, success } from "../../errors/either";

class CreateProductService {
  constructor(private productRepository: ProductRepository) {}

  public async execute(
    name_product: string,
    price_product: number,
    id_store: number,
    infosToken: InfosToken
  ): Promise<Either<BadRequestError | UnauthorizedError | ConflictError, Product>> {
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
      id_store: z
        .number({
          required_error: "O ID da loja é obrigatório",
          invalid_type_error: "O ID da loja deve ser um número",
        })
        .min(1, { message: "O ID da loja não pode ser menor que 1" }),
    });

    const productValidation = productSchema.safeParse({
      name_product,
      price_product,
      id_store,
    });

    if (!productValidation.success) {
      const productError = productValidation.error.errors[0];

      return failure(new BadRequestError(productError.message));
    }

    const product = await this.productRepository.create(
      name_product,
      price_product,
      id_store,
      infosToken.id
    );

    if (product === EProductResponse.NotAuthorized) {
      return failure(
        new UnauthorizedError("Você não tem permissão para criar um produto nessa loja")
      );
    }

    if (product === EProductResponse.ProductExists) {
      return failure(new ConflictError("Já existe um produto com esse nome: " + name_product));
    }

    if (product === EProductResponse.StoreNotFound) {
      return failure(new ConflictError("Nenhuma loja foi encontrada com o ID: " + id_store));
    }

    return success(product);
  }
}

export { CreateProductService };
