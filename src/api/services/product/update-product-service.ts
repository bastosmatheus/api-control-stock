import { z } from "zod";
import { Product } from "@prisma/client";
import { InfosToken } from "../../interfaces/InfosToken";
import { ConflictError } from "../../errors/ConflictError";
import { NotFoundError } from "../../errors/NotFoundError";
import { BadRequestError } from "../../errors/BadRequestError";
import { EProductResponse } from "../../interfaces/IProduct";
import { UnauthorizedError } from "../../errors/UnauthorizedError";
import { ProductRepository } from "../../repositories/ProductRepository";
import { Either, failure, success } from "../../errors/either";

class UpdateProductService {
  constructor(private productRepository: ProductRepository) {}

  public async execute(
    id: number,
    name_product: string,
    price_product: number,
    infosToken: InfosToken
  ): Promise<Either<BadRequestError | NotFoundError | ConflictError | UnauthorizedError, Product>> {
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

      return failure(new BadRequestError(productError.message));
    }

    const product = await this.productRepository.update(
      id,
      name_product,
      price_product,
      infosToken.id
    );

    if (product === EProductResponse.NotAuthorized) {
      return failure(
        new UnauthorizedError("Você não tem permissão para atualizar um produto dessa loja")
      );
    }

    if (product === EProductResponse.ProductExists) {
      return failure(new ConflictError("Já existe um produto com esse nome: " + name_product));
    }

    if (product === EProductResponse.ProductNotFound) {
      return failure(new NotFoundError("Nenhum produto foi encontrado com o ID: " + id));
    }

    return success(product);
  }
}

export { UpdateProductService };
