import { z } from "zod";
import { NotFoundError } from "../../errors/NotFoundError";
import { BadRequestError } from "../../errors/BadRequestError";
import { DefectiveProduct } from "@prisma/client";
import { Either, failure, success } from "../../errors/either";
import { EDefectiveProductResponse } from "../../interfaces/IDefectiveProduct";
import { DefectiveProductRepository } from "../../repositories/DefectiveProductRepository";

class GetDefectiveProductByIdService {
  constructor(private defectiveProductRepository: DefectiveProductRepository) {}

  public async execute(
    id: number
  ): Promise<Either<BadRequestError | NotFoundError, DefectiveProduct>> {
    const defectiveProductsSchema = z.object({
      id: z
        .number({
          required_error: "O ID é obrigatório",
          invalid_type_error: "O ID deve ser um número",
        })
        .min(1, { message: "O ID não pode ser menor que 1" }),
    });

    const defectiveProductsValidation = defectiveProductsSchema.safeParse({
      id,
    });

    if (!defectiveProductsValidation.success) {
      const defectiveProductsError = defectiveProductsValidation.error.errors[0];

      return failure(new BadRequestError(defectiveProductsError.message));
    }

    const defectiveProduct = await this.defectiveProductRepository.getById(id);

    if (defectiveProduct === EDefectiveProductResponse.DefectiveProductNotFound) {
      return failure(new NotFoundError("Nenhum produto defeituoso foi encontrado com o ID: " + id));
    }

    return success(defectiveProduct);
  }
}

export { GetDefectiveProductByIdService };
