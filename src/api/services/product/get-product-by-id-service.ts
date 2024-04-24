import { z } from "zod";
import { Product } from "@prisma/client";
import { NotFoundError } from "../../errors/NotFoundError";
import { BadRequestError } from "../../errors/BadRequestError";
import { EProductResponse } from "../../interfaces/IProduct";
import { ProductRepository } from "../../repositories/ProductRepository";
import { Either, failure, success } from "../../errors/either";

class GetProductByIdService {
  constructor(private productRepository: ProductRepository) {}

  public async execute(id: number): Promise<Either<BadRequestError | NotFoundError, Product>> {
    const productSchema = z.object({
      id: z
        .number({
          required_error: "O ID é obrigatório",
          invalid_type_error: "O ID deve ser um número",
        })
        .min(1, { message: "O ID não pode ser menor que 1" }),
    });

    const productValidation = productSchema.safeParse({ id });

    if (!productValidation.success) {
      const productError = productValidation.error.errors[0];

      return failure(new BadRequestError(productError.message));
    }

    const product = await this.productRepository.getById(id);

    if (product === EProductResponse.ProductNotFound) {
      return failure(new NotFoundError("Nenhum produto foi encontrado com o ID: " + id));
    }

    return success(product);
  }
}

export { GetProductByIdService };
